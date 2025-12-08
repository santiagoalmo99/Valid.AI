// components/DocumentUploader.tsx - Document Upload UI with Drag & Drop
// Allows users to upload documents and generate research questions automatically

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { documentParser, ParsedDocument } from '../services/documentParser';
import { Question } from '../types';
import { logger } from '../services/logger';

interface DocumentUploaderProps {
  onQuestionsGenerated: (questions: Question[], metadata: {
    title: string;
    description: string;
    targetAudience?: string;
    emoji: string;
  }) => void;
  onClose: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onQuestionsGenerated,
  onClose,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedDocument | null>(null);
  const [step, setStep] = useState<'upload' | 'review'>('upload');

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

  // Process uploaded file
  const handleFile = async (file: File) => {
    logger.info('File uploaded', { fileName: file.name, fileSize: file.size });
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
      emoji: '📄', // Default, can be customized
    };

    onQuestionsGenerated(parsedDoc.suggestedQuestions, metadata);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="max-w-4xl w-full bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-slate-900 border-b border-white/10 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText size={28} className="text-neon" />
            {step === 'upload' ? 'Subir Documento' : 'Revisar Preguntas Generadas'}
          </h2>
          <p className="text-white/80 mt-1">
            {step === 'upload'
              ? 'Sube un documento y generaremos preguntas de investigación automáticamente'
              : `${parsedDoc?.suggestedQuestions.length} preguntas generadas`}
          </p>
        </div>

        <div className="p-8">
          {/* STEP 1: Upload */}
          {step === 'upload' && !loading && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-neon bg-neon/10'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <Upload
                size={64}
                className={`mx-auto mb-4 ${
                  isDragging ? 'text-neon' : 'text-slate-400'
                }`}
              />
              <h3 className="text-xl font-bold text-white mb-2">
                Arrastra tu documento aquí
              </h3>
              <p className="text-slate-400 mb-4">
                o haz clic para seleccionar un archivo
              </p>
              <input
                type="file"
                accept=".txt,.pdf,.docx,.md"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block bg-neon hover:bg-neon/80 text-black font-bold py-3 px-6 rounded-xl cursor-pointer transition-all shadow-[0_0_20px_rgba(58,255,151,0.3)] hover:shadow-[0_0_30px_rgba(58,255,151,0.5)]"
              >
                Seleccionar Archivo
              </label>
              <p className="text-slate-500 text-sm mt-4">
                Formatos soportados: .txt, .pdf, .docx, .md
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <Loader size={48} className="mx-auto text-neon animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Procesando documento con IA...</h3>
              <p className="text-slate-400">
                Analizando patrones y generando perfil estratégico. <br/>
                <span className="text-xs opacity-70">(Esto puede tardar unos momentos)</span>
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex items-start gap-4">
              <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-red-400 font-bold mb-1">Error</h3>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* STEP 2: Review Generated Questions */}
          {step === 'review' && parsedDoc && (
            <div className="space-y-6">
              {/* Document Info */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">
                  {parsedDoc.title}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Palabras:</span>
                    <span className="text-white ml-2">{parsedDoc.metadata.wordCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Secciones:</span>
                    <span className="text-white ml-2">{parsedDoc.sections.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Entidades:</span>
                    <span className="text-white ml-2">{parsedDoc.keyEntities.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Preguntas:</span>
                    <span className="text-white ml-2">
                      {parsedDoc.suggestedQuestions.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {parsedDoc.suggestedQuestions.map((q, index) => (
                  <div
                    key={q.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-neon/50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="bg-neon text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{q.text}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-neon/10 text-neon border border-neon/20 px-2 py-1 rounded">
                            {q.type}
                          </span>
                          <span className="text-xs bg-white/10 text-white px-2 py-1 rounded">
                            {q.category}
                          </span>
                          {q.dimension && (
                            <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded">
                              {q.dimension}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Entities */}
              {parsedDoc.keyEntities.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-bold mb-2">Entidades Detectadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {parsedDoc.keyEntities.map((entity, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-700 text-slate-200 px-3 py-1 rounded-full"
                      >
                        {entity.name} ({entity.type})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white/5 p-6 flex justify-between items-center border-t border-white/10">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-medium transition-colors"
          >
            Cancelar
          </button>
          
          {step === 'review' && (
            <button
              onClick={handleApprove}
              className="bg-neon hover:bg-neon/80 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(58,255,151,0.3)] hover:shadow-[0_0_30px_rgba(58,255,151,0.5)]"
            >
              <CheckCircle size={20} />
              Crear Proyecto con estas Preguntas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
