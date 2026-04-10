import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Target, ArrowRight, CheckCircle2, ChevronRight, BarChart3, PieChart, TrendingUp, Activity, Plus, Play, Users, X, Search, FileText, MessageSquare, Cpu, Globe, Lock, Upload, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onClose: (action?: 'upload' | 'chat' | 'explore') => void;
  lang?: 'en' | 'es';
}

// ... Visual Components ... (ChoiceCard updated to receive lang if needed, but we'll use t here)

export const Onboarding: React.FC<OnboardingProps> = ({ onClose, lang = 'en' }) => {
  const [phase, setPhase] = useState<'blackout' | 'activation' | 'choices'>('blackout');

  const t = lang === 'en' ? {
    introTitle: "UNCERTAINTY",
    introSubtitle: "IS DEAD.",
    introCaption: "Welcome to the era of certainty",
    title: "What do you have today?",
    subtitle: "Select your starting point. The engine will recalibrate.",
    docTitle: "Strategic Asset",
    docDesc: "Import your PDF, Pitch Deck, or chaotic Whitepaper. VALID.AI will synthesize the structure and identify gaps.",
    ideaTitle: "Visionary Seed",
    ideaDesc: "Speak directly with the Idea Studio. Describe your vision and let the AI convert it into a clinical audit protocol.",
    exploreTitle: "Market Research",
    exploreDesc: "Browse our curated Sector Gallery. Mature SaaS, E-commerce, and B2B models ready for deployment.",
    skip: "Skip Introduction"
  } : {
    introTitle: "LA INCERTIDUMBRE",
    introSubtitle: "HA MUERTO.",
    introCaption: "Bienvenido a la era de la certeza",
    title: "¿Qué tienes hoy?",
    subtitle: "Selecciona tu punto de partida. El sistema se adaptará.",
    docTitle: "Archivo Estratégico",
    docDesc: "Arrastra tu PDF, Word o Presentación caótica. VALID.AI extraerá la estructura y detectará huecos.",
    ideaTitle: "Semilla de Visión",
    ideaDesc: "Habla directamente con el Idea Studio. Describe tu visión en lenguaje natural y deja que la IA la convierta en estrategia.",
    exploreTitle: "Investigación de Mercado",
    exploreDesc: "Navega por nuestra Galería de Sectores curada. Modelos de SaaS, E-commerce y Servicios listos.",
    skip: "Saltar Experiencia"
  };

  useEffect(() => {
    // Phase 1: Blackout (Warning Text)
    const t1 = setTimeout(() => {
       setPhase('activation');
    }, 2500);

    // Phase 2: Activation (Animation) to Choices
    const t2 = setTimeout(() => {
       setPhase('choices');
    }, 4500);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden font-sans">
      
      {/* PHASE 1: BLACKOUT INTRO */}
      <AnimatePresence>
        {phase === 'blackout' && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
           >
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 text-center">
                 {t.introTitle} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-300">{t.introSubtitle}</span>
              </h1>
              <p className="text-slate-500 text-sm tracking-[0.3em] uppercase">{t.introCaption}</p>
           </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND & AMBIANCE */}
      <VoidBackground active={phase !== 'blackout'} />

      {/* PHASE 3: CHOICES */}
      <AnimatePresence>
         {phase === 'choices' && (
            <motion.div 
               className="relative z-10 w-full max-w-7xl px-6"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1 }}
            >
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="text-center mb-16"
               >
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tighter">{t.title}</h2>
                  <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">{t.subtitle}</p>
               </motion.div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[450px]">
                  <ChoiceCard 
                     icon={<FileText size={32} className="text-emerald-400" />}
                     title={t.docTitle}
                     desc={t.docDesc}
                     gradient="from-emerald-500/20 to-transparent"
                     delay={0.8}
                     onClick={() => onClose('upload')}
                  />
                  <ChoiceCard 
                     icon={<MessageSquare size={32} className="text-neon" />}
                     title={t.ideaTitle}
                     desc={t.ideaDesc}
                     gradient="from-neon/20 to-transparent"
                     delay={1.0}
                     onClick={() => onClose('chat')}
                  />
                  <ChoiceCard 
                     icon={<Compass size={32} className="text-purple-400" />}
                     title={t.exploreTitle}
                     desc={t.exploreDesc}
                     gradient="from-purple-500/20 to-transparent"
                     delay={1.2}
                     onClick={() => onClose('explore')}
                  />
               </div>
               
               <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  onClick={() => onClose()}
                  className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-slate-500 text-xs uppercase tracking-widest hover:text-white transition-colors"
               >
                  {t.skip}
               </motion.button>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
};
