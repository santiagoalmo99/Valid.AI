import { GoogleGenerativeAI } from "@google/generative-ai";
import { Question, AIAnalysisResult, ProjectTemplate, Interview, DeepAnalysisReport } from '../types';
import { cacheService } from './cacheService';

// Initialize the official Google Generative AI SDK
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Simplified model selection: Flash for speed/cost, Pro for depth
const MODELS = {
  default: "gemini-1.5-flash",
  pro: "gemini-1.5-pro"
};



// Rate limiting state
const LIMITS = {
  RPM: 15,    // Requests Per Minute
  RPD: 1500   // Requests Per Day
};

const getTrackingData = () => {
  try {
    const data = localStorage.getItem('gemini_api_tracking');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading rate limit tracking data', e);
  }
  return { lastMinuteRequests: [], dayRequests: 0, lastDayReset: Date.now() };
};

const saveTrackingData = (data: any) => {
  localStorage.setItem('gemini_api_tracking', JSON.stringify(data));
};

const checkRateLimit = () => {
  const data = getTrackingData();
  const now = Date.now();
  
  // Day reset
  if (now - data.lastDayReset > 24 * 60 * 60 * 1000) {
    data.dayRequests = 0;
    data.lastDayReset = now;
  }
  
  // Minute filter
  const oneMinuteAgo = now - 60000;
  data.lastMinuteRequests = data.lastMinuteRequests.filter((t: number) => t > oneMinuteAgo);
  
  if (data.dayRequests >= LIMITS.RPD) {
    throw new Error('Valid.AI Global Limit: Has excedido el límite diario (1,500 RPD).');
  }
  
  if (data.lastMinuteRequests.length >= LIMITS.RPM) {
    throw new Error('Valid.AI Rate Limit: Estás haciendo demasiadas peticiones por minuto. Espera un momento.');
  }
  
  // Record request
  data.dayRequests++;
  data.lastMinuteRequests.push(now);
  saveTrackingData(data);
};

// Helper function for API calls with SDK and automatic retry
export async function callGeminiAPI(prompt: string, json: boolean = false, useWeb: boolean = false): Promise<string> {
  // 1. Check cache first
  if (!useWeb) {
    const cached = cacheService.get<string>(prompt);
    if (cached) {
      console.log('⚡ Using cached AI response');
      return cached;
    }
  }

  // 2. Check rate limit
  try {
    checkRateLimit();
  } catch (error: any) {
    console.error('🚫 Rate Limit Triggered:', error.message);
    throw error;
  }

  try {
    const modelName = useWeb ? MODELS.pro : MODELS.default;
    console.log(`🤖 AI Call [SDK]: ${modelName} ${useWeb ? '(Web Search Enabled)' : ''}`);

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: "IMPORTANT: Always respond in professional, senior-grade English. Use concise, analytical, and strategic language. Act as an institutional-grade venture capital auditor.",
    }, { apiVersion: 'v1beta' });

    const generationConfig: any = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
    
    if (json) {
      generationConfig.responseMimeType = "application/json";
    }

    const contents: any[] = [{ role: "user", parts: [{ text: prompt }] }];
    const tools: any[] | undefined = useWeb ? [{ googleSearch: {} }] : undefined;

    const result = await model.generateContent({
      contents,
      generationConfig,
      tools
    });

    const response = result.response;
    const text = response.text();

    if (!text) throw new Error('Empty response from Gemini SDK');

    if (!useWeb) cacheService.set(prompt, text);
    return text;

  } catch (error: any) {
    console.error(`❌ Gemini SDK Error:`, error);
    if (error.message?.includes('429')) {
      console.warn('⚠️ Rate limited.');
    }
    throw error;
  }
}


// Aggressive JSON repair function
function repairJSON(jsonString: string): string {
  let repaired = jsonString
    // Remove markdown
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    // Remove comments
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
  
  // Extract JSON object if embedded in text
  const match = repaired.match(/\{[\s\S]*\}/);
  if (match) {
    repaired = match[0];
  }
  
  // Try to fix common quote issues
  try {
    // Test parse first
    JSON.parse(repaired);
    return repaired;
  } catch (e) {
    // If it fails, try replacing smart quotes
    repaired = repaired
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'");
    
    // Try again
    try {
      JSON.parse(repaired);
      return repaired;
    } catch (e2) {
      // Last resort: log and return original
      console.warn('JSON repair failed, returning as-is');
      return repaired;
    }
  }
}

export const chatWithProjectContext = async (message: string, history: any[], project: any, interviews: any[]) => {
  const context = `
    ACT AS: Senior Venture Capital Analyst & Product Strategist.
    
    PROJECT CONTEXT:
    Name: ${project.name}
    Description: ${project.description}
    Target Audience: ${project.targetAudience}
    Region: ${project.region || 'Global'}
    
    DATA AVAILABLE:
    - Interviews Conducted: ${interviews.length}
    - Average Score: ${interviews.length > 0 ? (interviews.reduce((acc:any, i:any) => acc + i.totalScore, 0) / interviews.length).toFixed(1) : 'N/A'}
    
    INTERVIEW SUMMARIES:
    ${interviews.map((i:any) => `- ${i.respondentName} (${i.respondentRole}): Score ${i.totalScore}. Notes: ${i.summary || 'No summary'}`).join('\n')}
    
    USER QUERY: "${message}"
    
    INSTRUCTIONS:
    - Answer based STRICTLY on the provided data.
    - Be concise, professional, and strategic.
    - Format response in Markdown.
  `;

  let fullPrompt = context + "\n\nCONVERSATION HISTORY:\n";
  history.forEach(h => {
    fullPrompt += `${h.role === 'user' ? 'User' : 'AI'}: ${h.content}\n`;
  });
  fullPrompt += `\nUser: ${message}\nAI:`;

  return await callGeminiAPI(fullPrompt);
};

import { getCoverByIdea } from '../utils/projectCovers';

export const generateProjectCover = async (title: string, description: string): Promise<string> => {
  // Use local cache for instant, reliable covers
  return getCoverByIdea(title);
};

export const smartParseDocument = async (context: string, lang: 'es'|'en'): Promise<{questions: Question[], suggestedEmoji: string, suggestedName: string, suggestedDesc: string}> => {
  const prompt = `
    Role: Senior User Researcher.
    Task: Analyze the provided document/text and extract a validation interview script.
    Context: "${context}"
    Language: ${lang === 'es' ? 'Spanish (Latin American)' : 'English'}
    
    Rules:
    1. Identify the core business idea for the name/desc.
    2. Pick a relevant emoji.
    3. Generate 7-12 measurable questions.
    4. INTELLIGENTLY assign 'widgetType':
       - If asking for money/budget -> 'currency_bucket'
       - If asking for 1-5 rating -> 'gauge_1_5'
       - If Yes/No -> 'boolean_donut'
       - If Open Text -> 'keyword_cloud'
       - Otherwise -> 'default'
    5. 'imageKeyword' must be a prompt for a realistic photo.
    6. TONE: Senior Venture Capital.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "suggestedName": "string",
      "suggestedDesc": "string",
      "suggestedEmoji": "string",
      "questions": [
        {
          "id": "string",
          "order": number,
          "text": "string",
          "type": "select|boolean|number|text|scale",
          "widgetType": "gauge_1_5|currency_bucket|boolean_donut|keyword_cloud|default",
          "options": ["string"] (optional),
          "dimension": "problemIntensity|solutionFit|currentBehavior|painPoint|earlyAdopter|willingnessToPay",
          "weight": number,
          "required": boolean,
          "imageKeyword": "string"
        }
      ]
    }
    
    Return ONLY valid JSON, no markdown.
  `;

  const response = await callGeminiAPI(prompt, true);
  return JSON.parse(response);
};

export const performDeepResearch = async (project: ProjectTemplate, interviews: Interview[], lang: 'es'|'en'): Promise<DeepAnalysisReport> => {
  // Enrich interview data with full context
  const richInterviews = interviews.map(i => ({
      profile: { role: i.respondentRole, region: i.respondentCity },
      score: i.totalScore,
      summary: i.summary,
      // Include key answers if available to make it "Deep"
      insights: i.keyInsights || [],
      // We limit the raw answers to avoid token limits, but include the most critical ones if possible
      // or rely on the summary which should be good if analyzeFullInterview did its job.
      // For "Deep Search", let's include the dimension scores to detect patterns.
      dimensions: i.dimensionScores
  }));

  try {
    console.log(`🚀 Starting ENHANCED Deep Research for ${project.name} with ${interviews.length} interviews...`);
    
    // SURGICAL MULTI-PASS ANALYSIS PROMPT
    const prompt = `
    ACT AS: Senior Partner at Y Combinator + PhD Data Scientist
    
    PROJECT PROFILE:
    - Name: ${project.name}
    - Concept: ${project.description}
    - Target Audience: ${project.targetAudience}
    - Region: ${project.region || 'Global'}
    
    INTERVIEW DATA (${interviews.length} validated interviews):
    ${JSON.stringify(richInterviews, null, 2)}
    
    LANGUAGE: English (Institutional Grade)
    
    📊 ANALYSIS FRAMEWORK - MULTI-PASS APPROACH:
    
    PASS 1: PATTERN RECOGNITION
    - Cross-reference all ${interviews.length} interviews
    - Identify consistent pain points mentioned by 50%+ respondents
    - Detect contradictions between stated needs and actual behavior
    - Flag social desirability bias or acquiescence patterns
    
    PASS 2: STATISTICAL VALIDATION
    - Calculate average scores with confidence intervals
    - Perform outlier detection (scores >2 std deviations)
    - Segment respondents by viability score (High: 70+, Med: 40-69, Low: <40)
    - Test for correlation: "willingness to pay" vs "problem intensity"
    
    PASS 3: STRATEGIC SYNTHESIS
    - Define "ideal customer profile" based on top 20% performers
    - Identify market gaps vs existing solutions (be specific: name competitors)
    - Recommend 1-3 pivots if data suggests misalignment
    - Provide go/pivot/no-go verdict with evidence
    
    CRITICAL SCORING RULES:
    - viabilityScore: ONLY 70+ if clear product-market fit evidence
    - 50-69: Potential with pivots needed
    - <50: Fundamental issues detected
    
    MARKET VERDICT OPTIONS:
    - "Go": Strong validation, clear monetization, minimal risks (viability >70)
    - "Pivot": Some validation but misalignment detected (40-70)
    - "No-Go": Weak validation, contradictions, or saturated market (<40)
    
    SWOT REQUIREMENTS (be brutally honest):
    - Strengths: ONLY if backed by interview evidence
    - Weaknesses: Flag ALL red flags (low WTP, vague needs, etc.)
    - Opportunities: Based on unmet needs or underserved segments
    - Threats: Name REAL competitors with market share
    
    BENCHMARK (3-5 real competitors):
    - Use actual companies (e.g., "Slack", "Notion", "Figma")
    - Include their pricing model and market position
    - Explain what differentiates THIS product
    
    KEY INSIGHTS (3-5 actionable insights):
    - Each must have "positive", "negative", or "neutral" type
    - Be specific: cite interview patterns or metrics
    - Focus on: monetization readiness, market timing, adoption barriers
    
    MARKET TRENDS (5 years: 2023-2027):
    - Estimate market size growth based on industry (be realistic)
    - For nascent markets: conservative growth
    - For mature markets: modest 5-10% CAGR
    
    SENTIMENT ANALYSIS:
    - Positive: % of high-viability interviews (score >70)
    - Neutral: % of medium interviews (40-70)
    - Negative: % of low interviews (<40)
    
    AUDIENCE DEMOGRAPHICS (3 segments):
    - Segment by actual respondent profiles
    - Example: "Early Adopter Founders (35%)", "Corporate Innovators (45%)", etc.
    
   RISK ASSESSMENT (0-100 scale, where 100 = highest risk):
    - Market: Saturation, competition intensity
    - Tech: Complexity, feasibility
    - Legal: Regulatory barriers
    - Financial: Capital requirements
    - Adoption: User behavior change needed
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "viabilityScore": number (0-100),
      "marketVerdict": "Go|Pivot|No-Go",
      "swot": {
        "strengths": ["string with evidence"],
        "weaknesses": ["string citing interview data"],
        "opportunities": ["string"],
        "threats": ["string naming real competitors"]
      },
      "earlyAdopterProfile": "string (detailed ICP description)",
      "strategicAdvice": ["actionable recommendation 1", "..."],
      "benchmark": [
        {
          "name": "Real Competitor Name",
          "strength": "Their key advantage",
          "weakness": "Their gap/limitation",
          "priceModel": "e.g., $99/mo SaaS",
          "differentiation": "How THIS product differs"
        }
      ],
      "keyInsights": [
        {
          "title": "Insight Title",
          "description": "Evidence-based description",
          "type": "positive|negative|neutral"
        }
      ],
      "marketTrends": [
        {"year": "2023", "value": number},
        {"year": "2024", "value": number},
        {"year": "2025", "value": number},
        {"year": "2026", "value": number},
        {"year": "2027", "value": number}
      ],
      "sentimentAnalysis": [
        {"name": "Positive", "value": number, "fill": "#3AFF97"},
        {"name": "Neutral", "value": number, "fill": "#94a3b8"},
        {"name": "Negative", "value": number, "fill": "#f87171"}
      ],
      "audienceDemographics": [
        {"name": "Segment Name", "value": percentage}
      ],
      "riskAssessment": [
        {"subject": "Market", "A": risk score 0-100},
        {"subject": "Tech", "A": risk score},
        {"subject": "Legal", "A": risk score},
        {"subject": "Financial", "A": risk score},
        {"subject": "Adoption", "A": risk score}
      ]
    }
    
    CRITICAL: Be skeptical. If data is weak, say so. Return ONLY valid JSON.
  `;

  const response = await callGeminiAPI(prompt, true);
  console.log('🔍 Raw Deep Research Response:', response.substring(0, 500) + '...');
  
  const cleanText = repairJSON(response);
  const data = JSON.parse(cleanText);
  
  console.log('✅ Deep Research Parsed Successfully:', data);

  // Validate and normalize data types for charts
  const normalizedData = {
    ...data,
    viabilityScore: Number(data.viabilityScore) || 0,
    marketTrends: Array.isArray(data.marketTrends) ? data.marketTrends.map((t: any) => ({
      year: String(t.year),
      value: Number(t.value) || 0
    })) : [],
    sentimentAnalysis: Array.isArray(data.sentimentAnalysis) ? data.sentimentAnalysis.map((s: any) => ({
      name: String(s.name),
      value: Number(s.value) || 0,
      fill: s.fill || '#94a3b8'
    })) : [],
    audienceDemographics: Array.isArray(data.audienceDemographics) ? data.audienceDemographics.map((d: any) => ({
      name: String(d.name),
      value: Number(d.value) || 0
    })) : [],
    riskAssessment: Array.isArray(data.riskAssessment) ? data.riskAssessment.map((r: any) => ({
      subject: String(r.subject),
      A: Number(r.A) || 0
    })) : [],
    lastUpdated: new Date().toISOString()
  };

  return normalizedData;
  } catch (error) {
    console.error("❌ Deep Research Failed:", error);
    throw error;
  }
};

export const analyzeAnswer = async (question: Question, rawValue: string, observation?: string): Promise<AIAnalysisResult> => {
  const prompt = `
    Analyze this answer:
    Question: "${question.text}"
    Answer: "${rawValue}"
    Observation: "${observation || 'None'}"
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "structuredValue": "string",
      "score": number (0-10),
      "reasoning": "string",
      "confidence": number (0-1)
    }
    
    Return ONLY valid JSON.
  `;

  const response = await callGeminiAPI(prompt, true);
  return JSON.parse(response);
};

export const analyzeFullInterview = async (project: ProjectTemplate, answers: any, regData: any): Promise<{totalScore: number, summary: string, dimensionScores: any, keyInsights: string[]}> => {
    try {
    // Enrich answers with question text
    const enrichedAnswers = Object.values(answers).map((ans: any) => {
       const q = project.questions.find((q: any) => q.id === ans.questionId);
       return {
          question: q ? q.text : "Unknown Question",
          answer: ans.rawValue,
          observation: ans.observation,
          dimension: q ? q.dimension : "unknown"
       };
    });

    const prompt = `
    ROLE: You are a Senior Venture Capital Analyst and Behavioral Psychologist expert in product validation. Your job is to analyze customer discovery interviews to determine the real viability of a business idea.
    
    PROJECT CONTEXT:
    Name: "${project.name}"
    Description: "${project.description}"
    
    RESPONDENT DATA:
    ${JSON.stringify(regData, null, 2)}
    
    INTERVIEW TRANSCRIPT (Question -> Answer):
    ${JSON.stringify(enrichedAnswers, null, 2)}
    
    TASK:
    Perform a critical and deep analysis of the responses. Do not be complacent. Look for real evidence of pain points, budget, and past behavior, not just future intentions.
    
    SCORING SYSTEM (0-10):
    - Problem Intensity (40%): How sharp is the problem for this user? (0=Irrelevant, 10=Critical/Urgent)
    - Solution Fit (30%): How much does the proposed solution resonate with their actual need? (0=None, 10=Perfect)
    - Willingness to Pay (30%): Is there evidence of capacity and willingness to pay? (0=Free/Cheap, 10=High value/Already pays for alternatives)
    
    OUTPUT FORMAT (PURE JSON):
    {
      "totalScore": number, // Weighted average (0.0 - 10.0) with 1 decimal.
      "summary": "string", // Detailed executive summary (100-150 words) in 3rd person. Deeply analyze user psychology, hidden motivations, adoption barriers, and behavioral profile. Do not be generic.
      "dimensionScores": {
        "problemIntensity": number,
        "solutionFit": number,
        "willingnessToPay": number,
        "currentBehavior": number, // 0-10: Are they already taking action to solve it?
        "painPoint": number, // 0-10: Explicit pain level
        "earlyAdopter": number // 0-10: Probability of being an Early Adopter
      },
      "keyInsights": [
        "Insight 1: Deep observation about behavior or barrier.",
        "Insight 2: Specific detected opportunity or latent risk.",
        "Insight 3: Verdict on their profile (e.g., 'Ideal customer', 'Confused user', 'False positive')."
      ]
    }
    
    CRITICAL RULES:
    1. LANGUAGE: 100% Professional Institutional English.
    2. FORMAT: Valid minified JSON. No markdown, no code blocks.
    3. ATTITUDE: Be skeptical. Value facts over opinions.
    4. PRECISION: 'totalScore' must be mathematically consistent with dimension scores.
    `;

       const response = await callGeminiAPI(prompt, true);
       
       // Repair and clean the JSON
       const cleanText = repairJSON(response);
       
       console.log('🔍 Raw AI response:', response.substring(0, 200));
       console.log('✅ Cleaned JSON:', cleanText.substring(0, 200));
       
       // Attempt to parse
       const parsed = JSON.parse(cleanText);
       
       // Validate and normalize
       return {
         totalScore: Number(parsed.totalScore) || 5,
         summary: String(parsed.summary || 'Analysis completed'),
         dimensionScores: {
           problemIntensity: Number(parsed.dimensionScores?.problemIntensity || 5),
           solutionFit: Number(parsed.dimensionScores?.solutionFit || 5),
           willingnessToPay: Number(parsed.dimensionScores?.willingnessToPay || 5)
         },
         keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : ['Analysis completed']
       };
    } catch (error) {
       console.error("❌ AI Analysis Error:", error);
       return {
          totalScore: 0,
          summary: "Analysis failed: " + (error instanceof Error ? error.message : String(error)),
          dimensionScores: { problemIntensity: 0, solutionFit: 0, willingnessToPay: 0 },
          keyInsights: ["AI Analysis Unavailable"]
       };
    }
};

export const generatePersonaImage = async (summary: string) => {
  // Using external service for reliability
  return null;
};

// ===== SIMPLE CHAT FOR REPORT GENERATION =====
export const chat = async (prompt: string): Promise<string> => {
  return await callGeminiAPI(prompt);
};

// ===== NEW: ENHANCED AI SERVICES =====

export interface EnhancedAnalysisResult {
  scores: {
    totalScore: number;
    dimensionScores: {
       problemIntensity: number;
       solutionFit: number;
       currentBehavior: number;
       painPoint: number;
       earlyAdopter: number;
       willingnessToPay: number;
    }
  };
  summary: string;
  keyInsights: string[];
  oneLinerVerdict?: string;
  signals?: { buying: string[] };
}

export const analyzeFullInterviewEnhanced = async (project: ProjectTemplate, answers: any, regData: any): Promise<EnhancedAnalysisResult> => {
     try {
     const enrichedAnswers = Object.values(answers).map((ans: any) => {
        const q = project.questions.find((q: any) => q.id === ans.questionId);
        return {
           question: q ? q.text : "Unknown Question",
           answer: ans.rawValue,
           observation: ans.observation,
           dimension: q ? q.dimension : "unknown"
        };
     });
 
     const prompt = `
     ROLE: You are an ELITE CONSULTANT (ex-McKinsey, ex-Y Combinator) and Behavioral Psychologist.
     Your job is NOT to validate the idea, but to DESTROY it to see if it survives.
     Be BRUTALLY HONEST. False positives kill startups.
     
     PROJECT CONTEXT:
     Name: "${project.name}"
     Description: "${project.description}"
     
     RESPONDENT DATA:
     ${JSON.stringify(regData, null, 2)}
     
     INTERVIEW TRANSCRIPT (Question -> Answer):
     ${JSON.stringify(enrichedAnswers, null, 2)}
     
     TASK:
     Perform a forensic audit of these responses.
     Detect "Mom Test failures" (when the user lies out of politeness).
     Look for REAL COMMITMENT (Money, Time, Reputation).
     
     SCORING SYSTEM (0-10) - BE STRICT:
     - Problem Intensity (40%): Is the user bleeding from this problem or is it just a minor annoyance?
     - Solution Fit (30%): Did they scream "YES, THIS IS IT"? Or just say "looks interesting"?
     - Willingness to Pay (30%): Did they mention specific prices? Do they already pay for something similar? (0 if they only said "would pay" without a concrete amount).
     
     OUTPUT FORMAT (PURE JSON):
     {
       "scores": {
         "totalScore": number, // Weighted average (0.0 - 10.0)
         "dimensionScores": {
           "problemIntensity": number,
           "solutionFit": number,
           "willingnessToPay": number,
           "currentBehavior": number,
           "painPoint": number,
           "earlyAdopter": number
         }
       },
       "summary": "string", // CRITICAL executive summary (100-150 words). Talk facts, not wishes.
       "keyInsights": [
          "INSIGHT 1: (Observed fact)",
          "INSIGHT 2: (Behavioral pattern)",
          "INSIGHT 3: (Brutal verdict)"
       ],
       "oneLinerVerdict": "string", // e.g., "False Positive - Just being nice" or "Real Potential Customer - Acute pain confirmed"
       "signals": { 
          "buying": ["string"] // Exact phrases demonstrating purchase intent or detected lies
       }
     }
     
     RULES:
     1. LANGUAGE: 100% Professional Institutional English.
     2. FORMAT: Valid minified JSON.
     3. ATTITUDE: Be the "Bad Cop". If the user is lukewarm, score LOW.
     `;
 
     const response = await callGeminiAPI(prompt, true);
     const cleanText = repairJSON(response);
     const parsed = JSON.parse(cleanText);
     
     return {
         scores: {
             totalScore: Number(parsed.scores?.totalScore || 0),
             dimensionScores: {
                 problemIntensity: Number(parsed.scores?.dimensionScores?.problemIntensity || 0),
                 solutionFit: Number(parsed.scores?.dimensionScores?.solutionFit || 0),
                 willingnessToPay: Number(parsed.scores?.dimensionScores?.willingnessToPay || 0),
                 currentBehavior: Number(parsed.scores?.dimensionScores?.currentBehavior || 0),
                 painPoint: Number(parsed.scores?.dimensionScores?.painPoint || 0),
                 earlyAdopter: Number(parsed.scores?.dimensionScores?.earlyAdopter || 0)
             }
         },
         summary: String(parsed.summary || ''),
         keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
         oneLinerVerdict: parsed.oneLinerVerdict,
         signals: parsed.signals
     };
   } catch (error) {
     console.error("❌ Enhanced AI Analysis Error:", error);
     return {
        scores: {
          totalScore: 0,
          dimensionScores: {
              problemIntensity: 0, solutionFit: 0, willingnessToPay: 0, currentBehavior: 0, painPoint: 0, earlyAdopter: 0
          }
        },
        summary: "Analysis failed due to error.",
        keyInsights: ["AI Analysis Unavailable"]
     };
   }
 };


export const analyzeContinuousInterview = async (project: ProjectTemplate, transcript: string, n     ROLE: You are a Senior Venture Capital Analyst and Behavioral Psychologist expert in product validation. Your job is to analyze customer discovery interviews to determine the real viability of a business idea.
     
     PROJECT CONTEXT:
     Name: "${project.name}"
     Description: "${project.description}"
     
     RESPONDENT DATA:
     ${JSON.stringify(regData, null, 2)}
     
     INTERVIEW TRANSCRIPT + NOTES:
     ${transcript}
     ${notes}
     
     TASK:
     Perform a critical and deep analysis based on the complete conversation.
     Identify behavioral patterns, problem validation, and actual willingness to pay.
     
     SCORING SYSTEM (0-10):
     - Problem Intensity (40%): How sharp is the problem for this user?
     - Solution Fit (30%): How much does the solution resonate?
     - Willingness to Pay (30%): Is there evidence of payment capacity?
     
     OUTPUT FORMAT (PURE JSON):
     {
       "scores": {
         "totalScore": number, // Weighted average (0.0 - 10.0) 
         "dimensionScores": {
           "problemIntensity": number,
           "solutionFit": number,
           "willingnessToPay": number,
           "currentBehavior": number, // 0-10: Already taking action?
           "painPoint": number, // 0-10: Explicit pain level
           "earlyAdopter": number // 0-10: Early Adopter Propensity
         }
       },
       "summary": "string", // Detailed executive summary (100-150 words)
       "keyInsights": ["string"], // 3-5 Key Insights
       "oneLinerVerdict": "string", // Case verdict in a short sentence
       "signals": { 
          "buying": ["string"] // Purchase signals detected
       }
     }
     
     RULES:
     1. LANGUAGE: 100% Professional Institutional English.
     2. FORMAT: Valid minified JSON.
     3. ANALYSIS: Integrate both what was said (transcript) and what the interviewer observed (notes).
do minificado.
     3. ANALISIS: Integra tanto lo que dijo (transcripción) como lo que observó el entrevistador (notas).
     `;
 
     const response = await callGeminiAPI(prompt, true);
     const cleanText = repairJSON(response);
     const parsed = JSON.parse(cleanText);
     
     return {
         scores: {
             totalScore: Number(parsed.scores?.totalScore || 0),
             dimensionScores: {
                 problemIntensity: Number(parsed.scores?.dimensionScores?.problemIntensity || 0),
                 solutionFit: Number(parsed.scores?.dimensionScores?.solutionFit || 0),
                 willingnessToPay: Number(parsed.scores?.dimensionScores?.willingnessToPay || 0),
                 currentBehavior: Number(parsed.scores?.dimensionScores?.currentBehavior || 0),
                 painPoint: Number(parsed.scores?.dimensionScores?.painPoint || 0),
                 earlyAdopter: Number(parsed.scores?.dimensionScores?.earlyAdopter || 0)
             }
         },
         summary: String(parsed.summary || ''),
         keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
         oneLinerVerdict: parsed.oneLinerVerdict,
         signals: parsed.signals
     };
   } catch (error) {
     console.error("❌ Continuous AI Analysis Error:", error);
     return {
        scores: {
          totalScore: 0,
          dimensionScores: {
              problemIntensity: 0, solutionFit: 0, willingnessToPay: 0, currentBehavior: 0, painPoint: 0, earlyAdopter: 0
          }
        },
        summary: "Analysis failed due to error.",
        keyInsights: ["AI Analysis Unavailable"]
     };
   }
 };
