// utils/questionWidgetDetector.ts
// Intelligent Question Widget Detection System
// Analyzes question text and assigns optimal input widget

import { Question } from '../types';

export type WidgetType = 
  | 'scale_1_10'      // 10-point scale
  | 'scale_1_5'       // 5-point scale
  | 'nps'             // Net Promoter Score (0-10 with colors)
  | 'likert'          // Agree/Disagree scale
  | 'boolean'         // Yes/No
  | 'boolean_with_options' // Yes/No then show options
  | 'select'          // Single selection from options
  | 'multi_select'    // Multiple selection
  | 'currency'        // Money input with presets
  | 'percentage'      // 0-100% slider
  | 'frequency'       // Daily/Weekly/Monthly/Never
  | 'time_duration'   // Hours/Minutes input
  | 'rating_stars'    // 5-star rating
  | 'text_short'      // Single line input
  | 'text_long'       // Textarea for descriptions
  | 'number'          // Numeric input
  | 'chips';          // Tag selection

export interface WidgetConfig {
  type: WidgetType;
  options?: string[];
  labels?: { min: string; max: string; mid?: string };
  placeholder?: string;
  unit?: string;
  presets?: (string | number)[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

// Detection patterns (Spanish + English)
const PATTERNS = {
  scale_1_10: [
    /del 1 al 10/i,
    /1 al 10/i,
    /1 to 10/i,
    /escala.*(1|uno).*(10|diez)/i,
    /scale.*(1|one).*(10|ten)/i,
    /0 al 10/i,
    /0 to 10/i,
  ],
  scale_1_5: [
    /del 1 al 5/i,
    /1 al 5/i,
    /1 to 5/i,
    /escala.*(1|uno).*(5|cinco)/i,
    /scale.*(1|one).*(5|five)/i,
  ],
  nps: [
    /recomendar[ií]as/i,
    /would you recommend/i,
    /probabilidad.*recomendar/i,
    /likely.*recommend/i,
    /nps/i,
    /net promoter/i,
  ],
  likert: [
    /qué tan de acuerdo/i,
    /how much do you agree/i,
    /totalmente de acuerdo/i,
    /strongly agree/i,
    /nivel de acuerdo/i,
  ],
  boolean: [
    /^¿(has|tienes|usas|conoces|eres|estás|te|crees|podrías|harías|comprarías|pagarías)/i,
    /^(have you|do you|are you|would you|could you|did you)/i,
    /sí o no/i,
    /yes or no/i,
    /alguna vez/i,
    /ever /i,
  ],
  currency: [
    /cuánto (pagarías|gastarías|invertirías|costaría|presupuesto)/i,
    /how much would you (pay|spend|invest)/i,
    /precio (ideal|máximo|mínimo)/i,
    /ideal price/i,
    /budget/i,
    /presupuesto/i,
    /\$\d/,
    /USD|EUR|COP/i,
  ],
  percentage: [
    /qué porcentaje/i,
    /what percentage/i,
    /% de/i,
    /porcentaje de/i,
  ],
  frequency: [
    /con qué frecuencia/i,
    /how often/i,
    /cada cuánto/i,
    /cuántas veces (al|por|a la)/i,
    /how many times/i,
    /frecuencia/i,
    /frequency/i,
  ],
  time_duration: [
    /cuánto tiempo/i,
    /how (much|long) time/i,
    /cuántas horas/i,
    /how many hours/i,
    /duración/i,
    /duration/i,
  ],
  rating_stars: [
    /califica/i,
    /rate /i,
    /puntuación/i,
    /rating/i,
    /estrellas/i,
    /stars/i,
  ],
  text_long: [
    /describe/i,
    /explica/i,
    /cuéntanos/i,
    /cuéntame/i,
    /tell us/i,
    /explain/i,
    /por qué/i,
    /why /i,
    /cómo /i,
    /how /i,
    /qué opinas/i,
    /what do you think/i,
    /tu opinión/i,
    /your opinion/i,
  ],
};

// Frequency options
const FREQUENCY_OPTIONS = [
  'Diariamente',
  'Varias veces a la semana',
  'Semanalmente',
  'Mensualmente',
  'Rara vez',
  'Nunca'
];

// Likert options
const LIKERT_OPTIONS = [
  'Totalmente en desacuerdo',
  'En desacuerdo',
  'Neutral',
  'De acuerdo',
  'Totalmente de acuerdo'
];

// Currency presets (flexible)
const CURRENCY_PRESETS = ['$0', '$10', '$25', '$50', '$100', '$200+'];

/**
 * Detects the optimal widget type for a question
 */
export function detectWidgetType(question: Question): WidgetConfig {
  const text = question.text.toLowerCase();
  
  // 1. Check if widget type is already specified
  if (question.widgetType && question.widgetType !== 'default') {
    return mapLegacyWidgetType(question);
  }
  
  // 🧠 SEMANTIC PRIORITY: Descriptive questions ALWAYS need text input
  // Even if they start with "¿Podrías...", "¿Puedes...", etc.
  const DESCRIPTION_TRIGGERS = [
    /describir|describe/i,
    /cuéntanos|cuéntame|cuéntenos/i,
    /explica|explicar|explícanos/i,
    /qué opinas|tu opinión|your opinion/i,
    /por qué|why/i,
    /cómo (haces|harías|podrías|usas|lo|te)/i,
    /how (do you|would you|can you)/i,
    /qué (haces|harías|piensas|crees)/i,
    /what (do you|would you)/i,
  ];
  
  const isDescriptiveQuestion = DESCRIPTION_TRIGGERS.some(pattern => pattern.test(question.text));
  
  if (isDescriptiveQuestion) {
    console.log(`🎯 [Widget] SEMANTIC: Descriptive question detected → text_long`);
    return {
      type: 'text_long',
      placeholder: 'Escribe tu respuesta detallada aquí...',
      validation: { minLength: 10, maxLength: 1000 },
    };
  }
  
  // 🧠 SEMANTIC PRIORITY: Frequency questions need context-aware options
  const FREQUENCY_TRIGGERS = [
    /cada cuánto/i,
    /con qué frecuencia/i,
    /cuántas veces (al|por|a la)/i,
    /how often/i,
    /how frequently/i,
    /how many times/i,
  ];
  
  const isFrequencyQuestion = FREQUENCY_TRIGGERS.some(pattern => pattern.test(question.text));
  
  if (isFrequencyQuestion) {
    console.log(`🎯 [Widget] SEMANTIC: Frequency question detected → frequency`);
    
    // Detect question context to provide appropriate time ranges
    const PURCHASE_RENEWAL_PATTERNS = /compra|renueva|adquiere|cambias|reemplaza|repones|comprar|renovar|adquirir|pagas|suscribes|contratas|inviertes|gastas/i;
    const DAILY_ACTIVITY_PATTERNS = /haces|realizas|practicas|comes|duermes|entrenas|meditas|visitas|vas|asistes|tomas|bebes|fumas|juegas|sales|caminas|lees|estudias/i;
    const SERVICE_USAGE_PATTERNS = /usas|utilizas|consultas|abres|revisas|accedes|entras|inicias|logueas|conectas|navegas|verificas|miras|escuchas|ves/i;
    
    const isPurchaseRenewal = PURCHASE_RENEWAL_PATTERNS.test(question.text);
    const isDailyActivity = DAILY_ACTIVITY_PATTERNS.test(question.text);
    const isServiceUsage = SERVICE_USAGE_PATTERNS.test(question.text);
    
    let frequencyOptions: string[];
    
    if (isPurchaseRenewal) {
      // Product purchases/renewals: weeks → months
      frequencyOptions = [
        'Semanalmente',
        'Cada 2 semanas',
        'Mensualmente',
        'Cada 3 meses (Trimestral)',
        'Cada 6 meses (Semestral)',
        'Anualmente',
        'Solo cuando es necesario',
        'Nunca'
      ];
      console.log(`   → Context: Purchase/Renewal (weekly-annual range)`);
    } else if (isServiceUsage) {
      // App/service usage: multiple times per day → monthly
      frequencyOptions = [
        'Múltiples veces al día',
        'Diariamente',
        '4-6 veces por semana',
        '2-3 veces por semana',
        'Semanalmente',
        'Ocasionalmente',
        'Nunca'
      ];
      console.log(`   → Context: Service/App Usage (daily range)`);
    } else if (isDailyActivity) {
      // Daily activities: daily → monthly
      frequencyOptions = [
        'Varias veces al día',
        'Diariamente',
        'Días de semana',
        'Fines de semana',
        '1-2 veces por semana',
        'Ocasionalmente',
        'Nunca'
      ];
      console.log(`   → Context: Daily Activity (daily-weekly range)`);
    } else {
      // Default: general frequency
      frequencyOptions = [
        'Diariamente',
        'Varias veces a la semana', 
        'Semanalmente',
        'Cada 2 semanas',
        'Mensualmente',
        'Cada 2-3 meses',
        'Rara vez',
        'Nunca'
      ];
      console.log(`   → Context: General Frequency (default range)`);
    }
    
    return {
      type: 'frequency',
      options: frequencyOptions,
    };
  }
  
  // 2. Check if question has options
  if (question.options && question.options.length > 0) {
    // Check if options are purely numeric (1, 2, 3, 4, 5) - treat as scale not select
    const allNumeric = question.options.every(opt => /^\d+$/.test(opt.trim()));
    const optionCount = question.options.length;
    
    if (allNumeric) {
      // Numeric options = scale widget
      if (optionCount <= 5) {
        return { 
          type: 'scale_1_5',
          labels: { min: 'Muy bajo', max: 'Muy alto' }
        };
      } else if (optionCount <= 10) {
        return { 
          type: 'scale_1_10',
          labels: { min: 'Muy bajo', max: 'Muy alto' }
        };
      }
    }
    
    // Check for wearable/device questions - use boolean_with_options
    const isDeviceQuestion = /wearable|dispositivo|tracking|reloj|anillo|smartwatch|fitness/i.test(question.text);
    const hasNoUseOption = question.options.some(o => /no uso|no tengo|ninguno/i.test(o));
    
    if (isDeviceQuestion || hasNoUseOption) {
      return {
        type: 'boolean_with_options',
        options: question.options,
      };
    }
    
    // Non-numeric options = select
    const isMultiSelect = text.includes('selecciona todas') || 
                          text.includes('select all') ||
                          text.includes('cuáles') ||
                          text.includes('which ones');
    return {
      type: isMultiSelect ? 'multi_select' : 'select',
      options: question.options,
    };
  }
  
  // 3. Check question type from schema
  if (question.type === 'boolean') {
    return { type: 'boolean' };
  }
  
  if (question.type === 'number') {
    return { type: 'number', validation: { min: 0 } };
  }
  
  if (question.type === 'scale') {
    // Determine if 1-5 or 1-10 based on text
    if (PATTERNS.scale_1_5.some(p => p.test(text))) {
      return { 
        type: 'scale_1_5',
        labels: { min: 'Muy bajo', max: 'Muy alto' }
      };
    }
    return { 
      type: 'scale_1_10',
      labels: { min: 'Muy bajo', max: 'Muy alto' }
    };
  }
  
  // 4. Pattern-based detection
  for (const [widgetType, patterns] of Object.entries(PATTERNS)) {
    if (patterns.some(pattern => pattern.test(question.text))) {
      return buildWidgetConfig(widgetType as WidgetType, question);
    }
  }
  
  // 5. Default: text input (short or long based on expected answer length)
  const expectsLongAnswer = text.includes('?') && (
    text.includes('describe') ||
    text.includes('explica') ||
    text.includes('cuéntanos') ||
    text.includes('por qué') ||
    text.includes('cómo') ||
    text.length > 100
  );
  
  return {
    type: expectsLongAnswer ? 'text_long' : 'text_short',
    placeholder: expectsLongAnswer 
      ? 'Escribe tu respuesta detallada aquí...' 
      : 'Escribe tu respuesta...',
    validation: {
      minLength: expectsLongAnswer ? 10 : 1,
      maxLength: expectsLongAnswer ? 1000 : 200,
    }
  };
}

/**
 * Build widget config based on detected type
 */
function buildWidgetConfig(type: WidgetType, question: Question): WidgetConfig {
  switch (type) {
    case 'scale_1_10':
      return {
        type: 'scale_1_10',
        labels: { min: 'Muy bajo', max: 'Muy alto', mid: 'Neutral' },
      };
      
    case 'scale_1_5':
      return {
        type: 'scale_1_5',
        labels: { min: '😞', max: '😍' },
      };
      
    case 'nps':
      return {
        type: 'nps',
        labels: { min: 'Nada probable', max: 'Muy probable' },
      };
      
    case 'likert':
      return {
        type: 'likert',
        options: LIKERT_OPTIONS,
      };
      
    case 'boolean':
      return { type: 'boolean' };
      
    case 'currency':
      return {
        type: 'currency',
        unit: '$',
        presets: CURRENCY_PRESETS,
        placeholder: 'Ej: $50',
      };
      
    case 'percentage':
      return {
        type: 'percentage',
        unit: '%',
        validation: { min: 0, max: 100 },
      };
      
    case 'frequency':
      return {
        type: 'frequency',
        options: FREQUENCY_OPTIONS,
      };
      
    case 'time_duration':
      return {
        type: 'time_duration',
        unit: 'horas',
        placeholder: 'Ej: 2 horas',
      };
      
    case 'rating_stars':
      return {
        type: 'rating_stars',
        labels: { min: 'Malo', max: 'Excelente' },
      };
      
    case 'text_long':
      return {
        type: 'text_long',
        placeholder: 'Escribe tu respuesta detallada aquí...',
        validation: { minLength: 10, maxLength: 1000 },
      };
      
    default:
      return {
        type: 'text_short',
        placeholder: 'Escribe tu respuesta...',
      };
  }
}

/**
 * Map legacy widget types to new system
 */
function mapLegacyWidgetType(question: Question): WidgetConfig {
  switch (question.widgetType) {
    case 'gauge_1_10':
      return { type: 'scale_1_10', labels: { min: 'Muy bajo', max: 'Muy alto' } };
    case 'gauge_1_5':
      return { type: 'scale_1_5', labels: { min: '😞', max: '😍' } };
    case 'boolean_donut':
      return { type: 'boolean' };
    case 'currency_bucket':
      return { type: 'currency', presets: CURRENCY_PRESETS };
    case 'keyword_cloud':
      return { type: 'text_long', placeholder: 'Escribe palabras clave separadas por coma...' };
    default:
      return { type: 'text_short' };
  }
}

/**
 * Get measurement goal description for analytics
 */
export function getMeasurementGoal(question: Question): string {
  const dimension = question.dimension;
  
  const goals: Record<string, string> = {
    problemIntensity: 'Medir la intensidad del dolor/problema',
    solutionFit: 'Evaluar el ajuste de la solución propuesta',
    currentBehavior: 'Entender comportamientos actuales',
    painPoint: 'Identificar puntos de dolor específicos',
    earlyAdopter: 'Detectar perfil de early adopter',
    willingnessToPay: 'Medir disposición a pagar',
  };
  
  return goals[dimension || ''] || 'Recopilar información general';
}

export default detectWidgetType;
