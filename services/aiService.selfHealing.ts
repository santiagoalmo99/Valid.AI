// services/aiService.selfHealing.ts - Self-Healing AI Wrapper
// Multi-shot analysis with retry, self-consistency voting, and automatic recovery

import { ProjectTemplate, EnhancedAnalysisResult } from '../types';
import { analyzeFullInterviewEnhanced } from './aiService.enhanced';
import { logger } from './logger';
import { telemetry } from './telemetry';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Main export: Self-healing analysis with retry and validation
export async function analyzeWithRecovery(
  project: ProjectTemplate,
  answers: any,
  regData: any
): Promise<EnhancedAnalysisResult> {
  logger.info('Starting self-healing analysis', {
    projectId: project.id,
    maxRetries: MAX_RETRIES,
  });

  const stopTimer = logger.startTimer('Self-Healing Analysis');
  const results: EnhancedAnalysisResult[] = [];
  let attempts = 0;

  telemetry.trackFlowStart('self_healing_analysis');

  // Multi-shot with self-consistency
  for (let i = 0; i < MAX_RETRIES; i++) {
    attempts++;
    
    try {
      logger.debug(`Attempt ${i + 1}/${MAX_RETRIES}`);
      
      const result = await analyzeFullInterviewEnhanced(project, answers, regData);

      // Validation layer: Only accept if passes quality checks
      if (validateAnalysisQuality(result)) {
        results.push(result);
        logger.info(`✅ Attempt ${i + 1} passed validation`, {
          confidence: result.scores.confidence,
          evidenceQuality: result.validation.evidenceQuality,
        });
      } else {
        logger.warn(`⚠️ Attempt ${i + 1} failed validation, retrying...`, {
          confidence: result.scores.confidence,
          contradictions: result.validation.contradictions.length,
        });
      }
    } catch (error) {
      logger.error(`❌ Attempt ${i + 1} crashed`, error as Error);
      
      // Wait before retry
      if (i < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY_MS * (i + 1)); // Exponential backoff
      }
    }

    // Early exit if we have 2 good results
    if (results.length >= 2) {
      logger.info('✅ Early exit: 2 valid results obtained');
      break;
    }
  }

  stopTimer();

  // Self-Consistency: Vote on best result
  if (results.length >= 2) {
    const best = selectBestResult(results);
    logger.info('✅ Self-consistency voting complete', {
      candidateCount: results.length,
      selectedConfidence: best.scores.confidence,
    });

    telemetry.trackFlowComplete('self_healing_analysis');
    return best;
  } else if (results.length === 1) {
    logger.warn('⚠️ Only 1 result available, returning without voting');
    telemetry.trackFlowComplete('self_healing_analysis');
    return results[0];
  } else {
    logger.error('❌ All attempts failed, returning fallback');
    telemetry.trackFlowDropOff('self_healing_analysis', 'all_attempts_failed');
    
    return {
      reasoning: {
        step1_context: 'Análisis no disponible',
        step2_problem_validation: 'Todos los intentos fallaron',
        step3_solution_fit: 'No evaluado',
        step4_willingness_to_pay: 'No evaluado',
        step5_red_flags: ['AI service unavailable'],
      },
      scores: {
        totalScore: 0,
        confidence: 0.0,
        dimensionScores: {
          problemIntensity: 0,
          solutionFit: 0,
          currentBehavior: 0,
          painPoint: 0,
          earlyAdopter: 0,
          willingnessToPay: 0,
        },
      },
      validation: {
        contradictions: [],
        evidenceQuality: 'weak',
        biasIndicators: ['Servicio de IA no disponible'],
      },
      summary: 'El análisis no pudo completarse después de múltiples intentos.',
      keyInsights: [
        'Sistema de IA temporalmente no disponible',
        'Verificar conexión a internet',
        'Contactar soporte si el problema persiste',
      ],
    };
  }
}

// Validation: Does this result meet quality standards?
function validateAnalysisQuality(result: EnhancedAnalysisResult): boolean {
  // Reject if confidence too low
  if (result.scores.confidence < 0.3) {
    logger.warn('Rejected: Confidence too low', {
      confidence: result.scores.confidence,
    });
    return false;
  }

  // Reject if summary is placeholder or too short
  if (
    result.summary.length < 20 ||
    result.summary.includes('Analysis failed') ||
    result.summary.includes('no disponible')
  ) {
    logger.warn('Rejected: Invalid summary');
    return false;
  }

  // Reject if total score is out of range
  if (result.scores.totalScore < 0 || result.scores.totalScore > 100) {
    logger.warn('Rejected: Score out of range', {
      totalScore: result.scores.totalScore,
    });
    return false;
  }

  // Reject if too many red flags
  if (result.validation.contradictions.length > 3) {
    logger.warn('Rejected: Too many contradictions', {
      count: result.validation.contradictions.length,
    });
    return false;
  }

  // Passed all checks
  return true;
}

// Self-Consistency Voting: Select the best result from multiple attempts
function selectBestResult(results: EnhancedAnalysisResult[]): EnhancedAnalysisResult {
  logger.info('🗳️ Voting on best result', { candidateCount: results.length });

  // Score each result
  const scored = results.map((result) => ({
    result,
    votingScore: calculateVotingScore(result),
  }));

  // Sort by voting score (highest first)
  scored.sort((a, b) => b.votingScore - a.votingScore);

  logger.debug('Voting results', {
    scores: scored.map((s) => s.votingScore),
  });

  return scored[0].result;
}

// Calculate a "voting score" to rank results
function calculateVotingScore(result: EnhancedAnalysisResult): number {
  let score = 0;

  // Confidence is most important
  score += result.scores.confidence * 50;

  // Evidence quality
  const evidenceBonus = {
    strong: 30,
    moderate: 15,
    weak: 0,
  };
  score += evidenceBonus[result.validation.evidenceQuality];

  // Penalize contradictions
  score -= result.validation.contradictions.length * 5;

  // Bonus for detailed reasoning
  const reasoningLength =
    result.reasoning.step1_context.length +
    result.reasoning.step2_problem_validation.length +
    result.reasoning.step3_solution_fit.length +
    result.reasoning.step4_willingness_to_pay.length;
  score += Math.min(reasoningLength / 50, 10); // Max +10 bonus

  // Bonus for insightful key insights
  score += result.keyInsights.length * 2;

  return score;
}

// Helper: Sleep for delay
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
