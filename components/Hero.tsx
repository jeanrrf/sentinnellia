import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Database, Terminal, Activity, Shield, Code2, Cpu, ExternalLink, Brain } from 'lucide-react';

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "LOADING AINEX PROTOCOL... > NEURAL AGENT CONNECTED";

  // Hook simples para scroll suave
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      
      {/* Background Glows específicos da Hero */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-900/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Lado Esquerdo: Conteúdo Textual */}
        <div className="z-10 relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm bg-dark-800 border-l-2 border-neon-500 mb-8 font-mono text-xs text-neon-400 tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <Brain size={14} className="animate-pulse" />
              AINEX PROTOCOL: ACTIVE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 text-white tracking-tight">
              INTELIGÊNCIA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-400 via-neon-200 to-white drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                NEURAL EXPERT
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-10 max-w-xl leading-relaxed border-l border-white/10 pl-6">
              Sob o comando do <strong className="text-white">Protocolo AINEX</strong>. Uma arquitetura de agente autônomo projetada para raciocínio complexo, memória hierárquica e execução precisa.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <a 
                href="https://sentinnellcodex.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-8 py-4 bg-neon-600 text-black font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-neon-500 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:shadow-[0_0_50px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3 cursor-pointer"
              >
                <Zap size={18} fill="currentColor" />
                <span>Qlik Codex I.A.</span>
                <div className="absolute inset-0 border border-white/20 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 rounded-sm"></div>
              </a>
              
              <button 
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 bg-transparent border border-white/10 text-white font-mono text-sm tracking-widest uppercase rounded-sm hover:border-neon-500/50 hover:bg-neon-500/5 transition-all flex items-center justify-center"
              >
                Ver Protocolos
              </button>
            </div>

            {/* Terminal Typing Effect */}
            <div className="mt-12 font-mono text-xs text-gray-500 flex items-center gap-2">
                <span className="text-neon-500">ainex@core:~#</span>
                <span className="typing-effect">{typedText}</span>
                <span className="w-2 h-4 bg-neon-500 animate-pulse ml-1"></span>
            </div>
          </motion.div>
        </div>

        {/* Lado Direito: Visualização HUD / Robusta */}
        <div className="relative z-10 hidden lg:block h-[600px] w-full perspective-[2000px]">
           <motion.div 
             className="relative w-full h-full preserve-3d"
             initial={{ opacity: 0, rotateY: -10 }}
             animate={{ opacity: 1, rotateY: 0 }}
             transition={{ duration: 1.2, ease: "easeOut" }}
             style={{ transformStyle: 'preserve-3d' }}
           >
              {/* Main Core Interface */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[520px] glass-card-strong rounded-xl flex flex-col overflow-hidden z-20 transform transition-transform hover:scale-[1.02] duration-500">
                {/* Header HUD */}
                <div className="h-10 bg-black/40 border-b border-white/10 flex items-center justify-between px-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500 animate-pulse"></div>
                    </div>
                    <div className="font-mono text-[10px] text-neon-400">AINEX_CORE // CONNECTED</div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 relative">
                    {/* Scanning Line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-500/5 to-transparent h-[20%] animate-scan pointer-events-none z-0"></div>

                    {/* Data Visualization */}
                    <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                        <div className="bg-black/40 p-4 rounded border border-white/5">
                            <div className="text-[10px] text-gray-400 font-mono mb-1">NEURAL LOAD</div>
                            <div className="text-2xl font-bold text-white font-mono">98.2%</div>
                            <div className="w-full h-1 bg-gray-800 mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-500 w-[98%]"></div>
                            </div>
                        </div>
                         <div className="bg-black/40 p-4 rounded border border-white/5">
                            <div className="text-[10px] text-gray-400 font-mono mb-1">RESPONSE</div>
                            <div className="text-2xl font-bold text-neon-400 font-mono">0.4ms</div>
                             <div className="w-full h-1 bg-gray-800 mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-500 w-[100%]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Code/Log Area */}
                    <div className="bg-black/60 rounded p-4 font-mono text-[10px] text-blue-400/80 leading-relaxed h-[180px] overflow-hidden border border-white/5 relative">
                        <div className="absolute top-0 right-0 p-2">
                            <Terminal size={14} className="text-gray-600" />
                        </div>
                        <p className="text-white">>> AINEX: Initializing Context...</p>
                        <p>>> Memory Tier: GOLD [ACTIVE]</p>
                        <p>>> Loading User Preferences...</p>
                        <p>>> Agent Persona: EXPERT</p>
                        <p>>> Connecting to Qlik Codex Database...</p>
                        <p className="text-neon-500">>> ACCESS GRANTED.</p>
                        <p>>> Ready for instructions.</p>
                        <p className="animate-pulse">_</p>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-6 flex items-center gap-4">
                         <div className="flex-1 h-12 bg-blue-500/10 border border-blue-500/30 rounded flex items-center justify-center gap-2 text-blue-400 font-mono text-xs">
                            <Brain size={14} /> 
                            <span>NEURAL ENGINE</span>
                         </div>
                         <div className="w-12 h-12 bg-white/5 rounded border border-white/10 flex items-center justify-center text-white">
                            <Database size={18} />
                         </div>
                    </div>
                </div>
              </div>

              {/* Floating Elements (Depth) */}
              <motion.div 
                 animate={{ y: [-10, 10, -10] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-[10%] -right-[10%] w-64 glass-card p-4 rounded-lg z-10 border-l-4 border-neon-500"
              >
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white">QLIK CODEX</span>
                    <Zap size={12} className="text-yellow-400 fill-current" />
                 </div>
                 <div className="text-[10px] text-gray-400 font-mono mb-2">STATUS: SYNCHRONIZED</div>
                 <div className="flex gap-1">
                    <span className="h-1 flex-1 bg-neon-600 rounded-full"></span>
                    <span className="h-1 w-2 bg-gray-700 rounded-full"></span>
                 </div>
              </motion.div>
              
              {/* Wireframe Globe/Network hint behind */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full z-0 opacity-20 animate-spin-slow pointer-events-none border-dashed"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-neon-500/10 rounded-full z-0 opacity-40 animate-pulse pointer-events-none"></div>

           </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;