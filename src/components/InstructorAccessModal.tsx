import React, { useState } from 'react';
import { KeyRound, Lock, LogIn, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { googleSignIn } from '../services/googleAuth';

interface InstructorAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccessGranted: () => void;
}

export const InstructorAccessModal: React.FC<InstructorAccessModalProps> = ({
  isOpen,
  onClose,
  onAccessGranted,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = pin.trim().toUpperCase();

    // Valid institutional access codes (includes explicit SEnA 1234)
    const normalized = cleaned.replace(/\s+/g, ' ');
    const compact = cleaned.replace(/\s+/g, '');
    if (
      normalized === 'SENA 1234' ||
      compact === 'SENA1234' ||
      cleaned === 'SENA2024' ||
      cleaned === 'INSTRUCTOR' ||
      cleaned === 'SENA' ||
      cleaned === '2874912'
    ) {
      onAccessGranted();
      onClose();
    } else {
      setError('Código de instructor incorrecto. Usa tu clave institucional autorizada o inicia con Google.');
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoadingGoogle(true);
    try {
      const res = await googleSignIn();
      if (res && res.user) {
        onAccessGranted();
        onClose();
      }
    } catch (err: any) {
      console.error('Error logging in as instructor:', err);
      setError(err.message || 'Error al autenticar con Google. Intenta ingresar con el código PIN institucional.');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00324D] dark:bg-slate-700 flex items-center justify-center text-white">
              <Lock className="w-4 h-4 text-[#39A900]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Acceso Exclusivo para Instructores
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Coordinación Académica · Ficha 2874912
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

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Esta zona contiene las herramientas de control, configuración de Google Drive, vinculación de Google Sheets y supervisión de notas de todos los aprendices.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form 1: PIN de Acceso */}
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clave Institucional de Instructor / PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Ingresa clave institucional"
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Ingresa la clave autorizada para instructores o autentícate con Google.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#39A900] hover:bg-[#329200] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Desbloquear Modo Instructor</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
            <span className="bg-white dark:bg-slate-900 px-2 text-[11px] text-slate-400 uppercase font-medium">
              o autentícate con
            </span>
          </div>

          {/* Form 2: Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoadingGoogle}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>{isLoadingGoogle ? 'Conectando con Google...' : 'Iniciar Sesión con Google (Instructor)'}</span>
          </button>
        </div>

        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
          >
            Continuar como Aprendiz
          </button>
        </div>
      </div>
    </div>
  );
};
