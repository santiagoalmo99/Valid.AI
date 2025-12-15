import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, Truck, TrendingUp, Package, Tag, AlertTriangle, XCircle, DollarSign, Globe, ShieldCheck } from 'lucide-react';
import { Reveal, GlassCard } from '../LandingPage';

interface EcommerceLandingProps {
  onStart: () => void;
}

export const EcommerceLanding: React.FC<EcommerceLandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Background Ambience - Green/Gold for Commerce */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[30%] w-[40vw] h-[40vw] bg-teal-900/10 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-visible">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
              <ShoppingCart size={14} /> E-commerce Validation Kit
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
              Vende Productos <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-400 animate-gradient-x">
                Que La Gente Desea
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed">
              El inventario muerto es la pesadilla del E-commerce.
              <br className="hidden md:block" />
              <span className="text-white font-medium">Valida Demanda, Márgenes y Logística antes de importar un solo contenedor.</span>
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <button 
              onClick={onStart}
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-full text-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-white to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
              <span className="relative flex items-center gap-3">
                Usar Plantilla E-commerce <ArrowRight size={24} />
              </span>
            </button>
            <p className="mt-4 text-sm text-slate-500">Ideal para Dropshipping, DTC y Marcas Privadas</p>
          </Reveal>
        </div>
      </section>

      {/* The Enemy Section */}
      <section className="relative z-10 py-24 bg-black/50 border-y border-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Por qué el 95% de las Tiendas Online Fracasan
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={0.1}>
              <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-colors">
                <Package className="text-red-500 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Inventario Muerto</h3>
                <p className="text-slate-400">
                  Comprar stock basado en corazonadas en lugar de datos. Terminas con cajas llenas de polvo en tu garaje.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-8 rounded-3xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                <Truck className="text-orange-500 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">Pesadilla Logística</h3>
                <p className="text-slate-400">
                  No calcular costos de envío, devoluciones y aduanas. Tu margen de ganancia se evapora en el transporte.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="p-8 rounded-3xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/30 transition-colors">
                <AlertTriangle className="text-yellow-500 mb-6" size={40} />
                <h3 className="text-xl font-bold text-white mb-3">CAC Insostenible</h3>
                <p className="text-slate-400">
                  Gastar $50 en ads para vender un producto de $40. Matemáticas que garantizan la bancarrota.
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
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Smart Commerce Check
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Inteligencia de Mercado antes del Lanzamiento
            </h2>
            <p className="text-lg text-slate-400">
              Analiza competidores, precios y demanda real. Evita productos saturados y encuentra tu océano azul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, color: "text-emerald-400", title: "Demanda Real", desc: "Mide intención de compra vs likes." },
              { icon: Tag, color: "text-amber-400", title: "Pricing Power", desc: "Encuentra el precio óptimo del mercado." },
              { icon: Globe, color: "text-cyan-400", title: "Global Trends", desc: "Detecta productos virales antes que nadie." },
              { icon: ShieldCheck, color: "text-teal-400", title: "Margin Protection", desc: "Calculadora de costos oculta." }
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
              Tu Próximo Best-Seller <br />
              <span className="text-emerald-400">Empieza Aquí.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
              Únete a miles de emprendedores que validaron sus tiendas online sin arriesgar sus ahorros en inventario.
            </p>
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-white text-black font-bold rounded-full text-xl shadow-xl hover:scale-105 transition-transform"
            >
              Iniciar Validación E-commerce
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
