import { ProjectTemplate, Language, Question } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    hub: "Session Hub",
    newSession: "New Session",
    importDoc: "Import Doc",
    noAnalysis: "No analysis yet",
    backToHub: "Back to Hub",
    dashboard: "Dashboard",
    interviews: "Interviews",
    deepResearch: "Deep Research",
    exportData: "Export Data",
    startInterview: "Start Interview",
    totalInterviews: "Total Interviews",
    avgScore: "Avg Score",
    marketVerdict: "Market Verdict",
    earlyAdopter: "Early Adopter Profile",
    swotAnalysis: "SWOT Analysis",
    lastInsight: "Last Insight",
    viability: "Viability",
    reAnalyze: "Re-Analyze",
    runResearch: "Run Deep Research",
    researching: "Analyzing patterns...",
    progressReading: "Reading interviews...",
    progressPattern: "Detecting patterns...",
    progressVerdict: "Generating verdict...",
    newCandidate: "New Candidate",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    obsLabel: "Observations",
    nextQuestion: "Next Question",
    projectName: "Project Name",
    projectDesc: "Description",
    dragDrop: "Paste your document text here...",
    smartParseDesc: "AI will extract name, description and questions.",
    parsing: "Parsing...",
    create: "Create Session"
  },
  es: {
    hub: "Centro de Sesiones",
    newSession: "Nuevo Proyecto",
    importDoc: "Importar Doc",
    noAnalysis: "Sin análisis aún",
    backToHub: "Volver",
    dashboard: "Tablero",
    interviews: "Entrevistas",
    deepResearch: "Análisis Profundo",
    exportData: "Exportar Datos",
    startInterview: "Iniciar Entrevista",
    totalInterviews: "Total Entrevistas",
    avgScore: "Puntaje Promedio",
    marketVerdict: "Veredicto de Mercado",
    earlyAdopter: "Perfil Early Adopter",
    swotAnalysis: "Análisis DOFA",
    lastInsight: "Último Insight",
    viability: "Viabilidad",
    reAnalyze: "Re-Analizar",
    runResearch: "Ejecutar Deep Research",
    researching: "Analizando patrones...",
    progressReading: "Leyendo entrevistas...",
    progressPattern: "Detectando patrones...",
    progressVerdict: "Generando veredicto...",
    newCandidate: "Nuevo Candidato",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    phone: "Teléfono / WhatsApp",
    obsLabel: "Observaciones del Entrevistador",
    nextQuestion: "Siguiente Pregunta",
    projectName: "Nombre del Proyecto",
    projectDesc: "Descripción",
    dragDrop: "Pega el texto de tu documento aquí...",
    smartParseDesc: "La IA extraerá nombre, descripción y preguntas.",
    parsing: "Analizando...",
    create: "Crear Sesión"
  }
};



const BIOHACKING_QUESTIONS: Question[] = [
  {
    id: 'p1',
    order: 1,
    text: '¿Podrías describir tu "rutina de optimización" típica en una semana?',
    type: 'text',
    widgetType: 'default', // Reverted from keyword_cloud
    dimension: 'currentBehavior',
    weight: 0.08,
    required: true,
    imageKeyword: 'routine schedule calendar biohacking'
  },
  {
    id: 'p2',
    order: 2,
    text: 'Del 1 al 10, ¿qué tan satisfecho/a estás con los resultados que ves actualmente?',
    type: 'scale',
    widgetType: 'default', // Reverted from gauge_1_10
    dimension: 'painPoint',
    weight: 0.12,
    required: true,
    imageKeyword: 'satisfaction feedback survey'
  },
  {
    id: 'p3',
    order: 3,
    text: '¿Cada cuánto renuevas/compras tus productos de skincare?',
    type: 'select',
    widgetType: 'default',
    options: [
      'No uso productos especializados',
      'Cada 4-6 meses (básico)',
      'Cada 2-3 meses (regular)',
      'Mensualmente (frecuente)',
      'Tengo suscripción/compro constantemente'
    ],
    dimension: 'problemIntensity',
    weight: 0.15,
    required: true,
    imageKeyword: 'skincare products shopping'
  },
  {
    id: 'p4',
    order: 4,
    text: 'Aproximadamente, ¿cuánto gastas cuando renuevas tu skincare? (en COP)',
    type: 'select',
    widgetType: 'default', // Reverted from currency_bucket
    options: [
      '$0 - $150,000 COP',
      '$151,000 - $400,000 COP',
      '$401,000 - $800,000 COP',
      '$801,000 - $1,500,000 COP',
      'Más de $1,500,000 COP'
    ],
    dimension: 'problemIntensity',
    weight: 0.12,
    required: true,
    imageKeyword: 'money wallet expensive luxury'
  },
  {
    id: 'p5',
    order: 5,
    text: '¿Tomas suplementos actualmente? Si sí, ¿cuáles y cuánto gastas al mes aproximadamente?',
    type: 'text',
    widgetType: 'default',
    dimension: 'problemIntensity',
    weight: 0.18,
    required: true,
    imageKeyword: 'supplements vitamins pills'
  },
  {
    id: 'p6',
    order: 6,
    text: '¿Usas algún wearable o dispositivo de tracking? (reloj inteligente, anillo, etc)',
    type: 'select', 
    widgetType: 'default', // Reverted from boolean_donut
    options: [
      'No uso ninguno',
      'Apple Watch',
      'Oura Ring',
      'Whoop',
      'Fitbit',
      'Garmin',
      'Xiaomi Mi Band u otro básico',
      'Dispositivos médicos'
    ],
    dimension: 'earlyAdopter',
    weight: 0.08,
    required: false,
    imageKeyword: 'smartwatch wearable tech'
  },
  {
    id: 'p7',
    order: 7,
    text: 'Si tuvieras que elegir 3 cosas de tu rutina actual que ELIMINARÍAS porque no estás seguro/a de si realmente funcionan, ¿cuáles serían?',
    type: 'text',
    widgetType: 'default', // Reverted from keyword_cloud
    dimension: 'painPoint',
    weight: 0.15,
    required: true,
    imageKeyword: 'uncertainty doubt confusion'
  },
  {
    id: 'p8',
    order: 8,
    text: '¿Alguna vez has intentado cruzar tus datos de sueño/estrés con cambios visibles en tu piel, energía o peso? ¿Cómo lo haces?',
    type: 'text',
    widgetType: 'default',
    dimension: 'painPoint',
    weight: 0.10,
    required: true,
    imageKeyword: 'data analysis chart health'
  },
  {
    id: 'p9',
    order: 9,
    text: 'Del 1 al 10, ¿qué tan seguro/a estás de que tu suplemento MÁS CARO está generando un efecto real y medible?',
    type: 'scale',
    widgetType: 'default', // Reverted from gauge_1_10
    dimension: 'painPoint',
    weight: 0.12,
    required: true,
    imageKeyword: 'trust confidence verification'
  },
  {
    id: 'p10',
    order: 10,
    text: '¿Has comprado algún producto que te prometieron resultados pero NO viste cambios claros?',
    type: 'boolean',
    widgetType: 'default', // Reverted from boolean_donut
    dimension: 'painPoint',
    weight: 0.08,
    required: true,
    imageKeyword: 'disappointment failure scam'
  },
  {
    id: 'p11',
    order: 11,
    text: '¿Cuál es tu mayor frustración con tu rutina actual de optimización?',
    type: 'text',
    widgetType: 'default', // Reverted from keyword_cloud
    dimension: 'painPoint',
    weight: 0.05,
    required: true,
    imageKeyword: 'frustration stress headache'
  },
  {
    id: 'p12',
    order: 12,
    text: '¿Llevas algún tipo de registro de tu rutina? (diario, app, Excel, fotos, etc)',
    type: 'select',
    widgetType: 'default',
    options: [
      'No llevo ningún registro',
      'Fotos ocasionales',
      'Notas mentales',
      'Fotos con fechas + notas',
      'App especializada',
      'Sistema completo (Excel/Apps)'
    ],
    dimension: 'earlyAdopter',
    weight: 0.10,
    required: true,
    imageKeyword: 'journal diary tracking app'
  },
  {
    id: 'p13',
    order: 13,
    text: '¿Qué apps de salud/bienestar usas actualmente?',
    type: 'text',
    widgetType: 'default', // Reverted from keyword_cloud
    dimension: 'currentBehavior',
    weight: 0.03,
    required: false,
    imageKeyword: 'mobile apps phone screen'
  },
  {
    id: 'p14',
    order: 14,
    text: '¿Has notado patrones entre tu estilo de vida y tu apariencia/energía?',
    type: 'text',
    widgetType: 'default',
    dimension: 'currentBehavior',
    weight: 0.07,
    required: true,
    imageKeyword: 'patterns connection mind body'
  },
  {
    id: 'p15',
    order: 15,
    text: 'Imagina una app que cruza datos de wearable, escanea tu rostro y analiza tus suplementos para decirte qué funciona. Del 1 al 5, ¿qué tanto valor tendría?',
    type: 'scale',
    widgetType: 'default', // Reverted from gauge_1_5
    dimension: 'solutionFit',
    weight: 0.25,
    required: true,
    imageKeyword: 'future technology ai app'
  },
  {
    id: 'p16',
    order: 16,
    text: 'Si esa app existiera, ¿cuánto estarías dispuesto/a a pagar mensualmente? (COP)',
    type: 'select',
    widgetType: 'default', // Reverted from currency_bucket
    options: [
      '$0 - No pagaría',
      '$20,000 - $40,000 COP/mes',
      '$41,000 - $70,000 COP/mes',
      '$71,000 - $100,000 COP/mes',
      'Más de $100,000 COP/mes'
    ],
    dimension: 'willingnessToPay',
    weight: 0.30,
    required: true,
    imageKeyword: 'payment credit card subscription'
  },
  {
    id: 'p17',
    order: 17,
    text: '¿Qué features específicas te gustaría que tuviera esa app?',
    type: 'text',
    widgetType: 'default', // Reverted from keyword_cloud
    dimension: 'solutionFit', 
    weight: 0.0,
    required: false,
    imageKeyword: 'wishlist ideas features'
  },
  {
    id: 'p18',
    order: 18,
    text: 'Si lanzáramos una beta privada en los próximos 3 meses, ¿te interesaría probarla?',
    type: 'select',
    widgetType: 'default', // Reverted from boolean_donut
    options: [
      'Sí, quiero probarla cuanto antes',
      'Sí, pero prefiero esperar',
      'Tal vez, depende de las features',
      'No me interesa'
    ],
    dimension: 'earlyAdopter',
    weight: 0.10,
    required: true,
    imageKeyword: 'beta test launch rocket'
  },
  {
    id: 'p19',
    order: 19,
    text: '¿Me darías tu email para enviarte acceso anticipado a la beta?',
    type: 'text',
    widgetType: 'default',
    dimension: 'earlyAdopter',
    weight: 0.12,
    required: false,
    imageKeyword: 'email newsletter signup'
  },
  {
    id: 'p20',
    order: 20,
    text: 'Si pudieras pedirle un consejo a alguien que lleva 10 años optimizándose, ¿qué le preguntarías?',
    type: 'text',
    widgetType: 'default',
    dimension: 'painPoint', 
    weight: 0.05,
    required: true,
    imageKeyword: 'advice mentor wisdom'
  }
];

export const DEMO_PROJECT: ProjectTemplate = {
  id: 'demo_project_001',
  name: 'Holistic Biohacking Colombia',
  description: 'Validación de mercado para soluciones de bienestar integral y optimización biológica personalizada en el mercado latinoamericano.',
  detailedDescription: 'Este proyecto busca validar la demanda de una plataforma de biohacking que integre nutrición, suplementación y tecnología wearable. Nos enfocamos en usuarios de alto rendimiento que buscan optimizar su salud y longevidad mediante datos cuantificables.',
  emoji: '🧬',
  coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1000',
  targetAudience: 'Profesionales de 25-45 años, entusiastas del fitness, early adopters de tecnología de salud.',
  region: 'Colombia / Latam',
  productTypes: ['App', 'SaaS', 'E-commerce'],
  questions: BIOHACKING_QUESTIONS,
  createdAt: new Date().toISOString(),
  deepAnalysis: null
};

export const INITIAL_PROJECTS: ProjectTemplate[] = [
  {
    id: 'proj_biohacking_001',
    name: 'Holistic Biohacking Colombia',
    description: 'Validación de mercado para soluciones de bienestar integral y optimización biológica en el mercado colombiano.',
    emoji: '🧬',
    coverImage: 'https://image.pollinations.ai/prompt/Futuristic%20holistic%20biohacking%20concept%2C%20DNA%20double%20helix%20made%20of%20glowing%20neon%20light%2C%20medical%20technology%20interface%2C%20dark%20void%20background%2C%20glass%20textures%2C%20high%20fidelity%203D%20render%2C%20cinematic%20lighting%2C%20macro%20detail?nologo=true', // Updated via Pollinations
    targetAudience: 'Profesionales de alto rendimiento, entusiastas del fitness y bienestar en Colombia.',
    createdAt: new Date().toISOString(),
    questions: BIOHACKING_QUESTIONS
  }
];
