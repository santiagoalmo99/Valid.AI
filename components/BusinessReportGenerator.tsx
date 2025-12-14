/**
 * Business Report Generator Component
 * Premium feature for generating professional business reports
 * Implements neuromarketing principles: Zeigarnik, Peak-End, Anchoring
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, X, ChevronRight, Sparkles, Download, ExternalLink,
  Check, Loader2, Zap, Lock, Crown, AlertCircle,
  LayoutDashboard, Target, BarChart3, Users, Lightbulb, 
  Briefcase, Rocket, TrendingUp, ShieldAlert, Calendar, Paperclip
} from 'lucide-react';
import { 
  ProjectTemplate, Interview, ReportConfig, REPORT_SECTIONS, 
  calculateReportCost, GeneratedReport, UserCredits 
} from '../types';
import { getUserCredits, spendCredits } from '../services/creditsService';
import { generateBusinessReport, downloadReport, openReportForPrint } from '../services/reportGenerator';

interface Props {
  project: ProjectTemplate;
  interviews: Interview[];
  userId: string;
  onClose: () => void;
  credits?: UserCredits | null; // Optional prop to avoid double-fetching
}

type Step = 'config' | 'generating' | 'complete';

// Icon Mapping Helper
const getSectionIcon = (id: string, className: string = "w-4 h-4") => {
  switch (id) {
    case 'executive_summary': return <LayoutDashboard className={className} />;
    case 'problem_solution': return <Target className={className} />;
    case 'market_analysis': return <BarChart3 className={className} />;
    case 'competition': return <Users className={className} />;
    case 'validation_results': return <Check className={className} />;
    case 'customer_insights': return <Lightbulb className={className} />;
    case 'business_model': return <Briefcase className={className} />;
    case 'go_to_market': return <Rocket className={className} />;
    case 'financial_projections': return <TrendingUp className={className} />;
    case 'risk_assessment': return <ShieldAlert className={className} />;
    case 'roadmap': return <Calendar className={className} />;
    case 'appendix': return <Paperclip className={className} />;
    default: return <FileText className={className} />;
  }
};

export const BusinessReportGenerator: React.FC<Props> = ({ 
  project, 
  interviews, 
  userId, 
  onClose,
  credits: initialCredits 
}) => {
  const [step, setStep] = useState<Step>('config');
  const [selectedSections, setSelectedSections] = useState<string[]>(
    REPORT_SECTIONS.filter(s => s.enabled).map(s => s.id)
  );
  const [credits, setCredits] = useState<UserCredits | null>(initialCredits || null);
  const [loadingCredits, setLoadingCredits] = useState(!initialCredits);
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sync with prop if it updates
  useEffect(() => {
     if (initialCredits) {
        setCredits(initialCredits);
        setLoadingCredits(false);
     }
  }, [initialCredits]);

  const totalCost = calculateReportCost(selectedSections);
  const hasEnoughCredits = credits ? credits.available >= totalCost : false;

  // Load user credits (Only if not provided via prop)
  const loadCredits = useCallback(async () => {
    if (initialCredits) return; // Skip if provided
    
    setLoadingCredits(true);
    setCreditsError(null);
    try {
      const data = await getUserCredits(userId);
      setCredits(data);
    } catch (e) {
      console.error("Failed to load credits:", e);
      setCreditsError("Error de conexión");
    } finally {
      setLoadingCredits(false);
    }
  }, [userId, initialCredits]);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  // Toggle section selection
  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Generate report
  const handleGenerate = useCallback(async () => {
    if (!hasEnoughCredits || selectedSections.length === 0) return;
    
    setGenerating(true);
    setStep('generating');
    setError(null);
    
    // VALIDATION: Ensure enough data exists
    if (!interviews || interviews.length === 0) {
       setError("No hay entrevistas realizadas. Necesitas datos reales para generar el reporte.");
       setStep('config');
       setGenerating(false);
       return;
    }

    if (!project.description || project.description.length < 20) {
       setError("La descripción del proyecto es muy corta. Agrega más detalles en la configuración.");
       setStep('config');
       setGenerating(false);
       return;
    }

    try {
      // Spend credits first
      const success = await spendCredits(userId, totalCost, `Report: ${project.name}`);
      if (!success) {
        setError('No tienes suficientes créditos');
        setStep('config');
        setGenerating(false);
        return;
      }
      
      // Update credits display
      const updatedCredits = await getUserCredits(userId);
      setCredits(updatedCredits);
      
      // Generate report with progress
      const config: ReportConfig = {
        projectId: project.id,
        template: 'startup',
        sections: selectedSections,
        language: 'es',
        depth: 'detailed',
      };
      
      // Safety Timeout (30s)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout: El reporte está tardando demasiado. Verifica tu conexión.')), 30000)
      );

      const generatedReport = await Promise.race([
        generateBusinessReport(
          config,
          project,
          interviews,
          ({ progress, stage }) => {
            console.log(`[Report Gen] Progress: ${progress}% - ${stage}`);
            setProgress(progress);
            setCurrentStage(stage);
          }
        ),
        timeoutPromise
      ]) as GeneratedReport;
      
      setReport(generatedReport);
      setStep('complete');
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
      
    } catch (err: any) {
      console.error('Report generation error:', err);
      setError(err.message || 'Error generando el reporte. Por favor intenta de nuevo.');
      setStep('config');
    } finally {
      setGenerating(false);
    }
  }, [project, interviews, userId, selectedSections, totalCost, hasEnoughCredits]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 lg:p-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Confetti Effect */}
        {showConfetti && <ConfettiEffect />}
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl h-[85vh] bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center ring-2 ring-emerald-500/5">
                <Crown className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight leading-none">Business Lab</h2>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Consultoría Estratégica AI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               {/* Available Credits Pill */}
               <div className="hidden md:flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                   <Zap className="w-3 h-3 text-yellow-500" />
                   <span className="text-xs text-white font-bold">{credits?.available ?? 0}</span>
               </div>
               <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white">
                 <X className="w-5 h-5" />
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden">
            {step === 'config' && (
              <div className="h-full grid grid-cols-1 lg:grid-cols-12">
                
                {/* LEFT COL: Financial & Value (4 cols) */}
                <div className="lg:col-span-4 p-6 border-r border-white/5 bg-white/[0.01] flex flex-col overflow-y-auto custom-scrollbar">
                    <ConfigSidebar 
                      totalCost={totalCost} 
                      interviewsCount={interviews.length} 
                    />
                    
                    {/* Error Message */}
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-200 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {error}
                      </motion.div>
                    )}
                </div>

                {/* RIGHT COL: Sections Grid (8 cols) */}
                <div className="lg:col-span-8 p-6 overflow-y-auto custom-scrollbar bg-[#050505]">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                           <h3 className="text-xl font-bold text-white">Configuración del Reporte</h3>
                           <p className="text-slate-500 text-xs mt-1">Selecciona los módulos estratégicos a incluir.</p>
                        </div>
                        <div className="text-xs text-slate-400">
                           {selectedSections.length} seleccionados
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-20">
                      {REPORT_SECTIONS.map(section => (
                        <SectionCard 
                           key={section.id} 
                           section={section} 
                           isSelected={selectedSections.includes(section.id)}
                           onToggle={() => toggleSection(section.id)}
                        />
                      ))}
                    </div>
                </div>
              </div>
            )}

            {step === 'generating' && (
              <GeneratingStep progress={progress} currentStage={currentStage} />
            )}
            
            {step === 'complete' && report && (
              <CompleteStep 
                report={report}
                onDownload={() => downloadReport(report, `${project.name.replace(/\s+/g, '_')}_Report.html`)}
                onOpenNew={() => openReportForPrint(report)}
              />
            )}
          </div>

          {/* Footer Bar (Only shown in config) */}
          {step === 'config' && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md flex justify-end lg:pr-8">
               <motion.button
                  whileHover={hasEnoughCredits && selectedSections.length > 0 ? { scale: 1.02 } : {}}
                  whileTap={hasEnoughCredits && selectedSections.length > 0 ? { scale: 0.98 } : {}}
                  onClick={handleGenerate}
                  disabled={!hasEnoughCredits || selectedSections.length === 0 || generating || loadingCredits || !!creditsError}
                  className={`
                    flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg
                    ${hasEnoughCredits && selectedSections.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-emerald-900/40'
                      : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    }
                  `}
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Generar Reporte ({totalCost} CR)</>
                  )}
                </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============ SUB-COMPONENTS ============

const ConfigSidebar: React.FC<{
  totalCost: number;
  interviewsCount: number;
}> = ({ totalCost, interviewsCount }) => {
   const [currency, setCurrency] = useState<'USD' | 'COP'>('COP');
   const marketValue = totalCost * 2.5; 
   const displayValue = currency === 'USD' ? marketValue : marketValue * 4100;

   return (
      <div className="space-y-6">
         {/* Value Card */}
         <div className="bg-gradient-to-b from-[#111] to-black border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
               <TrendingUp size={12} className="text-indigo-400" /> Valor de Mercado
            </p>
            
            <div className="flex items-baseline gap-1 mb-3">
               <span className="text-3xl font-bold text-white tracking-tight">
                  {currency === 'USD' ? '$' : '$'}{displayValue.toLocaleString('es-CO')}
               </span>
               <span className="text-[10px] text-slate-500 font-bold">{currency}</span>
            </div>

            <div className="flex gap-1 mb-4">
              <button 
                onClick={() => setCurrency('USD')} 
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${currency === 'USD' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-white'}`}
              >USD</button>
              <button 
                onClick={() => setCurrency('COP')} 
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${currency === 'COP' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-white'}`}
              >COP</button>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-relaxed border-t border-white/5 pt-3">
               Costo estimado si contrataras una firma externa clásica.
            </p>
         </div>

         {/* Cost Card */}
         <div className="bg-emerald-950/[0.1] border border-emerald-500/10 rounded-2xl p-5 relative">
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
               <Target size={12} /> Costo Hoy
            </p>
            <div className="flex items-baseline gap-2 mb-2">
               <span className="text-3xl font-bold text-white tracking-tight">{totalCost}</span>
               <span className="text-[10px] text-slate-400 font-bold uppercase">Créditos</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
               <Check size={10} className="text-emerald-400" />
               <span className="text-[10px] text-emerald-300 font-medium">Bonificado (Beta)</span>
            </div>
         </div>

         {/* Interview Warning (Mini) */}
         {interviewsCount < 5 && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
               <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span className="text-xs font-bold text-amber-500">Nota de Calidad</span>
               </div>
               <p className="text-[11px] text-amber-200/60 leading-relaxed">
                  Tienes {interviewsCount} entrevistas. Se recomiendan 5+ para mejores resultados.
               </p>
            </div>
         )}
      </div>
   );
};

const SectionCard: React.FC<{
  section: typeof REPORT_SECTIONS[0];
  isSelected: boolean;
  onToggle: () => void;
}> = ({ section, isSelected, onToggle }) => (
  <button
      onClick={onToggle}
      className={`
        relative group flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-200 border w-full
        ${isSelected 
          ? 'bg-[#151515] border-emerald-500/30 shadow-[0_4px_12px_rgba(0,0,0,0.2)]' 
          : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/10'
        }
      `}
    >
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200
        ${isSelected 
            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
            : 'bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300'
        }
      `}>
        {isSelected ? <Check size={14} strokeWidth={3} /> : getSectionIcon(section.id)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <p className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
            {section.title}
          </p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
              isSelected 
                  ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/30' 
                  : 'text-slate-600 border-white/5 bg-white/5'
            }`}>
              {section.creditCost} CR
            </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-snug group-hover:text-slate-400 line-clamp-2">
            {section.description}
        </p>
      </div>
  </button>
);

const GeneratingStep: React.FC<{ progress: number; currentStage: string }> = ({ progress, currentStage }) => (
  <div className="h-full flex flex-col items-center justify-center p-10 text-center relative">
    <div className="w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] absolute"></div>
    
    <div className="relative z-10 w-full max-w-sm space-y-8">
       <div className="mx-auto w-20 h-20 relative">
          <svg className="w-full h-full transform -rotate-90">
             <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
             <circle 
                cx="40" cy="40" r="36" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 36}`} 
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`} 
                className="text-emerald-500 transition-all duration-300 ease-out" 
             />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-sm font-bold text-white">{progress}%</span>
          </div>
       </div>

       <div>
          <h3 className="text-2xl font-bold text-white mb-2">Construyendo Estrategia</h3>
          <p className="text-emerald-400 text-sm animate-pulse">{currentStage}...</p>
       </div>
    </div>
  </div>
);

const CompleteStep: React.FC<{
  report: GeneratedReport;
  onDownload: () => void;
  onOpenNew: () => void;
}> = ({ report, onDownload, onOpenNew }) => (
  <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 mb-8"
    >
      <Check className="w-10 h-10 text-emerald-500" />
    </motion.div>
    
    <h3 className="text-3xl font-bold text-white mb-3">¡Reporte Listo!</h3>
    <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
      Tu reporte ha sido generado exitosamente. Puedes descargarlo ahora o visualizar una versión amigable para impresión.
    </p>
    
    <div className="flex gap-4">
      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-xl font-bold text-sm hover:bg-emerald-400 transition-transform hover:scale-105 shadow-emerald-900/20 shadow-lg"
      >
        <Download className="w-4 h-4" />
        Descargar (HTML)
      </button>
      <button
        onClick={onOpenNew}
        className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/10"
      >
        <ExternalLink className="w-4 h-4" />
        Ver Reporte
      </button>
    </div>
  </div>
);

const ConfettiEffect: React.FC = () => {
  const colors = ['#00FF94', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    size: Math.random() * 6 + 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1 }}
          animate={{ y: '100vh', opacity: 0, rotate: Math.random() * 360 }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '2px',
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
};

export default BusinessReportGenerator;
