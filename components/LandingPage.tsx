// VALID.AI Landing Page - Enhanced with Cascade Intelligence & Smart Widgets
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Play, Sparkles, Zap, Brain, Shield, 
  BarChart, Lock, Activity, Server, MessageSquare, FileText, 
  Target, Lightbulb, TrendingUp, ChevronRight, Smartphone, Layers,
  Clock, DollarSign, Calculator, Sliders, Database, Cpu, Eye,
  FileUp, Scan, LayoutTemplate, MousePointer2, X, Mail, User, Briefcase,
  ShoppingCart, Heart, Wallet, GraduationCap, Store, Upload, Mic, Globe, LockKeyhole, Music
} from 'lucide-react';
import { saveLead } from '../services/firebase';

// Reusable Components for Niche Landings
export const LandingHeader = ({ onLogin, c = "text-neon" }: { onLogin?: () => void, c?: string }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300">
    <div className="container mx-auto flex justify-between items-center bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-black text-xs shadow-[0_0_15px_rgba(52,211,153,0.5)]">
          V.AI
        </div>
        <span className="font-bold text-white tracking-wider text-lg">VALID<span className={c}>.AI</span></span>
      </div>
      <button 
        onClick={onLogin}
        className="px-6 py-2 text-sm font-bold text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-emerald-500/30"
      >
        Login
      </button>
    </div>
  </nav>
);

export const ValidationWidget = ({ color = "text-emerald-400", bg = "bg-emerald-500" }: { color?: string, bg?: string }) => {
   // Simple animation simulation
   return (
      <div className="relative w-full max-w-[300px] aspect-square rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md animate-float">
         <div className={`absolute inset-0 ${bg}/10 rounded-full blur-3xl animate-pulse-slow`}></div>
         <div className="text-center relative z-10">
            <div className={`text-5xl font-bold ${color} mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>92%</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Viability Score</div>
         </div>
         {/* Orbital dots */}
         <div className="absolute inset-0 animate-spin-slow">
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 ${bg} rounded-full shadow-[0_0_10px_currentColor]`}></div>
         </div>
         <div className="absolute inset-4 border border-dashed border-white/10 rounded-full animate-reverse-spin"></div>
      </div>
   )
}

// --- ANIMATION UTILS ---
export const springTransition = { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 };

export const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
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

export const GlassCard = ({ children, className = "", glow = false }: { children: React.ReactNode, className?: string, glow?: boolean }) => (
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
                  <h3 className="text-3xl font-bold text-white mb-2">Exclusive Access</h3>
                  <p className="text-white/60 text-sm">Join the elite founders validating with scientific precision.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input 
                        required
                        type="text" 
                        placeholder="Your name"
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
                        placeholder="you@company.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-neon/50 focus:outline-none focus:ring-2 focus:ring-neon/20 transition-all"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">What's your role?</label>
                    <select 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-neon/50 focus:outline-none transition-all appearance-none"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                      <option value="" className="bg-black">Select...</option>
                      <option value="founder" className="bg-black">Founder / CEO</option>
                      <option value="product" className="bg-black">Product Manager</option>
                      <option value="investor" className="bg-black">Investor</option>
                      <option value="other" className="bg-black">Innovator / Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">Startup stage?</label>
                    <select 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-neon/50 focus:outline-none transition-all appearance-none"
                      value={formData.stage}
                      onChange={e => setFormData({...formData, stage: e.target.value})}
                    >
                      <option value="" className="bg-black">Select...</option>
                      <option value="idea" className="bg-black">Ideation</option>
                      <option value="mvp" className="bg-black">MVP Phase</option>
                      <option value="product" className="bg-black">Post-Launch</option>
                      <option value="scaling" className="bg-black">Scaling</option>
                    </select>
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform mt-6 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Unlock Access'} <ArrowRight size={18} />
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
                  <h3 className="text-4xl font-bold text-white mb-3">Access Granted!</h3>
                <p className="text-white/60">Preparing your private experience...</p>
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
        <h3 className="text-white font-semibold text-xl mb-1">Validation Engine</h3>
        <p className="text-white/50 text-sm">Adjust the sliders to simulate professional analysis.</p>
      </div>

        <IntensityGauge value={intensity} onChange={setIntensity} />
        <FinancialSelector value={wtp} onChange={setWtp} />
        
        {/* Remaining Standard Sliders */}
        {[
          { label: "Solution Fit", val: fit, set: setFit, icon: Target },
          { label: "Early Adopter Profile", val: earlyAdopter, set: setEarlyAdopter, icon: Zap }
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
          <span className="text-white/80 flex items-center gap-2"><Activity size={14} className="text-neon"/> Pain Intensity</span>
          <span className={`font-mono font-bold ${value > 7 ? 'text-red-500' : value > 4 ? 'text-yellow-400' : 'text-emerald-400'}`}>
             {value > 7 ? 'CRITICAL' : value > 4 ? 'MODERATE' : 'MILD'} ({value}/10)
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
          <span className="text-white/80 flex items-center gap-2"><DollarSign size={14} className="text-neon"/> Willingness to Pay</span>
       </div>
       <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
          {options.map((opt) => (
             <button
                key={opt.label}
                onClick={() => onChange(opt.score)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                   value >= opt.score - 1 && value <= opt.score + 1 
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

export const LandingPage = ({ onLogin, lang = 'en' }: { onLogin?: () => void, lang?: Language }) => {
  const t = TRANSLATIONS[lang];
  const [showModal, setShowModal] = useState(false);

  const handleLaunch = () => {
    if (onLogin) {
      onLogin();
    } else {
      const lead = localStorage.getItem('valid_ai_lead');
      if (lead) {
        window.location.href = '/';
      } else {
        setShowModal(true);
      }
    }
  };

  const handleModalComplete = () => {
    window.location.href = '/';
  };

  return (
    <div className="bg-[#030303] text-white selection:bg-neon selection:text-black font-sans overflow-x-hidden relative">
      
      <LeadCaptureModal isOpen={showModal} onClose={() => setShowModal(false)} onComplete={handleModalComplete} />

      {/* --- ANIMATED BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[90vw] h-[90vw] bg-emerald-500/5 rounded-full blur-[140px] animate-chaos-slow mix-blend-screen"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-blue-600/5 rounded-full blur-[140px] animate-chaos-slow mix-blend-screen" style={{animationDelay: '-5s', animationDirection: 'reverse'}}></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6">
        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full px-8 py-4 flex items-center justify-between shadow-2xl pointer-events-auto group hover:border-white/20 transition-all">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-sm rounded shadow-[0_0_20px_rgba(255,255,255,0.2)]">V</div>
             <span className="font-bold text-lg tracking-tighter text-white">VALID.AI</span>
          </div>
          <div className="flex items-center gap-10">
            <button onClick={onLogin} className="text-[10px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-[0.3em]">
              {t.login}
            </button>
            <button onClick={handleLaunch} className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-neon transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              {t.launchApp}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-7xl mx-auto"
        >
            <div className="mb-12 flex justify-center">
              <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center gap-4 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Institutional Validation Protocol</span>
                <span className="text-[10px] text-white/20 font-mono">v3.2</span>
              </div>
            </div>
            
            <h1 className="text-[5rem] md:text-[9rem] lg:text-[12rem] font-bold tracking-tighter mb-12 flex flex-col items-center leading-[0.8]">
              <span className="text-white block">Surgical</span>
              <span className="relative block">
                 <span className="italic font-light text-white/30">Validation.</span>
              </span>
            </h1>
          
            <div className="max-w-3xl mx-auto border-l-2 border-neon/30 pl-10 text-left mt-10">
               <p className="text-xl md:text-2xl font-medium text-white/60 leading-relaxed">
                  {t.stopPoliteLies}. <br />
                  Combining <span className="text-white">Clinical Behavioral Audits</span> with the predictive raw power of <span className="text-white">Cascade Intelligence</span>.
               </p>
            </div>

            <div className="mt-20 flex items-center justify-center">
               <button onClick={handleLaunch} className="group relative px-12 py-6 bg-white text-black rounded-full font-black text-2xl hover:scale-110 transition-transform shadow-[0_0_80px_rgba(255,255,255,0.4)] overflow-hidden">
                  <div className="absolute inset-0 bg-neon translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10">{t.launchApp}</span>
               </button>
            </div>

            <div className="mt-20 flex justify-center gap-16 text-white/20 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
               <div className="flex items-center gap-2 font-black tracking-tighter text-xl">CLAUDE</div>
               <div className="flex items-center gap-2 font-black tracking-tighter text-xl">GEMINI</div>
               <div className="flex items-center gap-2 font-black tracking-tighter text-xl">FIREBASE</div>
            </div>
        </motion.div>
      </section>

      {/* --- REDESIGNED: STRATEGIC VALUE PIPELINE --- */}
      <section className="py-40 px-6 relative z-10 border-t border-white/5 bg-[#050505]">
        <div className="absolute inset-0 bg-grid-surgical opacity-[0.02] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32 items-end">
             <div className="lg:col-span-8">
                <div className="text-neon text-[10px] font-bold uppercase tracking-[0.5em] mb-8 block font-mono">{t.logicHeader}</div>
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85]">
                   Eradicate the <br /><span className="text-white/40 italic font-medium">Liar's Dividend.</span>
                </h2>
             </div>
             <div className="lg:col-span-4 pb-4">
                <p className="text-white/40 font-medium text-xl leading-relaxed border-l-2 border-neon/50 pl-10 h-full flex flex-col justify-end">
                   Most startups die because they validate ideas with polite lies. Valid.AI neutrality exposes the friction before you spend a single dollar on engineering.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-[4rem] overflow-hidden">
            <Reveal>
              <div className="h-full p-16 bg-[#030303] hover:bg-[#070707] transition-all group relative">
                <div className="text-[10px] font-mono text-white/20 mb-16 uppercase tracking-[0.4em]">Protocol 01</div>
                <div className="w-16 h-16 rounded-3xl bg-neon/10 flex items-center justify-center text-neon mb-10 border border-neon/20 group-hover:scale-110 transition-transform glow-neon">
                  <Shield size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{t.killLiarDividend}</h3>
                <p className="text-lg text-white/40 leading-relaxed font-medium">
                   We deploy <span className="text-white">The Mom Test framework</span> at scale. Stripping away politeness to reveal if users will actually pay or just be "nice".
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full p-16 bg-[#030303] hover:bg-[#070707] transition-all group relative border-l border-white/5">
                <div className="text-[10px] font-mono text-white/20 mb-16 uppercase tracking-[0.4em]">Protocol 02</div>
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Activity size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{t.neuralTruth}</h3>
                <p className="text-lg text-white/40 leading-relaxed font-medium">
                   Semantic friction intelligence. We analyze <span className="text-emerald-400">voice tonality</span> and micro-hesitations that text surveys miss entirely.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="h-full p-16 bg-[#030303] hover:bg-[#070707] transition-all group relative border-l border-white/5">
                <div className="text-[10px] font-mono text-white/20 mb-16 uppercase tracking-[0.4em]">Protocol 03</div>
                <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-10 border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <DollarSign size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{t.capitalEfficiency}</h3>
                <p className="text-lg text-white/40 leading-relaxed font-medium">
                   Direct <span className="text-white">Capital Allocation ROI</span>. Save $20,000+ in development on ideas that the market has already rejected via a clinical audit.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
               <div className="md:col-span-2 lg:col-span-3 h-full p-16 bg-[#030303] hover:bg-[#070707] transition-all group relative border-t border-white/5 flex flex-col md:flex-row items-center gap-16 justify-between">
                  <div className="max-w-2xl">
                     <div className="text-[10px] font-mono text-white/20 mb-16 uppercase tracking-[0.4em]">Integration 04</div>
                     <div className="w-16 h-16 rounded-3xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-10 border border-purple-500/20 group-hover:scale-110 transition-transform">
                        <TrendingUp size={28} />
                     </div>
                     <h3 className="text-4xl font-bold text-white mb-6 tracking-tighter">{t.instantRoadmap}</h3>
                     <p className="text-2xl text-white/40 leading-relaxed font-medium">
                        Transformation of raw field data into a <span className="text-purple-400">prioritized technical backlog</span> ready for engineering sprints in seconds.
                     </p>
                  </div>
                  <div className="flex-1 w-full max-w-md p-8 border border-white/10 bg-white/5 rounded-[3rem] shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                     <div className="space-y-4">
                        <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse"></div>
                        <div className="h-4 w-full bg-white/10 rounded-full"></div>
                        <div className="h-4 w-5/6 bg-white/10 rounded-full animate-pulse"></div>
                        <div className="pt-6 flex justify-between">
                           <div className="h-8 w-20 bg-neon/20 rounded-lg"></div>
                           <div className="h-8 w-32 bg-purple-500/20 rounded-lg"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- NEW: VOICE INTELLIGENCE --- */}
      <section className="py-32 px-6 relative z-10 border-t border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
               <div className="relative">
                  {/* Pulse Effect */}
                  <div className="w-full h-[580px] flex flex-col items-center justify-center relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(58,255,151,0.1)] group">
                     {/* 100% Seamless Deep Background - Structural Bypass */}
                     <div className="absolute inset-0 bg-[#070707] z-0"></div>
                     <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-blue-950/40 opacity-70 z-0"></div>
                     <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] contrast-[200%] brightness-125 mix-blend-overlay z-0"></div>
                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 pointer-events-none z-0"></div>

                     {/* PARTICLE ENGINES - Explicitly Centered Containers */}
                     <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                        <div className="relative w-full h-full">
                           {/* INGESTION (Left-to-Center) */}
                           {[...Array(8)].map((_, i) => (
                              <motion.div
                                 key={`music-${i}`}
                                 className="absolute text-neon/30 p-2"
                                 initial={{ x: -400, y: Math.random() * 80 - 40, opacity: 0, scale: 0 }}
                                 animate={{ 
                                    x: 0, 
                                    y: 0, 
                                    opacity: [0, 0.5, 0], 
                                    scale: [0.4, 0.8, 0.4] 
                                 }}
                                 transition={{ 
                                    duration: 3 + Math.random() * 2, 
                                    repeat: Infinity, 
                                    delay: i * 0.7,
                                    ease: "easeInOut" 
                                 }}
                                 style={{ left: '50%', top: '50%' }}
                              >
                                 <Music size={18 + Math.random() * 10} />
                              </motion.div>
                           ))}

                           {/* EJECTION (Center-to-Right) */}
                           {[...Array(10)].map((_, i) => {
                              const Icon = i % 2 === 0 ? DollarSign : (i % 3 === 0 ? Database : TrendingUp);
                              return (
                                 <motion.div
                                    key={`value-${i}`}
                                    className="absolute text-emerald-400/40 p-2"
                                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                                    animate={{ 
                                       x: 400, 
                                       y: Math.random() * 80 - 40, 
                                       opacity: [0, 0.7, 0], 
                                       scale: [0.2, 1, 0.2],
                                       rotate: 360
                                    }}
                                    transition={{ 
                                       duration: 2.5 + Math.random() * 2, 
                                       repeat: Infinity, 
                                       delay: i * 0.5,
                                       ease: "easeInOut" 
                                    }}
                                    style={{ left: '50%', top: '50%' }}
                                 >
                                    <Icon size={14 + Math.random() * 14} />
                                 </motion.div>
                              );
                           })}
                        </div>
                     </div>

                     {/* THE CONVERTER (AI Core) - Balanced & Imposing */}
                     <div className="relative w-80 h-80 flex items-center justify-center z-20">
                        {/* Orbital components */}
                        <div className="absolute inset-0 border border-dashed border-neon/15 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-8 border border-dashed border-neon/10 rounded-full animate-reverse-spin"></div>
                        
                        {/* Central Hub */}
                        <div className="w-44 h-44 rounded-full bg-black/80 backdrop-blur-3xl border border-neon/40 flex items-center justify-center relative shadow-[0_0_120px_rgba(58,255,151,0.2)] group-hover:scale-110 transition-transform duration-1000">
                           <div className="absolute inset-0 bg-gradient-to-tr from-neon/30 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
                           <div className="w-24 h-24 rounded-full bg-neon/10 flex items-center justify-center border border-neon/20 backdrop-blur-md">
                              <Mic size={48} className="text-neon drop-shadow-[0_0_15px_rgba(58,255,151,0.6)]" />
                           </div>
                        </div>

                        {/* Symmetrical Visualizer Ring */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           {[...Array(60)].map((_, i) => (
                              <div key={i} className="absolute w-[1.5px] bg-neon/40 rounded-full origin-bottom" style={{
                                 height: `${12 + Math.random() * 40}px`,
                                 transform: `rotate(${i * (360/60)}deg) translateY(-175px)`,
                                 animation: `sound-wave ${0.4 + Math.random() * 0.8}s ease-in-out infinite`,
                                 animationDelay: `${i * 0.04}s`
                              }}></div>
                           ))}
                        </div>
                     </div>
                     
                     {/* Info Badges */}
                     <div className="mt-12 flex flex-col items-center gap-6 z-30">
                        <div className="flex items-center gap-5">
                           <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-neon/20 to-neon/40"></div>
                           <div className="px-5 py-1.5 bg-neon/5 border border-neon/20 rounded-sm text-[10px] font-mono text-neon uppercase tracking-[0.5em] backdrop-blur-xl">
                              PROCESS: VOICE TO INSIGHT
                           </div>
                           <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-neon/20 to-neon/40"></div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                           <div className="text-xs font-bold text-white uppercase tracking-[0.8em]">
                              ANALYZING <span className="text-neon animate-pulse">LIVE</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </Reveal>

            <Reveal delay={0.2}>
               <div>
                  <div className="mb-4 text-neon font-mono text-xs uppercase tracking-widest">New Feature</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     Stop Typing. <br/>
                     <span className="text-white/50">Start Talking.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     Inspiration doesn't wait for your keyboard. We've integrated an <strong className="text-white">Ultra-Low Latency</strong> voice engine to capture your ideas in flow state.
                  </p>
                  <ul className="space-y-6">
                     <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                           <Mic size={20} className="text-neon" />
                        </div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Hybrid Interviews</h4>
                           <p className="text-sm text-white/50">Respond to your AI consultant with your voice. We capture tone, hesitation, and emotional conviction.</p>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                           <Zap size={20} className="text-purple-400" />
                        </div>
                        <div>
                           <h4 className="text-white font-bold mb-1">Voice-to-Insight</h4>
                           <p className="text-sm text-white/50">Walk and talk. Bring your ideas from cloud to ground in seconds.</p>
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
                  <div className="mb-4 text-blue-400 font-mono text-xs uppercase tracking-widest">Web Intelligence</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     The Eye That <br/>
                     <span className="text-white/50">Sees Everything.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     Your competition uses last year's data. You use <strong>TODAY'S</strong>.
                     We've bridged Gemini's neural core with Google Search in real-time.
                  </p>
                  
                  <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-8">
                     <div className="flex items-center gap-3 mb-2">
                        <Globe size={18} className="text-blue-400" />
                        <span className="text-blue-400 font-bold text-sm">Google Search Grounding</span>
                     </div>
                     <p className="text-sm text-white/70">
                        "Detecting trend spikes in 'B2B SaaS' over the last 7 days..."
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
              <div className="mb-4 text-neon font-mono text-xs uppercase tracking-widest">Architecture</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                The Void Engine. <br/>
                <span className="text-white/50">Mission-Critical Power.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Built on a resilient and aesthetic foundation. Fusing the speed of <strong className="text-white">React + Vite</strong> with the raw intelligence of <strong className="text-white">Cascade Intelligence</strong> (Claude 3.5 + Gemini 2.0). 
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                    <Cpu size={20} className="text-neon" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Chain-of-Thought Reasoning</h4>
                    <p className="text-sm text-white/50">The AI follows a strict cognitive protocol: Evaluate context, validate pain points, cross-reference solutions, and calculate viability scores.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Database size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Industrial-Grade Resilience</h4>
                    <p className="text-sm text-white/50">Hybrid Firestore + LocalStorage system. Your data persists even in zero-connectivity environments.</p>
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
                 <div className="text-green-400 mb-2">// Validation Protocol Initiated</div>
                 <div className="text-white/60 space-y-1">
                    <p><span className="text-neon">{">"}</span> Loading context: Expert vs Novice...</p>
                    <p><span className="text-neon">{">"}</span> Scanning for raw pain evidence...</p>
                    <p><span className="text-neon">{">"}</span> <span className="text-white">DETECTED:</span> "It's urgent, I'm losing money every day."</p>
                    <p><span className="text-neon">{">"}</span> Assigning weight: Intensity (25%) → <span className="text-neon">HIGH</span></p>
                    <p><span className="text-neon">{">"}</span> Generating verdict...</p>
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
              <div className="mb-4 text-purple-400 font-mono text-xs uppercase tracking-widest">Aesthetics</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Void UI. <br/>
                <span className="text-white/50">Design that breathes.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Forget boring spreadsheets. Forget stale forms. We've built an interface that feels alive and reactive.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Eye size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Total Immersion</h4>
                    <p className="text-sm text-white/50">Deep dark modes that eliminate noise, keeping the absolute focus on your strategic data.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Layers size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Dynamic Glassmorphism</h4>
                    <p className="text-sm text-white/50">Frosted glass panels that float over the workspace, creating a natural visual hierarchy.</p>
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
              <div className="mb-4 text-yellow-400 font-mono text-xs uppercase tracking-widest">Interactivity</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Smart Widgets. <br/>
                <span className="text-white/50">Data you can feel.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Data collection doesn't have to be a chore. We've reinvented standard inputs for high-stakes research.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                    <Sliders size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Intensity Gauge</h4>
                    <p className="text-sm text-white/50">Move the gauge to indicate real pain. Don't just check a box; indicate severity.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Financial Selectors</h4>
                    <p className="text-sm text-white/50">Dynamic ranges that adapt to the user's economic reality in real-time.</p>
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
                    <span className="text-white/60">How urgent is this problem?</span>
                    <span className="text-neon font-bold">Critical</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white/60">Willingness to pay</span>
                    <span className="text-neon font-bold">$100+/month</span>
                  </div>
                  <div className="flex gap-2">
                    {['$0', '$10', '$50', '$100', '$1000+'].map((val, i) => (
                      <div key={i} className={`flex-1 py-2 rounded-xl text-center text-xs font-bold ${i === 2 || i === 3 ? 'bg-neon/20 text-neon border border-neon/30' : 'bg-white/5 text-white/40'}`}>
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-white/40 text-xs uppercase tracking-widest mb-2">Signal Detected</div>
                    <div className="text-3xl font-bold text-neon">HIGH DEMAND</div>
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
                  <div className="text-white font-semibold">Gemini 2.0 Flash — Analyzing</div>
                </div>
                
                {[
                  { step: 1, text: 'Analyzing interviewee context...', done: true },
                  { step: 2, text: 'Searching for contradictions in responses...', done: true },
                  { step: 3, text: 'Detecting hidden emotions in text analysis...', done: true },
                  { step: 4, text: 'Calculating success probability...', done: false }
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
              <div className="mb-4 text-cyan-400 font-mono text-xs uppercase tracking-widest">Intelligence</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Chain-of-Thought. <br/>
                <span className="text-white/50">It doesn't just think. It reasons.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Under the hood, Valid.AI runs on <strong className="text-white">Cascade Intelligence</strong> — Claude 3.5 Sonnet for deep tactical reasoning + Gemini 2.0 per real-time web execution. Two minds, one mission. 
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <Brain size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Reasoning Protocols</h4>
                    <p className="text-sm text-white/50">The AI doesn't "summarize". It audits, finds contradictions, and detects hidden emotional conviction.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
                    <Activity size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Probabilistic Analysis</h4>
                    <p className="text-sm text-white/50">Calculates success probability based on patterns from thousands of VC-backed startups.</p>
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
                 <h2 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">{t.fromIdeatoPlan}.</h2>
                 <p className="text-xl text-white/50">The journey from uncertainty to surgical clarity.</p>
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
                      title: "The Seed", 
                      desc: "It all starts with a single thought. Write your idea in natural language, no formalisms needed. The AI aligns with your vision.",
                      icon: Lightbulb,
                      example: '"I want a wearable app that measures chronic stress..."',
                      typingEffect: true
                    },
                    { 
                      step: "02", 
                      title: "Strategic Interrogation", 
                      desc: "The AI acts as a senior consultant. It assumes nothing. It asks dynamic questions to challenge your core assumptions.",
                      icon: MessageSquare,
                      example: '"B2B or B2C? What hardware constraint exists? Why now?"',
                      typingEffect: true
                    },
                    { 
                      step: "03", 
                      title: "The Genesis", 
                      desc: "In seconds, you receive a complete Research Plan: Clear objectives, Personas, and a bias-free Interview Script.",
                      icon: FileText,
                      example: '✅ Research Plan generated',
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
                                   <Cpu size={12} /> {item.typingEffect ? 'Real-time input simulation' : 'Automated output'}
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
                {t.templates}
              </h2>
              <p className="text-xl text-white/50">Don't start from scratch. Start from the top.</p>
              <p className="text-sm text-neon/60 mt-4 font-mono">Institutional Frameworks & YC methodologies included</p>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'SaaS B2B', icon: Server, desc: 'Enterprise software', questions: 24, focus: 'Enterprise' },
              { name: 'E-commerce', icon: ShoppingCart, desc: 'Online store', questions: 18, focus: 'Retail' },
              { name: 'HealthTech', icon: Heart, desc: 'Health & wellness', questions: 22, focus: 'Healthcare' },
              { name: 'FinTech', icon: Wallet, desc: 'Digital finance', questions: 26, focus: 'Finance' },
              { name: 'EdTech', icon: GraduationCap, desc: 'Education', questions: 20, focus: 'Education' },
              { name: 'Marketplace', icon: Store, desc: 'Multi-vendor platform', questions: 28, focus: 'Platform' }
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
                      {template.questions} questions
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
                  Your files, with a spine.
                </h2>
                <p className="text-lg text-white/60 mb-8 leading-relaxed">
                  Have a proprietary document? A YC application draft? Drag it into Valid.AI. Our engine performs a deep semantic scan, architects your project scope, and generates an institutional-grade validation plan.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle size={18} className="text-neon" /> Deep semantic analysis
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle size={18} className="text-neon" /> Entity extraction
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <CheckCircle size={18} className="text-neon" /> Automatic question generation
                  </li>
                </ul>
              </div>
              
              <GlassCard className="p-8 relative overflow-hidden group" glow>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-neon/20 transition-colors">
                    <Upload size={28} className="text-white/60 group-hover:text-neon transition-colors" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{t.dragDrop}</h4>
                  <p className="text-sm text-white/40 mb-6">PDF, DOCX, TXT</p>
                  
                  {/* Simulated File */}
                  <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <FileText size={20} className="text-red-400" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-white text-sm font-medium">my_brilliant_idea.pdf</div>
                      <div className="text-white/40 text-xs">Analyzing...</div>
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
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 tracking-tight">{t.marketVerdict} Dimensions.</h2>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">
                We don't speculate. We audit.
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
                  <span className="text-neon font-bold text-lg tracking-wide">{t.validationEngine}</span>
                  <div className="w-3 h-3 bg-neon rounded-full shadow-[0_0_15px_rgba(0,255,148,0.8)]"></div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="space-y-6">
                <GlassCard className="p-6 flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-neon"></div>
                  <div>
                    <div className="text-white font-bold">GO (Build)</div>
                    <div className="text-sm text-white/40">Score {">"} 70 + High Willingness to Pay.</div>
                  </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <div>
                    <div className="text-white font-bold">PIVOT (Adjust)</div>
                    <div className="text-sm text-white/40">Score {">"} 40. Real problem, incorrect solution.</div>
                  </div>
                </GlassCard>
                <GlassCard className="p-6 flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <div>
                    <div className="text-white font-bold">NO GO (Discard)</div>
                    <div className="text-sm text-white/40">Score {"<"} 40. No market fit detected.</div>
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
                <span className="text-white/50">Clinical institutional credibility.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Anyone can build a PowerPoint. Only VALID.AI provides a <strong className="text-white">verifiable credential</strong> that proves real traction to investors.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">YC Readiness Score™</h4>
                    <p className="text-sm text-white/50">Y Combinator Partner-level severity audit. Volume, consistency, and raw performance metrics.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                    <Lock size={20} className="text-neon" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Live Certificate</h4>
                    <p className="text-sm text-white/50">Encrypted cinematic link: valid.ai/verify/... Share it directly with your VC network.</p>
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
                  <span className="text-xs font-bold text-neon">VERIFIED</span>
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
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Token Usage</div>
                <div className="text-5xl font-black text-white">2,847</div>
                <div className="text-sm text-neon">/ 10,000 this month</div>
              </div>
              
              {/* Gauge Visual */}
              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-8">
                <div className="absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-neon to-emerald-500 rounded-full"></div>
              </div>
              
              {/* Mode Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neon/10 border border-neon/30 rounded-xl text-center">
                  <div className="text-neon font-bold text-sm mb-1">Eco Mode</div>
                  <div className="text-[10px] text-white/40">Fast analysis</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                  <div className="text-white/60 font-bold text-sm mb-1">Deep Research</div>
                  <div className="text-[10px] text-white/40">With web search</div>
                </div>
              </div>
            </GlassCard>
          </Reveal>
          
          <Reveal>
            <div>
              <div className="mb-4 text-emerald-400 font-mono text-xs uppercase tracking-widest">Optimization</div>
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                Resource Allocation. <br/>
                <span className="text-white/50">{t.capitalEfficiency} protocol.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-8">
                Every dollar counts in pre-seed. We've architected a <strong className="text-white">Liquid Resource Management</strong> system that maximizes your ROI.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Eco Mode</h4>
                    <p className="text-sm text-white/50">Structural analysis without heavy consumption. Rapid prototyping with pre-defined heuristics.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Globe size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Deep Research on Demand</h4>
                    <p className="text-sm text-white/50">Activate deep web crawling and multi-factor analysis only when the stakes are high.</p>
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
               <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6">Battle-Tested by Masters.</h2>
               <p className="text-lg text-white/50">
                  Two brilliant minds are pushing our algorithms to the absolute limit. <br/>
                  <span className="text-neon/80 font-mono text-sm uppercase tracking-widest block mt-2">Imminent Reveal</span>
               </p>
            </Reveal>
         </div>

         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
             {[
              { title: "The Unicorn Architect", role: "Classified Identity", desc: "Subjecting the system to world-class investment standards." },
              { title: "The Data Prophet", role: "Classified Identity", desc: "Auditing the scientific precision of our predictive algorithms." }
            ].map((profile, i) => (
               <Reveal key={i} delay={i * 0.2}>
                  <div className="relative group cursor-help">
                     <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 z-20 flex flex-col items-center justify-center p-8 text-center transition-opacity duration-500 group-hover:opacity-10">
                        <LockKeyhole size={48} className="text-white/20 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-1 blur-[6px] select-none">Classified Name</h3>
                        <p className="text-white/40 blur-[4px]">Protected Identity</p>
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
                  <div className="mb-4 text-blue-400 font-mono text-xs uppercase tracking-widest">Documentation</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     Business Lab. <br/>
                     <span className="text-white/50">Your strategic laboratory.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     Generate investor-ready reports with a single click. From Executive Summaries to full Financial Models.
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
                   <h3 className="text-2xl font-bold text-white mb-2">Series A Investor Report</h3>
                   <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
                      Institutional format. Premium HTML or Print-optimized PDF.
                   </p>
                   <button className="px-6 py-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-black transition-all font-bold text-sm flex items-center gap-2 mx-auto">
                      <FileUp size={16} /> Generate Demo Report
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
                           <p className="text-white/80 text-sm">I've analyzed your last 5 interviews. There is a critical contradiction regarding pricing strategy.</p>
                        </div>
                        <div className="bg-neon/10 border border-neon/20 rounded-2xl rounded-tr-none p-4 max-w-[85%] ml-auto">
                           <p className="text-white text-sm">What's the contradiction?</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                           <p className="text-white/80 text-sm">
                              Users claim $50 is "expensive", yet they currently spend $200+ on inefficient manual workarounds. <br/><br/>
                              <span className="text-neon font-bold">Suggestion:</span> Reframe your value prop as "Cost Savings" rather than "New Expense".
                           </p>
                        </div>
                     </div>
                     <div className="p-4 border-t border-white/10">
                        <div className="w-full h-10 bg-white/5 rounded-full border border-white/10 flex items-center px-4 text-white/30 text-sm">
                           Type a message...
                        </div>
                     </div>
                  </div>
               </GlassCard>
            </Reveal>

            <Reveal>
               <div>
                  <div className="mb-4 text-neon font-mono text-xs uppercase tracking-widest">Assistant</div>
                  <h2 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight">
                     Smart Chat. <br/>
                     <span className="text-white/50">Your Co-Pilot.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     You aren't chatting with a generic bot. You're chatting with an assistant that knows <strong className="text-white">EVERYTHING</strong> about your project: metrics, interviews, and documents.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
                        <Database size={20} className="text-neon" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Total Context</h4>
                        <p className="text-sm text-white/50">Recalls every nuance of your validation sessions.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                        <LayoutTemplate size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Tables & Data</h4>
                        <p className="text-sm text-white/50">Ask it to generate competitor comparison tables or financial slices in Markdown instantly.</p>
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
               <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8">Your Data, Your Control.</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/30 transition-all group">
                     <FileText size={32} className="text-white/40 group-hover:text-neon mb-4 mx-auto" />
                     <h3 className="text-white font-bold mb-2">JSON</h3>
                     <p className="text-white/40 text-sm">Structured data for developers.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/30 transition-all group">
                     <LayoutTemplate size={32} className="text-white/40 group-hover:text-blue-400 mb-4 mx-auto" />
                     <h3 className="text-white font-bold mb-2">HTML</h3>
                     <p className="text-white/40 text-sm">Interactive visual reports.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all group">
                     <FileUp size={32} className="text-white/40 group-hover:text-purple-400 mb-4 mx-auto" />
                     <h3 className="text-white font-bold mb-2">PDF Ready</h3>
                     <p className="text-white/40 text-sm">Optimized for print and reading.</p>
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
                  <div className="mb-4 text-emerald-400 font-mono text-xs uppercase tracking-widest">Investment</div>
                  <h2 className="text-5xl md:text-7xl font-semibold text-white mb-8 tracking-tight">
                     Intelligence <br/>
                     <span className="text-white/50">Democratized.</span>
                  </h2>
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                     Consulting firms charge millions. We don't.
                     Access the power of Hybrid Validation for less than the cost of a team dinner.
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Unlimited Audits
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Deep Research with Live Search
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Voice Commands & Hybrid Interviews
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Monthly Trend Reports
                     </li>
                     <li className="flex items-center gap-3 text-white/80">
                        <CheckCircle size={18} className="text-emerald-400" /> Holo-Verify™ Certification
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
                      
                      <div className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">Launch Offer</div>
                      <div className="flex items-baseline justify-center gap-1 mb-8">
                         <span className="text-xl text-white/60">$</span>
                         <span className="text-8xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform duration-500">19</span>
                         <span className="text-xl text-white/60">/mo</span>
                      </div>
                      
                      <div className="text-emerald-400 font-mono text-sm mb-8">APPROX. $75.000 COP</div>
                      
                      <button onClick={handleLaunch} className="w-full py-4 bg-white text-black rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                         Get Started Now
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
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
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
                <span className="text-xs font-bold text-neon uppercase">Pre-Launch Edition</span>
                <span className="text-xs text-white/60">December 2025</span>
              </div>
            </div>
            
            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 tracking-tight leading-tight">
              Exclusive Access
            </h2>
            
            {/* Description */}
            <p className="text-center text-white/60 mb-10 text-lg leading-relaxed max-w-md mx-auto">
              Be the first to validate with science. We are selecting the first cohorts to pilot Valid.AI and demonstrate measurable ROI. Secure your spot.
            </p>
            
            {/* Email Input */}
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email or a colleague's"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder:text-white/30 focus:border-neon/50 focus:outline-none focus:ring-2 focus:ring-neon/20 transition-all text-center"
                />
              </div>
              
              {/* CTA Button */}
              <button 
                onClick={() => setShowModal(true)}
                className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group"
              >
                I want to Validate my Idea
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
            
            {/* Trust Badge */}
            <p className="mt-8 text-center text-xs text-white/30 uppercase tracking-widest">
              No credit card required • Immediate access
            </p>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 text-center text-xs text-white/40 relative z-10 border-t border-white/5 bg-black">
        <p className="mb-4">Designed with <span className="text-red-500">❤</span> in Colombia.</p>
        <p className="opacity-50">Copyright © 2025 Valid.AI Inc.</p>
      </footer>
    </div>
  );
};
