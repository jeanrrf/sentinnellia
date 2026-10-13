import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, GraduationCap, MessageCircle, X } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OFFICIAL_CONTACT, getWhatsAppDirectUrl } from '../utils/leadSync';
import { trackEvent } from '../utils/useAnalytics';

const FloatingCTA: FC = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  // Don't show on the lead page itself or the dashboard
  const isHidden = location.pathname === '/mentoria' || location.pathname === '/leads-dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isHidden) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-2.5"
        >
          {/* Sub-menu opções quando expandido */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="flex flex-col gap-2 mb-1 p-2 bg-black/90 backdrop-blur-xl border border-neon-500/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)]"
              >
                {/* Opção 1: WhatsApp Direto */}
                <a
                  href={getWhatsAppDirectUrl('Olá Jean Rosso! Vi o site Sentinnelle IA e quero tirar dúvidas sobre a mentoria e projetos.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('cta_click', { location: 'floating_fab_whatsapp' })}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <MessageCircle size={16} className="text-emerald-400 group-hover:text-black" />
                  <span>WhatsApp ({OFFICIAL_CONTACT.whatsappDisplay})</span>
                </a>

                {/* Opção 2: Página de Mentoria */}
                <Link
                  to="/mentoria"
                  onClick={() => {
                    setExpanded(false);
                    trackEvent('cta_click', { location: 'floating_fab_mentoria' });
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neon-500/20 hover:bg-neon-500 text-neon-400 hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <GraduationCap size={16} />
                  <span>Inscrição na Mentoria Gratuita</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão Principal Flutuante */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              id="floating-cta-btn"
              className="group flex items-center gap-3 bg-neon-500 hover:bg-neon-600 text-black font-black pl-4 pr-5 py-3.5 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] transition-all duration-300 active:scale-95"
              aria-label="Falar com Mentor — Contato Rápido"
            >
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-40" />
                <MessageCircle className="relative w-5 h-5 fill-black" />
              </span>
              <span className="text-xs sm:text-sm tracking-wide uppercase">Falar com Mentor</span>
              <ChevronUp
                size={16}
                className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
