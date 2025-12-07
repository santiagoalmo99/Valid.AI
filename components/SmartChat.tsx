import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Sparkles, LayoutDashboard, Database, History, ChevronRight, PieChart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import * as Gemini from '../services/aiService';

export const SmartChat = ({ project, interviews, onNotify }: any) => {
  const [messages, setMessages] = useState<any[]>([
    { 
      id: 1, 
      role: 'ai', 
      content: `Hola. Soy tu **Analista Estratégico de VALID.AI**. \n\nTengo el contexto completo de **${project.name}**, analizando datos de *${interviews.length} entrevistas* y tus métricas clave.\n\nPuedo ayudarte a:\n- Identificar patrones ocultos en las respuestas.\n- Generar estrategias de pivote o crecimiento.\n- Redactar comunicaciones para inversores.` 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content
      }));

      const response = await Gemini.chatWithProjectContext(input, history, project, interviews);
      
      const aiMsg = { id: Date.now() + 1, role: 'ai', content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now() + 1, role: 'ai', content: "Lo siento, hubo un error de conexión al procesar tu solicitud." };
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

  return (
    <div className="flex h-full w-full mx-auto animate-fade-in relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-[#0F1117]">
       
       {/* LEFT SIDEBAR - Context & Tools */}
       <div className="w-72 bg-black/40 border-r border-white/5 flex-col hidden md:flex backdrop-blur-xl">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-white/5">
             <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                   <Bot size={18} />
                </div>
                <h3 className="font-bold text-white tracking-wide text-sm">AI Analyst</h3>
             </div>
             <p className="text-[10px] text-slate-500 pl-11">v2.4 Pro Environment</p>
          </div>

          {/* Project Context Stats */}
          <div className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
             <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-wider flex items-center gap-2">
                   <Database size={10} /> Active Context
                </h4>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Project</span>
                      <span className="text-xs font-bold text-white truncate max-w-[100px]">{project.name}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Interviews</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{interviews.length}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Data Points</span>
                      <span className="text-xs font-bold text-indigo-400">~{interviews.length * 8}</span>
                   </div>
                </div>
             </div>

             {/* Capabilities */}
             <div>
                <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-wider flex items-center gap-2">
                   <Zap size={10} /> Capabilities
                </h4>
                <div className="space-y-1">
                   {['Pattern Recognition', 'Sentiment Analysis', 'Strategic Pivoting', 'Market Fit Scoring'].map((cap) => (
                      <div key={cap} className="flex items-center gap-2 text-xs text-slate-400 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-default">
                         <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                         {cap}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 bg-black/20">
             <button onClick={() => onNotify && onNotify("Exportando historial de chat...", 'info')} className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
                <History size={14} /> Export Chat History
             </button>
          </div>
       </div>

       {/* MAIN CHAT AREA */}
       <div className="flex-1 flex flex-col relative bg-gradient-to-b from-slate-900/50 to-black/50">
          
          {/* Top Bar (Mobile oriented but visible on desktop for consistency) */}
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] backdrop-blur-sm">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></span>
                <span className="text-xs font-medium text-slate-300">VALID.AI Neural Engine</span>
             </div>
             <div className="flex gap-2">
                {['Creative', 'Strict'].map(mode => (
                   <span key={mode} className="text-[10px] px-2 py-1 rounded-md bg-white/5 text-slate-500 border border-white/5 cursor-default hover:text-slate-300">
                      {mode}
                   </span>
                ))}
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
             {messages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                   {/* Avatar AI */}
                   {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                         <Sparkles size={14} className="text-indigo-400"/>
                      </div>
                   )}
                   
                   {/* Bubble */}
                   <div className={`max-w-[85%] md:max-w-[75%] space-y-1 ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                      <div className={`p-4 md:p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                         msg.role === 'user' 
                            ? 'bg-[#2B2D31] text-white rounded-tr-sm' 
                            : 'bg-transparent text-slate-200 px-0 md:px-0' // AI messages cleaner, almost invisible background
                      }`}>
                         {msg.role === 'user' ? (
                            msg.content
                         ) : (
                            <ReactMarkdown 
                               components={{
                                  strong: ({node, ...props}) => <span className="font-bold text-indigo-300" {...props} />,
                                  ul: ({node, ...props}) => <ul className="list-disc pl-4 my-3 space-y-2 text-slate-300" {...props} />,
                                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-3 space-y-2 text-slate-300" {...props} />,
                                  li: ({node, ...props}) => <li className="" {...props} />,
                                  p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                                  h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
                                  code: ({node, ...props}) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono text-emerald-300" {...props} />
                               }}
                            >
                               {msg.content}
                            </ReactMarkdown>
                         )}
                      </div>
                   </div>

                   {/* Avatar User */}
                   {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1 order-2">
                         <User size={14} className="text-slate-400"/>
                      </div>
                   )}
                </motion.div>
             ))}
             
             {loading && (
                <motion.div initial={{ opacity: 0 }} className="flex gap-4 max-w-3xl mx-auto">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles size={14} className="text-indigo-400 animate-spin-slow"/>
                   </div>
                   <div className="flex items-center gap-1 h-10 px-3">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                   </div>
                </motion.div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 mx-auto w-full max-w-3xl">
             <div className="relative bg-[#1E1F24] border border-white/10 rounded-xl shadow-lg focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all flex flex-col">
                <textarea 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={handleKeyPress}
                   placeholder="Mensaje a VALID.AI..."
                   className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none p-4 text-sm resize-none min-h-[50px] max-h-[200px] custom-scrollbar"
                   rows={1}
                   disabled={loading}
                   style={{ height: 'auto', minHeight: '56px' }}
                   onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                   }}
                />
                
                <div className="flex justify-between items-center px-2 pb-2">
                   <div className="flex gap-1">
                      <button className="p-2 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-colors" title="Adjuntar contexto">
                         <Paperclip size={16} />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-colors" title="Métricas">
                         <PieChart size={16} />
                      </button>
                   </div>
                   <button 
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className="p-2 bg-white text-black rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <Send size={16} />
                   </button>
                </div>
             </div>
             <p className="text-center text-[10px] text-slate-600 mt-3">VALID.AI puede cometer errores. Verifica la información importante.</p>
          </div>

       </div>
    </div>
  );
};
