import React, { useEffect, useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  Cloud,
  Copy,
  Edit3,
  ExternalLink,
  Printer,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { ApprenticeProfile } from '../data/senaRegulationData';
import { autoSyncEngine, AutoSyncStatus } from '../services/autoSyncEngine';

interface CertificateViewProps {
  profile: ApprenticeProfile;
  score: number;
  onEditProfile: () => void;
  userRole?: 'instructor' | 'aprendiz';
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  profile,
  score,
  onEditProfile,
  userRole = 'aprendiz',
}) => {
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<AutoSyncStatus>(
    autoSyncEngine.getStatus()
  );

  const verificationCode =
    profile.verificationCode ||
    `SENA-IND-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const issueDate =
    profile.inductionCompletedAt ||
    new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  // Listen to auto-sync engine
  useEffect(() => {
    const unsub = autoSyncEngine.subscribe((s) => setSyncStatus(s));
    return unsub;
  }, []);

  // AUTOMATIC BACKGROUND TRIGGER: syncs learner automatically without any click
  useEffect(() => {
    if (score >= 80) {
      autoSyncEngine.autoSyncLearner({
        registeredAt: new Date().toLocaleString('es-CO'),
        fullName: profile.fullName || 'Aprendiz SENA',
        documentType: profile.documentType || 'CC',
        documentNumber: profile.documentNumber || '',
        fichaNumber: profile.fichaNumber || '2874912',
        programName: profile.programName || 'Formación SENA',
        regional: profile.regional || 'Regional Distrito Capital',
        centroFormacion: profile.centroFormacion || 'CEET',
        modalidad: profile.modalidad || 'Presencial',
        score: score,
        status: 'Aprobado',
        verificationCode: verificationCode,
      });
    }
  }, [profile.fullName, profile.documentNumber, score, verificationCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Control Actions Bar (Hidden when printing) */}
      <div className="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#39A900] font-semibold mb-1">
            <span>Acreditación Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Documento Verificable</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Certificado Oficial Digital de Inducción
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Emitido en cumplimiento estricto del Acuerdo 009 de 2024 del Consejo Directivo Nacional del SENA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Automatic Sync Status Badge */}
          {userRole === 'instructor' ? (
            syncStatus.sheetUrl ? (
              <div className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
                <span>Autoguardado en Google Sheets</span>
                <a
                  href={syncStatus.sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#39A900] hover:text-[#329200] font-bold underline flex items-center gap-1 ml-1"
                  title="Abrir hoja de cálculo en Google Drive"
                >
                  <span>Ver Hoja</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : syncStatus.state === 'syncing' ? (
              <div className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
                <span>Guardando automáticamente en Drive...</span>
              </div>
            ) : (
              <button
                onClick={() => autoSyncEngine.activateOneClickSync()}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#00324D] hover:bg-[#002538] dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-300" />
                <span>Activar Autoguardado Google Drive</span>
              </button>
            )
          ) : (
            /* Student / Apprentice view: Clean reassurance without admin links */
            <div className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
              <span>Acreditación Registrada en Cohorte SENA</span>
            </div>
          )}

          <button
            onClick={onEditProfile}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Datos</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Código'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Canvas */}
      <div className="print-area max-w-4xl mx-auto bg-white dark:bg-slate-900 border-8 border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden relative p-8 md:p-14 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Subtle decorative inner border */}
        <div className="border-2 border-[#00324D]/20 dark:border-[#39A900]/30 p-8 md:p-12 relative rounded-lg">
          {/* Top Brand Heraldry & Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-[#39A900]/30 pb-8 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#39A900]/40 p-2.5 flex items-center justify-center shadow-md shrink-0">
                <img
                  src="/src/assets/images/logoSena.svg"
                  alt="Logo Oficial SENA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black tracking-wider text-[#00324D] dark:text-emerald-400 uppercase">
                  SERVICIO NACIONAL DE APRENDIZAJE
                </h2>
                <div className="text-xs md:text-sm font-bold text-[#39A900] dark:text-emerald-300 tracking-widest uppercase">
                  SENA · COLOMBIA
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Ministerio del Trabajo · Formación Profesional Integral
                </div>
              </div>
            </div>

            {/* Official Seal Photo */}
            <div className="w-20 h-20 shrink-0">
              <img
                src="/src/assets/images/sena_certificate_badge_1792526597455.jpg"
                alt="Sello Oficial de Certificación SENA"
                className="w-full h-full object-contain rounded-full shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="py-10 text-center space-y-6">
            <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              Certifica Que el Aprendiz
            </div>

            {/* Apprentice Full Name */}
            <div className="text-3xl md:text-4xl font-extrabold text-[#00324D] dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-700 pb-2 inline-block px-8">
              {profile.fullName || 'APRENDIZ SENA'}
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Identificado con <strong>{profile.documentType} N° {profile.documentNumber}</strong>, matriculado formalmente en:
            </div>

            {/* Program Name & Ficha */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 max-w-xl mx-auto">
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {profile.programName}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                Ficha de Caracterización N° <strong>{profile.fichaNumber}</strong> · Modalidad {profile.modalidad}
              </div>
            </div>

            {/* Legal compliance paragraph */}
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
              Ha culminado y aprobado satisfactoriamente las <strong>32 Horas del Plan de Inducción Institucional</strong>, demostrando apropiación y cumplimiento integral del <strong>Reglamento del Aprendiz SENA (Acuerdo 009 de 2024 · Art. 48 modificado por Acuerdo 002 de 2026)</strong>, sus derechos, deberes, prohibiciones y alternativas de etapa productiva.
            </p>

            {/* Score and Validation Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
                <span>Evaluación Normativa Aprobada ({score}%)</span>
              </div>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                <span>Inducción Integral de Aprendices</span>
              </div>
            </div>
          </div>

          {/* Footer Signatures and QR Code */}
          <div className="pt-8 border-t-2 border-[#39A900]/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-end text-center">
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="font-serif italic text-lg text-slate-700 dark:text-slate-300">
                Dr. Jorge Eduardo Londoño Ulloa
              </div>
              <div className="w-40 h-0.5 bg-slate-300 dark:bg-slate-600 mx-auto" />
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                Dirección General SENA
              </div>
              <div className="text-[10px] text-slate-400">
                Servicio Nacional de Aprendizaje
              </div>
            </div>

            {/* QR Code Block */}
            <div className="flex flex-col items-center justify-center space-y-1.5 order-first md:order-none">
              <div className="p-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-xs inline-block">
                <QrCode className="w-16 h-16 text-slate-800 dark:text-white" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                {verificationCode}
              </div>
              <div className="text-[9px] text-[#39A900] font-semibold">
                Validez Digital Certificada
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1">
              <div className="font-serif italic text-lg text-slate-700 dark:text-slate-300">
                Subdirección de Centro
              </div>
              <div className="w-40 h-0.5 bg-slate-300 dark:bg-slate-600 mx-auto" />
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                {profile.centroFormacion}
              </div>
              <div className="text-[10px] text-slate-400">
                {profile.regional}
              </div>
            </div>
          </div>

          {/* Date stamp */}
          <div className="mt-8 text-center text-[11px] text-slate-400 dark:text-slate-500">
            Expedido en Bogotá D.C., Colombia, a los {issueDate}.
          </div>
        </div>
      </div>
    </div>
  );
};
