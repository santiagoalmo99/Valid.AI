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
}

type Step = 'config' | 'generating' | 'complete';

// Icon Mapping Helper
const getSectionIcon = (id: string, className: string = "w-5 h-5") => {
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
  onClose 
}) => {
  const [step, setStep] = useState<Step>('config');
  const [selectedSections, setSelectedSections] = useState<string[]>(
    REPORT_SECTIONS.filter(s => s.enabled).map(s => s.id)
  );
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalCost = calculateReportCost(selectedSections);
  const hasEnoughCredits = credits ? credits.available >= totalCost : false;

  // Load user credits
  useEffect(() => {
    getUserCredits(userId).then(setCredits);
  }, [userId]);

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
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Confetti Effect */}
        {showConfetti && <ConfettiEffect />}
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-black to-[#111]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Business Lab</h2>
                <p className="text-xs text-slate-400 mt-0.5">Generador Estratégico AI</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* Interview Warning */}
            {interviews.length < 3 && step === 'config' && (
              <div className="mb-10 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-bold text-base">Sugerencia de Calidad</p>
                  <p className="text-amber-300/70 text-sm mt-1 leading-relaxed">
                     Actualmente tienes {interviews.length} entrevistas. Para obtener insights estratégicos profundos, nuestro algoritmo rinde mejor con al menos 5 entrevistas validadas.
                  </p>
                </div>
              </div>
            )}

            {step === 'config' && (
              <ConfigStep 
                sections={REPORT_SECTIONS}
                selectedSections={selectedSections}
                onToggle={toggleSection}
                totalCost={totalCost}
                credits={credits}
                hasEnoughCredits={hasEnoughCredits}
                error={error}
              />
            )}

            {step === 'generating' && (
              <GeneratingStep 
                progress={progress} 
                currentStage={currentStage} 
              />
            )}
            
            {step === 'complete' && report && (
              <CompleteStep 
                report={report}
                onDownload={() => downloadReport(report, `${project.name.replace(/\s+/g, '_')}_Report.html`)}
                onOpenNew={() => openReportForPrint(report)}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-8 border-t border-white/10 bg-[#050505]">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/10 p-2.5 rounded-xl border border-yellow-500/20">
                 <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Saldo Disponible</span>
                <span className="text-white font-bold text-xl">{credits?.available ?? '...'} <span className="text-slate-500 text-sm font-normal">créditos</span></span>
              </div>
            </div>
            
            {step === 'config' && (
              <motion.button
                whileHover={hasEnoughCredits && selectedSections.length > 0 ? { scale: 1.02 } : {}}
                whileTap={hasEnoughCredits && selectedSections.length > 0 ? { scale: 0.98 } : {}}
                onClick={handleGenerate}
                disabled={!hasEnoughCredits || selectedSections.length === 0 || generating}
                className={`
                  flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-base uppercase tracking-wide transition-all
                  ${hasEnoughCredits && selectedSections.length > 0
                    ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                  }
                `}
              >
                <Sparkles className="w-5 h-5" />
                Generar Reporte ({totalCost} créditos)
              </motion.button>
            )}
            
            {step === 'complete' && (
              <button
                onClick={onClose}
                className="flex items-center gap-3 px-10 py-5 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10"
              >
                <Check className="w-5 h-5" />
                Finalizar Sesión
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============ SUB-COMPONENTS ============

const ConfigStep: React.FC<{
  sections: typeof REPORT_SECTIONS;
  selectedSections: string[];
  onToggle: (id: string) => void;
  totalCost: number;
  credits: UserCredits | null;
  hasEnoughCredits: boolean;
  error: string | null;
}> = ({ sections, selectedSections, onToggle, totalCost, credits, hasEnoughCredits, error }) => {
  const [currency, setCurrency] = useState<'USD' | 'COP'>('COP');

  // MARKET VALUE SIMULATION
  const marketValueAmount = totalCost * 2.5; 
  const displayValue = currency === 'USD' ? marketValueAmount : marketValueAmount * 4100;

  return (
  <div className="space-y-12 animate-fade-in font-sans">
    
    {/* PREMIUM FINANCIAL DASHBOARD */}
    <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-0 overflow-hidden relative group shadow-2xl ring-1 ring-white/5">
       <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
       
       {/* Dashboard Header */}
       <div className="flex justify-between items-center p-8 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-50"></div>
              </div>
              <span className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em]">Panel de Valoración</span>
           </div>
           
           <div className="flex bg-black/40 rounded-xl p-1.5 border border-white/10">
              <button 
                onClick={() => setCurrency('USD')} 
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${currency === 'USD' ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-500 hover:text-white'}`}
              >
                 USD
              </button>
              <button 
                onClick={() => setCurrency('COP')} 
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${currency === 'COP' ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-500 hover:text-white'}`}
              >
                 COP
              </button>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {/* Market Value Column */}
          <div className="p-12 relative">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                 <TrendingUp size={14} /> Valor de Mercado Estimado
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl lg:text-6xl font-bold text-white tracking-tighter">
                    {currency === 'USD' ? '$' : '$'}
                    <NumberTicker key={currency} value={displayValue} />
                  </span>
                  <span className="text-lg text-slate-500 font-medium self-end mb-2">{currency}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                  Costo equivalente estimado si contrataras una firma de consultoría estratégica externa para realizar este análisis detallado.
              </p>
          </div>

          {/* Your Cost Column */}
          <div className="p-12 bg-emerald-950/[0.05] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                        <Target size={14} /> Tu Inversión Actual
                      </p>
                      <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] uppercase tracking-wider">
                         Plan Beta
                      </span>
                  </div>
                  
                  <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-5xl lg:text-6xl font-bold text-white tracking-tighter tabular-nums">
                         {totalCost}
                      </span>
                      <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Créditos</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-emerald-300/90 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                      <div className="bg-emerald-500/20 p-2 rounded-full">
                        <Check size={16} className="text-emerald-400" />
                      </div>
                      <span className="font-medium">100% Bonificado en Etapa Beta</span>
                  </div>
              </div>
          </div>
       </div>
    </div>
    
    {error && (
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-red-500/5 border-l-4 border-red-500 p-6 rounded-r-xl flex items-center gap-4"
      >
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
        <p className="text-red-200 font-medium">{error}</p>
      </motion.div>
    )}
    
    {/* Section Selector */}
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
           <LayoutDashboard className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
           <h3 className="text-2xl font-bold text-white">Configuración del Alcance</h3>
           <p className="text-slate-400 text-sm mt-1">Selecciona los módulos estratégicos a incluir en tu reporte</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map(section => {
          const isSelected = selectedSections.includes(section.id);
          return (
            <motion.button
              key={section.id}
              onClick={() => onToggle(section.id)}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className={`
                group relative flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 border h-full
                ${isSelected 
                  ? 'bg-[#121212] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                  : 'bg-black border-white/5 hover:border-white/10 hover:bg-[#0a0a0a]'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 border relative z-10
                ${isSelected 
                   ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20' 
                   : 'bg-white/5 text-slate-500 border-white/5 group-hover:border-white/20 group-hover:text-slate-300 group-hover:bg-white/10'
                }
              `}>
                {isSelected ? <Check size={18} strokeWidth={3} /> : getSectionIcon(section.id, "w-5 h-5")}
              </div>
              
              <div className="relative z-10 flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-sm font-bold transition-colors truncate ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {section.title}
                  </p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border transition-colors uppercase tracking-wider ml-2 ${
                      isSelected 
                         ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30' 
                         : 'text-slate-600 border-white/5 bg-white/5'
                   }`}>
                      {section.creditCost} CR
                   </span>
                </div>
                
                <p className="text-xs text-slate-500 leading-snug group-hover:text-slate-400 transition-colors line-clamp-1">
                   {section.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  </div>
  );
};

// Animated Number Component
const NumberTicker = ({ value }: { value: number }) => {
   const [display, setDisplay] = useState(0);
   
   useEffect(() => {
      let start = 0;
      const end = value;
      const duration = 1000;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
         const elapsed = currentTime - startTime;
         const progress = Math.min(elapsed / duration, 1);
         const easeOutQuart = 1 - Math.pow(1 - progress, 4);
         
         const current = Math.floor(easeOutQuart * end);
         setDisplay(current);
         
         if (progress < 1) {
            requestAnimationFrame(animate);
         }
      };
      
      requestAnimationFrame(animate);
   }, [value]);
   
   return <>{display.toLocaleString('es-CO')}</>;
};

const GeneratingStep: React.FC<{
  progress: number;
  currentStage: string;
}> = ({ progress, currentStage }) => (
  <div className="py-24 space-y-16">
    <div className="text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]"></div>
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="w-32 h-32 mx-auto mb-10 bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 rounded-full relative z-10"
      >
        <div className="w-full h-full bg-black rounded-full flex items-center justify-center backdrop-blur-xl">
            <Loader2 className="w-16 h-16 text-emerald-500" />
        </div>
      </motion.div>
      <h3 className="text-4xl font-bold text-white mb-4 relative z-10">Generando tu Reporte</h3>
      <p className="text-slate-400 text-xl relative z-10 animate-pulse font-light">{currentStage}</p>
    </div>
    
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between text-sm uppercase tracking-widest font-bold">
        <span className="text-slate-500">Procesando Datos</span>
        <span className="text-emerald-500">{progress}%</span>
      </div>
      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  </div>
  );


const CompleteStep: React.FC<{
  report: GeneratedReport;
  onDownload: () => void;
  onOpenNew: () => void;
}> = ({ report, onDownload, onOpenNew }) => (
  <div className="py-16 space-y-10 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="w-40 h-40 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
    >
      <Check className="w-20 h-20 text-emerald-500" />
    </motion.div>
    
    <div>
      <h3 className="text-4xl font-bold text-white mb-4">¡Reporte Estratégico Listo!</h3>
      <p className="text-slate-400 text-xl max-w-xl mx-auto leading-relaxed">
        Tu análisis de mercado y validación ha sido completado exitosamente.
      </p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
      <button
        onClick={onDownload}
        className="group flex items-center justify-center gap-4 px-10 py-5 bg-emerald-500 text-black rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
      >
        <Download className="w-6 h-6" />
        Descargar HTML
      </button>
      <button
        onClick={onOpenNew}
        className="flex items-center justify-center gap-4 px-10 py-5 bg-white/5 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/10"
      >
        <ExternalLink className="w-6 h-6" />
        Vista de Impresión
      </button>
    </div>
    
    <div className="mt-12 pt-8 border-t border-white/5 opacity-50">
       <p className="text-slate-500 text-sm">
         ID: <span className="font-mono">{report.id.substring(0,8)}</span> • Generado: {new Date(report.generatedAt).toLocaleString()}
       </p>
    </div>
  </div>
  );


const ConfettiEffect: React.FC = () => {
  const colors = ['#00FF94', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    size: Math.random() * 8 + 4,
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
