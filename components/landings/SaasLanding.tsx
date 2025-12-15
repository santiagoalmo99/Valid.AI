
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Users, DollarSign, Shield } from 'lucide-react';
import { Reveal, GlassCard } from '../LandingPage';

interface SaasLandingProps {
  onStart: () => void;
}

export const SaasLanding: React.FC<SaasLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            <Shield size={14} /> SaaS B2B Validation Kit
          </div>
        </Reveal>
        
        <Reveal delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            La Plantilla Definitiva para <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Validar SaaS B2B</span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            No construyas otro CRM que nadie quiere. Valida Churn, CAC, LTV y Product-Market Fit antes de escribir una sola línea de código.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
            <span className="relative flex items-center gap-3">
              Usar Plantilla SaaS <ArrowRight size={20} />
            </span>
          </button>
        </Reveal>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal delay={0.4}>
            <GlassCard className="p-8 h-full hover:border-blue-500/30 transition-colors">
              <Users className="text-blue-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">The Mom Test B2B</h3>
              <p className="text-slate-400">
                Preguntas diseñadas para evitar falsos positivos. Descubre si las empresas realmente tienen presupuesto para tu solución.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.5}>
            <GlassCard className="p-8 h-full hover:border-purple-500/30 transition-colors" glow>
              <BarChart3 className="text-purple-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Métricas Unitarias</h3>
              <p className="text-slate-400">
                Valida hipótesis de CAC (Costo de Adquisición) y LTV (Lifetime Value) desde la primera entrevista.
              </p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.6}>
            <GlassCard className="p-8 h-full hover:border-pink-500/30 transition-colors">
              <DollarSign className="text-pink-400 mb-6" size={40} />
              <h3 className="text-2xl font-bold mb-4">Willingness to Pay</h3>
              <p className="text-slate-400">
                Técnicas de pricing psicológico para descubrir cuánto están dispuestos a pagar los gerentes de compra.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
