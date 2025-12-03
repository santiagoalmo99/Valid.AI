import React, { useState, useEffect } from 'react';
import { X, Save, Globe, Smartphone, Target, FileText, Image as ImageIcon } from 'lucide-react';
import { ProjectTemplate, ProductType } from '../types';

interface ProjectProfileModalProps {
  project: ProjectTemplate;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProject: ProjectTemplate) => void;
}

const PRODUCT_TYPES: ProductType[] = ['App', 'Web', 'SaaS', 'E-commerce', 'Marketplace', 'IoT', 'Other'];

export const ProjectProfileModal: React.FC<ProjectProfileModalProps> = ({ project, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProjectTemplate>(project);

  useEffect(() => {
    setFormData(project);
  }, [project]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const toggleProductType = (type: ProductType) => {
    const currentTypes = formData.productTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFormData({ ...formData, productTypes: newTypes });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/90 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/5 bg-void/50 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{formData.emoji}</span> 
            Perfil del Proyecto
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="text-slate-400 hover:text-white" size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Identidad Visual</label>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs text-slate-500">Nombre del Proyecto</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none transition-all"
                />
              </div>
              <div className="w-24 space-y-2">
                <label className="text-xs text-slate-500">Emoji</label>
                <input 
                  type="text" 
                  value={formData.emoji}
                  onChange={e => setFormData({...formData, emoji: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-center text-2xl text-white focus:border-neon outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} /> Descripción Detallada
            </label>
            <textarea 
              value={formData.detailedDescription || formData.description}
              onChange={e => setFormData({...formData, detailedDescription: e.target.value, description: e.target.value.slice(0, 150)})}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-300 focus:border-neon outline-none transition-all resize-none"
              placeholder="Describe tu idea con el mayor detalle posible..."
            />
          </div>

          {/* Target & Region */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Target size={16} /> Público Objetivo
              </label>
              <input 
                type="text" 
                value={formData.targetAudience}
                onChange={e => setFormData({...formData, targetAudience: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon outline-none transition-all"
                placeholder="Ej: Profesionales de 25-40 años..."
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} /> Región de Implementación
              </label>
              <input 
                type="text" 
                value={formData.region || ''}
                onChange={e => setFormData({...formData, region: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-neon outline-none transition-all"
                placeholder="Ej: Colombia, Latam, Global..."
              />
            </div>
          </div>

          {/* Product Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Smartphone size={16} /> Tipo de Producto Digital
            </label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleProductType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    (formData.productTypes || []).includes(type)
                      ? 'bg-neon/20 border-neon text-neon shadow-[0_0_15px_rgba(223,255,0,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
               * Selecciona múltiples opciones si aplica (ej. App + Web).
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-white/5 bg-void/90 backdrop-blur-xl flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-medium">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-neon text-void font-bold hover:shadow-[0_0_20px_rgba(223,255,0,0.4)] transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
};
