
import { useState, useEffect, useMemo } from 'react';
import { ProjectTemplate, Interview } from '../types';
import { detectWidgetType } from '../utils/questionWidgetDetector';

interface ValidationScore {
  totalScore: number;
  dimensionScores: {
    problemIntensity: number;
    willingnessToPay: number;
    marketSize: number; // Inferred or Manual
    executionRisk: number; // Inversed
  };
  trend: 'up' | 'down' | 'stable';
}

export const useValidationScore = (project: ProjectTemplate, interviews: Interview[]) => {
  const [score, setScore] = useState<ValidationScore>({
    totalScore: 0,
    dimensionScores: {
      problemIntensity: 0,
      willingnessToPay: 0,
      marketSize: 0,
      executionRisk: 0
    },
    trend: 'stable'
  });

  // Calculate scores whenever interviews change
  useEffect(() => {
    if (!interviews || interviews.length === 0) {
      // Default / Starting state
      setScore({
        totalScore: project.deepAnalysis?.viabilityScore || 0, // Fallback to AI score
        dimensionScores: {
          problemIntensity: project.deepAnalysis?.viabilityScore || 0,
          willingnessToPay: 0,
          marketSize: 0,
          executionRisk: 0
        },
        trend: 'stable'
      });
      return;
    }

    let totalProblemIntensity = 0;
    let totalWillingness = 0;
    
    // Safety check for questions
    const questions = project.questions || [];
    
    // 1. Map Questions to Dimensions
    // We try to guess which question maps to which dimension based on keywords or widget type
    // In a real app, this should be defined in the template config
    const dimensionMap = questions.map(q => {
      const text = q.text.toLowerCase();
      if (text.includes('precio') || text.includes('pagar') || text.includes('costo') || text.includes('compraría')) return 'willingnessToPay';
      if (text.includes('dolor') || text.includes('problema') || text.includes('necesidad') || text.includes('difícil')) return 'problemIntensity';
      return 'other';
    });

    let validInterviewsCount = 0;
    
    interviews.forEach(interview => {
      validInterviewsCount++;
      
      if (Array.isArray(interview.answers)) {
          interview.answers.forEach((ans, idx) => {
            if (idx >= dimensionMap.length) return;
            
            const dimension = dimensionMap[idx];
            const val = normalizeAnswerValue(ans, questions[idx]);
            
            if (dimension === 'problemIntensity') totalProblemIntensity += val;
            if (dimension === 'willingnessToPay') totalWillingness += val;
          });
      }
    });

    // Averages
    const avgProblem = validInterviewsCount > 0 ? (totalProblemIntensity / validInterviewsCount) : 0;
    const avgWillingness = validInterviewsCount > 0 ? (totalWillingness / validInterviewsCount) : 0;
    
    // Heuristic for Market Size (Placeholder logic: more interviews = higher confidence/size proxy)
    const marketProxy = Math.min(validInterviewsCount * 10, 100); 

    // Weighted Total Calculation
    // Problem (40%) + Willingness (40%) + Market (20%)
    const calculatedTotal = Math.round(
      (avgProblem * 0.4) + 
      (avgWillingness * 0.4) + 
      (marketProxy * 0.2)
    );

    setScore(prev => ({
      totalScore: calculatedTotal || prev.totalScore, // Keep previous if calc checks fail
      dimensionScores: {
        problemIntensity: Math.round(avgProblem),
        willingnessToPay: Math.round(avgWillingness),
        marketSize: marketProxy,
        executionRisk: 100 - marketProxy // Inverse of market size/validation count for now
      },
      trend: calculatedTotal > prev.totalScore ? 'up' : calculatedTotal < prev.totalScore ? 'down' : 'stable'
    }));

  }, [interviews, project]);

  return score;
};

// Helper: Convert any widget answer string to 0-100 number
function normalizeAnswerValue(answer: string, question: any): number {
  if (!answer) return 0;
  
  // 1. Text is NaN
  if (isNaN(Number(answer))) {
    // Boolean
    if (answer.toLowerCase() === 'sí' || answer.toLowerCase() === 'si') return 100;
    if (answer.toLowerCase() === 'no') return 0;
    
    // Likert / Sentiment (Basic Keyword matching)
    const lower = answer.toLowerCase();
    if (lower.includes('muy probable') || lower.includes('definitivamente')) return 100;
    if (lower.includes('probable')) return 75;
    if (lower.includes('indiferente') || lower.includes('tal vez')) return 50;
    if (lower.includes('poco probable')) return 25;
    
    return 50; // Neutral default for text
  }
  
  // 2. Numbers
  const num = parseFloat(answer);
  
  // Detect Scale via Question or Heuristics
  // If value is <= 5, assume 1-5 scale. If <= 10, assume 1-10.
  // Exception: NPS is 0-10 but clearly defined.
  
  // Try to use strict widget type if available attached to question (not passed here usually, but we can try)
  // For now, heuristic:
  if (num <= 5 && num % 1 === 0) return num * 20; // 1-5 -> 20, 40, 60, 80, 100
  if (num <= 10) return num * 10; // 1-10 -> 10, 20... 100
  
  return Math.min(num, 100); // Cap at 100
}
