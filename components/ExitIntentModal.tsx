import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Send, Sparkles, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState, type FC, type FormEvent } from 'react';
import {
  OFFICIAL_CONTACT,
  getLeadWhatsAppUrl,
  saveLead,
  syncLeadEmail
} from '../utils/leadSync';
import { trackEvent } from '../utils/useAnalytics';
import { LogoEmblem } from './Logo';

const EXIT_SHOWN_KEY = 'sentinnellia_exit_shown';

const ExitIntentModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const triggered = useRef(false);

  useEffect(() => {
    // Show only once per session
    if (sessionStorage.getItem(EXIT_SHOWN_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered.current) {
        triggered.current = true;
        sessionStorage.setItem(EXIT_SHOWN_KEY, '1');
        setOpen(true);
        trackEvent('exit_intent_shown');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !whatsapp.trim() || !email.trim()) return;

    setSubmitting(true);
    const payload = {
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      nivel: 'iniciante',
      mensagem: 'Lead capturado via Pop-up de Saída (Interesse em Mentoria Gratuita)',
      origem: 'exit_intent',
    };

    saveLead(payload);
    const waUrl = getLeadWhatsAppUrl(payload);
    setWhatsAppUrl(waUrl);

    await syncLeadEmail(payload);

    trackEvent('form_submit', { form_type: 'exit_intent' });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="glass-card-strong rounded-3xl p-6 sm:p-8 w-full max-w-md relative z-10 border border-neon-500/40 shadow-[0_0_50px_rgba(34,197,94,0.15)]"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-cyan-400/30 bg-white/5 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <LogoEmblem size={34} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Espera! Não Perca Sua Vaga 🚀
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Receba o cronograma da <span className="text-neon-400 font-semibold">mentoria gratuita</span> e converse direto no WhatsApp com o mentor.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                      Seu WhatsApp (com DDD)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(48) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                      Seu Melhor E-mail
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    id="exit-intent-submit-btn"
                    className="w-full bg-neon-500 hover:bg-neon-600 disabled:opacity-50 text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] text-sm tracking-wide uppercase"
                  >
                    {submitting ? 'Sincronizando...' : 'Garantir Vaga no WhatsApp'}
                    <Send className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest pt-1">
                    🔒 Seus dados seguem a LGPD. Resposta rápida sem spam.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-neon-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-neon-500">
                  <CheckCircle2 className="w-8 h-8 text-neon-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neon-400 mb-2">Vaga Registrada! ✅</h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Seus dados foram sincronizados com nossa equipe ({OFFICIAL_CONTACT.email}).
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all text-sm uppercase"
                  >
                    <MessageCircle size={18} /> Conversar no WhatsApp com Jean Rosso
                  </a>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="text-xs text-gray-500 hover:text-gray-400 underline font-mono tracking-wider"
                >
                  Fechar janela
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
