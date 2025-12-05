import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { YCScoreResult } from '../services/scoringService';

interface YCReadinessBadgeProps {
  result: YCScoreResult;
  size?: 'sm' | 'md' | 'lg';
}

export const YCReadinessBadge: React.FC<YCReadinessBadgeProps> = ({ result, size = 'md' }) => {
  const { totalScore, grade, verdict, breakdown, details } = result;
  
  // Size configs
  const sizes = {
    sm: { w: 'w-24', h: 'h-24', text: 'text-2xl', sub: 'text-[9px]' },
    md: { w: 'w-32', h: 'h-32', text: 'text-4xl', sub: 'text-[10px]' },
    lg: { w: 'w-48', h: 'h-48', text: 'text-6xl', sub: 'text-xs' }
  };
  const s = sizes[size];
  
  // Color logic
  const getColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500 shadow-emerald-500/20';
    if (score >= 70) return 'text-cyan-400 border-cyan-500 shadow-cyan-500/20';
    if (score >= 50) return 'text-yellow-400 border-yellow-500 shadow-yellow-500/20';
    return 'text-red-400 border-red-500 shadow-red-500/20';
  };
  
  const colorClass = getColor(totalScore);
  const borderColor = colorClass.split(' ')[1].replace('border-', '');

  return (
    <div className="group relative inline-flex flex-col items-center">
      
      {/* Main Score Ring */}
      <div className={`relative ${s.w} ${s.h} rounded-full border-4 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md shadow-xl ${colorClass}`}>
        <span className={`${s.text} font-black font-mono`}>{totalScore}</span>
        <span className={`${s.sub} font-bold uppercase tracking-widest opacity-80`}>YC Score</span>
        
        {/* Animated Glow Filter */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-20 bg-current animate-pulse`}></div>
      </div>
      
      {/* Verdict Label */}
      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold bg-black/50 border border-white/10 ${colorClass.split(' ')[0]}`}>
        {verdict}
      </div>

      {/* TOOLTIP: The "Truth" Box */}
      <div className="absolute top-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
        <div className="w-64 bg-slate-900/95 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <Info size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Score Breakdown</span>
          </div>
          
          <div className="space-y-3">
            {/* Volume */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Data Volume</span>
                <span className="text-white font-mono">{breakdown.volumeScore}/20</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(breakdown.volumeScore/20)*100}%` }}></div>
              </div>
            </div>

            {/* Performance */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Performance</span>
                <span className="text-white font-mono">{breakdown.performanceScore}/50</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(breakdown.performanceScore/50)*100}%` }}></div>
              </div>
            </div>

            {/* Consistency */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Consistency</span>
                <span className="text-white font-mono">{breakdown.consistencyScore}/30</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${(breakdown.consistencyScore/30)*100}%` }}></div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/5">
                {details.map((d, i) => (
                    <p key={i} className="text-[10px] text-slate-400 leading-tight mb-1">• {d}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
