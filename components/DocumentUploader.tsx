// components/DocumentUploader.tsx - Document Upload UI with Multi-Input Support
// Allows users to upload documents or paste URLs/Text to generate research questions.

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Link as LinkIcon, Globe, Type } from 'lucide-react';
import { documentParser, ParsedDocument } from '../services/documentParser';
import { Question } from '../types';
import { logger } from '../services/logger';
import { VoiceInput, VoiceRecordingData } from './VoiceInput';
import { motion, AnimatePresence } from 'framer-motion';
import { ProcessingStatus } from './ProcessingStatus';

interface DocumentUploaderProps {
  onQuestionsGenerated: (questions: Question[], metadata: {
    title: string;
    description: string;
    targetAudience?: string;
    emoji: string;
  }) => void;
  onClose: () => void;
}

type UploadTab = 'file' | 'url' | 'text';

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onQuestionsGenerated,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<UploadTab>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedDocument | null>(null);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  
  // URL Input State
  const [urlInput, setUrlInput] = useState('');
  
  // Text Input State
  const [textInput, setTextInput] = useState('');

  // Handle file drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  // Handle URL "Upload"
  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    setLoading(true);
    // Create a synthetic file
    const content = `Link to analyze: ${urlInput}\n\n[System: Please analyze the content/structure of this URL as a broad context source.]`;
    const syntheticFile = new File([content], "url_link.txt", { type: "text/plain" });
    await handleFile(syntheticFile);
  };
  
  // Handle Text Submit
  const handleTextSubmit = async () => {
     if (!textInput.trim()) return;
     
     setLoading(true);
     // Create synthetic file from raw text
     // Truncate title from first 30 chars
     const titleSnippet = textInput.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
     const syntheticFile = new File([textInput], `text_input_${titleSnippet}.txt`, { type: "text/plain" });
     await handleFile(syntheticFile);
  };

  // Process uploaded file (Real or Synthetic)
  const handleFile = async (file: File) => {
    logger.info('File processing started', { fileName: file.name, fileSize: file.size });
    setLoading(true);
    setError(null);

    try {
      const parsed = await documentParser.parse(file);
      setParsedDoc(parsed);
      setStep('review');
    } catch (err) {
      logger.error('Document parsing failed', err as Error);
      setError(
        err instanceof Error
          ? err.message
          : 'Error al procesar el documento. Intenta con un archivo de texto (.txt).'
      );
    } finally {
      setLoading(false);
    }
  };

  // Approve and create project
  const handleApprove = () => {
    if (!parsedDoc) return;

    // Extract metadata from AI analysis
    const metadata = {
      title: parsedDoc.title,
      description: parsedDoc.profile?.summary || parsedDoc.sections[0]?.content || parsedDoc.title,
      targetAudience: parsedDoc.profile?.targetAudience || 'General',
      emoji: '📄', // Default
    };

    onQuestionsGenerated(parsedDoc.suggestedQuestions, metadata);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
      <div className="max-w-4xl w-full bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-slate-900 border-b border-white/10 p-6 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText size={28} className="text-neon" />
            {step === 'upload' ? 'Subir Documento' : 'Revisar Preguntas Generadas'}
          </h2>
          <p className="text-white/80 mt-1">
            {step === 'upload'
              ? 'Sube un archivo, enlace o pega texto para generar el validación.'
              : `${parsedDoc?.suggestedQuestions.length} preguntas generadas a partir de tu información.`}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
           
          {/* PROCESSING OVERLAY */}
          <ProcessingStatus loading={loading} steps={[
            "Ingestando documento cuántico...",
            "Decodificando estructura semántica...",
            "Identificando patrones de mercado...",
            "Generando preguntas de validación...",
            "Sintetizando perfil estratégico..."
          ]} />

          {step === 'review' && parsedDoc ? (
            // Review Step
            <div className="space-y-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">{parsedDoc.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {parsedDoc.metadata.fileType && (
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300 font-mono">
                      {parsedDoc.metadata.fileName}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300 font-mono">
                    {parsedDoc.metadata.wordCount} words
                  </span>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                    <p className="text-slate-300 text-sm italic">
                        "{parsedDoc.profile?.summary || parsedDoc.sections[0]?.content}"
                    </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-neon font-bold uppercase tracking-wider text-sm">Preguntas Sugeridas</h4>
                {parsedDoc.suggestedQuestions.map((q, i) => (
                  <div key={i} className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-neon/20 text-neon flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{q.text}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs text-slate-500 bg-black/40 px-2 py-0.5 rounded uppercase">
                          {q.type}
                        </span>
                        <span className="text-xs text-slate-500 bg-black/40 px-2 py-0.5 rounded uppercase">
                          {q.dimension}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Upload Step
            <div className="max-w-2xl mx-auto">
               {/* Tabs */}
               <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
                   {[
                       { id: 'file', label: 'Archivo', icon: Upload },
                       { id: 'url', label: 'Enlace', icon: LinkIcon },
                       { id: 'text', label: 'Texto', icon: Type },
                   ].map((tab) => (
                       <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id as UploadTab)}
                           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                               activeTab === tab.id
                                   ? 'bg-neon text-black shadow-[0_0_15px_rgba(58,255,151,0.4)]'
                                   : 'text-slate-400 hover:text-white hover:bg-white/5'
                           }`}
                       >
                           <tab.icon size={18} />
                           {tab.label}
                       </button>
                   ))}
               </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                  {/* FILE TAB */}
                  {activeTab === 'file' && (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        min-heighte="300px"
                        className={`
                            border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer bg-white/5
                            ${isDragging ? 'border-neon bg-neon/5' : 'border-white/20 hover:border-white/40 hover:bg-white/8'}
                        `}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".txt,.pdf,.docx,.md"
                        onChange={handleFileSelect}
                        />
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-neon border border-white/10">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                        Arrastra tu documento aquí
                        </h3>
                        <p className="text-slate-400 mb-6 max-w-sm">
                        Soporta PDF, TXT, y DOCX. Analizaremos el contenido para extraer hipótesis y preguntas.
                        </p>
                        <span className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                        Seleccionar Archivo
                        </span>
                    </motion.div>
                  )}

                  {/* URL TAB */}
                  {activeTab === 'url' && (
                      <motion.div
                        key="url"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6"
                      >
                          <div className="flex flex-col gap-2">
                              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pegar Enlace</label>
                              <div className="flex gap-2">
                                  <div className="relative flex-1">
                                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                      <input 
                                        type="url" 
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="https://tustartup.com/pitch"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon transition-colors"
                                      />
                                  </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">
                                  * Nota: Valid.AI intentará analizar el contexto público del sitio.
                              </p>
                          </div>
                          
                          <button 
                            onClick={handleUrlSubmit}
                            disabled={!urlInput}
                            className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all ${
                                urlInput ? 'bg-neon hover:bg-neon/90 shadow-[0_0_20px_rgba(58,255,151,0.3)]' : 'bg-slate-700 cursor-not-allowed opacity-50'
                            }`}
                          >
                              <LinkIcon size={20} />
                              Procesar Enlace
                          </button>
                      </motion.div>
                  )}

                  {/* TEXT TAB */}
                  {activeTab === 'text' && (
                      <motion.div
                        key="text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col gap-6"
                      >
                         <h3 className="text-xl font-bold text-white mb-2 text-center">Pega tu Idea</h3>
                         <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Describe tu idea, problema o hipótesis aquí..."
                            className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon transition-colors resize-none"
                         />
                         <button 
                            onClick={handleTextSubmit}
                            disabled={!textInput}
                            className={`w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all ${
                                textInput ? 'bg-neon hover:bg-neon/90 shadow-[0_0_20px_rgba(58,255,151,0.3)]' : 'bg-slate-700 cursor-not-allowed opacity-50'
                            }`}
                          >
                              <Type size={20} />
                              Analizar Texto
                          </button>
                      </motion.div>
                   )}
              </AnimatePresence>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 mx-auto max-w-2xl">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-bold transition-colors"
          >
            Cancelar
          </button>
          
          {step === 'review' && (
            <button
              onClick={handleApprove}
              className="px-6 py-3 rounded-xl bg-neon text-black font-bold hover:bg-neon/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(58,255,151,0.3)] flex items-center gap-2"
            >
              <CheckCircle size={20} />
              Aprobar y Crear Proyecto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
