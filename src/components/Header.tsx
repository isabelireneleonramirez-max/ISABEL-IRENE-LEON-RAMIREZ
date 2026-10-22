import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Award,
  CheckCircle,
  ExternalLink,
  Globe,
  GraduationCap,
  Lock,
  LogOut,
  Moon,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sun,
  User,
  Users,
} from 'lucide-react';
import { AutoSyncStatus } from '../services/autoSyncEngine';
import { AVATAR_OPTIONS } from '../data/avatars';
import {
  changeAppLanguage,
  getTranslation,
  Language,
  TranslationKey,
} from '../i18n';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completedQuiz: boolean;
  score: number;
  onOpenProfile: () => void;
  apprenticeName: string;
  avatarId?: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  syncStatus?: AutoSyncStatus;
  onActivateSync?: () => void;
  userRole: 'instructor' | 'aprendiz';
  onToggleRole: (newRole: 'instructor' | 'aprendiz') => void;
  onOpenInstructorLogin: () => void;
  onOpenShareModal: () => void;
  onExitToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  completedQuiz,
  score,
  onOpenProfile,
  apprenticeName,
  avatarId,
  isDarkMode,
  onToggleDarkMode,
  syncStatus,
  onActivateSync,
  userRole,
  onToggleRole,
  onOpenInstructorLogin,
  onOpenShareModal,
  onExitToLanding,
}) => {
  const { i18n } = useTranslation();

  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sena_language');
      if (stored === 'en' || stored === 'es') return stored;
    }
    return (i18n.language?.startsWith('en') ? 'en' : 'es') as Language;
  });

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

  const t = (key: TranslationKey): string => {
    return getTranslation(currentLang, key);
  };

  const allNavItems = [
    { id: 'plan', label: t('navPlan') },
    { id: 'reglamento', label: t('navReglamento') },
    { id: 'simulador', label: t('navSimulador') },
    { id: 'evaluacion', label: t('navEvaluacion') },
    { id: 'certificado', label: t('navCertificado') },
    { id: 'coordinacion', label: t('navCoordinacion') },
  ];

  // Strictly filter out Panel Instructor for Apprentice role
  const navItems =
    userRole === 'aprendiz'
      ? allNavItems.filter((item) => item.id !== 'coordinacion')
      : allNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-[3.75rem] sm:min-h-[4.25rem] py-1.5 sm:py-2 w-full">
          {/* Zone 1: Single text wordmark with enlarged SENA green brand accent */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('plan')}
              className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] rounded-xl transition-all cursor-pointer"
            >
              <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 flex items-center justify-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform bg-white dark:bg-slate-800 p-1.5 sm:p-2 border-2 border-slate-200/80 dark:border-slate-700 shadow-sm shrink-0">
                <img
                  src="/src/assets/images/logoSena.svg"
                  alt="Logo Oficial SENA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap leading-none">
                    SENA CGTS
                  </span>
                  {/* Distinctive Role Pill */}
                  {userRole === 'instructor' ? (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] animate-pulse" />
                      {t('roleInstructor')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 px-1.5 sm:px-2 py-0.5 rounded-full border border-sky-300 dark:border-sky-800">
                      <GraduationCap className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                      {t('roleApprentice')}
                    </span>
                  )}
                </div>
                <span className="hidden xs:inline-block text-[11px] sm:text-xs text-[#39A900] font-bold tracking-wide uppercase mt-0.5">
                  {t('portalSubtitle')}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links - visible only on wide screens to prevent overflow */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isCoord = item.id === 'coordinacion';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs 2xl:text-sm font-medium flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'border-[#39A900] text-slate-900 dark:text-white font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isCoord && (
                    <span className="text-[9px] bg-[#00324D] text-white dark:bg-slate-700 px-1.5 py-0.2 rounded font-bold uppercase">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions + Role Switches + Dark mode toggle */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
            {/* Instructor Quick Privileges: Share & Preview Apprentice View */}
            {userRole === 'instructor' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenShareModal}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#329200] rounded-xl shadow-xs transition-colors cursor-pointer"
                  title="Copiar o compartir enlace directo para que los aprendices hagan la inducción"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir con Aprendices</span>
                </button>

                <button
                  onClick={() => onToggleRole('aprendiz')}
                  className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Cambiar temporalmente a la vista de Aprendiz para probar su experiencia"
                >
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ver como Aprendiz</span>
                </button>

                {/* Auto-Sync Google Sheets Pill Indicator (Only for Instructor) */}
                {syncStatus && syncStatus.sheetUrl && (
                  <a
                    href={syncStatus.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors group"
                    title={syncStatus.message || 'Sincronización automática con Google Sheets activa'}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
                    <span className="group-hover:underline">Sheets Activa</span>
                    <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </a>
                )}
              </div>
            ) : (
              /* Apprentice Role Actions: Has locked Instructor Access button */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenInstructorLogin}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Si eres el instructor o coordinador, ingresa aquí para desbloquear el panel"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span className="hidden sm:inline">Acceso Instructor</span>
                  <span className="sm:hidden">Instructor</span>
                </button>
              </div>
            )}

            {syncStatus?.state === 'syncing' && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-lg animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-sky-600 dark:text-sky-400" />
                <span>Guardando...</span>
              </div>
            )}

            {/* Apprentice Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title={t('navProfileTitle')}
            >
              {avatarId ? (
                <span className="text-base">
                  {AVATAR_OPTIONS.find((a) => a.id === avatarId)?.icon}
                </span>
              ) : (
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              )}
              <span className="max-w-[90px] sm:max-w-[110px] truncate">
                {apprenticeName.split(' ')[0] || t('roleApprentice')}
              </span>
            </button>

            {/* Exit / Switch Role Button to return to Landing Page */}
            {onExitToLanding && (
              <button
                onClick={onExitToLanding}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                title={t('navExitLandingTitle')}
              >
                <LogOut className="w-3 h-3 text-slate-500" />
                <span>{t('navSwitchRole')}</span>
              </button>
            )}

            {completedQuiz ? (
              <button
                onClick={() => setActiveTab('certificado')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329200] rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('navViewCertificate')}</span>
                <span className="sm:hidden">{t('navDiploma')}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('evaluacion')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#00324D] hover:bg-[#002538] dark:bg-emerald-700 dark:hover:bg-emerald-600 rounded-lg transition-all whitespace-nowrap cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-200" />
                <span>{t('navStartQuiz')}</span>
              </button>
            )}

            {/* Language Switcher in Header */}
            <div
              className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 shadow-2xs"
              role="group"
              aria-label={t('languageLabel')}
            >
              <button
                type="button"
                onClick={() => handleChangeLanguage('es')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  currentLang === 'es'
                    ? 'bg-[#39A900] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Español"
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => handleChangeLanguage('en')}
                className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#39A900] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? t('switchThemeLight') : t('switchThemeDark')}
              title={isDarkMode ? t('switchThemeLight') : t('switchThemeDark')}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in spin-in-90 duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation bar */}
        <div className="xl:hidden flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 text-xs no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-[#39A900] text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
