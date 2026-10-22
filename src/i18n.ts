import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLang =
  typeof window !== 'undefined'
    ? localStorage.getItem('sena_language') || 'es'
    : 'es';

export const resources = {
  es: {
    translation: {
      portalTitle: 'Portal de Acceso',
      portalSubtitle: 'Inducción Digital · Ficha 2874912',
      systemTag: 'Sistema Institucional de Inducción y Seguimiento',
      welcomeToYour: 'Bienvenido a tu',
      senaInduction: 'Inducción SENA',
      heroDescription:
        'Selecciona cómo deseas ingresar. Si eres Aprendiz, llena tus datos para realizar las actividades y expedir tu certificado. Si eres Instructor, ingresa con tu clave para gestionar el grupo y sincronizar con Google Sheets.',
      watchVideoTutorial: 'Ver video tutorial de inducción',
      iAmApprentice: 'Soy Aprendiz',
      iAmInstructor: 'Soy Instructor',
      noPassword: 'Sin Contraseña',
      passcodeRequired: 'Requiere Clave',
      apprenticeBadgeDesc: 'Ingreso libre para estudiantes y miembros del grupo',
      sampleDataBtn: 'Datos de ejemplo',
      characterizationNotice:
        'Diligencia tus Datos de Caracterización. Con estos datos se generará tu Certificado Oficial y se registrará tu nota en la hoja de cálculo del instructor.',
      fullNameLabel: 'Nombre Completo del Aprendiz',
      fullNamePlaceholder: 'Ej: Juan Esteban Ramírez Gómez',
      docTypeLabel: 'Tipo de Documento',
      docNumberLabel: 'Número de Documento',
      docNumberPlaceholder: 'Ej: 1020304050',
      fichaLabel: 'Número de Ficha',
      modalityLabel: 'Modalidad de Formación',
      modalityPresencial: 'Presencial',
      modalityVirtual: 'Virtual',
      modalityMixta: 'Mixta (B-Learning)',
      programLabel: 'Programa de Formación',
      programPlaceholder: 'Ej: Tecnólogo en Análisis y Desarrollo de Software',
      centerAndRegionalLabel: 'Centro de Formación y Regional',
      centerPlaceholder: 'Centro (Ej: CEET)',
      regionalPlaceholder: 'Regional (Ej: Distrito Capital)',
      enterAsApprenticeBtn: 'Ingresar a mi Inducción SENA',
      apprenticeFooterHint:
        'Acceso directo sin contraseña · Panel de administración oculto para aprendices',

      instructorTagline: 'Coordinación, seguimiento y sincronización',
      instructorSecurityNotice:
        'Acceso protegido para docentes y coordinadores del SENA. Digita tu clave institucional de seguridad.',
      instructorKeyLabel: 'Ingresa la Clave de Instructor',
      instructorKeyHint:
        'Clave privada exclusiva para personal docente y administrativo.',
      enterAsInstructorBtn: 'Ingresar como Instructor',
      orInstitutionalAuth: 'O conexión institucional',
      googleAuthBtn: 'Ingresar con cuenta Google SENA',
      connectingGoogle: 'Conectando con Google...',
      instructorPrivilegesTitle: 'Privilegios exclusivos del Instructor:',
      privilege1: 'Panel de control de calificaciones y cohortes',
      privilege2: 'Sincronización automática directa con Google Sheets',
      privilege3: 'Generador de QR y enlace directo para aprendices',
      privilege4: 'Diagrama de arquitectura y flujo de sincronización',

      feature1Title: 'Reglamento 2024 Actualizado',
      feature1Desc:
        'Acuerdo 009 de 2024 y mod. Acuerdo 002 de 2026 con 6 capítulos y casos prácticos.',
      feature2Title: 'Sincronización Automática',
      feature2Desc:
        'Las calificaciones se registran en Google Sheets en segundo plano sin intervención manual.',
      feature3Title: 'Certificación Digital',
      feature3Desc:
        'Generación inmediata con código criptográfico único al aprobar con 80% o más.',

      videoModalTitle: 'Guía paso a paso: Inducción Digital',
      videoNotSupported: 'Tu navegador no soporta la reproducción de video.',

      footerEntity:
        'Servicio Nacional de Aprendizaje SENA · Dirección de Formación Profesional',
      footerCredits:
        'Prototipo de Inducción Digital · Ficha 2874912 · Colombia 2026',

      docCC: 'Cédula de Ciudadanía (CC)',
      docTI: 'Tarjeta de Identidad (TI)',
      docCE: 'Cédula de Extranjería (CE)',
      docPPT: 'Permiso por Protección Temporal (PPT)',
      docPEP: 'Permiso Especial de Permanencia (PEP)',
      hidePassword: 'Ocultar contraseña',
      showPassword: 'Ver contraseña',
      sampleDataTooltip: 'Cargar datos de prueba automáticamente',
      closeVideo: 'Cerrar video',

      navPlan: 'Plan de Inducción',
      navReglamento: 'Reglamento 2024',
      navSimulador: 'Simulador de Casos',
      navEvaluacion: 'Evaluación',
      navCertificado: 'Certificado Digital',
      navCoordinacion: 'Panel Instructor',
      navSwitchRole: 'Cambiar Rol',
      navViewCertificate: 'Ver Certificado',
      navDiploma: 'Diploma',
      navStartQuiz: 'Iniciar Quiz',
      navProfileTitle: 'Configurar mis datos de aprendiz',
      navExitLandingTitle: 'Volver a la pantalla principal de selección de rol',
      roleInstructor: 'Instructor',
      roleApprentice: 'Aprendiz',

      errFullName: 'Por favor ingresa tu nombre completo',
      errDocNumber: 'Por favor ingresa tu número de documento',
      errFicha: 'Por favor indica la ficha de formación',
      errProgram: 'Por favor indica tu programa de formación',
      errInstructorPasscode:
        'Clave de acceso incorrecta. Por favor verifica e intenta nuevamente.',
      errGoogleAuth:
        'No se pudo autenticar con Google. Puedes ingresar con tu clave institucional autorizada.',
      switchThemeLight: 'Cambiar a modo claro',
      switchThemeDark: 'Cambiar a modo oscuro',
      languageLabel: 'Idioma',
    },
  },
  en: {
    translation: {
      portalTitle: 'Access Portal',
      portalSubtitle: 'Digital Induction · Cohort 2874912',
      systemTag: 'Institutional Induction & Tracking System',
      welcomeToYour: 'Welcome to your',
      senaInduction: 'SENA Induction',
      heroDescription:
        'Select how you wish to enter. If you are an Apprentice, fill in your information to complete activities and receive your certificate. If you are an Instructor, enter with your passcode to manage the cohort and sync with Google Sheets.',
      watchVideoTutorial: 'Watch induction video tutorial',
      iAmApprentice: 'I am an Apprentice',
      iAmInstructor: 'I am an Instructor',
      noPassword: 'No Password',
      passcodeRequired: 'Passcode Required',
      apprenticeBadgeDesc: 'Free access for students and group members',
      sampleDataBtn: 'Sample data',
      characterizationNotice:
        'Fill in your Characterization Data. With this data, your Official Certificate will be generated and your score recorded in the instructor spreadsheet.',
      fullNameLabel: 'Apprentice Full Name',
      fullNamePlaceholder: 'E.g.: Juan Esteban Ramírez Gómez',
      docTypeLabel: 'Document Type',
      docNumberLabel: 'Document Number',
      docNumberPlaceholder: 'E.g.: 1020304050',
      fichaLabel: 'Cohort / Ficha Number',
      modalityLabel: 'Training Modality',
      modalityPresencial: 'In-Person',
      modalityVirtual: 'Virtual',
      modalityMixta: 'Blended (Hybrid)',
      programLabel: 'Training Program',
      programPlaceholder: 'E.g.: Software Analysis and Development Technologist',
      centerAndRegionalLabel: 'Training Center and Regional Office',
      centerPlaceholder: 'Center (E.g.: CEET)',
      regionalPlaceholder: 'Regional (E.g.: Capital District)',
      enterAsApprenticeBtn: 'Enter my SENA Induction',
      apprenticeFooterHint:
        'Direct access without password · Administration panel hidden for apprentices',

      instructorTagline: 'Coordination, tracking, and synchronization',
      instructorSecurityNotice:
        'Protected access for SENA instructors and coordinators. Enter your institutional security passcode.',
      instructorKeyLabel: 'Enter Instructor Passcode',
      instructorKeyHint:
        'Private passcode exclusively for instructional and administrative staff.',
      enterAsInstructorBtn: 'Enter as Instructor',
      orInstitutionalAuth: 'Or institutional login',
      googleAuthBtn: 'Sign in with SENA Google account',
      connectingGoogle: 'Connecting to Google...',
      instructorPrivilegesTitle: 'Exclusive Instructor Privileges:',
      privilege1: 'Grades and cohort management dashboard',
      privilege2: 'Direct automatic sync with Google Sheets',
      privilege3: 'QR code and direct link generator for apprentices',
      privilege4: 'Architecture diagram and synchronization flow',

      feature1Title: 'Updated 2024 Regulations',
      feature1Desc:
        'Agreement 009 of 2024 and mod. Agreement 002 of 2026 with 6 chapters and practical case studies.',
      feature2Title: 'Automatic Synchronization',
      feature2Desc:
        'Grades are recorded in Google Sheets in the background without manual intervention.',
      feature3Title: 'Digital Certification',
      feature3Desc:
        'Immediate generation with unique cryptographic code upon passing with 80% or higher.',

      videoModalTitle: 'Step-by-Step Guide: Digital Induction',
      videoNotSupported: 'Your browser does not support video playback.',

      footerEntity:
        'National Training Service SENA · Directorate of Vocational Training',
      footerCredits:
        'Digital Induction Prototype · Cohort 2874912 · Colombia 2026',

      docCC: 'Citizenship ID (CC)',
      docTI: 'Identity Card (TI)',
      docCE: 'Foreigner ID (CE)',
      docPPT: 'Temporary Protection Permit (PPT)',
      docPEP: 'Special Stay Permit (PEP)',
      hidePassword: 'Hide password',
      showPassword: 'Show password',
      sampleDataTooltip: 'Load test data automatically',
      closeVideo: 'Close video',

      navPlan: 'Induction Plan',
      navReglamento: '2024 Regulations',
      navSimulador: 'Case Simulator',
      navEvaluacion: 'Evaluation Quiz',
      navCertificado: 'Digital Certificate',
      navCoordinacion: 'Instructor Dashboard',
      navSwitchRole: 'Switch Role',
      navViewCertificate: 'View Certificate',
      navDiploma: 'Diploma',
      navStartQuiz: 'Start Quiz',
      navProfileTitle: 'Configure apprentice profile',
      navExitLandingTitle: 'Return to main role selection portal',
      roleInstructor: 'Instructor',
      roleApprentice: 'Apprentice',

      errFullName: 'Please enter your full name',
      errDocNumber: 'Please enter your document number',
      errFicha: 'Please indicate the cohort number',
      errProgram: 'Please indicate your training program',
      errInstructorPasscode:
        'Incorrect passcode. Please check and try again.',
      errGoogleAuth:
        'Could not authenticate with Google. You can sign in using your authorized institutional passcode.',
      switchThemeLight: 'Switch to light mode',
      switchThemeDark: 'Switch to dark mode',
      languageLabel: 'Language',
    },
  },
};

export type Language = 'es' | 'en';
export type TranslationKey = keyof typeof resources['es']['translation'];

export const getTranslation = (lang: Language, key: TranslationKey): string => {
  return (
    resources[lang]?.translation[key] ||
    resources['es'].translation[key] ||
    (key as string)
  );
};

export const changeAppLanguage = (lang: Language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sena_language', lang);
    window.dispatchEvent(
      new CustomEvent('sena_language_change', { detail: lang })
    );
  }
  i18n.changeLanguage(lang);
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
  },
});

export default i18n;
