import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Mail, MessageCircle, Phone, Send, Sparkles, X } from 'lucide-react';
import { useState, type FC, type FormEvent } from 'react';
import {
  OFFICIAL_CONTACT,
  getLeadMailtoUrl,
  getLeadWhatsAppUrl,
  getWhatsAppDirectUrl,
  saveLead,
  syncLeadEmail
} from '../utils/leadSync';
import { trackEvent } from '../utils/useAnalytics';
import { LogoEmblem } from './Logo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

const ContactModal: FC<ContactModalProps> = ({ isOpen, onClose, defaultTopic }) => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState(defaultTopic || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !whatsapp.trim()) return;

    setSubmitting(true);
    const payload = {
      nome: nome.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      mensagem: mensagem.trim() || 'Contato rápido via modal',
      nivel: 'geral',
      origem: 'modal_contato_rapido',
    };

    // 1. Salva sincronizado no storage do app
    saveLead(payload);

    // 2. Prepara URLs diretas para o Jean
    const waUrl = getLeadWhatsAppUrl(payload);
    const mailUrl = getLeadMailtoUrl(payload);
    setLastWhatsAppUrl(waUrl);
    setLastMailtoUrl(mailUrl);

    // 3. Notifica por EmailJS em paralelo
    await syncLeadEmail(payload);

    trackEvent('form_submit', { form_type: 'quick_contact_modal' });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setNome('');
    setWhatsapp('');
    setEmail('');
    setMensagem('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card-strong w-full max-w-lg rounded-3xl p-6 sm:p-8 relative z-10 border border-neon-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Fechar */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Fechar modal"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                    <LogoEmblem size={14} /> Contato Direto & Oficial
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Fale com <span className="text-cyan-400">Jean Rosso</span>
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Escolha a melhor forma de se conectar. Resposta rápida no WhatsApp ou agendamento para mentoria.
                  </p>
                </div>

                {/* Canais Rápidos Diretos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <a
                    href={getWhatsAppDirectUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('cta_click', { location: 'contact_modal_direct_wa' })}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-all hover:scale-[1.02] group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                      <MessageCircle size={20} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">WhatsApp Oficial</div>
                      <div className="text-xs font-mono text-gray-300 truncate">{OFFICIAL_CONTACT.whatsappDisplay}</div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${OFFICIAL_CONTACT.email}?subject=Contato%20Sentinnelle%20IA`}
                    onClick={() => trackEvent('cta_click', { location: 'contact_modal_direct_email' })}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 transition-all hover:scale-[1.02] group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition-colors">
                      <Mail size={20} />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-xs text-blue-300 font-bold uppercase tracking-wider">E-mail Direto</div>
                      <div className="text-xs font-mono text-gray-300 truncate">{OFFICIAL_CONTACT.email}</div>
                    </div>
                  </a>
                </div>

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                  <span className="relative bg-dark-900 px-3 text-[11px] font-mono uppercase text-gray-500 tracking-widest">
                    ou envie seus dados para retorno imediato
                  </span>
                </div>

                {/* Formulário Rápido */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neon-500/50 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                        Seu WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(48) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neon-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                        Seu E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neon-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                      Mensagem ou Dúvida (opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Gostaria de saber sobre turmas, projetos ou mentoria..."
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-neon-500/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-neon-500 hover:bg-neon-600 disabled:opacity-50 text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(34,197,94,0.4)] text-sm uppercase tracking-wider"
                  >
                    {submitting ? 'Sincronizando...' : 'Enviar e Sincronizar Contato'}
                    <Send size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 bg-neon-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-neon-500">
                  <CheckCircle2 className="w-8 h-8 text-neon-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Dados Registrados com Sucesso! 🚀</h3>
                  <p className="text-gray-300 text-sm max-w-sm mx-auto leading-relaxed">
                    Seu contato foi salvo em nosso sistema e notificado por e-mail para <strong className="text-white">{OFFICIAL_CONTACT.email}</strong>.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <p className="text-xs font-mono text-neon-400 uppercase tracking-widest">
                    👉 Conecte-se agora mesmo no WhatsApp do Jean:
                  </p>
                  <a
                    href={lastWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] text-sm uppercase"
                  >
                    <MessageCircle size={18} /> Abrir Conversa no WhatsApp
                  </a>

                  <a
                    href={lastMailtoUrl}
                    className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-white text-gray-300 hover:text-white py-2.5 rounded-xl transition-colors text-xs font-mono"
                  >
                    <Mail size={14} /> Abrir no aplicativo de e-mail
                  </a>
                </div>

                <button
                  onClick={handleResetAndClose}
                  className="text-xs text-gray-500 hover:text-gray-300 underline font-mono tracking-wider pt-2"
                >
                  Concluir e fechar
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
