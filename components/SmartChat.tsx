import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Sparkles, Database, History, PieChart, Zap, Search, FileText, TrendingUp, Target, Users, DollarSign, Briefcase, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import * as Gemini from '../services/aiService';

// ============ TYPES ============
interface Message {
  id: number;
  role: 'ai' | 'user';
  content: string;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  prompt: string;
}

interface TopicChip {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

// ============ CONSTANTS ============
const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'patterns',
    icon: <Search className="w-6 h-6" />,
    title: 'Analizar Patrones',
    description: 'Detecta tendencias ocultas en las respuestas de tus entrevistas',
    prompt: 'Analiza los patrones más importantes en las respuestas de mis entrevistas. ¿Qué tendencias o insights ocultos puedes identificar?'
  },
  {
    id: 'report',
    icon: <FileText className="w-6 h-6" />,
    title: 'Resumen Ejecutivo',
    description: 'Genera un resumen de validación para inversores',
    prompt: 'Genera un resumen ejecutivo de mi proyecto orientado a inversores. Incluye métricas clave, validación del problema y recomendaciones.'
  },
  {
    id: 'pivot',
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Estrategia de Pivote',
    description: 'Obtén recomendaciones de pivote basadas en datos',
    prompt: 'Basándote en los datos de validación, ¿debería pivotar? ¿Qué opciones de pivote me recomiendas y por qué?'
  }
];

const TOPIC_CHIPS: TopicChip[] = [
  { id: 'market', label: 'Mercado', icon: <Target size={14} />, prompt: '¿Cuál es el tamaño del mercado potencial para mi proyecto y cómo puedo capturarlo?' },
  { id: 'competition', label: 'Competencia', icon: <Users size={14} />, prompt: '¿Quiénes son mis principales competidores y cómo me diferencio de ellos?' },
  { id: 'finance', label: 'Financiero', icon: <DollarSign size={14} />, prompt: 'Genera proyecciones financieras básicas para los primeros 12 meses de mi proyecto.' },
  { id: 'team', label: 'Equipo', icon: <Briefcase size={14} />, prompt: '¿Qué perfiles de equipo necesito para ejecutar este proyecto exitosamente?' },
];

// ============ MAIN COMPONENT ============
export const SmartChat = ({ project, interviews, onNotify, userName }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayName = userName || 'Emprendedor';
  const hasMessages = messages.length > 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const messageText = customPrompt || input.trim();
    if (!messageText) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content
      }));

      const response = await Gemini.chatWithProjectContext(messageText, history, project, interviews);
      
      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: "Lo siento, hubo un error de conexión. Intenta de nuevo." 
      };
      setMessages(prev => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.prompt);
  };

  const handleTopicChip = (chip: TopicChip) => {
    handleSend(chip.prompt);
  };

  return (
    <div className="flex h-full w-full mx-auto animate-fade-in relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#0A0A0A]">
       
       {/* LEFT SIDEBAR - Context & Tools */}
       <div className="w-72 bg-black/60 border-r border-white/5 flex-col hidden lg:flex backdrop-blur-xl">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-white/5">
             <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-[#3AFF97]/20 text-[#3AFF97] flex items-center justify-center border border-[#3AFF97]/30 shadow-[0_0_15px_rgba(58,255,151,0.2)]">
                   <Bot size={20} />
                </div>
                <div>
                   <h3 className="font-bold text-white tracking-wide text-base">Smart Chat</h3>
                   <span className="text-xs text-[#3AFF97] bg-[#3AFF97]/10 px-2 py-0.5 rounded-full border border-[#3AFF97]/20">BETA</span>
                </div>
             </div>
             <p className="text-xs text-slate-400 mt-2">Online • Contexto: {project.name}</p>
          </div>

          {/* Project Context Stats */}
          <div className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
             <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider flex items-center gap-2">
                   <Database size={12} /> Contexto Activo
                </h4>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Proyecto</span>
                      <span className="text-sm font-bold text-white truncate max-w-[120px]">{project.name}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Entrevistas</span>
                      <span className="text-sm font-bold text-[#3AFF97] bg-[#3AFF97]/10 px-2 py-0.5 rounded-full">{interviews.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Data Points</span>
                      <span className="text-sm font-bold text-indigo-400">~{interviews.length * 8}</span>
                   </div>
                </div>
             </div>

             {/* Capabilities */}
             <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 mb-3 tracking-wider flex items-center gap-2">
                   <Zap size={12} /> Capacidades
                </h4>
                <div className="space-y-1">
                   {['Reconocimiento de Patrones', 'Análisis de Sentimiento', 'Estrategia de Pivote', 'Market Fit Scoring'].map((cap) => (
                      <div key={cap} className="flex items-center gap-2 text-sm text-slate-400 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#3AFF97]"></div>
                         {cap}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 bg-black/40">
             <button onClick={() => onNotify && onNotify("Exportando historial de chat...", 'info')} className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
                <History size={16} /> Exportar Historial
             </button>
          </div>
       </div>

       {/* MAIN CHAT AREA */}
       <div className="flex-1 flex flex-col relative bg-gradient-to-b from-slate-900/30 to-black/50">
          
          {/* Top Bar */}
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] backdrop-blur-sm">
             <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3AFF97] shadow-[0_0_10px_rgba(58,255,151,0.5)] animate-pulse"></span>
                <span className="text-sm font-medium text-slate-200">VALID.AI Neural Engine</span>
             </div>
             <div className="flex gap-2">
                <span className="text-xs px-3 py-1.5 rounded-lg bg-[#3AFF97]/10 text-[#3AFF97] border border-[#3AFF97]/20 font-medium">
                   v2.5
                </span>
             </div>
          </div>

          {/* Content Area - Welcome or Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
             <AnimatePresence mode="wait">
                {!hasMessages ? (
                   /* ============ WELCOME SCREEN ============ */
                   <motion.div
                     key="welcome"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="max-w-4xl mx-auto text-center space-y-10 py-8"
                   >
                      {/* Greeting */}
                      <div className="space-y-4">
                         <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Hola {displayName}, <span className="text-[#3AFF97]">¿Listo para validar?</span>
                         </h1>
                         <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Soy tu analista de IA con acceso total a los datos de <span className="text-white font-semibold">{project.name}</span>, 
                            incluyendo {interviews.length} entrevistas y tu reporte de análisis profundo.
                         </p>
                      </div>

                      {/* Quick Action Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {QUICK_ACTIONS.map((action, idx) => (
                            <motion.button
                               key={action.id}
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: idx * 0.1 }}
                               onClick={() => handleQuickAction(action)}
                               className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3AFF97]/50 hover:bg-[#3AFF97]/5 transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(58,255,151,0.1)]"
                            >
                               <div className="w-12 h-12 rounded-xl bg-[#3AFF97]/10 text-[#3AFF97] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  {action.icon}
                               </div>
                               <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                               <p className="text-sm text-slate-400 leading-relaxed">{action.description}</p>
                            </motion.button>
                         ))}
                      </div>

                      {/* Topic Chips */}
                      <div className="space-y-3">
                         <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">O explora por tema</p>
                         <div className="flex flex-wrap justify-center gap-3">
                            {TOPIC_CHIPS.map((chip) => (
                               <button
                                  key={chip.id}
                                  onClick={() => handleTopicChip(chip)}
                                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:text-white hover:border-[#3AFF97]/50 hover:bg-[#3AFF97]/10 transition-all"
                               >
                                  {chip.icon}
                                  {chip.label}
                               </button>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                ) : (
                   /* ============ MESSAGES VIEW ============ */
                   <motion.div
                     key="messages"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="space-y-8 max-w-5xl mx-auto px-6 w-full"
                   >
                      {messages.map((msg) => (
                         <motion.div 
                           key={msg.id} 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                         >
                            {/* Avatar AI */}
                            {msg.role === 'ai' && (
                               <div className="w-10 h-10 rounded-full bg-[#3AFF97]/20 border border-[#3AFF97]/30 flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(58,255,151,0.2)]">
                                  <Sparkles size={18} className="text-[#3AFF97]"/>
                               </div>
                            )}
                            
                            {/* Bubble */}
                            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                               <div className={`px-6 py-4 rounded-2xl text-[16px] leading-relaxed ${
                                  msg.role === 'user' 
                                     ? 'bg-[#3AFF97] text-black font-medium rounded-tr-sm shadow-lg' 
                                     : 'bg-white/[0.03] text-slate-200 border border-white/5 rounded-tl-sm'
                               }`}>
                                  {msg.role === 'user' ? (
                                     msg.content
                                  ) : (
                                     <ReactMarkdown 
                                        components={{
                                           strong: ({node, ...props}) => <span className="font-bold text-[#3AFF97]" {...props} />,
                                           ul: ({node, ...props}) => <ul className="list-disc pl-5 my-4 space-y-2 text-slate-300" {...props} />,
                                           ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-4 space-y-2 text-slate-300" {...props} />,
                                           li: ({node, ...props}) => <li className="text-base" {...props} />,
                                           p: ({node, ...props}) => <p className="mb-4 last:mb-0 text-base" {...props} />,
                                           h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-5 mb-3" {...props} />,
                                           code: ({node, ...props}) => <code className="bg-white/10 px-2 py-1 rounded text-sm font-mono text-[#3AFF97]" {...props} />
                                        }}
                                     >
                                        {msg.content}
                                     </ReactMarkdown>
                                  )}
                               </div>
                            </div>

                            {/* Avatar User */}
                            {msg.role === 'user' && (
                               <div className="w-10 h-10 rounded-full bg-slate-700/50 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1 order-2">
                                  <User size={18} className="text-slate-400"/>
                               </div>
                            )}
                         </motion.div>
                      ))}
                      
                      {loading && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#3AFF97]/20 border border-[#3AFF97]/30 flex items-center justify-center flex-shrink-0 mt-1">
                               <Sparkles size={18} className="text-[#3AFF97] animate-pulse"/>
                            </div>
                            <div className="flex items-center gap-2 h-12 px-4">
                               <span className="w-2 h-2 bg-[#3AFF97] rounded-full animate-bounce"></span>
                               <span className="w-2 h-2 bg-[#3AFF97] rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                               <span className="w-2 h-2 bg-[#3AFF97] rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                            </div>
                         </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* ============ INPUT AREA ============ */}\n          <div className="p-4 md:p-6 mx-auto w-full max-w-5xl">
             {/* Action Chips */}
             {hasMessages && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
                   {TOPIC_CHIPS.slice(0, 3).map((chip) => (
                      <button
                         key={chip.id}
                         onClick={() => handleTopicChip(chip)}
                         className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-[#3AFF97]/50 transition-all whitespace-nowrap"
                      >
                         {chip.icon}
                         {chip.label}
                      </button>
                   ))}
                </div>
             )}
             
             {/* Input Container */}
             <div className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-[#3AFF97]/30 focus-within:border-[#3AFF97]/50 transition-all flex flex-col">
                <textarea 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={handleKeyPress}
                   placeholder="Pregunta sobre tendencias, métricas o estrategias..."
                   className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none p-5 text-base resize-none min-h-[60px] max-h-[200px] custom-scrollbar"
                   rows={1}
                   disabled={loading}
                   style={{ height: 'auto', minHeight: '60px' }}
                   onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                   }}
                />
                
                <div className="flex justify-between items-center px-3 pb-3">
                   <div className="flex gap-1">
                      <button className="p-2.5 text-slate-500 hover:text-[#3AFF97] hover:bg-[#3AFF97]/10 rounded-xl transition-colors" title="Adjuntar archivo">
                         <Paperclip size={18} />
                      </button>
                      <button className="p-2.5 text-slate-500 hover:text-[#3AFF97] hover:bg-[#3AFF97]/10 rounded-xl transition-colors" title="Métricas">
                         <PieChart size={18} />
                      </button>
                      <button className="p-2.5 text-slate-500 hover:text-[#3AFF97] hover:bg-[#3AFF97]/10 rounded-xl transition-colors" title="Voz">
                         <Mic size={18} />
                      </button>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-600">AI-POWERED STRATEGY</span>
                      <button 
                         onClick={() => handleSend()}
                         disabled={!input.trim() || loading}
                         className="p-3 bg-[#3AFF97] text-black rounded-xl hover:bg-[#2EE085] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(58,255,151,0.3)] hover:shadow-[0_0_30px_rgba(58,255,151,0.5)]"
                      >
                         <Send size={18} />
                      </button>
                   </div>
                </div>
             </div>
             <p className="text-center text-xs text-slate-600 mt-3">VALID.AI puede cometer errores. Verifica la información importante.</p>
          </div>

       </div>
    </div>
  );
};

export default SmartChat;
