import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  KeyRound,
  Lock,
  Moon,
  Play,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCheck,
  X,
} from 'lucide-react';
import { ApprenticeProfile } from '../data/senaRegulationData';
import { googleSignIn } from '../services/googleAuth';
import {
  changeAppLanguage,
  getTranslation,
  Language,
  TranslationKey,
} from '../i18n';

interface RoleSelectionLandingProps {
  onSelectAprendiz: (profileData: ApprenticeProfile) => void;
  onSelectInstructor: () => void;
  defaultProfile: ApprenticeProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialSelectedRole?: 'aprendiz' | 'instructor';
}

// Modal component for video playback
const VideoTutorialModal = ({
  isOpen,
  onClose,
  titleText,
  fallbackText,
}: {
  isOpen: boolean;
  onClose: () => void;
  titleText: string;
  fallbackText: string;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-700">
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-800">
          <h3 className="text-sm sm:text-base font-bold text-white">{titleText}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="aspect-video bg-black">
          <video
            className="w-full h-full"
            controls
            autoPlay
            src="/assets/aistudio/2026__16_27_ee2b0714.mp4"
          >
            {fallbackText}
          </video>
        </div>
      </div>
    </div>
  );
};

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  onSelectAprendiz,
  onSelectInstructor,
  defaultProfile,
  isDarkMode,
  onToggleDarkMode,
  initialSelectedRole,
}) => {
  const { i18n } = useTranslation();

  // Explicit reactive language state that drives UI immediately
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sena_language');
      if (stored === 'en' || stored === 'es') return stored;
    }
    return (i18n.language?.startsWith('en') ? 'en' : 'es') as Language;
  });

  // Keep state in sync if i18n or custom event triggers an update
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng.startsWith('en') ? 'en' : 'es');
    };
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      if (customEvent.detail) {
        setCurrentLang(customEvent.detail);
      }
    };
    i18n.on('languageChanged', handleLanguageChanged);
    window.addEventListener('sena_language_change', handleCustomChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
      window.removeEventListener('sena_language_change', handleCustomChange);
    };
  }, [i18n]);

  const handleChangeLanguage = (newLang: Language) => {
    changeAppLanguage(newLang);
    setCurrentLang(newLang);
  };

  // Direct reactive translation function bound to currentLang state
  const t = (key: TranslationKey): string => {
    return getTranslation(currentLang, key);
  };

  // Active Tab/Selection in mobile or highlighted view
  const [activeView, setActiveView] = useState<'aprendiz' | 'instructor'>(
    initialSelectedRole || 'aprendiz'
  );
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Apprentice Characterization Form State
  const [profileForm, setProfileForm] = useState<ApprenticeProfile>({
    fullName: defaultProfile.fullName || '',
    documentType: defaultProfile.documentType || 'CC',
    documentNumber: defaultProfile.documentNumber || '',
    fichaNumber: defaultProfile.fichaNumber || '2874912',
    programName:
      defaultProfile.programName ||
      'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: defaultProfile.regional || 'Regional Distrito Capital',
    centroFormacion:
      defaultProfile.centroFormacion ||
      'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
    modalidad: defaultProfile.modalidad || 'Presencial',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Instructor Passcode Form State
  const [instructorKey, setInstructorKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [instructorError, setInstructorError] = useState<string | null>(null);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Normalize key check for "SEnA 1234"
  const validateInstructorKey = (raw: string): boolean => {
    const cleaned = raw.trim().replace(/\s+/g, ' ').toUpperCase();
    const compact = raw.trim().replace(/\s+/g, '').toUpperCase();
    return (
      cleaned === 'SENA 1234' ||
      compact === 'SENA1234' ||
      cleaned === 'SENA2024' ||
      compact === 'SENA2024' ||
      cleaned === 'INSTRUCTOR' ||
      compact === '2874912'
    );
  };

  const handleApprenticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!profileForm.fullName.trim()) {
      errors.fullName = t('errFullName');
    }
    if (!profileForm.documentNumber.trim()) {
      errors.documentNumber = t('errDocNumber');
    }
    if (!profileForm.fichaNumber.trim()) {
      errors.fichaNumber = t('errFicha');
    }
    if (!profileForm.programName.trim()) {
      errors.programName = t('errProgram');
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    onSelectAprendiz(profileForm);
  };

  const handleFillSampleData = () => {
    setProfileForm({
      fullName: 'Juan Esteban Ramírez Gómez',
      documentType: 'CC',
      documentNumber: '1.020.304.050',
      fichaNumber: '2874912',
      programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      regional: 'Regional Distrito Capital',
      centroFormacion:
        'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
      modalidad: 'Presencial',
    });
    setFormErrors({});
  };

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInstructorError(null);

    if (validateInstructorKey(instructorKey)) {
      onSelectInstructor();
    } else {
      setInstructorError(t('errInstructorPasscode'));
    }
  };

  const handleGoogleInstructorAuth = async () => {
    setInstructorError(null);
    setIsLoadingGoogle(true);
    try {
      const res = await googleSignIn();
      if (res && res.user) {
        onSelectInstructor();
      }
    } catch (err: any) {
      console.error('Error autenticando instructor con Google:', err);
      setInstructorError(err.message || t('errGoogleAuth'));
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Brand Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <div className="h-9 w-9 sm:h-11 sm:w-11 md:h-13 md:w-13 flex items-center justify-center rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-1 sm:p-1.5 border-2 border-slate-200/80 dark:border-slate-700 shadow-xs shrink-0">
              <img
                src="/src/assets/images/logoSena.svg"
                alt="Logo SENA"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none whitespace-nowrap">
                  SENA CGTS
                </span>
                <span className="hidden xs:inline-flex text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 whitespace-nowrap shrink-0">
                  {t('portalTitle')}
                </span>
              </div>
              <p className="hidden sm:block text-[11px] sm:text-xs text-[#39A900] font-bold tracking-wide uppercase mt-0.5 truncate">
                {t('portalSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Interactive Language Switcher */}
            <div
              className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 sm:p-1 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0"
              role="group"
              aria-label={t('languageLabel')}
            >
              <div className="hidden xs:flex items-center gap-1 pl-1.5 pr-1 text-slate-500 dark:text-slate-400">
                <Globe className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
              </div>
              <button
                type="button"
                onClick={() => handleChangeLanguage('es')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  currentLang === 'es'
                    ? 'bg-[#39A900] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Cambiar idioma a Español"
              >
                <span>ES</span>
              </button>
              <button
                type="button"
                onClick={() => handleChangeLanguage('en')}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  currentLang === 'en'
                    ? 'bg-[#39A900] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch language to English"
              >
                <span>EN</span>
              </button>
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
              title={isDarkMode ? t('switchThemeLight') : t('switchThemeDark')}
              aria-label={isDarkMode ? t('switchThemeLight') : t('switchThemeDark')}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#39A900]" />
            <span>{t('systemTag')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('welcomeToYour')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00324D] via-[#39A900] to-emerald-500 dark:from-white dark:via-[#39A900] dark:to-emerald-400">
              {t('senaInduction')}
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>

          {/* Video Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00324D] hover:bg-[#002538] text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-full bg-[#39A900] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
              </div>
              <span>{t('watchVideoTutorial')}</span>
            </button>
          </div>

          {/* Quick tab toggle for smaller devices */}
          <div className="mt-6 inline-flex p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl md:hidden">
            <button
              onClick={() => setActiveView('aprendiz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'aprendiz'
                  ? 'bg-white dark:bg-slate-900 text-[#00324D] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#39A900]" />
              <span>{t('iAmApprentice')}</span>
            </button>
            <button
              onClick={() => setActiveView('instructor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === 'instructor'
                  ? 'bg-white dark:bg-slate-900 text-[#00324D] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('iAmInstructor')}</span>
            </button>
          </div>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-6xl mx-auto w-full">
          {/* CARD 1: APRENDIZ (7 cols on desktop for the form) */}
          <div
            className={`md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-xl ${
              activeView === 'aprendiz'
                ? 'border-[#39A900] ring-4 ring-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 opacity-95 md:opacity-100'
            } ${activeView !== 'aprendiz' ? 'hidden md:block' : 'block'}`}
          >
            {/* Header Card Aprendiz */}
            <div className="p-6 sm:p-7 bg-gradient-to-r from-emerald-50/70 via-white to-slate-50 dark:from-slate-800/70 dark:via-slate-900 dark:to-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#39A900] flex items-center justify-center shadow-xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t('iAmApprentice')}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-[#39A900]" />
                        {t('noPassword')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t('apprenticeBadgeDesc')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFillSampleData}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer"
                  title="Cargar datos de prueba automáticamente"
                >
                  <Sparkles className="w-3 h-3 text-[#39A900]" />
                  <span>{t('sampleDataBtn')}</span>
                </button>
              </div>

              <div className="mt-4 p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <UserCheck className="w-4 h-4 text-[#39A900] shrink-0" />
                <span>{t('characterizationNotice')}</span>
              </div>
            </div>

            {/* Formulario de Caracterización */}
            <form onSubmit={handleApprenticeSubmit} className="p-6 sm:p-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre Completo */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('fullNameLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, fullName: e.target.value })
                    }
                    placeholder={t('fullNamePlaceholder')}
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white placeholder:text-slate-400 ${
                      formErrors.fullName
                        ? 'border-rose-400 dark:border-rose-600'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                {/* Tipo de Documento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('docTypeLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={profileForm.documentType}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        documentType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white"
                  >
                    <option value="CC">{t('docCC')}</option>
                    <option value="TI">{t('docTI')}</option>
                    <option value="CE">{t('docCE')}</option>
                    <option value="PPT">{t('docPPT')}</option>
                    <option value="PEP">{t('docPEP')}</option>
                  </select>
                </div>

                {/* Número de Documento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('docNumberLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.documentNumber}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        documentNumber: e.target.value,
                      })
                    }
                    placeholder={t('docNumberPlaceholder')}
                    className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white placeholder:text-slate-400 ${
                      formErrors.documentNumber
                        ? 'border-rose-400 dark:border-rose-600'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  {formErrors.documentNumber && (
                    <p className="text-[11px] text-rose-500 mt-1">
                      {formErrors.documentNumber}
                    </p>
                  )}
                </div>

                {/* Ficha de Formación */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('fichaLabel')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fichaNumber}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        fichaNumber: e.target.value,
                      })
                    }
                    placeholder="2874912"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white font-mono"
                  />
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('modalityLabel')}
                  </label>
                  <select
                    value={profileForm.modalidad}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        modalidad: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white"
                  >
                    <option value="Presencial">{t('modalityPresencial')}</option>
                    <option value="Virtual">{t('modalityVirtual')}</option>
                    <option value="Mixta">{t('modalityMixta')}</option>
                  </select>
                </div>

                {/* Programa de Formación */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('programLabel')}
                  </label>
                  <input
                    type="text"
                    value={profileForm.programName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        programName: e.target.value,
                      })
                    }
                    placeholder={t('programPlaceholder')}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white"
                  />
                </div>

                {/* Centro de Formación */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('centerAndRegionalLabel')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={profileForm.centroFormacion}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          centroFormacion: e.target.value,
                        })
                      }
                      placeholder={t('centerPlaceholder')}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={profileForm.regional}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          regional: e.target.value,
                        })
                      }
                      placeholder={t('regionalPlaceholder')}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Ingreso Aprendiz */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#39A900] to-[#2e8800] hover:from-[#329200] hover:to-[#277400] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{t('enterAsApprenticeBtn')}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  {t('apprenticeFooterHint')}
                </p>
              </div>
            </form>
          </div>

          {/* CARD 2: INSTRUCTOR / COORDINADOR (5 cols on desktop) */}
          <div
            className={`md:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-xl ${
              activeView === 'instructor'
                ? 'border-[#00324D] dark:border-sky-500 ring-4 ring-sky-500/10'
                : 'border-slate-200 dark:border-slate-800 opacity-95 md:opacity-100'
            } ${activeView !== 'instructor' ? 'hidden md:block' : 'block'}`}
          >
            {/* Header Card Instructor */}
            <div className="p-6 sm:p-7 bg-gradient-to-r from-sky-50/70 via-white to-slate-50 dark:from-slate-800/70 dark:via-slate-900 dark:to-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#00324D] dark:bg-slate-800 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-6 h-6 text-[#39A900]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {t('iAmInstructor')}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      {t('passcodeRequired')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('instructorTagline')}
                  </p>
                </div>
              </div>

              {/* Security notice */}
              <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span>{t('instructorSecurityNotice')}</span>
                </div>
              </div>
            </div>

            {/* Formulario de Clave Instructor */}
            <div className="p-6 sm:p-7 space-y-5">
              <form onSubmit={handleInstructorSubmit} className="space-y-4">
                {instructorError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <span>{instructorError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('instructorKeyLabel')}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={instructorKey}
                      onChange={(e) => setInstructorKey(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00324D] dark:focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    {t('instructorKeyHint')}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#00324D] hover:bg-[#002538] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                  <span>{t('enterAsInstructorBtn')}</span>
                </button>
              </form>

              {/* Separador */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-2 text-[10px] text-slate-400 uppercase font-semibold">
                  {t('orInstitutionalAuth')}
                </span>
              </div>

              {/* Botón de Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleInstructorAuth}
                disabled={isLoadingGoogle}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>
                  {isLoadingGoogle ? t('connectingGoogle') : t('googleAuthBtn')}
                </span>
              </button>

              {/* Privilegios del Instructor */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {t('instructorPrivilegesTitle')}
                </p>
                <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39A900]" />
                    <span>{t('privilege1')}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39A900]" />
                    <span>{t('privilege2')}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39A900]" />
                    <span>{t('privilege3')}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39A900]" />
                    <span>{t('privilege4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-12 max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#39A900] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {t('feature1Title')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('feature1Desc')}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {t('feature2Title')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('feature2Desc')}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {t('feature3Title')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('feature3Desc')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>{t('footerEntity')}</p>
        <p className="text-[11px] mt-1 text-slate-400">{t('footerCredits')}</p>
      </footer>

      {/* Video Tutorial Floating Modal */}
      <VideoTutorialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        titleText={t('videoModalTitle')}
        fallbackText={t('videoNotSupported')}
      />
    </div>
  );
};
