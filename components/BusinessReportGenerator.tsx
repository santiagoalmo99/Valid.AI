/**
 * Business Report Generator Component
 * Premium feature for generating professional business reports
 * Implements neuromarketing principles: Zeigarnik, Peak-End, Anchoring
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, X, ChevronRight, Sparkles, Download, ExternalLink,
  Check, Loader2, Zap, Lock, Crown, AlertCircle
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
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Business Lab</h2>
                <p className="text-sm text-slate-400">Genera tu reporte profesional</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Interview Warning */}
            {interviews.length < 3 && step === 'config' && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium text-sm">Recomendación</p>
                  <p className="text-yellow-300/80 text-xs mt-1">
                    Para mejores resultados, te recomendamos tener al menos 5 entrevistas completadas. 
                    Actualmente tienes {interviews.length}. Puedes continuar de todas formas.
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
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black/30">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-slate-300">
                Créditos: <span className="text-white font-semibold">{credits?.available ?? '...'}</span>
              </span>
            </div>
            
            {step === 'config' && (
              <button
                onClick={handleGenerate}
                disabled={!hasEnoughCredits || selectedSections.length === 0 || generating}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                  ${hasEnoughCredits && selectedSections.length > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }
                `}
              >
                <Sparkles className="w-5 h-5" />
                Generar Reporte ({totalCost} créditos)
              </button>
            )}
            
            {step === 'complete' && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Check className="w-5 h-5" />
                Cerrar
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
  <div className="space-y-8 animate-fade-in font-sans">
    
    {/* PREMIUM FINANCIAL DASHBOARD */}
    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-0 overflow-hidden relative group shadow-2xl">
       <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
       
       <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Panel de Inversión</span>
           </div>
           
           <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
              <button 
                onClick={() => setCurrency('USD')} 
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${currency === 'USD' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                 USD
              </button>
              <button 
                onClick={() => setCurrency('COP')} 
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-300 ${currency === 'COP' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                 COP
              </button>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Market Value Column */}
          <div className="p-8 border-r border-white/5 relative">
              <p className="text-slate-500 text-xs font-medium mb-2">Valor Comercial (Mercado Real)</p>
              <div className="flex items-baseline gap-1">
                  <span className="text-3xl lg:text-4xl font-bold text-white tracking-tighter">
                    {currency === 'USD' ? '$' : '$'}
                    <NumberTicker value={displayValue} />
                  </span>
                  <span className="text-sm text-slate-500 font-bold">{currency}</span>
              </div>
              <p className="text-[10px] text-slate-600 mt-2 max-w-[200px] leading-relaxed">
                  Costo estimado si contrataras una consultora externa para este análisis.
              </p>
          </div>

          {/* Your Cost Column */}
          <div className="p-8 bg-emerald-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide">Tu Inversión Hoy</p>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                         PLAN BETA: GRATIS
                      </span>
                  </div>
                  
                  <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-bold text-white tracking-tighter tabular-nums">
                         {totalCost}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase">Créditos</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-400/80 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                      <Check size={12} />
                      Cubierto por tus 100 Créditos de Cortesía
                  </div>
              </div>
          </div>
       </div>
    </div>
    
    {error && (
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-red-500/5 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3"
      >
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-red-200 text-sm font-medium">{error}</p>
      </motion.div>
    )}
    
    {!hasEnoughCredits && credits && (
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-4">
        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
           <Lock size={20} />
        </div>
        <div>
           <p className="text-yellow-100 text-sm font-bold">Saldo insuficiente</p>
           <p className="text-yellow-500/70 text-xs mt-0.5">Te faltan {totalCost - credits.available} créditos para generar este reporte.</p>
        </div>
      </div>
    )}
    
    <div>
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
         <Sparkles size={16} className="text-neon" /> Personalizar Alcance
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map(section => {
          const isSelected = selectedSections.includes(section.id);
          return (
            <motion.button
              key={section.id}
              onClick={() => onToggle(section.id)}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              className={`
                group relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 border
                ${isSelected 
                  ? 'bg-white/[0.03] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'bg-transparent border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                }
              `}
            >
              {isSelected && (
                 <motion.div 
                   layoutId="active-glow"
                   className="absolute inset-0 bg-emerald-500/5 rounded-xl" 
                   initial={false} 
                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
                 />
              )}

              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10 border
                ${isSelected 
                   ? 'bg-emerald-500 text-black border-emerald-400' 
                   : 'bg-white/5 text-slate-400 border-white/5 group-hover:border-white/20 group-hover:text-white'
                }
              `}>
                {isSelected ? <Check size={20} strokeWidth={3} /> : section.icon}
              </div>
              
              <div className="relative z-10">
                <p className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                   {section.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <p className="text-[10px] text-slate-500 font-medium bg-black/20 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                      {section.cost} créditos
                   </p>
                </div>
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
  <div className="py-12 space-y-8">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center"
      >
        <Loader2 className="w-10 h-10 text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-2">Generando tu reporte...</h3>
      <p className="text-slate-400">{currentStage}</p>
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">Progreso</span>
        <span className="text-emerald-400 font-semibold">{progress}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
    
    <p className="text-center text-slate-500 text-sm">
      Esto puede tomar 1-2 minutos. No cierres esta ventana.
    </p>
  </div>
);

const CompleteStep: React.FC<{
  report: GeneratedReport;
  onDownload: () => void;
  onOpenNew: () => void;
}> = ({ report, onDownload, onOpenNew }) => (
  <div className="py-8 space-y-6 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center"
    >
      <Check className="w-12 h-12 text-white" />
    </motion.div>
    
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">¡Reporte Listo! 🎉</h3>
      <p className="text-slate-400">
        Tu reporte profesional ha sido generado exitosamente.
      </p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={onDownload}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition"
      >
        <Download className="w-5 h-5" />
        Descargar HTML
      </button>
      <button
        onClick={onOpenNew}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition"
      >
        <ExternalLink className="w-5 h-5" />
        Abrir para Imprimir
      </button>
    </div>
    
    <p className="text-slate-500 text-sm">
      Créditos usados: {report.creditsUsed} • Generado: {new Date(report.generatedAt).toLocaleString()}
    </p>
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
