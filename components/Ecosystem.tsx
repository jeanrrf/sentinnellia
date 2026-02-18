import React from 'react';
import { ExternalLink, Github, Linkedin, Youtube, MessageCircle, Trophy, Radio } from 'lucide-react';

const Ecosystem = () => {
  const ecosystemSections = [
    {
      title: '🌐 ECOSSISTEMA SENTINNELL',
      color: 'from-blue-500 to-cyan-500',
      items: [
        { icon: '🛡️', name: 'SENTINNELL IA', url: 'https://sentinnellia.vercel.app/' },
        { icon: '🛡️', name: 'PROTOCOLO AINEX', url: 'https://brandjean.vercel.app/' },
        { icon: '🛡️', name: 'QLIK CODEX IA', url: 'https://sentinnellcodex.vercel.app/' },
      ]
    },
    {
      title: '💻 DESENVOLVIMENTO & INFRA',
      color: 'from-purple-500 to-pink-500',
      items: [
        { icon: <Github size={18} />, name: 'Repositórios (GitHub)', url: 'https://github.com/jeanrrf' },
        { icon: <Linkedin size={18} />, name: 'Networking (LinkedIn)', url: 'https://www.linkedin.com/in/sentinnellia/' },
      ]
    },
    {
      title: '🌌 PARADOXO DO SILÍCIO (CONTEÚDO)',
      color: 'from-orange-500 to-red-500',
      items: [
        { icon: <Youtube size={18} />, name: 'YouTube', url: 'https://www.youtube.com/@ParadoxodoSilicio' },
        { icon: '📱', name: 'TikTok', url: 'https://www.tiktok.com/@paradoxsilicon' },
        { icon: <MessageCircle size={18} />, name: 'Reddit', url: 'https://www.reddit.com/user/Radiant-Ebb-3922/' },
        { icon: '🐦', name: 'X (Twitter)', url: 'https://x.com/ParadoxSiliconO' },
      ]
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-500/20 to-cyan-500/20" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-400 via-cyan-300 to-neon-400">
            Ecossistema Sentinnell
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Conecte-se com o ecossistema completo de desenvolvimento, conteúdo e inovação
          </p>
        </div>

        {/* Ecosystem Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {ecosystemSections.map((section, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur-md hover:border-neon-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-500/20"
            >
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6 text-white">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-neon-400 transition-colors duration-200 group/link"
                      >
                        <span className="text-xl">
                          {typeof item.icon === 'string' ? item.icon : item.icon}
                        </span>
                        <span className="flex-1 font-medium">{item.name}</span>
                        <ExternalLink size={16} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="relative bg-gradient-to-r from-neon-500/10 to-cyan-500/10 border border-neon-500/30 rounded-xl p-8 backdrop-blur-md text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy size={24} className="text-neon-400" />
            <h3 className="text-2xl font-bold text-white">Contato Profissional</h3>
            <Trophy size={24} className="text-neon-400" />
          </div>
          <a
            href="mailto:sentinnellia@gmail.com"
            className="inline-flex items-center gap-2 text-neon-400 hover:text-neon-300 transition-colors font-mono text-lg font-semibold hover:underline"
          >
            ✉️ sentinnellia@gmail.com
          </a>
          <p className="text-gray-400 mt-4 text-sm">
            Pronto para revolucionar seu desenvolvimento com IA? Entre em contato conosco.
          </p>
        </div>

        {/* Divider Line */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neon-500/50 to-transparent" />
          <span className="text-neon-500 font-mono text-sm">◈──────────────────────────────◈</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neon-500/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
