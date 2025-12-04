import { Interview } from '../types';

/**
 * Bias Detection Utility
 * Identifies potential cognitive biases in interview responses.
 */

export interface DetectedBias {
  type: 'social_desirability' | 'acquiescence' | 'extremity' | 'recency';
  confidence: number; // 0.0 - 1.0
  evidence: string[];
  description: string;
}

export const detectBiases = (interview: Interview): DetectedBias[] => {
  const biases: DetectedBias[] = [];
  const answers = Object.values(interview.answers || {});
  const scores = Object.values(interview.scores || {});

  // 1. Acquiescence Bias (Yes-saying)
  // If user agrees with everything or gives only high scores
  const highScores = scores.filter(s => s >= 8).length;
  if (scores.length > 3 && highScores === scores.length) {
    biases.push({
      type: 'acquiescence',
      confidence: 0.8,
      evidence: [`All ${scores.length} scores are high (8+)`],
      description: "User may be trying to be polite or agreeable (Acquiescence Bias)."
    });
  }

  // 2. Extremity Bias
  // Only 1s and 10s, no middle ground
  const extremeScores = scores.filter(s => s === 1 || s === 10).length;
  if (scores.length > 3 && extremeScores === scores.length) {
    biases.push({
      type: 'extremity',
      confidence: 0.7,
      evidence: [`All scores are either 1 or 10`],
      description: "User tends to choose extreme options, lacking nuance."
    });
  }

  // 3. Social Desirability (Simple Heuristic)
  // Look for keywords indicating "perfect" behavior
  const perfectKeywords = ['always', 'never', 'every day', 'perfectly', '100%'];
  const suspiciousAnswers = answers.filter(a => 
    typeof a === 'string' && perfectKeywords.some(kw => a.toLowerCase().includes(kw))
  );

  if (suspiciousAnswers.length >= 2) {
    biases.push({
      type: 'social_desirability',
      confidence: 0.6,
      evidence: suspiciousAnswers.map(a => `"${a}"`),
      description: "Answers claim unrealistic consistency, suggesting Social Desirability Bias."
    });
  }

  // 4. Short/Lazy Answers (Recency/Fatigue)
  const shortAnswers = answers.filter(a => typeof a === 'string' && a.length < 5);
  if (answers.length > 5 && shortAnswers.length > answers.length / 2) {
    biases.push({
      type: 'recency', // Or fatigue
      confidence: 0.8,
      evidence: [`${shortAnswers.length} answers are very short (<5 chars)`],
      description: "User gave very short answers, possibly due to fatigue or lack of interest."
    });
  }

  return biases;
};
