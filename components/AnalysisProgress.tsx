import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Target, Zap } from 'lucide-react';

interface AnalysisProgressProps {
  stage: 'discovering' | 'analyzing' | 'saving' | 'complete';
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ stage }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = {
    discovering: [
      "🔍 Conectando con Gemini AI...",
      "🌐 Verificando modelos disponibles...",
      "⚙️ Preparando análisis..."
    ],
    analyzing: [
      "🧠 Analizando respuestas del entrevistado...",
      "📊 Evaluando intensidad del problema...",
      "💡 Calculando fit de la solución...",
      "💰 Determinando disposición a pagar...",
      "🎯 Generando insights estratégicos..."
    ],
    saving: [
      "💾 Guardando análisis en la nube...",
      "☁️ Sincronizando datos...",
      "✨ Finalizando..."
    ],
    complete: [
      "✅ ¡Análisis completado!"
    ]
  };

  const currentMessages = messages[stage];

  useEffect(() => {
    if (stage === 'complete') return;
    
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % currentMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [stage, currentMessages.length]);

  const getIcon = () => {
    switch (stage) {
      case 'discovering': return <Zap className="text-neon animate-pulse" size={24} />;
      case 'analyzing': return <Brain className="text-neon animate-pulse" size={24} />;
      case 'saving': return <Sparkles className="text-neon animate-pulse" size={24} />;
      case 'complete': return <Target className="text-neon" size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-3xl border border-neon/20 shadow-2xl max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center gap-6">
          {/* Animated Icon */}
          <motion.div
            animate={{ rotate: stage === 'analyzing' ? 360 : 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {getIcon()}
          </motion.div>

          {/* Message */}
          <motion.div
            key={currentMessages[messageIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <p className="text-white text-lg font-medium mb-2">
              {currentMessages[messageIndex]}
            </p>
            {stage !== 'complete' && (
              <p className="text-slate-400 text-sm">
                Esto puede tardar unos segundos...
              </p>
            )}
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-neon to-cyan-400 relative overflow-hidden"
              initial={{ width: "0%" }}
              animate={{ 
                width: stage === 'discovering' ? "20%" : 
                       stage === 'analyzing' ? "75%" : 
                       stage === 'saving' ? "95%" : "100%" 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ width: '50%' }}
              />
            </motion.div>
          </div>

          {/* Spinner dots */}
          {stage !== 'complete' && (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-neon rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
