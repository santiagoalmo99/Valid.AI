import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check, Trash2, RefreshCw, UploadCloud } from 'lucide-react';

export interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success'; 
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmationModalProps extends ConfirmationState {
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar", 
  variant = 'info', 
  onConfirm, 
  onClose,
  onCancel 
}) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger': return <Trash2 className="text-red-400" size={32} />;
      case 'warning': return <AlertTriangle className="text-yellow-400" size={32} />;
      case 'success': return <Check className="text-emerald-400" size={32} />;
      default: return <RefreshCw className="text-blue-400" size={32} />;
    }
  };

  const getButtonColor = () => {
    switch (variant) {
      case 'danger': return 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-yellow-500/20';
      case 'success': return 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/20';
      default: return 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2 ${
                variant === 'danger' ? 'bg-red-600' :
                variant === 'warning' ? 'bg-yellow-600' :
                variant === 'success' ? 'bg-emerald-600' : 'bg-blue-600'
            }`}></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${
                    variant === 'danger' ? 'border-red-500/20 bg-red-500/10' :
                    variant === 'warning' ? 'border-yellow-500/20 bg-yellow-500/10' :
                    variant === 'success' ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-blue-500/20 bg-blue-500/10'
                 }`}>
                   {getIcon()}
                 </div>
                 <button onClick={handleCancel} className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white">
                   <X size={20} />
                 </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{message}</p>

              <div className="flex gap-3">
                <button 
                  onClick={handleCancel}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-colors"
                >
                  {cancelText}
                </button>
                <button 
                  onClick={handleConfirm}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${getButtonColor()}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
