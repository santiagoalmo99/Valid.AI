import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Binary, CheckCircle2, Cpu, Globe } from 'lucide-react';

interface VerificationScannerProps {
  onComplete: () => void;
}

export const VerificationScanner: React.FC<VerificationScannerProps> = ({ onComplete }) => {
  const [steps, setSteps] = useState([
    { id: 1, text: "Estableciendo conexión segura (TLS 1.3)...", status: "pending" },
    { id: 2, text: "Verificando firma criptográfica...", status: "pending" },
    { id: 3, text: "Desencriptando hash de validación...", status: "pending" },
    { id: 4, text: "Consultando motor de inteligencia VALID.AI...", status: "pending" }
  ]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cinematic Sequence
    const runSequence = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Mark current as running
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: "running" } : s));
        
        // Random duration for "realism"
        await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
        
        // Mark as done
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: "done" } : s));
        
        // Update progress bar
        setProgress(((i + 1) / steps.length) * 100);
      }
      
      // Final pause for dramatic effect
      await new Promise(r => setTimeout(r, 500));
      onComplete();
    };

    runSequence();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[999] flex flex-col items-center justify-center font-mono">
      {/* Background Matrix Effect (Simplified) */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-[200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-slide-down"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        {/* LOGO SCANNER */}
        <div className="flex justify-center mb-12">
           <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-neon/30 flex items-center justify-center animate-spin-slow">
                 <div className="w-20 h-20 rounded-full border border-neon/50 border-dashed animate-reverse-spin"></div>
              </div>
              <Shield size={40} className="text-neon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              
              {/* Scan Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-neon/80 shadow-[0_0_15px_#00FF94] animate-scan"></div>
           </div>
        </div>

        {/* TERMINAL OUTPUT */}
        <div className="space-y-4 mb-8">
            {steps.map((step) => (
               <div key={step.id} className="flex items-center gap-3 text-xs">
                  <div className="w-4 flex justify-center">
                     {step.status === 'pending' && <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>}
                     {step.status === 'running' && <div className="w-3 h-3 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>}
                     {step.status === 'done' && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                  <span className={`${
                     step.status === 'pending' ? 'text-slate-600' :
                     step.status === 'running' ? 'text-neon animate-pulse' :
                     'text-emerald-400'
                  }`}>
                     {step.text}
                  </span>
               </div>
            ))}
        </div>

        {/* PROGRESS BAR */}
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-neon shadow-[0_0_10px_#00FF94]"
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
             transition={{ ease: "linear" }}
           />
        </div>
        <div className="text-right text-[10px] text-neon mt-2">
           SYSTEM INTEGRITY: {Math.round(progress)}%
        </div>

        <div className="absolute bottom-8 left-0 w-full text-center text-[8px] text-slate-700 uppercase tracking-[0.3em]">
           SECURE • ENCRYPTED • IMMUTABLE
        </div>
      </div>
    </div>
  );
};
