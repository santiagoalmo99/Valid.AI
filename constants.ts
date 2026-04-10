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
    text: 'Could you describe your typical "optimization routine" in a week?',
    type: 'text',
    widgetType: 'default',
    dimension: 'currentBehavior',
    weight: 0.08,
    required: true,
    imageKeyword: 'routine schedule calendar biohacking'
  },
  {
    id: 'p2',
    order: 2,
    text: 'On a scale of 1-10, how satisfied are you with the results you currently see?',
    type: 'scale',
    widgetType: 'default',
    dimension: 'painPoint',
    weight: 0.12,
    required: true,
    imageKeyword: 'satisfaction feedback survey'
  },
  {
    id: 'p3',
    order: 3,
    text: 'How often do you renew/purchase your specialized skincare or health products?',
    type: 'select',
    widgetType: 'default',
    options: [
      'I do not use specialized products',
      'Every 4-6 months (basic)',
      'Every 2-3 months (regular)',
      'Monthly (frequent)',
      'I have a subscription / buy constantly'
    ],
    dimension: 'problemIntensity',
    weight: 0.15,
    required: true,
    imageKeyword: 'skincare products shopping'
  },
  {
    id: 'p4',
    order: 4,
    text: 'Approximately how much do you spend monthly on health optimization? (USD)',
    type: 'select',
    widgetType: 'default',
    options: [
      '$0 - $50',
      '$51 - $150',
      '$151 - $300',
      '$301 - $600',
      'More than $600'
    ],
    dimension: 'problemIntensity',
    weight: 0.12,
    required: true,
    imageKeyword: 'money wallet expensive luxury'
  },
  {
    id: 'p5',
    order: 5,
    text: 'What specific supplements do you take and what is the primary goal for each?',
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
    text: 'Do you use any wearables or tracking devices? (Smartwatch, Oura, Whoop, etc.)',
    type: 'select', 
    widgetType: 'default',
    options: [
      'None',
      'Apple Watch',
      'Oura Ring',
      'Whoop',
      'Fitbit',
      'Garmin',
      'Basic fitness tracker',
      'Medical grade devices'
    ],
    dimension: 'earlyAdopter',
    weight: 0.08,
    required: false,
    imageKeyword: 'smartwatch wearable tech'
  },
  {
    id: 'p7',
    order: 7,
    text: 'If you had to eliminate 3 things from your routine because you are unsure of their actual efficacy, what would they be?',
    type: 'text',
    widgetType: 'default',
    dimension: 'painPoint',
    weight: 0.15,
    required: true,
    imageKeyword: 'uncertainty doubt confusion'
  },
  {
    id: 'p8',
    order: 8,
    text: 'Have you ever cross-referenced your sleep/stress data with visible changes in your energy or weight?',
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
    text: 'On a scale of 1-10, how confident are you that your MOST EXPENSIVE supplement is producing a measurable effect?',
    type: 'scale',
    widgetType: 'default',
    dimension: 'painPoint',
    weight: 0.12,
    required: true,
    imageKeyword: 'trust confidence verification'
  },
  {
    id: 'p10',
    order: 10,
    text: 'Have you ever bought a product that promised results but failed to show any clear changes?',
    type: 'boolean',
    widgetType: 'default',
    dimension: 'painPoint',
    weight: 0.08,
    required: true,
    imageKeyword: 'disappointment failure scam'
  },
  {
    id: 'p11',
    order: 11,
    text: 'What is the biggest friction point or frustration in your current routine?',
    type: 'text',
    widgetType: 'default',
    dimension: 'painPoint',
    weight: 0.05,
    required: true,
    imageKeyword: 'frustration stress headache'
  },
  {
    id: 'p12',
    order: 12,
    text: 'What kind of routine tracking do you currently maintain? (journal, app, Excel, photos, etc.)',
    type: 'select',
    widgetType: 'default',
    options: [
      'I do not maintain any tracking',
      'Occasional photos',
      'Mental notes only',
      'Photos with dated notes',
      'Specialized health app',
      'Complete tracking system (Excel/Custom)'
    ],
    dimension: 'earlyAdopter',
    weight: 0.10,
    required: true,
    imageKeyword: 'journal diary tracking app'
  },
  {
    id: 'p13',
    order: 13,
    text: 'Which health/wellness apps do you use at least once a week?',
    type: 'text',
    widgetType: 'default',
    dimension: 'currentBehavior',
    weight: 0.03,
    required: false,
    imageKeyword: 'mobile apps phone screen'
  },
  {
    id: 'p14',
    order: 14,
    text: 'Have you documented any clear patterns between your lifestyle and your energy levels?',
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
    text: 'Imagine an app that cross-references wearable data, scans your skin, and analyzes supplement ROI. Scale of 1-5, how valuable is this?',
    type: 'scale',
    widgetType: 'default',
    dimension: 'solutionFit',
    weight: 0.25,
    required: true,
    imageKeyword: 'future technology ai app'
  },
  {
    id: 'p16',
    order: 16,
    text: 'If that app existed, how much would you be willing to invest monthly? (USD)',
    type: 'select',
    widgetType: 'default',
    options: [
      '$0 - Not willing to pay',
      '$10 - $25 USD/mo',
      '$26 - $50 USD/mo',
      '$51 - $100 USD/mo',
      'Premium Custom Pricing (> $100/mo)'
    ],
    dimension: 'willingnessToPay',
    weight: 0.30,
    required: true,
    imageKeyword: 'payment credit card subscription'
  },
  {
    id: 'p17',
    order: 17,
    text: 'What specific features would be non-negotiable for this app?',
    type: 'text',
    widgetType: 'default',
    dimension: 'solutionFit', 
    weight: 0.0,
    required: false,
    imageKeyword: 'wishlist ideas features'
  },
  {
    id: 'p18',
    order: 18,
    text: 'If we launched a private beta in the next 90 days, would you be interested in participating?',
    type: 'select',
    widgetType: 'default',
    options: [
      'Yes, grant me early access',
      'Yes, but I prefer a stable version',
      'Maybe, depends on the feature set',
      'Not interested at this time'
    ],
    dimension: 'earlyAdopter',
    weight: 0.10,
    required: true,
    imageKeyword: 'beta test launch rocket'
  },
  {
    id: 'p19',
    order: 19,
    text: 'Could you provide your primary email for the beta invitation?',
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
    text: 'If you could ask for advice from a world-class longevity expert, what would it be?',
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
  name: 'Global Biohacking Intelligence',
  description: 'Market validation for peak performance solutions and personalized biological optimization in the high-stakes corporate market.',
  detailedDescription: 'This project aims to validate demand for a premier biohacking platform integrating nutrition, supplementation, and advanced wearable telemetry. Targeting high-performance professionals seeking to optimize longevity and cognitive ROI through quantifiable biological data.',
  emoji: '🧬',
  coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1000',
  targetAudience: 'Professionals aged 25-45, tech-early adopters, and corporate athletes focused on cognitive endurance.',
  region: 'Global / USA / Europe',
  productTypes: ['App', 'SaaS', 'E-commerce'],
  questions: BIOHACKING_QUESTIONS,
  createdAt: new Date().toISOString(),
  deepAnalysis: null
};

export const INITIAL_PROJECTS: ProjectTemplate[] = [
  {
    id: 'proj_biohacking_001',
    name: 'Global Biohacking Intelligence',
    description: 'Premier validation for longevity and high-performance solutions in the English-speaking market.',
    emoji: '🧬',
    coverImage: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000',
    targetAudience: 'High-performance professionals, fitness enthusiasts, and corporate leadership.',
    createdAt: new Date().toISOString(),
    questions: BIOHACKING_QUESTIONS
  }
];
