/**
 * ExportButton Component
 * Provides download options for various export formats
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Printer, ChevronDown, Loader2 } from 'lucide-react';
import { 
  ExportType, 
  ExportFormat, 
  exportDocument, 
  downloadAsHTML, 
  openForPrint 
} from '../services/exportService';
import { ProjectTemplate, Interview, DeepAnalysisReport } from '../types';

interface ExportButtonProps {
  type: ExportType;
  project: ProjectTemplate;
  interview?: Interview;
  interviews?: Interview[];
  deepAnalysis?: DeepAnalysisReport;
  language?: 'es' | 'en';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  type,
  project,
  interview,
  interviews,
  deepAnalysis,
  language = 'es',
  variant = 'secondary',
  size = 'md',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const typeLabels: Record<ExportType, { es: string; en: string }> = {
    interview: { es: 'Entrevista', en: 'Interview' },
    interview_batch: { es: 'Todas las Entrevistas', en: 'All Interviews' },
    deep_research: { es: 'Deep Research', en: 'Deep Research' },
    due_diligence: { es: 'Due Diligence', en: 'Due Diligence' },
    dashboard: { es: 'Dashboard', en: 'Dashboard' },
  };
  
  const handleExport = async (format: ExportFormat, action: 'download' | 'print') => {
    setIsExporting(true);
    setIsOpen(false);
    
    try {
      const html = await exportDocument(type, {
        project,
        interview,
        interviews,
        deepAnalysis,
      }, {
        format,
        language,
        includeRawData: true,
      });
      
      if (action === 'download') {
        const filename = generateFilename(type, project.name, language);
        downloadAsHTML(html, filename);
      } else {
        openForPrint(html);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(language === 'es' 
        ? 'Error al exportar. Por favor intente de nuevo.' 
        : 'Export failed. Please try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };
  
  const generateFilename = (type: ExportType, projectName: string, lang: 'es' | 'en'): string => {
    const sanitizedName = projectName.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    const typeNames: Record<ExportType, string> = {
      interview: 'Interview',
      interview_batch: 'Interviews_Summary',
      deep_research: 'Deep_Research',
      due_diligence: 'Due_Diligence',
      dashboard: 'Dashboard',
    };
    return `${sanitizedName}_${typeNames[type]}_${date}.html`;
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/30',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/10',
  };
  
  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={`
          flex items-center gap-2 rounded-xl font-medium transition-all
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${isExporting ? 'opacity-60 cursor-wait' : ''}
        `}
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{language === 'es' ? 'Exportar' : 'Export'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="text-xs text-slate-500 px-3 py-2 font-medium uppercase tracking-wider">
                  {typeLabels[type][language]}
                </p>
                
                {/* Download HTML */}
                <button
                  onClick={() => handleExport('html', 'download')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'es' ? 'Descargar HTML' : 'Download HTML'}</span>
                </button>
                
                {/* Print / Save as PDF */}
                <button
                  onClick={() => handleExport('html', 'print')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4 text-blue-400" />
                  <span>{language === 'es' ? 'Imprimir / Guardar PDF' : 'Print / Save as PDF'}</span>
                </button>
              </div>
              
              <div className="border-t border-white/10 p-3">
                <p className="text-[10px] text-slate-600 text-center">
                  {language === 'es' 
                    ? 'Usa "Guardar como PDF" en el diálogo de impresión'
                    : 'Use "Save as PDF" in the print dialog'
                  }
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton;
