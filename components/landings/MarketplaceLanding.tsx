import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Users, RefreshCw, Layers, ShieldCheck, Scale, AlertOctagon, HeartHandshake, Rocket } from 'lucide-react';
import { Reveal, GlassCard } from '../LandingPage';

interface MarketplaceLandingProps {
  onStart: () => void;
}

export const MarketplaceLanding: React.FC<MarketplaceLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Ambience - Cyan/Magenta for Tech/Marketplace */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[60vw] h-[60vw] bg-pink-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-visible">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
              <Globe size={14} /> Marketplace Validation Kit
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
              Resuelve el Problema del <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 animate-gradient-x">
                Huevo y la Gallina
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed">
              Lanzar un marketplace es brutalmente difícil. Valida la liquidez y evita la "fuga de plataforma" antes de escalar.
              <br className="hidden md:block" />
              <span className="text-white font-medium">Equilibra Oferta y Demanda sin quemar capital.</span>
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <button 
              onClick={onStart}
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-full text-xl shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-white to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
              <span className="relative flex items-center gap-3">
                Usar Plantilla Marketplace <ArrowRight size={24} />
              </span>
            </button>
            <p className="mt-4 text-sm text-slate-500">Para plataformas como Airbnb, Uber, Fiverr, etc.</p>
          </Reveal>
        </div>
      </section>

      {/* The Enemy Section */}
      <section className="relative z-10 py-24 bg-black/50 border-y border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Por qué los Marketplaces son tan Difíciles
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={0.1}>
              <div className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700 hover:border-cyan-500/30 transition-colors">
                <AlertOctagon className="text-cyan-400 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">La Ciudad Fantasma</h3>
                <p className="text-slate-400">
                  Usuarios compradores entran y no ven vendedores. Vendedores entran y no ven compradores. Ambos se van para siempre.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700 hover:border-pink-500/30 transition-colors">
                <HeartHandshake className="text-pink-400 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Disintermediación</h3>
                <p className="text-slate-400">
                  Tus usuarios se encuentran en tu plataforma, pero hacen el trato por fuera para evitar tu comisión.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700 hover:border-purple-500/30 transition-colors">
                <Scale className="text-purple-400 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Desequilibrio Fatal</h3>
                <p className="text-slate-400">
                  Tener mucha demanda y poca oferta (o viceversa) destruye la confianza y la retención instantáneamente.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider">
              Network Effects Engine
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Diseña tu Efecto de Red
            </h2>
            <p className="text-lg text-slate-400">
              Esta plantilla te ayuda a definir si atacar primero la Oferta o la Demanda (Supply vs Demand Constraint).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layers, color: "text-cyan-400", title: "Liquidez Mínima", desc: "Define la densidad necesaria para que funcione." },
              { icon: ShieldCheck, color: "text-purple-400", title: "Trust Framework", desc: "Mecanismos para generar confianza entre extraños." },
              { icon: RefreshCw, color: "text-pink-400", title: "Frequency Check", desc: "Valida la recurrencia de las transacciones." },
              { icon: Rocket, color: "text-orange-400", title: "Go-to-Market", desc: "Estrategia de lanzamiento: Bolos vs Bombardeo." }
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
        <div className="container mx-auto px-6 text-center relative z-10">
          <Reveal>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Conecta el Mundo. <br />
              <span className="text-pink-400">Valida tu Mercado.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Las plataformas más grandes del mundo empezaron resolviendo un problema pequeño para un nicho específico.
            </p>
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-white text-black font-bold rounded-full text-xl shadow-xl hover:scale-105 transition-transform"
            >
              Comenzar Validación Marketplace
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
