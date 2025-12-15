import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Users, DollarSign, Shield, XCircle, TrendingUp, Zap } from 'lucide-react';
import { Reveal, GlassCard, LandingHeader, ValidationWidget } from '../LandingPage';

interface SaasLandingProps {
  onStart: () => void;
}

export const SaasLanding: React.FC<SaasLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-emerald-500/30">
      <LandingHeader onLogin={() => window.location.href = '/login'} />
      
      {/* Background Ambience - Mixed with Neon */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] bg-indigo-600/5 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-visible">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <Shield size={14} className="text-emerald-400" /> SaaS Validation Kit
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                Construye SaaS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient-x">
                  Que Las Empresas Compren
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed">
                El 90% de los SaaS fallan por construir "lo que creen" y no "lo que duele".
                <span className="text-white font-medium block mt-2">Valida Churn, LTV y Presupuesto Corporativo en 48 horas.</span>
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <button 
                onClick={onStart}
                className="group relative px-10 py-5 bg-white text-black font-bold rounded-full text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-white to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                <span className="relative flex items-center gap-3">
                  Usar Plantilla Gratuita <ArrowRight size={24} />
                </span>
              </button>
              <p className="mt-4 text-sm text-slate-500 flex items-center gap-2">
                 <CheckCircle size={14} className="text-emerald-500"/> Sin tarjeta de crédito
              </p>
            </Reveal>
          </div>

          {/* Widget Area - Interactive Visual */}
          <div className="relative flex justify-center lg:justify-end">
             <Reveal delay={0.4}>
                <div className="relative">
                   <ValidationWidget color="text-blue-400" bg="bg-blue-500" />
                   
                   {/* Floating Cards */}
                   <motion.div 
                      animate={{ y: [0, -10, 0] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-10 -right-10 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <DollarSign size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-400 uppercase">Willingness to Pay</div>
                            <div className="font-bold text-white">$249/mo verified</div>
                         </div>
                      </div>
                   </motion.div>

                   <motion.div 
                      animate={{ y: [0, 10, 0] }} 
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -bottom-5 -left-10 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                            <XCircle size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-400 uppercase">Churn Risk</div>
                            <div className="font-bold text-white">Detected (High)</div>
                         </div>
                      </div>
                   </motion.div>
                </div>
             </Reveal>
          </div>

        </div>
      </section>

      {/* The Enemy Section (Pain Points) */}
      <section className="relative z-10 py-24 bg-black/50 border-y border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              El "Cementerio SaaS" está lleno de buenas ideas
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={0.1}>
              <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-colors">
                <XCircle className="text-red-500 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">La Trampa del "Nice-to-Have"</h3>
                <p className="text-slate-400">
                  Las empresas te dicen "qué interesante", pero nunca abren la billetera. Tu producto es una vitamina, no una cura.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-8 rounded-3xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                <TrendingUp className="text-orange-500 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Churn Silencioso</h3>
                <p className="text-slate-400">
                  Consigues usuarios, pero se van a los 2 meses. No validaste la retención ni el uso diario antes de codificar.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="p-8 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 transition-colors">
                <DollarSign className="text-yellow-500 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Pricing Incorrecto</h3>
                <p className="text-slate-400">
                  Cobras $20 cuando podrías cobrar $200, o viceversa. Dejas dinero en la mesa por miedo a preguntar.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Solution (Features) */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              Validation Engine 2.0
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Valida como un VC de Silicon Valley
            </h2>
            <p className="text-lg text-slate-400">
              Esta plantilla incluye preguntas psicológicas diseñadas para evadir mentiras piadosas y extraer la verdad financiera.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, color: "text-blue-400", title: "Mom Test B2B", desc: "Detecta falsos positivos al instante." },
              { icon: BarChart3, color: "text-purple-400", title: "Unit Economics", desc: "Proyecta LTV y CAC reales." },
              { icon: Zap, color: "text-yellow-400", title: "Pain Intensity", desc: "Mide la urgencia real del problema." },
              { icon: CheckCircle, color: "text-emerald-400", title: "Features Core", desc: "Separa lo vital de lo trivial." }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <GlassCard className="p-6 h-full hover:bg-white/5 transition-all group cursor-default">
                  <feature.icon className={`${feature.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20 pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Deja de adivinar. <br className="hidden md:block" />
              <span className="text-blue-400">Empieza a validar.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Tu tiempo es tu recurso más valioso. No lo gastes construyendo algo que nadie va a comprar.
            </p>
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-white text-black font-bold rounded-full text-xl shadow-xl hover:scale-105 transition-transform"
            >
              Comenzar Validación Ahora
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
