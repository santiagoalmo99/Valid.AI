import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Truck, TrendingUp, Package, Tag, AlertTriangle, XCircle, DollarSign, Globe, ShieldCheck } from 'lucide-react';
import { Reveal, GlassCard, LandingHeader, ValidationWidget } from '../LandingPage';

interface EcommerceLandingProps {
  onStart: () => void;
}

export const EcommerceLanding: React.FC<EcommerceLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-emerald-500/30">
      <LandingHeader onLogin={() => window.location.href = '/login'} />

      {/* Background Ambience - Green/Gold/Neon */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[30%] w-[40vw] h-[40vw] bg-teal-900/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-visible">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <ShoppingCart size={14} /> E-commerce Validation Protocol
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight uppercase">
                Sell Products <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-400 animate-gradient-x">
                  People Actually Want
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed font-light">
                Dead inventory bankrupts stores faster than bad ads.
                <span className="text-white font-medium block mt-2 italic">Validate Demand, Unit Economics, and Supply Chain before committing capital.</span>
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <button 
                onClick={onStart}
                className="group relative px-10 py-5 bg-white text-black font-bold rounded-full text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-white to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                <span className="relative flex items-center gap-3 uppercase tracking-tighter">
                  Deploy E-commerce Framework <ArrowRight size={24} />
                </span>
              </button>
            </Reveal>
          </div>

          {/* Visualization */}
          <div className="relative flex justify-center lg:justify-end">
             <Reveal delay={0.4}>
                <div className="relative">
                   <ValidationWidget color="text-emerald-400" bg="bg-emerald-500" />
                   
                   {/* Floating Metrics */}
                   <motion.div 
                      animate={{ x: [0, 10, 0] }} 
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-0 -left-5 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                            <Tag size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Margin Audit</div>
                            <div className="font-bold text-white tracking-tighter">45% Gross</div>
                         </div>
                      </div>
                   </motion.div>

                   <motion.div 
                      animate={{ y: [0, 10, 0] }} 
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute bottom-10 -right-5 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl"
                   >
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Truck size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Supply Chain</div>
                            <div className="font-bold text-white">Verified</div>
                         </div>
                      </div>
                   </motion.div>
                </div>
             </Reveal>
          </div>

        </div>
      </section>

      {/* The Enemy Section */}
      <section className="relative z-10 py-32 bg-black/50 border-y border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 uppercase tracking-tighter">
              Why 95% of Online Stores <span className="text-red-500">Decommission</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Reveal delay={0.1}>
              <div className="p-10 rounded-3xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-all group">
                <Package className="text-red-500 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Dead Inventory</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Procuring stock based on intuition rather than verified demand. Your capital ends up collecting dust in a warehouse.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-10 rounded-3xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-all group">
                <Truck className="text-orange-500 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Logistics Latency</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Failure to calculate dynamic shipping, returns, and customs. Your margin evaporates during transit.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="p-10 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 transition-all group">
                <AlertTriangle className="text-yellow-500 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">CAC Insolvency</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Spending $50 in acquisition capital to sell a $40 product. Unit economics that guarantee liquidation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="relative z-10 py-40">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
              Smart Commerce Intelligence
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tighter">
              Pre-Launch Market Clinical Audit
            </h2>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              Synthesize competitor behavior, dynamic pricing, and structural demand. Avoid saturated markets and identify your Blue Ocean.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, color: "text-emerald-400", title: "Synthesized Demand", desc: "Measure purchase intent vs. vanity metrics." },
              { icon: Tag, color: "text-amber-400", title: "Pricing Power", desc: "Identify the optimal market equilibrium." },
              { icon: Globe, color: "text-cyan-400", title: "Global Arbitrage", desc: "Detect viral shifts before the competition." },
              { icon: ShieldCheck, color: "text-teal-400", title: "Margin Defense", desc: "Integrated hidden-fee logic engine." }
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
        <div className="container mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h2 className="text-6xl md:text-8xl font-bold mb-10 uppercase tracking-tighter">
              Your Next Best-Seller <br />
              <span className="text-emerald-400">Begins Here.</span>
            </h2>
            <p className="text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Join elite entrepreneurs who validated their online footprints without risking legacy capital.
            </p>
            <button 
              onClick={onStart}
              className="px-16 py-8 bg-white text-black font-black uppercase tracking-widest rounded-full text-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:scale-105 transition-all hover:bg-emerald-400"
            >
              Initialize E-commerce Audit
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
