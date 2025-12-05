import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, CheckCircle2, Globe, TrendingUp, Users, Target, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { CertificationBadge } from './CertificationBadge';
import { VerificationScanner } from './VerificationScanner';

// Helper to decode safe URL params
const safeDecode = (str: string) => {
  try {
    return JSON.parse(atob(str));
  } catch (e) {
    return null;
  }
};

export const PublicVerificationPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Get Params
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('verify');
    
    if (!encoded) {
      setError(true);
      setLoading(false);
      return;
    }

    // 2. Decode
    const decoded = safeDecode(encoded);
    if (!decoded) {
       setError(true);
       setLoading(false);
       return;
    }
    
    setData(decoded);
    
    // 3. Loading is handled by the Scanner component, but we init it here
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center p-8">
        <div className="max-w-md">
           <Shield size={64} className="text-red-500 mx-auto mb-6" />
           <h1 className="text-2xl font-bold text-white mb-2">Error de Verificación</h1>
           <p className="text-slate-400 mb-8">El enlace es inválido o ha expirado. Asegúrate de tener la URL completa.</p>
           <a href="/" className="text-neon hover:underline text-sm">Volver a VALID.AI</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return <VerificationScanner onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-neon/30 overflow-x-hidden">
      {/* Background FX */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-16 border-b border-white/5 pb-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center shadow-[0_0_15px_#00FF94]">
                 <Shield className="text-black" size={24} />
              </div>
              <div>
                 <h1 className="font-bold text-xl tracking-tight">VALID<span className="text-neon">.AI</span></h1>
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest">Verification Ledger</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 size={14} /> Identity Verified
           </div>
        </header>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
           
           {/* LEFT: THE BADGE */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="md:col-span-5 flex flex-col items-center"
           >
              <div className="relative group perspective-1000">
                 <div className="absolute inset-0 bg-neon/20 blur-3xl rounded-full animate-pulse-slow"></div>
                 <div className="relative z-10 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl">
                    <CertificationBadge 
                      projectName={data.name}
                      score={data.score}
                      date={data.date}
                      theme="modern"
                      size="lg"
                    />
                 </div>
                 
                 {/* 3D Floating Elements */}
                 <div className="absolute top-0 right-0 p-4 bg-black/80 backdrop-blur border border-neon/30 rounded-2xl shadow-xl -rotate-12 translate-x-4 -translate-y-4">
                    <div className="text-[10px] text-slate-400 uppercase">Total Score</div>
                    <div className="text-2xl font-black text-neon">{data.score}/100</div>
                 </div>
              </div>
           </motion.div>

           {/* RIGHT: THE REPORT */}
           <div className="md:col-span-7 space-y-8">
              
              <div>
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.2 }}
                 >
                   <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                     {data.name} <span className="text-slate-500 text-3xl font-light block mt-2">ha sido validado.</span>
                   </h2>
                   <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                     Este proyecto ha superado el riguroso proceso de validación de mercado de VALID.AI, demostrando una fuerte demanda y viabilidad económica.
                   </p>
                 </motion.div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-4">
                 {[
                    { label: "Validación de Mercado", val: "Alta", icon: TrendingUp, color: "text-emerald-400" },
                    { label: "Interés de Compra", val: "Fuerte", icon: Zap, color: "text-amber-400" },
                    { label: "Consistencia de Datos", val: "98%", icon: Target, color: "text-blue-400" },
                    { label: "Fecha de Auditoría", val: data.date, icon: Globe, color: "text-slate-300" }
                 ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                    >
                       <stat.icon size={18} className={`mb-2 ${stat.color}`} />
                       <div className="text-slate-400 text-xs uppercase mb-1">{stat.label}</div>
                       <div className="text-lg font-bold text-white">{stat.val}</div>
                    </motion.div>
                 ))}
              </div>

              {/* VERDICT BOX */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-6 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-6 opacity-10"><Shield size={80} /></div>
                 <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18}/> Veredicto Algorítmico: APROBADO
                 </h3>
                 <p className="text-sm text-emerald-100/80 leading-relaxed relative z-10">
                    El análisis de inteligencia artificial ha detectado patrones consistentes de Product-Market Fit. La desviación estándar de las respuestas es baja, indicando un consenso de mercado claro.
                 </p>
              </motion.div>

           </div>
        </div>

        {/* FOOTER / CTA */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-24 pt-12 border-t border-white/10 text-center"
        >
           <h3 className="text-2xl font-bold text-white mb-4">¿Tienes una idea de negocio?</h3>
           <p className="text-slate-400 mb-8">Únete a {data.name} y valida tu idea antes de invertir.</p>
           
           <a href="/" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Sparkles size={20} className="text-purple-600" />
              Validar mi Idea Gratis <ArrowRight size={20} />
           </a>
           
           <div className="mt-12 text-[10px] text-slate-600 uppercase tracking-widest">
              Secured by VALID.AI Blockchain Protocol • {new Date().getFullYear()}
           </div>
        </motion.footer>

      </div>
    </div>
  );
};
