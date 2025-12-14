export type QuestionType = 'select' | 'boolean' | 'number' | 'text' | 'scale';

// New: Smart Widget Types for the "Sistema Interno de Selección de Herramientas"
export type QuestionWidgetType = 
  | 'gauge_1_5'        // For 1-5 scales
  | 'gauge_1_10'       // For 1-10 scales
  | 'currency_bucket'  // For financial ranges
  | 'boolean_donut'    // For Yes/No stats
  | 'keyword_cloud'    // For open text
  | 'default';

export type Dimension = 'problemIntensity' | 'solutionFit' | 'currentBehavior' | 'painPoint' | 'earlyAdopter' | 'willingnessToPay';

export type Language = 'es' | 'en';

export type ProductType = 'App' | 'Web' | 'SaaS' | 'E-commerce' | 'Marketplace' | 'IoT' | 'Other';

export interface Question {
  id: string;
  text: string;
  type: QuestionType | 'multiple_choice'; // Allow multiple_choice alias
  options?: string[]; 
  category?: 'problem' | 'solution' | 'market' | 'financial';
  imageKeyword?: string; 
  dimension?: Dimension;
  visualizationType?: 'pie' | 'bar' | 'line' | 'wordcloud' | 'stat' | 'list';
  
  // Legacy / Optional
  order?: number;
  widgetType?: QuestionWidgetType; 
  weight?: number;
  required?: boolean;
}

export interface BenchmarkCompetitor {
  name: string;
  strength: string;
  weakness: string;
  priceModel: string;
  differentiation: string;
}

export interface DeepAnalysisReport {
  viabilityScore: number; // 0-100
  marketVerdict: string; // "Go", "Pivot", "No Go"
  earlyAdopterProfile: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  benchmark: BenchmarkCompetitor[]; // New: Competitor Analysis
  keyInsights: { title: string; description: string; type: 'positive' | 'negative' | 'neutral' }[]; // New: Modular Insights
  marketTrends: { year: string; value: number; category: string }[]; // New: Trend Graph
  sentimentAnalysis: { name: string; value: number; fill: string }[]; // New: Sentiment Pie
  audienceDemographics: { name: string; value: number }[]; // New: Demographics Bar
  riskAssessment: { subject: string; A: number; fullMark: number }[]; // New: Risk Radar
  strategicAdvice: string[];
  lastUpdated: string;
  progressLog?: string[]; // "Reading...", "Analyzing..."
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  detailedDescription?: string; // New
  emoji: string;       // User selected or AI generated
  coverImage: string; // "iPhone 16 Pro" style AI generated
  targetAudience: string; // Continents, demographics
  region?: string; // New
  productTypes?: ProductType[]; // New
  questions: Question[];
  deepAnalysis?: DeepAnalysisReport; 
  createdAt: string;
}

export interface AIAnalysisResult {
  structuredValue: string | number | boolean;
  score: number;
  reasoning: string;
  confidence: number;
}

// NEW: Enhanced Interview Analysis Result (Surgical-Level)
// NEW: Enhanced Interview Analysis Result (Surgical-Level Phase 19)
export interface EnhancedAnalysisResult {
  matchScore: number; // 0-100
  verdict: "GO" | "NO-GO" | "PIVOT";
  
  // Granular Scoring (0-100)
  scores: {
    problemIntensity: number; // "Hair on fire?"
    solutionFit: number;      // "Does it kill the pain?"
    marketTiming: number;     // "Why now?"
    founderFit: number;       // Reality check
  };

  // Behavioral Signals
  signals: {
    buying: string[];     // "Mentioned budget is approved"
    redFlags: string[];   // "Polite lies", "Vague answers"
    contradictions: Contradiction[];
  };

  // Strategic Output
  oneLinerVerdict: string;
  recommendedPivot?: string;
  visualAnalogy?: string; // "Your startup is like Uber but for..."
}

export interface Contradiction {
  quote1: string;
  quote2: string;
  analysis: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Answer {
  questionId: string;
  rawValue: string;
  observation?: string; 
  aiAnalysis?: AIAnalysisResult;
}

export interface EnhancedAnswer extends Answer {
  transcription?: { text: string };
  typedAnswer?: string;
  interviewerNotes?: string;
}

export interface Interview {
  id: string;
  projectId: string; // Links interview to the specific project/session
  respondentName: string;
  respondentEmail?: string;
  respondentPhone?: string;
  respondentInstagram?: string;
  respondentTikTok?: string;
  respondentRole?: string; // Cargo/Trabajo
  respondentCity?: string;
  respondentCountry?: string;
  respondentNotes?: string;
  date: string;
  answers: Record<string, Answer>; 
  totalScore: number;
  dimensionScores: Record<Dimension, number>;
  personaImageUrl?: string; 
  summary?: string;
  keyInsights?: string[];
  enhancedAnalysis?: EnhancedAnalysisResult; // New Phase 19 data
  lastUpdated?: string;
}

// ============ CREDIT SYSTEM ============

export interface UserCredits {
  userId: string;
  available: number;      // Current balance
  lifetime: number;       // Total ever received
  used: number;           // Total ever spent
  createdAt: string;
  lastUpdated: string;
}

export const INITIAL_CREDITS = 200;

// ============ BUSINESS REPORT SYSTEM ============

export type ReportTemplate = 'startup' | 'pitch_deck' | 'investor' | 'internal';
export type ReportDepth = 'basic' | 'detailed' | 'comprehensive';

export interface ReportSection {
  id: string;
  title: string;
  titleEs: string;
  icon: string;
  enabled: boolean;
  creditCost: number;
  description: string;
}

export const REPORT_SECTIONS: ReportSection[] = [
  { id: 'executive_summary', title: 'Executive Summary', titleEs: 'Resumen Ejecutivo', icon: '📋', enabled: true, creditCost: 1, description: 'Overview of the opportunity' },
  { id: 'problem_solution', title: 'Problem & Solution', titleEs: 'Problema y Solución', icon: '🎯', enabled: true, creditCost: 1, description: 'Pain points and proposed fix' },
  { id: 'market_analysis', title: 'Market Analysis', titleEs: 'Análisis de Mercado', icon: '📊', enabled: true, creditCost: 2, description: 'TAM/SAM/SOM calculations' },
  { id: 'competition', title: 'Competitive Landscape', titleEs: 'Competencia', icon: '⚔️', enabled: true, creditCost: 2, description: 'Benchmark and positioning' },
  { id: 'validation_results', title: 'Validation Results', titleEs: 'Resultados de Validación', icon: '✅', enabled: true, creditCost: 2, description: 'Scores and scientific analysis' },
  { id: 'customer_insights', title: 'Customer Insights', titleEs: 'Insights de Clientes', icon: '💡', enabled: true, creditCost: 2, description: 'Quotes and patterns from interviews' },
  { id: 'business_model', title: 'Business Model', titleEs: 'Modelo de Negocio', icon: '💰', enabled: false, creditCost: 2, description: 'Pricing and unit economics' },
  { id: 'go_to_market', title: 'Go-to-Market Strategy', titleEs: 'Estrategia Go-to-Market', icon: '🚀', enabled: false, creditCost: 2, description: 'Launch plan and channels' },
  { id: 'financial_projections', title: 'Financial Projections', titleEs: 'Proyecciones Financieras', icon: '📈', enabled: false, creditCost: 3, description: '12-month P&L estimate' },
  { id: 'risk_assessment', title: 'Risk Assessment', titleEs: 'Análisis de Riesgos', icon: '⚠️', enabled: false, creditCost: 2, description: 'Top risks and mitigations' },
  { id: 'roadmap', title: '12-Month Roadmap', titleEs: 'Roadmap 12 Meses', icon: '🗓️', enabled: false, creditCost: 2, description: 'Milestones and timeline' },
  { id: 'appendix', title: 'Appendix', titleEs: 'Apéndice', icon: '📎', enabled: false, creditCost: 1, description: 'Raw data and methodology' },
];

export interface ReportConfig {
  projectId: string;
  template: ReportTemplate;
  sections: string[]; // IDs of enabled sections
  language: 'es' | 'en';
  depth: ReportDepth;
}

export interface GeneratedReport {
  id: string;
  projectId: string;
  config: ReportConfig;
  htmlContent: string;
  creditsUsed: number;
  generatedAt: string;
  status: 'generating' | 'complete' | 'error';
  progress: number; // 0-100
  currentStage?: string;
}

// Calculate credit cost based on selected sections
export function calculateReportCost(sectionIds: string[]): number {
  return sectionIds.reduce((total, id) => {
    const section = REPORT_SECTIONS.find(s => s.id === id);
    return total + (section?.creditCost || 0);
  }, 0);
}

