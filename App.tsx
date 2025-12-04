import React, { useState, useEffect, useRef } from 'react';
import { ProjectTemplate, Interview, Question, Answer, DeepAnalysisReport, Language, ProductType } from './types';
import { TRANSLATIONS, INITIAL_PROJECTS, DEMO_PROJECT } from './constants';
import * as Gemini from './services/aiService';
import { getCoverByIdea } from './utils/projectCovers';
import { Sparkles, Zap, Target, ArrowRight, CheckCircle2, ChevronRight, BarChart3, PieChart as PieChartIcon, TrendingUp, Activity, Plus, Play, Users, X, Search, FileText, MessageSquare, Cpu, Globe, Lock, ArrowLeft, RefreshCw, Trash2, LayoutGrid, Upload, Settings, Download, Sun, Moon, Smartphone, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence, Transition, Variant } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, LineChart, Line, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Onboarding } from './components/Onboarding';
import { ProjectProfileModal } from './components/ProjectProfileModal';
import { InterviewModal } from './components/InterviewModal';
import { stateManager } from './services/stateManager';
import { staggerContainer, staggerItem, fadeInUp, scaleIn } from './utils/animations';
import { TemplateGallery } from './components/TemplateGallery';
import { templateToProject } from './constants/templates';
import { SmartQuestionWidget } from './components/SmartQuestionWidget';

// Lazy Load Heavy Components
const QuestionAnalysis = React.lazy(() => import('./components/QuestionAnalysis').then(module => ({ default: module.QuestionAnalysis })));
const SmartChat = React.lazy(() => import('./components/SmartChat').then(module => ({ default: module.SmartChat })));
const DocumentUploader = React.lazy(() => import('./components/DocumentUploader').then(module => ({ default: module.DocumentUploader })));
const IdeaStudio = React.lazy(() => import('./components/IdeaStudio').then(module => ({ default: module.IdeaStudio })));

// --- LOADING COMPONENT ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[200px]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-neon border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

// --- STYLES ---
const NEON_TEXT = "text-neon font-bold tracking-wide filter drop-shadow-[0_0_10px_rgba(0,255,148,0.5)]";
const GLASS_PANEL = "glass-panel rounded-3xl transition-all duration-300"; // Removed manual border/shadow to let CSS handle it

// --- COMPONENTS ---

// --- COMPONENTS ---

const Logo = ({ size = "large" }: { size?: "small" | "large" }) => (
  <div className={`relative flex items-center gap-3 ${size === "large" ? "scale-100" : "scale-75"}`}>
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 bg-neon rounded-xl rotate-45 blur-md opacity-50 animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-400 rounded-xl rotate-45 border border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center overflow-hidden">
        <div className="w-full h-[1px] bg-black/20 absolute top-1/2 -translate-y-1/2 rotate-90"></div>
        <div className="w-full h-[1px] bg-black/20 absolute top-1/2 -translate-y-1/2"></div>
        <div className="w-2 h-2 bg-black rounded-full z-10 shadow-inner"></div>
      </div>
    </div>
    <div>
      <h1 className={`font-bold text-white tracking-tighter leading-none ${size === "large" ? "text-3xl" : "text-xl"}`}>
        VALID<span className="text-neon">.AI</span>
      </h1>
      <p className={`text-slate-400 tracking-widest uppercase ${size === "large" ? "text-[10px]" : "text-[8px]"}`}>
        Intelligence
      </p>
    </div>
  </div>
);

const LoginView = () => {
  const { loginWithGoogle, loading } = useAuth();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-void">
      <div className="w-16 h-16 border-4 border-white/10 border-t-neon rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-screen items-center justify-center bg-void relative overflow-hidden">
       {/* High Impact Animated Background - Full Screen */}
       <div className="absolute inset-0 bg-black z-0 overflow-hidden">
          {/* Dominant Emerald/Neon Glows - EXTREME CHAOS MODE */}
          
          {/* 1. Main Emerald - Large, Center-Left */}
          <div className="absolute top-[-10%] left-[-10%] w-[90vw] h-[90vw] bg-emerald-500/10 rounded-full blur-[120px] animate-chaos mix-blend-screen" style={{animationDuration: '8s'}}></div>
          
          {/* 2. Neon Green - Bottom Right Accent */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-neon/10 rounded-full blur-[140px] animate-chaos mix-blend-screen" style={{animationDuration: '10s', animationDelay: '-2s', animationDirection: 'reverse'}}></div>
          
          {/* Supporting Colors for Depth & Movement */}
          
          {/* 3. Cyan - Top Right Float */}
          <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[60vw] bg-cyan-500/10 rounded-full blur-[100px] animate-chaos mix-blend-screen" style={{animationDuration: '6s', animationDelay: '-1s'}}></div>
          
          {/* 4. Deep Purple - Bottom Left Contrast (Subtle) */}
          <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] animate-chaos mix-blend-screen" style={{animationDuration: '12s', animationDelay: '-4s'}}></div>
          
          {/* 5. Bright Emerald Center Pulse */}
          <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-emerald-400/5 rounded-full blur-[80px] animate-pulse-slow mix-blend-screen" style={{animationDuration: '2s'}}></div>

          {/* Heavy Vignette & Noise for "Umbra" Atmosphere */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/70 to-black"></div>
       </div>

       {/* Split Card Container */}
       <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
          
          {/* Top Image Section */}
          <div className="h-48 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
             <img 
               src="https://image.pollinations.ai/prompt/High%20end%20abstract%203D%20technological%20composition%2C%20dark%20architectural%20grid%20background%20with%20rounded%20square%20cells%20and%20soft%20beveled%20edges%2C%20modular%20surface%20with%20depth%20and%20relief.%20Intense%20radiant%20volumetric%20god%20rays%20emanating%20from%20center%20through%20the%20grid%2C%20dramatic%20light%20beams%20towards%20corners%2C%20deep%20contrasted%20shadows.%20Central%20focal%20point%20floating%20matte%20metallic%203D%20emblem%20with%20embossed%20details.%20Monochromatic%20saturated%20neon%20green%20and%20cyan%20lighting%2C%20dense%20glowing%20atmosphere.%20Clean%203D%20render%20style%2C%20futuristic%20minimalism%2C%20cinematic%20lighting%2C%20smooth%20polished%20textures?nologo=true&width=800&height=400" 
               alt="Login Visual" 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
             />
             <div className="absolute bottom-4 left-6 z-20">
                <Logo size="small" />
             </div>
          </div>

          {/* Bottom Form Section */}
          <div className="p-8 pt-6 text-center">
             <h2 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
             <p className="text-slate-400 mb-8 text-sm">Inicia sesión para acceder a tu panel de validación.</p>
             
             <button onClick={loginWithGoogle} className="btn-premium w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-sm tracking-wide group hover:scale-[1.02] transition-transform shadow-lg hover:shadow-neon/20">
                <Globe size={18} className="text-slate-600 group-hover:text-black transition-colors" /> 
                CONTINUAR CON GOOGLE
             </button>
             
             <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
               <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Seguro</div>
               <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
               <span>Privado</span>
               <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
               <span>Encriptado</span>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- NOTIFICATIONS ---
interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const NotificationToast = ({ notifications, removeNotification }: { notifications: Notification[], removeNotification: (id: string) => void }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence>
      {notifications.map(n => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          className="pointer-events-auto flex items-center gap-4 p-4 min-w-[300px] glass-panel bg-black/60 border-l-4 border-l-neon rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          style={{ borderColor: n.type === 'error' ? '#ef4444' : n.type === 'success' ? '#00FF94' : '#00FFFF' }}
        >
          <div className={`p-2 rounded-full ${n.type === 'error' ? 'bg-red-500/20 text-red-400' : n.type === 'success' ? 'bg-emerald-500/20 text-neon' : 'bg-cyan-500/20 text-cyan-400'}`}>
             {n.type === 'success' ? <CheckCircle2 size={20} /> : n.type === 'error' ? <X size={20} /> : <Sparkles size={20} />}
          </div>
          <div className="flex-1">
             <h4 className="text-white font-bold text-sm tracking-wide">{n.type === 'error' ? 'System Error' : n.type === 'success' ? 'Success' : 'System Notice'}</h4>
             <p className="text-slate-300 text-xs">{n.message}</p>
          </div>
          <button onClick={() => removeNotification(n.id)} className="text-slate-500 hover:text-white transition-colors">
             <X size={16} />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// --- COMPONENTS ---

// 1. Session Hub (Project Grid)
const SessionHub = ({ projects, onSelect, onCreate, onDelete, onUpdate, lang, user, logout, toggleTheme, theme, isDemo }: any) => {
  const t = TRANSLATIONS[lang];
  
  // NUCLEAR OPTION: Force Default Project Visibility
  // We construct the list right here in the render to guarantee it appears
  const defaultProject = INITIAL_PROJECTS[0];
  const finalProjects = [defaultProject];
  
  // Add other projects, filtering out duplicates of the default one
  projects.forEach((p: ProjectTemplate) => {
     if (p.id !== defaultProject.id && p.name !== defaultProject.name) {
        finalProjects.push(p);
     }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in relative z-10">
       <div className="flex justify-between items-center mb-12">
          <Logo size="small" />
          <div className="flex items-center gap-4">
             {/* Migration Button (Only if needed) */}
             {projects.length === 0 && localStorage.getItem('valid_ai_projects') && (
                <button 
                  onClick={async () => {
                     if(!confirm("¿Importar proyectos antiguos a la nube?")) return;
                     const localProjs = JSON.parse(localStorage.getItem('valid_ai_projects') || '[]');
                     const localInterviews = JSON.parse(localStorage.getItem('valid_ai_interviews') || '[]');
                     
                     if (localProjs.length === 0) return alert("No hay datos locales.");
                     
                     // Migrate Projects
                     for (const p of localProjs) {
                        await FirebaseService.createProject(user.uid, p);
                     }
                     
                     // Migrate Interviews
                     for (const i of localInterviews) {
                        await FirebaseService.addInterview(i);
                     }
                     
                     alert("¡Migración completada! Tus proyectos ahora están en la nube.");
                     // Optional: Clear local storage to avoid confusion? 
                     // localStorage.removeItem('valid_ai_projects');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors border border-white/5 flex items-center gap-2"
                >
                   <Upload size={14} /> Importar Proyectos Antiguos
                </button>
             )}

             <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
                <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=random"} alt="user" className="w-8 h-8 rounded-full border border-white/20" />
                <span className="text-xs text-slate-400 font-medium hidden md:block">{user?.email?.split('@')[0]}</span>
             </div>
             <button onClick={logout} className="p-2 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors" title="Cerrar Sesión">
                <X size={20} />
             </button>
             <button onClick={onCreate} className="btn-premium px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg hover:shadow-neon/20">
                <Plus size={18} /> {t.newSession}
             </button>
          </div>
       </div>

       <motion.div 
         key={`projects-${finalProjects.length}`}
         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
         variants={staggerContainer}
         initial="initial"
         animate="animate"
       >
          {finalProjects.map((p: ProjectTemplate) => (
             <motion.div 
               key={p.id} 
               variants={staggerItem}
               onClick={() => onSelect(p)} 
               className={`group glass-panel rounded-[24px] overflow-hidden hover:border-neon/50 transition-all cursor-pointer hover:-translate-y-2 duration-500 ${isDemo ? 'border-neon/30 shadow-[0_0_20px_rgba(58,255,151,0.1)]' : ''}`}
             >
                <div className="h-56 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent z-10"></div>
                   <img src={p.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="cover" />
                   
                   <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                      {new Date(p.createdAt).toLocaleDateString()}
                   </div>

                   {isDemo && (
                      <div className="absolute top-3 left-3 z-20 bg-neon text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg animate-pulse">
                         EJEMPLO DEMO
                      </div>
                   )}

                   <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                      <span className="text-5xl drop-shadow-2xl filter">{p.emoji}</span>
                   </div>
                </div>
                
                <div className="p-6 relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-neon/10 transition-colors"></div>
                   <h3 className="text-xl font-bold text-white mb-2 relative z-10 group-hover:text-neon transition-colors">{p.name}</h3>
                   <p className="text-sm text-slate-400 line-clamp-2 mb-6 relative z-10 font-light">{p.description}</p>
                   
                   <div className="flex items-center justify-between relative z-10 border-t border-white/5 pt-4">
                      {p.deepAnalysis ? (
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-neon animate-pulse"></div>
                            <span className="text-xs font-bold text-neon">Score: {p.deepAnalysis.viabilityScore}</span>
                         </div>
                      ) : (
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <span className="text-xs text-slate-500">Pending Analysis</span>
                         </div>
                      )}
                       <ArrowRight size={16} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                 </div>
                 
                 {/* Actions: Delete & Regenerate Cover */}
                 <div className="absolute top-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                       onClick={(e) => {
                          e.stopPropagation();
                          if(confirm("¿Eliminar proyecto permanentemente?")) onDelete(p.id);
                       }}
                       className="p-2 bg-black/60 backdrop-blur-md hover:bg-red-500/80 text-white rounded-full border border-white/10 transition-colors shadow-lg"
                       title="Eliminar Proyecto"
                    >
                       <Trash2 size={14} />
                    </button>
                    
                    <button 
                       onClick={(e) => {
                          e.stopPropagation();
                          // No API call - instant cover change
                          const newCover = getCoverByIdea(p.name + ' ' + p.description);
                          onUpdate({ ...p, coverImage: newCover });
                          console.log('✅ [Cover] Assigned without API call');
                       }}
                       className="p-2 bg-black/60 backdrop-blur-md hover:bg-neon/80 hover:text-black text-white rounded-full border border-white/10 transition-colors shadow-lg"
                       title="Regenerar Portada con IA"
                    >
                       <RefreshCw size={14} />
                    </button>
                 </div>
              </motion.div>
           ))}
       </motion.div>
    </div>
  );
};

// 2. Project Detail View
const ProjectDetail = ({ project, onBack, onUpdateProject, onOpenProfile, lang, setLang, theme, setTheme }: any) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, interviews, deep_research
  const [interviews, setInterviews] = useState<Interview[]>(() => {
     try {
        const local = localStorage.getItem(`offline_interviews_${project.id}`);
        return local ? JSON.parse(local) : [];
     } catch (e) { return []; }
  });
  const { user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  const t = TRANSLATIONS[lang];

  // SHARED RETRY LOGIC
  const handleRetryAnalysis = async (interview: Interview) => {
      try {
         console.log('🔄 Starting retry analysis for:', interview.id);
         
         // Reconstruct regData for AI
         const regData = {
            name: interview.respondentName,
            email: interview.respondentEmail,
            phone: interview.respondentPhone,
            role: interview.respondentRole,
            city: interview.respondentCity,
            country: interview.respondentCountry,
            instagram: interview.respondentInstagram,
            tiktok: interview.respondentTikTok
         };

         // Run Enhanced Analysis with Chain-of-Thought
         console.log('🤖 Calling Enhanced Gemini API with surgical analysis...');
         const analysis = await Gemini.analyzeFullInterviewEnhanced(project, interview.answers, regData);
         console.log('✅ Enhanced analysis completed:', analysis);
         
         // Update Interview Object with TIMESTAMP to force React update
         const updatedInterview: Interview = {
            ...interview,
            totalScore: analysis.scores?.totalScore || 0,
            summary: analysis.summary,
            dimensionScores: analysis.scores?.dimensionScores || {},
            keyInsights: analysis.keyInsights,
            lastUpdated: Date.now() as any // Force new reference
         };

         // Save to Firebase
         console.log('💾 Saving to Firebase...');
         try {
            await FirebaseService.addInterview(updatedInterview);
            console.log('✅ Firebase save confirmed');
            
            // Offline Sync
            const offlineKey = `offline_interviews_${project.id}`;
            const offline = JSON.parse(localStorage.getItem(offlineKey) || '[]');
            const newOffline = offline.filter((i: any) => i.id !== updatedInterview.id);
            newOffline.push(updatedInterview);
            localStorage.setItem(offlineKey, JSON.stringify(newOffline));

         } catch (saveError) {
            console.warn("⚠️ Firebase save failed, saving locally:", saveError);
            
            // Offline Fallback
            const offlineKey = `offline_interviews_${project.id}`;
            const offline = JSON.parse(localStorage.getItem(offlineKey) || '[]');
            const newOffline = offline.filter((i: any) => i.id !== updatedInterview.id);
            newOffline.push(updatedInterview);
            localStorage.setItem(offlineKey, JSON.stringify(newOffline));
            
            alert("⚠️ No se pudo guardar en la nube. Se guardó LOCALMENTE.");
         }

         // Update Local State
         setInterviews(prev => prev.map(i => i.id === updatedInterview.id ? updatedInterview : i));
         
         // If this interview is currently selected in modal, update it too
         if (selectedInterview && selectedInterview.id === updatedInterview.id) {
             setSelectedInterview({...updatedInterview});
             setRenderKey(prev => prev + 1);
         }
         
         return updatedInterview;

      } catch (e) {
         console.error("❌ Retry failed:", e);
         alert(`Error al re-analizar: ${e instanceof Error ? e.message : String(e)}`);
         throw e;
      }
  };

  const handleDeleteInterview = async (id: string) => {
    if (!window.confirm(t.confirmDelete)) return;

    const originalInterviews = [...interviews];
    
    // Use StateManager for optimistic update
    try {
      await stateManager.executeOptimistic(
        // 1. Local Update (Instant)
        () => {
          // Temporarily pause subscription to prevent race conditions
          deletionInProgress.current = true;
          setInterviews(prev => prev.filter(i => i.id !== id));
          if (selectedInterview?.id === id) {
            setSelectedInterview(null);
          }
        },
        // 2. Remote Operation
        async () => {
          await FirebaseService.deleteInterview(id);
          // Small delay to allow Firestore to propagate
          await new Promise(resolve => setTimeout(resolve, 500));
          deletionInProgress.current = false;
        },
        // 3. Rollback (if failed)
        () => {
          deletionInProgress.current = false;
          setInterviews(originalInterviews);
          alert("Error deleting interview. Changes reverted.");
        },
        `Delete Interview ${id}`
      );
    } catch (error) {
      console.error("Optimistic delete failed", error);
    }
  };

  // FIRESTORE SUBSCRIPTION FOR INTERVIEWS
  const deletionInProgress = useRef(false);
  
  useEffect(() => {
     const unsubscribe = FirebaseService.subscribeToInterviews(project.id, (data) => {
         // IGNORE updates during deletion to prevent restore
         if (deletionInProgress.current) {
            console.log("🔒 Deletion in progress, ignoring Firestore update");
            return;
         }
         
         // Merge with offline data
         const offlineKey = `offline_interviews_${project.id}`;
         const offlineData = JSON.parse(localStorage.getItem(offlineKey) || '[]');
         
         // Smart Merge: Prefer newer version (Local vs Online)
         const merged = [...data];
         const onlineMap = new Map(data.map(d => [d.id, d]));
         
         offlineData.forEach((off: any) => {
            const online = onlineMap.get(off.id);
            if (!online) {
               // Not online, add it
               merged.push(off);
            } else {
               // Conflict: check timestamps
               const offTime = new Date(off.lastUpdated || off.date).getTime();
               const onTime = new Date(online.lastUpdated || online.date).getTime();
               
               // If local is significantly newer (> 2 seconds to avoid clock skew issues on same save), use local
               if (offTime > onTime + 2000) {
                  console.log(`⚠️ Using local version for ${off.id} (Local: ${offTime} > Online: ${onTime})`);
                  const index = merged.findIndex(m => m.id === off.id);
                  if (index !== -1) merged[index] = off;
               }
            }
         });
         
         // Sort by date desc
         merged.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
         
         setInterviews(merged);
      });
     return () => unsubscribe();
  }, [project.id]); // Removed deletionInProgress from deps to prevent re-subscribing

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({project, interviews}, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${project.name}_data.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-void transition-colors duration-500 relative">
       {/* Floating Pill Sidebar */}
       <div className="absolute left-6 top-1/2 -translate-y-1/2 w-20 hover:w-64 glass-panel bg-black/20 rounded-[40px] flex flex-col justify-between items-center hover:items-stretch py-6 z-50 transition-all duration-300 group !overflow-y-auto !overflow-x-hidden no-scrollbar h-[80vh] border border-white/10 shadow-2xl">
          <div className="w-full flex flex-col items-center hover:items-stretch">
             <button onClick={onBack} className="p-3 text-slate-400 hover:text-white mb-6 hover:bg-white/10 rounded-full transition-all flex items-center gap-4 justify-center group-hover:justify-start mx-auto group-hover:mx-0 group-hover:px-4 group-hover:w-full">
                <ArrowLeft size={20} className="flex-shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 delay-75 text-sm font-bold">{t.backToHub}</span>
             </button>
             
             <div className="space-y-2 flex flex-col w-full px-2">
                <NavBtn icon={<BarChart3 />} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <NavBtn icon={<Users />} label={t.interviews} active={activeTab === 'interviews'} onClick={() => setActiveTab('interviews')} />
                <NavBtn icon={<PieChartIcon />} label="Insights" active={activeTab === 'questions'} onClick={() => setActiveTab('questions')} />
                <NavBtn icon={<Search />} label="Deep Research" active={activeTab === 'deep_research'} onClick={() => setActiveTab('deep_research')} />
                <NavBtn icon={<MessageSquare />} label="Smart Chat" active={activeTab === 'smart_chat'} onClick={() => setActiveTab('smart_chat')} />
             </div>
          </div>

          <div className="flex flex-col gap-2 w-full px-2">
             <button onClick={handleExport} className="p-3 text-slate-400 hover:text-neon hover:bg-neon/10 rounded-xl transition-all flex items-center gap-4 justify-center group-hover:justify-start w-full">
                <Download size={20} className="flex-shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 delay-75 text-sm font-bold">{t.exportData}</span>
             </button>

             <div className="w-8 h-1 bg-white/10 rounded-full mx-auto group-hover:w-full transition-all"></div>

             <div className="flex items-center gap-4 p-2 justify-center group-hover:justify-start w-full">
                {user.photoURL && !imgError ? (
                   <img 
                      src={user.photoURL} 
                      referrerPolicy="no-referrer"
                      alt="user" 
                      className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0 object-cover" 
                      onError={() => setImgError(true)}
                   />
                ) : (
                   <div className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0 bg-neon/20 flex items-center justify-center text-neon font-bold text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                   </div>
                )}
                <div className="whitespace-nowrap opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 delay-75 text-xs text-slate-400">
                   {user.email?.split('@')[0]}
                </div>
             </div>
             
             <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="text-slate-400 hover:text-white p-3 rounded-xl hover:bg-white/10 flex items-center gap-4 justify-center group-hover:justify-start w-full">
                {theme === 'dark' ? <Sun size={18} className="flex-shrink-0" /> : <Moon size={18} className="flex-shrink-0" />}
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 delay-75 text-sm font-bold">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
             </button>
             
             <button onClick={() => window.location.reload()} className="text-red-400 hover:bg-red-500/10 p-3 rounded-xl transition-colors flex items-center gap-4 justify-center group-hover:justify-start w-full">
                <X size={18} className="flex-shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 w-0 group-hover:w-auto overflow-hidden transition-all duration-300 delay-75 text-sm font-bold">Sign Out</span>
             </button>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-1 overflow-y-auto relative ml-32 h-full flex flex-col">
          {/* Compact Header */}
          <div className="sticky top-0 z-40 bg-void/90 backdrop-blur-xl border-b border-white/5 px-6 py-2 flex justify-between items-center shadow-lg">
             <div 
               className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
               onClick={onOpenProfile}
             >
                <div className="text-2xl group-hover:scale-110 transition-transform">
                   {project.emoji}
                </div>
                <div>
                   <h2 className="text-lg font-bold text-white group-hover:text-neon transition-colors flex items-center gap-2">
                     {project.name} <Settings size={16} className="opacity-0 group-hover:opacity-100 text-slate-400" />
                   </h2>
                   <p className="text-xs text-slate-400 line-clamp-1 max-w-md font-light">{project.description}</p>
                </div>
             </div>
             <button onClick={() => setActiveTab('new_interview')} className="bg-white text-black font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform flex items-center gap-2 text-xs shadow-lg shadow-white/10">
                <Play size={14} fill="black" /> Nueva Entrevista
             </button>
          </div>

          <div className="flex-1 relative">
             {activeTab === 'dashboard' && <div className="p-8"><DashboardView project={project} interviews={interviews} t={t} /></div>}
             {activeTab === 'interviews' && <div className="p-8">
                <InterviewsView 
                   interviews={interviews} 
                   project={project} 
                   onSelect={setSelectedInterview}
                   onDelete={async (id: string) => {
                      if (!window.confirm("¿Eliminar esta entrevista?")) return;
                      
                      // DEMO MODE: Local Only
                      if (project.id === 'demo_project_001') {
                         setInterviews(prev => prev.filter(i => i.id !== id));
                         const offlineKey = `offline_interviews_${project.id}`;
                         const offline = JSON.parse(localStorage.getItem(offlineKey) || '[]');
                         const newOffline = offline.filter((i: any) => i.id !== id);
                         localStorage.setItem(offlineKey, JSON.stringify(newOffline));
                         return;
                      }

                      // LOCK subscription to prevent restore
                      deletionInProgress.current = true;
                      
                      try {
                         // Try Firebase delete with 3s timeout
                         const deletePromise = FirebaseService.deleteInterview(id);
                         const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error("Timeout: Firebase blocked or offline")), 3000)
                         );
                         
                         await Promise.race([deletePromise, timeoutPromise]);
                         
                         console.log("✅ Firebase delete successful");
                      } catch (e: any) {
                         console.error("Delete failed", e);
                         
                         // Show alert for blocked/timeout cases
                         if (e.message && e.message.includes("Timeout")) {
                            console.warn("⚠️ Firebase timeout, forcing local delete");
                            alert("⚠️ Eliminado LOCALMENTE.\n\nTu navegador bloqueó la conexión a Firebase.\nDesactiva el bloqueador de anuncios para sincronizar.");
                         } else if (e.code === 'permission-denied') {
                            alert("No tienes permiso para eliminar esta entrevista.");
                         } else {
                            alert("Error al eliminar. Si usas un bloqueador de anuncios, desactívalo para este sitio.");
                         }
                      } finally {
                         // Update local state AND unlock after small delay
                         setInterviews(prev => prev.filter(i => i.id !== id));
                         const offlineKey = `offline_interviews_${project.id}`;
                         const offline = JSON.parse(localStorage.getItem(offlineKey) || '[]');
                         const newOffline = offline.filter((i: any) => i.id !== id);
                         localStorage.setItem(offlineKey, JSON.stringify(newOffline));
                         
                         // Unlock after 1 second to allow delete to propagate
                         setTimeout(() => { deletionInProgress.current = false; }, 1000);
                      }
                   }}
                   onDeleteAll={async () => {
                      if (!window.confirm("¿ELIMINAR TODAS LAS ENTREVISTAS? Esta acción no se puede deshacer.")) return;
                      
                      // DEMO MODE: Local Only
                      if (project.id === 'demo_project_001') {
                         setInterviews([]);
                         localStorage.removeItem(`offline_interviews_${project.id}`);
                         return;
                      }

                      // LOCK subscription to prevent restore
                      deletionInProgress.current = true;

                      const ids = interviews.map(i => i.id);
                      try {
                         // Try batch delete with 5s timeout
                         const deletePromise = FirebaseService.deleteInterviewsBatch(ids);
                         const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error("Timeout: Firebase blocked or offline")), 5000)
                         );
                         
                         await Promise.race([deletePromise, timeoutPromise]);
                         
                         console.log("✅ Firebase batch delete successful");
                      } catch (e: any) {
                         console.error("Batch delete failed", e);
                         
                         // Show alert for blocked/timeout cases
                         if (e.message && e.message.includes("Timeout")) {
                            console.warn("⚠️ Firebase timeout, forcing local delete all");
                            alert("⚠️ Eliminado LOCALMENTE.\n\nTu navegador bloqueó Firebase.\nDesactiva el bloqueador de anuncios para sincronizar con la nube.");
                         } else {
                            alert("Error al eliminar todo. Verifica tu conexión o desactiva el bloqueador de anuncios.");
                         }
                      } finally {
                         // Update local state AND unlock after small delay
                         setInterviews([]);
                         localStorage.removeItem(`offline_interviews_${project.id}`);
                         
                         // Unlock after 2 seconds to allow batch delete to propagate
                         setTimeout(() => { deletionInProgress.current = false; }, 2000);
                      }
                   }}
                   onRetry={async (interview: Interview) => {
                      await handleRetryAnalysis(interview);
                   }}
                />
             </div>}
             {activeTab === 'deep_research' && <div className="p-8"><DeepResearchView project={project} interviews={interviews} onUpdate={onUpdateProject} t={t} /></div>}
             {activeTab === 'questions' && (
               <div className="p-8">
                 <React.Suspense fallback={<LoadingSpinner />}>
                   <QuestionAnalysis project={project} interviews={interviews} />
                 </React.Suspense>
               </div>
             )}
             
             {/* Full Size Chat */}
             {activeTab === 'smart_chat' && (
                <div className="absolute inset-0 p-4 h-full">
                   <React.Suspense fallback={<LoadingSpinner />}>
                     <SmartChat project={project} interviews={interviews} />
                   </React.Suspense>
                </div>
             )}
             
             {activeTab === 'new_interview' && <div className="p-8"><InterviewForm project={project} onSave={async (i: any) => {
                try {
                   // SAFETY: If Demo Project, do not save to Cloud to prevent data mixing
                   if (project.id === 'demo_project_001') {
                      throw new Error("Demo Mode: Local Storage Only");
                   }

                   // Try Online Save with 5s Timeout
                   const savePromise = FirebaseService.addInterview(i);
                   const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Network Timeout")), 5000));
                   await Promise.race([savePromise, timeoutPromise]);
                } catch (e) {
                   console.error("Online save failed/timed out, using offline fallback", e);
                   
                   // Offline Fallback
                   const offlineKey = `offline_interviews_${project.id}`;
                   const existing = JSON.parse(localStorage.getItem(offlineKey) || '[]');
                   // Prevent duplicates in offline storage
                   const uniqueExisting = existing.filter((e: any) => e.id !== i.id);
                   localStorage.setItem(offlineKey, JSON.stringify([i, ...uniqueExisting]));
                   
                   // Manually update local state to show it immediately
                   setInterviews(prev => [i, ...prev]);
                   
                   alert("⚠️ Conexión inestable o bloqueada.\n\n✅ Entrevista guardada LOCALMENTE.\n\nTus datos están seguros.");
                }
                setActiveTab('dashboard');
             }} onCancel={() => setActiveTab('dashboard')} onClose={(interview: any) => {
                setActiveTab('dashboard');
                setSelectedInterview(interview);
             }} t={t} /></div>}
          </div>

          {selectedInterview && (
          <InterviewModal 
            key={`modal-${renderKey}`}
            interview={selectedInterview} 
            project={project} 
            onClose={() => setSelectedInterview(null)} 
            onRetryAnalysis={() => handleRetryAnalysis(selectedInterview)} 
          />
        )}
       </div>
    </div>
  )
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-3 rounded-xl transition-all flex items-center gap-4 justify-center group-hover:justify-start ${active ? 'bg-neon text-black shadow-[0_0_15px_rgba(223,255,0,0.4)]' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
  >
     {React.cloneElement(icon, { size: 20, className: "flex-shrink-0" })}
     <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 text-sm font-bold overflow-hidden w-0 group-hover:w-auto">{label}</span>
  </button>
);

// 3. Smart Parsing / Create Flow
const CreateProjectModal = ({ onClose, onSave, lang, user }: any) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<'manual' | 'smart' | 'document' | 'idea' | 'template'>('manual');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectTemplate>>({
    name: '',
    description: '',
    detailedDescription: '',
    targetAudience: '',
    region: '',
    productTypes: []
  });

  // Handler for generating questions from AI
  const handleSmartParse = async () => {
     setLoading(true);
     try {
        // Simple inline AI call since Gemini module doesn't export callGeminiAPI
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `Analyze this idea and generate 5-8 research questions:\n\n${context}` }] }]
            })
          }
        );
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Generate fields
        const questions = aiResponse.split('\n').filter((q: string) => q.trim().length > 0).slice(0,8);
        setFormData({
           ...formData,
           questions: questions.map((text: string, i: number) => ({ id: `q${i+1}`, text, type: 'text' as const, order: i+1 }))
        });
     } catch (e) {
        console.error(e);
        alert("Error parsing document");
     }
     setLoading(false);
  };

  const PRODUCT_TYPES: ProductType[] = ['App', 'Web', 'SaaS', 'E-commerce', 'Marketplace', 'IoT', 'Other'];

  const toggleProductType = (type: ProductType) => {
    const currentTypes = formData.productTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFormData({ ...formData, productTypes: newTypes });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContext(text);
    };
    reader.readAsText(file);
  };

  // If we are in a full-screen mode (Idea or Document), render those components directly
  // This prevents them from being constrained by the max-w-2xl wrapper of the selection modal
  if (mode === 'document') {
    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        <DocumentUploader
          onQuestionsGenerated={async (questions, metadata) => {
            console.log('✅ Questions Generated:', questions.length);
            console.log('📝 Metadata:', metadata);

            // Check if user is logged in
            if (!user) {
              alert('❌ Debes iniciar sesión para crear un proyecto.');
              console.error('User not logged in');
              return;
            }

            // Create project directly instead of going to manual mode
            setLoading(true);
            try {
              const cover = getCoverByIdea(metadata.title + ' ' + metadata.description);
              console.log('✅ [IdeaStudio] Cover assigned without API');

              const project: ProjectTemplate = {
                id: `p_${Date.now()}`,
                name: metadata.title,
                description: metadata.description,
                detailedDescription: '',
                emoji: metadata.emoji || '📄',
                coverImage: cover,
                targetAudience: 'General',
                region: 'Global',
                productTypes: [],
                questions: questions,
                createdAt: new Date().toISOString()
              };

              console.log('🚀 Creating project with', questions.length, 'questions');
              await onSave(project);
              console.log('✅ Project saved successfully');
            } catch (e) {
              console.error('❌ Error creating project:', e);
              alert('Error al crear el proyecto. Intenta de nuevo.');
            }
            setLoading(false);
          }}
          onClose={() => setMode('manual')}
        />
      </React.Suspense>
    );
  }

  if (mode === 'idea') {
    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        <IdeaStudio
          onPlanGenerated={async (questions, metadata, plan) => {
            console.log('✅ Idea Plan Generated:', questions.length, 'questions');
            
            // Create project directly instead of going to manual mode
            setLoading(true);
            try {
              const cover = getCoverByIdea(metadata.title + ' ' + metadata.description);
              console.log('✅ [DocumentUploader] Cover assigned without API');
              
              const project: ProjectTemplate = {
                id: `p_${Date.now()}`,
                name: metadata.title,
                description: metadata.description,
                detailedDescription: plan || '',
                emoji: '💡',
                coverImage: cover,
                targetAudience: 'General',
                region: 'Global',
                productTypes: [],
                questions: questions,
                createdAt: new Date().toISOString()
              };
              
              console.log('🚀 Creating project from Idea Studio');
              onSave(project);
            } catch (e) {
              console.error('❌ Error creating project:', e);
              alert('Error al crear el proyecto. Intenta de nuevo.');
            }
            setLoading(false);
          }}
          onClose={() => setMode('manual')}
        />
      </React.Suspense>
    );
  }

  if (mode === 'template') {
    return (
      <TemplateGallery
        onSelectTemplate={async (template: any) => {
          console.log('📋 Template Selected:', template.name);
          setLoading(true);
          try {
            const project = templateToProject(template, 'user_id');
            console.log('🚀 Creating project from template:', project.name, 'with', project.questions.length, 'questions');
            onSave(project);
          } catch (e) {
            console.error('❌ Error creating project from template:', e);
            alert('Error al crear el proyecto. Intenta de nuevo.');
          }
          setLoading(false);
        }}
        onClose={() => setMode('manual')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
       <div 
         className={`${GLASS_PANEL} w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 animate-fade-in-up`}
         onClick={(e) => e.stopPropagation()}
       >
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-white">{t.newSession}</h2>
             <button onClick={onClose}><X className="text-slate-400 hover:text-white" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <button onClick={() => setMode('manual')} className={`py-3 rounded-xl border flex items-center justify-center gap-2 ${mode === 'manual' ? 'border-neon bg-neon/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
                <Plus size={16} /> Manual
             </button>
             <button onClick={() => setMode('document')} className={`py-3 rounded-xl border flex items-center justify-center gap-2 ${mode === 'document' ? 'border-neon bg-neon/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
                <FileText size={16} /> Subir Documento
             </button>
             <button onClick={() => setMode('idea')} className={`py-3 rounded-xl border flex items-center justify-center gap-2 ${mode === 'idea' ? 'border-neon bg-neon/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
                <Zap size={16} /> De Idea a Plan
             </button>
             <button onClick={() => setMode('template')} className={`py-3 rounded-xl border flex items-center justify-center gap-2 ${mode === 'template' ? 'border-neon bg-neon/10 text-white' : 'border-white/10 text-slate-400 hover:border-white/30'}`}>
                <Sparkles size={16} /> Plantillas
             </button>
          </div>

          {/* Manual Mode Form */}
          {mode === 'manual' && (
             <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    placeholder={t.projectName} 
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" 
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                  <input 
                    placeholder="Región (ej. Colombia)" 
                    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" 
                    value={formData.region || ''}
                    onChange={e => setFormData({...formData, region: e.target.value})} 
                  />
                </div>
                
                <textarea 
                  placeholder={t.projectDesc} 
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none h-24 resize-none" 
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
                
                <textarea 
                  placeholder="Descripción Detallada (Opcional)" 
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none h-24 resize-none" 
                  value={formData.detailedDescription || ''}
                  onChange={e => setFormData({...formData, detailedDescription: e.target.value})} 
                />

                <input 
                  placeholder="Público Objetivo" 
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" 
                  value={formData.targetAudience || ''}
                  onChange={e => setFormData({...formData, targetAudience: e.target.value})} 
                />

                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase font-bold">Tipo de Producto</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => toggleProductType(type)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          (formData.productTypes || []).includes(type)
                            ? 'bg-neon/20 border-neon text-neon'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={async () => {
                   if(!formData.name || !formData.description) return alert("Nombre y descripción requeridos");
                   
                   setLoading(true);
                   try {
                     const cover = getCoverByIdea(formData.name + ' ' + formData.description);
                     console.log('✅ [TemplateGallery] Cover assigned without API');
                     
                     const p: ProjectTemplate = {
                       id: `p_${Date.now()}`,
                       name: formData.name!,
                       description: formData.description!,
                       detailedDescription: formData.detailedDescription,
                       emoji: '💡',
                       coverImage: cover,
                       targetAudience: formData.targetAudience || 'General',
                       region: formData.region || 'Global',
                       productTypes: formData.productTypes,
                       questions: formData.questions || [],
                       createdAt: new Date().toISOString()
                     };
                     onSave(p);
                   } catch (e) {
                     console.error(e);
                     alert("Error creating project");
                   }
                   setLoading(false);
                }} disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neon transition-colors flex items-center justify-center gap-2">
                  {loading ? <RefreshCw className="animate-spin"/> : null} {t.create}
                </button>
             </div>
          )}
       </div>
    </div>
  );
};

// 4. Deep Research View (Advanced v2.1)
const DeepResearchGraphic = () => (
  <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
    {/* Outer Ring */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 rounded-full border border-white/10 border-t-neon/50 border-r-neon/50 shadow-[0_0_30px_rgba(223,255,0,0.1)]"
    />
    
    {/* Inner Ring Reverse */}
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute inset-4 rounded-full border border-white/5 border-b-blue-400/50 border-l-blue-400/50"
    />

    {/* Core */}
    <div className="relative z-10 w-16 h-16 bg-black/80 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(223,255,0,0.2)]">
       <Zap size={32} className="text-neon drop-shadow-[0_0_10px_rgba(223,255,0,0.8)] animate-pulse" />
    </div>

    {/* Orbiting Particles */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    >
       <div className="absolute top-0 left-1/2 w-2 h-2 bg-neon rounded-full shadow-[0_0_10px_rgba(223,255,0,0.8)] -translate-x-1/2 -translate-y-1"></div>
    </motion.div>
  </div>
);

const DeepResearchView = ({ project, interviews, onUpdate, t }: any) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0); // Progress State
  const [showIntro, setShowIntro] = useState(!project.deepAnalysis); 

   const runAnalysis = async () => {
     // Validation Rules (Heuristic UX/UI)
     const missingFields = [];
     if (!project.detailedDescription) missingFields.push("Descripción Detallada");
     if (!project.region) missingFields.push("Región");
     if (!project.productTypes || project.productTypes.length === 0) missingFields.push("Tipo de Producto");
     
     if (missingFields.length > 0) {
        alert(`⚠️ Perfil Incompleto\n\nPara un análisis de nivel VC, necesitamos más contexto.\nFalta: ${missingFields.join(', ')}.\n\nHaz clic en el título del proyecto para editar.`);
        return;
     }

     if (interviews.length < 5) {
        alert(`⚠️ Data Insuficiente\n\nEl motor requiere al menos 5 entrevistas para detectar patrones estadísticamente relevantes.\n\nActual: ${interviews.length}/5`);
        return;
     }

     setLoading(true);
     setShowIntro(false);
     setProgress(0);

     // Simulation of complex processing steps
     const steps = [
        { msg: "Inicializando Neural Engine...", time: 800 },
        { msg: "Escaneando transcripciones de entrevistas...", time: 1500 },
        { msg: "Detectando patrones de comportamiento...", time: 1200 },
        { msg: "Cruzando datos con benchmarks de mercado...", time: 2000 },
        { msg: "Calculando Product-Market Fit Score...", time: 1000 },
        { msg: "Generando estrategias de crecimiento...", time: 1500 },
        { msg: "Finalizando reporte ejecutivo...", time: 800 }
     ];

     let currentProgress = 0;
     const progressPerStep = 90 / steps.length;

     for (const step of steps) {
        setStatus(step.msg);
        await new Promise(r => setTimeout(r, step.time));
        currentProgress += progressPerStep;
        setProgress(Math.min(currentProgress, 90));
     }
     
     setStatus("Compilando resultados finales...");
     
     try {
       console.log("🚀 Calling Gemini Deep Research...");
       const report = await Gemini.performDeepResearch(project, interviews, 'es');
       console.log("✅ Report received:", report);
       
       setProgress(100);
       await new Promise(r => setTimeout(r, 500)); // Let user see 100%
       
       const updated = { ...project, deepAnalysis: report };
       console.log("💾 Updating project with analysis:", updated);
       onUpdate(updated);
     } catch (e) {
       console.error("❌ Analysis Error:", e);
       alert("Error en el análisis. Intenta de nuevo. Detalles en consola.");
     }
     setLoading(false);
  };

  const report = project.deepAnalysis;

  // ... (Intro and Empty State remain the same, skipping for brevity in this replace) ...

  // Onboarding / Intro State
  if (showIntro && !loading && !report) {
     return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/90 backdrop-blur-xl animate-fade-in">
           <div className={`${GLASS_PANEL} max-w-3xl w-full p-0 overflow-hidden relative border border-white/10 shadow-2xl`}>
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-neon/5 to-transparent pointer-events-none"></div>
              
              {/* Close Button - Fixed Z-Index */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowIntro(false);
                }} 
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white z-[100] transition-all border border-white/5 hover:scale-110 cursor-pointer"
              >
                <X size={24} />
              </button>
              
              <div className="p-12 pt-16 text-center relative z-10">
                 <DeepResearchGraphic />
                 
                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                   Deep Research <span className="text-neon">AI</span>
                 </h2>
                 <p className="text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto text-lg font-light">
                    <span className="text-white font-medium">Deja de operar por intuición.</span> Ejecuta un proceso de <span className="text-neon font-bold">Due Diligence Algorítmico</span> de nivel institucional. 
                    Nuestra IA cruza miles de puntos de datos cualitativos para predecir la viabilidad financiera, detectar saturación de mercado y entregarte una hoja de ruta de inversión clara.
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left">
                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-neon/30 transition-colors group">
                       <Search className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" size={24}/>
                       <h4 className="font-bold text-white text-sm mb-1">Reconocimiento de Patrones</h4>
                       <p className="text-xs text-slate-400">Detecta sesgos y necesidades latentes.</p>
                    </div>
                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-neon/30 transition-colors group">
                       <BarChart3 className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={24}/>
                       <h4 className="font-bold text-white text-sm mb-1">Veredicto de Mercado</h4>
                       <p className="text-xs text-slate-400">Cálculo predictivo de Product-Market Fit.</p>
                    </div>
                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-neon/30 transition-colors group">
                       <Sparkles className="text-neon mb-3 group-hover:scale-110 transition-transform" size={24}/>
                       <h4 className="font-bold text-white text-sm mb-1">Estrategia de Salida</h4>
                       <p className="text-xs text-slate-400">Roadmap accionable para iterar.</p>
                    </div>
                 </div>

                 <button onClick={runAnalysis} className="w-full bg-neon text-black font-bold py-5 rounded-xl hover:bg-white transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(223,255,0,0.4)] flex items-center justify-center gap-3 text-lg">
                    <Sparkles size={20} /> Iniciar Due Diligence
                 </button>
              </div>
           </div>
        </div>
     );
  }

  // Empty State (Closed Intro, No Report)
  if (!loading && !report) {
     return (
        <div className="p-8 animate-fade-in">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">ANÁLISIS PROFUNDO DEL PROYECTO</h2>
              <button onClick={runAnalysis} className="bg-neon text-black px-6 py-2 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2">
                 <Sparkles size={16} /> Ejecutar Análisis
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none select-none grayscale">
              <div className={`${GLASS_PANEL} p-6 rounded-2xl h-64 flex items-center justify-center border-dashed border-2 border-white/10`}>
                 <div className="text-center">
                    <BarChart3 size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">Resultados del Análisis aparecerán aquí</p>
                 </div>
              </div>
              <div className={`${GLASS_PANEL} p-6 rounded-2xl h-64 flex items-center justify-center border-dashed border-2 border-white/10`}>
                 <div className="text-center">
                    <PieChartIcon size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">Métricas de Mercado</p>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  if (loading) {
    return (
       <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in">
          <div className="w-full max-w-md text-center">
             {/* Shimmering Loader Icon */}
             <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-neon/20 rounded-full animate-ping"></div>
                <div className="relative z-10 w-full h-full bg-black/50 backdrop-blur-md rounded-full border border-neon/50 flex items-center justify-center shadow-[0_0_30px_rgba(223,255,0,0.3)]">
                   <Zap className="text-neon animate-pulse" size={40} />
                </div>
             </div>

             <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">{status}</h3>
             <p className="text-slate-400 text-sm mb-8">Esto puede tomar unos momentos. No cierres la ventana.</p>

             {/* Progress Bar */}
             <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
                <div 
                   className="h-full bg-neon shadow-[0_0_15px_rgba(223,255,0,0.8)] transition-all duration-500 ease-out relative overflow-hidden"
                   style={{ width: `${progress}%` }}
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full h-full animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                </div>
             </div>
             <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>PROCESANDO DATOS</span>
                <span>{Math.round(progress)}%</span>
             </div>
          </div>
       </div>
    );
  }

  // If closed onboarding but no report, show empty state placeholder
  if (!report) {
     return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
             <Search size={40} className="text-slate-600" />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">Sin Análisis Aún</h3>
           <p className="text-slate-400 mb-6 max-w-md">Ejecuta el Deep Research para obtener insights de nivel VC sobre tu proyecto.</p>
           <button onClick={runAnalysis} className="bg-neon text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(223,255,0,0.2)]">
              Iniciar Análisis
           </button>
        </div>
     )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20 space-y-8">
       
       {/* Header Stats */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <div className="text-xs font-bold text-neon mb-2 uppercase tracking-widest flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin-slow"/> 
              Última actualización: {new Date(report.lastUpdated).toLocaleDateString()}
            </div>
            <h2 className="text-4xl font-bold text-white">
              Viability Score: <span className={report.viabilityScore > 70 ? 'text-neon drop-shadow-[0_0_10px_rgba(223,255,0,0.5)]' : 'text-red-400'}>{report.viabilityScore}/100</span>
            </h2>
          </div>
          <button onClick={runAnalysis} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold border border-white/10 flex items-center gap-2 transition-all hover:border-white/30">
             <RefreshCw size={16} /> Re-Analizar
          </button>
       </div>

       {/* Verdict & Profile */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${GLASS_PANEL} p-8 relative overflow-hidden group`}>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={120} /></div>
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Target className="text-neon"/> Veredicto de Mercado</h3>
             <p className="text-lg text-slate-200 leading-relaxed font-medium">{report.marketVerdict}</p>
          </div>
          <div className={`${GLASS_PANEL} p-8`}>
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users className="text-blue-400"/> Perfil Early Adopter</h3>
             <p className="text-slate-300 leading-relaxed">{report.earlyAdopterProfile}</p>
          </div>
       </div>

       {/* Benchmark Table (New) */}
       {report.benchmark && report.benchmark.length > 0 && (
         <div className={`${GLASS_PANEL} p-8 overflow-hidden`}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Globe className="text-purple-400"/> Benchmark Competitivo</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase border-b border-white/10">
                    <th className="p-4 font-bold">Competidor</th>
                    <th className="p-4 font-bold">Fortaleza</th>
                    <th className="p-4 font-bold">Debilidad</th>
                    <th className="p-4 font-bold">Modelo</th>
                    <th className="p-4 font-bold text-neon">Diferenciación</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                  {report.benchmark.map((comp: any, i: number) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{comp.name}</td>
                      <td className="p-4 text-emerald-400">{comp.strength}</td>
                      <td className="p-4 text-red-400">{comp.weakness}</td>
                      <td className="p-4">{comp.priceModel}</td>
                      <td className="p-4 text-white">{comp.differentiation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
       )}

       {/* Modular Insights (New) */}
       {report.keyInsights && report.keyInsights.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.keyInsights.map((insight: any, i: number) => (
              <div key={i} className={`${GLASS_PANEL} p-6 border-l-4 ${insight.type === 'positive' ? 'border-l-emerald-400' : insight.type === 'negative' ? 'border-l-red-400' : 'border-l-blue-400'}`}>
                 <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">{insight.title}</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">{insight.description}</p>
              </div>
            ))}
         </div>
       )}

       {/* NEW: Advanced Analytics Section (Robust CSS/SVG Replacements) */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Market Trends - SVG Line Chart */}
          <div className={`${GLASS_PANEL} p-6`}>
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="text-neon"/> Tendencia de Mercado (Proyección)</h3>
             <div className="h-64 w-full flex items-end justify-between gap-2 px-2 relative">
               {/* Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                 <div className="w-full h-[1px] bg-slate-500"></div>
                 <div className="w-full h-[1px] bg-slate-500"></div>
                 <div className="w-full h-[1px] bg-slate-500"></div>
                 <div className="w-full h-[1px] bg-slate-500"></div>
               </div>
               
               {/* Bars/Points */}
               {report.marketTrends?.map((item: any, i: number) => {
                  const max = Math.max(...report.marketTrends.map((d: any) => d.value)) || 1;
                  const height = (item.value / max) * 100;
                  return (
                    <div key={i} className="h-full flex-1 flex flex-col justify-end items-center group relative z-10">
                       <div className="mb-2 text-neon font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4">{item.value}</div>
                       <div 
                         className="w-full max-w-[40px] bg-neon/20 border-t-2 border-neon rounded-t-sm transition-all duration-1000 group-hover:bg-neon/40 relative"
                         style={{ height: `${height}%` }}
                       >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon rounded-full shadow-[0_0_10px_#3AFF97]"></div>
                       </div>
                       <div className="mt-2 text-[10px] text-slate-400 font-mono">{item.year}</div>
                    </div>
                  )
               })}
             </div>
          </div>

          {/* Risk Assessment - CSS Progress Bars */}
          <div className={`${GLASS_PANEL} p-6`}>
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Target className="text-red-400"/> Evaluación de Riesgos</h3>
             <div className="h-64 w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 space-y-4">
               {report.riskAssessment?.map((item: any, i: number) => (
                 <div key={i} className="group">
                   <div className="flex justify-between text-xs text-slate-400 mb-1">
                     <span className="font-medium text-slate-300">{item.subject}</span>
                     <span className={`font-bold ${item.A > 70 ? 'text-red-400' : item.A > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                       {item.A > 70 ? 'ALTO' : item.A > 40 ? 'MEDIO' : 'BAJO'} ({item.A}%)
                     </span>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div 
                       className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${item.A > 70 ? 'bg-red-500' : item.A > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                       style={{ width: `${item.A}%` }}
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sentiment Analysis - CSS Conic Donut */}
          <div className={`${GLASS_PANEL} p-6 col-span-1`}>
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Users className="text-blue-400"/> Sentimiento Detectado</h3>
             <div className="h-48 w-full relative flex items-center justify-center">
                {/* CSS Conic Gradient Chart */}
                <div 
                  className="w-40 h-40 rounded-full relative shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  style={{
                    background: `conic-gradient(
                      ${report.sentimentAnalysis?.[0]?.fill || '#3AFF97'} 0% ${report.sentimentAnalysis?.[0]?.value || 0}%,
                      ${report.sentimentAnalysis?.[1]?.fill || '#f87171'} ${report.sentimentAnalysis?.[0]?.value || 0}% 100%
                    )`
                  }}
                >
                   {/* Inner Circle for Donut Effect */}
                   <div className="absolute inset-2 bg-[#0a0a0a] rounded-full flex items-center justify-center flex-col z-10">
                      <span className="text-3xl font-bold text-white">AI</span>
                      <span className="text-[10px] text-slate-500 tracking-widest">SCAN</span>
                   </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-0 right-0 flex flex-col gap-1 text-[10px]">
                   {report.sentimentAnalysis?.map((s: any, i: number) => (
                     <div key={i} className="flex items-center gap-1">
                       <div className="w-2 h-2 rounded-full" style={{backgroundColor: s.fill}}></div>
                       <span className="text-slate-400">{s.name} ({s.value}%)</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

           {/* Demographics - CSS Chart Replacement */}
           <div className={`${GLASS_PANEL} p-6 col-span-1 md:col-span-2`}>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Globe className="text-purple-400"/> Demografía Objetivo</h3>
              <div className="h-48 w-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 space-y-3">
                 {report.audienceDemographics?.map((item: any, i: number) => {
                    const max = Math.max(...report.audienceDemographics.map((d: any) => d.value)) || 1;
                    return (
                      <div key={i} className="w-full group">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span className="font-medium text-slate-300">{item.name}</span>
                          <span className="font-mono text-neon">{item.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-125 relative overflow-hidden"
                            style={{ 
                              width: `${(item.value / max) * 100}%`,
                              backgroundColor: i % 2 === 0 ? '#818cf8' : '#c084fc'
                            }}
                          >
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                          </div>
                        </div>
                      </div>
                    );
                 })}
              </div>
           </div>
       </div>

       {/* SWOT Analysis */}
       <div className={`${GLASS_PANEL} p-8`}>
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><LayoutGrid className="text-amber-400"/> Análisis SWOT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <SwotSection title="Fortalezas" items={report.swot.strengths} color="text-emerald-400" icon={<CheckCircle size={16}/>} />
             <SwotSection title="Debilidades" items={report.swot.weaknesses} color="text-red-400" icon={<X size={16}/>} />
             <SwotSection title="Oportunidades" items={report.swot.opportunities} color="text-blue-400" icon={<Sparkles size={16}/>} />
             <SwotSection title="Amenazas" items={report.swot.threats} color="text-amber-400" icon={<Zap size={16}/>} />
          </div>
       </div>

       {/* Strategic Advice & Pivot Recommendations (Phase 5) */}
       {report.strategicAdvice && report.strategicAdvice.length > 0 && (
         <div className={`${GLASS_PANEL} p-8 border-t-4 border-t-neon`}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-neon"/> Estrategia y Recomendaciones de Pivote
            </h3>
            <div className="space-y-4">
               {report.strategicAdvice.map((advice: string, i: number) => (
                 <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="mt-1 w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 leading-relaxed">{advice}</p>
                 </div>
               ))}
            </div>
         </div>
       )}
    </div>
  )
};

const SwotSection = ({ title, items, color, icon }: any) => (
  <div>
     <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${color} flex items-center gap-2`}>
       {icon} {title}
     </h4>
     <ul className="space-y-3">
        {items.map((it: string, i: number) => (
           <li key={i} className="text-slate-300 text-sm flex gap-3 leading-relaxed">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.replace('text-', 'bg-')}`}></span> 
              {it}
           </li>
        ))}
     </ul>
  </div>
);

// 5. Interview Form (Visual Update v2.0)
const InterviewForm = ({ project, onSave, onCancel, onClose, t }: any) => {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<any>({});
  const [regData, setRegData] = useState({ 
    name: '', email: '', phone: '', instagram: '', tiktok: '', role: '', city: '', country: '' 
  });
  const [currentVal, setCurrentVal] = useState('');
  const [observation, setObservation] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // DRAFT PERSISTENCE
  useEffect(() => {
    const draftKey = `draft_interview_${project.id}`;
    const saved = localStorage.getItem(draftKey);
    if (saved) {
       const data = JSON.parse(saved);
       if(confirm("¿Restaurar entrevista anterior no terminada?")) {
          setAnswers(data.answers || {});
          setRegData(data.regData || {});
          setStep(data.step || -1);
       } else {
          localStorage.removeItem(draftKey);
       }
    }
  }, [project.id]);

  useEffect(() => {
     if (Object.keys(answers).length > 0 || step > -1) {
        localStorage.setItem(`draft_interview_${project.id}`, JSON.stringify({
           answers, regData, step
        }));
     }
  }, [answers, regData, step, project.id]);

  // RESTORE ANSWER ON NAVIGATION
  useEffect(() => {
     if (step > -1 && project.questions[step]) {
        const qId = project.questions[step].id;
        const savedAns = answers[qId];
        if (savedAns) {
           setCurrentVal(savedAns.rawValue || '');
           setObservation(savedAns.observation || '');
        } else {
           setCurrentVal('');
           setObservation('');
        }
     }
  }, [step, project.questions, answers]); // Added answers dependency to ensure sync

  const question = project.questions[step];

  const handleNext = async () => {
     if(step === -1) {
        if(!regData.name) return alert("Name required");
        setStep(0);
        return;
     }

     // Analyze (Mocking the call for UI demo, use real service in prod)
     // Only analyze if new or changed? For now, re-analyze or keep simple.
     // To save tokens, maybe check if rawValue changed? 
     // For this demo, we just proceed.
     
     const ans = {
        questionId: question.id,
        rawValue: currentVal,
        observation,
        aiAnalysis: "Analysis pending..." // Placeholder to avoid slow API call on every step for now
     };
     
     const newAnswers = { ...answers, [question.id]: ans };
     setAnswers(newAnswers);
     // currentVal is cleared by useEffect when step changes, but we can force it here too if needed
     // But the useEffect above handles the "next question" state (which is empty if not answered)

     if(step < project.questions.length - 1) {
        setStep(step + 1);
      } else {
         // Prevent duplicate submissions
         if (isSaving) return;

         // Finalize
         setIsSaving(true);
         console.log("🚀 Starting finalization...");

         // Default analysis in case of total failure
         let analysis = {
            totalScore: 0,
            summary: "Analysis failed: Please retry from the interview details.",
            dimensionScores: { 
               problemIntensity: 0, 
               solutionFit: 0, 
               willingnessToPay: 0,
               currentBehavior: 0,
               painPoint: 0,
               earlyAdopter: 0
            },
            keyInsights: ["AI Analysis Unavailable"]
         };

         try {
            // Perform AI Analysis with RETRY logic
            let retries = 2; // Try up to 3 times total
            let aiSuccess = false;
            
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                  console.log(`🤖 Enhanced AI Analysis attempt ${attempt + 1}/${retries + 1}...`);
                  console.log("📦 [DEBUG] Answers sent to analysis:", JSON.stringify(newAnswers, null, 2));
                  
                  const analysisPromise = Gemini.analyzeFullInterviewEnhanced(project, newAnswers, regData);
                  const timeoutPromise = new Promise((_, reject) => 
                     setTimeout(() => reject(new Error("AI Timeout (30s)")), 30000)
                  );
                  
                  const result = await Promise.race([analysisPromise, timeoutPromise]);
                  
                  if (result && typeof result === 'object') {
                     analysis = result as any;
                     console.log("✅ AI analysis successful:", analysis);
                     aiSuccess = true;
                     break; // Success, exit retry loop
                  }
               } catch (aiError) {
                  console.error(`❌ AI Analysis attempt ${attempt + 1} failed:`, aiError);
                  
                  if (attempt < retries) {
                     console.log(`⏳ Retrying in 2 seconds...`);
                     await new Promise(resolve => setTimeout(resolve, 2000));
                  } else {
                     console.error("❌ All AI analysis attempts exhausted");
                     // Keep default "failed" analysis
                  }
               }
            }
            
            if (!aiSuccess) {
               // Alert user that analysis failed but interview will be saved
               alert("⚠️ El análisis de IA falló después de 3 intentos.\n\nLa entrevista se guardará, pero deberás hacer 'Retry Analysis' desde el detalle de la entrevista.");
            }

            // Sanitize and construct interview object
            const safeAnalysis = {
               totalScore: typeof analysis.totalScore === 'number' ? analysis.totalScore : 0,
               summary: analysis.summary || "Sin resumen",
              dimensionScores: {
                 problemIntensity: analysis.dimensionScores?.problemIntensity || 0,
                 solutionFit: analysis.dimensionScores?.solutionFit || 0,
                 willingnessToPay: analysis.dimensionScores?.willingnessToPay || 0,
                 currentBehavior: analysis.dimensionScores?.currentBehavior || 0,
                 painPoint: analysis.dimensionScores?.painPoint || 0,
                 earlyAdopter: analysis.dimensionScores?.earlyAdopter || 0
              },
              keyInsights: Array.isArray(analysis.keyInsights) ? analysis.keyInsights : []
           };

           const interview: Interview = {
              id: Date.now().toString(),
              projectId: project.id,
              respondentName: regData.name || 'Anónimo',
              respondentEmail: regData.email || '',
              respondentPhone: regData.phone || '',
              respondentInstagram: regData.instagram || '',
              respondentTikTok: regData.tiktok || '',
              respondentRole: regData.role || '',
              respondentCity: regData.city || '',
              respondentCountry: regData.country || '',
              date: new Date().toISOString(),
              answers: newAnswers, // Assuming answers are safe as they are strings
              totalScore: safeAnalysis.totalScore,
              dimensionScores: safeAnalysis.dimensionScores,
              summary: safeAnalysis.summary,
              keyInsights: safeAnalysis.keyInsights
           };
           
           console.log("Saving sanitized interview:", interview);

           try {
              // Save (Logic handled by parent: Online -> Timeout -> Offline)
              await onSave(interview);
              
              console.log("✅ Interview saved successfully");
              // Clear draft only on success
              localStorage.removeItem(`draft_interview_${project.id}`);

              // AUTO-CLOSE form and open the interview modal
              console.log("🔄 Closing form and opening interview profile...");
              
              // Wait a moment to let user see completion message
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Close this form AND pass the interview to be opened
              onClose(interview);
              setIsSaving(false);

           } catch (saveError) {
              console.error("Database save failed:", saveError);
              alert("Error al guardar. Intenta nuevamente.");
              setIsSaving(false);
              return; 
           }
        } catch (error) {
           console.error("Error processing interview:", error);
           alert("Error crítico. Revisa la consola.");
           setIsSaving(false);
        }
     }
  };

   const handleAnswer = (val: any) => {
      setCurrentVal(val.toString());
   };

  const handleBack = () => {
     if (step > -1) {
        const qId = project.questions[step].id;
        const tempAns = { ...answers[qId], questionId: qId, rawValue: currentVal, observation };
        setAnswers({ ...answers, [qId]: tempAns });
        setStep(step - 1);
     }
  };

  if(step === -1) {
     return (
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in-up pb-20">
           <div className={`${GLASS_PANEL} p-10 rounded-3xl`}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">{t.newCandidate}</h2>
                <button onClick={onCancel} className="text-slate-400 hover:text-white"><X /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <label className="text-xs text-slate-400 uppercase font-bold">Información Personal</label>
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder={t.fullName} value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder={t.email} value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder={t.phone} value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} />
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs text-slate-400 uppercase font-bold">Redes & Contexto</label>
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder="Instagram (@usuario)" value={regData.instagram} onChange={e => setRegData({...regData, instagram: e.target.value})} />
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder="TikTok (@usuario)" value={regData.tiktok} onChange={e => setRegData({...regData, tiktok: e.target.value})} />
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder="Rol / Cargo" value={regData.role} onChange={e => setRegData({...regData, role: e.target.value})} />
                 </div>
                 <div className="space-y-4 md:col-span-2 grid grid-cols-2 gap-6">
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder="Ciudad" value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} />
                    <input className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-neon outline-none" placeholder="País" value={regData.country} onChange={e => setRegData({...regData, country: e.target.value})} />
                 </div>
              </div>

              <button onClick={handleNext} className="w-full bg-gradient-to-r from-neon to-emerald-400 text-black font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(223,255,0,0.3)] mt-8 hover:shadow-[0_0_40px_rgba(223,255,0,0.6)] hover:scale-[1.02] transition-all tracking-wide uppercase text-sm">{t.startInterview}</button>
           </div>
        </div>
     )
  }

  return (
     <div className="w-full h-[calc(100vh-140px)] animate-fade-in flex gap-6 px-6 pb-6">
        {/* Visual Side */}
        <div className="hidden lg:block w-1/2 h-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            <img 
              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(
                `Composición 3D abstracta y tecnológica de alta gama. El fondo es una rejilla arquitectónica oscura compuesta por celdas cuadradas con esquinas redondeadas y bordes biselados suaves, creando una superficie modular con profundidad y relieve. Desde el centro de la imagen emana una fuente de luz volumétrica intensa y radiante ('god rays') que atraviesa la rejilla, proyectando haces de luz dramáticos hacia las esquinas y generando sombras profundas y contrastadas en los huecos de la estructura. En el punto focal central, flota un objeto 3D principal representando ${question.imageKeyword || 'idea abstracta'} con acabado metálico mate y detalles en relieve. La iluminación debe ser monocromática y saturada en color ${['neon green', 'cyan', 'purple', 'emerald'][step % 4]}, bañando toda la escena en una sola tonalidad vibrante e intensa, creando un efecto de atmósfera densa y brillante. Estilo renderizado 3D limpio, minimalismo futurista, iluminación cinematográfica, texturas suaves y pulidas.`
              )}?nologo=true&model=flux&width=768&height=1024&seed=${question.id.charCodeAt(0) + question.id.charCodeAt(question.id.length-1)}`} 
              className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110" 
              onError={(e) => {
                 // Fallback to simpler prompt if detailed one fails
                 e.currentTarget.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(question.imageKeyword || 'tech')}?nologo=true&model=turbo&width=768&height=1024&seed=${question.id.charCodeAt(0)}`;
              }}
            />
           <div className="absolute bottom-8 left-8 z-20 max-w-sm">
              <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 text-sm text-slate-200">
                 <p className="font-bold text-white mb-1">AI Context Analysis</p>
                 <p className="text-xs">Analyzing response patterns for: <span className="text-neon">{question.dimension}</span></p>
              </div>
           </div>
        </div>

        {/* Input Side */}
        <div className="flex-1 flex flex-col h-full min-h-0">
           <div className="flex justify-between items-center mb-2 flex-shrink-0">
              <div className="flex gap-2">
                 <button onClick={handleBack} className="text-slate-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                    <ArrowLeft size={14}/> Atrás
                 </button>
                 {step < project.questions.length - 1 && (
                    <button onClick={handleNext} className="text-slate-400 hover:text-neon flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                       Siguiente <ArrowRight size={14}/>
                    </button>
                 )}
              </div>
              <div className="text-neon font-bold tracking-widest text-[10px] uppercase">Pregunta {step+1}/{project.questions.length}</div>
           </div>
           
           <div className={`${GLASS_PANEL} p-4 flex-1 flex flex-col min-h-0 overflow-hidden`}>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 leading-tight flex-shrink-0">{question.text}</h2>
               
               {/* Smart Widget - Intelligent Type Detection */}
               <div className="mb-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <SmartQuestionWidget
                    question={question}
                    value={currentVal}
                    onChange={handleAnswer}
                    onBlur={() => handleAnswer(currentVal)}
                  />
               </div>

              <div className="mt-auto pt-2 border-t border-white/5 flex-shrink-0">
                 <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 uppercase font-bold"><Sparkles size={10} className="text-neon"/> Observaciones</div>
                 <textarea 
                   className="w-full h-16 bg-black/20 rounded-xl border border-white/5 p-2 text-sm text-slate-300 focus:text-white outline-none resize-none focus:border-neon/50 transition-colors"
                   placeholder={t.obsLabel + "..."}
                   value={observation}
                   onChange={e => setObservation(e.target.value)}
                />
                 <button onClick={handleNext} disabled={isSaving} className={`w-full font-bold py-3 rounded-xl mt-2 transition-all shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider ${isSaving ? 'bg-white/10 text-white cursor-wait border border-white/10' : 'bg-white text-black hover:bg-neon hover:scale-[1.02]'}`}>
                    {isSaving ? (
                       <span className="flex items-center gap-2 animate-pulse">
                          <RefreshCw className="animate-spin" size={20} /> 
                          <span className="animate-shimmer bg-gradient-to-r from-white via-slate-400 to-white bg-[length:200%_auto] bg-clip-text text-transparent">
                             Analizando Datos...
                          </span>
                       </span>
                    ) : step === project.questions.length - 1 ? (
                       <><CheckCircle size={22} /> Finalizar</>
                    ) : (
                       <>Siguiente <ArrowRight size={22} /></>
                    )}
                 </button>
                 {isSaving && (
                    <div className="mt-4 text-center space-y-2 animate-fade-in">
                       <p className="text-sm text-neon font-bold uppercase tracking-widest drop-shadow-[0_0_10px_rgba(58,255,151,0.5)]">Generando Reporte Científico</p>
                       <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Esto puede tardar unos segundos mientras la IA procesa los patrones...
                       </p>
                       {/* Fake Countdown for UX */}
                       <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-neon animate-[width_25s_linear_forwards] w-0"></div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
     </div>
  )
};

// Placeholder components for brevity in this single file update
const DashboardView = ({ project, interviews, t }: any) => {
   // Calculate real stats
   const totalInterviews = interviews.length;
   const avgScore = totalInterviews > 0 
      ? (interviews.reduce((acc: number, i: Interview) => acc + i.totalScore, 0) / totalInterviews).toFixed(1) 
      : '0.0';

   // Mock distribution for demo if no data, else real
   const scoreDist = [
      { name: '0-4', value: interviews.filter((i: Interview) => i.totalScore < 4).length },
      { name: '4-7', value: interviews.filter((i: Interview) => i.totalScore >= 4 && i.totalScore < 7).length },
      { name: '7-10', value: interviews.filter((i: Interview) => i.totalScore >= 7).length },
   ];

   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in pb-20">
         {/* KPI Cards */}
         <div className={`${GLASS_PANEL} p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:border-neon/50 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(223,255,0,0.15)] transition-all duration-500`}>
             <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-neon/10 rounded-full blur-3xl group-hover:bg-neon/40 group-hover:blur-[60px] transition-all duration-500"></div>
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider relative z-10">{t.totalInterviews}</h3>
             <div className="text-5xl font-bold text-white mt-2 relative z-10">{totalInterviews}</div>
             <div className="mt-4 text-xs text-slate-500 flex items-center gap-1 relative z-10"><Users size={12}/> Candidates processed</div>
         </div>

         <div className={`${GLASS_PANEL} p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/50 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500`}>
             <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/40 group-hover:blur-[60px] transition-all duration-500"></div>
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider relative z-10">{t.avgScore}</h3>
             <div className="text-5xl font-bold text-white mt-2 relative z-10">{avgScore}</div>
             <div className="mt-4 text-xs text-slate-500 flex items-center gap-1 relative z-10"><Zap size={12}/> Validation Index</div>
         </div>

         <div className={`${GLASS_PANEL} p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:border-purple-500/50 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500`}>
             <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/40 group-hover:blur-[60px] transition-all duration-500"></div>
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider relative z-10">Status</h3>
             <div className="text-2xl font-bold text-white mt-auto relative z-10">
                {Number(avgScore) > 7 ? <span className="text-neon">High Potential</span> : Number(avgScore) > 4 ? <span className="text-yellow-400">Needs Pivot</span> : <span className="text-slate-500">Insufficient Data</span>}
             </div>
         </div>

         {/* Main Chart */}
         <div className={`${GLASS_PANEL} p-8 rounded-3xl col-span-1 md:col-span-2 h-[400px]`}>
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="text-neon" /> Score Distribution</h3>
             
             <div className="w-full h-[85%] flex items-end justify-around gap-4 px-4 pb-8 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                   <div className="w-full h-px bg-slate-500 border-t border-dashed"></div>
                   <div className="w-full h-px bg-slate-500 border-t border-dashed"></div>
                   <div className="w-full h-px bg-slate-500 border-t border-dashed"></div>
                   <div className="w-full h-px bg-slate-500 border-t border-dashed"></div>
                   <div className="w-full h-px bg-slate-500 border-t border-dashed"></div>
                </div>

                {scoreDist.map((item: any, index: number) => {
                   const maxVal = Math.max(...scoreDist.map((d: any) => d.value), 1); // Avoid div by zero
                   const heightPct = (item.value / maxVal) * 100;
                   const color = index === 2 ? 'bg-neon shadow-[0_0_20px_rgba(58,255,151,0.4)]' : index === 1 ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-red-400 shadow-[0_0_20px_rgba(248,113,113,0.4)]';
                   
                   return (
                      <div key={index} className="flex flex-col items-center justify-end h-full w-full group relative z-10">
                         {/* Tooltip on hover */}
                         <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/20 px-3 py-1 rounded-lg text-xs text-white whitespace-nowrap pointer-events-none z-20">
                            {item.value} Interviews
                         </div>
                         
                         {/* Bar */}
                         <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPct}%` }}
                            transition={{ duration: 1, type: "spring" }}
                            className={`w-full max-w-[60px] rounded-t-xl ${color} relative group-hover:brightness-110 transition-all`}
                         >
                            {item.value > 0 && (
                               <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-black/60">
                                  {item.value}
                               </div>
                            )}
                         </motion.div>
                         
                         {/* Label */}
                         <div className="mt-4 text-slate-400 font-bold text-sm">{item.name}</div>
                      </div>
                   );
                })}
             </div>
         </div>

         {/* Quick Insights / AI Placeholder */}
         <div className={`${GLASS_PANEL} p-8 rounded-3xl col-span-1 flex flex-col`}>
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="text-neon" /> AI Quick Insights</h3>
             {totalInterviews > 0 ? (
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                   <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-400 mb-1 uppercase font-bold">Trend</p>
                      <p className="text-sm text-slate-200">Users show high interest in the solution but price sensitivity is a major blocker.</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-400 mb-1 uppercase font-bold">Opportunity</p>
                      <p className="text-sm text-slate-200">Consider a "Freemium" model to capture the early adopters identified.</p>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                   <p>No interviews yet.</p>
                   <p className="text-xs mt-2">Start interviewing to get AI insights.</p>
                </div>
             )}
         </div>
      </div>
   )
};

const InterviewsView = ({ interviews, onDelete, onDeleteAll, onSelect, onRetry }: any) => (
   <div className="flex flex-col gap-4 pb-20">
      {interviews.length > 0 && (
         <div className="flex justify-end mb-2">
            <button 
               onClick={onDeleteAll}
               className="text-red-400 hover:text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
            >
               <Trash2 size={14} /> Eliminar Todo
            </button>
         </div>
      )}
      <div className="grid grid-cols-1 gap-4">
      {interviews.map((i: Interview) => (
         <div 
            key={i.id} 
            onClick={() => {
               // Always get the freshest version from state
               const freshInterview = interviews.find(interview => interview.id === i.id);
               if (freshInterview) {
                  onSelect(freshInterview);
               }
            }}
            className={`${GLASS_PANEL} p-6 rounded-2xl flex flex-col gap-4 hover:border-neon/30 transition-all group relative cursor-pointer hover:bg-white/5`}
         >
            <div className="absolute top-6 right-6 flex gap-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                  onClick={async (e) => { 
                     e.stopPropagation(); 
                     if(window.confirm("¿Re-analizar esta entrevista con IA?")) {
                        const btn = e.currentTarget;
                        btn.classList.add('animate-spin');
                        try {
                           await onRetry(i);
                           alert("✅ Análisis actualizado correctamente");
                        } catch(err) {
                           // Error handled in parent
                        } finally {
                           btn.classList.remove('animate-spin');
                        }
                     }
                  }}
                  className="text-slate-600 hover:text-neon transition-colors"
                  title="Re-analizar con IA"
               >
                  <RefreshCw size={18} />
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(i.id); }}
                  className="text-slate-600 hover:text-red-500 transition-colors"
                  title="Eliminar entrevista"
               >
                  <Trash2 size={18} />
               </button>
            </div>
            <div className="flex justify-between items-start pr-8">
               <div>
                  <h4 className="font-bold text-white text-lg flex items-center gap-2">
                     {i.respondentName}
                     {i.respondentRole && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-neon uppercase tracking-wider font-bold">{i.respondentRole}</span>}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">{new Date(i.date).toLocaleDateString()} • {new Date(i.date).toLocaleTimeString()}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-400">
                     {i.respondentEmail && <p className="flex items-center gap-2 hover:text-white transition-colors"><Mail size={12} className="text-neon"/> {i.respondentEmail}</p>}
                     {i.respondentPhone && <p className="flex items-center gap-2 hover:text-white transition-colors"><Phone size={12} className="text-neon"/> {i.respondentPhone}</p>}
                     {(i.respondentCity || i.respondentCountry) && (
                        <p className="flex items-center gap-2 hover:text-white transition-colors">
                           <MapPin size={12} className="text-neon"/> 
                           {[i.respondentCity, i.respondentCountry].filter(Boolean).join(', ')}
                        </p>
                     )}
                     {i.respondentInstagram && <p className="flex items-center gap-2 hover:text-white transition-colors"><span className="text-neon text-[10px] font-bold">IG</span> {i.respondentInstagram}</p>}
                  </div>
               </div>
               <div className="text-right flex flex-col items-end">
                  <div className="text-3xl font-bold text-neon drop-shadow-[0_0_10px_rgba(58,255,151,0.5)]">{i.totalScore}</div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Viability Score</p>
               </div>
            </div>
            
            {i.summary && (
               <div className="bg-black/40 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon"></div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">"{i.summary}"</p>
               </div>
            )}
         </div>
      ))}
      </div>
      {interviews.length === 0 && (
         <div className="text-slate-500 text-center py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
               <Users size={24} className="opacity-50"/>
            </div>
            <p>No hay entrevistas registradas aún.</p>
         </div>
      )}
   </div>
);


// --- MAIN APP ---
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// ... imports
import * as FirebaseService from './services/firebase';

function AppContent() {
  const { user, logout } = useAuth();
  const [lang, setLang] = useState<Language>('es');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); 
  const [view, setView] = useState('hub');
  const [activeProject, setActiveProject] = useState<ProjectTemplate | null>(null);
  
  // FIRESTORE MIGRATION: Projects are now fetched from Cloud
  const [projects, setProjects] = useState<ProjectTemplate[]>([]);
  
  const [showCreate, setShowCreate] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Theme Effect
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Onboarding Check
  useEffect(() => {
    // Only show onboarding if not visited before (or force it    // Initialize projects with local storage check for Demo Project persistence
    const savedDemo = localStorage.getItem('demo_project_001');
    if (savedDemo) {
       try {
          const parsedDemo = JSON.parse(savedDemo);
          // Merge saved demo with initial projects, replacing the default demo if it exists
          const initial = INITIAL_PROJECTS.map(p => p.id === 'demo_project_001' ? parsedDemo : p);
          // If demo not in initial (e.g. different ID structure), append or handle accordingly. 
          // For now, assuming INITIAL_PROJECTS contains the demo or we append it.
          // actually INITIAL_PROJECTS usually has the demo. Let's just use the saved one.
          setProjects([parsedDemo]); 
       } catch (e) {
          console.error("Failed to load saved demo project", e);
          setProjects(INITIAL_PROJECTS);
       }
    } else {
       setProjects(INITIAL_PROJECTS);
    }

    // For now, keeping user request logic but simplified
    setShowOnboarding(true); 
  }, []);

  // FIRESTORE SUBSCRIPTION with localStorage fallback
  useEffect(() => {
    if (user) {
      // First, load any projects saved locally (fallback when Firebase fails)
      const loadLocalProjects = (): ProjectTemplate[] => {
        try {
          const localProjects = JSON.parse(localStorage.getItem('validai_projects') || '[]');
          const userProjects = localProjects.filter((p: any) => p.userId === user.uid);
          if (userProjects.length > 0) {
            console.log('📦 [LocalStorage] Loaded', userProjects.length, 'local projects');
            return userProjects;
          }
        } catch (e) {
          console.error('Error loading local projects:', e);
        }
        return [];
      };
      
      const localProjects = loadLocalProjects();
      
      // ALWAYS set local projects first
      if (localProjects.length > 0) {
        setProjects(localProjects);
        console.log('🎯 [App] Displaying', localProjects.length, 'local projects');
      }
      
      // Then try to subscribe to Firebase (may fail due to index issues)
      let unsubscribe = () => {};
      try {
        unsubscribe = FirebaseService.subscribeToProjects(user.uid, (data) => {
          console.log('☁️ [Firebase] Received', data.length, 'projects from Firestore');
          
          // Merge Firebase + localStorage (remove duplicates)
          const allProjectIds = new Set<string>();
          const mergedProjects: ProjectTemplate[] = [];
          
          // 1. ALWAYS add the Default Project (Holistic Biohacking) first
          // This ensures we always have the LATEST version from code (with reverted widgets)
          const defaultProject = INITIAL_PROJECTS[0];
          if (defaultProject) {
             mergedProjects.push(defaultProject);
             allProjectIds.add(defaultProject.id);
          }
          
          // 2. Add Firebase projects
          data.forEach((p: ProjectTemplate) => {
            // Filter out if it conflicts with default project ID or NAME
            if (p.id === defaultProject.id || p.name === defaultProject.name) return;
            
            if (!allProjectIds.has(p.id)) {
               allProjectIds.add(p.id);
               mergedProjects.push(p);
            }
          });
          
          // 3. Add localStorage projects
          localProjects.forEach((p: ProjectTemplate) => {
            // CRITICAL: Filter out any local project that matches the default project's NAME or ID
            // This forces the app to use the code version (defaultProject) instead of stale local data
            if (p.id === defaultProject.id || p.name === defaultProject.name) {
               console.log('🧹 [App] Ignoring stale local default project:', p.id);
               return;
            }
            
            if (!allProjectIds.has(p.id)) {
              mergedProjects.push(p);
              allProjectIds.add(p.id);
            }
          });
          
          // 4. Sort
          mergedProjects.sort((a, b) => {
             if (a.id === defaultProject.id) return -1;
             if (a.name === defaultProject.name) return -1;
             
             const dateA = new Date(a.createdAt || 0).getTime();
             const dateB = new Date(b.createdAt || 0).getTime();
             return dateB - dateA;
          });
          
          if (mergedProjects.length > 0) {
            setProjects(mergedProjects);
            console.log('✅ [App] Total projects:', mergedProjects.length);
          } else {
             // Should not happen since we force default, but safe fallback
             setProjects(INITIAL_PROJECTS);
          }
        });
      } catch (err) {
        console.error('❌ [Firebase] Subscription error:', err);
        // Keep local projects on error
        if (localProjects.length > 0) {
          setProjects(localProjects);
        }
      }
      
      return () => unsubscribe();
    } else {
      setProjects([]);
    }
  }, [user]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleCreate = async (p: ProjectTemplate) => {
     console.log('🏁 handleCreate called with:', p);
     
     if (!user) {
       console.error('❌ No user logged in handleCreate');
       alert('Error: No has iniciado sesión. Por favor inicia sesión e intenta de nuevo.');
       return;
     }

     try {
       console.log('🔥 Calling FirebaseService.createProject for user:', user.uid);
       await FirebaseService.createProject(user.uid, p);
       console.log('✅ Project created (Firebase or localStorage fallback)');
       
       // Add project to local state immediately
       setProjects(prev => {
         const exists = prev.find(proj => proj.id === p.id);
         if (exists) return prev;
         return [{ ...p, userId: user.uid } as ProjectTemplate, ...prev];
       });
       
       setShowCreate(false);
       setActiveProject(p);
       setView('project');
       console.log('🎉 View switched to project');
     } catch (e: any) {
       console.error('❌ Error in handleCreate:', e);
       // Note: localStorage fallback doesn't throw, so this means both failed
       alert(`Error crítico: No se pudo guardar el proyecto. ${e.message || e}`);
     }
  };

  const handleDelete = async (id: string) => {
     await FirebaseService.deleteProject(id);
     if (activeProject?.id === id) {
        setActiveProject(null);
        setView('hub');
     }
  };

  const handleUpdateProject = async (updated: ProjectTemplate) => {
     // Special handling for Demo Project (Local Only)
     if (updated.id === 'demo_project_001') {
        console.log("⚠️ Demo Project Update: Skipping Firebase, updating local state only.");
        
        // Persist to LocalStorage
        localStorage.setItem('demo_project_001', JSON.stringify(updated));
        
        setActiveProject(updated);
        // Also update the projects list locally if needed, though SessionHub might re-render from props
        // For demo, we might need to update the 'projects' state if it's being used
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
        return;
     }

     await FirebaseService.updateProject(updated);
     // Subscription updates list
     setActiveProject(updated); // Update local active view
  };

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-void text-slate-200 font-sans selection:bg-neon selection:text-black">
      {/* Dynamic Background - High Fidelity 3D Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Ambient Background - Active & Fluid */}
         
         {/* 1. Deep Purple - Top Left */}
         <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen"></div>
         
         {/* 2. Emerald/Neon - Bottom Right */}
         <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-900/20 rounded-full blur-[80px] animate-float mix-blend-screen"></div>
         
         {/* 3. Dark Blue/Cyan - Center Accent */}
         <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" style={{animationDelay: '1s'}}></div>
         
         {/* Vignette for Focus */}
         <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/50 to-black/90"></div>
      </div>

      <div className="relative z-10">
         {view === 'hub' && (
            <SessionHub 
               projects={projects.length > 0 ? projects : [DEMO_PROJECT]} 
               onSelect={(p: ProjectTemplate) => { setActiveProject(p); setView('project'); }} 
               onCreate={() => setShowCreate(true)}
               onDelete={handleDelete}
               onUpdate={handleUpdateProject}
               lang={lang}
               user={user}
               logout={logout}
               toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
               theme={theme}
               isDemo={projects.length === 0}
            />
         )}
         
         {view === 'project' && activeProject && (
            <ProjectDetail 
               project={activeProject} 
               onBack={() => setView('hub')}
               onUpdateProject={handleUpdateProject}
               onOpenProfile={() => setShowProfileModal(true)}
               lang={lang}
               setLang={setLang}
               theme={theme}
               setTheme={setTheme}
            />
         )}

         {/* Language Toggle Fixed - Adjusted position to avoid overlap */}

      </div>

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} onSave={handleCreate} lang={lang} user={user} />}
      {showOnboarding && <Onboarding onClose={handleCloseOnboarding} />}
      
      {/* Project Profile Modal */}
      {activeProject && (
        <ProjectProfileModal 
          project={activeProject}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onSave={handleUpdateProject}
        />
      )}
      {/* Version Indicator - Confirms Deployment */}
      <div className="fixed bottom-1 right-1 text-[10px] text-white/30 pointer-events-none z-[9999] font-mono">
        v2.2 (NUCLEAR FIX)
      </div>

      {/* EMERGENCY RESET BUTTON */}
      <button 
        onClick={() => {
          if(confirm("¿ESTÁS SEGURO? Esto borrará todos los datos locales y reiniciará la app para intentar arreglar el error.")) {
            localStorage.clear();
            window.location.reload();
          }
        }}
        className="fixed bottom-1 left-1 px-2 py-1 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white text-[10px] font-bold rounded border border-red-500/50 z-[9999] transition-colors"
      >
        RESET APP DATA
      </button>
    </div>
  );
}
