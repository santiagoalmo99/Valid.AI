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
// These are now handled by the TRANSLATIONS[lang].tooltips object in constants.ts
// Use InfoTooltip with {t.tooltips.totalInterviews} etc.

export default InfoTooltip;
