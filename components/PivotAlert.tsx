
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, Lightbulb, X } from 'lucide-react';
import { analyzePivotNeeds } from '../utils/pivotLogic';

interface PivotAlertProps {
  scores: {
    problemIntensity: number;
    willingnessToPay: number;
    marketSize: number;
  };
}

export const PivotAlert: React.FC<PivotAlertProps> = ({ scores }) => {
  const [recommendation, setRecommendation] = useState<ReturnType<typeof analyzePivotNeeds>>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const result = analyzePivotNeeds(scores);
    if (result && result.type !== 'success') {
      setRecommendation(result);
      setVisible(true);
    } else {
        setVisible(false);
    }
  }, [scores.problemIntensity, scores.willingnessToPay]);

  if (!recommendation || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-24 right-6 z-[90] max-w-sm"
      >
        <div className="glass-panel border-l-4 border-l-amber-500 bg-black/80 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <button 
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 text-slate-500 hover:text-white"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500 shrink-0">
               {recommendation.type === 'pivot' ? <TrendingUp size={24} /> : <AlertTriangle size={24} />}
            </div>
            
            <div>
              <h4 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-1">
                Alerta de Estrategia
              </h4>
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                {recommendation.title}
              </h3>
              <p className="text-slate-300 text-sm mb-3">
                {recommendation.message}
              </p>
              
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-1 text-neon text-xs font-bold uppercase">
                  <Lightbulb size={12} /> Sugerencia:
                </div>
                <p className="text-xs text-slate-400 italic">
                  "{recommendation.strategy}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
