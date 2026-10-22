export interface InductionPhase {
  id: string;
  number: string;
  title: string;
  duration: string;
  objective: string;
  competency: string;
  activities: string[];
  deliverable: string;
}

export interface RegulationItem {
  id: string;
  category: 'derecho' | 'deber' | 'prohibicion' | 'falta' | 'medida' | 'novedad' | 'etapa_productiva';
  article: string;
  title: string;
  summary: string;
  fullText: string;
  tags: string[];
  importance: 'alta' | 'media' | 'clave';
  practicalExample: string;
}

export interface CaseDilemma {
  id: string;
  title: string;
  context: string;
  character: string;
  program: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    consequence: string;
    regulationReference: string;
    points: number;
  }[];
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  articleReference: string;
}

export interface ApprenticeProfile {
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP' | 'PPT';
  documentNumber: string;
  fichaNumber: string;
  programName: string;
  regional: string;
  centroFormacion: string;
  modalidad: 'Presencial' | 'Virtual' | 'Mixta';
  inductionCompletedAt?: string;
  verificationCode?: string;
  score?: number;
  avatarId?: string;
}

// Plan Estructurado de Inducción SENA (Acuerdo 009 de 2024)
export const INDUCTION_PLAN: InductionPhase[] = [
  {
    id: 'fase-1',
    number: '01',
    title: 'Identidad Institucional y Cultura SENA',
    duration: 'Día 1 · 8 Horas',
    objective: 'Reconocer la historia, misión, símbolos patrios e institucionales del SENA, y su rol en el desarrollo social y productivo de Colombia.',
    competency: 'Interactuar en los contextos productivos y sociales en función de los principios y valores universales institucionales.',
    activities: [
      'Bienvenida por directivas y coordinaciones del Centro de Formación',
      'Recorrido virtual y presencial por ambientes de aprendizaje, bienestar y biblioteca',
      'Historia de la entidad (Ley 119 de 1994) y valores: Libertad, Justicia, Solidaridad',
      'Activación de credenciales en el ecosistema digital: Zajuna y SOFIA Plus'
    ],
    deliverable: 'Cuestionario de identidad y perfil de aprendiz completado en plataforma Zajuna'
  },
  {
    id: 'fase-2',
    number: '02',
    title: 'Nuevo Reglamento del Aprendiz (Acuerdo 009 de 2024)',
    duration: 'Día 2 · 8 Horas',
    objective: 'Apropiar de forma integral los derechos, deberes, prohibiciones y régimen disciplinario que rigen la vida académica del aprendiz.',
    competency: 'Asumir los deberes y derechos con base en la adopción del Acuerdo 009 de 2024 que deroga regulaciones previas.',
    activities: [
      'Estudio comparativo y novedades del Acuerdo 009 de 2024',
      'Análisis guiado de derechos académicos y garantías de debido proceso',
      'Taller práctico de deberes en talleres, laboratorios y plataformas virtuales',
      'Clasificación de faltas (Leves, Graves, Gravísimas) y criterios de graduación'
    ],
    deliverable: 'Resolución interactiva de casos de estudio sobre faltas y debido proceso'
  },
  {
    id: 'fase-3',
    number: '03',
    title: 'Ruta Formativa: Etapa Lectiva y Etapa Productiva',
    duration: 'Día 3 · 6 Horas',
    objective: 'Comprender la articulación pedagógica entre la etapa lectiva y las distintas alternativas válidas para la etapa productiva.',
    competency: 'Gestionar oportunamente las novedades y proyectar la alternativa de etapa práctica según el perfil ocupacional.',
    activities: [
      'Exploración de modalidades productivas: Contrato de Aprendizaje, Vínculo Laboral, Pasantía, Proyecto Productivo SENNOVA y Monitoría',
      'Gestión de novedades académicas: Traslados, aplazamientos, reingresos y retiros voluntarios',
      'Uso del Sistema de Gestión Virtual de Aprendices (SGVA) y Agencia Pública de Empleo (APE)',
      'Protocolos de Seguridad y Salud en el Trabajo (SST) y uso de Elementos de Protección Personal (EPP)'
    ],
    deliverable: 'Ficha de proyección ocupacional y selección tentativa de modalidad productiva'
  },
  {
    id: 'fase-4',
    number: '04',
    title: 'Bienestar al Aprendiz y Liderazgo SENA',
    duration: 'Día 4 · 6 Horas',
    objective: 'Integrar los servicios de apoyo psicosocial, salud, deporte, arte, cultura, apoyos de sostenimiento y participación democrática.',
    competency: 'Ejercer liderazgo transformador y participación democrática como vocero o representante estudiantil.',
    activities: [
      'Presentación de las líneas de Bienestar: Deporte, Cultura, Psicología, Salud, Apoyos FIC',
      'Convocatoria y cronograma de elección de voceros de ficha y representación de Centro',
      'Taller de habilidades blandas, ética profesional y comunicación asertiva',
      'Simulador de dilemas éticos y convivencia ciudadana en ambientes de formación'
    ],
    deliverable: 'Elección democrática del Vocero de Ficha y firma del acta de concertación'
  },
  {
    id: 'fase-5',
    number: '05',
    title: 'Evaluación Gamificada y Certificación de Inducción',
    duration: 'Día 5 · 4 Horas',
    objective: 'Validar y certificar los conocimientos adquiridos mediante la evaluación gamificada del saber institucional.',
    competency: 'Demostrar dominio normativo e idoneidad institucional para el inicio formal del programa de formación.',
    activities: [
      'Repaso general con simulador de situaciones cotidianas del aprendiz',
      'Presentación de la Evaluación Integral del Reglamento (umbral aprobatorio: 80%)',
      'Retroalimentación formativa de respuestas con citas del articulado',
      'Generación y registro del Certificado Oficial Digital de Inducción con código QR verificable'
    ],
    deliverable: 'Certificado Digital de Inducción SENA expedido y firmado'
  }
];

// Articulado e información clave del Acuerdo 009 de 2024
export const SENA_REGULATION_ARTICLES: RegulationItem[] = [
  {
    id: 'art-der-1',
    category: 'derecho',
    article: 'Acuerdo 009/2024 - Cap. II, Art. 7',
    title: 'Formación Profesional Integral y de Calidad',
    summary: 'Recibir formación profesional integral de acuerdo con el diseño curricular, haciendo uso de ambientes, talleres, tecnología y bibliotecas del SENA.',
    fullText: 'El aprendiz tiene derecho a recibir formación profesional integral acorde con las competencias del programa matriculado, con acompañamiento idóneo de instructores y acceso sin discriminación a todos los recursos físicos y tecnológicos de la institución.',
    tags: ['Formación', 'Calidad', 'Ambientes'],
    importance: 'clave',
    practicalExample: 'Tienes derecho a que tus clases cuenten con instructores asignados, talleres equipados con materiales para prácticas y acceso al LMS Zajuna.'
  },
  {
    id: 'art-der-2',
    category: 'derecho',
    article: 'Acuerdo 009/2024 - Cap. II, Art. 7',
    title: 'Identificación Institucional (Carné)',
    summary: 'Recibir el carné institucional digital o físico que lo acredita como Aprendiz SENA con vigencia durante todo el proceso formativo.',
    fullText: 'Todo aprendiz debidamente matriculado tiene derecho a recibir gratuitamente el documento de identificación institucional que lo acredita como integrante de la comunidad SENA ante las autoridades y entidades en convenio.',
    tags: ['Carné', 'Identidad', 'Seguridad'],
    importance: 'alta',
    practicalExample: 'Tu carné te autoriza a ingresar a cualquier sede SENA del país y a solicitar préstamos de equipos y libros.'
  },
  {
    id: 'art-der-3',
    category: 'derecho',
    article: 'Acuerdo 009/2024 - Cap. II, Art. 7',
    title: 'Garantía del Debido Proceso y Defensa',
    summary: 'Ser escuchado, respetado y ejercer su derecho a la contradicción y defensa frente a cualquier procedimiento formativo o disciplinario.',
    fullText: 'En cualquier queja, informe o requerimiento ante el Comité de Evaluación y Seguimiento, el aprendiz goza de presunción de inocencia, notificación formal, plazo para descargos y aporte de pruebas conforme a los principios constitucionales.',
    tags: ['Debido Proceso', 'Descargos', 'Comité'],
    importance: 'clave',
    practicalExample: 'Si un instructor reporta un incumplimiento, el Centro debe notificarte por escrito y concederte audiencia de descargos antes de cualquier medida.'
  },
  {
    id: 'art-der-4',
    category: 'derecho',
    article: 'Acuerdo 009/2024 - Cap. II, Art. 7',
    title: 'Servicios de Bienestar al Aprendiz',
    summary: 'Beneficiarse de los programas de salud, apoyo psicosocial, deporte, cultura, apoyos económicos de sostenimiento y monitorías.',
    fullText: 'El SENA garantiza el acceso a programas que promueven la permanencia y el desarrollo humano integral del aprendiz a través de las diversas líneas del Plan Nacional Integral de Bienestar.',
    tags: ['Bienestar', 'Salud', 'Sostenimiento'],
    importance: 'media',
    practicalExample: 'Puedes postularte a apoyos de transporte, alimentación, monitorías remuneradas o participar en torneos deportivos y grupos de danzas.'
  },
  {
    id: 'art-deb-1',
    category: 'deber',
    article: 'Acuerdo 009/2024 - Cap. III, Art. 9',
    title: 'Porte Permanente y Visible del Carné',
    summary: 'Portar el carné de aprendiz visible en el pecho en todas las sedes del SENA y eventos oficiales.',
    fullText: 'Es deber fundamental del aprendiz portar permanentemente en lugar visible del pecho el carné de identificación institucional mientras permanezca en los ambientes de formación y dependencias del SENA, así como presentarlo a requerimiento de los colaboradores y vigilantes.',
    tags: ['Carné', 'Seguridad', 'Identificación'],
    importance: 'clave',
    practicalExample: 'No se permite guardar el carné en el bolsillo o bolso; debe llevarse visible en la cinta o solapa por seguridad de toda la comunidad.'
  },
  {
    id: 'art-deb-2',
    category: 'deber',
    article: 'Acuerdo 009/2024 - Cap. III, Art. 9',
    title: 'Uso de Elementos de Protección Personal (EPP)',
    summary: 'Utilizar obligatoriamente la dotación y EPP reglamentarios en talleres, laboratorios y visitas técnicas.',
    fullText: 'El aprendiz debe acatar con estricta rigurosidad las normas de Seguridad y Salud en el Trabajo (SST), utilizando en todo momento los elementos de protección personal exigidos para la actividad técnica (casco, gafas, guantes, calzado de seguridad, bata, etc.).',
    tags: ['SST', 'Seguridad', 'EPP'],
    importance: 'clave',
    practicalExample: 'Ingresar a un taller de soldadura o mecánica sin botas con puntera o gafas de seguridad constituye falta disciplinaria y riesgo inminente.'
  },
  {
    id: 'art-deb-3',
    category: 'deber',
    article: 'Acuerdo 009/2024 - Cap. III, Art. 9',
    title: 'Asistencia y Justificación Oportuna de Inasistencias',
    summary: 'Asistir con puntualidad y justificar ausencias con soporte médico o laboral en un plazo máximo de tres (3) días hábiles.',
    fullText: 'El aprendiz debe cumplir con el horario y cronograma formativo programado. En caso de inasistencia, está obligado a presentar la respectiva justificación documental ante el instructor y coordinación en un término no mayor a tres (3) días hábiles siguientes al hecho.',
    tags: ['Asistencia', 'Puntualidad', 'Plazos'],
    importance: 'clave',
    practicalExample: 'Si te enfermas un martes, debes enviar la incapacidad médica formal de tu EPS a más tardar el viernes de esa misma semana.'
  },
  {
    id: 'art-deb-4',
    category: 'deber',
    article: 'Acuerdo 009/2024 - Cap. III, Art. 9',
    title: 'Honestidad Intelectual y Propiedad de Evidencias',
    summary: 'Desarrollar de forma ética y personal las evidencias de aprendizaje, citando autores y evitando el plagio o fraude.',
    fullText: 'Garantizar que todo producto, informe o proyecto entregado sea de su autoría o cuente con las correspondientes normas de citación y derechos de autor, absteniéndose de pagar o permitir la suplantación en plataformas virtuales.',
    tags: ['Ética', 'Evidencias', 'Antiplagio'],
    importance: 'clave',
    practicalExample: 'Copiar trabajos de compañeros o usar inteligencia artificial para entregar evidencias completas sin análisis ni autorización del instructor vulnera la honestidad.'
  },
  {
    id: 'art-pro-1',
    category: 'prohibicion',
    article: 'Acuerdo 009/2024 - Cap. IV, Art. 11',
    title: 'Sustancias Psicoactivas, Alcohol y Tabaco',
    summary: 'Consumir, portar, distribuir o ingresar bajo los efectos de sustancias alcohólicas o psicoactivas en cualquier sede SENA.',
    fullText: 'Se prohíbe terminantemente ingresar, expender, consumir o comercializar bebidas embriagantes, estupefacientes o sustancias psicoactivas dentro de los centros de formación y demás instalaciones donde se desarrollen actividades de formación integral.',
    tags: ['Cero Tolerancia', 'Convivencia', 'Sustancias'],
    importance: 'clave',
    practicalExample: 'Llegar a clase con aliento alcohólico o con cigarrillos en zonas comunes es causal inmediata de reporte disciplinario grave.'
  },
  {
    id: 'art-pro-2',
    category: 'prohibicion',
    article: 'Acuerdo 009/2024 - Cap. IV, Art. 11',
    title: 'Proselitismo Político o Religioso y Discriminación',
    summary: 'Realizar proselitismo político o religioso, o cualquier forma de discriminación de género, etnia, credo u orientación.',
    fullText: 'Está prohibido utilizar los ambientes de formación y canales institucionales para actividades proselitistas, así como vulnerar la dignidad de los miembros de la comunidad mediante acoso, racismo o violencia de género.',
    tags: ['Respeto', 'Inclusión', 'No Proselitismo'],
    importance: 'alta',
    practicalExample: 'No se permite repartir propaganda electoral ni crear foros de adoctrinamiento religioso en los canales de Zajuna.'
  },
  {
    id: 'art-fal-1',
    category: 'falta',
    article: 'Acuerdo 009/2024 - Cap. V, Arts. 14-18',
    title: 'Clasificación de Faltas: Académicas y Disciplinarias',
    summary: 'Las faltas se clasifican en Leves, Graves y Gravísimas según su intencionalidad, reiteración y daño a la comunidad.',
    fullText: 'Las faltas académicas están ligadas directamente al incumplimiento del proceso de aprendizaje y evidencias. Las faltas disciplinarias se relacionan con la convivencia, el orden y las prohibiciones institucionales. Su gravedad se determina conforme a la concurrencia, reincidencia y perjuicio causado.',
    tags: ['Faltas', 'Clasificación', 'Criterios'],
    importance: 'clave',
    practicalExample: 'Una inasistencia sin justificar puede ser falta leve; suplantar a un compañero en una prueba en Zajuna es falta gravísima.'
  },
  {
    id: 'art-med-1',
    category: 'medida',
    article: 'Acuerdo 009/2024 - Cap. VI, Arts. 21-25',
    title: 'Medidas Formativas: Planes de Mejoramiento',
    summary: 'Llamado de atención verbal y Planes de Mejoramiento Académico o Disciplinario concertados para corregir conductas.',
    fullText: 'Las medidas formativas son acciones pedagógicas para encauzar el desempeño del aprendiz. Ante dificultades académicas o disciplinarias leves, el instructor o comité concierta un Plan de Mejoramiento con objetivos y plazos específicos de cumplimiento (máximo 1 mes).',
    tags: ['Pedagogía', 'Mejoramiento', 'Acompañamiento'],
    importance: 'clave',
    practicalExample: 'Si no alcanzas el resultado de aprendizaje en un módulo, el instructor formulará un Plan de Mejoramiento con nuevas evidencias orientadas.'
  },
  {
    id: 'art-nov-1',
    category: 'novedad',
    article: 'Acuerdo 009/2024 - Cap. VII, Arts. 28-32',
    title: 'Novedades de Matrícula: Traslado, Aplazamiento y Retiro',
    summary: 'Trámites oficiales en SOFIA Plus para modificar el estado del aprendiz (Traslado, Aplazamiento hasta por 6 meses, Retiro Voluntario).',
    fullText: 'El aprendiz puede solicitar ante el Subdirector de Centro el aplazamiento de su formación por causas debidamente justificadas hasta por un plazo máximo de seis (6) meses, prorrogables por una sola vez según análisis del caso.',
    tags: ['Novedades', 'Aplazamiento', 'SOFIA Plus'],
    importance: 'alta',
    practicalExample: 'Si debes ausentarte por calamidad o viaje laboral temporal, debes radicar solicitud formal de aplazamiento antes de ausentarte para no ser cancelado por deserción.'
  },
  {
    id: 'art-ep-1',
    category: 'etapa_productiva',
    article: 'Acuerdo 009/2024 - Cap. VIII, Arts. 35-40',
    title: 'Modalidades de Etapa Productiva',
    summary: 'Cinco alternativas oficiales: Contrato de Aprendizaje, Vínculo Laboral, Pasantía, Proyecto Productivo SENNOVA y Monitoría.',
    fullText: 'La etapa productiva permite aplicar y complementar las competencias adquiridas en la etapa lectiva. El aprendiz puede concertar cualquiera de las modalidades autorizadas, cumpliendo con la bitácora quincenal y el acompañamiento del instructor técnico asignado.',
    tags: ['Contrato', 'Pasantía', 'Proyecto'],
    importance: 'clave',
    practicalExample: 'En el Contrato de Aprendizaje recibes apoyo de sostenimiento económico regulado por la ley laboral y afiliación a EPS y ARL.'
  }
];

// Casos Reales del Simulador de Convivencia y Dilemas
export const SIMULATION_CASES: CaseDilemma[] = [
  {
    id: 'caso-1',
    title: 'Dilema 1: El Carné Olvidado y el Ingreso al Centro',
    context: 'Mateo llega a la sede del Centro de Electricidad y Automatización y se da cuenta de que olvidó su carné en casa. Tiene una evaluación técnica crucial en 10 minutos con su ficha.',
    character: 'Mateo (Aprendiz de Mantenimiento Electromecánico)',
    program: 'Tecnólogo en Mantenimiento Electromecánico',
    options: [
      {
        id: 'opt-1a',
        text: 'Pedirle el carné prestado a su amigo Julián de otra ficha para engañar al vigilante en la portería.',
        isCorrect: false,
        consequence: 'Grave falta disciplinaria: La suplantación y el préstamo de carné se consideran faltas disciplinarias graves (Acuerdo 009 de 2024, Art. 11 y 15). Puede derivar en llamado de atención escrito o proceso disciplinario para ambos.',
        regulationReference: 'Acuerdo 009 de 2024 - Prohibiciones expresas y uso del carné institucional.',
        points: 0
      },
      {
        id: 'opt-1b',
        text: 'Identificarse con su cédula de ciudadanía en portería, solicitar registro manual temporal en el libro de novedades e informar de inmediato al instructor.',
        isCorrect: true,
        consequence: '¡Excelente decisión! Actuaste con transparencia y responsabilidad. La portería verificará tu matrícula activa en el sistema y podrás ingresar sin incurrir en faltas reglamentarias.',
        regulationReference: 'Acuerdo 009 de 2024 - Art. 9: Deberes del aprendiz y protocolos de seguridad física.',
        points: 20
      },
      {
        id: 'opt-1c',
        text: 'Saltarse la valla perimetral por la zona verde trasera del Centro para no perder la evaluación.',
        isCorrect: false,
        consequence: 'Conducta temeraria y falta disciplinaria grave que pone en riesgo tu seguridad física y viola la custodia de las instalaciones públicas del SENA.',
        regulationReference: 'Acuerdo 009 de 2024 - Faltas que atentan contra la seguridad del Centro.',
        points: 0
      }
    ]
  },
  {
    id: 'caso-2',
    title: 'Dilema 2: Evidencia Virtual en la Plataforma Zajuna',
    context: 'Camila tiene que subir el informe final de algoritmos a Zajuna antes de medianoche. No alcanzó a terminarlo por cuestiones familiares y un compañero le ofrece su archivo para cambiarle la portada.',
    character: 'Camila (Aprendiz de ADSO - Software)',
    program: 'Tecnólogo en Análisis y Desarrollo de Software',
    options: [
      {
        id: 'opt-2a',
        text: 'Cambiar la portada y el título del código de su compañero para radicarlo como propio antes de que cierre el enlace.',
        isCorrect: false,
        consequence: 'Incurres en Plagio y Fraude Académico. El sistema antiplagio y la revisión del instructor detectarán la similitud, configurando falta académica grave con reporte ante el Comité de Evaluación.',
        regulationReference: 'Acuerdo 009 de 2024 - Art. 11: Prohibición de plagio y alteración de evidencias.',
        points: 0
      },
      {
        id: 'opt-2b',
        text: 'Subir el avance genuino que tiene, escribirle un mensaje al instructor en Zajuna explicando la situación y concertar entrega con plan de mejoramiento.',
        isCorrect: true,
        consequence: '¡Conducta ética ejemplar! El instructor valorará tu honestidad académica. Según el reglamento, tienes derecho a concertar un Plan de Mejoramiento Académico para alcanzar el resultado.',
        regulationReference: 'Acuerdo 009 de 2024 - Art. 22: Procedimiento de Medidas Formativas y Planes de Mejoramiento.',
        points: 20
      },
      {
        id: 'opt-2c',
        text: 'No subir nada, no avisar al instructor y esperar a que pasen tres semanas para ver si se dan cuenta.',
        isCorrect: false,
        consequence: 'El no envío reiterado de evidencias sin soporte conduce a reporte por incumplimiento injustificado y eventual llamado de atención escrito.',
        regulationReference: 'Acuerdo 009 de 2024 - Incumplimientos en la etapa lectiva.',
        points: 5
      }
    ]
  },
  {
    id: 'caso-3',
    title: 'Dilema 3: Seguridad y Elementos de Protección en el Taller',
    context: 'En el taller de carpintería y manufactura, David nota que hace mucho calor y decide quitarse las gafas de seguridad y los guantes mientras opera una sierra circular porque "le resulta incómodo".',
    character: 'David (Aprendiz de Diseño de Mobiliario)',
    program: 'Técnico en Fabricación de Muebles Contemporáneos',
    options: [
      {
        id: 'opt-3a',
        text: 'Continuar operando la maquinaria sin EPP, argumentando que él tiene experiencia previa en su casa.',
        isCorrect: false,
        consequence: 'Violación crítica de las normas de Seguridad y Salud en el Trabajo (SST). El instructor debe suspender de inmediato la actividad del aprendiz por riesgo vital inminente.',
        regulationReference: 'Acuerdo 009 de 2024 - Art. 9 numeral 8: Obligatoriedad de normas de bioseguridad y SST.',
        points: 0
      },
      {
        id: 'opt-3b',
        text: 'Pausar la máquina, hidratarse, colocarse correctamente las gafas y guantes reglamentarios y verificar las condiciones de ventilación con el instructor.',
        isCorrect: true,
        consequence: '¡Excelente cultura de autocuidado! En el SENA la vida y la seguridad ocupacional son principios no negociables.',
        regulationReference: 'Acuerdo 009 de 2024 - Deberes de autocuidado y preservación en ambientes técnicos.',
        points: 20
      }
    ]
  },
  {
    id: 'caso-4',
    title: 'Dilema 4: Novedad Laboral y Aplazamiento Oportuno',
    context: 'Sofía recibe una oferta de trabajo temporal de 4 meses en otra ciudad que le impide asistir a sus clases nocturnas en el SENA. Desea no perder su cupo en el tecnólogo.',
    character: 'Sofía (Aprendiz de Gestión Empresarial)',
    program: 'Tecnólogo en Gestión Empresarial',
    options: [
      {
        id: 'opt-4a',
        text: 'Dejar de asistir sin avisar, pensando que el SENA le guardará el cupo indefinidamente de manera automática.',
        isCorrect: false,
        consequence: 'Deserción escolar: Pasadas 3 inasistencias injustificadas continuas, se inicia trámite de deserción y cancelación de matrícula con sanción de 6 meses para volver a inscribirse.',
        regulationReference: 'Acuerdo 009 de 2024 - Art. 29: Trámite de deserción y consecuencias.',
        points: 0
      },
      {
        id: 'opt-4b',
        text: 'Radicar formalmente la solicitud de Aplazamiento de matrícula adjuntando la carta laboral en SOFIA Plus y remitirla a Coordinación Académica.',
        isCorrect: true,
        consequence: '¡Decisión acertada! El reglamento autoriza el aplazamiento de hasta por seis (6) meses por motivos laborales o médicos, conservando tu estado y permitiendo un reingreso legal.',
        regulationReference: 'Acuerdo 009 de 2024 - Art. 30: Novedad de Aplazamiento y Reingreso.',
        points: 20
      }
    ]
  }
];

// Preguntas para la Evaluación Gamificada
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'Normativa Vigente',
    question: '¿Cuál es el acto administrativo que adopta y reglamenta el actual Reglamento del Aprendiz SENA, derogando el Acuerdo 007 de 2012 y normas previas?',
    options: [
      'Acuerdo 009 de 2024',
      'Resolución 1020 de 2018',
      'Decreto 4108 de 2011',
      'Acuerdo 003 de 2015'
    ],
    correctIndex: 0,
    explanation: 'El Consejo Directivo Nacional del SENA expidió el Acuerdo 009 de 2024, renovando el marco normativo de derechos, deberes y medidas formativas.',
    articleReference: 'Acuerdo 009 de 2024 - Preámbulo y Disposiciones Generales.'
  },
  {
    id: 'q2',
    category: 'Derechos del Aprendiz',
    question: 'Si un aprendiz es citado ante el Comité de Evaluación y Seguimiento por presunto incumplimiento disciplinario, ¿cuál garantía fundamental le asiste?',
    options: [
      'Sanción automática sin escuchar su versión',
      'Debido proceso, presunción de inocencia, derecho a la defensa y notificación previa',
      'Pérdida inmediata e irrevocable de su cupo en el SENA',
      'Pago obligatorio de una fianza económica'
    ],
    correctIndex: 1,
    explanation: 'El debido proceso es una garantía constitucional consagrada en el Capítulo II y Capítulo VI del Acuerdo 009 de 2024. El aprendiz tiene derecho a ser escuchado y aportar pruebas.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. II, Art. 7 (Garantías de Debido Proceso).'
  },
  {
    id: 'q3',
    category: 'Deberes del Aprendiz',
    question: 'En caso de no poder asistir a una sesión de formación por una urgencia médica, ¿cuál es el plazo máximo reglamentario para presentar la incapacidad ante el instructor?',
    options: [
      'El mismo día antes de mediodía',
      'Hasta un mes después de ocurrida la falta',
      'Máximo tres (3) días hábiles siguientes al hecho',
      'Al finalizar el trimestre lectivo'
    ],
    correctIndex: 2,
    explanation: 'El reglamento estipula que el aprendiz cuenta con un término de hasta tres (3) días hábiles para justificar su inasistencia con los soportes de ley.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. III, Art. 9 (Justificación de Inasistencias).'
  },
  {
    id: 'q4',
    category: 'Deberes y Seguridad',
    question: '¿Cómo debe portar el carné de aprendiz un estudiante mientras permanezca en los ambientes de formación y sedes del SENA?',
    options: [
      'Guardado en la billetera o maletín personal',
      'Permanentemente y en lugar visible del pecho',
      'Únicamente se debe mostrar si el celador lo exige al salir',
      'Solo los días viernes en actividades culturales'
    ],
    correctIndex: 1,
    explanation: 'El porte permanente y visible del carné es un deber institucional para garantizar la seguridad de toda la comunidad educativa y control de acceso.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. III, Art. 9.'
  },
  {
    id: 'q5',
    category: 'Prohibiciones',
    question: '¿Cuál de las siguientes acciones está EXPRESAMENTE PROHIBIDA en el Reglamento del Aprendiz SENA?',
    options: [
      'Postularse como vocero de la ficha formativa',
      'Solicitar asesoría de Bienestar al Aprendiz',
      'Consumir o ingresar bajo efectos de sustancias psicoactivas o bebidas alcohólicas',
      'Acceder a la biblioteca virtual en días no laborales'
    ],
    correctIndex: 2,
    explanation: 'El consumo, porte o distribución de sustancias psicoactivas o alcohol en instalaciones o eventos institucionales es una prohibición taxativa y falta gravísima.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. IV, Art. 11.'
  },
  {
    id: 'q6',
    category: 'Medidas Formativas',
    question: '¿Qué es un Plan de Mejoramiento Académico según el nuevo reglamento?',
    options: [
      'Una sanción económica que descuenta dinero al aprendiz',
      'Una medida pedagógica formativa concertada con el instructor para alcanzar los resultados de aprendizaje no logrados',
      'Una expulsión inmediata del centro de formación',
      'Un examen escrito elaborado por el Ministerio de Educación'
    ],
    correctIndex: 1,
    explanation: 'El Plan de Mejoramiento es una medida formativa preventiva y pedagógica que otorga al aprendiz un periodo específico para subsanar deficiencias en sus evidencias.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. VI, Art. 22.'
  },
  {
    id: 'q7',
    category: 'Novedades de Formación',
    question: '¿Por cuánto tiempo máximo un aprendiz puede solicitar formalmente el Aplazamiento de su programa de formación?',
    options: [
      'Hasta por dos años continuos',
      'Máximo 15 días calendario',
      'Hasta por seis (6) meses, prorrogables justificadamente según análisis del Centro',
      'Solo aplica durante la primera semana de clases'
    ],
    correctIndex: 2,
    explanation: 'El aplazamiento puede solicitarse formalmente por motivos comprobados hasta por seis (6) meses en el sistema SOFIA Plus.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. VII, Art. 30.'
  },
  {
    id: 'q8',
    category: 'Etapa Productiva',
    question: '¿Cuál de las siguientes es una alternativa oficial y válida para realizar la Etapa Productiva en el SENA?',
    options: [
      'Contrato de Aprendizaje empresarial',
      'Proyecto Productivo formativo (SENNOVA / Fondo Emprender)',
      'Pasantía o Vínculo Laboral afín al programa',
      'Todas las anteriores son modalidades válidas'
    ],
    correctIndex: 3,
    explanation: 'El SENA reconoce múltiples modalidades para la etapa práctica: Contrato de Aprendizaje, Vínculo Laboral, Pasantías, Proyectos Productivos y Monitorías.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. VIII, Art. 36.'
  },
  {
    id: 'q9',
    category: 'Representación y Liderazgo',
    question: '¿Quién es el Vocero de Ficha y cómo es elegido?',
    options: [
      'Es nombrado a dedo por el Subdirector de Centro',
      'Es un aprendiz elegido democráticamente por sus compañeros de grupo para representar la ficha y liderar la concertación',
      'Es el aprendiz con mayor edad del salón',
      'Es el delegado de la empresa patrocinadora'
    ],
    correctIndex: 1,
    explanation: 'El Vocero de Ficha es elegido de forma democrática y transparente por los aprendices de su misma ficha durante las jornadas de inducción.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. IX (Representación del Aprendiz).'
  },
  {
    id: 'q10',
    category: 'Honestidad Académica',
    question: 'Presentar como propia una evidencia de aprendizaje realizada por otra persona o copiada íntegramente de internet se califica como:',
    options: [
      'Un acto de trabajo colaborativo recomendado',
      'Falta académica grave por plagio y suplantación intelectual',
      'Una sugerencia de innovación didáctica',
      'Conducta libre sin regulación institucional'
    ],
    correctIndex: 1,
    explanation: 'El plagio vulnera la honestidad académica y los derechos de autor, acarreando anulación de la evidencia y trámite sancionatorio.',
    articleReference: 'Acuerdo 009 de 2024 - Cap. IV y V (De la honestidad en el proceso evaluativo).'
  }
];

// Valores Institucionales del SENA
export const SENA_CORE_VALUES = [
  {
    title: 'Dignidad Humana',
    description: 'Reconocimiento de la persona como sujeto de derechos inalienables y centro del proceso pedagógico.'
  },
  {
    title: 'Libertad con Responsabilidad',
    description: 'Capacidad de autodeterminación con plena conciencia de las consecuencias individuales y colectivas.'
  },
  {
    title: 'Justicia y Equidad',
    description: 'Garantía de oportunidades sin distinciones de género, etnia, credo u origen socioeconómico.'
  },
  {
    title: 'Solidaridad y Convivencia',
    description: 'Compromiso con el bienestar de la comunidad y el desarrollo productivo sustentable de Colombia.'
  }
];
