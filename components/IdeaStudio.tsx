// components/IdeaStudio.tsx - Conversational Idea-to-Research Interface
// Multi-step wizard that converts raw ideas into complete research plans

import React, { useState } from 'react';
import { Lightbulb, MessageCircle, FileCheck, Loader, CheckCircle, ArrowRight, Target, Users, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { generateClarificationQuestions, generateResearchPlan, ResearchPlan } from '../services/ideaGenerator';
import { Question } from '../types';
import { Question } from '../types';
import { logger } from '../services/logger';
import { ProcessingStatus } from './ProcessingStatus';

interface IdeaStudioProps {
  onPlanGenerated: (questions: Question[], metadata: {
    title: string;
    description: string;
    emoji: string;
  }, plan: ResearchPlan) => void;
  onClose: () => void;
}

type Step = 'input' | 'clarification' | 'generation' | 'review';

export const IdeaStudio: React.FC<IdeaStudioProps> = ({ onPlanGenerated, onClose }) => {
  const [step, setStep] = useState<Step>('input');
  const [rawIdea, setRawIdea] = useState('');
  const [clarificationQuestions, setClarificationQuestions] = useState<string[]>([]);
  const [clarifications, setClarifications] = useState<{ question: string; answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<ResearchPlan | null>(null);

  // Step 1: Submit idea and get clarification questions
  const handleIdeaSubmit = async () => {
    if (!rawIdea.trim() || rawIdea.length < 20) {
      setError('Por favor describe tu idea con más detalle (mínimo 20 caracteres)');
      return;
    }

    setLoading(true);
    setError(null);
    logger.info('Idea submitted', { ideaLength: rawIdea.length });

    try {
      const questions = await generateClarificationQuestions(rawIdea);
      setClarificationQuestions(questions);
      setStep('clarification');
      logger.info('Clarification questions generated', { count: questions.length });
    } catch (err) {
      logger.error('Failed to generate clarification questions', err as Error);
      setError('Error al generar preguntas. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Answer clarification questions
  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) {
      setError('Por favor responde la pregunta');
      return;
    }

    const newClarifications = [
      ...clarifications,
      { question: clarificationQuestions[currentQuestionIndex], answer: currentAnswer },
    ];
    setClarifications(newClarifications);
    setCurrentAnswer('');
    setError(null);

    // Move to next question or generate plan
    if (currentQuestionIndex < clarificationQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      generatePlan(newClarifications);
    }
  };

  // Step 3: Generate research plan
  const generatePlan = async (finalClarifications: { question: string; answer: string }[]) => {
    setStep('generation');
    setLoading(true);
    setError(null);

    try {
      const plan = await generateResearchPlan(rawIdea, finalClarifications);
      setGeneratedPlan(plan);
      setStep('review');
      logger.info('Research plan generated', {
        objectives: plan.objectives.length,
        personas: plan.personas.length,
        questions: plan.questions.length,
      });
    } catch (err) {
      logger.error('Failed to generate research plan', err as Error);
      setError('Error al generar el plan. Por favor intenta de nuevo.');
      setStep('clarification');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Approve and create project
  const handleApprove = () => {
    if (!generatedPlan) return;

    const metadata = {
      title: rawIdea.substring(0, 50) + (rawIdea.length > 50 ? '...' : ''),
      description: generatedPlan.objectives[0] || rawIdea,
      emoji: '💡',
    };

    onPlanGenerated(generatedPlan.questions, metadata, generatedPlan);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-[98vw] h-[95vh] bg-[#050505] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Background Gradients - NEON THEME */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-[#3AFF97] to-green-500"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#3AFF97]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3AFF97]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className="bg-[#3AFF97]/10 p-2.5 rounded-xl border border-[#3AFF97]/20 shadow-[0_0_15px_rgba(58,255,151,0.2)]">
              <Lightbulb size={24} className="text-[#3AFF97]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Idea Studio</h2>
              <p className="text-slate-400 text-xs font-medium">De Idea a Plan de Investigación</p>
            </div>
          </div>
          
          {/* Stepper - Compact & Modern */}
          <div className="hidden md:flex items-center bg-white/5 rounded-full p-1.5 border border-white/5">
            <StepIndicator active={step === 'input'} completed={step !== 'input'} label="Idea" />
            <div className="w-8 h-px bg-white/10 mx-1"></div>
            <StepIndicator active={step === 'clarification'} completed={step === 'generation' || step === 'review'} label="Preguntas" />
            <div className="w-8 h-px bg-white/10 mx-1"></div>
            <StepIndicator active={step === 'generation'} completed={step === 'review'} label="Plan" />
            <div className="w-8 h-px bg-white/10 mx-1"></div>
            <StepIndicator active={step === 'review'} completed={false} label="Revisar" />
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <span className="sr-only">Cerrar</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative z-0">
          
          {/* STEP 1: Idea Input - Split View */}
          {step === 'input' && (
            <div className="h-full flex flex-col lg:flex-row">
              {/* Left Panel: Inspiration/Context */}
              <div className="lg:w-[35%] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02] flex flex-col justify-center">
                <div className="w-full">
                  <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
                    Transforma tu visión en un <span className="text-[#3AFF97] drop-shadow-[0_0_15px_rgba(58,255,151,0.5)]">plan accionable</span>
                  </h3>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                    Describe tu idea de negocio y nuestra IA generará un plan de investigación completo para validarla en minutos.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="w-10 h-10 rounded-full bg-[#3AFF97]/10 border border-[#3AFF97]/20 flex items-center justify-center text-[#3AFF97]">
                        <Target size={20} />
                      </div>
                      <span className="text-base">Identifica tu público objetivo</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="w-10 h-10 rounded-full bg-[#3AFF97]/10 border border-[#3AFF97]/20 flex items-center justify-center text-[#3AFF97]">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-base">Genera preguntas de validación</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="w-10 h-10 rounded-full bg-[#3AFF97]/10 border border-[#3AFF97]/20 flex items-center justify-center text-[#3AFF97]">
                        <TrendingUp size={20} />
                      </div>
                      <span className="text-base">Define métricas de éxito</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Input */}
              <div className="flex-1 p-8 lg:p-16 flex flex-col bg-gradient-to-b from-transparent to-black/40">
                <div className="flex-1 flex flex-col w-full justify-center">
                  <label className="block text-white font-medium mb-4 text-xl">
                    ¿Cuál es tu idea?
                  </label>
                  <div className="relative flex-1 min-h-[200px] max-h-[500px]">
                    <textarea
                      value={rawIdea}
                      onChange={(e) => setRawIdea(e.target.value)}
                      placeholder="Ejemplo: Una plataforma SaaS que ayuda a pequeños agricultores a optimizar el uso de agua mediante sensores IoT de bajo costo y análisis predictivo de clima..."
                      className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-8 text-white text-xl placeholder-slate-500 focus:border-[#3AFF97]/50 focus:ring-1 focus:ring-[#3AFF97]/50 focus:outline-none resize-none leading-relaxed transition-all hover:bg-white/[0.07]"
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm border border-white/5">
                      {rawIdea.length} caracteres
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertTriangle size={20} className="flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleIdeaSubmit}
                      disabled={loading || rawIdea.length < 20}
                      className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-200 bg-[#3AFF97] rounded-xl hover:bg-[#3AFF97]/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(58,255,151,0.3)] hover:shadow-[0_0_30px_rgba(58,255,151,0.5)]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader size={20} className="animate-spin" />
                          Analizando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Comenzar Análisis
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Clarification Questions - Split View */}
          {step === 'clarification' && !loading && (
            <div className="h-full flex flex-col lg:flex-row">
              {/* Left Panel: Question & Context */}
              <div className="lg:w-[40%] p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/[0.02] flex flex-col">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#3AFF97] font-bold tracking-wider text-xs uppercase bg-[#3AFF97]/10 px-3 py-1 rounded-full border border-[#3AFF97]/20">
                      Pregunta {currentQuestionIndex + 1} de {clarificationQuestions.length}
                    </span>
                    <span className="text-slate-500 text-xs font-mono">
                      {Math.round(((currentQuestionIndex) / clarificationQuestions.length) * 100)}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-8">
                    <div 
                      className="h-full bg-[#3AFF97] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(58,255,151,0.5)]"
                      style={{ width: `${((currentQuestionIndex + 1) / clarificationQuestions.length) * 100}%` }}
                    ></div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-medium text-white leading-tight animate-in fade-in slide-in-from-left-4 duration-500">
                    {clarificationQuestions[currentQuestionIndex]}
                  </h3>
                </div>

                <div className="mt-auto hidden lg:block">
                  <div className="bg-[#3AFF97]/5 border border-[#3AFF97]/10 rounded-xl p-5">
                    <div className="flex gap-3">
                      <div className="bg-[#3AFF97]/10 p-2 rounded-lg h-fit">
                        <Lightbulb size={18} className="text-[#3AFF97]" />
                      </div>
                      <div>
                        <h4 className="text-[#3AFF97] font-medium text-sm mb-1">Tip Pro</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          Sé lo más específico posible. Los detalles sobre tu cliente ideal y el problema ayudan a la IA a generar un plan más preciso.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Answer Input */}
              <div className="flex-1 p-8 lg:p-16 flex flex-col bg-black/40">
                <div className="flex-1 flex flex-col w-full">
                  <label className="block text-slate-400 font-medium mb-4 text-sm uppercase tracking-wider">
                    Tu Respuesta
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-xl placeholder-slate-600 focus:border-[#3AFF97]/50 focus:ring-1 focus:ring-[#3AFF97]/50 focus:outline-none resize-none leading-relaxed transition-all hover:bg-white/[0.07] mb-6"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleAnswerSubmit();
                      }
                    }}
                    autoFocus
                  />
                  
                  {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-200 flex items-center gap-3 animate-in fade-in">
                      <AlertTriangle size={20} />
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        if (currentQuestionIndex > 0) {
                          setCurrentQuestionIndex(currentQuestionIndex - 1);
                          setCurrentAnswer(clarifications[currentQuestionIndex - 1]?.answer || '');
                          setClarifications(clarifications.slice(0, -1));
                        } else {
                          setStep('input');
                        }
                      }}
                      className="px-6 py-4 text-slate-400 hover:text-white font-medium transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={!currentAnswer.trim()}
                      className="flex-1 bg-[#3AFF97] text-black hover:bg-[#3AFF97]/90 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-3 text-lg shadow-[0_0_20px_rgba(58,255,151,0.3)] hover:shadow-[0_0_30px_rgba(58,255,151,0.5)]"
                    >
                      {currentQuestionIndex < clarificationQuestions.length - 1 ? (
                        <>
                          Siguiente
                          <ArrowRight size={20} />
                        </>
                      ) : (
                        <>
                          Generar Plan
                          <FileCheck size={20} />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-center text-slate-500 text-xs mt-4">
                    Presiona <span className="font-bold text-slate-400">Ctrl + Enter</span> para enviar
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Generating Plan */}
          {step === 'generation' && (
             <ProcessingStatus 
                loading={true} 
                steps={[
                  "Analizando respuestas del usuario...",
                  "Construyendo perfiles de usuario (Personas)...",
                  "Diseñando estrategia de validación...",
                  "Formulando hipótesis de riesgo...",
                  "Identificando métricas de éxito..."
                ]}
             />
          )}

          {/* STEP 4: Review Generated Plan */}
          {step === 'review' && generatedPlan && (
            <div className="h-full overflow-y-auto p-8 lg:p-16 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="w-full space-y-8">
                
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3AFF97]/10 text-[#3AFF97] mb-6 border border-[#3AFF97]/20 shadow-[0_0_20px_rgba(58,255,151,0.2)]">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">¡Tu plan está listo!</h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Hemos generado una hoja de ruta completa para validar tu idea. Revisa los detalles antes de crear el proyecto.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1: Objectives & Metrics */}
                  <div className="space-y-6">
                    <Section icon={<Target />} title="Objetivos" color="neon">
                      <ul className="space-y-3">
                        {generatedPlan.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-200 text-sm">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#3AFF97] flex-shrink-0 shadow-[0_0_5px_rgba(58,255,151,0.5)]"></div>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </Section>

                    <Section icon={<TrendingUp />} title="Métricas Clave" color="neon">
                      <div className="grid grid-cols-2 gap-3">
                        <Metric label="Viabilidad" value={`${generatedPlan.successMetrics.viabilityThreshold}%`} />
                        <Metric label="Entrevistas" value={generatedPlan.successMetrics.interviewTarget} />
                        <Metric label="Early Adopters" value={`${generatedPlan.successMetrics.earlyAdopterPercentage}%`} />
                        <Metric label="WTP" value={`${generatedPlan.successMetrics.willingnessToPayThreshold}%`} />
                      </div>
                    </Section>
                  </div>

                  {/* Column 2: Personas (Wider) */}
                  <div className="lg:col-span-2 space-y-6">
                    <Section icon={<Users />} title="Personas Objetivo" color="neon">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedPlan.personas.map((persona, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/[0.07] transition-colors group">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-[#3AFF97]/10 border border-[#3AFF97]/20 flex items-center justify-center text-[#3AFF97] font-bold text-sm group-hover:bg-[#3AFF97] group-hover:text-black transition-all">
                                {persona.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-white font-bold">{persona.name}</h4>
                                <p className="text-slate-400 text-xs">{persona.demographics}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-3 text-xs mt-4">
                              <div>
                                <span className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">Dolores</span>
                                <ul className="mt-1 space-y-1">
                                  {persona.painPoints.slice(0, 3).map((pain, j) => (
                                    <li key={j} className="text-slate-300 flex items-start gap-1.5">
                                      <span className="mt-1 w-1 h-1 rounded-full bg-red-400 flex-shrink-0"></span>
                                      {pain}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="bg-white/5 rounded-lg p-3 italic text-slate-300 border border-white/10">
                                "{persona.quote}"
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Section icon={<MessageCircle />} title="Validación" color="neon">
                        <div className="space-y-2">
                          {generatedPlan.questions.slice(0, 4).map((q, i) => (
                            <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                              <span className="text-[#3AFF97] font-bold text-sm mt-0.5">{i + 1}.</span>
                              <p className="text-slate-300 text-sm">{q.text}</p>
                            </div>
                          ))}
                        </div>
                      </Section>

                      <Section icon={<AlertTriangle />} title="Riesgos" color="red">
                        <div className="space-y-3">
                          {generatedPlan.risks.slice(0, 3).map((risk, i) => (
                            <div key={i} className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-red-200 font-medium text-sm">{risk.risk}</span>
                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                  risk.severity === 'high' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                                }`}>{risk.severity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Section>
                    </div>
                  </div>
                </div>

                {/* Timeline - Full Width */}
                <Section icon={<Calendar />} title="Timeline Estimado" color="neon">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden group hover:border-[#3AFF97]/30 transition-all">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl font-bold text-[#3AFF97]">1</span>
                      </div>
                      <h4 className="text-white font-bold mb-1">Preparación</h4>
                      <p className="text-slate-400 text-sm">{generatedPlan.timeline.phase1_preparation}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden group hover:border-[#3AFF97]/30 transition-all">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl font-bold text-[#3AFF97]">2</span>
                      </div>
                      <h4 className="text-white font-bold mb-1">Entrevistas</h4>
                      <p className="text-slate-400 text-sm">{generatedPlan.timeline.phase2_interviews}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative overflow-hidden group hover:border-[#3AFF97]/30 transition-all">
                      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl font-bold text-[#3AFF97]">3</span>
                      </div>
                      <h4 className="text-white font-bold mb-1">Análisis</h4>
                      <p className="text-slate-400 text-sm">{generatedPlan.timeline.phase3_analysis}</p>
                    </div>
                  </div>
                </Section>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleApprove}
                    className="bg-[#3AFF97] text-black hover:bg-[#3AFF97]/90 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(58,255,151,0.3)] hover:shadow-[0_0_30px_rgba(58,255,151,0.5)]"
                  >
                    <CheckCircle size={20} />
                    Crear Proyecto
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StepIndicator: React.FC<{ active: boolean; completed: boolean; label: string }> = ({
  active,
  completed,
  label,
}) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
    active ? 'bg-white/10' : ''
  }`}>
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
        completed
          ? 'bg-[#3AFF97] text-black shadow-[0_0_10px_rgba(58,255,151,0.5)]'
          : active
          ? 'bg-white text-black'
          : 'bg-white/10 text-white/40'
      }`}
    >
      {completed ? '✓' : label.charAt(0)}
    </div>
    <span
      className={`text-xs font-medium hidden sm:block ${
        active ? 'text-white' : completed ? 'text-[#3AFF97]' : 'text-white/40'
      }`}
    >
      {label}
    </span>
  </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; color: string; children: React.ReactNode }> = ({
  icon,
  title,
  color,
  children,
}) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
    <h3 className={`${color === 'neon' ? 'text-[#3AFF97]' : `text-${color}-400`} font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider`}>
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const Metric: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
    <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">{label}</p>
    <p className="text-white text-xl font-bold">{value}</p>
  </div>
);
