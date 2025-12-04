import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react';
import { NICHE_TEMPLATES, NicheTemplate } from '../constants/templates';
import { staggerContainer, staggerItem, scaleIn } from '../utils/animations';

interface TemplateGalleryProps {
  onSelectTemplate: (template: NicheTemplate) => void;
  onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<NicheTemplate | null>(null);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-8"
        onClick={(e) => e.stopPropagation()}
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Plantillas por Industria</h2>
            <p className="text-slate-400 text-sm">
              Cuestionarios pre-configurados con las mejores prácticas de validación
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>

        {/* Template Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {NICHE_TEMPLATES.map((template) => (
            <motion.div
              key={template.id}
              variants={staggerItem}
              className="group glass-panel rounded-2xl overflow-hidden hover:border-neon/50 transition-all cursor-pointer relative"
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
              
              {/* Content */}
              <div className="relative p-6">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {template.emoji}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon transition-colors">
                  {template.name}
                </h3>

                {/* Industry Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 mb-3">
                  {template.industry}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Questions Count */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-slate-500 flex items-center gap-2">
                    <Sparkles size={14} className="text-neon" />
                    {template.questions.length} preguntas
                  </span>
                  <span className="text-xs text-neon font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver detalles →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedTemplate(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto glass-panel rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Preview Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="text-6xl">{selectedTemplate.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    {selectedTemplate.description}
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-xs text-neon font-bold">
                      {selectedTemplate.industry}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
                      {selectedTemplate.targetAudience}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Questions Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-neon" />
                  Preguntas incluidas ({selectedTemplate.questions.length})
                </h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {selectedTemplate.questions.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-neon font-bold text-xs mt-1">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-300 flex-1">
                          {q.text}
                        </p>
                        <span className="px-2 py-1 rounded-md bg-black/30 text-[10px] text-slate-500 uppercase tracking-wider">
                          {q.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onSelectTemplate(selectedTemplate);
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl bg-neon text-black font-bold hover:shadow-[0_0_30px_rgba(58,255,151,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Usar esta plantilla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
