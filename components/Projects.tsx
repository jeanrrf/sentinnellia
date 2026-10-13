import React from 'react';
import { ExternalLink, Code2, Receipt, Palette, Layers, Sparkles, Zap, Brain, Camera, Globe2, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

// Componente do Logo AINEX
const AinexLogo = () => (
  <div className="flex items-center gap-1 font-sans tracking-widest font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
    A<span className="text-blue-500">I</span>NEX
  </div>
);

// Componente do Logo Qlik Codex
const QlikLogo = () => (
  <div className="flex items-center gap-2">
    <div className="bg-white text-black p-1 rounded-sm shadow-[0_0_10px_white]">
        <Zap size={20} fill="currentColor" />
    </div>
    <div className="leading-none">
        <span className="block font-bold text-white text-lg tracking-tight">Qlik</span>
        <span className="block font-bold text-gray-400 text-xs tracking-widest uppercase">Codex I.A.</span>
    </div>
  </div>
);

const projects = [
  {
    title: "Agência PicFun",
    desc: "Ecossistema estratégico para criadoras de conteúdo. Operação, suporte e Academy para monetização e crescimento consistente em lives e redes sociais.",
    link: "https://www.agenciapicfun.com.br/",
    domain: "agenciapicfun.com.br",
    icon: <Camera size={32} className="text-pink-400" />,
    tags: ["Ecossistema PicFun", "Criadoras", "Lives & TikTok", "Academy", "Monetização"],
    highlight: true,
    color: "pink",
    mockupGradient: "from-pink-900/40 via-purple-900/30 to-black",
    coverImage: "/picfun-cover.jpg"
  },
  {
    title: "Sentinnell Brands",
    desc: "Ecossistema central e plataforma de marcas digitais da Sentinnell. Engenharia de posicionamento, design contemporâneo e identidade corporativa de alto impacto sob a direção de Jean Rosso.",
    link: "https://sentinnellbrands.vercel.app/",
    domain: "sentinnellbrands.vercel.app",
    icon: <Globe2 size={32} className="text-cyan-400" />,
    tags: ["Branding", "Ecosystem", "Design System", "Plataforma"],
    highlight: false,
    color: "cyan",
    mockupGradient: "from-cyan-900/40 via-blue-900/30 to-black"
  },
  {
    title: "AINEX",
    customTitle: <AinexLogo />,
    desc: "Agente Neural Expert Principal (Protocolo AINEX). A mente central de IA projetada para raciocínio complexo, memória hierárquica e execução autônoma de tarefas.",
    link: "https://sentinnellcodex.vercel.app/",
    domain: "sentinnellcodex.vercel.app",
    icon: <Brain size={32} className="text-blue-400" />,
    tags: ["Neural Agent", "Expert System", "Core"],
    highlight: false,
    color: "blue",
    mockupGradient: "from-blue-900/40 via-indigo-900/30 to-black"
  },
  {
    title: "Qlik Codex I.A.",
    customTitle: <QlikLogo />,
    desc: "Plataforma de alta performance para processamento de dados, inteligência aplicada e automação integrada de fluxos.",
    link: "https://sentinnellcodex.vercel.app/",
    domain: "sentinnellcodex.vercel.app",
    icon: <Zap size={32} className="text-yellow-400" />,
    tags: ["Data", "Automation", "Platform"],
    highlight: false,
    color: "neon",
    mockupGradient: "from-green-900/40 via-emerald-900/30 to-black"
  },
  {
    title: "Projeto Mana",
    desc: "Repositório open source de páginas e ferramentas de alta performance para gestão inteligente de recursos e processos.",
    link: "https://github.com/jeanrrf/sentinell-pages",
    domain: "github.com/jeanrrf/sentinell-pages",
    icon: <Code2 size={32} />,
    tags: ["Management", "Automation", "GitHub"],
    highlight: false,
    color: "gray",
    mockupGradient: "from-slate-800/40 via-slate-900/30 to-black"
  },
  {
    title: "Cris Martins Lash",
    desc: "Landing Page de alta conversão para estúdio de estética e extensão de cílios. Design refinado, portfólio de serviços e agendamento otimizado.",
    link: "https://crismartinslash.vercel.app/",
    domain: "crismartinslash.vercel.app",
    icon: <Sparkles size={32} />,
    tags: ["Beauty", "Landing Page", "Conversion"],
    highlight: false,
    color: "purple",
    mockupGradient: "from-purple-900/40 via-pink-900/30 to-black"
  },
  {
    title: "Brand Jean",
    desc: "Experiência digital imersiva desenvolvida para identidade visual, portfólio pessoal e branding estratégico de Jean Rosso.",
    link: "https://brandjean.vercel.app/",
    domain: "brandjean.vercel.app",
    icon: <Palette size={32} />,
    tags: ["UI/UX", "Branding", "Design"],
    highlight: false,
    color: "amber",
    mockupGradient: "from-amber-900/40 via-orange-900/30 to-black"
  },
  {
    title: "SIAW Brand Pacotes",
    desc: "Sistema modular interativo para visualização e contratação simplificada de pacotes de serviços criativos e digitais da SIAW Workspace.",
    link: "https://siawbrandpacotes.vercel.app/",
    domain: "siawbrandpacotes.vercel.app",
    icon: <Layers size={32} />,
    tags: ["Platform", "Services", "Commerce"],
    highlight: false,
    color: "blue",
    mockupGradient: "from-blue-900/40 via-slate-900/30 to-black"
  },
  {
    title: "Gerador de Recibos",
    desc: "Ferramenta essencial e ágil para freelancers e profissionais autônomos. Permite emitir recibos profissionais com cálculo e layout automatizado.",
    link: "https://v0-sentinnell-pro-invoice.vercel.app/",
    domain: "v0-sentinnell-pro-invoice.vercel.app",
    icon: <Receipt size={32} />,
    tags: ["Utility", "Freelance", "Tools"],
    highlight: false,
    color: "green",
    mockupGradient: "from-emerald-900/40 via-teal-900/30 to-black"
  }
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 relative bg-black/40">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <span className="text-neon-500 font-mono text-sm tracking-wider mb-2 block">PORTFÓLIO &amp; INOVAÇÕES COMPLEXAS</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Projetos <span className="text-neon-400">Desenvolvidos por Jean Rosso</span> &amp; Sentinnell IA
            </h2>
          </div>
          <a href="https://github.com/jeanrrf" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm border-b border-gray-700 hover:border-white pb-1 transition-all whitespace-nowrap">
            Ver repositórios no GitHub <ExternalLink size={14} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.a
              key={idx}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`glass-card rounded-2xl overflow-hidden group relative flex flex-col h-full border border-white/10 hover:border-neon-500/40 transition-all duration-300 ${
                project.highlight ? 'border-pink-500/50 shadow-[0_0_35px_rgba(236,72,153,0.2)] md:col-span-2 md:grid md:grid-cols-12' : ''
              }`}
            >
              {/* Gloss Morph Highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {/* Top Accent Line */}
              <div className={`h-1.5 w-full absolute top-0 left-0 z-20 transition-opacity duration-300 ${
                  project.color === 'pink' ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-transparent opacity-100' :
                  project.color === 'cyan' ? 'bg-gradient-to-r from-cyan-400 to-transparent opacity-100' :
                  project.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-transparent opacity-100' :
                  project.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-transparent opacity-100' :
                  project.color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-transparent opacity-100' :
                  'bg-gradient-to-r from-neon-500 to-transparent opacity-100'
              }`}></div>
              
              {/* Mockup Preview Header / Image Container */}
              <div className={`${project.highlight ? 'md:col-span-5 min-h-[240px] md:min-h-full' : 'w-full h-44'} bg-gradient-to-br ${project.mockupGradient} relative border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between p-4 overflow-hidden`}>
                {project.coverImage && (
                  <div className="absolute inset-0 z-0">
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>
                )}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                    <Monitor size={12} className="text-neon-400" />
                    <span className="text-[10px] font-mono text-gray-300 tracking-wider truncate max-w-[160px]">{project.domain}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-neon-500 group-hover:text-black transition-all">
                    <ExternalLink size={14} />
                  </div>
                </div>

                {/* Center Icon/Watermark */}
                <div className="absolute right-4 bottom-2 opacity-20 transform translate-y-2 group-hover:scale-110 transition-transform duration-500 z-10">
                  {project.icon}
                </div>

                <div className="z-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DEPLOY ATIVO</span>
                </div>
              </div>

              <div className={`${project.highlight ? 'md:col-span-7' : 'flex-1'} p-6 sm:p-8 flex flex-col justify-between relative z-10`}>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                        project.color === 'pink' ? 'bg-pink-500/10 text-pink-400' :
                        project.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
                        project.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                        project.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                        project.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-white/5 text-neon-400 group-hover:bg-neon-500 group-hover:text-black'
                    }`}>
                      {project.icon}
                    </div>
                    <div>
                      {project.customTitle ? project.customTitle : (
                           <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-neon-400 transition-colors">
                              {project.title}
                          </h3>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
                    {project.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map(tag => (
                    <span key={tag} className={`text-xs font-mono px-2.5 py-1 rounded-md border ${
                        project.color === 'pink' 
                        ? 'bg-pink-500/10 text-pink-300 border-pink-500/30' 
                        : project.color === 'cyan'
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        : project.color === 'blue' 
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
                        : project.color === 'purple'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : project.color === 'amber'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-white/5 text-gray-300 border-white/10'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Background Glow on Hover */}
              <div className={`absolute -bottom-20 -right-20 w-40 h-40 blur-[50px] rounded-full transition-opacity duration-500 pointer-events-none ${
                   project.color === 'blue' ? 'bg-blue-500/20 opacity-30' : 'bg-neon-500/20 opacity-0 group-hover:opacity-100'
              }`}></div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
