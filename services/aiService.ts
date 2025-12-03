import { Question, AIAnalysisResult, ProjectTemplate, Interview, DeepAnalysisReport } from '../types';

// AUTO-DISCOVER available models from Google API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
let AVAILABLE_MODEL: string | null = null;

// Discover available models
async function discoverAvailableModel(): Promise<string> {
  if (AVAILABLE_MODEL) return AVAILABLE_MODEL;
  
  try {
    console.log('🔍 Discovering available Gemini models...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error('Failed to list models');
    }
    
    const data = await response.json();
    const models = data.models || [];
    
    // Prioritize newer models
    const preferredModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    
    let validModel;
    for (const pref of preferredModels) {
       validModel = models.find((m: any) => m.name.includes(pref));
       if (validModel) break;
    }
    
    if (!validModel) {
       validModel = models.find((m: any) => 
         m.supportedGenerationMethods?.includes('generateContent') &&
         (m.name.includes('gemini') || m.name.includes('pro'))
       );
    }
    
    if (validModel) {
      // Extract model name (e.g., "models/gemini-pro" -> "gemini-pro")
      AVAILABLE_MODEL = validModel.name.replace('models/', '');
      console.log('✅ Using model:', AVAILABLE_MODEL);
      return AVAILABLE_MODEL;
    }
    
    // Fallback to common model names if discovery fails
    console.warn('⚠️ No models found via discovery, trying fallbacks...');
    const fallbacks = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    for (const model of fallbacks) {
      try {
        await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${API_KEY}`);
        AVAILABLE_MODEL = model;
        console.log('✅ Using fallback model:', AVAILABLE_MODEL);
        return AVAILABLE_MODEL;
      } catch (e) {
        continue;
      }
    }
    
    throw new Error('No compatible models found');
  } catch (error) {
    console.error('❌ Model discovery failed:', error);
    // Last resort
    AVAILABLE_MODEL = 'gemini-pro';
    return AVAILABLE_MODEL;
  }
}

// Helper function for API calls
async function callGeminiAPI(prompt: string, json: boolean = false): Promise<string> {
  try {
    const modelName = await discoverAvailableModel();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: "IMPORTANTE: Siempre responde en español latinoamericano (no español de España). Usa vocabulario neutro y claro de Latinoamérica."
          }]
        },
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: json ? {
          response_mime_type: "application/json"
        } : {}
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API Error:', error);
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from AI');
    }

    return text;
  } catch (error) {
    console.error('Gemini API call failed:', error);
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

export const generateProjectCover = async (title: string, description: string): Promise<string> => {
  const basePrompt = `Photorealistic cinematic shot of ${title} - ${description}, glowing neon green #3AFF97 accents, dark moody lighting, 8k resolution, highly detailed, unreal engine 5 style, cyberpunk aesthetic, depth of field`;
  const encodedPrompt = encodeURIComponent(basePrompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&width=1920&height=1080&model=flux-realism`;
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
    console.log(`🚀 Starting Deep Research for ${project.name} with ${interviews.length} interviews...`);
    const prompt = `
    ACT AS: Senior Venture Capital Analyst & Product Strategist (Y Combinator Level).
    
    PROJECT PROFILE:
    - Name: ${project.name}
    - Concept: ${project.description}
    - Target Audience: ${project.targetAudience}
    - Region: ${project.region || 'Global'}
    
    INTERVIEW DATA (${interviews.length} interviews):
    ${JSON.stringify(richInterviews, null, 2)}
    
    LANGUAGE: ${lang === 'es' ? 'Spanish (Latin American)' : 'English'}
    
    TASK: Perform a deep validation analysis crossing all data points.
    Generate quantitative and qualitative metrics for visualization.
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "viabilityScore": number (0-100),
      "marketVerdict": "Go|Pivot|No-Go",
      "swot": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities": ["string"],
        "threats": ["string"]
      },
      "earlyAdopterProfile": "string",
      "strategicAdvice": ["string"],
      "benchmark": [
        {
          "name": "string",
          "strength": "string",
          "weakness": "string",
          "priceModel": "string",
          "differentiation": "string"
        }
      ],
      "keyInsights": [
        {
          "title": "string",
          "description": "string",
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
        {"name": "Segment A", "value": number},
        {"name": "Segment B", "value": number},
        {"name": "Segment C", "value": number}
      ],
      "riskAssessment": [
        {"subject": "Market", "A": number (0-100)},
        {"subject": "Tech", "A": number},
        {"subject": "Legal", "A": number},
        {"subject": "Financial", "A": number},
        {"subject": "Adoption", "A": number}
      ]
    }
    
    Return ONLY valid JSON.
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
    ROL: Eres un Analista Senior de Venture Capital y Psicólogo Conductual experto en validación de productos. Tu trabajo es analizar entrevistas de descubrimiento de clientes para determinar la viabilidad real de una idea de negocio.
    
    CONTEXTO DEL PROYECTO:
    Nombre: "${project.name}"
    Descripción: "${project.description}"
    
    DATOS DEL ENTREVISTADO:
    ${JSON.stringify(regData, null, 2)}
    
    TRANSCRIPCIÓN DE LA ENTREVISTA (Pregunta -> Respuesta):
    ${JSON.stringify(enrichedAnswers, null, 2)}
    
    TAREA:
    Realiza un análisis crítico y profundo de las respuestas. No seas complaciente. Busca evidencias reales de dolor (pain points), presupuesto y comportamiento pasado, no solo intenciones futuras.
    
    SISTEMA DE CALIFICACIÓN (0-10):
    - Problem Intensity (40%): ¿Qué tan agudo es el problema para este usuario? (0=Irrelevante, 10=Crítico/Urgente)
    - Solution Fit (30%): ¿Qué tanto resuena la solución propuesta con su necesidad real? (0=Nada, 10=Perfecto)
    - Willingness to Pay (30%): ¿Hay evidencia de capacidad y voluntad de pago? (0=Gratis/Tacaño, 10=Alto valor/Ya paga por alternativas)
    
    FORMATO DE SALIDA (JSON PURO):
    {
      "totalScore": number, // Promedio ponderado (0.0 - 10.0) con 1 decimal.
      "summary": "string", // Resumen ejecutivo profesional en 3ra persona. Enfócate en la psicología del usuario y su potencial como cliente. Máximo 60 palabras.
      "dimensionScores": {
        "problemIntensity": number,
        "solutionFit": number,
        "willingnessToPay": number,
        "currentBehavior": number, // 0-10: ¿Ya está tomando acciones para resolverlo?
        "painPoint": number, // 0-10: Nivel de dolor explícito
        "earlyAdopter": number // 0-10: Probabilidad de ser Early Adopter
      },
      "keyInsights": [
        "Insight 1: Observación profunda sobre su comportamiento o barrera.",
        "Insight 2: Oportunidad específica detectada o riesgo latente.",
        "Insight 3: Veredicto sobre su perfil (ej. 'Cliente ideal', 'Usuario confundido', 'Falso positivo')."
      ]
    }
    
    REGLAS CRÍTICAS:
    1. IDIOMA: 100% Español Latinoamericano Profesional (Neutro, corporativo pero moderno).
    2. FORMATO: JSON válido minificado. Sin markdown, sin bloques de código.
    3. ACTITUD: Sé escéptico. Valora los hechos sobre las opiniones.
    4. PRECISIÓN: El 'totalScore' debe ser matemáticamente coherente con los puntajes de dimensión.
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
