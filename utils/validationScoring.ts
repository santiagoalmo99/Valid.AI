// utils/validationScoring.ts
// Scientific Validation Scoring System for Customer Interviews
// Based on: Mom Test, Lean Startup, Customer Development methodologies

import { Question, Dimension, Answer } from '../types';

// ============================================================
// DIMENSION WEIGHTS - Based on validation science
// ============================================================
export const DIMENSION_WEIGHTS: Record<Dimension, number> = {
  problemIntensity: 25,    // Most critical - is the pain REAL?
  willingnessToPay: 25,    // Second most critical - will they PAY?
  solutionFit: 20,         // Does our solution match their need?
  earlyAdopter: 15,        // Are they innovators who'll try new things?
  painPoint: 10,           // Can they articulate the problem clearly?
  currentBehavior: 5,      // What are they doing now? (context)
};

// ============================================================
// SCORING RULES BY DIMENSION
// ============================================================

interface ScoringRule {
  dimension: Dimension;
  patterns: {
    high: RegExp[];      // 80-100 points
    medium: RegExp[];    // 50-70 points  
    low: RegExp[];       // 20-40 points
    veryLow: RegExp[];   // 0-20 points
  };
  numericThresholds?: {
    veryHigh: number;    // >= this = 100
    high: number;        // >= this = 80
    medium: number;      // >= this = 60
    low: number;         // >= this = 40
  };
}

const SCORING_RULES: ScoringRule[] = [
  {
    dimension: 'problemIntensity',
    patterns: {
      high: [
        /muy (grave|serio|importante|frecuente|difícil)/i,
        /constantemente|siempre|todos los días|diariamente/i,
        /(9|10)\s*(\/|de)\s*10/i,
        /urgente|crítico|insoportable|desesperado/i,
        /pierdo (dinero|tiempo|clientes)/i,
        /ya (pagué|gasté|invertí)/i,
      ],
      medium: [
        /moderado|regular|algo|a veces/i,
        /(6|7|8)\s*(\/|de)\s*10/i,
        /semanalmente|cada semana/i,
        /me gustaría|sería bueno/i,
      ],
      low: [
        /poco|rara vez|ocasional/i,
        /(3|4|5)\s*(\/|de)\s*10/i,
        /mensualmente|de vez en cuando/i,
        /no es tan grave|puedo vivir sin/i,
      ],
      veryLow: [
        /no (tengo|hay|existe)|ninguno|nada|nunca/i,
        /(0|1|2)\s*(\/|de)\s*10/i,
        /casi nunca|jamás/i,
      ],
    },
    numericThresholds: { veryHigh: 9, high: 7, medium: 5, low: 3 },
  },
  {
    dimension: 'willingnessToPay',
    patterns: {
      high: [
        /sí (pagaría|compraría|invertiría)/i,
        /definitiva?mente/i,
        /\$\d{2,}/,  // $XX or more
        /ya (pago|gasto)\s*(más de|alrededor)/i,
        /presupuesto (alto|amplio|disponible)/i,
        /inmediatamente|ahora mismo|hoy/i,
        /sin pensarlo|obvio que sí/i,
      ],
      medium: [
        /tal vez|quizás|depende|probablemente/i,
        /\$(5|10|15|20)\s*(USD|usd)?/i,
        /si (es|tiene|incluye|funciona)/i,
        /tendría que (ver|probarlo|evaluarlo)/i,
      ],
      low: [
        /muy poco|casi nada|el mínimo/i,
        /\$(0|1|2|3|4)\s*(USD|usd)?/i,
        /gratis|gratuito|sin costo/i,
        /no creo|lo dudo|difícil/i,
      ],
      veryLow: [
        /no (pagaría|compraría|gastaría)/i,
        /\$0|nada|cero/i,
        /nunca pagaría|jamás/i,
        /no tengo (dinero|presupuesto|recursos)/i,
      ],
    },
  },
  {
    dimension: 'solutionFit',
    patterns: {
      high: [
        /exactamente (lo que|eso)/i,
        /perfecto|ideal|increíble|genial/i,
        /(9|10)\s*(\/|de)\s*10/i,
        /resuelve (todo|completamente|perfectamente)/i,
        /es justo lo que (necesito|buscaba|quería)/i,
      ],
      medium: [
        /podría (servir|funcionar|ayudar)/i,
        /(6|7|8)\s*(\/|de)\s*10/i,
        /bien|bueno|interesante|útil/i,
        /si (tuviera|incluyera|agregaran)/i,
      ],
      low: [
        /no (estoy|me) seguro/i,
        /(3|4|5)\s*(\/|de)\s*10/i,
        /falta|incompleto|le falta/i,
        /no es exactamente/i,
      ],
      veryLow: [
        /no (me|lo) (sirve|resuelve|ayuda)/i,
        /(0|1|2)\s*(\/|de)\s*10/i,
        /para nada|inútil|irrelevante/i,
        /no (entiendo|veo) (cómo|para qué)/i,
      ],
    },
    numericThresholds: { veryHigh: 9, high: 7, medium: 5, low: 3 },
  },
  {
    dimension: 'earlyAdopter',
    patterns: {
      high: [
        /me (encanta|gusta) probar (cosas|productos) nuevo/i,
        /soy de los primeros/i,
        /innovador|early adopter|pionero/i,
        /siempre (busco|pruebo|uso) lo nuevo/i,
        /ya uso (varias|muchas) apps/i,
        /tecnología|tech|gadgets/i,
      ],
      medium: [
        /a veces (pruebo|busco)/i,
        /si (me|lo) recomiendan/i,
        /cuando ya (funciona|está probado)/i,
        /depende de (las|reseñas|reviews)/i,
      ],
      low: [
        /prefiero lo (conocido|tradicional|clásico)/i,
        /espero (a|que|hasta)/i,
        /cuando (todos|muchos) lo usen/i,
        /me cuesta (cambiar|adaptarme)/i,
      ],
      veryLow: [
        /no (me gusta|confío en) lo nuevo/i,
        /nunca (pruebo|uso|cambio)/i,
        /miedo|desconfianza|inseguro/i,
      ],
    },
  },
  {
    dimension: 'painPoint',
    patterns: {
      high: [
        /el (mayor|principal|peor) problema es/i,
        /lo que más (me frustra|odio|me cuesta)/i,
        /específicamente/i,
        /por ejemplo,/i,
        /concretamente/i,
      ],
      medium: [
        /un problema es/i,
        /me (molesta|frustra|cuesta) (un poco|algo)/i,
        /a veces/i,
      ],
      low: [
        /no (sé|estoy seguro) (cuál|qué)/i,
        /en general/i,
        /nada específico/i,
      ],
      veryLow: [
        /no tengo (problemas|quejas)/i,
        /todo bien|sin problemas/i,
        /ninguno/i,
      ],
    },
  },
  {
    dimension: 'currentBehavior',
    patterns: {
      high: [
        /actualmente (uso|hago|tengo)/i,
        /ya (probé|usé|compré)/i,
        /todos los días|diariamente|siempre/i,
        /gasto.*en esto/i,
        /mi rutina (actual|de|incluye)/i,
      ],
      medium: [
        /a veces (uso|hago)/i,
        /semanalmente|cada semana/i,
        /he (probado|intentado)/i,
      ],
      low: [
        /rara vez|ocasionalmente/i,
        /casi(nunca/i,
        /hace mucho (que no|tiempo)/i,
      ],
      veryLow: [
        /nunca (uso|hago|he|probé)/i,
        /no (uso|hago|tengo) nada/i,
        /desconozco/i,
      ],
    },
  },
];

// ============================================================
// MAIN SCORING FUNCTION
// ============================================================

export interface ValidationScoreResult {
  totalScore: number;
  confidence: number;
  dimensionScores: Record<Dimension, number>;
  breakdown: {
    dimension: Dimension;
    score: number;
    weight: number;
    weightedScore: number;
    evidence: string;
  }[];
  insights: string[];
  verdict: 'GO' | 'PIVOT' | 'NO_GO';
}

export function calculateValidationScore(
  questions: Question[],
  answers: Record<string, Answer>
): ValidationScoreResult {
  
  const breakdown: ValidationScoreResult['breakdown'] = [];
  const dimensionScores: Record<string, number> = {};
  const dimensionCounts: Record<string, number> = {};
  const insights: string[] = [];
  
  // Initialize dimensions
  Object.keys(DIMENSION_WEIGHTS).forEach(dim => {
    dimensionScores[dim] = 0;
    dimensionCounts[dim] = 0;
  });
  
  // Score each answer
  Object.values(answers).forEach((answer: any) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question || !answer.rawValue) return;
    
    const dimension = question.dimension || 'currentBehavior';
    const value = answer.rawValue.toString();
    
    // Calculate score for this answer
    const score = scoreAnswer(value, dimension);
    
    dimensionScores[dimension] = (dimensionScores[dimension] || 0) + score;
    dimensionCounts[dimension] = (dimensionCounts[dimension] || 0) + 1;
    
    breakdown.push({
      dimension: dimension as Dimension,
      score,
      weight: DIMENSION_WEIGHTS[dimension as Dimension] || 5,
      weightedScore: score * (DIMENSION_WEIGHTS[dimension as Dimension] || 5) / 100,
      evidence: value.substring(0, 50) + (value.length > 50 ? '...' : ''),
    });
  });
  
  // Average scores per dimension
  const finalDimensionScores: Record<Dimension, number> = {} as any;
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  Object.keys(DIMENSION_WEIGHTS).forEach(dim => {
    const count = dimensionCounts[dim] || 1;
    const avgScore = Math.round((dimensionScores[dim] || 50) / count);
    finalDimensionScores[dim as Dimension] = Math.min(100, Math.max(0, avgScore));
    
    const weight = DIMENSION_WEIGHTS[dim as Dimension];
    totalWeightedScore += avgScore * weight;
    totalWeight += weight;
  });
  
  // Calculate total score (weighted average)
  const totalScore = Math.round(totalWeightedScore / totalWeight);
  
  // Calculate confidence based on answer completeness
  const answeredCount = Object.keys(answers).length;
  const questionCount = questions.length;
  const confidence = Math.min(1, answeredCount / questionCount);
  
  // Generate insights
  const topDimension = Object.entries(finalDimensionScores)
    .sort((a, b) => b[1] - a[1])[0];
  const bottomDimension = Object.entries(finalDimensionScores)
    .sort((a, b) => a[1] - b[1])[0];
    
  if (topDimension[1] >= 70) {
    insights.push(`Fortaleza: ${getDimensionLabel(topDimension[0])} (${topDimension[1]}%)`);
  }
  if (bottomDimension[1] <= 40) {
    insights.push(`⚠️ Debilidad: ${getDimensionLabel(bottomDimension[0])} (${bottomDimension[1]}%)`);
  }
  if (finalDimensionScores.willingnessToPay < 50 && finalDimensionScores.problemIntensity > 60) {
    insights.push('🔴 Red Flag: Problema alto pero baja disposición a pagar');
  }
  if (totalScore >= 70) {
    insights.push('✅ Señales positivas de validación');
  }
  
  // Determine verdict
  let verdict: 'GO' | 'PIVOT' | 'NO_GO';
  if (totalScore >= 70 && finalDimensionScores.willingnessToPay >= 60) {
    verdict = 'GO';
  } else if (totalScore >= 40 || finalDimensionScores.problemIntensity >= 60) {
    verdict = 'PIVOT';
  } else {
    verdict = 'NO_GO';
  }
  
  return {
    totalScore,
    confidence,
    dimensionScores: finalDimensionScores,
    breakdown,
    insights,
    verdict,
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function scoreAnswer(value: string, dimension: string): number {
  const rule = SCORING_RULES.find(r => r.dimension === dimension);
  if (!rule) return 50; // Default neutral
  
  // Check for numeric scales first (1-10)
  const numMatch = value.match(/^(\d+)$/);
  if (numMatch && rule.numericThresholds) {
    const num = parseInt(numMatch[1]);
    if (num >= rule.numericThresholds.veryHigh) return 100;
    if (num >= rule.numericThresholds.high) return 80;
    if (num >= rule.numericThresholds.medium) return 60;
    if (num >= rule.numericThresholds.low) return 40;
    return 20;
  }
  
  // Pattern matching
  if (rule.patterns.high.some(p => p.test(value))) return 85;
  if (rule.patterns.medium.some(p => p.test(value))) return 60;
  if (rule.patterns.low.some(p => p.test(value))) return 35;
  if (rule.patterns.veryLow.some(p => p.test(value))) return 15;
  
  // Fallback: analyze sentiment and length
  const positiveWords = /bueno|bien|sí|genial|excelente|mucho|muy|siempre|me gusta|perfecto/gi;
  const negativeWords = /malo|mal|no|nunca|poco|nada|jamás|difícil|problema/gi;
  
  const positiveCount = (value.match(positiveWords) || []).length;
  const negativeCount = (value.match(negativeWords) || []).length;
  
  if (positiveCount > negativeCount + 1) return 70;
  if (negativeCount > positiveCount + 1) return 30;
  
  // Long detailed answers are generally positive (engagement)
  if (value.length > 100) return 60;
  if (value.length > 50) return 55;
  
  return 50; // Neutral default
}

function getDimensionLabel(dim: string): string {
  const labels: Record<string, string> = {
    problemIntensity: 'Intensidad del Problema',
    willingnessToPay: 'Disposición a Pagar',
    solutionFit: 'Ajuste de Solución',
    earlyAdopter: 'Perfil Early Adopter',
    painPoint: 'Claridad del Pain Point',
    currentBehavior: 'Comportamiento Actual',
  };
  return labels[dim] || dim;
}

export default calculateValidationScore;
