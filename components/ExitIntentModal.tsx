import emailjs from '@emailjs/browser';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState, type FC } from 'react';
import { trackEvent } from '../utils/useAnalytics';

const EXIT_SHOWN_KEY = 'sentinnellia_exit_shown';

// EMAILJS CONFIG (Must match LeadPage.tsx)
const EMAILJS_SERVICE_ID = 'service_0payg1q';
const EMAILJS_TEMPLATE_ID = 'template_p7pweto';
const EMAILJS_PUBLIC_KEY = 'Yf8WAs62wX91bK8qh';

// Save a mini-lead from the exit intent form
async function saveMiniLead(nome: string, email: string) {
    const leads = JSON.parse(localStorage.getItem('sentinnellia_leads') ?? '[]');
    const id = `LEAD-${Date.now()}`;
    leads.push({
        id,
        nome,
        email,
        whatsapp: '',
        nivel: 'desconhecido',
        mensagem: '[Lead via Exit Intent Popup]',
        timestamp: new Date().toISOString(),
        status: 'Pendente',
        origem: 'exit_intent',
    });
    localStorage.setItem('sentinnellia_leads', JSON.stringify(leads));

    // Send email notification
    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                from_name: nome,
                from_email: email,
                whatsapp: '(via exit-intent)',
                nivel: 'N/A',
                mensagem: '[Lead capturado via Pop-up de Saída]',
                data_hora: new Date().toLocaleString('pt-BR'),
                to_email: 'sentinnellia@gmail.com',
            },
            EMAILJS_PUBLIC_KEY
        );
    } catch (err) {
        console.warn('EmailJS error in ExitIntent:', err);
    }
}

const ExitIntentModal: FC = () => {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const triggered = useRef(false);

    useEffect(() => {
        // Only show once per session
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMiniLead(nome, email);
        trackEvent('form_submit', { form_type: 'exit_intent' });
        setSubmitted(true);
        setTimeout(() => setOpen(false), 3000);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300]"
                        onClick={() => setOpen(false)}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        className="fixed inset-0 flex items-center justify-center z-[301] p-4 pointer-events-none"
                    >
                        <div className="glass-card-strong rounded-3xl p-8 w-full max-w-md pointer-events-auto relative">
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>

                            {!submitted ? (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-neon-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neon-500/30">
                                            <Zap className="w-8 h-8 text-neon-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            Espera! Não Perca Sua Vaga 🚀
                                        </h2>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Deixe seu nome e email para receber mais informações sobre a{' '}
                                            <span className="text-neon-400 font-semibold">mentoria gratuita</span> em IA.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                                                Seu Nome
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ex: João Silva"
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">
                                                Seu Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="seu@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            id="exit-intent-submit-btn"
                                            className="w-full bg-neon-500 hover:bg-neon-600 text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                        >
                                            Quero Minha Vaga <Send className="w-4 h-4" />
                                        </button>
                                        <p className="text-[10px] text-center text-gray-600 uppercase tracking-widest">
                                            🔒 Seus dados seguem a LGPD. Sem spam.
                                        </p>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-neon-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-neon-500">
                                        <Zap className="w-8 h-8 text-neon-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-neon-400 mb-2">Recebido! ✅</h2>
                                    <p className="text-gray-400 text-sm">Entraremos em contato em breve.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExitIntentModal;
