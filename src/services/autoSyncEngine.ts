import { getAccessToken, googleSignIn, initAuth } from './googleAuth';
import {
  appendApprenticeToSheet,
  appendBatchToSheet,
  ApprenticeSyncData,
  createInductionSpreadsheet,
} from './googleSheetsService';

export type SyncState = 'idle' | 'syncing' | 'synced' | 'pending_auth' | 'error';

export interface AutoSyncStatus {
  state: SyncState;
  sheetId: string | null;
  sheetName: string | null;
  sheetUrl: string | null;
  lastSyncTime: string | null;
  syncedCount: number;
  message: string;
}

const STORAGE_KEY_SHEET = 'sena_google_sheet_info';
const STORAGE_KEY_QUEUE = 'sena_sync_queue';
const STORAGE_KEY_SYNCED_HASH = 'sena_synced_hashes';

class AutoSyncManager {
  private status: AutoSyncStatus = {
    state: 'idle',
    sheetId: null,
    sheetName: null,
    sheetUrl: null,
    lastSyncTime: null,
    syncedCount: 0,
    message: 'Sistema de sincronización automática listo.',
  };

  private listeners: ((status: AutoSyncStatus) => void)[] = [];
  private isProcessingQueue = false;

  constructor() {
    this.loadPersistedSheet();
    this.initAuthListener();
  }

  private loadPersistedSheet() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHEET);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.status.sheetId = parsed.id || null;
        this.status.sheetName = parsed.name || null;
        this.status.sheetUrl = parsed.url || null;
      }
      const hashes = this.getSyncedHashes();
      this.status.syncedCount = hashes.length;
    } catch (e) {
      console.warn('Error loading persisted sheet info', e);
    }
  }

  private initAuthListener() {
    initAuth(
      async (_user, _token) => {
        // As soon as auth is ready, flush any queued records automatically
        this.status.state = 'idle';
        this.status.message = 'Conectado a Google Drive.';
        this.notify();
        this.flushQueue();
      },
      () => {
        const queue = this.getQueue();
        if (queue.length > 0) {
          this.status.state = 'pending_auth';
          this.status.message = `${queue.length} registro(s) pendiente(s) de sincronizar a Drive.`;
          this.notify();
        }
      }
    );
  }

  public getStatus(): AutoSyncStatus {
    return { ...this.status };
  }

  public subscribe(listener: (status: AutoSyncStatus) => void): () => void {
    this.listeners.push(listener);
    listener(this.getStatus());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const current = this.getStatus();
    this.listeners.forEach((listener) => {
      try {
        listener(current);
      } catch (e) {
        console.error('Error in sync listener', e);
      }
    });
  }

  private getQueue(): ApprenticeSyncData[] {
    try {
      const q = localStorage.getItem(STORAGE_KEY_QUEUE);
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: ApprenticeSyncData[]) {
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
  }

  private getSyncedHashes(): string[] {
    try {
      const h = localStorage.getItem(STORAGE_KEY_SYNCED_HASH);
      return h ? JSON.parse(h) : [];
    } catch {
      return [];
    }
  }

  private markAsSynced(record: ApprenticeSyncData) {
    const hash = `${record.documentNumber}_${record.verificationCode}`;
    const hashes = this.getSyncedHashes();
    if (!hashes.includes(hash)) {
      hashes.push(hash);
      localStorage.setItem(STORAGE_KEY_SYNCED_HASH, JSON.stringify(hashes));
      this.status.syncedCount = hashes.length;
    }
  }

  public isRecordSynced(record: ApprenticeSyncData): boolean {
    const hash = `${record.documentNumber}_${record.verificationCode}`;
    return this.getSyncedHashes().includes(hash);
  }

  /**
   * Ensures an active induction spreadsheet exists in Drive.
   * If not present, creates it automatically in background.
   */
  public async ensureSpreadsheet(
    token: string,
    ficha: string = '2874912'
  ): Promise<{ id: string; url: string; name: string }> {
    if (this.status.sheetId && this.status.sheetUrl) {
      return {
        id: this.status.sheetId,
        url: this.status.sheetUrl,
        name: this.status.sheetName || `SENA Inducción - Ficha ${ficha}`,
      };
    }

    const title = `SENA Inducción - Registro Automatizado Ficha ${ficha}`;
    const created = await createInductionSpreadsheet(token, title);
    const info = {
      id: created.spreadsheetId,
      url: created.spreadsheetUrl,
      name: title,
    };

    this.status.sheetId = info.id;
    this.status.sheetUrl = info.url;
    this.status.sheetName = info.name;
    localStorage.setItem(STORAGE_KEY_SHEET, JSON.stringify(info));
    this.notify();

    return info;
  }

  /**
   * Automatically synchronizes an apprentice record in background.
   * No user buttons or modals needed.
   */
  public async autoSyncLearner(
    record: ApprenticeSyncData,
    options?: { silent?: boolean }
  ): Promise<boolean> {
    if (this.isRecordSynced(record)) {
      this.status.state = 'synced';
      this.status.message = 'Registro de aprendiz ya sincronizado previamente en Google Drive.';
      this.notify();
      return true;
    }

    // Add to queue first for safety
    const queue = this.getQueue();
    const alreadyQueued = queue.some(
      (q) => q.documentNumber === record.documentNumber && q.verificationCode === record.verificationCode
    );
    if (!alreadyQueued) {
      queue.push(record);
      this.saveQueue(queue);
    }

    return this.flushQueue(options?.silent);
  }

  /**
   * Processes the pending sync queue in the background.
   */
  public async flushQueue(silent = false): Promise<boolean> {
    if (this.isProcessingQueue) return false;

    const queue = this.getQueue();
    if (queue.length === 0) {
      return true;
    }

    try {
      this.isProcessingQueue = true;
      if (!silent) {
        this.status.state = 'syncing';
        this.status.message = `Sincronizando automáticamente ${queue.length} aprendiz(ces) a Google Drive...`;
        this.notify();
      }

      let token = await getAccessToken();
      if (!token) {
        // Check if user is currently signed in; if not, we wait for auth
        this.status.state = 'pending_auth';
        this.status.message = `${queue.length} aprendiz(ces) listo(s) para autoguardar. Inicia sesión con Google una sola vez.`;
        this.notify();
        return false;
      }

      // Ensure target Google Sheet exists
      const sheet = await this.ensureSpreadsheet(token, queue[0].fichaNumber || '2874912');

      // Append all queued records in batch
      await appendBatchToSheet(token, sheet.id, queue);

      // Mark all as synced
      queue.forEach((rec) => this.markAsSynced(rec));
      this.saveQueue([]); // clear queue

      this.status.state = 'synced';
      this.status.lastSyncTime = new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      this.status.message = `¡Autoguardado exitoso en Google Sheets! (${queue.length} nuevo(s) registrado(s))`;
      this.notify();

      return true;
    } catch (err: any) {
      console.error('Auto-sync queue error:', err);
      this.status.state = 'error';
      this.status.message = err.message || 'Error durante el autoguardado en Google Drive. Se reintentará automáticamente.';
      this.notify();
      return false;
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * One-click Google activation if not yet connected
   */
  public async activateOneClickSync(): Promise<boolean> {
    try {
      this.status.state = 'syncing';
      this.status.message = 'Vinculando Google Drive en un clic...';
      this.notify();

      const res = await googleSignIn();
      if (!res) return false;

      // Ensure sheet is created immediately
      await this.ensureSpreadsheet(res.accessToken);
      await this.flushQueue();
      return true;
    } catch (err: any) {
      this.status.state = 'error';
      this.status.message = err.message || 'No se pudo activar la sincronización automática.';
      this.notify();
      return false;
    }
  }
}

export const autoSyncEngine = new AutoSyncManager();
