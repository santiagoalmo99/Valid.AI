import { Interview } from '../types';

/**
 * Anomaly Detection Utility
 * Uses statistical methods to identify outliers and suspicious patterns in interview data.
 */

export interface Anomaly {
  interviewId: string;
  type: 'outlier' | 'consistency' | 'pattern';
  metric: string;
  value: number;
  deviation: number; // Standard deviations from mean
  message: string;
}

export const detectAnomalies = (interviews: Interview[]): Anomaly[] => {
  if (interviews.length < 5) return []; // Need minimum sample size for stats

  const anomalies: Anomaly[] = [];

  // 1. Extract Metrics
  const metrics: Record<string, number[]> = {};
  
  interviews.forEach(interview => {
    Object.entries(interview.scores || {}).forEach(([key, value]) => {
      if (!metrics[key]) metrics[key] = [];
      metrics[key].push(value as number);
    });
  });

  // 2. Calculate Stats per Metric
  Object.entries(metrics).forEach(([key, values]) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return; // No variation, skip

    // 3. Find Outliers (> 2 SD)
    interviews.forEach(interview => {
      const val = interview.scores?.[key];
      if (val === undefined) return;

      const deviation = Math.abs(val - mean) / stdDev;

      if (deviation > 2.0) {
        anomalies.push({
          interviewId: interview.id,
          type: 'outlier',
          metric: key,
          value: val,
          deviation: Number(deviation.toFixed(1)),
          message: `Score ${val} is a statistical outlier (${deviation.toFixed(1)} SD from mean ${mean.toFixed(1)})`
        });
      }
    });
  });

  // 4. Detect Suspicious Consistency (e.g., all answers are 10)
  interviews.forEach(interview => {
    const scores = Object.values(interview.scores || {});
    if (scores.length > 3) {
      const uniqueScores = new Set(scores);
      if (uniqueScores.size === 1) {
        anomalies.push({
          interviewId: interview.id,
          type: 'pattern',
          metric: 'All Scores',
          value: scores[0],
          deviation: 0,
          message: `Suspicious consistency: All scores are exactly ${scores[0]}`
        });
      }
    }
  });

  return anomalies;
};
