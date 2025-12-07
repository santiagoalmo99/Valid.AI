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

  // MARKET VALUE SIMULATION (Anchoring)
  // 1 Credit ~ $2.5 USD value
  const marketValueAmount = totalCost * 2.5; 
  
  const formattedMarketValue = currency === 'USD' 
    ? `$${marketValueAmount.toFixed(0)} USD` 
    : `$${(marketValueAmount * 4100).toLocaleString('es-CO')} COP`;

  return (
  <div className="space-y-8 animate-fade-in">
    {/* PREMIUM VALUE CARD */}
    <div className="bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-2xl">
       {/* Background Effects */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
       
       <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <h3 className="text-white font-bold text-lg">Resumen de Inversión</h3>
                   <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wide">
                      BETA GRATUITO
                   </span>
                </div>
                <p className="text-slate-400 text-sm max-w-sm">
                   Genera reportes de nivel consultoría estratégica utilizando tus créditos de cortesía.
                </p>
             </div>
             
             {/* Sleek Currency Toggle */}
             <div className="bg-white/5 p-1 rounded-lg border border-white/5 flex">
                <button 
                  onClick={() => setCurrency('USD')} 
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${currency === 'USD' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   USD
                </button>
                <button 
                  onClick={() => setCurrency('COP')} 
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${currency === 'COP' ? 'bg-white/10 text-white shadow-sm border border-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   COP
                </button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
             <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Valor Comercial Estimado</p>
                <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
                   {formattedMarketValue}
                   <span className="text-xs text-slate-500 font-normal opacity-50 block sm:inline">precio de mercado</span>
                </div>
             </div>
             
             <div className="flex items-center justify-between bg-emerald-900/10 rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                   </div>
                   <div>
                      <p className="text-emerald-400 font-bold text-sm">Costo en Créditos</p>
                      <p className="text-[10px] text-emerald-300/70">Incluido en tu saldo inicial</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-bold text-white">{totalCost}</div>
                   <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Créditos</div>
                </div>
             </div>
          </div>
       </div>
    </div>
    
    {error && (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-shake">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-red-300 text-sm font-medium">{error}</p>
      </div>
    )}
    
    {!hasEnoughCredits && credits && (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
        <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
        <div>
           <p className="text-yellow-400 text-sm font-bold">Saldo insuficiente</p>
           <p className="text-yellow-300/80 text-xs">Necesitas {totalCost - credits.available} créditos adicionales.</p>
        </div>
      </div>
    )}
    
    <div>
      <div className="flex justify-between items-end mb-4">
         <h3 className="text-lg font-bold text-white">Configuración del Reporte</h3>
         <span className="text-xs text-slate-500">Selecciona las secciones a generar</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sections.map(section => {
          const isSelected = selectedSections.includes(section.id);
          return (
            <button
              key={section.id}
              onClick={() => onToggle(section.id)}
              className={`
                group flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${isSelected 
                   ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-100' 
                   : 'bg-white/5 text-slate-500 group-hover:scale-110'
                }
              `}>
                {isSelected ? <Check className="w-5 h-5" /> : section.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <span className={`font-semibold transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {section.titleEs}
                   </span>
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors ${
                      isSelected 
                         ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' 
                         : 'text-slate-600 border-white/5 bg-white/5'
                   }`}>
                      {section.creditCost} CR
                   </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed group-hover:text-slate-400 transition-colors">
                   {section.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
    
  </div>
  );
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
    
    {/* Progress bar - Zeigarnik Effect */}
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
    {/* Success animation */}
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

// ============ CONFETTI EFFECT ============

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
