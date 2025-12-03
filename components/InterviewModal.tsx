import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, MessageSquare, Brain, Target, Zap, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import { Interview, ProjectTemplate } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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

  const isAnalysisFailed = interview.summary?.includes("Analysis failed") || interview.summary?.includes("Error") || interview.totalScore === 0;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#0a0a0a] w-full max-w-6xl max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {interview.respondentName}
                {interview.respondentRole && <span className="text-xs bg-neon/10 text-neon px-3 py-1 rounded-full border border-neon/20 uppercase tracking-wider">{interview.respondentRole}</span>}
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                {interview.respondentEmail && <span className="flex items-center gap-1"><Mail size={14}/> {interview.respondentEmail}</span>}
                {interview.respondentPhone && <span className="flex items-center gap-1"><Phone size={14}/> {interview.respondentPhone}</span>}
                {(interview.respondentCity || interview.respondentCountry) && (
                   <span className="flex items-center gap-1"><MapPin size={14}/> {[interview.respondentCity, interview.respondentCountry].filter(Boolean).join(', ')}</span>
                )}
                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(interview.date).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            
            {/* AI Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className={`md:col-span-2 bg-white/5 p-6 rounded-2xl border transition-all duration-500 ${justUpdated ? 'border-neon shadow-[0_0_20px_rgba(58,255,151,0.3)]' : 'border-white/5'} relative overflow-hidden`}>
                  {justUpdated && (
                     <div className="absolute top-2 right-2 text-neon text-xs font-bold animate-pulse">
                        ✨ Updated!
                     </div>
                  )}
                  <h3 className="text-neon font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                     <Brain size={16} /> AI Executive Summary
                  </h3>
                  
                  {isAnalysisFailed ? (
                     <div className="flex flex-col items-start gap-4">
                        <p className="text-red-400 italic text-sm">
                           {interview.summary?.includes("Analysis failed:") ? interview.summary : "Analysis failed or incomplete."}
                        </p>
                        {onRetryAnalysis && (
                           <button 
                              onClick={handleRetry} 
                              disabled={isRetrying}
                              className="bg-neon/10 hover:bg-neon/20 text-neon border border-neon/50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              {isRetrying ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                                  Analizando...
                                </>
                              ) : (
                                <>
                                  <Zap size={16}/>
                                  Reintentar Análisis
                                </>
                              )}
                           </button>
                        )}
                     </div>
                  ) : (
                     <p className="text-slate-300 leading-relaxed italic">"{interview.summary}"</p>
                  )}
                  
                  {interview.keyInsights && interview.keyInsights.length > 0 && (
                     <div className="mt-6 space-y-2">
                        {interview.keyInsights.map((insight, idx) => (
                           <div key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className="text-neon mt-1">•</span>
                              <span>{insight}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
                  <div className="text-6xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(58,255,151,0.5)]">
                     {interview.totalScore}
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-6">Validation Score</div>
                  
                  <div className="w-full space-y-3">
                     <ScoreBar label="Problem" value={interview.dimensionScores?.problemIntensity || 0} icon={<AlertTriangle size={12}/>} />
                     <ScoreBar label="Solution" value={interview.dimensionScores?.solutionFit || 0} icon={<Target size={12}/>} />
                     <ScoreBar label="Willingness" value={interview.dimensionScores?.willingnessToPay || 0} icon={<DollarSign size={12}/>} />
                  </div>
               </div>
            </div>

            {/* Q&A Section */}
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
               <MessageSquare className="text-neon" /> Interview Transcript & Analysis
            </h3>
            
            <div className="space-y-6">
               {project.questions && project.questions.length > 0 ? (
                  project.questions.map((q, index) => {
                     const answerData = interview.answers?.[q.id];
                     if (!answerData) return null;

                     // Handle both string (legacy) and object (new) formats
                     const answerText = typeof answerData === 'string' ? answerData : answerData.rawValue;
                     const observation = typeof answerData === 'object' ? answerData.observation : null;

                     return (
                        <div key={q.id} className="bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                           <div className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 font-bold text-xs">
                                 {index + 1}
                              </div>
                              <div className="flex-1">
                                 <p className="text-slate-400 text-sm mb-2 font-medium">{q.text}</p>
                                 <p className="text-white text-lg mb-4">"{answerText || 'No response'}"</p>
                                 
                                 {observation && (
                                    <div className="mt-2 text-sm text-slate-500 italic border-l-2 border-neon/30 pl-3">
                                       Observation: {observation}
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="text-center text-slate-500 py-8">
                     No questions available
                  </div>
               )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ScoreBar = ({ label, value, icon }: any) => (
   <div className="flex items-center gap-3 text-xs">
      <div className="w-20 text-slate-400 flex items-center gap-1">{icon} {label}</div>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
         <div 
            className={`h-full rounded-full ${value > 7 ? 'bg-neon' : value > 4 ? 'bg-yellow-400' : 'bg-red-400'}`} 
            style={{ width: `${value * 10}%` }}
         ></div>
      </div>
      <div className="w-6 text-right font-bold text-white">{value}</div>
   </div>
);
