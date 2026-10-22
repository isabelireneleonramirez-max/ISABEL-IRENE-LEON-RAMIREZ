import React, { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  AlertCircle,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  FolderCheck,
  LogIn,
  LogOut,
  PlusCircle,
  QrCode,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { googleSignIn, initAuth, logout } from '../services/googleAuth';
import {
  appendBatchToSheet,
  ApprenticeSyncData,
  createInductionSpreadsheet,
  GoogleDriveSheet,
  listDriveSpreadsheets,
  readApprenticesFromSheet,
} from '../services/googleSheetsService';
import { autoSyncEngine, AutoSyncStatus } from '../services/autoSyncEngine';
import { ApprenticeProfile } from '../data/senaRegulationData';
import { ArchitectureDiagramModal } from './ArchitectureDiagramModal';

interface LearnerRecord {
  id: string;
  name: string;
  document: string;
  ficha: string;
  program: string;
  score: number;
  status: 'Aprobado' | 'En Proceso' | 'Pendiente';
  completionDate: string;
  verificationCode: string;
}

const INITIAL_ROSTER: LearnerRecord[] = [
  {
    id: 'l1',
    name: 'Juan Esteban Ramírez Gómez',
    document: 'CC 1.020.304.050',
    ficha: '2874912',
    program: 'Tecnólogo en Análisis y Desarrollo de Software',
    score: 90,
    status: 'Aprobado',
    completionDate: '2024-10-18',
    verificationCode: 'SENA-IND-2024-A821F',
  },
  {
    id: 'l2',
    name: 'Valentina Restrepo Duque',
    document: 'TI 1.098.441.203',
    ficha: '2874912',
    program: 'Tecnólogo en Análisis y Desarrollo de Software',
    score: 100,
    status: 'Aprobado',
    completionDate: '2024-10-18',
    verificationCode: 'SENA-IND-2024-C942B',
  },
  {
    id: 'l3',
    name: 'Carlos Andrés Morales',
    document: 'CC 1.152.883.910',
    ficha: '2874912',
    program: 'Tecnólogo en Análisis y Desarrollo de Software',
    score: 70,
    status: 'En Proceso',
    completionDate: '2024-10-19',
    verificationCode: '---',
  },
  {
    id: 'l4',
    name: 'Daniela Salazar Henao',
    document: 'CC 1.037.912.445',
    ficha: '2874912',
    program: 'Tecnólogo en Análisis y Desarrollo de Software',
    score: 90,
    status: 'Aprobado',
    completionDate: '2024-10-19',
    verificationCode: 'SENA-IND-2024-E102K',
  },
  {
    id: 'l5',
    name: 'Mateo Cárdenas Gil',
    document: 'CC 1.017.652.890',
    ficha: '2874912',
    program: 'Tecnólogo en Análisis y Desarrollo de Software',
    score: 80,
    status: 'Aprobado',
    completionDate: '2024-10-20',
    verificationCode: 'SENA-IND-2024-M553D',
  },
  {
    id: 'l6',
    name: 'Laura Sofía Castro Pérez',
    document: 'TI 1.128.904.312',
    ficha: '2874912',
    program: 'Tecnólogo en Análisis y Desarrollo de Software',
    score: 0,
    status: 'Pendiente',
    completionDate: '---',
    verificationCode: '---',
  },
];

interface CoordinatorDashboardProps {
  currentApprentice?: ApprenticeProfile;
  onSwitchToApprenticeView?: () => void;
  onOpenShareModal?: () => void;
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({
  currentApprentice,
  onSwitchToApprenticeView,
  onOpenShareModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'sheet' | 'roster' | 'iframe'>('sheet');
  const [copiedApprenticeLink, setCopiedApprenticeLink] = useState(false);
  const [roster, setRoster] = useState<LearnerRecord[]>(() => {
    // If the active learner has passed quiz or is available, include in roster if not already present
    if (currentApprentice && currentApprentice.fullName) {
      const exists = INITIAL_ROSTER.some(
        (r) => r.document.includes(currentApprentice.documentNumber)
      );
      if (!exists && currentApprentice.score !== undefined) {
        return [
          {
            id: 'current-user',
            name: currentApprentice.fullName,
            document: `${currentApprentice.documentType} ${currentApprentice.documentNumber}`,
            ficha: currentApprentice.fichaNumber || '2874912',
            program: currentApprentice.programName || 'Tecnólogo en ADSO',
            score: currentApprentice.score,
            status: currentApprentice.score >= 80 ? 'Aprobado' : 'En Proceso',
            completionDate:
              currentApprentice.inductionCompletedAt ||
              new Date().toISOString().slice(0, 10),
            verificationCode: currentApprentice.verificationCode || '---',
          },
          ...INITIAL_ROSTER,
        ];
      }
    }
    return INITIAL_ROSTER;
  });

  // Google OAuth & Sheets State
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Google Spreadsheet state
  const [activeSheet, setActiveSheet] = useState<{
    id: string;
    name: string;
    url: string;
  } | null>(() => {
    const saved = localStorage.getItem('sena_google_sheet_info');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetchingFromDrive, setIsFetchingFromDrive] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Confirmation Modal state for destructive/modifying operations (MANDATORY per Workspace guidelines)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [recordsToSyncCount, setRecordsToSyncCount] = useState(0);

  // Drive Spreadsheet picker
  const [showDrivePicker, setShowDrivePicker] = useState(false);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveSheet[]>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState(false);
  const [showArchitectureDiagram, setShowArchitectureDiagram] = useState(false);

  const [autoSyncStatus, setAutoSyncStatus] = useState<AutoSyncStatus>(
    autoSyncEngine.getStatus()
  );

  useEffect(() => {
    // Listen to Firebase auth state
    const unsubscribeAuth = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );

    // Subscribe to autoSyncEngine
    const unsubscribeSync = autoSyncEngine.subscribe((st) => {
      setAutoSyncStatus(st);
      if (st.sheetId && st.sheetUrl) {
        setActiveSheet({
          id: st.sheetId,
          name: st.sheetName || 'SENA Inducción - Ficha 2874912',
          url: st.sheetUrl,
        });
      }
    });

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
      if (typeof unsubscribeSync === 'function') unsubscribeSync();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setSyncFeedback(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        setSyncFeedback({
          type: 'success',
          message: `Conectado exitosamente con ${res.user.email}`,
        });
      }
    } catch (err: any) {
      console.error('Error in Google Sign In:', err);
      setSyncFeedback({
        type: 'error',
        message:
          err.message || 'No se pudo completar el inicio de sesión con Google.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setGoogleUser(null);
    setAccessToken(null);
    setSyncFeedback(null);
  };

  const handleCreateNewSheet = async () => {
    if (!accessToken) {
      setSyncFeedback({
        type: 'error',
        message: 'Debes iniciar sesión con Google para crear la hoja de cálculo.',
      });
      return;
    }

    setIsCreatingSheet(true);
    setSyncFeedback(null);
    try {
      const title = `SENA Inducción - Ficha 2874912 (${new Date().toLocaleDateString('es-CO')})`;
      const result = await createInductionSpreadsheet(accessToken, title);
      const newSheetInfo = {
        id: result.spreadsheetId,
        name: title,
        url: result.spreadsheetUrl,
      };
      setActiveSheet(newSheetInfo);
      localStorage.setItem('sena_google_sheet_info', JSON.stringify(newSheetInfo));
      setSyncFeedback({
        type: 'success',
        message: '¡Hoja de cálculo creada exitosamente en tu Google Drive!',
      });
    } catch (err: any) {
      console.error('Error creating spreadsheet:', err);
      setSyncFeedback({
        type: 'error',
        message:
          err.message || 'Error al crear la hoja de cálculo en Google Drive.',
      });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleOpenDrivePicker = async () => {
    if (!accessToken) return;
    setIsLoadingDriveFiles(true);
    setShowDrivePicker(true);
    try {
      const files = await listDriveSpreadsheets(accessToken);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error listing drive sheets:', err);
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  const handleSelectDriveFile = (file: GoogleDriveSheet) => {
    const selected = {
      id: file.id,
      name: file.name,
      url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
    };
    setActiveSheet(selected);
    localStorage.setItem('sena_google_sheet_info', JSON.stringify(selected));
    setShowDrivePicker(false);
    setSyncFeedback({
      type: 'success',
      message: `Hoja vinculada: "${file.name}"`,
    });
  };

  // Pre-sync validation and showing the mandatory confirmation dialog
  const handleInitiateSync = () => {
    if (!accessToken) {
      setSyncFeedback({
        type: 'error',
        message: 'Inicia sesión con Google para sincronizar los aprendices.',
      });
      return;
    }
    if (!activeSheet) {
      setSyncFeedback({
        type: 'error',
        message: 'Crea o selecciona una hoja de cálculo en Google Drive primero.',
      });
      return;
    }

    setRecordsToSyncCount(roster.length);
    setShowConfirmModal(true);
  };

  // Perform actual write operation after user confirmation
  const handleConfirmSync = async () => {
    setShowConfirmModal(false);
    if (!accessToken || !activeSheet) return;

    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const recordsToSync: ApprenticeSyncData[] = roster.map((r) => {
        const docParts = r.document.split(' ');
        const docType = docParts[0] || 'CC';
        const docNum = docParts.slice(1).join(' ') || r.document;

        return {
          registeredAt: new Date().toLocaleString('es-CO'),
          fullName: r.name,
          documentType: docType,
          documentNumber: docNum,
          fichaNumber: r.ficha,
          programName: r.program,
          regional: currentApprentice?.regional || 'Regional Distrito Capital',
          centroFormacion:
            currentApprentice?.centroFormacion ||
            'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
          modalidad: currentApprentice?.modalidad || 'Presencial',
          score: r.score,
          status: r.status,
          verificationCode: r.verificationCode,
          registeredByEmail: googleUser?.email || 'Coordinación SENA',
        };
      });

      const count = await appendBatchToSheet(
        accessToken,
        activeSheet.id,
        recordsToSync
      );

      setSyncFeedback({
        type: 'success',
        message: `¡Se han guardado exitosamente ${count} registros de aprendices en Google Sheets!`,
      });
    } catch (err: any) {
      console.error('Error syncing records:', err);
      setSyncFeedback({
        type: 'error',
        message:
          err.message || 'Error al guardar los registros en Google Sheets.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFetchFromSheet = async () => {
    if (!accessToken || !activeSheet) return;

    setIsFetchingFromDrive(true);
    setSyncFeedback(null);
    try {
      const remoteData = await readApprenticesFromSheet(accessToken, activeSheet.id);
      if (remoteData.length > 0) {
        // Merge or replace
        const newLearners: LearnerRecord[] = remoteData.map((rd, idx) => ({
          id: `remote-${idx}`,
          name: rd.fullName,
          document: `${rd.documentType} ${rd.documentNumber}`,
          ficha: rd.fichaNumber,
          program: rd.programName,
          score: rd.score,
          status: rd.status,
          completionDate: rd.registeredAt,
          verificationCode: rd.verificationCode,
        }));
        setRoster(newLearners);
        setSyncFeedback({
          type: 'success',
          message: `Se cargaron ${newLearners.length} aprendices directamente desde la hoja de Google Drive.`,
        });
      } else {
        setSyncFeedback({
          type: 'error',
          message: 'La hoja de cálculo seleccionada aún no contiene registros de aprendices.',
        });
      }
    } catch (err: any) {
      console.error('Error reading from sheet:', err);
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Error al leer datos desde la hoja de cálculo.',
      });
    } finally {
      setIsFetchingFromDrive(false);
    }
  };

  const filteredRoster = roster.filter((r) => {
    const matchesStatus = statusFilter === 'todos' || r.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(term) ||
      r.document.toLowerCase().includes(term) ||
      r.verificationCode.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Nombre,Documento,Ficha,Puntaje,Estado,Fecha,Codigo\n';
    const rows = roster
      .map(
        (r) =>
          `"${r.id}","${r.name}","${r.document}","${r.ficha}",${r.score},"${r.status}","${r.completionDate}","${r.verificationCode}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `SENA_Induccion_Ficha_2874912_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#39A900] font-semibold mb-1">
            <span>Coordinación Académica & Misional</span>
            <span aria-hidden="true">·</span>
            <span>Seguimiento de Cohorte</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tablero de Control del Instructor y Coordinación
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Métricas de avance en el Reglamento del Aprendiz (Acuerdo 009 de 2024 · Art. 48 modificado por Acuerdo 002 de 2026).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="px-4 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              title="Obtener enlace institucional para compartir con los aprendices"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir con Aprendices</span>
            </button>
          )}

          <button
            onClick={() => setShowArchitectureDiagram(true)}
            className="px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
            title="Ver diagrama del sistema y arquitectura de sincronización automática"
          >
            <Zap className="w-4 h-4 text-[#39A900]" />
            <span>Diagrama del Sistema</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Descargar CSV</span>
          </button>
        </div>
      </div>

      {/* Student Link Distribution Banner */}
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/30 rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
                <span>Enlace Oficial para la Cohorte de Aprendices</span>
              </span>
              <span className="text-xs text-slate-400">· Privilegios Restringidos</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Difusión a los Aprendices: Inducción Autónoma y Registro Automático
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Comparte este enlace exclusivo con tu cohorte para que realicen la inducción. Los aprendices tienen acceso únicamente al contenido pedagógico, casos de estudio, evaluación y su certificado personal. Sus notas se sincronizan <strong>automáticamente en tu Google Sheets</strong>, pero ellos <strong>no podrán ver este panel, ni tu Google Drive, ni las notas de otros aprendices</strong>.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?role=aprendiz`;
                navigator.clipboard.writeText(url);
                setCopiedApprenticeLink(true);
                setTimeout(() => setCopiedApprenticeLink(false), 2500);
              }}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#00324D] hover:bg-[#002538] dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copiedApprenticeLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Enlace Aprendices</span>
                </>
              )}
            </button>

            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Ver código QR para proyectar o enviar por WhatsApp"
              >
                <QrCode className="w-4 h-4 text-[#39A900]" />
                <span>QR y Opciones</span>
              </button>
            )}

            {onSwitchToApprenticeView && (
              <button
                onClick={onSwitchToApprenticeView}
                className="px-3.5 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Probar la experiencia visual del aprendiz"
              >
                <Users className="w-4 h-4 text-[#39A900]" />
                <span>Ver como Aprendiz</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Google Drive & Google Sheets Integration Card */}
      <div className="bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border-2 border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-100 dark:border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 p-2 border border-emerald-200 dark:border-emerald-700/50 shadow-xs flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-7 h-7 text-[#39A900]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  Almacenamiento en Google Drive
                </span>
                {googleUser && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-700/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] animate-pulse" />
                    Conectado: {googleUser.email}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Base de Datos de Aprendices en Google Sheets
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl mt-0.5">
                Almacena, actualiza y consulta automáticamente los datos de los aprendices que completan la inducción en una hoja de cálculo oficial alojada en tu Google Drive institucional o personal.
              </p>
            </div>
          </div>

          {/* Google Sign In / Account status */}
          <div className="shrink-0">
            {!googleUser ? (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>{isLoggingIn ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGoogleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feedback message banner */}
        {syncFeedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center justify-between gap-3 ${
              syncFeedback.type === 'success'
                ? 'bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-100/80 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span>{syncFeedback.message}</span>
            </div>
            <button
              onClick={() => setSyncFeedback(null)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Spreadsheet & Controls */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active sheet card */}
          <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Hoja de Cálculo Activa en Google Drive
              </span>
              {activeSheet ? (
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {activeSheet.name}
                    </span>
                    <a
                      href={activeSheet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                      title="Abrir en Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Abrir en Drive</span>
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    ID: {activeSheet.id}
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  No hay una hoja de cálculo vinculada actualmente. Crea una nueva o selecciona una existente en tu Google Drive.
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={handleCreateNewSheet}
                disabled={!googleUser || isCreatingSheet}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isCreatingSheet ? 'Creando en Drive...' : 'Crear Nueva Hoja'}</span>
              </button>

              <button
                onClick={handleOpenDrivePicker}
                disabled={!googleUser || isLoadingDriveFiles}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <FolderCheck className="w-3.5 h-3.5" />
                <span>Seleccionar de Drive</span>
              </button>
            </div>
          </div>

          {/* Auto-Pilot Sync Status Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#39A900]" />
                  <span>Piloto Automático Activo</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
              </div>

              <div className="mt-2 space-y-1">
                <div className="text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900]" />
                  <span>{autoSyncStatus.message}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Todo aprendiz que completa la inducción o actualiza sus datos queda registrado automáticamente en Google Sheets sin clics manuales.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <button
                onClick={handleInitiateSync}
                disabled={!googleUser || !activeSheet || isSyncing}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                title="Sincronizar toda la cohorte manualmente"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>{isSyncing ? 'Sincronizando...' : 'Autoguardar Cohorte'}</span>
              </button>

              <button
                onClick={handleFetchFromSheet}
                disabled={!googleUser || !activeSheet || isFetchingFromDrive}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40"
                title="Cargar registros existentes desde Google Sheets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingFromDrive ? 'animate-spin' : ''}`} />
                <span>Cargar de Drive</span>
              </button>

              {activeSheet && (
                <a
                  href={activeSheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Hoja</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cohort KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Aprendices</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {roster.length}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            Ficha 2874912 · ADSO
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tasa de Aprobación</span>
            <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {Math.round(
              (roster.filter((r) => r.status === 'Aprobado').length / roster.length) * 100
            )}
            %
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {roster.filter((r) => r.status === 'Aprobado').length} de {roster.length} certificados
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Promedio Reglamento</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {Math.round(
              roster.reduce((acc, curr) => acc + curr.score, 0) /
                roster.filter((r) => r.score > 0).length || 0
            )}
            %
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Examen Integral Acuerdo 009
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sincronización Drive</span>
            <Database className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-2 truncate">
            {activeSheet ? 'Vinculada' : 'No Vinculada'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {googleUser ? 'Autenticado' : 'Sesión pendiente'}
          </div>
        </div>
      </div>

      {/* Roster & Google Sheets Viewer Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {viewMode === 'sheet'
                  ? 'Estructura de la Hoja de Cálculo en Google Drive'
                  : viewMode === 'iframe'
                  ? 'Vista en Vivo desde Google Sheets'
                  : 'Listado de Aprendices y Estado de Inducción'}
              </h3>
              {viewMode === 'sheet' && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md uppercase">
                  13 Columnas
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ficha 2874912 · {activeSheet ? activeSheet.name : 'Hoja Oficial de Inducción SENA'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('sheet')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'sheet'
                    ? 'bg-white dark:bg-slate-700 text-[#39A900] dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Hoja de Cálculo</span>
              </button>
              <button
                onClick={() => setViewMode('roster')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'roster'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Resumen</span>
              </button>
              {activeSheet && (
                <button
                  onClick={() => setViewMode('iframe')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'iframe'
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Embebido Drive</span>
                </button>
              )}
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar aprendiz..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#39A900] placeholder:text-slate-400"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {['todos', 'Aprobado', 'En Proceso', 'Pendiente'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === st
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode 1: Authentic Google Sheets 13-Column Grid */}
        {viewMode === 'sheet' && (
          <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs">
            {/* Sheet Sub-Header Toolbar */}
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#39A900] dark:text-emerald-400 font-mono">
                  Aprendices_Induccion
                </span>
                <span className="text-slate-400" aria-hidden="true">|</span>
                <span>Rango: A1:M{filteredRoster.length + 1}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{filteredRoster.length} filas de datos</span>
                {activeSheet && (
                  <a
                    href={activeSheet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Abrir en Google Sheets</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Spreadsheet Table with Column Letters and Row Numbers */}
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-[11px] border-collapse whitespace-nowrap">
                <thead>
                  {/* Google Sheets Column Letters (A through M) */}
                  <tr className="bg-slate-200 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 font-mono text-[10px] select-none">
                    <th className="w-10 px-2 py-1 text-center border-r border-b border-slate-300 dark:border-slate-700 bg-slate-300/60 dark:bg-slate-800">
                      #
                    </th>
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-1 text-center font-bold border-r border-b border-slate-300 dark:border-slate-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>

                  {/* Row 1: SENA Institutional Header Row (Frozen row) */}
                  <tr className="bg-[#00324D] text-white font-bold text-xs sticky top-0 shadow-xs">
                    <td className="px-2 py-2.5 text-center font-mono text-slate-300 border-r border-slate-600 bg-[#002538]">
                      1
                    </td>
                    <th className="px-3 py-2.5 border-r border-slate-600">Fecha y Hora Registro</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Nombre Completo Aprendiz</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Tipo Doc</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Número Documento</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Ficha</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Programa de Formación</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Regional</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Centro de Formación</th>
                    <th className="px-3 py-2.5 border-r border-slate-600">Modalidad</th>
                    <th className="px-3 py-2.5 border-r border-slate-600 text-center">Puntaje (%)</th>
                    <th className="px-3 py-2.5 border-r border-slate-600 text-center">Estado Inducción</th>
                    <th className="px-3 py-2.5 border-r border-slate-600 font-mono">Código Certificado</th>
                    <th className="px-3 py-2.5">Registrado por (Email)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
                  {filteredRoster.map((learner, idx) => {
                    const rowNumber = idx + 2;
                    const docParts = learner.document.split(' ');
                    const docType = docParts[0] || 'CC';
                    const docNum = docParts.slice(1).join(' ') || learner.document;

                    return (
                      <tr
                        key={learner.id}
                        className={`hover:bg-emerald-50/50 dark:hover:bg-slate-800/80 transition-colors ${
                          idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/60 dark:bg-slate-800/40'
                        }`}
                      >
                        {/* Row Index */}
                        <td className="px-2 py-2 text-center font-mono text-slate-400 bg-slate-100/80 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 font-semibold select-none">
                          {rowNumber}
                        </td>
                        {/* A: Fecha */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          {learner.completionDate}
                        </td>
                        {/* B: Nombre */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
                          {learner.name}
                        </td>
                        {/* C: Tipo Doc */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300">
                          {docType}
                        </td>
                        {/* D: Número Doc */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300">
                          {docNum}
                        </td>
                        {/* E: Ficha */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300">
                          {learner.ficha}
                        </td>
                        {/* F: Programa */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {learner.program}
                        </td>
                        {/* G: Regional */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          {currentApprentice?.regional || 'Distrito Capital'}
                        </td>
                        {/* H: Centro */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          {currentApprentice?.centroFormacion || 'CEET'}
                        </td>
                        {/* I: Modalidad */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          {currentApprentice?.modalidad || 'Presencial'}
                        </td>
                        {/* J: Puntaje */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 text-center font-mono font-bold">
                          {learner.score > 0 ? (
                            <span className={learner.score >= 80 ? 'text-[#39A900] dark:text-emerald-400' : 'text-amber-600'}>
                              {learner.score}%
                            </span>
                          ) : (
                            <span className="text-slate-400">---</span>
                          )}
                        </td>
                        {/* K: Estado */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                              learner.status === 'Aprobado'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : learner.status === 'En Proceso'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {learner.status}
                          </span>
                        </td>
                        {/* L: Código */}
                        <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                          {learner.verificationCode}
                        </td>
                        {/* M: Registrado por */}
                        <td className="px-3 py-2 text-slate-500 dark:text-slate-400 text-[10px]">
                          {googleUser?.email || 'Coordinación SENA'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Mode 2: Compact Roster Table */}
        {viewMode === 'roster' && (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Aprendiz</th>
                  <th className="py-3 px-3">Documento</th>
                  <th className="py-3 px-3">Puntaje</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Fecha</th>
                  <th className="py-3 px-3">Código Verificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRoster.map((learner) => (
                  <tr
                    key={learner.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {learner.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                      {learner.document}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold tabular-nums">
                      {learner.score > 0 ? (
                        <span
                          className={
                            learner.score >= 80
                              ? 'text-[#39A900] dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }
                        >
                          {learner.score}%
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">---</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold text-[11px] ${
                          learner.status === 'Aprobado'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : learner.status === 'En Proceso'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {learner.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      {learner.completionDate}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {learner.verificationCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Mode 3: Live Iframe Preview from Google Drive */}
        {viewMode === 'iframe' && activeSheet && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Vista previa integrada de la hoja alojada en tu Google Drive:</span>
              <a
                href={activeSheet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Abrir en ventana completa ↗</span>
              </a>
            </div>
            <div className="w-full h-[500px] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50">
              <iframe
                title="Google Sheets Live Preview"
                src={`https://docs.google.com/spreadsheets/d/${activeSheet.id}/htmlembed?widget=true&headers=true`}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mandatory User Confirmation Modal for Destructive/Modifying Operations */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <FileSpreadsheet className="w-5 h-5 text-[#39A900]" />
                <h3>Confirmar Sincronización en Google Drive</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                Estás a punto de almacenar los datos de los aprendices en tu cuenta de Google Drive:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1.5 border border-slate-200/80 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hoja destino:</span>
                  <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">
                    {activeSheet?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cantidad de aprendices:</span>
                  <span className="font-bold text-[#39A900]">
                    {recordsToSyncCount} registros
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Columnas a registrar:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    13 campos institucionales
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Esta acción agregará nuevas filas en tu hoja de Google Sheets respetando la estructura oficial del SENA.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSync}
                className="px-4 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drive File Picker Modal */}
      {showDrivePicker && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <FolderCheck className="w-5 h-5 text-emerald-600" />
                <h3>Seleccionar Hoja de Cálculo en Google Drive</h3>
              </div>
              <button
                onClick={() => setShowDrivePicker(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              {isLoadingDriveFiles ? (
                <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#39A900]" />
                  <span>Consultando hojas de cálculo en tu Google Drive...</span>
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No se encontraron hojas de cálculo en tu Drive. Puedes crear una nueva con el botón "Crear Nueva Hoja".
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {driveFiles.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleSelectDriveFile(file)}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all flex items-center justify-between group"
                    >
                      <div className="truncate mr-3">
                        <div className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-[#39A900] truncate">
                          {file.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          ID: {file.id}
                        </div>
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
                        Seleccionar
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowDrivePicker(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Architecture & Auto-Sync Flow Modal */}
      <ArchitectureDiagramModal
        isOpen={showArchitectureDiagram}
        onClose={() => setShowArchitectureDiagram(false)}
      />
    </div>
  );
};
