// services/ideaGenerator.ts - ULTRA-PERSONALIZED Idea-to-Research AI
// Complete rewrite with EXTREME specificity to prevent generic responses

import { Question, ProjectTemplate } from '../types';
import { logger } from './logger';
import { telemetry } from './telemetry';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL = 'gemini-2.0-flash-exp';

// Enhanced Types with Market Intelligence
export interface ResearchPlan {
  objectives: string[];
  personas: TargetPersona[];
  questions: Question[];
  successMetrics: SuccessMetrics;
  risks: RiskAssessment[];
  competitors: Competitor[];
  timeline: Timeline;
  // NEW intelligent sections
  marketInsights?: MarketInsights;
  pivotIdeas?: PivotIdea[];
  monetizationStrategies?: MonetizationStrategy[];
  validationExperiments?: ValidationExperiment[];
  trendAnalysis?: TrendAnalysis;
  competitiveLandscape?: CompetitiveLandscape;
}

export interface TargetPersona {
  name: string;
  demographics: string;
  painPoints: string[];
  goals: string[];
  behaviors: string[];
  quote: string;
  spendingPower?: string;
  techSavviness?: string;
}

export interface SuccessMetrics {
  viabilityThreshold: number;
  interviewTarget: number;
  earlyAdopterPercentage: number;
  willingnessToPayThreshold: number;
}

export interface RiskAssessment {
  risk: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
  probability?: number;
}

export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
  differentiation: string;
  marketShare?: string;
  pricing?: string;
}

export interface Timeline {
  phase1_preparation: string;
  phase2_interviews: string;
  phase3_analysis: string;
  totalDuration: string;
}

// NEW: Market Intelligence with real data
export interface MarketInsights {
  tam: string;
  sam: string;
  som: string;
  growthRate: string;
  trends: string[];
  keyDrivers?: string[];
  barriers?: string[];
}

// NEW: Pivot suggestions based on current trends
export interface PivotIdea {
  name: string;
  description: string;
  angle: 'ai_powered' | 'b2b_saas' | 'community' | 'marketplace' | 'platform';
  potential: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedRevenue?: string;
  complexity?: 'low' | 'medium' | 'high';
}

// NEW: Monetization analysis
export interface MonetizationStrategy {
  model: string;
  pricing: string;
  pros: string[];
  cons: string[];
  recommendation: boolean;
  estimatedLTV?: string;
  estimatedCAC?: string;
}

// NEW: Quick validation experiments
export interface ValidationExperiment {
  name: string;
  description: string;
  cost: string;
  duration: string;
  successMetric: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// NEW: Trend analysis
export interface TrendAnalysis {
  emergingTrends: string[];
  dyingTrends: string[];
  opportunityWindows: string[];
  threats: string[];
}

// NEW: Competitive landscape
export interface CompetitiveLandscape {
  directCompetitors: Competitor[];
  indirectCompetitors: Competitor[];
  substitutes: string[];
  barriersToEntry: string[];
  whitespace?: string;
}

// Helper: Retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 4,
  baseDelayMs: number = 4000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      const isRetryable = error.status === 429 || error.status === 503 || error.message?.includes('429');
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.log(`⏳ [IdeaGenerator] Rate limited. Retrying in ${delay/1000}s... (${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

// Helper: Deep keyword extraction with context
function extractKeywords(idea: string, clarifications: { question: string; answer: string }[] = []): { 
  industry: string; 
  target: string; 
  region: string;
  businessModel: string;
  stage: string;
  budget: string;
} {
  const lower = idea.toLowerCase();
  const allText = [idea, ...clarifications.map(c => c.answer)].join(' ').toLowerCase();
  
  // Industry detection (more granular)
  let industry = 'general';
  if (lower.match(/\b(saas|software|app|tech|platform|api)\b/)) industry = 'tech/saas';
  else if (lower.match(/\b(comida|restaurant|delivery|food|cocina|chef)\b/)) industry = 'food\u0026beverage';
  else if (lower.match(/\b(salud|health|médico|doctor|fitness|wellness|bienestar)\b/)) industry = 'healthcare';
  else if (lower.match(/\b(fintech|banco|pago|cripto|inversión|finanzas)\b/)) industry = 'fintech';
  else if (lower.match(/\b(educación|curso|learn|enseñ|formación)\b/)) industry = 'education';
  else if (lower.match(/\b(ecommerce|tienda|venta|marketplace|comercio)\b/)) industry = 'ecommerce';
  else if (lower.match(/\b(hardware|iot|dispositivo|sensor|robot)\b/)) industry = 'hardware/iot';
  else if (lower.match(/\b(logística|transporte|envío|courier)\b/)) industry = 'logistics';
  else if (lower.match(/\b(inmobiliaria|propiedad|alquiler|renta)\b/)) industry = 'real estate';
  else if (lower.match(/\b(marketing|publicidad|social media|contenido)\b/)) industry = 'marketing';
  
  // Target detection
  let target = 'consumidores';
  if (lower.match(/\b(empresa|b2b|negocio|corporativo|pyme)\b/)) target = 'empresas B2B';
  else if (lower.match(/\b(startup|emprendedor)\b/)) target = 'startups';
  else if (lower.match(/\b(familia|niños|padres|mamá|papá)\b/)) target = 'familias';
  else if (lower.match(/\b(joven|estudiante|universitario|millennial|gen z)\b/)) target = 'jóvenes/estudiantes';
  else if (lower.match(/\b(profesional|freelance|consultor)\b/)) target = 'profesionales independientes';
  
  // Region detection
  let region = 'Latinoamérica';
  if (lower.match(/\b(colombia|bogotá|medellín|cali|barranquilla)\b/)) region = 'Colombia';
  else if (lower.match(/\b(méxico|cdmx|guadalajara|monterrey)\b/)) region = 'México';
  else if (lower.match(/\b(argentina|buenos aires|córdoba)\b/)) region = 'Argentina';
  else if (lower.match(/\b(chile|santiago|valparaíso)\b/)) region = 'Chile';
  else if (lower.match(/\b(perú|lima)\b/)) region = 'Perú';
  else if (lower.match(/\b(brasil|são paulo|rio)\b/)) region = 'Brasil';
  
  // Business model
  let businessModel = 'unknown';
  if (allText.match(/\b(suscripción|mensual|recurrente|subscription)\b/)) businessModel = 'subscription';
  else if (allText.match(/\b(comisión|porcentaje|fee|transacción)\b/)) businessModel = 'commission';
  else if (allText.match(/\b(venta|precio|compra|product)\b/)) businessModel = 'product sale';
  else if (allText.match(/\b(freemium|gratis|premium)\b/)) businessModel = 'freemium';
  else if (allText.match(/\b(publicidad|ads|anuncios)\b/)) businessModel = 'advertising';
  
  // Stage detection
  let stage = 'idea';
  if (allText.match(/\b(ya tengo|ya existe|ya hice|actualmente|clientes)\b/)) stage = 'early traction';
  else if (allText.match(/\b(mvp|prototipo|beta)\b/)) stage = 'mvp';
  else if (allText.match(/\b(idea|pensando|quiero|me gustaría)\b/)) stage = 'idea';
  
  // Budget estimation from answers
  let budget = 'low';
  const budgetAnswer = clarifications.find(c => c.question.toLowerCase().includes('presupuesto') || c.question.toLowerCase().includes('budget'));
  if (budgetAnswer) {
    const answer = budgetAnswer.answer.toLowerCase();
    if (answer.match(/\b(mucho|bastante|10k|20k|50k|alto)\b/)) budget = 'high';
    else if (answer.match(/\b(medio|algo|5k|moderado)\b/)) budget = 'medium';
    else budget = 'low';
  }
  
  return { industry, target, region, businessModel, stage, budget };
}

// Helper: Call Gemini API with retry
async function callGeminiAPI(prompt: string, json: boolean = false): Promise<string> {
  const makeRequest = async (): Promise<string> => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `Eres un analista de startups de élite mundial con experiencia en Y Combinator, Sequoia Capital y a16z.

REGLAS ABSOLUTAS:
1. NUNCA generes respuestas genéricas como "Usuario Ideal A" o "Competidor A"
2. SIEMPRE usa nombres reales, empresas reales, datos reales
3. Cada respuesta debe ser ÚNICA y específica para la idea del usuario
4. Incluye números concretos, no rangos vagos
5. Usa español latinoamericano profesional y moderno
6. Si no sabes un dato específico, haz una estimación razonable basada en el contexto
7. TODOS los personas deben tener nombres de personas reales del país mencionado
8. TODOS los competidores deben ser empresas reales o descripciones específicas`
            }]
          },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: json ? { 
            responseMimeType: 'application/json',
            temperature: 0.9, // Más creatividad
            topP: 0.95,
            topK: 40
          } : {
            temperature: 0.9,
            topP: 0.95
          }
        }),
      }
    );

    if (!response.ok) {
      const error: any = new Error(`API Error: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('Empty response from Gemini');
    }
    
    return text;
  };

  try {
    return await retryWithBackoff(makeRequest, 4, 4000);
  } catch (error: any) {
    console.warn("⚠️ Gemini API failed after all retries:", error.message);
    throw error;
  }
}

// Generate contextual fallback (last resort)
function generateContextualFallback(
  idea: string, 
  clarifications: { question: string; answer: string }[]
): ResearchPlan {
  const context = extractKeywords(idea, clarifications);
  const timestamp = Date.now();
  const ideaHash = idea.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  
  console.warn('🟡 [IdeaGenerator] Using intelligent contextual fallback');
  
  // Extract unique elements from user's idea
  const ideaWords = idea.split(' ').filter(w => w.length > 4).slice(0, 3);
  const uniqueSuffix = ideaWords.join(' ').substring(0, 30);
  
  return {
    objectives: [
      `Validar demanda real para "${uniqueSuffix}..." en ${context.region}`,
      `Identificar early adopters dispuestos a pagar en segmento ${context.target}`,
      `Medir intensidad del problema vs ${context.businessModel === 'unknown' ? 'soluciones actuales' : 'modelo ' + context.businessModel}`
    ],
    personas: [
      {
        name: `Persona Principal (${context.target}, ${context.region})`,
        demographics: `Perfil típico en ${context.industry}, ${context.region}, etapa ${context.stage}`,
        painPoints: [
          `Problema específico mencionado: ${idea.substring(0, 60)}...`,
          `Frustración con ${context.industry} actual`,
          'Búsqueda activa de soluciones'
        ],
        goals: [
          'Resolver problema de forma eficiente',
          'Obtener ROI medible',
          'Reducir fricción operativa'
        ],
        behaviors: [
          'Investiga online antes de comprar',
          `Ya usa herramientas de ${context.industry}`,
          'Dispuesto a probar nuevas soluciones'
        ],
        quote: `"Necesito algo que realmente solucione ${idea.substring(0, 40)}..."`,
        spendingPower: context.budget === 'high' ? '$500-2000 mensual' : context.budget === 'medium' ? '$100-500 mensual' : '$0-100 mensual'
      }
    ],
    questions: [
      {
        id: `validation_${timestamp}_1`,
        text: `¿Qué tan urgente es para ti resolver el problema de "${uniqueSuffix}..."?`,
        type: 'scale',
        category: 'problem',
        dimension: 'problemIntensity',
        weight: 0.9,
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        order: 1,
        required: true
      },
      {
        id: `validation_${timestamp}_2`,
        text: '¿Cuánto gastas actualmente en intentar resolver este problema?',
        type: 'select',
        category: 'financial',
        dimension: 'willingnessToPay',
        weight: 0.85,
        options: ['Nada', 'Menos de $50/mes', '$50-200/mes', '$200-500/mes', 'Más de $500/mes'],
        order: 2,
        required: true
      },
      {
        id: `validation_${timestamp}_3`,
        text: '¿Qué soluciones has probado antes y por qué no te funcionaron?',
        type: 'text',
        category: 'problem',
        dimension: 'currentBehavior',
        weight: 0.8,
        options: [],
        order: 3,
        required: true
      }
    ],
    successMetrics: {
      viabilityThreshold: 70,
      interviewTarget: 15,
      earlyAdopterPercentage: 35,
      willingnessToPayThreshold: 60
    },
    risks: [
      {
        risk: `Competencia establecida en ${context.industry}`,
        severity: 'high',
        mitigation: 'Diferenciación por enfoque único mencionado en la idea',
        probability: 70
      },
      {
        risk: 'Adopción lenta por resistencia al cambio',
        severity: 'medium',
        mitigation: 'Freemium + onboarding simplificado',
        probability: 50
      }
    ],
    competitors: [
      {
        name: `Líder actual en ${context.industry} ${context.region}`,
        strength: 'Marca establecida y base de usuarios',
        weakness: 'No resuelve específicamente lo mencionado en tu idea',
        differentiation: `Tu enfoque único: ${uniqueSuffix}...`,
        marketShare: 'Dominant player'
      }
    ],
    timeline: {
      phase1_preparation: 'Semana 1-2: Guión + reclutamiento',
      phase2_interviews: 'Semana 3-5: 15 entrevistas',
      phase3_analysis: 'Semana 6: Decisión Go/No-Go',
      totalDuration: '6 semanas'
    },
    pivotIdeas: [
      {
        name: `${uniqueSuffix}... con IA`,
        description: 'Agregar inteligencia artificial para personalización automática',
        angle: 'ai_powered',
        potential: 'high',
        reasoning: 'Soluciones con IA tienen 2-3x más retención',
        complexity: 'medium'
      }
    ]
  };
}

// Main: Generate Clarification Questions (NO API - CONTEXTUAL ONLY)
export async function generateClarificationQuestions(idea: string): Promise<string[]> {
  logger.info('Generating contextual clarification questions (NO API)', { ideaLength: idea.length });

  const context = extractKeywords(idea);
  
  console.log('🎯 [IdeaGenerator] Generating smart questions without API call');
  
  // INTELLIGENT CONTEXTUAL QUESTIONS - NO API NEEDED
  // These are designed based on YC's interview framework
  
  const questions: string[] = [];
  
  // Question 1: Target Customer Specificity
  if (context.target === 'empresas B2B') {
    questions.push(
      `Para "${idea.substring(0, 45)}...", ¿estás enfocado en startups (<50 empleados), PYMEs (50-250), o corporativos grandes (+250)?`
    );
  } else if (context.target === 'jóvenes/estudiantes') {
    questions.push(
      `¿Tu solución está dirigida a estudiantes universitarios, jóvenes profesionales (primera vez trabajando), o ambos?`
    );
  } else if (context.target === 'familias') {
    questions.push(
      `¿Te enfocas en familias con niños pequeños (0-5 años), escolares (6-12), adolescentes (13-18), o todas?`
    );
  } else {
    questions.push(
      `Para "${idea.substring(0, 40)}...", describe en 2-3 líneas a la persona EXACTA que compraría esto (edad, trabajo, ciudad, problema específico que tiene)`
    );
  }
  
  // Question 2: Business Model / Monetization
  if (context.businessModel === 'subscription') {
    questions.push(
      `¿Qué precio mensual crees que pagarían? ¿Ya validaste este pricing con alguien?`
    );
  } else if (context.businessModel === 'commission') {
    questions.push(
      `¿Qué % de comisión cobrarías por transacción? ¿Esto lo pagaría el comprador, el vendedor, o ambos?`
    );
  } else if (context.industry === 'tech/saas') {
    questions.push(
      `¿Monetizarías vía suscripción mensual, comisión por uso, freemium + premium features, u otro modelo?`
    );
  } else {
    questions.push(
      `¿Cómo exactamente ganarías dinero? ¿Venta directa, suscripción, comisión, publicidad, otro?`
    );
  }
  
  // Question 3: Competitive Advantage / Differentiation
  if (context.industry === 'tech/saas') {
    questions.push(
      `¿Cuál es tu ventaja competitiva vs soluciones como [menciona 1-2 competidores conocidos en ${context.industry}]? ¿Por qué alguien cambiaría de su solución actual a la tuya?`
    );
  } else if (context.industry === 'ecommerce') {
    questions.push(
      `El ecommerce es muy competido. ¿Qué hace tu propuesta radicalmente diferente vs Mercado Libre, Amazon, o tiendas locales?`
    );
  } else if (context.industry === 'food&beverage') {
    questions.push(
      `¿Qué te diferencia de apps como Rappi, iFood, Uber Eats, o restaurantes que ya tienen delivery propio?`
    );
  } else {
    questions.push(
      `¿Qué hace tu solución 10x mejor que lo que existe hoy en ${context.industry}? Sé específico.`
    );
  }
  
  // Question 4: Resources / Experience / Commitment
  if (context.stage === 'early traction') {
    questions.push(
      `Mencionas que ya tienes tracción. ¿Cuántos usuarios/clientes actuales? ¿Cuánto revenue mensual? ¿Qué % crecimiento mes a mes?`
    );
  } else if (context.stage === 'mvp') {
    questions.push(
      `¿Tu MVP está funcionando? ¿Cuántos usuarios de prueba lo han usado? ¿Qué feedback crítico recibiste?`
    );
  } else {
    const industryExperience = context.industry !== 'general' 
      ? `en ${context.industry}` 
      : 'en esta industria';
    questions.push(
      `¿Tienes experiencia previa ${industryExperience}? ¿Conoces personalmente el problema que quieres resolver? ¿Cuánto tiempo/presupuesto tienes para validar esto en los próximos 3 meses?`
    );
  }
  
  console.log('✅ [IdeaGenerator] Generated', questions.length, 'contextual questions (0 API calls)');
  return questions;
}

// Main: Generate Research Plan (MAXIMUM SPECIFICITY)
export async function generateResearchPlan(
  idea: string,
  clarifications: { question: string; answer: string }[]
): Promise<ResearchPlan> {
  logger.info('Generating ultra-personalized research plan', {
    ideaLength: idea.length,
    clarificationCount: clarifications.length,
  });

  const stopTimer = logger.startTimer('Research Plan Generation');
  telemetry.trackFlowStart('idea_to_research');
  
  const context = extractKeywords(idea, clarifications);
  
  // Extract key insights from clarifications
  const clarificationInsights = clarifications.map((c, i) => 
    `\n${i+1}. Q: "${c.question}"\n   A: "${c.answer}"\n   → Insight: ${c.answer.substring(0, 100)}...`
  ).join('\n');

  try {
    const prompt = `
You are a world-class startup analyst who has advised companies like Airbnb, Uber, and Stripe.

USER'S EXACT IDEA:
"${idea}"

DEEP CONTEXT ANALYSIS:
- Industry: ${context.industry}
- Target Market: ${context.target}
- Geographic Focus: ${context.region}
- Business Model: ${context.businessModel}
- Current Stage: ${context.stage}
- Budget Level: ${context.budget}

USER'S CLARIFICATIONS & INSIGHTS:
${clarificationInsights}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR MISSION: Create a DEEPLY PERSONALIZED validation research plan.

🚨 CRITICAL RULES - FAILURE = REJECTION:

1. **PERSONAS**: Use REAL first names common in ${context.region}. NOT "Usuario A" or "Maria Smith". Examples for Colombia: "Camilo Rodríguez", "Daniela Torres", "Andrés Vargas"

2. **JOB TITLES**: Be HYPER-SPECIFIC. NOT "Gerente". YES: "Growth Lead en startup fintech", "Fundador de agencia de marketing digital", "Product Manager en Rappi"

3. **COMPETITORS**: Name REAL companies that exist in ${context.region} or globally. Research current market leaders in ${context.industry}.

4. **MARKET DATA**: Provide realistic TAM/SAM/SOM numbers for ${context.region}, ${context.industry}. If you don't have exact data, estimate conservatively.

5. **PIVOT IDEAS**: Base these on CURRENT 2024-2025 trends:
   - AI/ML integration (GPT-4, Claude, Gemini)
   - Community-led growth
   - B2B SaaS plays
   - Marketplace/platform models
   - Web3/crypto (if relevant)

6. **VALIDATION QUESTIONS**: Must extract ACTIONABLE data. Include willingness-to-pay questions with specific price points in local currency (COP, MXN, etc.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT FORMAT (JSON):
{
  "objectives": [
    "Specific, measurable objective 1 tied to this exact idea",
    "Specific, measurable objective 2",
    "Specific, measurable objective 3"
  ],
  
  "personas": [
    {
      "name": "Real First Name + Last Name, Specific Job Title at Real/Specific Company Type",
      "demographics": "Exact age, city in ${context.region}, monthly income range in local currency, specific job situation",
      "painPoints": ["Specific pain 1 related to ${idea.substring(0, 30)}...", "Specific pain 2", "Specific pain 3"],
      "goals": ["Specific goal 1", "Specific goal 2"],
      "behaviors": ["Observable behavior 1", "Observable behavior 2", "Tool/platform they currently use"],
      "quote": "First-person quote this person would actually say about the problem",
      "spending power": "Monthly discretionary spend in local currency",
      "techSavviness": "low/medium/high"
    }
  ],
  
  "questions": [
    {
      "id": "unique_id",
      "text": "Validation question in Spanish that references the specific idea",
      "type": "scale|text|boolean|select",
      "category": "problem|solution|market|financial",
      "dimension": "problemIntensity|solutionFit|willingnessToPay|painPoint|earlyAdopter|currentBehavior",
      "weight": 0.5-1.0,
      "options": ["if applicable"]
    }
  ],
  
  "successMetrics": {
    "viabilityThreshold": 70-85,
    "interviewTarget": 15-25,
    "earlyAdopterPercentage": 30-50,
    "willingnessToPayThreshold": 60-75
  },
  
  "risks": [
    {
      "risk": "Specific risk for this exact idea",
      "severity": "high|medium|low",
      "mitigation": "Specific mitigation strategy",
      "probability": 10-90
    }
  ],
  
  "competitors": [
    {
      "name": "REAL company name (e.g., 'Rappi', 'Nubank', 'Mercado Libre') or specific description",
      "strength": "Their actual strength",
      "weakness": "Their actual weakness",
      "differentiation": "HOW THIS IDEA is different",
      "marketShare": "Estimated % or 'dominant'/'emerging'",
      "pricing": "Their actual pricing model"
    }
  ],
  
  "timeline": {
    "phase1_preparation": "Week 1-2: Specific activities",
    "phase2_interviews": "Week 3-5: Specific activities",
    "phase3_analysis": "Week 6: Specific activities",
    "totalDuration": "6-8 weeks"
  },
  
  "marketInsights": {
    "tam": "Total addressable market size for ${context.industry} in ${context.region} with $ figure",
    "sam": "Serviceable addressable market with $ figure",
    "som": "Serviceable obtainable market Year 1 with $ figure",
    "growthRate": "Annual growth rate % with source/reasoning",
    "trends": ["Trend 1", "Trend 2", "Trend 3"],
    "keyDrivers": ["Driver 1", "Driver 2"],
    "barriers": ["Barrier 1", "Barrier 2"]
  },
  
  "pivotIdeas": [
    {
      "name": "Specific pivot name based on the original idea",
      "description": "How this pivot works",
      "angle": "ai_powered|b2b_saas|community|marketplace|platform",
      "potential": "high|medium|low",
      "reasoning": "WHY this pivot could work better, with market evidence",
      "estimatedRevenue": "$X-Y in Year 1",
      "complexity": "low|medium|high"
    }
  ],
  
  "monetizationStrategies": [
    {
      "model": "Specific model name",
      "pricing": "Exact pricing structure in local currency",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "recommendation": true/false,
      "estimatedLTV": "$X over Y months",
      "estimatedCAC": "$X"
    }
  ],
  
  "validationExperiments": [
    {
      "name": "Experiment name",
      "description": "What to do exactly",
      "cost": "$X-Y in local currency",
      "duration": "X days/weeks",
      "successMetric": "Specific measurable outcome",
      "difficulty": "easy|medium|hard"
    }
  ],
  
  "trendAnalysis": {
    "emergingTrends": ["2024-2025 trend 1 in ${context.industry}", "trend 2"],
    "dyingTrends": ["What's declining"],
    "opportunityWindows": ["Time-sensitive opportunities"],
    "threats": ["Market threats"]
  },
  
  "competitiveLandscape": {
    "directCompetitors": [{"name": "Real company", "strength": "X", "weakness": "Y", "differentiation": "Z"}],
    "indirectCompetitors": [{"name": "Real company", "strength": "X", "weakness": "Y", "differentiation": "Z"}],
    "substitutes": ["Current solutions people use"],
    "barriersToEntry": ["Barrier 1", "Barrier 2"],
    "whitespace": "Market gap this idea fills"
  }
}

Generate 2-3 personas, 6-10 questions, 3-5 risks, 2-4 real competitors, 3 pivot ideas, 2-3 monetization strategies, 3 experiments.

RESPOND WITH VALID JSON ONLY. NO MARKDOWN.`;

    console.log('🚀 [IdeaGenerator] Calling Gemini with ultra-specific prompt...');
    const response = await callGeminiAPI(prompt, true);
    const parsed = JSON.parse(response);
    
    console.log('✅ [IdeaGenerator] AI-generated plan received:', {
      personas: parsed.personas?.length,
      competitors: parsed.competitors?.length,
      pivotIdeas: parsed.pivotIdeas?.length,
      trendAnalysis: !!parsed.trendAnalysis
    });

    // Transform questions to proper format
    const questions: Question[] = (parsed.questions || []).map((q: any, index: number) => ({
      id: q.id || `ai_gen_${Date.now()}_${index}`,
      text: q.text,
      type: q.type || 'text',
      category: q.category,
      dimension: q.dimension,
      weight: q.weight || 0.5,
      options: q.options || [],
      required: true,
      order: index + 1,
    }));

    const plan: ResearchPlan = {
      objectives: parsed.objectives || [],
      personas: parsed.personas || [],
      questions,
      successMetrics: parsed.successMetrics || {
        viabilityThreshold: 70,
        interviewTarget: 15,
        earlyAdopterPercentage: 30,
        willingnessToPayThreshold: 60,
      },
      risks: parsed.risks || [],
      competitors: parsed.competitors || [],
      timeline: parsed.timeline || {
        phase1_preparation: 'Semana 1-2',
        phase2_interviews: 'Semana 3-5',
        phase3_analysis: 'Semana 6',
        totalDuration: '6 semanas',
      },
      marketInsights: parsed.marketInsights,
      pivotIdeas: parsed.pivotIdeas,
      monetizationStrategies: parsed.monetizationStrategies,
      validationExperiments: parsed.validationExperiments,
      trendAnalysis: parsed.trendAnalysis,
      competitiveLandscape: parsed.competitiveLandscape
    };

    stopTimer();
    console.log('✅ [Telemetry] idea_to_research: completed');

    return plan;
  } catch (err) {
    logger.error('AI generation failed, using intelligent contextual fallback', err as Error);
    console.warn('⚠️ [IdeaGenerator] Using intelligent fallback');
    
    const fallbackPlan = generateContextualFallback(idea, clarifications);
    
    stopTimer();
    console.log('⚠️ [Telemetry] idea_to_research: fallback');
    
    return fallbackPlan;
  }
}

// Export: Convert plan to ProjectTemplate
export function planToProject(plan: ResearchPlan, ideaTitle: string): Partial<ProjectTemplate> {
  return {
    name: ideaTitle,
    description: plan.objectives.join('. '),
    questions: plan.questions,
    targetAudience: plan.personas.map(p => p.name).join(', '),
  };
}
