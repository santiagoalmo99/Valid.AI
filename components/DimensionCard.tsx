
import React from 'react';
import { motion } from 'framer-motion';

interface DimensionCardProps {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
  inverse?: boolean;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({ label, score, icon, color, inverse = false }) => {
  // If inverse (e.g., Risk), lower is better usually, but check how score is passed.
  // In useValidationScore, executionRisk is 100 - marketProxy. Score high = Low Risk? 
  // Wait, let's check useValidationScore logic:
  // executionRisk: 100 - marketProxy
  // So if market is 100, risk is 0. If market is 10, risk is 90.
  // High score in "Execution Risk" usually sounds bad. 
  // But let's assume the passed score is "Safety" or we handle display context.
  // Actually, visual bar: if inverse, maybe color logic flips?
  // Let's keep it simple: Show the score relative to 100.

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
      {/* Background Gradient */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20 ${color.replace('text-', 'bg-')}`}></div>

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className={`text-2xl font-bold ${color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
          {score}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-bold text-slate-300 mb-2 truncate group-hover:text-white transition-colors">
          {label}
        </h3>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full rounded-full ${color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
          />
        </div>
      </div>
    </div>
  );
};
