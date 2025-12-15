
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Truck, TrendingUp, Package, Tag } from 'lucide-react';
import { Reveal, GlassCard } from '../LandingPage';

interface EcommerceLandingProps {
  onStart: () => void;
}

export const EcommerceLanding: React.FC<EcommerceLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Ambience - Green/Gold for Commerce */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
            <ShoppingCart size={14} /> E-commerce Validation Kit
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Script de Validación para <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">E-commerce Rentable</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Olvídate del stock muerto. Valida la demanda real, los márgenes operativos y la logística antes de invertir en inventario.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-white to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
            <span className="relative flex items-center gap-3">
              Usar Plantilla E-commerce <ArrowRight size={20} />
            </span>
          </button>
        </Reveal>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal delay={0.4}>
            <GlassCard className="p-8 h-full hover:border-emerald-500/30 transition-colors">
              <Package className="text-emerald-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Interés de Producto</h3>
              <p className="text-slate-400">
                Mide la intención de compra real frente a "me gusta". Diferencia entre admiradores y compradores.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.5}>
            <GlassCard className="p-8 h-full hover:border-amber-500/30 transition-colors" glow>
              <Truck className="text-amber-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Logística y Márgenes</h3>
              <p className="text-slate-400">
                Detecta fricciones en tiempos de envío y costos ocultos que matan la rentabilidad del e-commerce.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.6}>
            <GlassCard className="p-8 h-full hover:border-cyan-500/30 transition-colors">
              <TrendingUp className="text-cyan-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Tendencias de Consumo</h3>
              <p className="text-slate-400">
                Valida si tu producto es una moda pasajera o una necesidad recurrente con alto LTV.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
