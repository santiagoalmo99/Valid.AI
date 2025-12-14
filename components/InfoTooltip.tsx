// components/InfoTooltip.tsx - Apple-style hover tooltips
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipContent {
  title: string;
  description: string;
  details?: {
    label: string;
    value: string;
  }[];
  tip?: string;
}

interface InfoTooltipProps {
  content: TooltipContent;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 800, // 0.8 seconds default
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Position styles
  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '12px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '12px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '12px' },
  };

  // Arrow styles
  const arrowStyles = {
    top: { bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    bottom: { top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' },
    left: { right: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
    right: { left: '-6px', top: '50%', transform: 'translateY(-50%) rotate(45deg)' },
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1] // Apple-like easing
            }}
            className="absolute z-[9999] pointer-events-none"
            style={positionStyles[position]}
          >
            {/* Glassmorphism Card */}
            <div className="relative min-w-[280px] max-w-[360px] p-4 rounded-2xl
              bg-slate-900/95 backdrop-blur-2xl border border-white/10
              shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,255,148,0.1)]
              pointer-events-auto
            ">
              {/* Arrow */}
              <div 
                className="absolute w-3 h-3 bg-slate-900/95 border-r border-b border-white/10"
                style={arrowStyles[position]}
              />

              {/* Header */}
              <div className="mb-3">
                <h4 className="text-white font-semibold text-sm tracking-wide">
                  {content.title}
                </h4>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-xs leading-relaxed mb-3">
                {content.description}
              </p>

              {/* Details (if any) */}
              {content.details && content.details.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-white/5">
                  {content.details.map((detail, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">{detail.label}</span>
                      <span className="text-neon text-xs font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tip (if any) */}
              {content.tip && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-slate-400 text-[10px] italic">
                    💡 {content.tip}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Pre-defined tooltip content for common dashboard elements
export const TOOLTIP_CONTENT = {
  totalInterviews: {
    title: 'Total de Entrevistas',
    description: 'Número total de entrevistas de validación completadas para este proyecto. Cada entrevista representa una conversación estructurada con un potencial usuario o cliente.',
    details: [
      { label: 'Mínimo recomendado', value: '10 entrevistas' },
      { label: 'Ideal para validación', value: '20-30' },
    ],
    tip: 'Entre más entrevistas, mayor confianza estadística en tus conclusiones.'
  },
  
  averageScore: {
    title: 'Puntaje Promedio',
    description: 'Promedio ponderado de todas las dimensiones de validación. Mide la calidad general de las señales de mercado recibidas.',
    details: [
      { label: '0-39', value: '🔴 No Go' },
      { label: '40-69', value: '🟡 Pivot' },
      { label: '70-100', value: '🟢 Go' },
    ],
    tip: 'Un score > 70 indica alta probabilidad de product-market fit.'
  },

  status: {
    title: 'Estado de Validación',
    description: 'Evaluación automática basada en el análisis de todas las entrevistas. Refleja el potencial de mercado de tu idea.',
    details: [
      { label: 'High Potential', value: 'Señales fuertes de PMF' },
      { label: 'Needs Work', value: 'Requiere ajustes' },
      { label: 'Low Signal', value: 'Pocos indicadores positivos' },
    ],
  },

  scoreDistribution: {
    title: 'Distribución de Scores',
    description: 'Visualización de cómo se distribuyen los puntajes de las entrevistas. Te permite identificar patrones y outliers.',
    details: [
      { label: '0-4', value: 'Baja validación' },
      { label: '4-7', value: 'Validación media' },
      { label: '7-10', value: 'Alta validación' },
    ],
    tip: 'Una distribución concentrada en 7-10 es ideal.'
  },

  quickInsights: {
    title: 'AI Quick Insights',
    description: 'Análisis automático generado por IA que detecta patrones, tendencias y oportunidades clave en tus datos de validación.',
    details: [
      { label: 'TREND', value: 'Patrones detectados' },
      { label: 'OPPORTUNITY', value: 'Oportunidades identificadas' },
    ],
    tip: 'Estos insights se actualizan automáticamente con cada nueva entrevista.'
  },

  problemIntensity: {
    title: 'Intensidad del Problema',
    description: 'Mide qué tan urgente y doloroso es el problema para el usuario. Un problema con alta intensidad tiene mayor probabilidad de generar compras.',
    details: [
      { label: 'Nivel bajo', value: '0-40 (Vitamina)' },
      { label: 'Nivel alto', value: '70+ (Aspirina)' },
    ],
  },

  willingnessToPay: {
    title: 'Disposición a Pagar',
    description: 'La métrica más importante. Indica si los usuarios realmente pagarían por tu solución, no solo si la encuentran interesante.',
    details: [
      { label: 'Señal débil', value: '"Me encantaría usarlo"' },
      { label: 'Señal fuerte', value: '"¿Cuándo puedo comprarlo?"' },
    ],
    tip: 'Busca compromisos concretos, no solo intenciones.'
  },

  solutionFit: {
    title: 'Ajuste de Solución',
    description: 'Evalúa si tu solución propuesta realmente resuelve el problema identificado. Una buena idea puede fracasar con la solución incorrecta.',
    details: [
      { label: 'Bajo fit', value: 'Solución no conecta con el dolor' },
      { label: 'Alto fit', value: 'Solución directa al problema' },
    ],
  },

  earlyAdopter: {
    title: 'Perfil Early Adopter',
    description: 'Identifica si el entrevistado tiene características de early adopter: innovador, dispuesto a probar soluciones nuevas e incompletas.',
    details: [
      { label: 'Early Adopter', value: 'Primeros 15% del mercado' },
      { label: 'Early Majority', value: 'Esperan consenso' },
    ],
    tip: 'Enfócate primero en early adopters para validar rápido.'
  },
};

export default InfoTooltip;
