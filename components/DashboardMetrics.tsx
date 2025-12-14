
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardMetricsProps {
  totalInterviews: number;
  avgScore: number | string;
  status: string;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ totalInterviews, avgScore, status }) => {
  const score = Number(avgScore);
  
  // Determine status color and icon
  const getStatusConfig = () => {
    if (score >= 7) return { color: 'text-neon', glow: 'shadow-[0_0_20px_rgba(58,255,151,0.5)]', icon: <CheckCircle className="text-neon" size={20} />, text: 'High Potential' };
    if (score >= 4) return { color: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.5)]', icon: <Activity className="text-yellow-400" size={20} />, text: 'Pivot Needed' };
    return { color: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(248,113,113,0.5)]', icon: <AlertTriangle className="text-red-400" size={20} />, text: 'Critical Issues' };
  };

  const statusConfig = getStatusConfig();
  const GLASS_PANEL = "backdrop-blur-xl bg-[#0a0a0a]/60 border border-white/10 shadow-2xl";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* 1. TOTAL INTERVIEWS CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${GLASS_PANEL} rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500`}
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Interviews</h3>
            <div className="flex items-baseline gap-2">
               <motion.span 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                 className="text-4xl font-black text-white"
               >
                 {totalInterviews}
               </motion.span>
               <span className="text-xs text-neon font-bold flex items-center gap-1 bg-neon/10 px-2 py-0.5 rounded-full">
                 <TrendingUp size={10} /> +100%
                </span>
            </div>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400">
            <Users size={24} />
          </div>
        </div>
        
        {/* Decorative Sparkline */}
        <div className="mt-4 flex gap-1 items-end h-8 opacity-30">
           {[40, 60, 45, 70, 50, 80, 65, 90, 75, 100].map((h, i) => (
             <motion.div 
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${h}%` }}
               transition={{ delay: 0.3 + (i * 0.05), duration: 0.5 }}
               className="w-full bg-blue-400 rounded-t-sm"
             />
           ))}
        </div>
      </motion.div>

      {/* 2. AVERAGE SCORE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${GLASS_PANEL} rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500`}
      >
        <div className={`absolute right-0 top-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 opacity-20 transition-all ${statusConfig.color.replace('text-', 'bg-')}`}></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
             <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Validation Score</h3>
             <div className="flex items-baseline gap-2">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={score} // Re-animate on change
                  className={`text-4xl font-black ${statusConfig.color}`}
                >
                  {Number(avgScore).toFixed(1)}
                </motion.span>
                <span className="text-slate-600 text-sm font-semibold">/ 10.0</span>
             </div>
          </div>
          <div className={`bg-white/5 p-3 rounded-2xl ${statusConfig.color}`}>
             <Zap size={24} fill="currentColor" />
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-6 w-full h-2 bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(score / 10) * 100}%` }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className={`h-full rounded-full ${statusConfig.color.replace('text-', 'bg-')} ${statusConfig.glow}`}
           />
        </div>
      </motion.div>

      {/* 3. STATUS CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${GLASS_PANEL} rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500`}
      >
         {/* Animated Background Mesh */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-[80px] opacity-20 ${statusConfig.color.replace('text-', 'bg-')}`}></div>

         <div className="relative z-10 h-full flex flex-col justify-between">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               Current Status
            </h3>
            
            <div className="mt-2">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.4 }}
                 className={`text-3xl font-black flex items-center gap-3 ${statusConfig.color}`}
               >
                  {statusConfig.icon}
                  {statusConfig.text}
               </motion.div>
               <p className="text-slate-400 text-xs mt-2 font-medium">
                  Based on {totalInterviews} validated data points.
               </p>
            </div>
         </div>
      </motion.div>
    </div>
  );
};
