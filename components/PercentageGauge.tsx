import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface PercentageGaugeProps {
  score: number; // 0 to 100
  loading?: boolean;
  size?: number;
}

export const PercentageGauge: React.FC<PercentageGaugeProps> = ({ score, loading = false, size = 200 }) => {
  // Normalize score to 0-100
  const validScore = Math.max(0, Math.min(100, score));
  
  // Determine color based on score
  const getColor = (s: number) => {
    if (s >= 80) return "#34d399"; // emerald-400
    if (s >= 60) return "#22d3ee"; // cyan-400
    if (s >= 40) return "#facc15"; // yellow-400
    return "#ef4444"; // red-500
  };

  const color = getColor(validScore);

  const data = [
    {
      name: 'Score',
      value: validScore,
      fill: color,
    },
  ];

  if (loading) {
     return (
        <div className="flex items-center justify-center animate-pulse" style={{ width: size, height: size }}>
           <div className="w-1/2 h-1/2 rounded-full border-4 border-white/10 border-t-emerald-500 animate-spin"></div>
        </div>
     );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size / 1.5 }}>
      {/* Background Glow */}
      <div 
        className="absolute inset-0 blur-2xl opacity-20 transition-colors duration-500"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      ></div>

      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="70%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            dataKey="value"
            cornerRadius={10}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
        >
            <span className="text-4xl font-bold text-white drop-shadow-lg" style={{ color: color }}>
               {validScore}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Viabilidad</span>
        </motion.div>
      </div>
    </div>
  );
};
