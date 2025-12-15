
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Users, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import { Reveal, GlassCard } from '../LandingPage';

interface MarketplaceLandingProps {
  onStart: () => void;
}

export const MarketplaceLanding: React.FC<MarketplaceLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Ambience - Cyan/Magenta for Tech/Marketplace */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[60vw] h-[60vw] bg-pink-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8">
            <Globe size={14} /> Marketplace Validation Kit
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Cómo resolver el problema del<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Huevo y la Gallina</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Lanzar un marketplace es difícil. Valida la liquidez, equilibra la oferta y demanda, y asegura tu take-rate antes de escalar.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-white to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
            <span className="relative flex items-center gap-3">
              Usar Plantilla Marketplace <ArrowRight size={20} />
            </span>
          </button>
        </Reveal>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal delay={0.4}>
            <GlassCard className="p-8 h-full hover:border-cyan-500/30 transition-colors">
              <Layers className="text-cyan-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Liquidez & Matching</h3>
              <p className="text-slate-400">
                Descubre si tienes suficiente densidad de usuarios para que las transacciones ocurran naturalmente.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.5}>
            <GlassCard className="p-8 h-full hover:border-pink-500/30 transition-colors" glow>
              <Users className="text-pink-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Oferta vs Demanda</h3>
              <p className="text-slate-400">
                Estrategias para validar qué lado del mercado atacar primero (Supply-first vs Demand-first).
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.6}>
            <GlassCard className="p-8 h-full hover:border-purple-500/30 transition-colors">
              <ShieldCheck className="text-purple-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Confianza & Take-Rate</h3>
              <p className="text-slate-400">
                Valida si los usuarios están dispuestos a pagar tu comisión a cambio de la seguridad que ofreces.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
