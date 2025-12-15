import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Target, ArrowRight, CheckCircle2, ChevronRight, BarChart3, PieChart, TrendingUp, Activity, Plus, Play, Users, X, Search, FileText, MessageSquare, Cpu, Globe, Lock, Upload, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onClose: (action?: 'upload' | 'chat' | 'explore') => void;
}

// --- VISUAL COMPONENTS ---

const VoidBackground = ({ active }: { active: boolean }) => (
  <div className={`absolute inset-0 transition-opacity duration-[2000ms] ${active ? 'opacity-100' : 'opacity-0'}`}>
     <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
     </div>
  </div>
);

const ChoiceCard = ({ icon, title, desc, onClick, delay, gradient }: any) => (
  <motion.button
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, type: "spring" }}
    onClick={onClick}
    className="group relative w-full h-full text-left"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
    <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden">
       
       {/* Accents */}
       <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="text-white/20 group-hover:text-white transition-colors" />
       </div>

       <div>
         <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10">
            {icon}
         </div>
         <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon transition-colors">{title}</h3>
         <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">{desc}</p>
       </div>

       <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold group-hover:text-neon transition-colors">Iniciar</span>
          <div className="w-2 h-2 bg-slate-700 rounded-full group-hover:bg-neon group-hover:shadow-[0_0_10px_rgba(58,255,151,0.8)] transition-all"></div>
       </div>
    </div>
  </motion.button>
);

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<'blackout' | 'activation' | 'choices'>('blackout');

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
                 LA INCERTIDUMBRE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-300">HA MUERTO.</span>
              </h1>
              <p className="text-slate-500 text-sm tracking-[0.3em] uppercase">Bienvenido a la era de la certeza</p>
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
                  <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">¿Qué tienes hoy?</h2>
                  <p className="text-xl text-slate-400 font-light">Selecciona tu punto de partida. El sistema se adaptará.</p>
               </motion.div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[450px]">
                  <ChoiceCard 
                     icon={<FileText size={32} className="text-emerald-400" />}
                     title="Tengo un Archivo"
                     desc="Arrastra tu PDF, Word o Presentación caótica. VALID.AI extraerá la estructura, detectará huecos y generará un plan."
                     gradient="from-emerald-500/20 to-transparent"
                     delay={0.8}
                     onClick={() => onClose('upload')}
                  />
                  <ChoiceCard 
                     icon={<MessageSquare size={32} className="text-neon" />}
                     title="Tengo una Idea"
                     desc="Habla directamente con el Idea Studio. Describe tu visión en lenguaje natural y deja que la IA la convierta en estrategia."
                     gradient="from-neon/20 to-transparent"
                     delay={1.0}
                     onClick={() => onClose('chat')}
                  />
                  <ChoiceCard 
                     icon={<Compass size={32} className="text-purple-400" />}
                     title="Estoy Explorando"
                     desc="Navega por nuestra Galería de Plantillas curada. Modelos de SaaS, E-commerce y Servicios listos para usar."
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
                  Saltar Experiencia
               </motion.button>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
};
