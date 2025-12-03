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

export interface Answer {
  questionId: string;
  rawValue: string;
  observation?: string; 
  aiAnalysis?: AIAnalysisResult;
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
  lastUpdated?: string;
}
