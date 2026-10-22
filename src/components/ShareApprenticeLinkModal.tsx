import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Mail,
  MessageSquare,
  QrCode,
  Share2,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';

interface ShareApprenticeLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewAsApprentice: () => void;
}

export const ShareApprenticeLinkModal: React.FC<ShareApprenticeLinkModalProps> = ({
  isOpen,
  onClose,
  onPreviewAsApprentice,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  // Generate the clean URL for students
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const apprenticeUrl = `${baseUrl}?role=aprendiz`;

  const handleCopy = () => {
    navigator.clipboard.writeText(apprenticeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Hola Aprendiz SENA 👋. Te comparto el enlace oficial para realizar la Inducción y acreditación en el Reglamento del Aprendiz (Acuerdo 009 de 2024 / mod. Acuerdo 002 de 2026). Realiza las actividades y tu certificado quedará registrado automáticamente: ${apprenticeUrl}`;

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Inducción SENA - Reglamento del Aprendiz (Ficha 2874912)');
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50/70 dark:bg-slate-800/80 border-b border-emerald-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#39A900] text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Compartir Inducción con Aprendices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enlace seguro con privilegios restringidos de Aprendiz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Privilege Separation Guarantee Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#39A900]" />
              <span>Garantía de Aislamiento de Privilegios</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Al abrir este enlace con el parámetro <code className="text-[#39A900] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">?role=aprendiz</code>, la plataforma se bloquea en modo estudiante:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Acceso a contenidos, casos y quiz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Emisión de su certificado personal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Panel instructor totalmente oculto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Sin acceso a tu Google Drive ni notas ajenas</span>
              </div>
            </div>
          </div>

          {/* Copyable Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-white">
              Enlace Directo para los Aprendices:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apprenticeUrl}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 px-4 py-2.5 bg-[#39A900] hover:bg-[#329200] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Channels */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-2 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              onClick={handleEmail}
              className="flex-1 py-2 px-3 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Enviar por Correo</span>
            </button>

            <button
              onClick={() => setShowQR(!showQR)}
              className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQR ? 'Ocultar QR' : 'Ver Código QR'}</span>
            </button>
          </div>

          {/* QR Code Section for Projection in Classroom */}
          {showQR && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center animate-in fade-in duration-200">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Proyecta este código en pantalla para que los aprendices lo escaneen con su celular:
              </p>
              <div className="inline-block p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(apprenticeUrl)}`}
                  alt="Código QR de Inducción para Aprendices"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Escanea con la cámara del celular para abrir la inducción directamente
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onPreviewAsApprentice();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#39A900]" />
            <span>Probar la Vista del Aprendiz Ahora</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#00324D] hover:bg-[#002538] dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors"
          >
            Listo, Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
