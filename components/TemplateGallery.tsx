import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react';
import { NICHE_TEMPLATES, NicheTemplate } from '../constants/templates';
import { staggerContainer, staggerItem, scaleIn } from '../utils/animations';

interface TemplateGalleryProps {
  onSelectTemplate: (template: NicheTemplate) => void;
  onClose: () => void;
  lang?: 'en' | 'es';
  initialFilter?: string | null;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate, onClose, lang = 'en', initialFilter }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<NicheTemplate | null>(null);
  const t = lang === 'en' ? {
    header: 'Auditorium Protocol Gallery',
    headerDesc: 'Pre-configured audit frameworks synthesized with market validation best practices.',
    questions: 'questions',
    viewDetails: 'View Synthesis Detail →',
    noTemplates: 'No matching protocols identified',
    noTemplatesDesc: 'No frameworks match the current filter parameters.',
    viewAll: 'View All Protocols',
    cancel: 'Cancel',
    useTemplate: 'Deploy This Protocol',
    includedQuestions: 'Integrated Audit Points'
  } : {
    header: 'Galería de Protocolos',
    headerDesc: 'Marcos de auditoría pre-configurados con las mejores prácticas de validación.',
    questions: 'preguntas',
    viewDetails: 'Ver detalles →',
    noTemplates: 'No se encontraron plantillas',
    noTemplatesDesc: 'No hay plantillas que coincidan con el filtro.',
    viewAll: 'Ver Todas',
    cancel: 'Cancelar',
    useTemplate: 'Usar esta plantilla',
    includedQuestions: 'Puntos de Auditoría Integrados'
  };
  
  const filteredTemplates = initialFilter 
    ? NICHE_TEMPLATES.filter(t => 
        t.industry?.toLowerCase().includes(initialFilter.toLowerCase()) || 
        t.id.toLowerCase().includes(initialFilter.toLowerCase()) ||
        t.name.toLowerCase().includes(initialFilter.toLowerCase())
      )
    : NICHE_TEMPLATES;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-8 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">{t.header}</h2>
            <p className="text-slate-400 text-sm font-light">
              {t.headerDesc}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
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
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              variants={staggerItem}
              className="group glass-panel rounded-2xl overflow-hidden hover:border-neon/50 transition-all cursor-pointer relative"
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-neon/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
              
              {/* Content */}
              <div className="relative p-7">
                {/* Icon */}
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                  {template.emoji}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon transition-colors tracking-tight">
                  {template.name}
                </h3>

                {/* Industry Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                  {template.industry}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed font-light">
                  {template.description}
                </p>

                {/* Questions Count */}
                <div className="flex items-center justify-between pt-5 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Sparkles size={14} className="text-neon" />
                    {template.questions.length} {t.questions}
                  </span>
                  <span className="text-[10px] text-neon font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.viewDetails}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white/5 p-5 rounded-3xl mb-6 border border-white/5">
              <Sparkles size={40} className="text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight">{t.noTemplates}</h3>
            <p className="text-slate-400 max-w-md font-light mb-10 leading-relaxed">
              {t.noTemplatesDesc} "{initialFilter}".
            </p>
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/?open_gallery=true');
                window.location.reload();
              }}
              className="px-8 py-3 bg-white text-black font-bold rounded-full transition-all hover:scale-105 shadow-xl shadow-white/5"
            >
              {t.viewAll}
            </button>
          </div>
        )}
      </motion.div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedTemplate(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel rounded-[40px] p-10 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Preview Header */}
              <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-8">
                <div className="text-7xl drop-shadow-2xl">{selectedTemplate.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-slate-400 mb-5 leading-relaxed font-light">
                    {selectedTemplate.description}
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-neon/10 border border-neon/30 text-[10px] text-neon font-black uppercase tracking-widest">
                      {selectedTemplate.industry}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {selectedTemplate.targetAudience}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-slate-500 hover:text-white transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Questions Preview */}
              <div className="mb-10">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Zap size={14} className="text-neon" />
                  {t.includedQuestions} ({selectedTemplate.questions.length})
                </h4>
                <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-4">
                  {selectedTemplate.questions.map((q, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/q"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-neon font-black text-xs mt-1 opacity-50 group-hover/q:opacity-100 transition-opacity">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-sm text-slate-300 flex-1 leading-relaxed">
                          {q.text}
                        </p>
                        <span className="px-2 py-1 rounded-md bg-black/40 text-[9px] text-slate-600 font-black uppercase tracking-widest border border-white/5">
                          {q.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    onSelectTemplate(selectedTemplate);
                    onClose();
                  }}
                  className="flex-1 py-4 rounded-2xl bg-neon text-black font-black uppercase tracking-widest hover:scale-[1.02] shadow-[0_0_30px_rgba(58,255,151,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Check size={20} className="stroke-[3]" />
                  {t.useTemplate}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
