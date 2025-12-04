// services/aiService.enhanced.ts - Surgical-Level AI Analysis System
// This is the NEW enhanced version with chain-of-thought, validation, and self-healing

import { Question, ProjectTemplate, EnhancedAnalysisResult, Contradiction } from '../types';
import { logger } from './logger';
import { telemetry } from './telemetry';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL = 'gemini-2.0-flash-exp'; // Using latest model

// Helper: Call Gemini API
async function callGeminiAPI(prompt: string, json: boolean = false): Promise<string> {
  const stopTimer = logger.startTimer('Gemini API Call');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: json
            ? { responseMimeType: 'application/json' }
            : {},
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '';
    
    stopTimer();
    return text;
  } catch (error) {
    stopTimer();
    logger.error('Gemini API call failed', error as Error);
    throw error;
  }
}

// Core: Surgical-Level Interview Analysis
export async function analyzeFullInterviewEnhanced(
  project: ProjectTemplate,
  answers: any,
  regData: any
): Promise<EnhancedAnalysisResult> {
  logger.info('Starting enhanced interview analysis', {
    projectId: project.id,
    answerCount: Object.keys(answers).length,
  });

  const stopTimer = logger.startTimer('Enhanced Interview Analysis');

  try {
    // Enrich answers with question context
    const enrichedAnswers = Object.values(answers).map((ans: any) => {
      const q = project.questions.find((q: Question) => q.id === ans.questionId);
      return {
        question: q ? q.text : 'Unknown Question',
        answer: ans.rawValue,
        observation: ans.observation,
        dimension: q ? q.dimension : 'unknown',
      };
    });

    const prompt = `
You are a Senior VC Analyst with a PhD in Psychology and 15 years of experience identifying viable startups.

PROJECT CONTEXT:
Name: "${project.name}"
Description: "${project.description}"

RESPONDENT DATA:
${JSON.stringify(regData, null, 2)}

INTERVIEW TRANSCRIPT:
${JSON.stringify(enrichedAnswers, null, 2)}

TASK: Analyze this customer interview using scientific rigor.

REASONING CHAIN (Show your work step-by-step):

1. CONTEXT ASSESSMENT:
   Evaluate the respondent's background, domain expertise, and relevance to this problem space.
   
2. PROBLEM VALIDATION:
   Does the respondent demonstrate REAL pain? Look for:
   - Evidence of time/money already spent trying to solve this
   - Concrete examples of pain points
   - Urgency indicators
   - NOT just "I would like this"

3. SOLUTION FIT:
   Does our proposed solution align with their stated needs?
   - Do they understand what we're offering?
   - Does it address their actual pain points?
   - Are there misalignments between what they want and what we provide?

4. WILLINGNESS TO PAY:
   Is there concrete evidence of payment intent?
   - Current spending on alternatives
   - Budget allocated or available
   - Decision-making authority
   - NOT just "I would pay"

5. RED FLAGS:
   Identify contradictions, social desirability bias, or vague responses:
   - Contradictions: "I desperately need this" but "I won't pay"
   - Social desirability: overly positive, agreeable responses
   - Vague responses: no concrete examples or details
   - Temporal inconsistency: claims don't match timelines

SCORING RUBRIC (0-100 total):
- Problem Severity (0-25): Must cite specific evidence of pain
- Solution Fit (0-25): Based on answer alignment with solution
- Willingness to Pay (0-25): Only high if concrete commitment evidence
- Market Timing (0-25): Based on urgency indicators

CONFIDENCE SCORING (0.0-1.0):
- 0.9-1.0: Strong evidence, no contradictions, concrete examples, verified past behavior
- 0.7-0.8: Good evidence, minor inconsistencies, mostly concrete
- 0.5-0.6: Vague answers, possible social desirability bias, hypothetical statements
- 0.3-0.4: Significant contradictions, mostly opinions, no concrete evidence
- 0.0-0.2: Red flags, incompatible profile, insincere responses

EVIDENCE QUALITY:
- "strong": Concrete examples, past behavior, financial evidence, specific timelines
- "moderate": Some examples, general statements, intent without proof
- "weak": Vague, hypothetical, no examples, "I would" statements

OUTPUT FORMAT (JSON):
{
  "reasoning": {
    "step1_context": "1-2 sentences evaluating respondent relevance",
    "step2_problem_validation": "2-3 sentences with specific evidence of pain OR lack thereof",
    "step3_solution_fit": "2 sentences on alignment",
    "step4_willingness_to_pay": "2 sentences with evidence OR red flags",
    "step5_red_flags": ["List 0-5 specific contradictions or bias indicators"]
  },
  "scores": {
    "totalScore": 0-100,
    "confidence": 0.0-1.0,
    "dimensionScores": {
      "problemIntensity": 0-100,
      "solutionFit": 0-100,
      "currentBehavior": 0-100,
      "painPoint": 0-100,
      "earlyAdopter": 0-100,
      "willingnessToPay": 0-100
    }
  },
  "validation": {
    "contradictions": [
      {
        "type": "logical" | "behavioral" | "temporal",
        "description": "Specific contradiction found",
        "severity": "high" | "medium" | "low",
        "impactOnScore": -10 to 0
      }
    ],
    "evidenceQuality": "strong" | "moderate" | "weak",
    "biasIndicators": ["List any social desirability bias, acquiescence, etc."]
  },
  "summary": "ONE-LINE VERDICT (e.g., 'Strong early adopter with verified pain and budget' or 'Polite respondent with no real commitment'). Max 15 words.",
  "keyInsights": [
    "Insight 1: Specific behavioral observation or opportunity",
    "Insight 2: Risk or barrier identified",
    "Insight 3: Profile verdict (e.g., 'Ideal customer', 'False positive', 'Needs education')"
  ]
}

CRITICAL RULES:
1. Be skeptical. Value facts over opinions.
2. If confidence < 0.5, explain why in summary.
3. If contradictions exist, penalize confidence.
4. Output ONLY valid JSON, no markdown, no code blocks.
5. Language: Professional Latin American Spanish.
`;

    const rawResponse = await callGeminiAPI(prompt, true);
    
    logger.debug('Enhanced AI Response', {
      responseLength: rawResponse.length,
      preview: rawResponse.substring(0, 150),
    });

    // Parse and validate
    const parsed = JSON.parse(rawResponse) as EnhancedAnalysisResult;

    // Validate structure
    if (!validateEnhancedAnalysis(parsed)) {
      throw new Error('Invalid analysis structure');
    }

    stopTimer();
    
    telemetry.trackEvent({
      category: 'AI Analysis',
      action: 'enhanced_analysis_success',
      value: parsed.scores.confidence,
      metadata: {
        totalScore: parsed.scores.totalScore,
        evidenceQuality: parsed.validation.evidenceQuality,
        contradictionCount: parsed.validation.contradictions.length,
      },
    });

    return parsed;
  } catch (error) {
    stopTimer();
    logger.error('Enhanced analysis failed', error as Error);
    
    telemetry.trackError(error as Error, {
      context: 'analyzeFullInterviewEnhanced',
    });

    // Fallback response
    return getFallbackAnalysis(answers);
  }
}

// Validation function
function validateEnhancedAnalysis(result: any): result is EnhancedAnalysisResult {
  if (!result.reasoning || !result.scores || !result.validation) {
    logger.warn('Missing required fields in analysis');
    return false;
  }

  if (typeof result.scores.confidence !== 'number' || 
      result.scores.confidence < 0 || 
      result.scores.confidence > 1) {
    logger.warn('Invalid confidence score', { confidence: result.scores.confidence });
    return false;
  }

  if (result.scores.totalScore < 0 || result.scores.totalScore > 100) {
    logger.warn('Invalid total score', { totalScore: result.scores.totalScore });
    return false;
  }

  if (!result.summary || result.summary.length < 10) {
    logger.warn('Summary too short');
    return false;
  }

  if (result.validation.contradictions.length > 5) {
    logger.warn('Too many contradictions detected', {
      count: result.validation.contradictions.length,
    });
    return false;
  }

  return true;
}

// Fallback when AI fails - calculate scores from actual answers
function getFallbackAnalysis(answers: any): EnhancedAnalysisResult {
  // Calculate basic score from answers
  const answerValues = Object.values(answers) as any[];
  let totalPoints = 0;
  let validAnswers = 0;
  
  answerValues.forEach((ans: any) => {
    const val = ans.rawValue;
    if (!val) return;
    
    // Extract numeric from scales
    const numMatch = val.match(/^\d+$/);
    if (numMatch) {
      const num = parseInt(numMatch[0]);
      // Normalize 1-10 scale to 0-100
      if (num <= 10) {
        totalPoints += num * 10;
        validAnswers++;
      }
    } 
    // Positive keywords
    else if (/sí|yes|definitivamente|mucho|siempre|excelente/i.test(val)) {
      totalPoints += 80;
      validAnswers++;
    }
    // Negative keywords  
    else if (/no|nunca|jamás|nada/i.test(val)) {
      totalPoints += 20;
      validAnswers++;
    }
    // Neutral/text answers
    else if (val.length > 5) {
      totalPoints += 50;
      validAnswers++;
    }
  });
  
  const calculatedScore = validAnswers > 0 ? Math.round(totalPoints / validAnswers) : 50;
  
  return {
    reasoning: {
      step1_context: 'Análisis calculado localmente (sin IA)',
      step2_problem_validation: `Se evaluaron ${validAnswers} respuestas`,
      step3_solution_fit: 'Pendiente evaluación manual',
      step4_willingness_to_pay: 'Revisar respuestas financieras manualmente',
      step5_red_flags: [],
    },
    scores: {
      totalScore: calculatedScore,
      confidence: 0.4,
      dimensionScores: {
        problemIntensity: calculatedScore,
        solutionFit: calculatedScore,
        currentBehavior: calculatedScore,
        painPoint: calculatedScore,
        earlyAdopter: calculatedScore,
        willingnessToPay: calculatedScore,
      },
    },
    validation: {
      contradictions: [],
      evidenceQuality: 'moderate',
      biasIndicators: [],
    },
    summary: `Score estimado: ${calculatedScore}/100. La IA no pudo completar el análisis detallado. Se recomienda revisar las respuestas manualmente.`,
    keyInsights: [
      `Se procesaron ${validAnswers} respuestas con éxito`,
      'El score refleja un promedio de las respuestas cuantificables',
      'Conectar con Gemini API para análisis profundo',
    ],
  };
}

export type { EnhancedAnalysisResult };

