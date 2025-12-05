import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, X, Check, Code, Copy, Eye } from 'lucide-react';
import { CertificationBadge } from './CertificationBadge';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  score: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ 
  isOpen, 
  onClose, 
  projectName, 
  score 
}) => {
  const [theme, setTheme] = useState<'modern' | 'professional' | 'minimal'>('modern');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  
  // Create payload
  const payload = {
    name: projectName,
    score: Math.round(score),
    date: date,
    id: Math.random().toString(36).substring(7)
  };
  
  const encodedPayload = btoa(JSON.stringify(payload));
  const url = `${window.location.origin}/?verify=${encodedPayload}`;
  const embedCode = `<a href="${url}" target="_blank"><img src="https://valid.ai/api/badge/${encodedPayload}" alt="Verified by VALID.AI" /></a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url); // Copy URL primarily
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Share2 className="text-neon" size={24} /> 
              Certificado de Validación
            </h2>
            <p className="text-slate-400 text-sm">Comparte tu éxito con inversores y clientes.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Preview */}
          <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5 relative group">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
             
             {/* The Badge */}
             <div className="relative z-10 transition-transform duration-500 hover:scale-105">
                <CertificationBadge 
                  projectName={projectName} 
                  score={score} 
                  date={date} 
                  theme={theme}
                  size="lg"
                />
             </div>
             
             <div className="mt-6 flex gap-2">
                {(['modern', 'professional', 'minimal'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 text-xs font-bold rounded-full capitalize border transition-all ${
                      theme === t 
                        ? 'bg-white text-black border-white scale-105 shadow-lg' 
                        : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {t}
                  </button>
                ))}
             </div>
          </div>

          {/* Right: Actions */}
          <div className="space-y-6">
            
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
               <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="text-emerald-400 font-bold text-sm">Score Verificado: {score}/100</h4>
                    <p className="text-emerald-400/80 text-xs mt-1">Este proyecto cumple con los estándares de validación de mercado.</p>
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Code size={12}/> Embed Code
              </label>
              <div className="relative">
                <div className="bg-black/50 border border-white/10 p-3 rounded-lg text-xs font-mono text-slate-300 break-all h-24 overflow-y-auto">
                   {embedCode}
                </div>
                <button 
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400"/> : <Copy size={14}/>}
                </button>
              </div>
            </div>

            {/* Download Button (Mock) */}
            <button className="w-full py-3 bg-neon text-black font-bold rounded-xl hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-neon/20">
               <Download size={18} /> Descargar PNG (HD)
            </button>
            <p className="text-center text-[10px] text-slate-500">
               Disponible en formatos .PNG y .SVG transparente
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
