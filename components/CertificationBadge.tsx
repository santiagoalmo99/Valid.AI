import React from 'react';
import { Shield, CheckCircle2, Award } from 'lucide-react';

interface CertificationBadgeProps {
  projectName: string;
  score: number;
  date: string;
  theme: 'modern' | 'professional' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CertificationBadge: React.FC<CertificationBadgeProps> = ({ 
  projectName, 
  score, 
  date, 
  theme = 'modern',
  size = 'md'
}) => {
  
  // Size config
  const sizes = {
    sm: { w: 120, h: 120, fontTitle: 'text-[8px]', fontScore: 'text-xl' },
    md: { w: 200, h: 200, fontTitle: 'text-[10px]', fontScore: 'text-4xl' },
    lg: { w: 300, h: 300, fontTitle: 'text-sm', fontScore: 'text-6xl' },
    xl: { w: 500, h: 500, fontTitle: 'text-xl', fontScore: 'text-8xl' }
  };
  
  const s = sizes[size];
  const formattedScore = Math.round(score);
  const isPassing = formattedScore >= 70;
  
  // Theme Config
  const themes = {
    modern: {
      bg: 'bg-black',
      border: 'border-neon',
      text: 'text-white',
      accent: 'text-neon',
      ring: 'border-neon/30',
      glow: 'shadow-[0_0_30px_rgba(0,255,148,0.3)]'
    },
    professional: {
      bg: 'bg-white',
      border: 'border-blue-600',
      text: 'text-slate-900',
      accent: 'text-blue-600',
      ring: 'border-blue-100',
      glow: 'shadow-xl'
    },
    minimal: {
      bg: 'bg-transparent',
      border: 'border-slate-800',
      text: 'text-slate-800',
      accent: 'text-black',
      ring: 'border-slate-200',
      glow: ''
    }
  };
  
  const t = themes[theme];

  return (
    <div 
      className={`relative rounded-full flex flex-col items-center justify-center font-sans select-none overflow-hidden ${t.bg} ${t.glow}`}
      style={{ width: s.w, height: s.h, borderWidth: size === 'sm' ? 2 : 4, borderColor: theme === 'modern' ? '#00FF94' : theme === 'professional' ? '#2563EB' : '#1e293b' }}
    >
      {/* Decorative Outer Ring */}
      <div className={`absolute inset-2 rounded-full border-2 border-dashed ${t.ring} animate-spin-slow`}></div>
      
      {/* Top Curve Text (Simulated placement) */}
      <div className={`absolute top-4 ${t.accent} font-bold uppercase tracking-widest ${s.fontTitle}`}>
        VALID.AI Certified
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center z-10">
        <div className="flex items-center gap-1 mb-1">
          {isPassing ? <Shield size={size === 'sm' ? 12 : 24} className={t.accent} fill={theme === 'modern' ? "black" : "none"} /> : <Award className={t.accent} />}
        </div>
        
        <div className={`${t.text} font-black ${s.fontScore} leading-none`}>
          {formattedScore}
        </div>
        
        <div className={`${t.text} text-[8px] uppercase tracking-wider opacity-60 font-bold mt-1`}>
          Market Scale
        </div>
      </div>

      {/* Bottom Curve Text */}
      <div className={`absolute bottom-6 flex flex-col items-center ${t.text}`}>
        <div className={`font-bold ${s.fontTitle} max-w-[80%] text-center truncate`}>
          {projectName}
        </div>
        <div className="text-[6px] opacity-50 font-mono mt-0.5">
          {date}
        </div>
      </div>
      
      {/* Watermark/Holo Effect for Modern */}
      {theme === 'modern' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
      )}
    </div>
  );
};
