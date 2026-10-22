/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { InductionPlanView } from './components/InductionPlanView';
import { RegulationExplorer } from './components/RegulationExplorer';
import { CaseSimulator } from './components/CaseSimulator';
import { GamifiedQuiz } from './components/GamifiedQuiz';
import { CertificateView } from './components/CertificateView';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { ProfileModal } from './components/ProfileModal';
import { InstructorAccessModal } from './components/InstructorAccessModal';
import { ShareApprenticeLinkModal } from './components/ShareApprenticeLinkModal';
import { ApprenticeProfile } from './data/senaRegulationData';
import { autoSyncEngine, AutoSyncStatus } from './services/autoSyncEngine';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { Lock, LogOut, ShieldCheck, Users } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [autoSyncStatus, setAutoSyncStatus] = useState<AutoSyncStatus>(
    autoSyncEngine.getStatus()
  );

  // Gateway Portal Landing Page state
  const [hasEnteredPortal, setHasEnteredPortal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // Explicit parameters to force landing page
      if (params.get('landing') === 'true' || params.get('portal') === 'true') {
        return false;
      }
      // If student clicked the shared link, always show characterization landing
      if (params.get('role') === 'aprendiz') {
        return false;
      }
      const savedSession = sessionStorage.getItem('sena_entered_portal');
      if (savedSession === 'true') {
        return true;
      }
    }
    return false;
  });

  // Role management: 'instructor' (full permissions) vs 'aprendiz' (student view only)
  const [userRole, setUserRole] = useState<'instructor' | 'aprendiz'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role') || params.get('modo') || params.get('vista');
      if (roleParam === 'aprendiz' || roleParam === 'estudiante') {
        return 'aprendiz';
      }
      if (roleParam === 'instructor' || roleParam === 'admin') {
        return 'instructor';
      }
      const saved = localStorage.getItem('sena_user_role');
      if (saved === 'aprendiz' || saved === 'instructor') {
        return saved;
      }
    }
    // Default to instructor
    return 'instructor';
  });

  // Role switch handler
  const handleSwitchRole = (newRole: 'instructor' | 'aprendiz') => {
    setUserRole(newRole);
    localStorage.setItem('sena_user_role', newRole);
    if (newRole === 'aprendiz' && activeTab === 'coordinacion') {
      setActiveTab('plan');
    }
  };

  // Exit back to Landing Page
  const handleExitToLanding = () => {
    sessionStorage.removeItem('sena_entered_portal');
    setHasEnteredPortal(false);
  };

  // Aprendiz enters from Landing Page with Characterization data (no password)
  const handleSelectAprendiz = (profileData: ApprenticeProfile) => {
    setProfile(profileData);
    setUserRole('aprendiz');
    localStorage.setItem('sena_user_role', 'aprendiz');
    sessionStorage.setItem('sena_entered_portal', 'true');
    setHasEnteredPortal(true);
    setActiveTab('plan');
  };

  // Instructor enters from Landing Page with valid SEnA 1234 key
  const handleSelectInstructor = () => {
    setUserRole('instructor');
    localStorage.setItem('sena_user_role', 'instructor');
    sessionStorage.setItem('sena_entered_portal', 'true');
    setHasEnteredPortal(true);
    setActiveTab('coordinacion');
  };

  // Instructor unlocked from login modal
  const handleInstructorAccessGranted = () => {
    setUserRole('instructor');
    localStorage.setItem('sena_user_role', 'instructor');
    sessionStorage.setItem('sena_entered_portal', 'true');
    setHasEnteredPortal(true);
    setActiveTab('coordinacion');
  };

  // Safety protection: apprentices cannot view coordination panel
  useEffect(() => {
    if (userRole === 'aprendiz' && activeTab === 'coordinacion') {
      setActiveTab('plan');
    }
  }, [userRole, activeTab]);

  // Subscribe to auto-sync engine events
  useEffect(() => {
    const unsubscribe = autoSyncEngine.subscribe((status) => {
      setAutoSyncStatus(status);
    });
    return unsubscribe;
  }, []);

  // Dark Mode state with localStorage and system preference detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isScreenBlurring, setIsScreenBlurring] = useState(false);

  // Sync document root class with dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sena_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sena_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsScreenBlurring(true);
    setIsDarkMode((prev) => !prev);
    setTimeout(() => {
      setIsScreenBlurring(false);
    }, 450);
  };

  const [profile, setProfile] = useState<ApprenticeProfile>({
    fullName: 'Juan Esteban Ramírez Gómez',
    documentType: 'CC',
    documentNumber: '1.020.304.050',
    fichaNumber: '2874912',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    regional: 'Regional Distrito Capital',
    centroFormacion: 'Centro de Electricidad, Electrónica y Telecomunicaciones',
    modalidad: 'Presencial',
    inductionCompletedAt: '20 de Octubre de 2024',
    verificationCode: 'SENA-IND-2024-8F72D',
  });

  const handleQuizCompleted = (scorePercentage: number, passed: boolean) => {
    setQuizScore(scorePercentage);
    if (passed) {
      setCompletedQuiz(true);
      const generatedCode =
        profile.verificationCode ||
        `SENA-IND-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const completedDate = new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      setProfile((prev) => ({
        ...prev,
        score: scorePercentage,
        inductionCompletedAt: completedDate,
        verificationCode: generatedCode,
      }));

      // AUTOMATIC BACKGROUND SYNC TO GOOGLE SHEETS
      autoSyncEngine.autoSyncLearner({
        registeredAt: new Date().toLocaleString('es-CO'),
        fullName: profile.fullName || 'Aprendiz SENA',
        documentType: profile.documentType || 'CC',
        documentNumber: profile.documentNumber || '',
        fichaNumber: profile.fichaNumber || '2874912',
        programName: profile.programName || 'Formación SENA',
        regional: profile.regional || 'Distrito Capital',
        centroFormacion: profile.centroFormacion || 'CEET',
        modalidad: profile.modalidad || 'Presencial',
        score: scorePercentage,
        status: 'Aprobado',
        verificationCode: generatedCode,
      });
    }
  };

  const handleSaveProfile = (updated: ApprenticeProfile) => {
    setProfile(updated);
    if (completedQuiz || (quizScore && quizScore >= 80)) {
      autoSyncEngine.autoSyncLearner({
        registeredAt: new Date().toLocaleString('es-CO'),
        fullName: updated.fullName,
        documentType: updated.documentType,
        documentNumber: updated.documentNumber,
        fichaNumber: updated.fichaNumber,
        programName: updated.programName,
        regional: updated.regional,
        centroFormacion: updated.centroFormacion,
        modalidad: updated.modalidad,
        score: quizScore || updated.score || 95,
        status: 'Aprobado',
        verificationCode: updated.verificationCode || profile.verificationCode || '---',
      });
    }
  };

  if (!hasEnteredPortal) {
    const urlRole =
      typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('role') === 'aprendiz'
            ? 'aprendiz'
            : new URLSearchParams(window.location.search).get('role') === 'instructor'
            ? 'instructor'
            : undefined)
        : undefined;

    return (
      <RoleSelectionLanding
        onSelectAprendiz={handleSelectAprendiz}
        onSelectInstructor={handleSelectInstructor}
        defaultProfile={profile}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        initialSelectedRole={urlRole}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden">
      {/* Screen Blur Overlay Effect when switching dark/light mode */}
      {isScreenBlurring && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 theme-transition-blur bg-slate-950/20 backdrop-blur-md pointer-events-none"
        />
      )}

      {/* Ambient background glows for Dark Mode */}
      <div className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl dark:block hidden" />
      <div className="pointer-events-none fixed top-1/2 -right-40 w-96 h-96 rounded-full bg-sky-600/10 blur-3xl dark:block hidden" />

      {/* Top Banner when in Apprentice Mode */}
      {userRole === 'aprendiz' && (
        <div className="bg-[#00324D] text-white text-xs px-3 sm:px-4 py-1.5 sm:py-2 border-b border-[#002538] flex items-center justify-between w-full">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#39A900] animate-pulse" />
              <span className="font-semibold">Perfil de Aprendiz activo:</span>
              <span className="text-slate-300 hidden sm:inline">
                Estás realizando la inducción con tus datos de caracterización (Panel de Coordinación oculto).
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsInstructorModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold bg-[#39A900] hover:bg-[#329200] text-white rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Desbloquear privilegios de instructor con la clave institucional"
              >
                <Lock className="w-3 h-3" />
                <span>Acceso Instructor</span>
              </button>
              <button
                onClick={handleExitToLanding}
                className="px-2 py-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors cursor-pointer flex items-center gap-1"
                title="Regresar a la pantalla de selección de rol"
              >
                <LogOut className="w-3 h-3" />
                <span>Cambiar Rol</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        completedQuiz={completedQuiz}
        score={quizScore}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        apprenticeName={profile.fullName}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        syncStatus={autoSyncStatus}
        userRole={userRole}
        onToggleRole={handleSwitchRole}
        onOpenInstructorLogin={() => setIsInstructorModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onExitToLanding={handleExitToLanding}
        avatarId={profile.avatarId}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {activeTab === 'plan' && (
          <InductionPlanView
            onStartQuiz={() => setActiveTab('evaluacion')}
            onExploreRegulation={() => setActiveTab('reglamento')}
            onStartSimulator={() => setActiveTab('simulador')}
          />
        )}

        {activeTab === 'reglamento' && <RegulationExplorer />}

        {activeTab === 'simulador' && (
          <CaseSimulator onGoToQuiz={() => setActiveTab('evaluacion')} />
        )}

        {activeTab === 'evaluacion' && (
          <GamifiedQuiz
            onQuizCompleted={handleQuizCompleted}
            onViewCertificate={() => setActiveTab('certificado')}
          />
        )}

        {activeTab === 'certificado' && (
          <CertificateView
            profile={profile}
            score={quizScore || 95}
            onEditProfile={() => setIsProfileModalOpen(true)}
            userRole={userRole}
          />
        )}

        {activeTab === 'coordinacion' && userRole === 'instructor' && (
          <CoordinatorDashboard
            currentApprentice={profile}
            onSwitchToApprenticeView={() => handleSwitchRole('aprendiz')}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}
      </main>

      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-8 transition-colors relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 p-1.5 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 flex items-center justify-center">
                <img
                  src="/src/assets/images/logoSena.svg"
                  alt="Logo SENA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-bold text-slate-800 dark:text-white">Servicio Nacional de Aprendizaje SENA</span>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <span>Reglamento del Aprendiz (Acuerdo 009 de 2024 · Mod. Acuerdo 002 de 2026)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setActiveTab('plan')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Plan de Inducción
              </button>
              <button
                onClick={() => setActiveTab('reglamento')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Compendio Normativo
              </button>

              {userRole === 'instructor' ? (
                <>
                  <button
                    onClick={() => setActiveTab('coordinacion')}
                    className="hover:text-[#39A900] dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer"
                  >
                    Panel Instructor
                  </button>
                  <button
                    onClick={() => handleSwitchRole('aprendiz')}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Ver como Aprendiz
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsInstructorModalOpen(true)}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>Acceso Instructor</span>
                </button>
              )}

              <button
                onClick={handleExitToLanding}
                className="text-[#39A900] dark:text-[#39A900] hover:underline font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Volver a la selección de rol"
              >
                <LogOut className="w-3 h-3" />
                <span>Cambiar Rol</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Instructor Access Modal (Unlocks admin privileges from student view) */}
      <InstructorAccessModal
        isOpen={isInstructorModalOpen}
        onClose={() => setIsInstructorModalOpen(false)}
        onAccessGranted={handleInstructorAccessGranted}
      />

      {/* Share Apprentice Link Modal */}
      <ShareApprenticeLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPreviewAsApprentice={() => handleSwitchRole('aprendiz')}
      />
    </div>
  );
}
