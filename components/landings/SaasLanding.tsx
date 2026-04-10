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
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-visible">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <Shield size={14} className="text-emerald-400" /> SaaS Validation Framework
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight uppercase">
                Engineer SaaS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient-x">
                  Enterprises Buy
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed font-light">
                90% of SaaS startups fail by building "what they want" instead of "what the market bleeds for."
                <span className="text-white font-medium block mt-2 italic">Audit Churn, LTV, and Enterprise Procurement Budgets in 48 hours.</span>
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <button 
                onClick={onStart}
                className="group relative px-10 py-5 bg-white text-black font-bold rounded-full text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-white to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                <span className="relative flex items-center gap-3 uppercase tracking-tighter">
                   Initialize SaaS Audit <ArrowRight size={24} />
                </span>
              </button>
              <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2 font-bold">
                 <CheckCircle size={14} className="text-emerald-500"/> Institutional Access Ready
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
                      className="absolute -top-10 -right-10 bg-black/80 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <DollarSign size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Pricing Threshold</div>
                            <div className="font-bold text-white tracking-tighter">$249/mo verified</div>
                         </div>
                      </div>
                   </motion.div>

                   <motion.div 
                      animate={{ y: [0, 10, 0] }} 
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -bottom-5 -left-10 bg-black/80 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                            <XCircle size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Churn Risk</div>
                            <div className="font-bold text-white tracking-tighter">Detected (High)</div>
                         </div>
                      </div>
                   </motion.div>
                </div>
             </Reveal>
          </div>

        </div>
      </section>

      {/* The Enemy Section (Pain Points) */}
      <section className="relative z-10 py-32 bg-black/50 border-y border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 uppercase tracking-tighter">
              The <span className="text-red-500">SaaS Decommission</span> Yard
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Reveal delay={0.1}>
              <div className="p-10 rounded-3xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-all group">
                <XCircle className="text-red-500 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">The "Nice-to-Have" Fallacy</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Enterprises offer praise, but never commit capital. Your product is a secondary utility, not a structural necessity.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-10 rounded-3xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-all group">
                <TrendingUp className="text-orange-500 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Passive Retention Leakage</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Acquiring users only to lose them in the 60-day window. You failed to validate the habit-loop before shipment.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="p-10 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 transition-all group">
                <DollarSign className="text-yellow-500 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Pricing Misalignment</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Charging $20 for a $200 value prop, or vice-versa. Leaving institutional capital on the table due to fear of the "Ask."
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Solution (Features) */}
      <section className="relative z-10 py-40">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30">
              SaaS Engine 3.0
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tighter">
              Audit with <span className="text-indigo-400">Venture Capital</span> Precision
            </h2>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              This framework utilizes psychological gating designed to bypass polite feedback and extract financial truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, color: "text-blue-400", title: "Institutional Mom Test", desc: "Instantly detect false positive interest." },
              { icon: BarChart3, color: "text-purple-400", title: "Unit Economics", desc: "Project high-fidelity LTV and CAC." },
              { icon: Zap, color: "text-yellow-400", title: "Friction Intensity", desc: "Measure the clinical urgency of the problem." },
              { icon: CheckCircle, color: "text-emerald-400", title: "Atomic Feature Gating", desc: "Separate the vital from the trivial." }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <GlassCard className="p-8 h-full hover:bg-white/5 transition-all group cursor-default border border-white/5 hover:border-white/20 rounded-[32px]">
                  <feature.icon className={`${feature.color} mb-6 group-hover:scale-110 transition-transform duration-500`} size={40} />
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-40 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20 pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h2 className="text-6xl md:text-8xl font-bold mb-10 uppercase tracking-tighter">
              Stop Guessing. <br className="hidden md:block" />
              <span className="text-blue-400">Start Auditing.</span>
            </h2>
            <p className="text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Your time is your most finite asset. Do not waste it building for a market that doesn't exist.
            </p>
            <button 
              onClick={onStart}
              className="px-16 py-8 bg-white text-black font-black uppercase tracking-widest rounded-full text-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:scale-105 transition-all hover:bg-blue-400"
            >
              Comenzar Validación Ahora
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
