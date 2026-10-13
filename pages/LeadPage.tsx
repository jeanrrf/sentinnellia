import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Mail,
  MessageCircle,
  Send,
  Shield,
  Star,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';
import {
  OFFICIAL_CONTACT,
  getLeadMailtoUrl,
  getLeadWhatsAppUrl,
  getWhatsAppDirectUrl,
  saveLead,
  syncLeadEmail,
  type LeadPayload
} from '../utils/leadSync';
import { trackEvent } from '../utils/useAnalytics';
import Logo from '../components/Logo';

interface FormData {
  nome: string;
  email: string;
  whatsapp: string;
  nivel: string;
  mensagem: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  whatsapp?: string;
  mensagem?: string;
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nome.trim() || data.nome.trim().length < 2) {
    errors.nome = 'Informe seu nome completo (mínimo 2 caracteres).';
  }
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Informe um email válido.';
  }
  const digits = data.whatsapp.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    errors.whatsapp = 'Informe um WhatsApp válido com DDD (ex: 48 99193-7304).';
  }
  if (data.mensagem.trim().length > 0 && data.mensagem.trim().length < 3) {
    errors.mensagem = 'Mensagem muito curta.';
  }
  return errors;
}

const LeadPage: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    whatsapp: '',
    nivel: 'iniciante',
    mensagem: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const [mailtoUrl, setMailtoUrl] = useState('');
  const formStarted = useRef(false);

  // SEO meta tags
  useEffect(() => {
    document.title = 'Mentoria Gratuita IA | Sentinnelle IA — Protocolo AINEX';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content =
      'Participe da mentoria gratuita Sentinnelle IA com Jean Rosso. Projetos reais com NVIDIA Cloud e Google Developers. Vagas limitadas — inscreva-se agora!';
    window.scrollTo(0, 0);
  }, []);

  // Validate on change after first touch
  useEffect(() => {
    const e = validateForm(formData);
    const relevantErrors: FormErrors = {};
    (Object.keys(touched) as (keyof FormData)[]).forEach((field) => {
      if (touched[field] && e[field as keyof FormErrors]) {
        (relevantErrors as Record<string, string>)[field] = (e as Record<string, string>)[field];
      }
    });
    setErrors(relevantErrors);
  }, [formData, touched]);

  const handleFocus = (field: keyof FormData) => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackEvent('form_start', { page: 'mentoria' });
    }
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((d) => ({ ...d, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof FormData, boolean>
    );
    setTouched(allTouched);

    const allErrors = validateForm(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);

    const payload: LeadPayload = {
      nome: formData.nome,
      email: formData.email,
      whatsapp: formData.whatsapp,
      nivel: formData.nivel,
      mensagem: formData.mensagem,
      origem: 'formulario_mentoria_principal',
    };

    // 1. Salva no banco local sincronizado
    saveLead(payload);

    // 2. Prepara URLs de sincronização imediata
    setWhatsAppUrl(getLeadWhatsAppUrl(payload));
    setMailtoUrl(getLeadMailtoUrl(payload));

    // 3. Notifica por email
    await syncLeadEmail(payload);

    trackEvent('form_submit', { page: 'mentoria', nivel: formData.nivel });
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${
      errors[field]
        ? 'border-red-500/60 focus:border-red-500'
        : 'border-white/10 focus:border-neon-500/50 focus:bg-white/10'
    }`;

  return (
    <div className="min-h-screen text-white selection:bg-neon-500/30 selection:text-neon-400 font-sans">
      <Background />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'Mentoria Gratuita em IA e Vibe Coding — Sentinnelle IA',
            description:
              'Mentoria 100% prática sobre Vibe Coding, IA Generativa e Deploy com NVIDIA e Google Cloud.',
            provider: {
              '@type': 'Organization',
              name: 'Sentinnelle IA',
              url: 'https://sentinnellia.vercel.app',
            },
            url: 'https://sentinnellia.vercel.app/mentoria',
          }),
        }}
      />

      <main className="relative z-10">
        {/* Header */}
        <header className="py-8 px-6 max-w-7xl mx-auto flex justify-between items-center border-b border-white/5">
          <Link to="/" className="cursor-pointer">
            <Logo size={36} showText={true} />
          </Link>

          <div className="flex items-center gap-4">
            <a
              href={getWhatsAppDirectUrl('Olá Jean! Vim pela página de mentoria e gostaria de tirar uma dúvida.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <MessageCircle size={14} /> WhatsApp: {OFFICIAL_CONTACT.whatsappDisplay}
            </a>

            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
          </div>
        </header>

        {/* Hero + Form */}
        <section
          aria-label="Inscrição para Mentoria Gratuita"
          className="pt-10 md:pt-16 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-3 h-3 fill-neon-400" />
              Inscrições Abertas — Vagas Limitadas
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Domine o Código com{' '}
              <span className="text-neon-500">IA Generativa</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              Aprenda a construir com IA na prática. Do setup inicial às ferramentas de{' '}
              <span className="text-white font-semibold underline decoration-neon-500">
                Vibe Coding
              </span>, NVIDIA Cloud e Google Developers com quem atua no mercado.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                'Aulas 100% ao vivo via Google Meet',
                'Do setup ao deploy na Vercel',
                '10 principais provedoras de cloud',
                'Projetos Reais NVIDIA & Google Developers',
                'Atendimento individualizado e dúvidas reais',
                'Contato direto com Jean no WhatsApp',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-neon-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm leading-snug">{text}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <MessageCircle size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono uppercase text-gray-400">Canal direto de atendimento</p>
                <p className="text-sm font-semibold text-white">
                  WhatsApp: <span className="text-emerald-400">{OFFICIAL_CONTACT.whatsappDisplay}</span>
                </p>
                <p className="text-xs text-gray-400">E-mail: {OFFICIAL_CONTACT.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            id="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-card-strong p-8 md:p-10 rounded-3xl relative overflow-visible border border-neon-500/40 shadow-[0_0_50px_rgba(34,197,94,0.15)]"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10" noValidate>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-1">Garantir Minha Vaga</h2>
                  <p className="text-gray-400 text-sm">
                    Preencha seus dados para receber o agendamento da{' '}
                    <span className="text-neon-400 font-semibold">mentoria gratuita</span>.
                  </p>
                </div>

                {/* Nome */}
                <div>
                  <label htmlFor="lead-nome" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    id="lead-nome"
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    onFocus={() => handleFocus('nome')}
                    className={inputClass('nome')}
                  />
                  {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="lead-whatsapp" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    id="lead-whatsapp"
                    type="tel"
                    required
                    placeholder="(48) 99193-7304"
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    onFocus={() => handleFocus('whatsapp')}
                    className={inputClass('whatsapp')}
                  />
                  {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="lead-email" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                    E-mail Profissional *
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onFocus={() => handleFocus('email')}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Nível */}
                <div>
                  <label htmlFor="lead-nivel" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                    Seu Nível em Programação
                  </label>
                  <select
                    id="lead-nivel"
                    value={formData.nivel}
                    onChange={(e) => handleChange('nivel', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10 appearance-none cursor-pointer"
                  >
                    <option value="iniciante">Iniciante — Começando agora</option>
                    <option value="intermediario">Intermediário — Já programo e quero dominar IA</option>
                    <option value="avancado">Avançado / Sênior — Quero especialização em Agentes</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="lead-mensagem" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
                    Objetivo ou Dúvida (opcional)
                  </label>
                  <textarea
                    id="lead-mensagem"
                    rows={2}
                    placeholder="Conte um pouco do que você quer construir..."
                    value={formData.mensagem}
                    onChange={(e) => handleChange('mensagem', e.target.value)}
                    onFocus={() => handleFocus('mensagem')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="lead-submit-btn"
                  disabled={loading}
                  className="w-full bg-neon-500 hover:bg-neon-600 disabled:opacity-60 text-black font-black py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.4)] text-sm uppercase tracking-wider"
                >
                  {loading ? (
                    <span className="animate-pulse">SINCRONIZANDO LEAD...</span>
                  ) : (
                    <>
                      DESTRAVAR MEU ACESSO <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-gray-500 leading-relaxed uppercase tracking-tighter">
                  🔒 Dados protegidos conforme a LGPD. Contato direto sem spam.
                </p>
              </form>
            ) : (
              /* Success State */
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-20 h-20 bg-neon-500/20 rounded-full flex items-center justify-center border-4 border-neon-500"
                >
                  <CheckCircle className="w-10 h-10 text-neon-500" />
                </motion.div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-neon-400 font-mono tracking-tight">
                    INSCRIÇÃO SINCRONIZADA ✅
                  </h2>
                  <p className="text-gray-300 max-w-sm mx-auto text-sm leading-relaxed">
                    Olá <strong className="text-white">{formData.nome}</strong>! Seus dados foram salvos com sucesso e o email de notificação foi despachado para a equipe.
                  </p>
                </div>

                <div className="w-full space-y-3 pt-2">
                  <p className="text-xs font-mono text-neon-400 uppercase tracking-widest">
                    🚀 Conecte-se agora mesmo no WhatsApp do Jean:
                  </p>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-4 px-6 rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.5)] text-sm uppercase tracking-wide"
                  >
                    <MessageCircle size={20} /> Conversar no WhatsApp Agora
                  </a>

                  <a
                    href={mailtoUrl}
                    className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-white text-gray-300 hover:text-white py-3 rounded-xl transition-colors text-xs font-mono"
                  >
                    <Mail size={16} /> Enviar confirmação por E-mail
                  </a>
                </div>

                <Link
                  to="/"
                  className="text-neon-500 hover:text-white underline text-xs font-mono tracking-widest uppercase transition-colors pt-2"
                >
                  ← Voltar para a Página Inicial
                </Link>
              </div>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LeadPage;
