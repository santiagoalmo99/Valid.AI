import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import { MessageSquare, Hash, PieChart as PieIcon, BarChart3, Activity, Cloud, Filter, Search, ChevronRight, TrendingUp, Users, Brain, Sparkles, Quote, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectTemplate, Interview, Question } from '../types';

interface QuestionAnalysisProps {
  project: ProjectTemplate;
  interviews: Interview[];
  lang?: 'es' | 'en';
}

const GLASS_PANEL = "bg-[#09090b] border border-[#1f1f23] rounded-[24px] overflow-hidden shadow-2xl relative group";
const NEON_GLOW = "hover:border-neon/30 hover:shadow-[0_0_40px_-10px_rgba(0,255,148,0.15)] transition-all duration-500";

const TRANSLATIONS = {
   es: {
      deepInsights: "Deep Insights",
      analyzing: "Analizando",
      interviews: "entrevistas",
      basedOn: "basado en",
      allResponses: "todas las respuestas",
      promoters: "Promotores",
      detractors: "Detractores",
      avgScore: "Puntaje Validación",
      marketViability: "Viabilidad Mercado",
      dataVolume: "Volumen Datos",
      wordsAnalyzed: "Palabras Procesadas",
      sentiment: "Sentimiento",
      overallTone: "Tono General",
      noData: "Sin Datos Aún",
      startInterviewing: "Comienza a entrevistar para ver insights en tiempo real.",
      lowDataWarning: "Data Limitada",
      lowDataMsg: "Se requieren al menos 5 entrevistas para relevancia estadística.",
      responses: "Respuestas",
      aiAnalyzed: "Analizado por IA",
      chart: "Gráfico",
      quotes: "Citas",
      keywords: "Palabras Clave",
      positive: "Positivo",
      neutral: "Neutral",
      critical: "Crítico"
   },
   en: {
      deepInsights: "Deep Insights",
      analyzing: "Analyzing",
      interviews: "interviews",
      basedOn: "based on",
      allResponses: "all responses",
      promoters: "Promoters",
      detractors: "Detractors",
      avgScore: "Validation Score",
      marketViability: "Market Viability",
      dataVolume: "Data Volume",
      wordsAnalyzed: "Words Analyzed",
      sentiment: "Sentiment",
      overallTone: "Overall Tone",
      noData: "No Data Available",
      startInterviewing: "Start interviewing to see real-time insights.",
      lowDataWarning: "Low Data",
      lowDataMsg: "At least 5 interviews needed for statistical relevance.",
      responses: "Responses",
      aiAnalyzed: "AI Analyzed",
      chart: "Chart",
      quotes: "Quotes",
      keywords: "Keywords",
      positive: "Positive",
      neutral: "Neutral",
      critical: "Critical"
   }
};

export const QuestionAnalysis = ({ project, interviews, lang = 'es' }: QuestionAnalysisProps) => {
  const [filterMode, setFilterMode] = useState<'all' | 'high_score' | 'low_score'>('all');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  // Filter Data
  const filteredInterviews = useMemo(() => {
    switch(filterMode) {
      case 'high_score': return interviews.filter(i => i.totalScore >= 70);
      case 'low_score': return interviews.filter(i => i.totalScore < 50);
      default: return interviews;
    }
  }, [interviews, filterMode]);

  // Global Stats
  const globalStats = useMemo(() => {
    if (!filteredInterviews.length) return null;
    const avgScore = Math.round(filteredInterviews.reduce((acc, i) => acc + i.totalScore, 0) / filteredInterviews.length);
    const totalWords = filteredInterviews.reduce((acc, i) => acc + Object.values(i.answers || {}).reduce((w: number, a: any) => w + String(a?.rawValue || '').length, 0), 0);
    const sentiment = avgScore > 75 ? t.positive : avgScore > 50 ? t.neutral : t.critical;
    return { avgScore, totalWords, sentiment };
  }, [filteredInterviews, t]);

  if (!interviews || !Array.isArray(interviews) || interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-slate-500">
        <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 animate-pulse">
           <BarChart3 size={48} className="opacity-20" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{t.noData}</h2>
        <p className="max-w-md mx-auto">{t.startInterviewing}</p>
      </div>
    );
  }

  const isLowData = interviews.length < 5;

  return (
    <div className="min-h-screen bg-[#050505] p-2 md:p-8 animate-fade-in pb-32">
       {/* Background Ambience */}
       <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />
       
       {/* Header & Controls */}
       <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-10 gap-6 relative z-10 sticky top-0 bg-[#050505]/80 backdrop-blur-xl py-4 border-b border-white/5 -mx-8 px-8 z-50">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <div className="p-2 bg-neon/10 rounded-lg text-neon">
                  <Brain size={20} />
               </div>
               <h1 className="text-3xl font-bold text-white tracking-tight">{t.deepInsights}</h1>
            </div>
            <p className="text-slate-500 text-sm hidden md:block">
              {t.analyzing} <span className="text-white font-bold">{filteredInterviews.length}</span> {t.interviews} {t.basedOn} {filterMode === 'all' ? t.allResponses : filterMode === 'high_score' ? 'high intent users' : 'skeptical users'}.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             {isLowData && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-xs font-medium animate-pulse">
                   <AlertTriangle size={14} />
                   {t.lowDataMsg}
                </div>
             )}

             <div className="flex bg-black/40 border border-white/10 rounded-full p-1 gap-1">
                <button onClick={() => setFilterMode('all')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filterMode === 'all' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                   All
                </button>
                <button onClick={() => setFilterMode('high_score')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${filterMode === 'high_score' ? 'bg-neon text-black shadow-lg shadow-neon/20' : 'text-slate-400 hover:text-white'}`}>
                   <TrendingUp size={12} /> {t.promoters}
                </button>
                <button onClick={() => setFilterMode('low_score')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${filterMode === 'low_score' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white'}`}>
                   <Activity size={12} /> {t.detractors}
                </button>
             </div>
          </div>
       </div>

       {/* Global Metrics Row */}
       {globalStats && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
            <MetricCard 
              label={t.avgScore} 
              value={`${globalStats.avgScore}%`} 
              sub={t.marketViability}
              description="Puntaje compuesto (0-100) basado en análisis de sentimiento, urgencia y frecuencia de problemas detectados."
              icon={<TrendingUp size={20} className="text-neon" />}
              chart={<div className="w-full h-1 my-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-neon" style={{width: `${globalStats.avgScore}%`}}></div></div>}
            />
            <MetricCard 
              label={t.dataVolume} 
              value={(globalStats.totalWords / 1000).toFixed(1) + 'k'} 
              sub={t.wordsAnalyzed}
              description="Cantidad total de palabras transcritas y procesadas por nuestros modelos de IA."
              icon={<MessageSquare size={20} className="text-blue-400" />}
              chart={<Sparkline color="#60a5fa" />}
            />
            <MetricCard 
              label={t.sentiment} 
              value={globalStats.sentiment} 
              sub={t.overallTone}
              description="Tono emocional predominante (Crítico, Neutral, Positivo) extraído del lenguaje natural."
              icon={<Sparkles size={20} className={globalStats.sentiment === t.positive ? 'text-green-400' : 'text-yellow-400'} />}
              chart={<Sparkline color={globalStats.sentiment === t.positive ? '#4ade80' : '#facc15'} />}
            />
         </div>
       )}

       {/* Masonry Grid (CSS Columns) */}
       <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 relative z-10">
          {(project?.questions || []).map((q, index) => (
            <div key={q.id} className="break-inside-avoid">
               <QuestionCard question={q} interviews={filteredInterviews} index={index} t={t} />
            </div>
          ))}
       </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const MetricCard = ({ label, value, sub, icon, chart, description }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -2 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`${GLASS_PANEL} p-6 flex flex-col justify-between h-36 hover:bg-white/[0.04] relative group overflow-visible border border-white/5 hover:border-white/20`}
  >
     {/* Ambient Glow */}
     <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[24px]" />
     <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 blur-2xl rounded-full group-hover:bg-neon/10 transition-colors duration-500 pointer-events-none" />

     {description && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-black/90 backdrop-blur-xl text-slate-200 text-xs p-3 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[50] shadow-2xl text-center leading-relaxed translate-y-2 group-hover:translate-y-0">
           {description}
           <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black/90"></div>
        </div>
     )}

     <div className="flex justify-between items-start relative z-10">
        <div>
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-white/70 transition-colors">{label}</p>
           <h3 className="text-4xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">{value}</h3>
        </div>
        <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:bg-neon/10 group-hover:border-neon/20 transition-all duration-300 shadow-inner">
           {React.cloneElement(icon, { size: 22, className: "text-white/70 group-hover:text-neon transition-colors" })}
        </div>
     </div>
     
     <div className="flex items-end justify-between mt-auto relative z-10">
        <p className="text-slate-600 text-[10px] font-medium group-hover:text-slate-400 transition-colors">{sub}</p>
        <div className="w-28 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">{chart}</div>
     </div>
  </motion.div>
);

const Sparkline = ({ color }: { color: string }) => (
   <div className="flex items-end gap-[2px] h-8">
      {[40, 70, 50, 90, 60, 80, 40, 60].map((h, i) => (
         <div key={i} className="w-full rounded-t-sm opacity-60" style={{ height: `${h}%`, backgroundColor: color }}></div>
      ))}
   </div>
);

// --- QUESTION CARD LOGIC ---

const QuestionCard = ({ question, interviews, index, t }: { question: Question, interviews: Interview[], index: number, t: any }) => {
  const data = useMemo(() => processData(question, interviews), [question, interviews]);
  const colors = ['#00FF94', '#00FFFF', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];
  const [activeTab, setActiveTab] = useState<'chart' | 'quotes'>('chart');
  
  if (!data) return null;

  // Force chart if low data but valid numeric data exists
  // This addresses user request: "Show charts visually even if 1 interview"
  const hasChartData = data.chartData && data.chartData.length > 0;
  
  // Decide what to show (Chart vs Quotes)
  // If it's a text question, default to quotes. If numeric, chart.
  const isNumeric = ['scale', 'select', 'multiselect', 'frequency'].includes(question.widgetType);
  
  // Initialize tab correctly
  React.useEffect(() => {
     if (!isNumeric && data.rawAnswers.length > 0) setActiveTab('quotes');
  }, [isNumeric]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${GLASS_PANEL} ${NEON_GLOW} p-0 flex flex-col`}
    >
      <div className="p-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="flex items-start justify-between gap-4 relative z-10">
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 font-mono text-xs shadow-inner">
               {index + 1}
             </div>
             <div>
               <h3 className="text-base font-bold text-white leading-tight mb-2">{question.text}</h3>
               <div className="flex flex-wrap gap-2">
                  <Badge icon={<Hash size={10}/>} text={question.widgetType} />
                  <Badge icon={<Activity size={10}/>} text={question.dimension} color="text-neon" />
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="p-6 bg-black/20 min-h-[250px] relative">
         {/* Toggle Active View */}
         <div className="absolute top-4 right-4 z-20 flex bg-black/40 border border-white/10 rounded-lg p-0.5">
            <button onClick={() => setActiveTab('chart')} className={`p-1.5 rounded-md transition-all ${activeTab === 'chart' ? 'bg-white/10 text-white' : 'text-slate-500'}`} title={t.chart}><BarChart3 size={14}/></button>
            <button onClick={() => setActiveTab('quotes')} className={`p-1.5 rounded-md transition-all ${activeTab === 'quotes' ? 'bg-white/10 text-white' : 'text-slate-500'}`} title={t.quotes}><Quote size={14}/></button>
         </div>

         {activeTab === 'chart' ? (
             <div className="h-[200px] w-full">
                {renderWidget(question, data, colors, null, () => {}, t)}
             </div>
         ) : (
             <div className="h-[200px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {(data.rawAnswers || []).length > 0 ? (
                   (data.rawAnswers).slice(0, 10).map((ans: string, i: number) => (
                      <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-slate-300 italic">
                         "{ans}"
                      </div>
                   ))
                ) : (
                   <div className="text-slate-600 text-xs italic text-center mt-10">{t.noData}</div>
                )}
             </div>
         )}
         
         {/* Footer Stats */}
         <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            <span>{data.total} {t.responses}</span>
            <span className="flex items-center gap-1 text-emerald-500"><Sparkles size={10}/> {t.aiAnalyzed}</span>
         </div>
      </div>
    </motion.div>
  );
};

const Badge = ({ icon, text, color = "text-slate-400" }: any) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider ${color}`}>
     {icon} {text}
  </span>
);

// --- RENDERERS ---

const renderWidget = (question: Question, data: any, colors: string[], selectedKeyword: string | null = null, setSelectedKeyword: (k: string | null) => void, t: any) => {
   if (!data) return null;

   // 1. Bar Chart (Scale / Select)
   if (['scale', 'select', 'multiselect', 'frequency'].includes(question.widgetType)) {
      if (data.chartData && data.chartData.length > 0) {
         return (
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 10}} tickLine={false} axisLine={false} />
                  <Tooltip 
                     cursor={{fill: 'rgba(255,255,255,0.05)'}}
                     contentStyle={{ backgroundColor: '#09090b', border: '1px solid #333', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                     {data.chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         );
      }
   }
   
   // 2. Word Cloud / Keywords (Text)
   if (data.keywords && data.keywords.length > 0) {
      return (
         <div className="flex flex-wrap gap-2 content-start h-full">
            {data.keywords.map((k: any, i: number) => (
               <div 
                  key={i} 
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-neon/10 hover:text-neon hover:border-neon/30 transition-all cursor-crosshair flex items-center gap-2"
                  style={{ fontSize: Math.max(10, Math.min(16, 10 + k.value * 2)) }}
               >
                  {k.name}
                  <span className="opacity-40 text-[9px] bg-black/50 px-1 rounded-full">{k.value}</span>
               </div>
            ))}
         </div>
      );
   }

   // Fallback for empty text (or text questions with 0 keywords but raw answers)
   // If we have raw answers but no keywords (e.g. very short answers), show a simple count or placeholder
   if (data.rawAnswers && data.rawAnswers.length > 0) {
      return (
         <div className="flex items-center justify-center h-full flex-col gap-2">
            <MessageSquare size={24} className="text-slate-600"/>
            <p className="text-slate-500 text-xs italic">{data.rawAnswers.length} {t.responses}</p>
            <p className="text-slate-700 text-[10px]">Ver pestaña "Citas" para detalles</p>
         </div>
      );
   }

   return (
      <div className="flex items-center justify-center h-full text-slate-600 text-xs italic">
         {t.noData}
      </div>
   );
};

// --- DATA PROCESSING ---

const STOP_WORDS = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'pero', 'si', 'no', 'en', 'de', 'del', 'a', 'al', 'con', 'sin', 'por', 'para', 'es', 'son', 'que', 'se', 'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'yo', 'tú', 'and', 'or', 'the', 'is', 'are', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'it', 'that', 'this']);

const extractKeywords = (texts: string[]) => {
  if (!texts || !Array.isArray(texts)) return [];
  const frequency: Record<string, number> = {};
  
  texts.forEach(text => {
    if (!text || typeof text !== 'string') return;
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").split(/\s+/);
    words.forEach(word => {
      if (word && word.length > 3 && !STOP_WORDS.has(word)) frequency[word] = (frequency[word] || 0) + 1;
    });
  });

  return Object.entries(frequency).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 15);
};

const processData = (question: Question, interviews: Interview[]) => {
   if (!interviews || !question) return null;

   const answers = interviews.map(i => i?.answers?.[question.id]);
   const validAnswers = answers.filter(a => a !== undefined && a !== null);
   const rawValues = validAnswers.map(a => a.rawValue);

   // 1. Numeric/Select Aggregation
   if (['scale', 'select', 'frequency'].includes(question.widgetType)) {
      const counts: Record<string, number> = {};
      rawValues.forEach(v => {
         const key = String(v);
         counts[key] = (counts[key] || 0) + 1;
      });
      const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
      // Ensure we pass chartData even if only 1 item
      return { type: 'chart', chartData, total: validAnswers.length, rawAnswers: rawValues };
   }

   // 2. Text Aggregation
   const textValues = rawValues.map(String);
   const keywords = extractKeywords(textValues);
   return { type: 'text', keywords, total: validAnswers.length, rawAnswers: textValues };
};
