import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Award,
  CheckCircle2,
  Cloud,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Lock,
  RefreshCw,
  Server,
  ShieldCheck,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';

interface ArchitectureDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDiagramModal: React.FC<ArchitectureDiagramModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl transition-colors max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#39A900]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Arquitectura Técnica
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">Acuerdo 009 de 2024</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Diagrama del Sistema y Flujo de Sincronización Automática
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Architecture Flow Diagram */}
        <div className="py-6 space-y-6">
          {/* STEP 1: CAPA DE USUARIO / APRENDIZ */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#00324D] dark:text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00324D] text-white flex items-center justify-center text-[11px] font-mono font-bold">1</span>
                Capa de Experiencia del Aprendiz (Front-End React)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Triggers Automáticos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Perfil Aprendiz</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Cédula, Nombres, Ficha 2874912, Programa ADSO, Regional y Centro.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-2xs relative">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs">
                  <Award className="w-4 h-4 text-[#39A900]" />
                  <span>Evaluación Gamificada</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  10 reactivos del Acuerdo 009 de 2024. Aprobación con puntaje ≥ 80%.
                </p>
                <span className="absolute -top-2 right-2 text-[9px] font-bold bg-[#39A900] text-white px-2 py-0.2 rounded-full">
                  Trigger Clave
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Certificado Digital</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Generación de código hash único: <code className="text-[#39A900] font-mono text-[10px]">SENA-IND-2024-XXXX</code>.
                </p>
              </div>
            </div>
          </div>

          {/* CONNECTOR ARROW 1 */}
          <div className="flex justify-center -my-3">
            <div className="bg-emerald-100 dark:bg-emerald-950/80 text-[#39A900] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs border border-emerald-200 dark:border-emerald-800">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Disparo en segundo plano: <code className="font-mono text-[11px]">autoSyncLearner()</code></span>
            </div>
          </div>

          {/* STEP 2: MOTOR DE AUTOGUARDADO (PILOTO AUTOMÁTICO) */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-[#39A900]/40 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#39A900] text-white flex items-center justify-center text-[11px] font-mono font-bold">2</span>
                Motor de Sincronización Automática (AutoSyncEngine Singleton)
              </span>
              <span className="text-[11px] font-bold text-[#39A900] bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Zero-Friction Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Deduplicación & Hash
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Comprueba que el documento y código no existan en la hoja para evitar duplicidad de filas.
                </p>
              </div>

              <div className="bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                  Cola Inteligente (Queue)
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Buffer local que retiene registros si se pierde conexión y los reintenta automáticamente.
                </p>
              </div>

              <div className="bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800">
                <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Persistencia de Hoja
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Recuerda el Spreadsheet ID y auto-crea la hoja oficial en Drive la primera vez.
                </p>
              </div>
            </div>
          </div>

          {/* CONNECTOR ARROW 2 */}
          <div className="flex justify-center -my-3">
            <div className="bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs border border-sky-200 dark:border-sky-800">
              <ArrowDown className="w-3.5 h-3.5" />
              <span>OAuth 2.0 Token Bearer + Google Sheets API REST v4</span>
            </div>
          </div>

          {/* STEP 3: INFRAESTRUCTURA GOOGLE WORKSPACE */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-[11px] font-mono font-bold">3</span>
                Servicios en la Nube de Google (Google Workspace & Drive)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Destino Permanente</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-sky-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Google Drive</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Alojamiento del archivo institucional en la carpeta del usuario o coordinación sin servidores intermediarios.
                </p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                  MIME: application/vnd.google-apps.spreadsheet
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#39A900]" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Google Sheets (Hoja Oficial)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  13 Columnas con formato institucional SENA (Fecha, Aprendiz, CC/TI, Ficha, ADSO, Score, Código, etc.).
                </p>
                <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  Método: spreadsheets.values.append (insertRows)
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: RETROALIMENTACIÓN EN VIVO */}
          <div className="bg-slate-100/70 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
              <span>
                <strong>Supervisión en Tiempo Real:</strong> El Panel del Instructor y la Barra Superior reflejan el estado del autoguardado sin recargar la página.
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#00324D] hover:bg-[#002538] dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors shrink-0"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
