import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, CheckCircle2, Brain, Shield, ChevronDown, Play, Sparkles, Target } from 'lucide-react';

// --- ASSETS & CONSTANTS ---
const HERO_VIDEO = "https://cdn.coverr.co/videos/coverr-abstract-digital-tunnel-4446/1080p.mp4"; 
const SCREENSHOT_DASHBOARD = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80"; 

// --- COMPONENTS ---

const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <section className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${className}`}>
    {children}
  </section>
);

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleLaunch = () => {
    // Redirect to main app
    window.location.href = '/';
  };

  return (
    <div className="bg-black text-white font-sans selection:bg-neon selection:text-black overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neon origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      {/* --- HERO SECTION --- */}
      <Section className="h-[120vh]">
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10"></div>
           <video autoPlay loop muted playsInline className="w-full h-full object-cover">
             <source src={HERO_VIDEO} type="video/mp4" />
           </video>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-[-10vh]">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
              <Sparkles size={14} className="text-neon" />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-300">Valid.AI 2.0 Now Available</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]">
              From Idea <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-600">To Empire.</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              The first <span className="text-white font-medium">scientific validation engine</span> that transforms your raw intuition into a battle-tested business plan.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button 
                onClick={handleLaunch}
                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg tracking-tight overflow-hidden transition-transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Validating <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply"></div>
              </button>
              
              <button className="px-8 py-4 rounded-full font-medium text-lg text-white border border-white/20 hover:bg-white/5 transition-colors flex items-center gap-3 backdrop-blur-sm">
                <Play size={20} className="fill-white" /> Watch the Film
              </button>
            </div>
          </FadeIn>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs tracking-widest uppercase"
        >
          <span>Scroll to Explore</span>
          <ChevronDown className="animate-bounce" />
        </motion.div>
      </Section>

      {/* --- THE PROBLEM (Dark Void) --- */}
      <Section className="bg-void py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
                90% of Startups <br />
                <span className="text-red-500">Fail.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-slate-400 leading-relaxed mb-8">
                Why? Because they build things nobody wants. They fall in love with the solution, not the problem. 
                <br /><br />
                <strong className="text-white">Wishful thinking is not a strategy.</strong> You need cold, hard data. You need a scientific method for your ambition.
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex items-center gap-4 text-slate-500">
                <div className="h-px bg-slate-800 flex-1"></div>
                <span className="text-xs uppercase tracking-widest">Enter Valid.AI</span>
              </div>
            </FadeIn>
          </div>
          <div className="relative">
             {/* Abstract Visualization of Failure/Chaos */}
             <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
             <div className="relative glass-panel p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   <span className="ml-auto text-xs text-slate-500 font-mono">failure_analysis.log</span>
                </div>
                <div className="space-y-4 font-mono text-sm text-red-400">
                   <p>&gt; Analyzing market fit...</p>
                   <p>&gt; ERROR: No demand detected.</p>
                   <p>&gt; WARNING: High customer churn.</p>
                   <p>&gt; CRITICAL: Runway depleted.</p>
                   <p className="text-white animate-pulse">&gt; SYSTEM SHUTDOWN...</p>
                </div>
             </div>
          </div>
        </div>
      </Section>

      {/* --- THE SOLUTION (The Engine) --- */}
      <Section className="bg-black py-32 overflow-visible">
        <div className="text-center mb-24">
          <FadeIn>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              The <span className="text-neon">Validation Engine</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powered by advanced heuristics and Gemini AI, our engine turns qualitative conversations into quantitative truth.
            </p>
          </FadeIn>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Card 1 */}
           <FadeIn delay={0.3} className="h-full">
             <div className="h-full glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-neon/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Brain className="text-neon" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Heuristic Intelligence</h3>
                <p className="text-slate-400 leading-relaxed">
                   Our AI doesn't just transcribe. It understands intent, detecting "Willingness to Pay" and "Problem Intensity" automatically from natural conversation.
                </p>
             </div>
           </FadeIn>

           {/* Card 2 */}
           <FadeIn delay={0.4} className="h-full">
             <div className="h-full glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Target className="text-purple-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Precision Scoring</h3>
                <p className="text-slate-400 leading-relaxed">
                   Stop guessing. Get a concrete "Viability Score" (0-100) for every idea. We weigh early adopter interest against problem severity.
                </p>
             </div>
           </FadeIn>

           {/* Card 3 */}
           <FadeIn delay={0.5} className="h-full">
             <div className="h-full glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Shield className="text-blue-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Local-First Privacy</h3>
                <p className="text-slate-400 leading-relaxed">
                   Your billion-dollar idea stays yours. All data is encrypted and stored locally on your device. Zero server-side snooping.
                </p>
             </div>
           </FadeIn>
        </div>
      </Section>

      {/* --- SHOWCASE (Parallax / Big Visuals) --- */}
      <Section className="py-0 min-h-[50vh] bg-void border-y border-white/10">
         <div className="w-full overflow-hidden py-20">
            <motion.div 
               className="flex gap-20 whitespace-nowrap"
               animate={{ x: ["0%", "-50%"] }}
               transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
               {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-20">
                     <span className="text-8xl font-bold text-white/5 uppercase">Build</span>
                     <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon to-emerald-600 uppercase">Measure</span>
                     <span className="text-8xl font-bold text-white/5 uppercase">Learn</span>
                  </div>
               ))}
            </motion.div>
         </div>
      </Section>

      {/* --- "IDEA TO PLAN" DEMO --- */}
      <Section className="py-32 bg-black">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 order-2 md:order-1">
               <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-neon/10 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img src={SCREENSHOT_DASHBOARD} alt="Dashboard" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Floating UI Elements */}
                  <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     whileInView={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.5 }}
                     className="absolute bottom-8 left-8 z-20 bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 flex items-center gap-4"
                  >
                     <div className="w-12 h-12 rounded-full bg-neon/20 flex items-center justify-center">
                        <CheckCircle2 className="text-neon" />
                     </div>
                     <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Verdict</div>
                        <div className="text-xl font-bold text-white">Build It.</div>
                     </div>
                  </motion.div>
               </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
               <FadeIn>
                  <div className="text-neon font-bold tracking-widest uppercase mb-4 text-sm">The Workflow</div>
                  <h2 className="text-5xl font-bold tracking-tighter mb-6">From Napkin Sketch to Business Plan.</h2>
                  <p className="text-xl text-slate-400 mb-8">
                     Don't just collect data. Generate a comprehensive implementation plan. Valid.AI analyzes your interviews and automatically generates:
                  </p>
                  <ul className="space-y-4">
                     {[
                        "Executive Summary",
                        "Market Segmentation Analysis",
                        "Feature Prioritization Matrix",
                        "Go-to-Market Strategy"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-lg text-slate-300">
                           <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                              <CheckCircle2 size={14} className="text-white" />
                           </div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </FadeIn>
            </div>
         </div>
      </Section>

      {/* --- CTA SECTION --- */}
      <Section className="bg-void py-32 text-center">
         <div className="max-w-4xl mx-auto px-6">
            <FadeIn>
               <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
                  Stop Dreaming. <br />
                  <span className="text-neon">Start Validating.</span>
               </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
               <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                  Join thousands of founders who stopped wasting time on bad ideas and started building what people actually want.
               </p>
            </FadeIn>
            <FadeIn delay={0.4}>
               <button 
                  onClick={handleLaunch}
                  className="px-12 py-6 bg-white text-black rounded-full font-bold text-xl tracking-tight hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(58,255,151,0.5)]"
               >
                  Launch Valid.AI 2.0
               </button>
               <div className="mt-8 text-slate-500 text-sm">
                  Free for early access users. No credit card required.
               </div>
            </FadeIn>
         </div>
      </Section>

      {/* --- FOOTER --- */}
      <footer className="bg-black py-12 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-neon rounded-lg rotate-45"></div>
               <span className="font-bold text-xl tracking-tighter">VALID.AI</span>
            </div>
            <div className="flex gap-8 text-slate-400 text-sm">
               <a href="#" className="hover:text-white transition-colors">Manifesto</a>
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
            <div className="text-slate-600 text-xs">
               © 2025 Valid.AI Inc. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
};
