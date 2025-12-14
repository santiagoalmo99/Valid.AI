import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, MessageSquare, Brain, Target, Zap, DollarSign, Activity, AlertTriangle, Quote, CheckCircle2, TrendingUp, Sparkles, PieChart as PieIcon } from 'lucide-react';
import { Interview, ProjectTemplate } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ExportButton } from './ExportButton';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface InterviewModalProps {
  interview: Interview | null;
  project: ProjectTemplate;
  onClose: () => void;
  onRetryAnalysis?: () => Promise<Interview | undefined>;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({ interview, project, onClose, onRetryAnalysis }) => {
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [justUpdated, setJustUpdated] = React.useState(false);

  const handleRetry = async () => {
     if (!onRetryAnalysis) return;
     setIsRetrying(true);
     
     try {
        console.log('🔄 Starting analysis retry...');
        await onRetryAnalysis(); // Wait for analysis AND save to complete
        console.log('✅ Analysis complete, waiting 2 seconds before reload...');
        
        // Wait to ensure Firebase save has propagated
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Now reload to show updated data
        console.log('🔄 Reloading page...');
        window.location.reload();
     } catch (e) {
        console.error('❌ Retry error:', e);
        alert('Error al analizar. Revisa la consola para más detalles.');
        setIsRetrying(false);
     }
  };

  // Defensive checks AFTER hooks
  if (!interview) {
    console.warn('InterviewModal: No interview data provided');
    return null;
  }
  
  if (!project || !project.questions) {
    console.error('InterviewModal: Invalid project data', project);
    return null;
  }

  // Detect if analysis failed or used fallback
  const isAnalysisFailed = 
    interview.summary?.includes("Analysis failed") || 
    interview.summary?.includes("Error") || 
    interview.summary?.includes("falló") ||
    interview.summary?.includes("Revisar manualmente") ||
    interview.summary?.includes("no pudo completar") ||
    interview.totalScore === 0 ||
    interview.totalScore === 50; // Fallback default score

  // Data for Radar Chart (Consistency/Truth)
  const radarData = [
    { subject: 'Problema', A: interview.dimensionScores?.problemIntensity || 0, fullMark: 100 },
    { subject: 'Solución', A: interview.dimensionScores?.solutionFit || 0, fullMark: 100 },
    { subject: 'Pago', A: interview.dimensionScores?.willingnessToPay || 0, fullMark: 100 },
    { subject: 'Dolor', A: interview.dimensionScores?.painPoint || 0, fullMark: 100 },
    { subject: 'Early Adopter', A: interview.dimensionScores?.earlyAdopter || 0, fullMark: 100 },
  ];

  // Data for Sentiment Donut (Mock based on score if not available)
  const positive = interview.totalScore;
  const negative = 100 - interview.totalScore;
  const sentimentData = [
    { name: 'Positive', value: positive },
    { name: 'Resistance', value: negative },
  ];
  const COLORS = ['#00FF94', '#333'];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
          className="bg-[#050505] w-full max-w-[1400px] h-[90vh] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative"
          onClick={e => e.stopPropagation()}
        >
            {/* Background Ambient */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon/5 rounded-full blur-[120px] pointer-events-none"/>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"/>

          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-white/[0.02] backdrop-blur-xl z-20">
            <div className="flex items-center gap-6">
                 {/* Avatar Placeholder */}
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                    {interview.respondentName.charAt(0)}
                 </div>
                 
                 <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                        {interview.respondentName}
                        {interview.respondentRole && <span className="text-xs bg-neon/10 text-neon px-3 py-1 rounded-full border border-neon/20 uppercase tracking-wider font-bold shadow-[0_0_10px_rgba(58,255,151,0.2)]">{interview.respondentRole}</span>}
                    </h2>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-400 font-medium">
                        {interview.respondentEmail && <span className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={14} className="text-neon"/> {interview.respondentEmail}</span>}
                        {interview.respondentPhone && <span className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={14} className="text-neon"/> {interview.respondentPhone}</span>}
                        {(interview.respondentCity || interview.respondentCountry) && (
                           <span className="flex items-center gap-2 hover:text-white transition-colors"><MapPin size={14} className="text-neon"/> {[interview.respondentCity, interview.respondentCountry].filter(Boolean).join(', ')}</span>
                        )}
                        <span className="flex items-center gap-2 hover:text-white transition-colors"><Calendar size={14} className="text-slate-500"/> {new Date(interview.date).toLocaleString()}</span>
                    </div>
                 </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ExportButton type="interview" project={project} interview={interview} variant="ghost" size="sm" />
              <button 
                 onClick={onClose} 
                 className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:rotate-90 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar z-10 relative">
            
            {/* Top Grid: Expanded Horizontal Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                 
                 {/* 1. Executive Summary Card (Width: 5/12) */}
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.1 }}
                   className={`lg:col-span-5 bg-[#0F0F0F] p-8 rounded-[24px] border transition-all duration-500 ${justUpdated ? 'border-neon shadow-[0_0_30px_rgba(58,255,151,0.15)]' : 'border-white/5'} relative overflow-hidden group flex flex-col`}
                >
                   {justUpdated && (
                      <div className="absolute top-4 right-4 bg-neon/10 text-neon text-[10px] font-bold px-3 py-1 rounded-full border border-neon/20 animate-pulse flex items-center gap-2">
                         <Zap size={12} fill="currentColor"/> LIVE UPDATE
                      </div>
                   )}
                   
                   <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                      <Brain size={16} className="text-neon" /> AI Executive Summary
                   </h3>
                   
                   {isAnalysisFailed ? (
                      <div className="flex flex-col items-start gap-4">
                         <p className="text-red-400 italic text-sm border-l-2 border-red-500 pl-4 py-1">
                            {interview.summary?.includes("Analysis failed:") ? interview.summary : "Analysis failed or incomplete."}
                         </p>
                         {onRetryAnalysis && (
                            <button onClick={handleRetry} disabled={isRetrying} className="bg-neon/10 hover:bg-neon/20 text-neon border border-neon/50 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                               {isRetrying ? <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" /> : <Zap size={16}/>}
                               {isRetrying ? 'Re-analyzing...' : 'Retry Analysis'}
                            </button>
                         )}
                      </div>
                   ) : (
                      <div className="relative z-10 flex-1">
                         <div className="mb-6 relative">
                            <Quote className="absolute -top-3 -left-3 text-white/5 transform -scale-x-100" size={50} />
                            <p className="text-slate-200 text-lg leading-relaxed font-light italic pl-6 border-l-2 border-neon/30">
                              "{interview.summary}"
                            </p>
                         </div>
                         
                         {/* Key Tags */}
                         <div className="flex flex-wrap gap-2 mt-auto">
                            {interview.keyInsights?.slice(0,3).map((tag, i) => (
                               <span key={i} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-slate-300 border border-white/5">
                                  {tag.length > 30 ? tag.substring(0,30) + '...' : tag}
                               </span>
                            ))}
                         </div>
                      </div>
                   )}
                </motion.div>

                {/* 2. Validation Radar (Width: 3/12) */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.2 }}
                   className="lg:col-span-4 bg-[#0F0F0F] p-6 rounded-[24px] border border-white/5 flex flex-col relative overflow-hidden"
                >
                   <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2 text-center w-full justify-center">
                      <Target size={16} className="text-blue-400" /> Validation Dimensions
                   </h3>
                   
                   <div className="flex-1 w-full h-[250px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Validation" dataKey="A" stroke="#00FF94" strokeWidth={2} fill="#00FF94" fillOpacity={0.2} />
                            <Tooltip 
                               contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                               itemStyle={{ color: '#00FF94' }}
                            />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </motion.div>

                {/* 3. Score & Sentiment (Width: 3/12) */}
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                   className="lg:col-span-3 bg-[#0F0F0F] p-6 rounded-[24px] border border-white/5 flex flex-col relative overflow-hidden"
                >  
                   <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-6 flex items-center justify-center gap-2">
                      <Activity size={16} className="text-purple-400" /> Scoring Impact
                   </h3>

                   <div className="flex-1 flex flex-col items-center justify-center">
                      <CircularScore score={interview.totalScore} />
                      
                      <div className="grid grid-cols-2 gap-4 w-full mt-6">
                         <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sentiment</div>
                            <div className="text-emerald-400 font-bold text-lg">Positive</div>
                         </div>
                         <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                             <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Reliability</div>
                             <div className="text-blue-400 font-bold text-lg">High</div>
                         </div>
                      </div>
                   </div>

                   {/* Always show retry button */}
                   {onRetryAnalysis && (
                      <button 
                         onClick={handleRetry} 
                         disabled={isRetrying}
                         className="mt-6 w-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         {isRetrying ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap size={14} />}
                         Recalculate
                      </button>
                   )}
                </motion.div>
            </div>

            {/* SURGICAL ANALYSIS (Horizontal Cards) */}
            {interview.enhancedAnalysis && (
               <div className="mb-8 animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-6">
                     <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        <Sparkles className="text-neon" /> Deep Analysis
                     </h3>
                     <div className="h-px bg-white/10 flex-1"></div>
                     {interview.enhancedAnalysis.verdict === 'GO' && <span className="bg-neon text-black text-xs font-bold px-3 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(58,255,151,0.4)]">GO Decision</span>}
                     {interview.enhancedAnalysis.verdict === 'NO-GO' && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)]">NO-GO Decision</span>}
                     {interview.enhancedAnalysis.verdict === 'PIVOT' && <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase shadow-[0_0_15px_rgba(250,204,21,0.4)]">PIVOT Advised</span>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {/* Red Flags Card */}
                     <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl relative overflow-hidden hover:bg-red-500/10 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={64} className="text-red-500"/></div>
                        <h4 className="text-red-400 font-bold uppercase text-xs mb-4 flex items-center gap-2 relative z-10"><AlertTriangle size={14}/> Red Flags Detected</h4>
                        
                        {interview.enhancedAnalysis.signals.redFlags.length > 0 ? (
                           <ul className="space-y-3 relative z-10">
                              {interview.enhancedAnalysis.signals.redFlags.slice(0, 4).map((flag, idx) => (
                                 <li key={idx} className="text-slate-300 text-sm flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                    <span className="leading-snug">{flag}</span>
                                 </li>
                              ))}
                           </ul>
                        ) : (
                           <p className="text-slate-500 text-sm italic relative z-10">No critical red flags detected.</p>
                        )}
                     </div>

                     {/* Buying Signals Card */}
                     <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden hover:bg-emerald-500/10 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={64} className="text-emerald-500"/></div>
                        <h4 className="text-emerald-400 font-bold uppercase text-xs mb-4 flex items-center gap-2 relative z-10"><Zap size={14}/> Buying Signals</h4>
                        
                        {interview.enhancedAnalysis.signals.buying.length > 0 ? (
                           <ul className="space-y-3 relative z-10">
                              {interview.enhancedAnalysis.signals.buying.slice(0, 4).map((signal, idx) => (
                                 <li key={idx} className="text-slate-300 text-sm flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                    <span className="leading-snug">{signal}</span>
                                 </li>
                              ))}
                           </ul>
                        ) : (
                           <p className="text-slate-500 text-sm italic relative z-10">No strong buying signals detected.</p>
                        )}
                     </div>

                     {/* Strategic Insight Card */}
                     <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden hover:bg-blue-500/10 transition-colors md:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={64} className="text-blue-500"/></div>
                        <h4 className="text-blue-400 font-bold uppercase text-xs mb-4 flex items-center gap-2 relative z-10"><TrendingUp size={14}/> Strategic Insight</h4>
                        
                        <div className="relative z-10">
                           {interview.enhancedAnalysis.visualAnalogy && (
                               <div className="mb-4 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                                  <p className="text-blue-200 text-xs italic font-medium leading-relaxed">
                                     "{interview.enhancedAnalysis.visualAnalogy}"
                                  </p>
                               </div>
                           )}
                           
                           {/* Contradictions */}
                           {interview.enhancedAnalysis.signals.contradictions && interview.enhancedAnalysis.signals.contradictions.length > 0 && (
                              <div>
                                 <h5 className="text-slate-500 text-[10px] font-bold uppercase mb-2">Contradictions</h5>
                                 {interview.enhancedAnalysis.signals.contradictions.slice(0,2).map((c, i) => (
                                    <div key={i} className="mb-2 text-xs text-slate-400">
                                       <span className="text-red-400 font-bold">⚠️ Logic Gap:</span> {c.analysis}
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* Q&A Section */}
            <div className="mb-6 border-t border-white/5 pt-8">
               <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                  <MessageSquare className="text-neon" /> Full Transcript
               </h3>
               
               <div className="grid grid-cols-1 gap-4">
                  {project.questions && project.questions.length > 0 ? (
                     project.questions.map((q, index) => {
                        const answerData = interview.answers?.[q.id];
                        if (!answerData) return null;

                        // Handle both string (legacy) and object (new) formats
                        const answerText = typeof answerData === 'string' ? answerData : answerData.rawValue;
                        const observation = typeof answerData === 'object' ? answerData.observation : null;

                        return (
                           <div key={q.id} className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.02]">
                              <div className="flex gap-4">
                                 <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-slate-500 font-bold text-xs ring-1 ring-white/10">
                                       {index + 1}
                                    </div>
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">{q.text}</p>
                                    <div className="text-slate-200 text-base leading-relaxed pl-4 border-l-2 border-white/10">
                                       "{answerText || 'No response'}"
                                    </div>
                                    
                                    {observation && (
                                       <div className="mt-3 text-xs text-neon/70 italic flex items-center gap-2 bg-neon/5 p-2 rounded-lg inline-block">
                                          <Sparkles size={10} /> {observation}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        );
                     })
                  ) : (
                     <div className="text-center text-slate-500 py-8">No questions available</div>
                  )}
               </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ScoreBar = ({ label, value, icon }: any) => (
   <div className="flex items-center gap-3 text-xs">
      <div className="w-24 text-slate-400 flex items-center gap-1.5 font-medium">{icon} {label}</div>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
         <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value * 10}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${value > 7 ? 'bg-neon shadow-[0_0_10px_rgba(58,255,151,0.5)]' : value > 4 ? 'bg-yellow-400' : 'bg-red-400'}`} 
         ></motion.div>
      </div>
      <div className="w-6 text-right font-mono font-bold text-white">{value}</div>
   </div>
);

const CircularScore = ({ score }: { score: number }) => {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
      if (s >= 70) return '#3AFF97'; 
      if (s >= 40) return '#FACC15'; 
      return '#EF4444'; 
  };
  const color = getColor(score);
  
  return (
    <div className="relative w-40 h-40 flex items-center justify-center group cursor-default">
       {/* Background Glow */}
       <div className={`absolute inset-0 rounded-full blur-[40px] opacity-20 transition-colors duration-500`} style={{ backgroundColor: color }}></div>
       
       <svg className="transform -rotate-90 w-full h-full relative z-10 drop-shadow-2xl">
         {/* Track */}
         <circle
           cx="80"
           cy="80"
           r={radius}
           stroke="rgba(255,255,255,0.05)"
           strokeWidth="10"
           fill="transparent"
         />
         {/* Progress */}
         <motion.circle
           initial={{ strokeDashoffset: circumference }}
           animate={{ strokeDashoffset }}
           transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
           cx="80"
           cy="80"
           r={radius}
           stroke={color}
           strokeWidth="10"
           strokeDasharray={circumference}
           strokeLinecap="round"
           fill="transparent"
           className="drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
         />
       </svg>
       
       {/* Center Score */}
       <div className="absolute flex flex-col items-center justify-center z-20">
         <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-5xl font-bold text-white tracking-tighter"
            style={{ textShadow: `0 0 20px ${color}50` }}
         >
            {score}
         </motion.span>
         <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Score</span>
       </div>
    </div>
  );
};
