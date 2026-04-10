import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Users, RefreshCw, Layers, ShieldCheck, Scale, AlertOctagon, HeartHandshake, Rocket } from 'lucide-react';
import { Reveal, GlassCard, LandingHeader, ValidationWidget } from '../LandingPage';

interface MarketplaceLandingProps {
  onStart: () => void;
}

export const MarketplaceLanding: React.FC<MarketplaceLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-cyan-500/30">
      <LandingHeader onLogin={() => window.location.href = '/login'} />

      {/* Background Ambience - Cyan/Pink/Neon */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[60vw] h-[60vw] bg-pink-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-visible">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <Globe size={14} /> Marketplace Validation Protocol
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight uppercase">
                Resolve the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 animate-gradient-x">
                   Liquidity Paradox
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed font-light">
                Without liquidity, your marketplace is a Ghost Colony.
                <span className="text-white font-medium block mt-2 italic">Equilibrate Supply and Demand before committing a single dollar to marketing capital.</span>
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <button 
                onClick={onStart}
                className="group relative px-10 py-5 bg-white text-black font-bold rounded-full text-xl shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-white to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                <span className="relative flex items-center gap-3 uppercase tracking-tighter">
                  Deploy Marketplace Framework <ArrowRight size={24} />
                </span>
              </button>
            </Reveal>
          </div>

          {/* Visualization */}
          <div className="relative flex justify-center lg:justify-end">
             <Reveal delay={0.4}>
                <div className="relative">
                   <ValidationWidget color="text-pink-400" bg="bg-pink-500" />
                   
                   {/* Floating Metrics */}
                   <motion.div 
                      animate={{ scale: [1, 1.05, 1] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-5 left-0 bg-black/80 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-xl"
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Users size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Supply Latency</div>
                            <div className="font-bold text-white tracking-tighter">Active (Verified)</div>
                         </div>
                      </div>
                   </motion.div>

                   <motion.div 
                      animate={{ scale: [1, 1.05, 1] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      className="absolute bottom-5 -right-5 bg-black/80 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-xl"
                   >
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
                            <HeartHandshake size={16} />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Liquidity Index</div>
                            <div className="font-bold text-white tracking-tighter">High Potential</div>
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
              Why Marketplaces Are <span className="text-teal-400">Structurally Fragile</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Reveal delay={0.1}>
              <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all group">
                <AlertOctagon className="text-cyan-400 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">The Ghost Colony Fallacy</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Buyers exit because they see no sellers. Sellers exit because they see no buyers. Both churn permanently.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-pink-500/30 transition-all group">
                <HeartHandshake className="text-pink-400 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Systemic Disintermediation</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  Users identify each other on your platform, then execute the capital transfer elsewhere to bypass your commission.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="p-10 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/30 transition-all group">
                <Scale className="text-purple-400 mb-8 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Equilibrium Fragility</h3>
                <p className="text-slate-400 font-light leading-relaxed">
                  High Demand with low Supply (or vice-versa) destroys platform trust and retention at an exponential rate.
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
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-widest border border-pink-500/30">
              Network Effects Engine
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tighter">
              Engineer Your <span className="text-pink-400">Network Velocity</span>
            </h2>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              This framework identifies your primary bottleneck: Is your market Supply vs. Demand constrained?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Layers, color: "text-cyan-400", title: "Minimum Liquidity", desc: "Define the atomic density required for launch." },
              { icon: ShieldCheck, color: "text-purple-400", title: "Trust Framework", desc: "Clinical protocols for bridging anonymous trust." },
              { icon: RefreshCw, color: "text-pink-400", title: "Transaction Velocity", desc: "Validate recurring vs. one-off behavior." },
              { icon: Rocket, color: "text-orange-400", title: "Go-to-Market", desc: "Strategic prioritization: Bowling Alley vs. Blitz." }
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
              Connect the World. <br />
              <span className="text-pink-400">Validate Your Market.</span>
            </h2>
            <p className="text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              The world's largest platforms began by resolving a granular friction point for a specific institutional niche.
            </p>
            <button 
              onClick={onStart}
              className="px-16 py-8 bg-white text-black font-black uppercase tracking-widest rounded-full text-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:scale-105 transition-all hover:bg-pink-400"
            >
              Initialize Marketplace Audit
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
