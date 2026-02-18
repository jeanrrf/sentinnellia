import React from 'react';
import { Github, Mail, Phone, ExternalLink, Youtube, MessageCircle, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: '⚡ Ecossistema Sentinnell',
      links: [
        { label: 'Sentinnell IA', url: 'https://sentinnellia.vercel.app/', emoji: '🛡️' },
        { label: 'Protocolo Ainex', url: 'https://brandjean.vercel.app/', emoji: '🔐' },
        { label: 'Qlik Codex IA', url: 'https://sentinnellcodex.vercel.app/', emoji: '💎' }
      ]
    },
    {
      title: '💻 Desenvolvimento & Infra',
      links: [
        { label: 'Repositórios (GitHub)', url: 'https://github.com/jeanrrf', emoji: '📦' },
        { label: 'Networking (LinkedIn)', url: 'https://www.linkedin.com/in/sentinnellia/', emoji: '🤝' }
      ]
    },
    {
      title: '🌌 Paradoxo do Silício',
      links: [
        { label: 'YouTube', url: 'https://www.youtube.com/@ParadoxodoSilicio', emoji: '▶️' },
        { label: 'TikTok', url: 'https://www.tiktok.com/@paradoxsilicon', emoji: '📸' },
        { label: 'Reddit', url: 'https://www.reddit.com/user/Radiant-Ebb-3922/', emoji: '📖' },
        { label: 'X / Twitter', url: 'https://x.com/ParadoxSiliconO', emoji: '𝕏' }
      ]
    },
    {
      title: '🎓 Aprendizado',
      links: [
        { label: 'Mentoria & Treinamento', url: '#mentorship', emoji: '📚' },
        { label: 'Documentação', url: '#projects', emoji: '📝' }
      ]
    }
  ];

  return (
    <footer id="about" className="py-16 border-t border-white/10 bg-black/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Seções do Footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Logo e Descrição */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-neon-600 to-neon-400 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                <span className="text-black font-bold text-lg">⚡</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white">
                  SENTINNELL <span className="text-neon-400">IA</span>
                </span>
                <span className="text-xs text-neon-400 font-medium">Revolução em IA</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Transformando o futuro através de inteligência artificial aplicada e design robusto.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} Sentinnell IA. Todos os direitos reservados.
            </p>
          </div>

          {/* Seções de Links */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="text-white font-semibold text-sm">{section.title}</h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-neon-400 transition-colors text-sm group"
                    >
                      <span>{link.emoji}</span>
                      <span>{link.label}</span>
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contato Direto e Call-to-Action */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 text-sm">
            <h4 className="text-white font-semibold text-lg flex items-center gap-2">✉️ Contato Profissional</h4>
            <a 
              href="mailto:sentinnellia@gmail.com" 
              className="flex items-center gap-2 text-gray-400 hover:text-neon-400 transition-colors font-medium"
            >
              <Mail size={18} className="text-neon-400" /> sentinnellia@gmail.com
            </a>
            <a 
              href="https://wa.me/5548991937304" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-neon-400 transition-colors font-medium"
            >
              <Phone size={18} className="text-neon-400" /> +55 (48) 99193-7304
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/jeanrrf" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub - Repositórios"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-neon-600 flex items-center justify-center text-gray-400 hover:text-black transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
              title="GitHub"
            >
              <Github size={22} />
            </a>
            <a 
              href="https://www.linkedin.com/in/sentinnellia/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn - Networking"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              title="LinkedIn"
            >
              <span className="text-xl font-bold">in</span>
            </a>
            <a 
              href="https://www.youtube.com/@ParadoxodoSilicio" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="YouTube - Conteúdo"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-red-600 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              title="YouTube"
            >
              <Youtube size={22} />
            </a>
            <a 
              href="https://x.com/ParadoxSiliconO" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              title="X / Twitter"
            >
              <span className="text-xl font-bold">𝕏</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-neon-500 to-transparent opacity-30"></div>
    </footer>
  );
};

export default Footer;
