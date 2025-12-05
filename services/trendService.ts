import { callGeminiAPI } from './aiService';

export interface TrendReport {
  id: string; // "YYYY-MM"
  title: string;
  month: string;
  year: number;
  trends: {
    category: string;
    trend: string;
    impact: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
  marketSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  emergingSectors: string[];
  generatedAt: string;
}

const STORAGE_KEY = 'valid_ai_global_trends';

export const TrendService = {
  
  /**
   * Checks if a report exists for the current month
   */
  hasReportForCurrentMonth(): boolean {
    const now = new Date();
    const currentId = `${now.getFullYear()}-${now.getMonth() + 1}`;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      
      const report: TrendReport = JSON.parse(stored);
      return report.id === currentId;
    } catch (e) {
      return false;
    }
  },

  /**
   * Returns the current cached report if any
   */
  getLatestReport(): TrendReport | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Generates a new fresh report using Google Search Grounding
   */
  async generateMonthlyReport(): Promise<TrendReport> {
    const now = new Date();
    const monthName = now.toLocaleString('es-ES', { month: 'long' });
    const year = now.getFullYear();
    const currentId = `${year}-${now.getMonth() + 1}`;

    const prompt = `
      ACTUAR COMO: Analista de Tendencias Globales de Silicon Valley.
      TAREA: Generar el "Reporte Mensual de Tendencias de Innovación" para ${monthName} ${year}.
      
      INSTRUCCIONES:
      1. Usa BUSQUEDA WEB para encontrar las tendencias más recientes (últimos 30 días) en:
         - Inteligencia Artificial
         - SaaS & B2B
         - Comportamiento del Consumidor
         - Mercados Emergentes
      
      2. No inventes. Usa datos reales y recientes.
      
      FORMATO JSON (RÍGIDO):
      {
        "title": "Reporte Global de Tendencias - ${monthName} ${year}",
        "trends": [
          {
            "category": "string (ej. AI, FinTech, GreenTech)",
            "trend": "string (Nombre corto de la tendencia)",
            "impact": "High|Medium|Low",
            "description": "string (Explicación breve de por qué importa hoy)"
          }
        ] (Mínimo 5 tendencias),
        "marketSentiment": "Bullish|Bearish|Neutral",
        "emergingSectors": ["string", "string", "string"]
      }
    `;

    console.log("🌐 Generating Global Trends Report with Web Access...");
    // ENABLE WEB ACCESS (useWeb = true)
    const rawJSON = await callGeminiAPI(prompt, true, true);
    
    // Parse
    let data;
    try {
      // Simple cleaner if needed, usually Gemini JSON mode is good
      const clean = rawJSON.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(clean);
    } catch (e) {
      console.error("Failed to parse trend report", e);
      throw new Error("Error generating report");
    }

    const report: TrendReport = {
      id: currentId,
      month: monthName,
      year: year,
      trends: data.trends || [],
      marketSentiment: data.marketSentiment || 'Neutral',
      emergingSectors: data.emergingSectors || [],
      title: data.title || `Reporte ${monthName} ${year}`,
      generatedAt: new Date().toISOString()
    };

    // Save to local storage (replacing old one)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
    
    return report;
  }
};
