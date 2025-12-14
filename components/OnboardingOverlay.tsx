
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingOverlay = () => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Sequence Logic
    const timer1 = setTimeout(() => setStep(1), 1000); // Start Text 1
    const timer2 = setTimeout(() => setStep(2), 3500); // Text 1 Out, Text 2 In
    const timer3 = setTimeout(() => setStep(3), 6000); // Text 2 Out
    const timer4 = setTimeout(() => setIsVisible(false), 7000); // Remove Overlay

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: step === 3 ? 0 : 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center pointer-events-none"
    >
      <AnimatePresence mode='wait'>
        {step === 1 && (
          <motion.div
            key="text1"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-white font-bold text-3xl md:text-5xl tracking-widest uppercase text-center"
          >
            Bienvenido a la <span className="text-neon drop-shadow-[0_0_15px_rgba(0,255,148,0.5)]">nueva era</span>.
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            key="text2"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-white font-bold text-3xl md:text-5xl tracking-widest uppercase text-center"
          >
            Olvida lo que <span className="text-white/50 line-through decoration-neon decoration-2">sabes</span>.
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
    </motion.div>
  );
};
