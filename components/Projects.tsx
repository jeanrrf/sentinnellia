import React from 'react';
import { ExternalLink, Code2, Receipt, BrainCircuit, Palette, Layers, Sparkles, Zap, Brain } from 'lucide-react';
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
    title: "AINEX",
    customTitle: <AinexLogo />,
    desc: "Nosso Agente Neural Expert Principal. A mente central capaz de raciocínio, memória hierárquica e execução autônoma.",
    link: "https://sentinnellcodex.vercel.app/", // Linkado ao Codex como interface principal
    icon: <Brain size={32} className="text-blue-400" />,
    tags: ["Neural Agent", "Expert System", "Core"],
    highlight: true,
    color: "blue"
  },
  {
    title: "Qlik Codex I.A.",
    customTitle: <QlikLogo />,
    desc: "Plataforma de alta performance para processamento de dados e inteligência aplicada.",
    link: "https://sentinnellcodex.vercel.app/",
    icon: <Zap size={32} className="text-yellow-400" />,
    tags: ["Data", "Automation", "Platform"],
    highlight: false,
    color: "neon"
  },
  {
    title: "Projeto Mana",
    desc: "Gestão inteligente de recursos e processos. Otimização focada em sustentabilidade e eficiência.",
    link: "https://vercel.com/jeans-projects-6921150e/projeto-mana",
    icon: <Code2 size={32} />,
    tags: ["Management", "Automation"]
  },
  {
    title: "Cris Martins Lash",
    desc: "Landing Page de alta conversão para estética e beleza. Design refinado e agendamento otimizado.",
    link: "https://crismartinslash.vercel.app/",
    icon: <Sparkles size={32} />,
    tags: ["Beauty", "Landing Page", "Conversion"]
  },
  {
    title: "Brand Jean",
    desc: "Experiência digital imersiva para identidade visual e branding estratégico de alto impacto.",
    link: "https://brandjean.vercel.app/",
    icon: <Palette size={32} />,
    tags: ["UI/UX", "Branding", "Design"]
  },
  {
    title: "SIAW Brand Pacotes",
    desc: "Sistema modular para visualização e contratação simplificada de serviços criativos.",
    link: "https://siawbrandpacotes.vercel.app/",
    icon: <Layers size={32} />,
    tags: ["Platform", "Services", "Commerce"]
  },
  {
    title: "Gerador de Recibos",
    desc: "Ferramenta essencial para freelancers. Rápida, prática e com design profissional automatizado.",
    link: "https://vercel.com/jeans-projects-6921150e/v0-recibo-gerador-para-freelancers",
    icon: <Receipt size={32} />,
    tags: ["Utility", "Freelance", "Tools"]
  }
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 relative bg-black/40">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-neon-500 font-mono text-sm tracking-wider mb-2 block">PORTFÓLIO & SISTEMAS</span>
            <h2 className="text-4xl font-bold text-white">Nossas <span className="text-neon-500">Soluções</span></h2>
          </div>
          <a href="https://github.com/jeanrrf" target="_blank" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm border-b border-gray-700 hover:border-white pb-1 transition-all">
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
              className={`glass-card rounded-xl overflow-hidden group relative flex flex-col h-full ${
                project.highlight ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)] md:col-span-2 md:flex-row' : ''
              }`}
            >
              {/* Top Accent Line */}
              <div className={`h-1 w-full absolute top-0 left-0 z-20 transition-opacity duration-300 ${
                  project.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-transparent opacity-100' : 'bg-gradient-to-r from-neon-600 to-transparent opacity-0 group-hover:opacity-100'
              }`}></div>
              
              <div className={`p-8 flex-1 flex flex-col ${project.highlight ? 'md:justify-center' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-lg transition-colors ${
                      project.color === 'blue' 
                      ? 'bg-blue-500/10 text-blue-400' 
                      : 'bg-white/5 text-neon-400 group-hover:bg-neon-500 group-hover:text-black'
                  }`}>
                    {project.icon}
                  </div>
                  <ExternalLink className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                </div>
                
                <div className="mb-3">
                    {project.customTitle ? project.customTitle : (
                         <h3 className="text-2xl font-bold text-white group-hover:text-neon-400 transition-colors">
                            {project.title}
                        </h3>
                    )}
                </div>
                
                <p className={`text-gray-400 text-sm mb-6 flex-1 ${project.highlight ? 'text-base max-w-xl' : ''}`}>
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className={`text-xs font-mono px-2 py-1 rounded border ${
                        project.color === 'blue' 
                        ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
                        : 'bg-white/5 text-gray-400 border-white/5'
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