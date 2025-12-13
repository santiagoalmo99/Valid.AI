// VALID.AI Landing Page - Enhanced with Cascade Intelligence & Smart Widgets
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Play, Sparkles, Zap, Brain, Shield, 
  BarChart, Lock, Activity, Server, MessageSquare, FileText, 
  Target, Lightbulb, TrendingUp, ChevronRight, Smartphone, Layers,
  Clock, DollarSign, Calculator, Sliders, Database, Cpu, Eye,
  FileUp, Scan, LayoutTemplate, MousePointer2, X, Mail, User, Briefcase,
  ShoppingCart, Heart, Wallet, GraduationCap, Store, Upload, Mic, Globe, LockKeyhole
} from 'lucide-react';
import { saveLead } from '../services/firebase';

// --- ANIMATION UTILS ---
const springTransition = { type: "spring", stiffness: 100, damping: 20, mass: 1 };

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ ...springTransition, delay }}
  >
    {children}
  </motion.div>
);

// --- COMPONENTS ---

const GlassCard = ({ children, className = "", glow = false }: { children: React.ReactNode, className?: string, glow?: boolean }) => (
  <div className={`relative overflow-hidden bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 ${glow ? 'shadow-[0_0_40px_rgba(58,255,151,0.1)]' : ''} ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

// --- LEAD CAPTURE MODAL ---
const LeadCaptureModal = ({ isOpen, onClose, onComplete }: { isOpen: boolean, onClose: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', stage: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await saveLead({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      stage: formData.stage,
      createdAt: new Date()
    });
    
    localStorage.setItem('valid_ai_lead', JSON.stringify(formData));
    
    setStep(2);
    setTimeout(() => {
      onComplete();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[40px] p-10 relative overflow-hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={24} />
            </button>

            {step === 1 ? (
              <>
                <div className="mb-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon/30 to-emerald-500/30 mb-6">
                    <Sparkles size={28} className="text-neon" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Acceso Exclusivo</h3>
                  <p className="text-white/60 text-sm">Únete a la élite de fundadores que validan con ciencia.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">Nombre</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input 
                        required
                        type="text" 
                        placeholder="Tu nombre"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-neon/50 focus:outline-none focus:ring-2 focus:ring-neon/20 transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input 
                        required
                        type="email" 
                        placeholder="tu@empresa.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-neon/50 focus:outline-none focus:ring-2 focus:ring-neon/20 transition-all"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">¿Cuál es tu rol?</label>
                    <select 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-neon/50 focus:outline-none transition-all appearance-none"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="" className="bg-black">Selecciona...</option>
                      <option value="founder" className="bg-black">Fundador / CEO</option>
                      <option value="product" className="bg-black">Product Manager</option>
                      <option value="investor" className="bg-black">Inversionista</option>
                      <option value="other" className="bg-black">Innovador / Otro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">¿En qué etapa está tu idea?</label>
                    <select 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-neon/50 focus:outline-none transition-all appearance-none"
                      value={formData.stage}
                      onChange={e => setFormData({...formData, stage: e.target.value})}
                    >
                      <option value="" className="bg-black">Selecciona...</option>
                      <option value="idea" className="bg-black">Solo una idea</option>
                      <option value="mvp" className="bg-black">Tengo un MVP</option>
                      <option value="product" className="bg-black">Producto lanzado</option>
                      <option value="scaling" className="bg-black">Buscando escalar</option>
                    </select>
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform mt-6 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSaving ? 'Guardando...' : 'Desbloquear Acceso'} <ArrowRight size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-16">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-br from-neon to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle size={48} className="text-black" />
                </motion.div>
                <h3 className="text-4xl font-bold text-white mb-3">¡Acceso Concedido!</h3>
                <p className="text-white/60">Preparando tu experiencia...</p>
                <div className="mt-8 flex justify-center gap-2">
                  <div className="w-3 h-3 bg-neon rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-neon rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-neon rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- INTERACTIVE WIDGETS ---

const ValidationSimulator = () => {
  const [intensity, setIntensity] = useState(8); 
  const [wtp, setWtp] = useState(7); 
  const [fit, setFit] = useState(9); 
  const [earlyAdopter, setEarlyAdopter] = useState(6); 
  
  const score = Math.round((intensity * 2.5) + (wtp * 2.5) + (fit * 2.0) + (earlyAdopter * 1.5) + 15);
  
  const getScoreColor = (s: number) => {
    if (s >= 70) return "text-neon";
    if (s >= 40) return "text-yellow-400";
    return "text-red-500";
  };

  const getVerdict = (s: number) => {
    if (s >= 70) return "GO";
    if (s >= 40) return "PIVOT";
    return "NO GO";
  };

  return (
    <GlassCard className="p-8" glow>
      <div className="mb-6">
        <h3 className="text-white font-semibold text-xl mb-1">Motor de Validación</h3>
        <p className="text-white/50 text-sm">Mueve los deslizadores para simular el análisis.</p>
      </div>

        <IntensityGauge value={intensity} onChange={setIntensity} />
        <FinancialSelector value={wtp} onChange={setWtp} />
        
        {/* Remaining Standard Sliders */}
        {[
          { label: "Ajuste de Solución", val: fit, set: setFit, icon: Target },
          { label: "Perfil Early Adopter", val: earlyAdopter, set: setEarlyAdopter, icon: Zap }
        ].map((item, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-white/80 flex items-center gap-2"><item.icon size={14} className="text-neon"/> {item.label}</span>
              <span className="text-white font-mono">{item.val}/10</span>
            </div>
            <input 
              type="range" min="0" max="10" step="1"
              value={item.val} onChange={(e) => item.set(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon"
            />
          </div>
        ))}

      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Score</div>
          <div className={`text-5xl font-bold tracking-tighter ${getScoreColor(score)}`}>
            {Math.min(100, score)}
          </div>
        </div>
        <div className={`px-5 py-2.5 rounded-full ${score >= 70 ? 'bg-neon/20 text-neon' : score >= 40 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-red-500/20 text-red-500'} font-bold text-sm tracking-widest uppercase`}>
          {getVerdict(score)}
        </div>
      </div>
    </GlassCard>
  );
};

// --- CUSTOM WIDGETS ---

const IntensityGauge = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  return (
    <div className="space-y-2 mb-6">
       <div className="flex justify-between text-sm font-medium">
          <span className="text-white/80 flex items-center gap-2"><Activity size={14} className="text-neon"/> Intensidad del Dolor</span>
          <span className={`font-mono font-bold ${value > 7 ? 'text-red-500' : value > 4 ? 'text-yellow-400' : 'text-emerald-400'}`}>
             {value > 7 ? 'CRÍTICO' : value > 4 ? 'MODERADO' : 'LEVE'} ({value}/10)
          </span>
       </div>
       <div className="relative h-6 bg-white/5 rounded-full p-1 cursor-pointer group">
          <input 
             type="range" min="0" max="10" step="1"
             value={value} onChange={(e) => onChange(Number(e.target.value))}
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-600 opacity-30"></div>
          <motion.div 
             className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-0 rounded-full"
             animate={{ left: `${value * 10}%` }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
       </div>
    </div>
  );
};

const FinancialSelector = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  // Mapping simplistic 0-10 range to money values for visual logic only, 
  // keeping the internal state consistent with the simulator logic standard (0-10)
  const options = [
    { label: "$0", score: 0 },
    { label: "$10", score: 3 },
    { label: "$50", score: 5 },
    { label: "$100", score: 7 },
    { label: "$500+", score: 10 }
  ];

  return (
    <div className="space-y-2 mb-6">
       <div className="flex justify-between text-sm font-medium">
          <span className="text-white/80 flex items-center gap-2"><DollarSign size={14} className="text-neon"/> Disposición a Pagar</span>
       </div>
       <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {options.map((opt) => (
             <button
                key={opt.label}
                onClick={() => onChange(opt.score)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                   value >= opt.score - 1 && value <= opt.score + 1 // Approximate matching for the simplified 5-step UI vs 10-step logic
                   ? 'bg-neon text-black shadow-[0_0_15px_rgba(58,255,151,0.4)]' 
                   : 'text-white/40 hover:bg-white/10'
                }`}
             >
                {opt.label}
             </button>
          ))}
       </div>
    </div>
  );
};

// --- MAIN PAGE ---

export const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLaunch = () => {
    const lead = localStorage.getItem('valid_ai_lead');
    if (lead) {
      window.location.href = '/';
    } else {
      setShowModal(true);
    }
  };

  const handleModalComplete = () => {
    window.location.href = '/';
  };

  const templates = [
    { name: 'SaaS B2B', icon: Server, desc: 'Software empresarial' },
    { name: 'E-commerce', icon: ShoppingCart, desc: 'Tienda online' },
    { name: 'HealthTech', icon: Heart, desc: 'Salud y bienestar' },
    { name: 'FinTech', icon: Wallet, desc: 'Finanzas digitales' },
    { name: 'EdTech', icon: GraduationCap, desc: 'Educación' },
    { name: 'Marketplace', icon: Store, desc: 'Plataforma multi-vendor' }
  ];

  return (
    <div className="bg-[#000000] text-[#f5f5f7] font-sans selection:bg-neon/30 selection:text-white overflow-x-hidden relative">
      
      <LeadCaptureModal isOpen={showModal} onClose={() => setShowModal(false)} onComplete={handleModalComplete} />

      {/* --- ANIMATED BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[90vw] h-[90vw] bg-emerald-500/10 rounded-full blur-[120px] animate-chaos-slow mix-blend-screen"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-blue-600/10 rounded-full blur-[140px] animate-chaos-slow mix-blend-screen" style={{animationDelay: '-5s', animationDirection: 'reverse'}}></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl pointer-events-auto transition-all hover:scale-105">
          <span className="font-semibold text-sm tracking-tight">Valid.AI</span>
          <div className="w-px h-4 bg-white/20"></div>
          <button onClick={handleLaunch} className="text-xs font-medium text-white hover:text-neon transition-colors">
            Lanzar App
          </button>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-6xl mx-auto"
        >
            <div className="mb-8 flex justify-center">
             <div className="px-6 py-2 rounded-full border border-neon/50 bg-neon/10 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,148,0.3)] animate-pulse-slow">
              <Sparkles size={14} className="text-neon" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">Cascade Intelligence</span>
              <span className="text-[10px] text-white/60">Claude + Gemini 2.5</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[11rem] font-semibold tracking-tighter mb-8 leading-[0.85]">
            <span className="text-white">Analista de VC</span> <br/>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-neon via-emerald-400 to-neon bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(58,255,151,0.5)]">
                Digital.
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-medium text-white/60 max-w-3xl mx-auto mt-8 leading-relaxed">
            No es solo una encuesta. Es un motor de validación científica que combina <span className="text-white">The Mom Test</span> con la potencia de <span className="text-white">Google Gemini</span>.
          </p>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
             <button onClick={handleLaunch} className="px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Validar mi Idea
             </button>
          </div>
        </motion.div>
      </section>

      {/* --- NEW: VOICE INTELLIGENCE --- */}
      <section className="py-32 px-6 relative z-10 border-t border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
               <div className="relative">
                  {/* Pulse Effect */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
                  
                  <GlassCard className="h-[400px] flex flex-col items-center justify-center relative overflow-hidden group" glow>
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                     
                     <div className="w-24 h-24 rounded-full bg-black border border-neon/30 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-neon/20 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 bg-neon/10 rounded-full animate-pulse"></div>
                        <Mic size={40} className="text-neon relative z-10" />
                     </div>
                     
                     {/* Sound Wave Simulation */}
                     <div className="flex gap-1 mt-8 h-8 items-center">
                        {[...Array(10)].map((_, i) => (
                           <div key={i} className="w-1 bg-neon/50 rounded-full animate-sound-wave" style={{
                              height: Math.random() * 30 + 10 + 'px',
                              animationDelay: i * 0.1 + 's'
                           }}></div>
                        ))}
                     </div>
                     <div className="mt-4 text-xs font-mono text-neon uppercase tracking-widest animate-pulse">
                        Escuchando...
                     </div>
                  </GlassCard>
               </div>
            </Reveal>

            <Reveal delay={0.2}>
               <div>
                  <div className="mb-4 text-neon font-mono text-xs uppercase tracking-widest">Nueva Función</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     No escribas. <br/>
                     <span className="text-white/50">Solo habla.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     La inspiración no espera al teclado. Hemos integrado un motor de <strong>Latenica Ultra-Baja</strong> que captura tus ideas al vuelo.
                  </p>
                  <ul className="space-y-6">
                     <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                           <Mic size={20} className="text-neon" />
                        </div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Entrevistas Híbridas</h4>
                           <p className="text-sm text-white/50">Responde a tu consultor de IA con tu voz. Capturamos el tono, la duda y la emoción.</p>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                           <Zap size={20} className="text-purple-400" />
                        </div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Dictado de Ideas</h4>
                           <p className="text-sm text-white/50">Camina y habla. Baja tu idea de la nube a la tierra en segundos.</p>
                        </div>
                     </li>
                  </ul>
               </div>
            </Reveal>
         </div>
      </section>

      {/* --- NEW: GLOBAL TRENDS --- */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <Reveal>
               <div>
                  <div className="mb-4 text-blue-400 font-mono text-xs uppercase tracking-widest">Inteligencia Web</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     El Ojo Que <br/>
                     <span className="text-white/50">Todo Lo Ve.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     Tu competencia usa datos del año pasado. Tú usas datos de <strong>HOY</strong>.
                     Hemos conectado el cerebro de Gemini al buscador de Google en tiempo real.
                  </p>
                  
                  <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-8">
                     <div className="flex items-center gap-3 mb-2">
                        <Globe size={18} className="text-blue-400" />
                        <span className="text-blue-400 font-bold text-sm">Google Search Grounding</span>
                     </div>
                     <p className="text-sm text-white/70">
                        "Detectando picos de interés en 'SaaS B2B' en la última semana..."
                     </p>
                  </div>
               </div>
            </Reveal>

            <Reveal delay={0.2}>
               <GlassCard className="h-[450px] relative overflow-hidden" glow>
                   {/* Abstract Map Background */}
                   <img 
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop" 
                      className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" 
                      alt="Earth"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>

                   {/* Floating Trend Cards */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
                      {[ 
                         { topic: "AI Agents", growth: "+450%", color: "text-emerald-400" },
                         { topic: "Sustainable Tech", growth: "+120%", color: "text-blue-400" },
                         { topic: "No-Code Tools", growth: "+85%", color: "text-purple-400" }
                      ].map((trend, i) => (
                         <div key={i} className="mb-3 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl flex justify-between items-center transform hover:scale-105 transition-transform cursor-default shadow-lg">
                            <span className="text-white font-bold">{trend.topic}</span>
                            <div className="flex items-center gap-2">
                               <TrendingUp size={14} className={trend.color} />
                               <span className={`text-sm font-mono ${trend.color}`}>{trend.growth}</span>
                            </div>
                         </div>
                      ))}
                   </div>
               </GlassCard>
            </Reveal>

         </div>
      </section>

      {/* --- THE VOID ENGINE --- */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="lg:sticky lg:top-40">
              <div className="mb-4 text-neon font-mono text-xs uppercase tracking-widest">Arquitectura</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                The Void Engine. <br/>
                <span className="text-white/50">Potencia Bruta.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Construido sobre una arquitectura resiliente y estética. Combina la velocidad de <strong className="text-white">React + Vite</strong> con la potencia de <strong className="text-white">Cascade Intelligence</strong> (Claude + Gemini 2.5).
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                    <Cpu size={20} className="text-neon" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Chain-of-Thought Reasoning</h4>
                    <p className="text-sm text-white/50">La IA sigue un protocolo estricto: Evalúa contexto, valida dolor, cruza soluciones y calcula scores.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Database size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Resiliencia "Nuclear"</h4>
                    <p className="text-sm text-white/50">Sistema híbrido Firestore + LocalStorage. Tus datos persisten incluso sin conexión.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <GlassCard className="h-[500px] bg-black/50 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-40 mix-blend-screen" 
                alt="Code" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              {/* Terminal Widget */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 font-mono text-xs">
                 <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-white/40">valid.ai — protocol</span>
                 </div>
                 <div className="text-green-400 mb-2">// Protocolo de Validación Iniciado</div>
                 <div className="text-white/60 space-y-1">
                    <p><span className="text-neon">{">"}</span> Cargando contexto: Experto vs Novato...</p>
                    <p><span className="text-neon">{">"}</span> Buscando evidencia de dolor real...</p>
                    <p><span className="text-neon">{">"}</span> <span className="text-white">DETECTADO:</span> "Es urgente, pierdo dinero cada día."</p>
                    <p><span className="text-neon">{">"}</span> Asignando peso: Intensidad (25%) → <span className="text-neon">ALTA</span></p>
                    <p><span className="text-neon">{">"}</span> Generando veredicto...</p>
                 </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* --- VOID UI (AESTHETIC) --- */}
      <section className="py-40 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal delay={0.2}>
            <GlassCard className="h-[500px] bg-black/50 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-50" 
                alt="Abstract UI" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
              
              {/* Floating Glass Panels Demo */}
              <div className="absolute top-10 right-10 w-40 h-24 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center">
                <BarChart className="text-neon" size={32} />
              </div>
              <div className="absolute bottom-20 left-10 w-48 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center gap-3">
                <div className="w-3 h-3 rounded-full bg-neon animate-pulse"></div>
                <span className="text-white text-sm">Score: 87</span>
              </div>
            </GlassCard>
          </Reveal>
          
          <Reveal>
            <div>
              <div className="mb-4 text-purple-400 font-mono text-xs uppercase tracking-widest">Estética</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Void UI. <br/>
                <span className="text-white/50">Diseño que respira.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Olvida las hojas de cálculo. Olvida los formularios aburridos. Hemos creado una interfaz que se siente viva.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Eye size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Inmersión Total</h4>
                    <p className="text-sm text-white/50">Fondos oscuros profundos que eliminan distracciones y ponen el foco en tus datos.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Layers size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Glassmorphism Dinámico</h4>
                    <p className="text-sm text-white/50">Paneles de vidrio esmerilado que flotan, creando jerarquía visual natural.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- SMART WIDGETS --- */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div>
              <div className="mb-4 text-yellow-400 font-mono text-xs uppercase tracking-widest">Interactividad</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Smart Widgets. <br/>
                <span className="text-white/50">Datos que se sienten.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                La recolección de datos no tiene por qué ser aburrida. Hemos reinventado los inputs.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                    <Sliders size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Gauge de Intensidad</h4>
                    <p className="text-sm text-white/50">No marques una casilla. Desliza para mostrar cuánto duele el problema.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Selectores Financieros</h4>
                    <p className="text-sm text-white/50">Rangos dinámicos que se adaptan a la realidad económica del usuario.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <GlassCard className="p-8" glow>
              {/* Interactive Demo */}
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white/60">¿Qué tan urgente es el problema?</span>
                    <span className="text-neon font-bold">Crítico</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white/60">Disposición a pagar</span>
                    <span className="text-neon font-bold">$50-100/mes</span>
                  </div>
                  <div className="flex gap-2">
                    {['$0', '$10', '$50', '$100', '$500+'].map((val, i) => (
                      <div key={i} className={`flex-1 py-2 rounded-xl text-center text-xs font-bold ${i === 2 || i === 3 ? 'bg-neon/20 text-neon border border-neon/30' : 'bg-white/5 text-white/40'}`}>
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-white/40 text-xs uppercase tracking-widest mb-2">Señal Detectada</div>
                    <div className="text-3xl font-bold text-neon">ALTA DEMANDA</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* --- CHAIN OF THOUGHT --- */}
      <section className="py-40 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal delay={0.2}>
            <GlassCard className="h-[500px] bg-black/50 relative overflow-hidden p-8">
              {/* AI Thinking Process Visualization */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neon/20 flex items-center justify-center">
                    <Brain className="text-neon" size={20} />
                  </div>
                  <div className="text-white font-semibold">Gemini 2.0 Flash — Analizando</div>
                </div>
                
                {[
                  { step: 1, text: 'Analizando contexto del entrevistado...', done: true },
                  { step: 2, text: 'Buscando contradicciones en respuestas...', done: true },
                  { step: 3, text: 'Detectando emociones ocultas en el texto...', done: true },
                  { step: 4, text: 'Calculando probabilidad de éxito...', done: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.done ? 'bg-neon/20' : 'bg-white/10'}`}>
                      {item.done ? (
                        <CheckCircle size={16} className="text-neon" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-neon rounded-full animate-spin"></div>
                      )}
                    </div>
                    <span className={`text-sm ${item.done ? 'text-white/60' : 'text-white'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
          
          <Reveal>
            <div>
              <div className="mb-4 text-cyan-400 font-mono text-xs uppercase tracking-widest">Inteligencia</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Chain-of-Thought. <br/>
                <span className="text-white/50">No solo piensa. Razona.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Bajo el capó, Valid.AI corre con <strong className="text-white">Cascade Intelligence</strong> — Claude Sonnet 4.5 para razonamiento profundo + Gemini 2.5 para búsqueda web en tiempo real. Dos cerebros, una misión.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <Brain size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Cadena de Pensamiento</h4>
                    <p className="text-sm text-white/50">La IA no "resume". Analiza, busca contradicciones y detecta emociones ocultas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
                    <Activity size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Análisis Probabilístico</h4>
                    <p className="text-sm text-white/50">Calcula la probabilidad de éxito basándose en patrones de miles de startups.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- IDEA TO PLAN (JOURNEY) --- */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
           <div className="text-center mb-24">
              <Reveal>
                 <h2 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">De Idea a Plan.</h2>
                 <p className="text-xl text-white/50">El viaje de la incertidumbre a la claridad.</p>
              </Reveal>
           </div>
           
           {/* Enhanced Timeline with Connecting Line */}
           <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-10 md:left-[calc(8.33%+2.5rem)] top-10 bottom-20 w-[2px] bg-gradient-to-b from-neon via-emerald-500/50 to-transparent hidden md:block"></div>
              
              <div className="space-y-16 md:space-y-24">
                 {[
                    { 
                      step: "01", 
                      title: "La Semilla", 
                      desc: "Todo comienza con un pensamiento. Escribe tu idea en lenguaje natural, sin formalismos. La IA entiende tu visión.",
                      icon: Lightbulb,
                      example: '"Quiero una app que mida el estrés con el reloj..."',
                      typingEffect: true
                    },
                    { 
                      step: "02", 
                      title: "El Interrogatorio", 
                      desc: "La IA actúa como un consultor senior. No asume nada. Te hace preguntas dinámicas para desafiar tus suposiciones.",
                      icon: MessageSquare,
                      example: '"¿B2B o B2C? ¿Qué hardware usarían? ¿Por qué ahora?"',
                      typingEffect: true
                    },
                    { 
                      step: "03", 
                      title: "La Génesis", 
                      desc: "En segundos, obtienes un Plan de Investigación completo: Objetivos claros, Personas y un Guion de Entrevista sin sesgos.",
                      icon: FileText,
                      example: '✅ Plan de Investigación generado',
                      typingEffect: false
                    }
                 ].map((item, i) => (
                    <Reveal key={i} delay={i * 0.15}>
                       <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative">
                          {/* Number with Pulse */}
                          <div className="md:col-span-2 flex justify-center relative">
                             <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 bg-neon/20 rounded-full blur-xl animate-pulse"></div>
                             </div>
                             <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-neon/30 to-emerald-500/20 border-2 border-neon/50 flex items-center justify-center shadow-[0_0_40px_rgba(58,255,151,0.3)] relative z-10 group-hover:scale-110 transition-transform">
                                <item.icon className="text-neon" size={32} />
                             </div>
                          </div>
                          
                          {/* Content */}
                          <div className="md:col-span-5">
                             <div className="flex items-center gap-3 mb-3">
                                <span className="text-neon font-mono text-lg font-bold bg-neon/10 px-3 py-1 rounded-full">{item.step}</span>
                                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                             </div>
                             <p className="text-white/60 leading-relaxed text-lg">{item.desc}</p>
                          </div>

                          {/* Interactive Example Widget */}
                          <div className="md:col-span-5">
                             <GlassCard className="p-6 relative overflow-hidden" glow>
                                <div className="absolute top-3 right-3">
                                   <div className="w-2 h-2 bg-neon rounded-full animate-pulse"></div>
                                </div>
                                <div className="text-xs text-neon font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <Cpu size={12} /> {item.typingEffect ? 'Input en tiempo real' : 'Output generado'}
                                </div>
                                <div className="text-white font-medium text-lg">
                                   {item.typingEffect ? (
                                      <span className="border-r-2 border-neon animate-pulse">{item.example}</span>
                                   ) : (
                                      <span className="text-neon font-bold">{item.example}</span>
                                   )}
                                </div>
                             </GlassCard>
                          </div>
                       </div>
                    </Reveal>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* --- TEMPLATE GALLERY --- */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5 relative z-10 overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-neon/30 rounded-full animate-float"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-4 tracking-tight">
                Galería de Plantillas
              </h2>
              <p className="text-xl text-white/50">No empieces desde cero. Empieza desde la cima.</p>
              <p className="text-sm text-neon/60 mt-4 font-mono">Metodología Y Combinator + Lean Startup incluida</p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'SaaS B2B', icon: Server, desc: 'Software empresarial', questions: 24, focus: 'Enterprise' },
              { name: 'E-commerce', icon: ShoppingCart, desc: 'Tienda online', questions: 18, focus: 'Retail' },
              { name: 'HealthTech', icon: Heart, desc: 'Salud y bienestar', questions: 22, focus: 'Healthcare' },
              { name: 'FinTech', icon: Wallet, desc: 'Finanzas digitales', questions: 26, focus: 'Finance' },
              { name: 'EdTech', icon: GraduationCap, desc: 'Educación', questions: 20, focus: 'Education' },
              { name: 'Marketplace', icon: Store, desc: 'Plataforma multi-vendor', questions: 28, focus: 'Platform' }
            ].map((template, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <GlassCard className="p-6 h-48 flex flex-col justify-between cursor-pointer hover:border-neon/50 transition-all group hover:scale-[1.03] relative overflow-hidden">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/0 to-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon with Glow */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-neon/20 flex items-center justify-center transition-all duration-300">
                      <template.icon className="text-white/40 group-hover:text-neon transition-colors" size={24} />
                    </div>
                    {/* Question Count Badge */}
                    <div className="bg-white/5 group-hover:bg-neon/10 px-2 py-1 rounded-full text-[10px] font-mono text-white/40 group-hover:text-neon transition-all">
                      {template.questions} preguntas
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-neon transition-colors">{template.name}</h3>
                    <p className="text-sm text-white/40 mb-2">{template.desc}</p>
                    {/* Industry Focus Tag */}
                    <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[10px] text-white/30 group-hover:bg-neon/10 group-hover:text-neon/80 transition-all">
                      <Target size={10} />
                      {template.focus}
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* --- DOCUMENT UPLOADER --- */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
                  Tus archivos, con cerebro.
                </h2>
                <p className="text-lg text-white/60 mb-8 leading-relaxed">
                  ¿Tienes un PDF con tu idea? ¿Un Word con notas? Arrastralo a Valid.AI. El sistema lo lee, extrae conceptos clave y genera un plan de validación instantáneo.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle size={18} className="text-neon" /> Análisis semántico profundo
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle size={18} className="text-neon" /> Extracción de entidades
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle size={18} className="text-neon" /> Generación automática de preguntas
                  </li>
                </ul>
              </div>
              
              <GlassCard className="p-8 relative overflow-hidden group" glow>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-neon/20 transition-colors">
                    <Upload size={28} className="text-white/60 group-hover:text-neon transition-colors" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">Suelta tu archivo aquí</h4>
                  <p className="text-sm text-white/40 mb-6">PDF, DOCX, TXT</p>
                  
                  {/* Simulated File */}
                  <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <FileText size={20} className="text-red-400" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-white text-sm font-medium">mi_idea_genial.pdf</div>
                      <div className="text-white/40 text-xs">Analizando...</div>
                    </div>
                    <div className="w-6 h-6 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- SCORING (INTERACTIVE) --- */}
      <section className="py-40 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight">Las 6 Dimensiones de la Verdad.</h2>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">
                No adivinamos. Medimos.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal delay={0.2}>
              <div className="relative">
                <ValidationSimulator />
                {/* Pulsing CTA */}
                <div className="mt-6 flex items-center justify-center gap-3 animate-pulse">
                  <div className="w-3 h-3 bg-neon rounded-full shadow-[0_0_15px_rgba(0,255,148,0.8)]"></div>
                  <span className="text-neon font-bold text-lg tracking-wide">Interactúa con el simulador</span>
                  <div className="w-3 h-3 bg-neon rounded-full shadow-[0_0_15px_rgba(0,255,148,0.8)]"></div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="space-y-6">
                <GlassCard className="p-6 flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-neon"></div>
                  <div>
                    <div className="text-white font-bold">GO (Construir)</div>
                    <div className="text-sm text-white/40">Score {">"} 70 + Alta Disposición a Pagar.</div>
                  </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <div>
                    <div className="text-white font-bold">PIVOT (Ajustar)</div>
                    <div className="text-sm text-white/40">Score {">"} 40. Problema real, solución incorrecta.</div>
                  </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div>
                    <div className="text-white font-bold">NO GO (Descartar)</div>
                    <div className="text-sm text-white/40">Score {"<"} 40. No hay mercado.</div>
                  </div>
                </GlassCard>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- HOLO-VERIFY PROTOCOL [BETA] --- */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-purple-400 font-mono text-xs uppercase tracking-widest">Certificación</span>
                <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/30 animate-pulse">BETA</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Holo-Verify™ <br/>
                <span className="text-white/50">Tu credencial forense.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Cualquiera puede hacer un PowerPoint. Solo VALID.AI te da una <strong className="text-white">credencial verificable</strong> que demuestra tracción real ante inversores.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">YC Readiness Score™</h4>
                    <p className="text-sm text-white/50">Auditoría con severidad de Partner Y Combinator. Volumen, consistencia y performance.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                    <Lock size={20} className="text-neon" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Certificado Vivo</h4>
                    <p className="text-sm text-white/50">Enlace cinemático y encriptado: valid.ai/verify/... Envíaselo a inversores.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <GlassCard className="h-[450px] relative overflow-hidden flex items-center justify-center" glow>
              {/* Holographic Scanner Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-neon/5"></div>
              
              {/* Scanning Line Animation */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-neon to-transparent animate-scan"></div>
              
              {/* Certificate Preview */}
              <div className="relative z-10 text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/30 to-neon/30 border-2 border-white/20 flex items-center justify-center shadow-[0_0_60px_rgba(147,51,234,0.3)]">
                  <Shield size={48} className="text-white" />
                </div>
                <div className="text-6xl font-black text-white mb-2">87</div>
                <div className="text-sm text-neon font-mono uppercase tracking-widest mb-4">Viability Score</div>
                <div className="inline-flex items-center gap-2 bg-neon/10 px-4 py-2 rounded-full border border-neon/30">
                  <div className="w-2 h-2 bg-neon rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-neon">VERIFICADO</span>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* --- SMART BUDGETS --- */}
      <section className="py-40 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal delay={0.2}>
            <GlassCard className="h-[400px] relative overflow-hidden p-8" glow>
              {/* Token Usage Gauge */}
              <div className="text-center mb-8">
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Uso de Tokens</div>
                <div className="text-5xl font-black text-white">2,847</div>
                <div className="text-sm text-neon">/ 10,000 este mes</div>
              </div>
              
              {/* Gauge Visual */}
              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-8">
                <div className="absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-neon to-emerald-500 rounded-full"></div>
              </div>
              
              {/* Mode Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neon/10 border border-neon/30 rounded-xl text-center">
                  <div className="text-neon font-bold text-sm mb-1">Modo Eco</div>
                  <div className="text-[10px] text-white/40">Análisis rápido</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                  <div className="text-white/60 font-bold text-sm mb-1">Deep Research</div>
                  <div className="text-[10px] text-white/40">Con búsqueda web</div>
                </div>
              </div>
            </GlassCard>
          </Reveal>
          
          <Reveal>
            <div>
              <div className="mb-4 text-emerald-400 font-mono text-xs uppercase tracking-widest">Optimización</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Smart Budgets. <br/>
                <span className="text-white/50">Inteligencia sin desperdicio.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Sabemos que cada dólar cuenta en pre-seed. Hemos diseñado un sistema de <strong className="text-white">Gestión de Recursos Líquida</strong> que maximiza tu ROI.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Modo Eco</h4>
                    <p className="text-sm text-white/50">Análisis estructurales sin consumo pesado. Validaciones rápidas con reglas predefinidas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Globe size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Deep Research on Demand</h4>
                    <p className="text-sm text-white/50">Activa búsqueda web y análisis profundo solo cuando lo necesitas.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- MYSTERY VALIDATORS --- */}
      <section className="py-32 px-6 relative z-10">
         <div className="max-w-4xl mx-auto text-center mb-16">
            <Reveal>
               <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">Probado por Maestros.</h2>
               <p className="text-lg text-white/50">
                  Dos mentes brillantes están llevando nuestro algoritmo al límite. <br/>
                  <span className="text-neon/80 font-mono text-sm uppercase tracking-widest block mt-2">Revelación Inminente</span>
               </p>
            </Reveal>
         </div>

         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
             {[
               { title: "El Arquitecto de Unicornios", role: "Identidad Clasificada", desc: "Sometiendo el sistema a estándares de inversión de clase mundial." },
               { title: "La Profeta de Datos", role: "Identidad Clasificada", desc: "Auditando la precisión científica de nuestros algoritmos de predicción." }
            ].map((profile, i) => (
               <Reveal key={i} delay={i * 0.2}>
                  <div className="relative group cursor-help">
                     <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 z-20 flex flex-col items-center justify-center p-8 text-center transition-opacity duration-500 group-hover:opacity-10">
                        <LockKeyhole size={48} className="text-white/20 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-1 blur-[6px] select-none">Nombre Oculto</h3>
                        <p className="text-white/40 blur-[4px]">Identidad Protegida</p>
                     </div>
                     <GlassCard className="p-8 h-64 flex flex-col items-center justify-center text-center bg-black/40 grayscale group-hover:grayscale-0 transition-all duration-500">
                         <User size={48} className="text-white/20 mb-4" />
                         <h3 className="text-xl font-bold text-white mb-1">{profile.title}</h3>
                         <div className="text-neon text-xs font-bold uppercase tracking-widest mb-3">{profile.role}</div>
                         <p className="text-white/60 text-sm">{profile.desc}</p>
                     </GlassCard>
                  </div>
               </Reveal>
            ))}
         </div>
      </section>

      {/* --- BUSINESS LAB --- */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
               <div>
                  <div className="mb-4 text-blue-400 font-mono text-xs uppercase tracking-widest">Documentación</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     Business Lab. <br/>
                     <span className="text-white/50">Tu laboratorio estratégico.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     Genera reportes profesionales listos para inversores con un solo clic. Desde Executive Summaries hasta Modelos Financieros.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                        "Executive Summary", "Problem & Solution", "Market Analysis", "Competition",
                        "Business Model", "Go-to-Market", "Financial Projections", "Risk Assessment"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                           <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                           {item}
                        </div>
                     ))}
                  </div>
               </div>
            </Reveal>
            
            <Reveal delay={0.2}>
               <GlassCard className="h-[400px] relative overflow-hidden flex items-center justify-center p-8 text-center group" glow>
                   <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
                   <FileText size={64} className="text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                   <h3 className="text-2xl font-bold text-white mb-2">Reporte Inversor Serie A</h3>
                   <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
                      Formato institucional. HTML Premium o PDF optimizado para impresión.
                   </p>
                   <button className="px-6 py-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-black transition-all font-bold text-sm flex items-center gap-2 mx-auto">
                      <FileUp size={16} /> Generar Reporte Demo
                   </button>
               </GlassCard>
            </Reveal>
         </div>
      </section>

      {/* --- SMART CHAT --- */}
      <section className="py-20 px-6 relative z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <Reveal delay={0.2}>
               <GlassCard className="h-[450px] relative overflow-hidden" glow>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-0"></div>
                  {/* Chat Interface Mockup */}
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center">
                           <Sparkles size={14} className="text-neon" />
                        </div>
                        <span className="text-sm font-bold text-white">Valid.AI Copilot</span>
                     </div>
                     <div className="flex-1 p-6 space-y-4 overflow-hidden">
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                           <p className="text-white/80 text-sm">He analizado tus últimas 5 entrevistas. Hay una contradicción importante en el tema del precio.</p>
                        </div>
                        <div className="bg-neon/10 border border-neon/20 rounded-2xl rounded-tr-none p-4 max-w-[85%] ml-auto">
                           <p className="text-white text-sm">¿Cuál es la contradicción?</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                           <p className="text-white/80 text-sm">
                              Los usuarios dicen que es "caro" ($50), pero actualmente gastan $200 en soluciones manuales ineficientes. <br/><br/>
                              <span className="text-neon font-bold">Sugerencia:</span> Reframea tu propuesta de valor como "Ahorro de costos" en lugar de "Nuevo gasto".
                           </p>
                        </div>
                     </div>
                     <div className="p-4 border-t border-white/10">
                        <div className="w-full h-10 bg-white/5 rounded-full border border-white/10 flex items-center px-4 text-white/30 text-sm">
                           Escribe un mensaje...
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </Reveal>

            <Reveal>
               <div>
                  <div className="mb-4 text-neon font-mono text-xs uppercase tracking-widest">Asistente</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     Smart Chat. <br/>
                     <span className="text-white/50">Tu Co-Piloto.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     No chateas con un bot genérico. Chateas con un asistente que conoce <strong className="text-white">TODO</strong> sobre tu proyecto: tus métricas, tus entrevistas y tus documentos.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                        <Database size={20} className="text-neon" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Contexto Total</h4>
                        <p className="text-sm text-white/50">Recuerda cada detalle de tu sesión de validación.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <LayoutTemplate size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Tablas & Datos</h4>
                        <p className="text-sm text-white/50">Pídele que genere una tabla comparativa de competidores y la renderizará en Markdown.</p>
                      </div>
                    </li>
                  </ul>
               </div>
            </Reveal>
         </div>
      </section>

      {/* --- EXPORT & SHARING --- */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
         <div className="max-w-4xl mx-auto text-center">
            <Reveal>
               <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8">Tus Datos, Tu Control.</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/30 transition-all group">
                     <FileText size={32} className="text-white/40 group-hover:text-neon mb-4 mx-auto" />
                     <h3 className="text-white font-bold mb-2">JSON</h3>
                     <p className="text-white/40 text-sm">Datos estructurados para desarrolladores.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/30 transition-all group">
                     <LayoutTemplate size={32} className="text-white/40 group-hover:text-blue-400 mb-4 mx-auto" />
                     <h3 className="text-white font-bold mb-2">HTML</h3>
                     <p className="text-white/40 text-sm">Reportes visuales interactivos.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all group">
                     <FileUp size={32} className="text-white/40 group-hover:text-purple-400 mb-4 mx-auto" />
                     <h3 className="text-white font-bold mb-2">PDF Ready</h3>
                     <p className="text-white/40 text-sm">Optimizado para impresión y lectura.</p>
                  </div>
               </div>
            </Reveal>
         </div>
      </section>

      {/* --- PRICING --- */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
               <div>
                  <div className="mb-4 text-emerald-400 font-mono text-xs uppercase tracking-widest">Inversión</div>
                  <h2 className="text-5xl md:text-7xl font-semibold text-white mb-8 tracking-tight">
                     Inteligencia <br/>
                     <span className="text-white/50">Democratizada.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     Las firmas de consultoría cobran millones. Nosotros no.
                     Accede al poder de Validación Híbrida por menos de lo que cuesta una cena.
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Auditorías Ilimitadas
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Deep Research con Google Data
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Voice Command & Entrevistas Híbridas
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Reportes Mensuales de Tendencias
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Certificación Holo-Verify™
                     </li>
                  </ul>
               </div>
            </Reveal>
            
            <Reveal delay={0.2}>
               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                  <GlassCard className="p-10 border-emerald-500/30 text-center relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4">
                         <div className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Plan Pro
                         </div>
                      </div>
                      
                      <div className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">Lanzamiento</div>
                      <div className="flex items-baseline justify-center gap-1 mb-8">
                         <span className="text-xl text-white/60">$</span>
                         <span className="text-8xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform duration-500">19</span>
                         <span className="text-xl text-white/60">/mes</span>
                      </div>
                      
                      <div className="text-emerald-400 font-mono text-sm mb-8">APROX. $75.000 COP</div>
                      
                      <button onClick={handleLaunch} className="w-full py-4 bg-white text-black rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                         Empezar Ahora
                      </button>
                  </GlassCard>
               </div>
            </Reveal>
         </div>
      </section>

      {/* --- GRAND FINALE (LEAD CAPTURE) --- */}
      <section className="min-h-screen flex items-center justify-center py-20 px-6 relative z-10 overflow-hidden">
        {/* Enhanced Animated Background (Like Login) */}
        <div className="absolute inset-0 bg-black z-0 overflow-hidden">
          {/* Ambient Orbs with Chaos Animation */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/20 rounded-full blur-[100px] animate-chaos-slow mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/20 rounded-full blur-[100px] animate-chaos-slow mix-blend-screen" style={{animationDelay: '-5s', animationDirection: 'reverse'}}></div>
          <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-cyan-500/10 rounded-full blur-[80px] animate-float"></div>
          <div className="absolute bottom-[20%] left-[30%] w-[40vw] h-[40vw] bg-blue-600/15 rounded-full blur-[120px] animate-pulse-slow"></div>
          
          {/* Central Neon Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/10 rounded-full blur-[200px] pointer-events-none animate-pulse"></div>
          
          {/* Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>
        
        {/* Floating Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-12 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            
            {/* Pre-launch Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/30">
                <span className="text-xs font-bold text-neon uppercase">Pre-Lanzamiento</span>
                <span className="text-xs text-white/60">Diciembre 2025</span>
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 tracking-tight leading-tight">
              Acceso Exclusivo
            </h2>
            
            {/* Description */}
            <p className="text-center text-white/60 mb-10 text-lg leading-relaxed max-w-md mx-auto">
              Sé el primero en validar con ciencia. Estamos seleccionando a las primeras empresas para probar Valid.AI y demostrar el ROI. Asegura tu lugar.
            </p>
            
            {/* Email Input */}
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Ingresa tu email o el de tu colega interesado"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/30 focus:border-neon/50 focus:outline-none focus:ring-2 focus:ring-neon/20 transition-all text-center"
                />
              </div>
              
              {/* CTA Button */}
              <button 
                onClick={() => setShowModal(true)}
                className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group"
              >
                Quiero Validar mi Idea
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
            
            {/* Trust Badge */}
            <p className="mt-8 text-center text-xs text-white/30 uppercase tracking-widest">
              Sin tarjeta de crédito • Acceso inmediato
            </p>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 text-center text-xs text-white/40 relative z-10 border-t border-white/5 bg-black">
        <p className="mb-4">Diseñado con <span className="text-red-500">❤</span> en Colombia.</p>
        <p className="opacity-50">Copyright © 2025 Valid.AI Inc.</p>
      </footer>
    </div>
  );
};
