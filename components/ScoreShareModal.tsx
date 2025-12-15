import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Twitter, Linkedin, Download, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from './LandingPage';

interface ScoreShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  trend: 'up' | 'down' | 'stable';
  projectName: string;
  projectDescription?: string;
  totalInterviews: number;
}

export const ScoreShareModal: React.FC<ScoreShareModalProps> = ({ 
  isOpen, 
  onClose, 
  score, 
  trend, 
  projectName, 
  projectDescription,
  totalInterviews 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const getTier = (s: number) => {
    if (s >= 90) return { label: "UNICORN POTENTIAL", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/50" };
    if (s >= 80) return { label: "HIGH POTENTIAL", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/50" };
    if (s >= 60) return { label: "VALIDATED STARTUP", color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/50" };
    if (s >= 40) return { label: "NEEDS ITERATION", color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/50" };
    return { label: "PIVOT RECOMMENDED", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/50" };
  };

  const tier = getTier(score);

  const shareText = `just validated my startup idea "${projectName}" on Valid.AI! 🚀\n\nValidation Score: ${score}/100\nVerdict: ${tier.label}\n\n#startup #validation #AI`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    alert("Copied to clipboard!");
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-lg w-full bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
          >
            <X size={20} />
          </button>

          <div className="p-1">
             {/* THE SHAREABLE CARD */}
            <div 
              ref={cardRef}
              className="relative bg-gradient-to-br from-slate-900 to-black p-8 rounded-[20px] border border-white/10 overflow-hidden"
            >
               {/* Background Effects */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

               {/* Branding */}
               <div className="relative z-10 flex justify-between items-start mb-8">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-black text-xs">
                        V.AI
                     </div>
                     <span className="font-bold text-white tracking-wider text-sm opacity-80">VALID.AI</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${tier.color} ${tier.bg} ${tier.border}`}>
                     {tier.label}
                  </div>
               </div>

               {/* Main Content */}
               <div className="relative z-10 text-center mb-8">
                  <h3 className="text-xl text-slate-300 font-medium mb-1 truncate">{projectName}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-8">Startup Validation Score</p>
                  
                  <div className="relative inline-flex items-center justify-center">
                     <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                           cx="80"
                           cy="80"
                           r="70"
                           stroke="currentColor"
                           strokeWidth="8"
                           fill="transparent"
                           className="text-slate-800"
                        />
                        <circle
                           cx="80"
                           cy="80"
                           r="70"
                           stroke="currentColor"
                           strokeWidth="8"
                           fill="transparent"
                           strokeDasharray={440}
                           strokeDashoffset={440 - (440 * score) / 100}
                           className={`${tier.color} transition-all duration-1000 ease-out`}
                           strokeLinecap="round"
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold text-white tracking-tighter`}>{Math.round(score)}</span>
                        <span className="text-xs text-slate-400 mt-1">/ 100</span>
                     </div>
                  </div>
               </div>

               {/* Footer Stats */}
               <div className="relative z-10 grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                     <p className="text-[10px] text-slate-500 uppercase font-bold">Interviews</p>
                     <p className="text-white font-bold text-lg">{totalInterviews}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center flex flex-col items-center justify-center">
                     <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Trend</p>
                     {trend === 'up' && <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold"><TrendingUp size={14}/> Rising</div>}
                     {trend === 'down' && <div className="flex items-center gap-1 text-red-400 text-sm font-bold"><TrendingDown size={14}/> Falling</div>}
                     {trend === 'stable' && <div className="flex items-center gap-1 text-slate-400 text-sm font-bold"><Minus size={14}/> Stable</div>}
                  </div>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-slate-900 p-6 flex flex-col gap-4 border-t border-white/5">
            <p className="text-center text-slate-400 text-sm mb-2">Share your progress with investors & co-founders</p>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={shareTwitter} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors">
                 <Twitter size={20} />
                 <span className="text-xs font-bold">Twitter</span>
              </button>
              <button onClick={shareLinkedIn} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] transition-colors">
                 <Linkedin size={20} />
                 <span className="text-xs font-bold">LinkedIn</span>
              </button>
              <button onClick={copyToClipboard} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                 <Copy size={20} />
                 <span className="text-xs font-bold">Copy</span>
              </button>
            </div>
            
            <button className="w-full py-4 text-center text-xs text-slate-600 hover:text-slate-400 transition-colors">
               Download Image (Coming Soon)
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
