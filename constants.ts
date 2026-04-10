import { ProjectTemplate, Language, Question } from './types';

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    hub: "Validation Hub",
    newSession: "New Project",
    importDoc: "Import Document",
    noAnalysis: "No Analysis Available",
    backToHub: "Return to Hub",
    dashboard: "Performance Dashboard",
    interviews: "Field Interviews",
    deepResearch: "Deep Research Engine",
    exportData: "Export Strategic Report",
    startInterview: "Begin Validation",
    totalInterviews: "Validated Cohort",
    avgScore: "Aggregate Score",
    marketVerdict: "Clinical Verdict",
    earlyAdopter: "Early Adopter DNA",
    swotAnalysis: "Surgical SWOT",
    lastInsight: "Critical Insight",
    viability: "Market Viability",
    reAnalyze: "Recalibrate Analysis",
    runResearch: "Execute Due Diligence",
    researching: "Running pattern recognition...",
    progressReading: "Analyzing cohort data...",
    progressPattern: "Synthesizing latent needs...",
    progressVerdict: "Finalizing institutional verdict...",
    newCandidate: "Audit Candidate",
    fullName: "Identity",
    email: "Corporate Email",
    phone: "WhatsApp / Contact",
    obsLabel: "Analyst Observations",
    nextQuestion: "Advance Protocol",
    projectName: "Project Identity",
    projectDesc: "Value Proposition",
    dragDrop: "Paste strategic documentation here...",
    smartParseDesc: "AI will architect project name, scope, and validation script.",
    parsing: "Parsing Architecture...",
    create: "Initialize Session",
    // Expansion for App.tsx
    fromIdeatoPlan: "Ideation to Roadmap",
    templates: "Framework Gallery",
    manual: "Surgical Manual Entry",
    regionPlaceholder: "Region (e.g., Global, USA)",
    detailedDesc: "Strategic Context (Optional)",
    targetAudience: "Primary Market Segment (ICP)",
    productType: "Venture Architecture",
    incompleteProfile: "Incomplete Profile",
    insufficientData: "Insufficient Cohort Data",
    vcContextNeeded: "For VC-grade analysis, we require deeper context.",
    fiveInterviewsMinimum: "The engine requires a minimum of 5 interviews to detect statistically significant patterns.",
    initialization: "Initializing Neural Engine...",
    scanning: "Scanning cohort transcripts...",
    behaviorPatterns: "Detecting behavioral friction points...",
    benchmarkCrossing: "Cross-referencing market benchmarks...",
    pmfCalculation: "Calculating Product-Market Fit Score...",
    growthStrategy: "Synthesizing exponential growth strategies...",
    finalizingReport: "Compiling executive audit...",
    // Expansion for LandingPage.tsx
    stopPoliteLies: "Eradicate the Liar's Dividend",
    logicHeader: "Strategic Logic",
    valuePipeline: "Validation Flow: 0 to 100",
    killLiarDividend: "Neutralize Courteous Bias",
    neuralTruth: "Neural Truth Intelligence",
    capitalEfficiency: "Capital Allocation Efficiency",
    instantRoadmap: "Algorithmic Roadmap",
    validationEngine: "Simulation Hub",
    simulatorDesc: "Adjust variables to simulate institutional-grade analysis.",
    painIntensity: "Problem Severity",
    wtp: "Capital Commitment Intensity",
    solutionFit: "Strategic Archetype Fit",
    earlyAdopterProfile: "Early Adopter DNA",
    launchApp: "Launch Validation Hub",
    login: "Executive Login",
    exclusiveAccess: "Institutional Access",
    exclusiveDesc: "Join the elite cohort validating with clinical precision.",
    unlockAccess: "Gain Access",
    accessGranted: "Access Authorized",
    preparingExperience: "Synthesizing your private interface...",
    tooltips: {
      totalInterviews: {
        title: 'Total Interviews',
        description: 'Total validation interviews completed for this project. Each interview represents a structured audit with a potential user.',
        tip: 'Higher sample sizes increase statistical confidence.'
      },
      averageScore: {
        title: 'Average Score',
        description: 'Weighted average across all validation dimensions. Measures the overall quality of market signals.',
        tip: 'A score > 70 indicates high product-market fit probability.'
      },
      status: {
         title: 'Validation Status',
         description: 'Automated evaluation based on cohort analysis. Reflects your project\'s market potential.',
      },
      scoreDistribution: {
        title: 'Score Distribution',
        description: 'Visualization of cohort sentiment density. Identifies patterns and strategic outliers.',
        tip: 'Density in the 7-10 range is the primary success indicator.'
      },
      quickInsights: {
        title: 'Strategic Insights',
        description: 'AI-driven pattern detection and opportunity identification synthesized from raw audit data.',
        tip: 'Insights recalibrate automatically with each new entry.'
      },
      problemIntensity: {
        title: 'Problem Intensity',
        description: 'Measures urgency and critical friction. High intensity indicates "Painkiller" rather than "Vitamin" status.',
      },
      willingnessToPay: {
        title: 'Willingness to Pay',
        description: 'The primary conversion metric. Indicates if users will commit capital vs. just providing positive feedback.',
        tip: 'Prioritize concrete commitments over intent.'
      },
      solutionFit: {
        title: 'Solution Fit',
        description: 'Evaluates if your proposal solves the friction identified. Even great ideas fail with incorrect implementation.',
      },
      earlyAdopter: {
        title: 'Early Adopter DNA',
        description: 'Identifies candidates with innovator traits: willing to tolerate friction for a unique strategic advantage.',
        tip: 'Focus early cycles strictly on high-DNA adopters.'
      }
    },
    loginRequired: "Authentication Required",
    errorCreatingProject: "Failed to initialize project. Please retry.",
    cloudSyncError: "⚠️ Synchronization Issue. Data saved locally.",
    globalIntelError: "Connectivity issue with Global Intelligence. Please try again later.",
    startDueDiligence: "Launch Due Diligence",
    deepSessionTitle: "Strategic Project Deep Dive",
    runAnalysis: "Execute Clinical Analysis",
    analysisResultsPlaceholder: "Audit results will materialize here.",
    marketMetrics: "Institutional Market Metrics",
    loadingLong: "This operation requires multi-factor synthesis. Do not disconnect.",
    processingData: "SYNTHESIZING COHORT DATA",
    runDeepResearchDesc: "Execute the Deep Research protocol to obtain VC-grade insights on your project's longevity.",
    startAnalysis: "Begin Synthesis",
    lastUpdated: "Last Audit Update",
    competitiveBenchmark: "Competitive Landscape Audit",
    competitor: "Entity",
    strength: "Strategic Advantage",
    weakness: "Structural Friction",
    model: "Monetization Framework",
    differentiation: "Moat / Differentiation",
    marketTrends: "Market Trajectory (Projection)",
  },
  es: {
    tooltips: {
      totalInterviews: {
        title: 'Total de Entrevistas',
        description: 'Número total de entrevistas de validación completadas. Cada entrevista representa una auditoría estructurada.',
        tip: 'Muestras más grandes aumentan la confianza estadística.'
      },
      averageScore: {
        title: 'Puntaje Promedio',
        description: 'Promedio ponderado de todas las dimensiones. Mide la calidad general de las señales de mercado.',
        tip: 'Un score > 70 indica alta probabilidad de product-market fit.'
      },
      status: {
         title: 'Estado de Validación',
         description: 'Evaluación automática basada en análisis de cohorte. Refleja el potencial de mercado.',
      },
      scoreDistribution: {
        title: 'Distribución de Scores',
        description: 'Visualización de la densidad de sentimiento. Identifica patrones y outliers estratégicos.',
        tip: 'La densidad en el rango 7-10 es el principal indicador de éxito.'
      },
      quickInsights: {
        title: 'Insights Estratégicos',
        description: 'Detección de patrones por IA sintetizados a partir de datos brutos de auditoría.',
        tip: 'Los insights se recalibran con cada nueva entrada.'
      },
      problemIntensity: {
        title: 'Intensidad del Problema',
        description: 'Mide la urgencia y fricción crítica. Alta intensidad indica estatus de "Aspirina".',
      },
      willingnessToPay: {
        title: 'Disposición a Pagar',
        description: 'Métrica de conversión primaria. Indica si los usuarios comprometerán capital.',
        tip: 'Prioriza compromisos concretos sobre intenciones.'
      },
      solutionFit: {
        title: 'Ajuste de Solución',
        description: 'Evalúa si tu propuesta resuelve la fricción identificada.',
      },
      earlyAdopter: {
        title: 'ADN Early Adopter',
        description: 'Identifica candidatos con rasgos de innovador dispuestos a tolerar fricción inicial.',
        tip: 'Enfoca ciclos iniciales estrictamente en adopters de alto ADN.'
      }
    },
    hub: "Centro de Validación",
    newSession: "Nueva Auditoría",
    importDoc: "Importar Protocolo (PDF/DOCX)",
    noAnalysis: "Sin Auditoría Realizada",
    backToHub: "Volver al Hub",
    dashboard: "Tablero de Rendimiento",
    interviews: "Entrevistas",
    deepResearch: "Motor de Deep Research",
    exportData: "Exportar Reporte Estratégico",
    startInterview: "Iniciar Validación",
    totalInterviews: "Cohorte Validada",
    avgScore: "Puntaje Agregado",
    marketVerdict: "Veredicto Clínico",
    earlyAdopter: "Perfil Early Adopter",
    swotAnalysis: "Análisis SWOT Quirúrgico",
    lastInsight: "Insight Crítico",
    viability: "Viabilidad de Mercado",
    reAnalyze: "Recalibrar Análisis",
    runResearch: "Ejecutar Due Diligence",
    researching: "Reconocimiento de patrones...",
    progressReading: "Analizando datos de la cohorte...",
    progressPattern: "Sintetizando necesidades latentes...",
    progressVerdict: "Finalizando veredicto institucional...",
    newCandidate: "Auditar Candidato",
    fullName: "Nombre",
    email: "Correo Corporativo",
    phone: "WhatsApp / Contacto",
    obsLabel: "Observaciones del Analista",
    nextQuestion: "Avanzar Protocolo",
    projectName: "Identidad del Proyecto",
    projectDesc: "Propuesta de Valor",
    dragDrop: "Pega la documentación estratégica aquí...",
    smartParseDesc: "La IA diseñará el nombre, alcance y guion de validación.",
    parsing: "Analizando Arquitectura...",
    create: "Inicializar Sesión",
    // Expansion for App.tsx
    fromIdeatoPlan: "De Idea a Plan Maestro",
    templates: "Galería de Frameworks",
    manual: "Entrada Manual Quirúrgica",
    regionPlaceholder: "Región (ej. Global, Latinoamérica)",
    detailedDesc: "Contexto Estratégico (Opcional)",
    targetAudience: "Segmento de Mercado (ICP)",
    productType: "Arquitectura del Producto",
    incompleteProfile: "Perfil Incompleto",
    insufficientData: "Datos de Cohorte Insuficientes",
    vcContextNeeded: "Para un análisis nivel VC, requerimos mayor contexto.",
    fiveInterviewsMinimum: "El motor requiere un mínimo de 5 entrevistas para detectar patrones estadísticamente significativos.",
    initialization: "Inicializando Neural Engine...",
    scanning: "Escaneando transcripciones...",
    behaviorPatterns: "Detectando puntos de fricción conductual...",
    benchmarkCrossing: "Cruzando con benchmarks de mercado...",
    pmfCalculation: "Calculando puntaje de Product-Market Fit...",
    growthStrategy: "Sintetizando estrategias de crecimiento...",
    finalizingReport: "Compilando auditoría ejecutiva...",
    // Expansion for LandingPage.tsx
    stopPoliteLies: "Erradica el Dividendo del Mentiroso",
    logicHeader: "Lógica Estratégica",
    valuePipeline: "Flujo de Validación: 0 a 100",
    killLiarDividend: "Neutralizar el Sesgo de Cortesía",
    neuralTruth: "Inteligencia de Verdad Neural",
    capitalEfficiency: "Eficiencia en Asignación de Capital",
    instantRoadmap: "Hoja de Ruta Algorítmica",
    validationEngine: "Centro de Simulación",
    simulatorDesc: "Ajusta variables para simular un análisis institucional.",
    painIntensity: "Severidad del Problema",
    wtp: "Intensidad de Compromiso de Capital",
    solutionFit: "Encaje del Arquetipo Estratégico",
    earlyAdopterProfile: "Propensión a Early Adopter",
    launchApp: "Lanzar Hub de Validación",
    login: "Login Ejecutivo",
    exclusiveAccess: "Acceso Institucional",
    exclusiveDesc: "Únete a la cohorte de élite que valida con precisión clínica.",
    unlockAccess: "Obtener Acceso",
    accessGranted: "Acceso Autorizado",
    preparingExperience: "Sintetizando tu interfaz privada...",
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
