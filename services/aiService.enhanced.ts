import { ProjectTemplate, EnhancedAnalysisResult, Contradiction, EnhancedAnswer } from '../types';
import { callGeminiAPI } from './aiService';

/**
 * PHASE 19: SURGICAL MULTI-PASS ANALYSIS ENGINE (V4)
 * 
 * This service implements the "VC-Grade" analysis logic.
 * It uses a specialized prompt to simulate a panel of experts:
 * 1. YC Partner (Strategic viability)
 * 2. Behavioral Psychologist (Lie detection/Hidden motives)
 * 3. Data Scientist (Evidence weighting)
 */

export const analyzeFullInterviewEnhanced = async (
  project: ProjectTemplate, 
  answers: Record<string, EnhancedAnswer>, 
  respondentProfile: any
): Promise<EnhancedAnalysisResult> => {

  // 1. DATA NORMALIZATION LAYER
  // Convert complex answer objects into a linear transcript text for the AI
  let interviewTranscript = "";
  let notesContext = "";
  
  if (answers) {
    Object.values(answers).forEach((ans: any, index: number) => {
      // Determine the "real" answer (voice transcript usually more honest than typed)
      const voiceText = ans.transcription?.text || "";
      const typedText = ans.typedAnswer || ans.rawValue || ""; // Fallback to rawValue for legacy compatibility
      const finalAnswer = voiceText.length > typedText.length ? voiceText : typedText;

      interviewTranscript += `Q${index+1}: [Question Context omitted]\n`;
      interviewTranscript += `ANSWER: "${finalAnswer.replace(/"/g, "'")}"\n`;
      
      if (ans.interviewerNotes) {
        notesContext += `Note on Q${index+1}: ${ans.interviewerNotes}\n`;
      }
    });
  }

  const projectContext = `
    PROJECT: ${project.name}
    PITCH: ${project.description}
    TARGET: ${project.targetAudience}
  `;

  // 2. SURGICAL PROMPT CONSTRUCTION
  const prompt = `
    ROLE_PLAY: You are a "Surgical Startup Validator" composed of 3 personas:
    A) Y Combinator Partner (Ruthless focus on market size and problem severity)
    B) Behavioral Psychologist (Detects "Social Desirability Bias" and "Mom Test" failures)
    C) Data Scientist (Looks for concrete numbers vs vague promises)

    TASK: Analyze this interview transcript deeply. Do not be polite. Be accurate.

    ${projectContext}

    RESPONDENT PROFILE: ${JSON.stringify(respondentProfile)}

    TRANSCRIPT:
    ${interviewTranscript}

    INTERVIEWER OBSERVATIONS:
    ${notesContext}

    -----------------------------------

    OUTPUT FORMAT (JSON ONLY):
    {
      "matchScore": number (0-100, be strict, 70 is high),
      "verdict": "GO" | "NO-GO" | "PIVOT",
      "oneLinerVerdict": "A brutal but honest 10-word summary",
      "scores": {
        "problemIntensity": number (0-100, is it a hair-on-fire problem?),
        "solutionFit": number (0-100, does this actually solve it?),
        "marketTiming": number (0-100, why now?),
        "founderFit": number (0-100, based on depth of insight)
      },
      "signals": {
        "buying": ["Quote 1", "Specific budget mention", "Urgency signal"],
        "redFlags": ["Polite lie example", "Contradiction example", "Vague promise"],
        "contradictions": [
          { "quote1": "I love it", "quote2": "I wouldn't pay", "analysis": "Classic polite rejection", "severity": "high" }
        ]
      },
      "recommendedPivot": "If NO-GO or PIVOT, suggest one concrete change. Else null.",
      "visualAnalogy": "Your startup is like X but for Y (or a funny/insightful metaphor)"
    }
  `;

  try {
    // 3. EXECUTION LAYER
    const rawResponse = await callGeminiAPI(prompt, true); // true = prefer JSON model if possible
    
    // 4. PARSING LAYER
    const cleanJson = cleanJsonOutput(rawResponse);
    return JSON.parse(cleanJson) as EnhancedAnalysisResult;

  } catch (error) {
    console.error("Surgical Analysis Failed:", error);
    // Fallback safe object matched to new type
    return {
      matchScore: 0,
      verdict: "NO-GO",
      oneLinerVerdict: "AI Analysis temporarily unavailable.",
      scores: { 
        problemIntensity: 0, 
        solutionFit: 0, 
        marketTiming: 0, 
        founderFit: 0 
      },
      signals: { 
        buying: [], 
        redFlags: ["System Error: Analysis Failed"], 
        contradictions: [] 
      },
      recommendedPivot: "Retry analysis later."
    };
  }
};

// Utility to clean Markdown JSON blocks (```json ... ```) often returned by LLMs
function cleanJsonOutput(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean.trim();
}
