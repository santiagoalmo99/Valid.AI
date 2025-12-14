// VALID.AI Landing Page - The Truth Machine (Void UI)
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Play, Sparkles, Zap, Brain, Shield, 
  BarChart, Lock, Activity, Server, MessageSquare, FileText, 
  Target, Lightbulb, TrendingUp, ChevronRight, Smartphone, Layers,
  Clock, DollarSign, Calculator, Sliders, Database, Cpu, Eye,
  FileUp, Scan, LayoutTemplate, MousePointer2, X, Mail, User, Briefcase,
  ShoppingCart, Heart, Wallet, GraduationCap, Store, Upload, Mic, Globe, LockKeyhole,
  Atom, Fingerprint, RefreshCcw
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
  <div className={`relative overflow-hidden bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/5 ${glow ? 'shadow-[0_0_40px_rgba(58,255,151,0.05)] border-white/10' : ''} ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

// --- LEAD CAPTURE MODAL (VORTEX STYLE) ---
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[32px] p-10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon to-transparent opacity-50"></div>
            <button onClick={onClose} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors">
              <X size={24} />
            </button>

            {step === 1 ? (
              <>
                <div className="mb-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon/10 border border-neon/20 mb-6 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-neon/20 blur-xl group-hover:bg-neon/30 transition-all"></div>
                    <Fingerprint size={28} className="text-neon relative z-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Identificación</h3>
                  <p className="text-white/40 text-sm font-mono">Protocolo de acceso a The Truth Machine.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-widest">Identidad</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input 
                        required
                        type="text" 
                        placeholder="Nombre completo"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-neon/50 focus:outline-none focus:bg-white/[0.05] transition-all font-mono text-sm"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-widest">Credencial</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input 
                        required
                        type="email" 
                        placeholder="correo@empresa.com"
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-neon/50 focus:outline-none focus:bg-white/[0.05] transition-all font-mono text-sm"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-widest">Rol</label>
                        <select 
                           required
                           className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-4 text-white focus:border-neon/50 focus:outline-none transition-all appearance-none font-mono text-xs"
                           value={formData.role}
                           onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                           <option value="" className="bg-black">Seleccionar...</option>
                           <option value="founder" className="bg-black">Fundador</option>
                           <option value="product" className="bg-black">Product Mgr</option>
                           <option value="investor" className="bg-black">VC / Angel</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase ml-1 tracking-widest">Fase</label>
                        <select 
                           required
                           className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 px-4 text-white focus:border-neon/50 focus:outline-none transition-all appearance-none font-mono text-xs"
                           value={formData.stage}
                           onChange={e => setFormData({...formData, stage: e.target.value})}
                        >
                           <option value="" className="bg-black">Seleccionar...</option>
                           <option value="idea" className="bg-black">Idea</option>
                           <option value="mvp" className="bg-black">MVP</option>
                           <option value="scaling" className="bg-black">Escalando</option>
                        </select>
                     </div>
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full group relative py-4 bg-white text-black rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-neon transition-colors mt-6 flex items-center justify-center gap-3 overflow-hidden disabled:opacity-50">
                    <span className="relative z-10 flex items-center gap-2">
                       {isSaving ? 'Procesando...' : 'Iniciar Validación'} <ArrowRight size={16} />
                    </span>
                    <div className="absolute inset-0 bg-neon translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-16">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-neon/10 border border-neon/50 rounded-full flex items-center justify-center mx-auto mb-8 relative"
                >
                  <div className="absolute inset-0 bg-neon/20 blur-xl animate-pulse"></div>
                  <CheckCircle size={48} className="text-neon relative z-10" />
                </motion.div>
                <h3 className="text-4xl font-bold text-white mb-3 tracking-tighter">Acceso Concedido</h3>
                <p className="text-white/40 font-mono text-sm">Inicializando entorno de análisis...</p>
                <div className="mt-8 flex justify-center gap-1">
                   <div className="w-1 h-4 bg-neon animate-wave"></div>
                   <div className="w-1 h-6 bg-neon animate-wave" style={{animationDelay: '0.1s'}}></div>
                   <div className="w-1 h-4 bg-neon animate-wave" style={{animationDelay: '0.2s'}}></div>
                   <div className="w-1 h-5 bg-neon animate-wave" style={{animationDelay: '0.3s'}}></div>
                   <div className="w-1 h-3 bg-neon animate-wave" style={{animationDelay: '0.4s'}}></div>
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
  const score = Math.round((intensity * 5) + 35);
  
  return (
    <GlassCard className="p-8" glow>
      <div className="mb-8 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
               <Activity size={16} className="text-neon" />
            </div>
            <div>
               <h3 className="text-white font-bold text-sm tracking-wide">Simulador de Impacto</h3>
               <p className="text-white/40 text-xs font-mono">Motor de Inferencia v2.5</p>
            </div>
         </div>
         <div className="flex items-center gap-2 text-xs font-mono text-neon bg-neon/10 px-2 py-1 rounded border border-neon/20">
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse"></div>
            LIVE
         </div>
      </div>

      <div className="space-y-8 relative">
         {/* Gauge */}
         <div className="relative h-48 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 50">
               <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#333" strokeWidth="8" strokeLinecap="round" />
               <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeDasharray="126"
                  strokeDashoffset={126 - (126 * (score / 100))}
                  className="transition-all duration-1000 ease-out"
               />
               <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#ef4444" />
                     <stop offset="50%" stopColor="#facc15" />
                     <stop offset="100%" stopColor="#00ff94" />
                  </linearGradient>
               </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
               <span className="text-5xl font-bold text-white tracking-tighter mb-1">{score}</span>
               <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Validation Score</span>
            </div>
         </div>

         {/* Slider */}
         <div className="space-y-4">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider">
               <span className="text-white/60">Intensidad del Dolor</span>
               <span className="text-neon">{intensity}/10</span>
            </div>
            <input 
              type="range" min="0" max="10" step="1"
              value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon hover:accent-neon/80"
            />
         </div>
      </div>
    </GlassCard>
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

  return (
    <div className="bg-[#000000] text-[#E0E0E0] font-sans selection:bg-neon/30 selection:text-white overflow-x-hidden relative min-h-screen">
      
      <LeadCaptureModal isOpen={showModal} onClose={() => setShowModal(false)} onComplete={() => window.location.href = '/'} />

      {/* --- VOID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Subtle Noise */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
         
         {/* Deep ambient glows */}
         <div className="absolute top-[-50%] left-[-20%] w-[100vw] h-[100vw] bg-white/[0.02] rounded-full blur-[150px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-neon/[0.03] rounded-full blur-[200px]"></div>
         
         {/* Grid - Very faint */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navbar (Minimalist) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none">
        <div className="pointer-events-auto bg-black/50 backdrop-blur-md border border-white/5 rounded-full px-6 py-2.5 flex items-center gap-6 shadow-2xl">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-neon animate-pulse"></div>
             <span className="font-bold text-sm tracking-tight text-white">VALID.AI</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <button onClick={handleLaunch} className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">
            Access The Truth
          </button>
        </div>
      </nav>

      {/* --- HERO: THE VORTEX --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        
        {/* Central Glow (The Vortex Core) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <div className="mb-10 flex justify-center">
             <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
               </span>
               <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">Phase 1: <span className="text-neon">Truth Machine</span></span>
             </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.8] text-white mix-blend-difference">
            THE TRUTH <br/>
            <span className="text-white/20">MACHINE</span>
          </h1>
          
          <p className="text-lg md:text-xl font-medium text-white/50 max-w-2xl mx-auto mt-8 mb-16 leading-relaxed">
            We don't sell hope. We sell truth. <br/>
            <span className="text-white/30 text-sm font-mono mt-2 block">Powered by Cascade Intelligence™</span>
          </p>

          {/* VORTEX BUTTON */}
          <div className="relative group cursor-pointer" onClick={handleLaunch}>
             <div className="absolute inset-0 bg-neon/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             <div className="absolute -inset-1 bg-gradient-to-r from-neon via-white to-neon rounded-full opacity-20 group-hover:opacity-50 blur-md transition-all duration-300"></div>
             <button className="relative px-12 py-6 bg-black text-white rounded-full font-bold text-lg tracking-widest uppercase border border-white/20 group-hover:border-neon/50 transition-all flex items-center gap-4 group-hover:scale-105 active:scale-95 overflow-hidden">
                <span className="relative z-10">Enter The Vortex</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform text-neon" />
                
                {/* Shine effect */}
                <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shine"></div>
             </button>
          </div>

        </motion.div>
      </section>

      {/* --- MANIFESTO (Brief) --- */}
      <section className="py-32 px-6 border-t border-white/5 bg-white/[0.01] relative">
         <div className="max-w-4xl mx-auto text-center">
            <Reveal>
               <QuoteIcon className="mx-auto mb-8 text-white/20" size={40} />
               <h2 className="text-3xl md:text-5xl font-semibold text-white/90 leading-tight tracking-tight">
                  "Most startups die because they build things nobody wants. 
                  <span className="text-white/30"> We fixed that.</span>"
               </h2>
               <div className="mt-12 flex justify-center gap-12 text-white/30 font-mono text-xs uppercase tracking-widest">
                  <div className="flex flex-col items-center gap-2">
                     <Brain size={20} />
                     <span>No Hallucinations</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <Shield size={20} />
                     <span>Brutal Honesty</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <Zap size={20} />
                     <span>Instant Clarity</span>
                  </div>
               </div>
            </Reveal>
         </div>
      </section>

      {/* --- FEATURE: BLITZSCALING READY --- */}
      <section className="py-40 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           
           <Reveal>
             <div className="relative">
                <div className="absolute -inset-10 bg-neon/5 blur-3xl rounded-full pointer-events-none"></div>
                <ValidationSimulator />
             </div>
           </Reveal>

           <Reveal delay={0.2}>
             <div>
               <div className="mb-6 flex items-center gap-3">
                  <span className="w-10 h-px bg-neon"></span>
                  <span className="text-neon font-mono text-xs uppercase tracking-widest">Protocolo de Validación</span>
               </div>
               
               <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                 Matar o <br/> Escalar.
               </h2>
               <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-md">
                 Nuestro motor no te da un "tal vez". Te da un semáforo. Rojo para ahorrarte años de vida. Verde para imprimir dinero.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeatureBox icon={Target} title="Detección de Dolor" desc="Identificamos si el usuario realmente sufre." />
                  <FeatureBox icon={DollarSign} title="Willingness to Pay" desc="¿Pagarían? ¿Y cuánto? Sin rodeos." />
                  <FeatureBox icon={RefreshCcw} title="Frecuencia" desc="¿Es un problema diario o anual?" />
                  <FeatureBox icon={TrendingUp} title="Tamaño de Mercado" desc="Proyección basada en datos reales." />
               </div>
             </div>
           </Reveal>

        </div>
      </section>

      {/* --- FEATURE: AUDIO INTELLIGENCE --- */}
      <section className="py-20 px-6 relative z-10">
         <div className="max-w-7xl mx-auto">
            <Reveal>
               <GlassCard className="p-12 md:p-20 text-center overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
                  
                  <div className="mb-6 mx-auto w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                     <Mic size={32} className="text-white group-hover:text-neon transition-colors" />
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Graba. Habla. Valida.</h2>
                  <p className="text-white/50 max-w-2xl mx-auto mb-10 text-lg">
                     Entrevistas híbridas con latencia ultra-baja. Capturamos no solo lo que dicen, sino cómo lo dicen.
                  </p>

                  <div className="flex justify-center gap-2 items-end h-16 mb-8">
                     {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-1.5 bg-white/20 rounded-full group-hover:bg-neon/50 transition-colors duration-500" style={{
                           height: Math.random() * 40 + 10 + '%',
                           animation: `sound-wave 1s ease-in-out infinite alternate ${i * 0.05}s`
                        }}></div>
                     ))}
                  </div>
               </GlassCard>
            </Reveal>
         </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center text-white/20 text-xs font-mono">
         <p>VALID.AI © 2025 // THE TRUTH MACHINE PROTOCOL</p>
      </footer>
    </div>
  );
};

const FeatureBox = ({ icon: Icon, title, desc }: any) => (
   <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group">
      <Icon className="text-white/40 group-hover:text-neon mb-4 transition-colors" size={24} />
      <h4 className="text-white font-bold mb-2 text-sm">{title}</h4>
      <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
   </div>
);

const QuoteIcon = ({ className, size }: any) => (
   <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.925 14.929 15.087C15.539 14.249 16.321 13.565 17.275 13.035C16.918 12.929 16.529 12.875 16.109 12.875C15.229 12.875 14.475 13.195 13.847 13.835C13.220 14.472 12.906 15.275 12.906 16.242L12.906 21L6 21L6 15.492C6 13.633 6.643 12.029 7.929 10.68C9.215 9.329 11.057 8.653 13.456 8.653L14.613 8.653L14.613 11.396L13.869 11.396C12.868 11.396 12.083 11.64 11.514 12.128C12.094 11.83 12.678 11.681 13.267 11.681C14.062 11.681 14.735 11.969 15.285 12.545C15.836 13.12 16.111 13.844 16.111 14.717C16.111 15.819 15.719 16.792 14.935 17.636C14.150 18.479 13.155 19.336 11.949 20.208L10.641 21L14.017 21ZM22 21L22 18C22 16.896 22.304 15.925 22.912 15.087C23.522 14.249 24.304 13.565 25.258 13.035C24.901 12.929 24.512 12.875 24.092 12.875C23.212 12.875 22.458 13.195 21.830 13.835C21.203 14.472 20.889 15.275 20.889 16.242L20.889 21L14 21L14 15.492C14 13.633 14.643 12.029 15.929 10.68C17.215 9.329 19.057 8.653 21.456 8.653L22.613 8.653L22.613 11.396L21.869 11.396C20.868 11.396 20.083 11.64 19.514 12.128C20.094 11.83 20.678 11.681 21.267 11.681C22.062 11.681 22.735 11.969 23.285 12.545C23.836 13.12 24.111 13.844 24.111 14.717C24.111 15.819 23.719 16.792 22.935 17.636C22.150 18.479 21.155 19.336 19.949 20.208L18.641 21L22 21Z" />
   </svg>
);
