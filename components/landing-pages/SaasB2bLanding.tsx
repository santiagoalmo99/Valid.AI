
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, CheckCircle, Sparkles, Zap, Server, 
  Database, Shield, Users, BarChart3, TrendingUp, 
  Target, Handshake, Globe, Share2, Mail, User, Briefcase, X
} from 'lucide-react';
import { saveLead } from '../../services/firebase';

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
  <div className={`relative overflow-hidden bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 ${glow ? 'shadow-[0_0_40px_rgba(59,130,246,0.1)]' : ''} ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

// --- LEAD CAPTURE MODAL (Reused/Modified for B2B) ---
const LeadCaptureModal = ({ isOpen, onClose, onComplete }: { isOpen: boolean, onClose: () => void, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', company_size: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await saveLead({
        ...formData,
        source: 'saas_b2b_landing', // Tracking specific source
        createdAt: new Date()
    } as any);
    
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
            className="w-full max-w-lg bg-[#0f172a] backdrop-blur-3xl border border-cyan-500/20 rounded-[40px] p-10 relative overflow-hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
              <X size={24} />
            </button>

            {step === 1 ? (
              <>
                <div className="mb-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 mb-6">
                    <Shield size={28} className="text-cyan-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Acceso Enterprise</h3>
                  <p className="text-white/60 text-sm">Validación B2B de grado militar.</p>
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
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono text-sm"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase ml-1">Email Corporativo</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input 
                        required
                        type="email" 
                        placeholder="tu@empresa.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono text-sm"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase ml-1">Rol</label>
                            <select 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all appearance-none text-sm"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                            <option value="" className="bg-slate-900">Selecciona...</option>
                            <option value="founder" className="bg-slate-900">Founder / CEO</option>
                            <option value="cto" className="bg-slate-900">CTO / Tech Lead</option>
                            <option value="product" className="bg-slate-900">Product Manager</option>
                            </select>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-white/60 uppercase ml-1">Tamaño Empresa</label>
                            <select 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:border-cyan-500/50 focus:outline-none transition-all appearance-none text-sm"
                            value={formData.company_size}
                            onChange={e => setFormData({...formData, company_size: e.target.value})}
                            >
                            <option value="" className="bg-slate-900">Selecciona...</option>
                            <option value="1-10" className="bg-slate-900">1-10 (Startup)</option>
                            <option value="11-50" className="bg-slate-900">11-50 (Growth)</option>
                            <option value="50+" className="bg-slate-900">50+ (Scaleup)</option>
                            </select>
                        </div>
                    </div>
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform mt-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSaving ? 'Validando...' : 'Iniciar Protocolo'} <ArrowRight size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-16">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} 
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle size={48} className="text-white" />
                </motion.div>
                <h3 className="text-4xl font-bold text-white mb-3">Acceso Autorizado</h3>
                <p className="text-white/60">Redirigiendo al dashboard...</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- B2B WIDGETS ---

const ChurnPredictor = () => {
    const [features, setFeatures] = useState(5);
    const [research, setResearch] = useState(2);
    
    // Simple logic: More features without research = Higher Churn Risk
    const churnRisk = Math.min(100, Math.max(0, (features * 8) - (research * 15) + 20));
    
    const getDataColor = (risk: number) => {
        if (risk > 70) return "text-red-500";
        if (risk > 30) return "text-yellow-400";
        return "text-emerald-500";
    };

    return (
        <GlassCard className="p-8 border-cyan-500/20" glow>
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <TrendingUp className="text-cyan-400" size={20} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg leading-none">Simulador de Churn</h3>
                    <p className="text-cyan-400/60 text-xs uppercase tracking-wider font-mono">Predictive Engine</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/70">Features Lanzados (al mes)</span>
                        <span className="text-white font-mono">{features}</span>
                    </div>
                    <input 
                        type="range" min="1" max="10" 
                        value={features} onChange={(e) => setFeatures(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/70">Entrevistas de Validación</span>
                        <span className="text-white font-mono">{research}</span>
                    </div>
                    <input 
                        type="range" min="0" max="10" 
                        value={research} onChange={(e) => setResearch(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                   <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">Riesgo de Churn</div>
                   <div className={`text-4xl font-bold ${getDataColor(churnRisk)} tracking-tighter`}>{churnRisk}%</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${churnRisk > 50 ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'}`}>
                    {churnRisk > 50 ? 'ALTO RIESGO' : 'SALUDABLE'}
                </div>
            </div>
        </GlassCard>
    )
}

// --- MAIN SAAS PAGE ---

export const SaasB2bLanding = ({ onStart }: { onStart?: () => void }) => {
  const [showModal, setShowModal] = useState(false);

  // If onStart is provided (e.g. from App.tsx logic), use it. otherwise show modal.
  const handleLaunch = () => {
    const lead = localStorage.getItem('valid_ai_lead');
    if (lead && onStart) {
      onStart();
    } else {
      setShowModal(true);
    }
  };

  const handleModalComplete = () => {
    if (onStart) onStart();
    else window.location.href = '/';
  };

  return (
    <div className="bg-[#020617] text-[#f8fafc] font-sans selection:bg-cyan-500/30 selection:text-white overflow-x-hidden relative">
      
      <LeadCaptureModal isOpen={showModal} onClose={() => setShowModal(false)} onComplete={handleModalComplete} />

      {/* --- ANIMATED BACKGROUND (Darker, Blue/Cyan Tones) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-blue-900/20 rounded-full blur-[120px] animate-chaos-slow mix-blend-screen"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-cyan-900/10 rounded-full blur-[140px] animate-chaos-slow mix-blend-screen" style={{animationDelay: '-5s', animationDirection: 'reverse'}}></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
         
         {/* Grid Overlay for "Tech" feel */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_0px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/5 rounded-full px-6 py-2.5 flex items-center gap-8 shadow-2xl pointer-events-auto transition-all hover:scale-105">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="font-semibold text-sm tracking-tight text-white">Valid.AI <span className="text-cyan-400 font-mono text-xs">/ B2B</span></span>
          </div>
          <div className="w-px h-4 bg-white/10"></div>
          <button onClick={handleLaunch} className="text-xs font-medium text-slate-300 hover:text-white transition-colors">
            Acceso Anticipado
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
             <div className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Server size={14} className="text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">SaaS Intelligence Protocol</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[9rem] font-bold tracking-tighter mb-8 leading-[0.9]">
            Tu SaaS B2B está <br/>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                sangrando dinero.
              </span>
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl font-light text-slate-400 max-w-2xl mx-auto mt-8 leading-relaxed">
            Construir features que nadie pidió es la causa #1 de muerte en B2B. 
            <span className="text-white font-medium"> Valid.AI detiene la hemorragia</span> antes de que escribas una línea de código.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
             <button onClick={handleLaunch} className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Validar Ahora <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </button>
             <button className="px-8 py-4 rounded-full font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                <Users size={18} /> Ver Demo Interactiva
             </button>
          </div>
        </motion.div>
      </section>

      {/* --- THE PAIN (NEUROMARKETING ATTACK) --- */}
      <section className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#020617]">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <Reveal>
               <ChurnPredictor />
            </Reveal>

            <Reveal delay={0.2}>
               <div>
                  <div className="mb-4 text-red-400 font-mono text-xs uppercase tracking-widest">El Problema Invisible</div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                     El "Feature Creep" <br/>
                     <span className="text-white/40">es un asesino silencioso.</span>
                  </h2>
                  <p className="text-lg text-slate-400 leading-relaxed mb-8">
                     Los fundadores B2B se enamoran de la solución. Los compradores B2B solo se preocupan por el ROI. 
                     Hay una brecha mortal entre lo que crees que necesitan y lo que están dispuestos a pagar.
                  </p>
                  
                  <div className="space-y-4 border-l-2 border-white/10 pl-6">
                     <div className="flex gap-4 items-start">
                        <X size={20} className="text-red-500 mt-1 shrink-0" />
                        <p className="text-sm text-slate-300">Ciclos de venta de 6-12 meses para descubrir que el producto "no encaja".</p>
                     </div>
                     <div className="flex gap-4 items-start">
                        <X size={20} className="text-red-500 mt-1 shrink-0" />
                        <p className="text-sm text-slate-300">Churn Rate alto porque construiste para el comprador, no para el usuario.</p>
                     </div>
                  </div>
               </div>
            </Reveal>

         </div>
      </section>

      {/* --- THE SOLUTION (TRUST & TECH) --- */}
      <section className="py-32 px-6 relative z-10 bg-gradient-to-b from-[#020617] to-[#0f172a]">
         <div className="max-w-7xl mx-auto">
            <Reveal>
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Inteligencia Corporativa.</h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        No usamos encuestas. Usamos <span className="text-cyan-400">Agentes de IA</span> entrenados en metodología Enterprise Sales.
                    </p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                        icon: Handshake, 
                        title: "Decision Maker Analysis", 
                        desc: "La IA identifica si estás hablando con quien firma el cheque o con quien solo opina.",
                        color: "text-cyan-400",
                        bg: "bg-cyan-500/10"
                    },
                    { 
                        icon: Target, 
                        title: "ROI Calculator Bot", 
                        desc: "Detecta automáticamente si tu propuesta de valor ahorra dinero real o es solo 'nice to have'.",
                        color: "text-blue-400",
                        bg: "bg-blue-500/10"
                    },
                    { 
                        icon: Shield, 
                        title: "Compliance Check", 
                        desc: "Alerta temprana sobre barreras de seguridad y legales (GDPR, SOC2) que matarán el deal.",
                        color: "text-emerald-400",
                        bg: "bg-emerald-500/10"
                    }
                ].map((item, i) => (
                    <Reveal delay={i * 0.1} key={i}>
                        <GlassCard className="p-8 h-full hover:bg-white/10 transition-colors" glow={i === 1}>
                            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                                <item.icon className={item.color} size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                        </GlassCard>
                    </Reveal>
                ))}
            </div>
         </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5">
         <div className="max-w-4xl mx-auto text-center">
            <Reveal>
               <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                  Deja de adivinar.
               </h2>
               <p className="text-lg text-slate-400 mb-10">
                  Únete a los fundadores que cerraron su Serie A validando con datos, no con intuición.
               </p>
               <button onClick={handleLaunch} className="px-10 py-5 bg-cyan-500 text-black rounded-full font-bold text-xl hover:bg-cyan-400 transition-colors shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                  Validar Estrategia B2B
               </button>
            </Reveal>
         </div>
      </section>

    </div>
  );
};

export default SaasB2bLanding;
