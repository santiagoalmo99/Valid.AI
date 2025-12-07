import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Bell, X, Share2, Activity } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'live';

export interface NotificationPayload {
  title: string;
  message?: string;
  type?: NotificationType;
  duration?: number;
  icon?: React.ReactNode;
  // Advanced 'Live' props
  visual?: React.ReactNode; // For graphs or custom content
  stats?: string; 
  actions?: { label: string; onClick: () => void; isPrimary?: boolean }[];
}

interface DynamicNotificationProps {
  notification: NotificationPayload | null;
  onClose: () => void;
}

export const DynamicNotification: React.FC<DynamicNotificationProps> = ({ notification, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (notification) {
      if (notification.type === 'live' || notification.visual) {
         setIsExpanded(true);
      } else {
         setIsExpanded(false);
      }
      
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
           setIsExpanded(false);
           setTimeout(onClose, 300); // Allow shrink animation
        }, notification.duration || 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const bgColors = {
    success: 'bg-[#000000]',
    error: 'bg-[#000000]',
    warning: 'bg-[#000000]',
    info: 'bg-[#000000]',
    live: 'bg-[#000000]'
  };

  const accentColors = {
    success: 'text-[#3AFF97]', // Neon Green
    error: 'text-red-500',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    live: 'text-[#3AFF97]'
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
           key={notification.title}
           initial={{ y: -50, scale: 0.8, opacity: 0, width: 'auto', borderRadius: '50px' }}
           animate={{ 
              y: 0, 
              scale: 1, 
              opacity: 1,
              width: isExpanded ? 380 : 'auto',
              borderRadius: isExpanded ? '32px' : '50px',
              height: isExpanded ? 'auto' : '48px'
           }}
           exit={{ y: -50, scale: 0.8, opacity: 0 }}
           transition={{ type: "spring", stiffness: 400, damping: 30 }}
           className={`${bgColors[notification.type || 'info']} shadow-2xl border border-white/10 pointer-events-auto overflow-hidden relative backdrop-blur-xl`}
           onClick={() => setIsExpanded(!isExpanded)}
        >
           {/* Standard View / Header */}
           <div className={`flex items-center gap-3 px-4 ${isExpanded ? 'pt-5 pb-2' : 'h-12'}`}>
              <div className={`flex-shrink-0 ${accentColors[notification.type || 'info']}`}>
                 {notification.icon ? notification.icon : (
                    notification.type === 'success' ? <CheckCircle size={20} fill="#3AFF97" className="text-black" /> :
                    notification.type === 'error' ? <XCircle size={20} fill="#EF4444" className="text-black" /> :
                    notification.type === 'warning' ? <AlertTriangle size={20} fill="#FACC15" className="text-black" /> :
                    <Activity size={20} className="animate-pulse" />
                 )}
              </div>
              
              <div className="flex flex-col min-w-[200px]">
                 <span className="text-sm font-bold text-white whitespace-nowrap">{notification.title}</span>
                 {isExpanded && notification.message && (
                    <motion.span 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="text-xs text-slate-400 leading-tight mt-0.5 line-clamp-2"
                    >
                       {notification.message}
                    </motion.span>
                 )}
              </div>

              {notification.stats && (
                 <div className="text-2xl font-bold text-[#3AFF97] pl-4">{notification.stats}</div>
              )}
           </div>

           {/* Expanded Content */}
           <AnimatePresence>
             {isExpanded && (
               <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-5"
               >
                  {/* Custom Visual (Graph, etc) */}
                  {notification.visual && (
                     <div className="mt-3 mb-4 rounded-xl overflow-hidden bg-white/5 p-2">
                        {notification.visual}
                     </div>
                  )}

                  {/* Actions */}
                  {notification.actions && (
                     <div className="flex gap-2 mt-2">
                        {notification.actions.map((action, idx) => (
                           <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); action.onClick(); }}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${action.isPrimary ? 'bg-white text-black hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20'}`}
                           >
                              {action.label}
                           </button>
                        ))}
                     </div>
                  )}
               </motion.div>
             )}
           </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
