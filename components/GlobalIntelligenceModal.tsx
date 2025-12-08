// components/GlobalIntelligenceModal.tsx
// Premium Apple-like experience for monthly Global Intelligence Reports
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles, TrendingUp, Calendar, ChevronRight, X, RefreshCw, Zap, BarChart3, Target, ArrowUpRight, Clock } from 'lucide-react';
import { TrendReport } from '../services/trendService';

interface GlobalIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  report: TrendReport | null;
  hasReportThisMonth: boolean;
}

// Premium Notification Banner (replaces the old small tooltip)
export const GlobalIntelligenceBanner: React.FC<{
  onOpen: () => void;
  hasReport: boolean;
}> = ({ onOpen, hasReport }) => {
  const [visible, setVisible] = useState(true);
  const currentMonth = new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  // Auto-dismiss after 10 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] flex items-center justify-center pointer-events-none"
        >
          <button
            onClick={onOpen}
            className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-neon/30 
              px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(0,255,148,0.2)]
              hover:shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_50px_rgba(0,255,148,0.3)]
              hover:border-neon/60 transition-all duration-300 flex items-center gap-4 group"
          >
            <div className="relative">
               <Globe className="text-neon animate-pulse-slow" size={20} />
               <div className="absolute top-0 right-0 w-2 h-2 bg-neon rounded-full animate-ping" />
            </div>
            
            <div className="flex flex-col items-start">
               <span className="text-[10px] text-neon font-bold uppercase tracking-widest leading-none mb-0.5">
                 INTELIGENCIA GLOBAL
               </span>
               <span className="text-sm font-bold text-white leading-none group-hover:text-neon transition-colors">
                 Reporte de {currentMonth} Disponible
               </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-neon group-hover:text-black transition-colors ml-2">
               <ChevronRight size={16} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Full Premium Modal
export const GlobalIntelligenceModal: React.FC<GlobalIntelligenceModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
  report,
  hasReportThisMonth
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'sectors'>('overview');
  const currentMonth = new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden 
            border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 p-8 pb-6 border-b border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon/20 via-emerald-500/10 to-cyan-500/10 
                  flex items-center justify-center border border-neon/20 shadow-lg">
                  <Globe size={32} className="text-neon" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-neon/10 text-neon text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-neon/20">
                      <Clock size={10} className="inline mr-1 -mt-0.5" />
                      Análisis Mensual
                    </span>
                    <span className="text-slate-500 text-xs">
                      {currentMonth}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    Global Intelligence Report
                  </h2>
                  <p className="text-slate-400 text-sm mt-1 max-w-lg">
                    Análisis de tendencias globales de innovación generado mensualmente con datos en tiempo real vía Google Search.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Value Proposition */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: 'Web Grounding', desc: 'Datos en tiempo real' },
                { icon: TrendingUp, label: '5+ Tendencias', desc: 'Curadas por IA' },
                { icon: Target, label: 'Actionable', desc: 'Insights aplicables' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center">
                    <item.icon size={18} className="text-neon" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{item.label}</div>
                    <div className="text-slate-500 text-xs">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 overflow-y-auto max-h-[50vh] custom-scrollbar">
            {!report ? (
              // No Report - Generate State
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neon/10 to-transparent 
                  flex items-center justify-center border border-neon/20">
                  <Sparkles size={40} className="text-neon" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {hasReportThisMonth ? 'Reporte Disponible' : 'Genera tu Reporte de ' + currentMonth}
                </h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                  Nuestro motor de IA analiza las últimas tendencias globales en tecnología, 
                  startups y comportamiento del consumidor usando búsqueda web en tiempo real.
                </p>
                <button
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="bg-neon text-black font-bold px-8 py-4 rounded-xl 
                    hover:brightness-110 transition-all flex items-center gap-3 mx-auto
                    shadow-[0_0_30px_rgba(0,255,148,0.3)] hover:shadow-[0_0_40px_rgba(0,255,148,0.4)]
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Analizando tendencias globales...
                    </>
                  ) : (
                    <>
                      <Globe size={18} />
                      Generar Global Intelligence Report
                    </>
                  )}
                </button>
                <p className="text-slate-500 text-xs mt-4">
                  ⏱️ Tiempo estimado: 15-30 segundos
                </p>
              </div>
            ) : (
              // Report Content
              <div className="space-y-8">
                {/* Market Sentiment & Sectors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                    <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">Sentimiento de Mercado</div>
                    <div className={`text-3xl font-bold ${
                      report.marketSentiment === 'Bullish' ? 'text-emerald-400' :
                      report.marketSentiment === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {report.marketSentiment === 'Bullish' && '📈 '}
                      {report.marketSentiment === 'Bearish' && '📉 '}
                      {report.marketSentiment === 'Neutral' && '➡️ '}
                      {report.marketSentiment}
                    </div>
                  </div>
                  <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 col-span-2">
                    <div className="text-slate-400 text-xs uppercase tracking-widest mb-3">Sectores Emergentes</div>
                    <div className="flex gap-2 flex-wrap">
                      {report.emergingSectors.map((s, i) => (
                        <span key={i} className="bg-neon/10 text-neon px-4 py-2 rounded-xl text-sm font-medium border border-neon/20 hover:bg-neon/20 transition-colors cursor-default">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trends List */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-neon" />
                    Top Tendencias del Mes
                  </h3>
                  <div className="space-y-3">
                    {report.trends.map((trend, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.02] hover:bg-white/[0.05] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group cursor-default"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg font-medium">
                                {trend.category}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
                                trend.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                                trend.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                                {trend.impact === 'High' ? '🔥 Alto Impacto' : 
                                 trend.impact === 'Medium' ? '⚡ Impacto Medio' : '📊 Impacto Bajo'}
                              </span>
                            </div>
                            <h4 className="text-white font-semibold text-lg group-hover:text-neon transition-colors">
                              {trend.trend}
                            </h4>
                            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                              {trend.description}
                            </p>
                          </div>
                          <ArrowUpRight size={20} className="text-slate-600 group-hover:text-neon transition-colors shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="relative z-10 p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
            <div className="text-slate-500 text-xs">
              {report ? (
                <>Generado el {new Date(report.generatedAt).toLocaleDateString('es-ES', { 
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}</>
              ) : (
                <>Powered by Google Gemini 2.5 + Search Grounding</>
              )}
            </div>
            <div className="flex items-center gap-2">
              {report && (
                <button
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="bg-white/5 hover:bg-white/10 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                  Regenerar
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GlobalIntelligenceModal;
