import React from 'react';
import { Github, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="about" className="py-12 border-t border-white/5 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">
        
        {/* Marca e Copyright */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-neon-600 rounded flex items-center justify-center">
                    <span className="text-black font-bold text-xs">S</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-white">
                    SENTINNELL <span className="text-neon-500">IA</span>
                </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Transformando o futuro através de inteligência artificial aplicada e design robusto.
            </p>
            <p className="text-xs text-gray-600 mt-4">
                © {new Date().getFullYear()} Sentinnelle IA.
            </p>
        </div>

        {/* Contato Direto */}
        <div className="flex flex-col gap-4">
            <h4 className="text-white font-mono text-sm tracking-wider uppercase">Contato Direto</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
                <a href="mailto:sentinnellia@gmail.com" className="flex items-center gap-2 hover:text-neon-400 transition-colors">
                    <Mail size={16} /> sentinnellia@gmail.com
                </a>
                <a href="mailto:rosso.jeandasilva@gmail.com" className="flex items-center gap-2 hover:text-neon-400 transition-colors">
                    <Mail size={16} /> rosso.jeandasilva@gmail.com
                </a>
                <a href="https://wa.me/5548991937304" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neon-400 transition-colors">
                    <Phone size={16} /> +55 (48) 99193-7304
                </a>
            </div>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-4">
             <h4 className="text-white font-mono text-sm tracking-wider uppercase">Redes</h4>
             <div className="flex items-center gap-4">
                <a href="https://github.com/jeanrrf" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-neon-600 hover:text-black transition-all">
                    <Github size={20} />
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