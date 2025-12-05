import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Target, ArrowRight, CheckCircle2, ChevronRight, BarChart3, PieChart, TrendingUp, Activity, Plus, Play, Users, X, Search, FileText, MessageSquare, Cpu, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onClose: () => void;
}

// --- HOLOGRAPHIC WIDGETS ---

const HoloCard = ({ children, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="relative bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon/50 to-transparent"></div>
    {children}
  </motion.div>
);

const DataStream = () => (
  <div className="flex flex-col gap-2 p-4 h-60 overflow-hidden relative">
    {[...Array(10)].map((_, i) => (
      <motion.div 
        key={i}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
        className="flex items-center gap-2 text-xs font-mono text-neon/70"
      >
        <span className="w-2 h-2 bg-neon rounded-full"></span>
        <span>0x{Math.random().toString(16).substr(2, 8).toUpperCase()}</span>
        <span className="text-white/30">PROCESSING NODE {i}</span>
      </motion.div>
    ))}
    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent"></div>
  </div>
);

const NeuralNode = () => (
  <div className="relative w-full h-60 flex items-center justify-center">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute w-48 h-48 border border-neon/20 rounded-full border-dashed"
    />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute w-36 h-36 border border-blue-500/20 rounded-full border-dotted"
    />
    <motion.div 
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center border border-neon shadow-[0_0_20px_rgba(223,255,0,0.3)]"
    >
      <Cpu size={32} className="text-neon" />
    </motion.div>
    
    {/* Connecting Lines */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-24 bg-gradient-to-b from-neon/50 to-transparent origin-bottom"
        style={{ rotate: deg, bottom: '50%' }}
        initial={{ height: 0 }}
        animate={{ height: 96 }}
        transition={{ delay: i * 0.1, duration: 1 }}
      />
    ))}
  </div>
);

const MarketScanner = () => (
  <div className="w-full h-60 p-4 flex items-end justify-between gap-2 relative">
    <div className="absolute top-4 right-4 text-xs text-neon font-mono animate-pulse">LIVE FEED</div>
    {[...Array(16)].map((_, i) => (
      <motion.div
        key={i}
        className="w-full bg-emerald-500/20 rounded-t-sm relative overflow-hidden"
        initial={{ height: '10%' }}
        animate={{ height: [`${Math.random() * 40 + 10}%`, `${Math.random() * 90 + 10}%`] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
      >
        <div className="absolute top-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_10px_#34d399]"></div>
      </motion.div>
    ))}
    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none"></div>
  </div>
);

const VerdictScanner = () => (
  <div className="w-full h-60 flex items-center justify-center relative overflow-hidden">
    {/* Scanning Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>

    {/* Outer Rotating Ring */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute w-48 h-48 rounded-full border border-amber-500/30 border-t-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
    />

    {/* Inner Counter-Rotating Ring */}
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      className="absolute w-36 h-36 rounded-full border-2 border-dashed border-white/20"
    />

    {/* Central Core */}
    <div className="relative z-10 flex flex-col items-center justify-center">
       <motion.div
         animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="w-24 h-24 bg-amber-500/10 rounded-full border border-amber-500/50 flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(245,158,11,0.4)]"
       >
          <Zap className="text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" size={40} />
       </motion.div>
       <div className="mt-4 text-amber-400 font-mono text-xs tracking-[0.2em] font-bold animate-pulse">
          CALCULATING...
       </div>
    </div>

    {/* Scanning Line */}
    <motion.div
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 right-0 h-[2px] bg-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.8)]"
    />
  </div>
);

const STEPS = [
  {
    id: 1,
    title: <>Inteligencia <span className="text-neon font-extrabold drop-shadow-[0_0_15px_rgba(223,255,0,0.6)] animate-shimmer">Artificial</span> de Grado Militar</>,
    desc: "VALID.AI no es un juguete. Es un motor de procesamiento de lenguaje natural calibrado para diseccionar modelos de negocio con frialdad algorítmica.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", // AI Core (Abstract Chip/Data)
    icon: <Cpu className="text-neon" size={32} />,
    widget: <NeuralNode />
  },
  {
    id: 2,
    title: <>Validación de Mercado <span className="text-emerald-400 font-extrabold drop-shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-shimmer">En Tiempo Real</span></>,
    desc: "Detecta señales de compra y fricción oculta. Nuestro scanner de patrones convierte conversaciones vagas en métricas de viabilidad financiera.",
    image: "/images/market_validation.png", // Market Data
    icon: <Activity className="text-emerald-400" size={32} />,
    widget: <MarketScanner />
  },
  {
    id: 3,
    title: <>Protocolo de <span className="text-purple-400 font-extrabold drop-shadow-[0_0_15px_rgba(192,132,252,0.6)] animate-shimmer">Deep Research</span></>,
    desc: "Ejecuta un Due Diligence automatizado. La IA cruza tus datos con benchmarks globales para entregarte un veredicto de inversión innegable.",
    image: "/images/deep_research.png", // Deep Research
    icon: <Lock className="text-purple-400" size={32} />,
    widget: <DataStream />
  },
  // TUTORIAL STEPS (Refined)
  {
    id: 4,
    title: <>Fase 1: <span className="text-white font-extrabold animate-shimmer">Inyección de Contexto</span></>,
    desc: "Define los parámetros de la misión. Nombre, Región, Tipo de Producto. Cuanto más precisos sean los datos, más letal será el análisis.",
    image: "/images/context_injection.png", // Context Injection
    icon: <Plus className="text-white" size={32} />,
    widget: (
      <div className="p-4 space-y-3">
         <div className="h-2 w-1/3 bg-slate-700 rounded-full animate-pulse"></div>
         <div className="h-10 w-full bg-white/5 border border-white/10 rounded-lg flex items-center px-3 text-neon font-mono text-xs">
            &gt; PROJECT_INIT: BIOHACKING_V1_
         </div>
      </div>
    )
  },
  {
    id: 5,
    title: <>Fase 2: <span className="text-neon font-extrabold animate-shimmer">Extracción de Datos</span></>,
    desc: "Despliega el módulo de entrevistas. La IA interrogará a tus usuarios potenciales, adaptando dinámicamente las preguntas para exponer la verdad.",
    image: "/images/data_extraction.png", // Data Extraction
    icon: <MessageSquare className="text-neon" size={32} />,
    widget: (
      <div className="p-4 flex flex-col gap-2">
         <div className="self-start bg-neon/20 text-neon text-[10px] p-2 rounded-r-lg rounded-bl-lg font-mono border border-neon/30">
            &gt; ANALYZING PAIN POINTS...
         </div>
         <div className="self-end bg-white/10 text-slate-300 text-[10px] p-2 rounded-l-lg rounded-br-lg font-mono">
            "Es demasiado costoso y lento..."
         </div>
      </div>
    )
  },
  {
    id: 6,
    title: <>Fase 3: <span className="text-amber-400 font-extrabold animate-shimmer">Veredicto Final</span></>,
    desc: "Accede al Dashboard. Si cumples los requisitos (Perfil 100% + 5 Entrevistas), desbloquearás el Reporte de Viabilidad y Estrategia.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", // Verdict
    icon: <Zap className="text-amber-400" size={32} />,
    widget: <VerdictScanner />
  }
];

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      onClose();
    }
  };

  const currentStep = STEPS[step];
  const isAlternateLayout = step >= 3; // Steps 4, 5, 6 (Indices 3, 4, 5)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container - Hyper Glass & Rounded */}
      <div className="w-full max-w-7xl h-[85vh] bg-void/80 backdrop-blur-2xl border border-white/10 rounded-[48px] overflow-hidden relative flex shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        
        {/* Background Noise/Gradient (Subtle) */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon/5 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]"></div>
        </div>

        <div className={`w-full h-full flex ${isAlternateLayout ? 'flex-row-reverse' : 'flex-row'} relative z-10`}>
          
          {/* Visual Box (Image + Widget) */}
          <div className="hidden md:flex w-1/2 p-6 relative">
             <div className="w-full h-full relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
                {/* Image Background */}
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentStep.id}
                    src={currentStep.image}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  />
                </AnimatePresence>
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                {/* Widget Container - Centered and Larger */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                   <HoloCard key={step}>
                      <div className="w-[500px] bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                         {currentStep.widget}
                      </div>
                   </HoloCard>
                </div>
             </div>
          </div>

          {/* Content Box */}
          <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
             <motion.div
               key={step}
               initial={{ opacity: 0, x: isAlternateLayout ? 20 : -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5 }}
             >
               <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  {currentStep.icon}
               </div>
               
               <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                 {currentStep.title}
               </h2>
               <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed font-light max-w-lg">
                 {currentStep.desc}
               </p>

               <div className="flex gap-4">
                 <button 
                   onClick={handleNext}
                   className="px-10 py-5 bg-neon text-black font-bold rounded-2xl hover:bg-white transition-all hover:scale-105 shadow-[0_0_25px_rgba(223,255,0,0.4)] flex items-center gap-3 text-lg"
                 >
                   {step === STEPS.length - 1 ? 'INICIAR SISTEMA' : 'SIGUIENTE'} <ArrowRight size={24} />
                 </button>
                 {step < STEPS.length - 1 && (
                   <button onClick={onClose} className="px-8 py-5 text-slate-400 hover:text-white font-medium text-sm hover:bg-white/5 rounded-2xl transition-colors">
                     Saltar Intro
                   </button>
                 )}
               </div>
             </motion.div>

             {/* Progress Bar */}
             <div className="absolute bottom-12 left-12 md:left-20 right-12 flex gap-3">
               {STEPS.map((_, i) => (
                 <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-16 bg-neon shadow-[0_0_10px_rgba(223,255,0,0.5)]' : 'w-4 bg-white/10'}`} />
               ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
