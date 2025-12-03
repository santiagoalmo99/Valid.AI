import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { MessageSquare, Hash, PieChart as PieIcon, BarChart3, Activity, Cloud } from 'lucide-react';
import { ProjectTemplate, Interview, Question } from '../types';

interface QuestionAnalysisProps {
  project: ProjectTemplate;
  interviews: Interview[];
}

const GLASS_PANEL = "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl";

export const QuestionAnalysis = ({ project, interviews }: QuestionAnalysisProps) => {
  
  if (!interviews || interviews.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
        <p>No hay datos suficientes para visualizar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {project.questions.map((q, index) => (
        <QuestionCard key={q.id} question={q} interviews={interviews} index={index} />
      ))}
    </div>
  );
};

const QuestionCard = ({ question, interviews, index }: { question: Question, interviews: Interview[], index: number }) => {
  const data = useMemo(() => processData(question, interviews), [question, interviews]);
  const colors = ['#3AFF97', '#818cf8', '#c084fc', '#f472b6', '#fbbf24', '#34d399'];
  const [selectedKeyword, setSelectedKeyword] = React.useState<string | null>(null);

  return (
    <div className={`${GLASS_PANEL} rounded-2xl p-6 flex flex-col h-[400px] hover:border-neon/30 transition-colors group`}>
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-neon font-bold text-xs border border-white/10">
            Q{index + 1}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white line-clamp-2 min-h-[40px]">{question.text}</h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                 {question.dimension || 'General'}
               </span>
               <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                 {question.widgetType || 'Text'}
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 min-h-0 relative">
        {renderWidget(question, data, colors, selectedKeyword, setSelectedKeyword)}
      </div>
    </div>
  );
};

// --- Logic & Helpers ---

const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si', 'no', 'en', 'de', 'del', 'a', 'al', 'con', 'sin', 'por', 'para', 'es', 'son', 'fue', 'era', 'está', 'están', 'que', 'se', 'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'yo', 'tú', 'él', 'ella', 'nosotros', 'ellos', 'me', 'te', 'le', 'nos', 'les', 'lo', 'la', 'los', 'las', 'mi', 'ti', 'si', 'no', 'muy', 'más', 'menos', 'tan', 'como', 'cuando', 'donde', 'porque', 'aunque', 'mientras', 'durante', 'antes', 'después', 'sobre', 'entre', 'tras', 'hacia', 'hasta', 'desde', 'según', 'contra', 'ante', 'bajo', 'cabe', 'so', 'the', 'and', 'or', 'but', 'if', 'not', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'without', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'which', 'who', 'whom', 'whose', 'what', 'where', 'when', 'why', 'how'
]);

const extractKeywords = (texts: string[]): { name: string, value: number }[] => {
  const frequency: Record<string, number> = {};
  
  texts.forEach(text => {
    // Normalize: lowercase, remove punctuation, split by spaces
    const words = text.toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/);
      
    words.forEach(word => {
      if (word.length > 3 && !STOP_WORDS.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
  });

  return Object.entries(frequency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15); // Top 15 keywords
};

const processData = (question: Question, interviews: Interview[]) => {
  const answers = interviews.map(i => i.answers[question.id]?.rawValue).filter(Boolean);
  
  if (question.widgetType === 'boolean_donut') {
    const yes = answers.filter(a => a.toLowerCase().includes('sí') || a.toLowerCase().includes('yes') || a === 'true').length;
    const no = answers.length - yes;
    return [
      { name: 'Sí', value: yes },
      { name: 'No', value: no }
    ];
  }

  if (question.widgetType === 'currency_bucket' || question.type === 'select' || question.type === 'multiple_choice') {
    const counts: Record<string, number> = {};
    answers.forEach(a => {
      counts[a] = (counts[a] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }

  if (question.widgetType === 'gauge_1_5' || question.widgetType === 'gauge_1_10' || question.type === 'scale') {
    const counts: Record<string, number> = {};
    answers.forEach(a => {
      counts[a] = (counts[a] || 0) + 1;
    });
    // Fill missing keys for scale
    const max = question.widgetType === 'gauge_1_10' ? 10 : 5;
    for (let i = 1; i <= max; i++) {
        if (!counts[i.toString()]) counts[i.toString()] = 0;
    }
    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }

  // Text / Keyword Cloud Logic
  const keywords = extractKeywords(answers);
  // Return object with keywords AND raw answers for context
  return {
    keywords,
    rawAnswers: answers
  };
};

const renderWidget = (
  question: Question, 
  data: any, 
  colors: string[], 
  selectedKeyword?: string | null, 
  setSelectedKeyword?: (k: string | null) => void
) => {
  if (!data || (Array.isArray(data) && data.length === 0) || (data.keywords && data.keywords.length === 0 && data.rawAnswers.length === 0)) {
     return <div className="flex items-center justify-center h-full text-slate-600">Sin datos</div>;
  }

  switch (question.widgetType) {
    case 'boolean_donut':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Sí' ? '#3AFF97' : '#f87171'} />
              ))}
            </Pie>
            <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid #334155', borderRadius: '12px'}} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-bold">
              {Math.round((data.find((d: any) => d.name === 'Sí')?.value || 0) / data.reduce((a: any,b: any) => a + b.value, 0) * 100)}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      );

    case 'currency_bucket':
    case 'default': // Bar chart for selects
      if (question.type === 'select' || question.type === 'multiple_choice') {
          return <HorizontalBarChart data={data} colors={colors} />;
      }
      // Fallthrough for text logic
    
    case 'keyword_cloud':

      // Data is now { keywords: [], rawAnswers: [] }
      const { keywords, rawAnswers } = data as { keywords: {name: string, value: number}[], rawAnswers: string[] };
      
      // Filter answers based on selected keyword
      const filteredAnswers = selectedKeyword 
        ? rawAnswers.filter(a => a.toLowerCase().includes(selectedKeyword.toLowerCase()))
        : rawAnswers;

      return (
        <div className="h-full flex flex-col gap-4">
           {/* 1. Tag Cloud Section (Interactive) */}
           {keywords.length > 0 && (
             <div className="flex flex-wrap gap-2 max-h-[35%] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 pr-1 shrink-0">
                {keywords.map((k, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedKeyword?.(selectedKeyword === k.name ? null : k.name)}
                    className={`px-2 py-1 rounded-md border text-xs font-medium flex items-center gap-1 transition-all
                      ${selectedKeyword === k.name 
                        ? 'bg-neon text-black border-neon' 
                        : 'bg-neon/10 border-neon/20 text-neon hover:bg-neon/20'
                      }`}
                  >
                    {k.name} <span className={`text-[9px] px-1 rounded-sm ${selectedKeyword === k.name ? 'bg-black/20' : 'bg-black/40 opacity-60'}`}>{k.value}</span>
                  </button>
                ))}
             </div>
           )}

           {/* 2. Recent Answers Section (Filtered) */}
           <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10 min-h-0">
              <div className="flex items-center justify-between sticky top-0 bg-[#0a0a0a] py-2 z-10 border-b border-white/5 mb-2">
                 <h4 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                   {selectedKeyword ? `Respuestas con "${selectedKeyword}"` : 'Respuestas Recientes'}
                 </h4>
                 {selectedKeyword && (
                   <button onClick={() => setSelectedKeyword?.(null)} className="text-[10px] text-neon hover:underline">
                     Ver todas
                   </button>
                 )}
              </div>
              
              {filteredAnswers.length > 0 ? (
                filteredAnswers.slice(0, 20).map((ans, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-slate-300 italic">
                    "{ans}"
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-600">No hay respuestas con esta palabra clave.</div>
              )}
           </div>
        </div>
      );

    case 'gauge_1_5':
    case 'gauge_1_10':
      return <VerticalBarChart data={data} />;

    default:
      return <div className="text-slate-500">Widget no soportado</div>;
  }
};

// --- CSS Chart Components (Robust & Premium) ---

const HorizontalBarChart = ({ data, colors }: { data: any[], colors: string[] }) => {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="w-full h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 space-y-4 py-2">
      {data.map((item, i) => (
        <div key={i} className="w-full group">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-300">{item.name}</span>
            <span className="font-mono text-neon">{item.value}</span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125 relative overflow-hidden"
              style={{ 
                width: `${(item.value / max) * 100}%`,
                backgroundColor: colors[i % colors.length]
              }}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const VerticalBarChart = ({ data }: { data: any[] }) => {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="w-full h-full flex items-end justify-between gap-1 pt-8 pb-2 px-2">
      {data.map((item, i) => {
        const height = (item.value / max) * 100;
        return (
          <div key={i} className="h-full flex flex-col justify-end items-center flex-1 group relative">
             {/* Tooltip-like value on hover */}
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black/80 text-neon px-2 py-0.5 rounded border border-neon/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                {item.value} respuestas
             </div>
             
             <div 
               className="w-full max-w-[24px] bg-neon/20 group-hover:bg-neon transition-all duration-500 rounded-t-sm relative border-t border-x border-neon/30 group-hover:shadow-[0_0_15px_rgba(58,255,151,0.3)]"
               style={{ height: `${height}%`, minHeight: '4px' }}
             >
             </div>
             <div className="text-[9px] text-slate-500 mt-2 text-center w-full truncate font-mono border-t border-white/5 pt-1">
                {item.name}
             </div>
          </div>
        )
      })}
    </div>
  );
};
