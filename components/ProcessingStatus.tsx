import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, BrainCircuit, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProcessingStatusProps {
  loading: boolean;
  steps?: string[];
  onComplete?: () => void;
  className?: string;
  delayPerStep?: number;
}

const DEFAULT_STEPS = [
  "Iniciando Motor Cuántico de Validación...",
  "Analizando Semántica y Contexto...",
  "Detectando Sesgos Cognitivos...",
  "Simulando Entrevistas con 'The Mom Test'...",
  "Calculando Dimensiones de Viabilidad...",
  "Generando Hipótesis de Mercado...",
  "Sintetizando Resultados..."
];

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  loading,
  steps = DEFAULT_STEPS,
  onComplete,
  className = '',
  delayPerStep = 1500
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (!loading) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setShowComplete(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps((done) => [...done, steps[prev]]);
          return prev + 1;
        } else {
          clearInterval(interval);
          setShowComplete(true);
          if (onComplete) setTimeout(onComplete, 1000);
          return prev;
        }
      });
    }, delayPerStep);

    return () => clearInterval(interval);
  }, [loading, steps, delayPerStep, onComplete]);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-xl ${className}`}
    >
      <div className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-neon/20 blur-xl rounded-full animate-pulse" />
            <BrainCircuit className="text-neon relative z-10 animate-spin-slow" size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
              Procesando Inteligencia
            </h2>
            <p className="text-neon/80 font-mono text-sm">
              VALID.AI NETWORK LINK:: ESTABLECIDO
            </p>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="bg-black border border-white/10 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(58,255,151,0.1)] font-mono text-sm">
          {/* Terminal Header */}
          <div className="bg-white/5 p-2 flex gap-2 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
            <div className="flex-1 text-center text-xs text-slate-600">analysis_log.exe</div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 h-64 overflow-y-auto flex flex-col justify-end">
            <div className="space-y-2">
              {completedSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.5, x: 0 }}
                  className="flex items-center gap-3 text-neon/50"
                >
                  <CheckCircle2 size={14} />
                  <span>{step}</span>
                  <span className="ml-auto text-xs text-slate-700">[OK]</span>
                </motion.div>
              ))}

              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-neon font-bold"
              >
                <Terminal size={14} className="animate-pulse" />
                <span className="typewriter">{steps[currentStepIndex]}</span>
                <span className="ml-auto text-xs text-neon animate-pulse">[PROCESSING]</span>
              </motion.div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1 bg-white/10 w-full">
            <motion.div 
               className="h-full bg-neon shadow-[0_0_10px_rgba(58,255,151,0.8)]"
               initial={{ width: "0%" }}
               animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
               transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Footer Quote */}
        <p className="text-center text-slate-500 text-xs mt-6 italic">
          "La verdad duele, pero la incertidumbre mata."
        </p>
      </div>
    </motion.div>
  );
};
