import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, Sparkles, FileText, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import * as Gemini from '../services/aiService';

const GLASS_PANEL = "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl";

export const SmartChat = ({ project, interviews, onNotify }: any) => {
  const [messages, setMessages] = useState<any[]>([
    { 
      id: 1, 
      role: 'ai', 
      content: `Hola. Soy tu **Analista Senior de Venture Capital**. \n\nTengo acceso total a los datos de **${project.name}**, incluyendo ${interviews.length} entrevistas y tu reporte de análisis profundo.\n\n¿Qué quieres saber sobre la viabilidad, métricas o estrategia de tu proyecto?` 
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
      // Prepare history for API (excluding the last user message which is sent as prompt context)
      const history = messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        content: m.content
      }));

      const response = await Gemini.chatWithProjectContext(input, history, project, interviews);
      
      const aiMsg = { id: Date.now() + 1, role: 'ai', content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now() + 1, role: 'ai', content: "Lo siento, hubo un error de conexión. Intenta de nuevo." };
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
    <div className="flex flex-col h-full w-full mx-auto animate-fade-in relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
       {/* Background Effects */}
       <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-0"></div>
       <div className="absolute top-0 right-0 w-96 h-96 bg-neon/5 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

       {/* Header */}
       <div className="relative z-10 bg-white/5 backdrop-blur-md p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon/20 to-emerald-500/20 border border-neon/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(223,255,0,0.2)]">
                <Bot className="text-neon relative z-10" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   Smart Chat <span className="text-[10px] bg-gradient-to-r from-neon to-emerald-400 text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-lg">Beta</span>
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   Online • Contexto: {project.name}
                </p>
             </div>
          </div>
          
          <button onClick={() => onNotify && onNotify("Integración con Google Drive y Notion: Próximamente en v3.0", 'info')} className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/5 hover:border-neon/30 hover:text-white group">
             <UploadCloud size={14} className="group-hover:scale-110 transition-transform"/> Subir Datos
          </button>
       </div>

       {/* Chat Area */}
       <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {messages.map((msg) => (
             <motion.div 
               key={msg.id} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
             >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-slate-800 border border-white/10' : 'bg-black/50 border border-neon/30'}`}>
                   {msg.role === 'user' ? <User size={18} className="text-slate-300"/> : <Sparkles size={18} className="text-neon"/>}
                </div>
                
                <div className={`max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed shadow-xl backdrop-blur-md ${
                   msg.role === 'user' 
                      ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none border border-white/10' 
                      : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'
                }`}>
                   <ReactMarkdown 
                      components={{
                         strong: ({node, ...props}) => <span className="text-neon font-bold" {...props} />,
                         ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                         li: ({node, ...props}) => <li className="text-slate-300" {...props} />,
                         p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                      }}
                   >
                      {msg.content}
                   </ReactMarkdown>
                </div>
             </motion.div>
          ))}
          
          {loading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-black/50 border border-neon/30 flex items-center justify-center flex-shrink-0">
                   <Sparkles size={18} className="text-neon"/>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-3xl rounded-tl-none flex gap-1 items-center h-12">
                   <div className="w-2 h-2 bg-neon rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                   <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="relative z-10 p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
          <div className="relative flex items-center gap-3 bg-black/50 border border-white/10 rounded-2xl p-2 focus-within:border-neon/50 focus-within:shadow-[0_0_20px_rgba(223,255,0,0.1)] transition-all duration-300">
             <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                <Paperclip size={20} />
             </button>
             
             <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Pregunta sobre tendencias, métricas o estrategias..."
                className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none px-2"
                disabled={loading}
             />
             
             <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-3 bg-neon text-black rounded-xl hover:bg-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(223,255,0,0.4)]"
             >
                <Send size={20} />
             </button>
          </div>
          <div className="text-center mt-3 flex justify-center gap-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
             <span>AI-Powered Strategy</span>
             <span>•</span>
             <span>Secure Context</span>
          </div>
       </div>
    </div>
  );
};
