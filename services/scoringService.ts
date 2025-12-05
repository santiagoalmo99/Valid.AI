import { Interview } from '../types';

export interface YCScoreResult {
  totalScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  verdict: 'Ready for YC' | 'Strong Candidate' | 'Validation Needed' | 'Too Early';
  breakdown: {
    volumeScore: number;      // 0-20
    performanceScore: number; // 0-50
    consistencyScore: number; // 0-30
  };
  details: string[]; // Explanations for the user
}

/**
 * Calculates the YC Readiness Score based on deterministic math.
 * NO AI hallucinations. Pure data validation.
 */
export function calculateYCReadiness(interviews: Interview[]): YCScoreResult {
  const details: string[] = [];
  
  // 1. VOLUME SCORE (20 points max)
  // Target: 10 interviews = 100% of this metric
  const validInterviews = interviews.length;
  const volumeRaw = Math.min(validInterviews, 10); // Cap at 10 for calculation
  const volumeScore = (volumeRaw / 10) * 20;
  
  if (validInterviews < 5) details.push(`📉 Low Data Volume: Only ${validInterviews}/10 interviews. We need more data for statistical significance.`);
  else if (validInterviews >= 10) details.push(`✅ Strong Data Volume: ${validInterviews} interviews conducted.`);

  // 2. PERFORMANCE SCORE (50 points max)
  // Target: Average score of 7.0+ = 100% of this metric
  // Formula: (AvgScore / 10) * 50
  
  let performanceScore = 0;
  let avgScore = 0;
  
  if (validInterviews > 0) {
    const totalPoints = interviews.reduce((sum, i) => sum + (i.totalScore || 0), 0);
    avgScore = totalPoints / validInterviews;
    performanceScore = Math.min((avgScore / 10) * 50, 50);
  }
  
  if (avgScore >= 7) details.push(`🔥 High Performance: Average score ${avgScore.toFixed(1)}/10 indicates strong problem/solution fit.`);
  else if (avgScore < 5) details.push(`⚠️ Low Performance: Average score ${avgScore.toFixed(1)}/10 suggests the problem isn't painful enough yet.`);

  // 3. CONSISTENCY SCORE (30 points max)
  // Target: Low Standard Deviation < 2.0
  // Formula: Inverse of deviation. Lower deviation = Higher score.
  
  let consistencyScore = 0;
  
  if (validInterviews > 1) {
    const variance = interviews.reduce((sum, i) => sum + Math.pow((i.totalScore || 0) - avgScore, 2), 0) / validInterviews;
    const stdDev = Math.sqrt(variance);
    
    // Scoring logic:
    // StdDev 0-1.5: Excellent (30pts)
    // StdDev 1.5-3.0: Moderate (15pts)
    // StdDev >3.0: Chaotic (5pts)
    
    if (stdDev <= 1.5) {
      consistencyScore = 30;
      details.push(`🎯 High Consistency: Respondents strongly agree (Deviation: ${stdDev.toFixed(1)}). Signal is clear.`);
    } else if (stdDev <= 3.0) {
      consistencyScore = 15;
      details.push(`⚖️ Moderate Consistency: Some disagreement among users (Deviation: ${stdDev.toFixed(1)}). Segment your audience.`);
    } else {
      consistencyScore = 5;
      details.push(`🌪️ Low Consistency: Responses are all over the place (Deviation: ${stdDev.toFixed(1)}). You might be targeting too broad an audience.`);
    }
  } else {
    // Default for single interview (assume low consistency until proven)
    consistencyScore = 0;
  }

  // TOTAL SCORE
  const totalScore = Math.round(volumeScore + performanceScore + consistencyScore);
  
  // VERDICT & GRADE
  let grade: YCScoreResult['grade'] = 'D';
  let verdict: YCScoreResult['verdict'] = 'Too Early';
  
  if (totalScore >= 85) { grade = 'A+'; verdict = 'Ready for YC'; }
  else if (totalScore >= 70) { grade = 'A'; verdict = 'Strong Candidate'; }
  else if (totalScore >= 50) { grade = 'B'; verdict = 'Validation Needed'; }
  else if (totalScore >= 30) { grade = 'C'; verdict = 'Too Early'; }
  else { grade = 'D'; verdict = 'Too Early'; }

  return {
    totalScore,
    grade,
    verdict,
    breakdown: {
      volumeScore: Math.round(volumeScore),
      performanceScore: Math.round(performanceScore),
      consistencyScore: Math.round(consistencyScore)
    },
    details
  };
}
