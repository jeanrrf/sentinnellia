import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    MessageSquare,
    Send,
    Shield,
    Star,
    Users,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import Background from '../components/Background';
import { trackEvent } from '../utils/useAnalytics';

// ─────────────────────────────────────────────────────────────────────────────
// EMAILJS CONFIGURATION
// 1. Crie conta gratuita em: https://www.emailjs.com/
// 2. Conecte seu Gmail (sentinnellia@gmail.com) como Email Service
// 3. Crie um Email Template com as variáveis abaixo
// 4. Substitua as 3 constantes com seus valores reais
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = 'service_0payg1q';   // Ex: 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_p7pweto'; // Ex: 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'Yf8WAs62wX91bK8qh';   // Ex: 'user_ABC...'

// ─── Template sugerido para o EmailJS ────────────────────────────────────────
// Assunto: 🚀 Novo Lead Sentinnelle IA — {{from_name}}
// Corpo:
// Nome: {{from_name}}
// Email: {{from_email}}
// WhatsApp: {{whatsapp}}
// Nível: {{nivel}}
// Mensagem: {{mensagem}}
// Data/Hora: {{data_hora}}

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
    if (!data.nome.trim() || data.nome.trim().length < 2)
        errors.nome = 'Informe seu nome completo (mínimo 2 caracteres).';
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        errors.email = 'Informe um email válido.';
    const digits = data.whatsapp.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11)
        errors.whatsapp = 'Informe um WhatsApp válido com DDD.';
    if (data.mensagem.trim().length > 0 && data.mensagem.trim().length < 5)
        errors.mensagem = 'Mensagem muito curta.';
    return errors;
}

function saveLead(data: FormData): string {
    const leads = JSON.parse(localStorage.getItem('sentinnellia_leads') ?? '[]');
    const id = `LEAD-${Date.now()}`;
    leads.push({
        id,
        nome: data.nome,
        email: data.email,
        whatsapp: data.whatsapp,
        nivel: data.nivel,
        mensagem: data.mensagem || '—',
        timestamp: new Date().toISOString(),
        status: 'Pendente',
        origem: 'formulario_principal',
    });
    localStorage.setItem('sentinnellia_leads', JSON.stringify(leads));
    return id;
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
    const [sendError, setSendError] = useState(false);
    const formStarted = useRef(false);

    // SEO meta tags
    useEffect(() => {
        document.title = 'Mentoria Gratuita IA | Sentinnelle IA — Domine Vibe Coding';
        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.content =
            'Participe da mentoria gratuita Sentinnelle IA. Aprenda a desenvolver com IA generativa, NVIDIA Cloud e Google Developers. Inscreva-se agora — vagas limitadas!';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Full validation on submit
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
        setSendError(false);

        // Save to localStorage regardless of email success
        saveLead(formData);

        // Send email notification via EmailJS
        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.nome,
                    from_email: formData.email,
                    whatsapp: formData.whatsapp,
                    nivel: formData.nivel,
                    mensagem: formData.mensagem || '(sem mensagem)',
                    data_hora: new Date().toLocaleString('pt-BR'),
                },
                EMAILJS_PUBLIC_KEY
            );
        } catch (err) {
            // Email failed — lead is still saved in localStorage
            console.warn('EmailJS error (lead salvo no dashboard):', err);
            setSendError(true);
        }

        trackEvent('form_submit', { page: 'mentoria', nivel: formData.nivel });
        setLoading(false);
        setSubmitted(true);
    };

    const inputClass = (field: keyof FormErrors) =>
        `w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${errors[field]
            ? 'border-red-500/60 focus:border-red-500'
            : 'border-white/10 focus:border-neon-500/50 focus:bg-white/10'
        }`;

    return (
        <div className="min-h-screen text-white selection:bg-neon-500/30 selection:text-neon-400 font-sans">
            <Background />

            {/* ── Schema.org JSON-LD ─────────────────────────────────────────────── */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Event',
                    name: 'Mentoria Gratuita IA — Sentinnelle IA',
                    description: 'Mentoria 100% prática sobre Vibe Coding, IA Generativa e Deploy com NVIDIA e Google Cloud.',
                    organizer: { '@type': 'Organization', name: 'Sentinnelle IA', url: 'https://sentinnellia.vercel.app' },
                    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
                    eventStatus: 'https://schema.org/EventScheduled',
                    url: 'https://sentinnellia.vercel.app/mentoria',
                })
            }} />

            <main className="relative z-10">
                {/* ── Header ──────────────────────────────────────────────────────── */}
                <header className="py-8 px-6 max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-neon-500/20 flex items-center justify-center border border-neon-500/30 group-hover:bg-neon-500/30 transition-all duration-300">
                            <Zap className="w-6 h-6 text-neon-400" />
                        </div>
                        <span className="font-bold text-xl tracking-tight uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Sentinnelle IA
                        </span>
                    </Link>
                    <div className="hidden md:block">
                        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
                        </Link>
                    </div>
                </header>

                {/* ── Hero + Form ─────────────────────────────────────────────────── */}
                <section
                    aria-label="Inscrição para Mentoria Gratuita"
                    className="pt-8 md:pt-16 pb-24 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start"
                >
                    {/* Left: Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-500/10 border border-neon-500/20 text-neon-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Star className="w-3 h-3 fill-neon-400" />
                            Inscrições Abertas — Vagas Limitadas
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                            Domine o Código com{' '}
                            <span className="text-neon-500">IA Generativa</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
                            Pare de lutar com a sintaxe e comece a construir o futuro. Mentoria 100% prática
                            focada em{' '}
                            <span className="text-white font-semibold underline decoration-neon-500">
                                Vibe Coding
                            </span>{' '}
                            e agentes inteligentes.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-5 mb-10">
                            {[
                                'Aulas 100% ao vivo via Google Meet',
                                'Do setup ao deploy na Vercel',
                                '10 principais provedoras de cloud',
                                'Projetos Reais NVIDIA & Google',
                                'Garantia de 24h após aula apresentação',
                                'Material de Apoio Completo',
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-neon-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        id="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-card-strong p-8 md:p-10 rounded-3xl relative overflow-visible"
                    >
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-500/50 via-transparent to-blue-500/50 rounded-3xl -z-10 blur-sm opacity-50" />

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10" noValidate>
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold mb-1">Garantir Minha Vaga</h2>
                                    <p className="text-gray-400 text-sm">
                                        Preencha abaixo para agendar sua{' '}
                                        <span className="text-neon-400 font-semibold">mentoria gratuita!</span>
                                    </p>
                                </div>

                                {/* Nome */}
                                <div>
                                    <label htmlFor="lead-nome" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
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
                                        aria-describedby={errors.nome ? 'lead-nome-error' : undefined}
                                    />
                                    {errors.nome && (
                                        <p id="lead-nome-error" className="text-red-400 text-xs mt-1">{errors.nome}</p>
                                    )}
                                </div>

                                {/* WhatsApp */}
                                <div>
                                    <label htmlFor="lead-whatsapp" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                                        WhatsApp (com DDD) *
                                    </label>
                                    <input
                                        id="lead-whatsapp"
                                        type="tel"
                                        required
                                        placeholder="(48) 99999-9999"
                                        value={formData.whatsapp}
                                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                                        onFocus={() => handleFocus('whatsapp')}
                                        className={inputClass('whatsapp')}
                                        aria-describedby={errors.whatsapp ? 'lead-whatsapp-error' : undefined}
                                    />
                                    {errors.whatsapp && (
                                        <p id="lead-whatsapp-error" className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="lead-email" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
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
                                        aria-describedby={errors.email ? 'lead-email-error' : undefined}
                                    />
                                    {errors.email && (
                                        <p id="lead-email-error" className="text-red-400 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Nível */}
                                <div>
                                    <label htmlFor="lead-nivel" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                                        Seu Nível em Programação
                                    </label>
                                    <select
                                        id="lead-nivel"
                                        value={formData.nivel}
                                        onChange={(e) => handleChange('nivel', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10 appearance-none cursor-pointer"
                                    >
                                        <option value="iniciante">Estou começando agora</option>
                                        <option value="intermediario">Já programo e quero dominar IA</option>
                                        <option value="avancado">Sou Sênior e busco especialização</option>
                                    </select>
                                </div>

                                {/* Mensagem */}
                                <div>
                                    <label htmlFor="lead-mensagem" className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                                        Mensagem / Dúvidas (opcional)
                                    </label>
                                    <textarea
                                        id="lead-mensagem"
                                        rows={3}
                                        placeholder="Ex: Quero entender como funciona a integração com GPT-4..."
                                        value={formData.mensagem}
                                        onChange={(e) => handleChange('mensagem', e.target.value)}
                                        onFocus={() => handleFocus('mensagem')}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-500/50 transition-all focus:bg-white/10 resize-none"
                                    />
                                    {errors.mensagem && (
                                        <p className="text-red-400 text-xs mt-1">{errors.mensagem}</p>
                                    )}
                                </div>

                                {sendError && (
                                    <p className="text-amber-400 text-xs bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                                        ⚠️ Seu contato foi salvo! Porém o email de notificação falhou (configure o EmailJS). Veja o dashboard.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    id="lead-submit-btn"
                                    disabled={loading}
                                    className="w-full bg-neon-500 hover:bg-neon-600 disabled:opacity-60 text-black font-extrabold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">ENVIANDO...</span>
                                    ) : (
                                        <>DESTRAVAR MEU ACESSO <Send className="w-5 h-5" /></>
                                    )}
                                </button>

                                <p className="text-[10px] text-center text-gray-500 leading-relaxed uppercase tracking-tighter">
                                    🔒 Seus dados estão seguros e seguem a LGPD. Ao enviar, você aceita nossa{' '}
                                    <a href="#" className="underline hover:text-gray-300 transition-colors">política de privacidade</a>.
                                </p>
                            </form>
                        ) : (
                            /* Success State */
                            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-24 h-24 bg-neon-500/20 rounded-full flex items-center justify-center border-4 border-neon-500"
                                >
                                    <CheckCircle className="w-12 h-12 text-neon-500" />
                                </motion.div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-2 text-neon-400 font-mono tracking-tighter">
                                        PROTOCOLO RECEBIDO ✅
                                    </h2>
                                    <p className="text-gray-300 max-w-xs mx-auto text-sm leading-relaxed">
                                        Seu contato foi registrado com sucesso! Verifique seu WhatsApp — nosso time
                                        entrará em contato em até 24h.
                                    </p>
                                </div>
                                <Link
                                    to="/"
                                    className="text-neon-500 hover:text-white underline text-sm font-mono tracking-widest uppercase transition-colors"
                                >
                                    ← Voltar ao Início
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </section>

                {/* ── Trust / Features Section ─────────────────────────────────────── */}
                <section aria-label="Diferenciais da Mentoria" className="py-20 px-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Shield className="w-8 h-8 text-neon-400" />,
                                    title: 'Mentoria Especializada',
                                    desc: 'Conteúdo validado pelas maiores tecnologias do mercado (NVIDIA Cloud & Google Devs).',
                                },
                                {
                                    icon: <Users className="w-8 h-8 text-neon-400" />,
                                    title: '+500 Alunos',
                                    desc: 'Turmas exclusivas com acompanhamento personalizado e foco em resultados concretos.',
                                },
                                {
                                    icon: <Zap className="w-8 h-8 text-neon-400" />,
                                    title: 'Resultado Imediato',
                                    desc: 'Foco em colocar sua primeira aplicação com IA no ar já na primeira semana.',
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="glass-card p-10 rounded-3xl border-white/5 hover:border-neon-500/30 transition-colors group"
                                >
                                    <div className="mb-5 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-neon-500/10 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">"{item.desc}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ─────────────────────────────────────────────────────────── */}
                <section aria-label="Perguntas Frequentes" className="py-20 px-6 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2 font-mono tracking-tighter">
                            PERGUNTAS <span className="text-neon-500">FREQUENTES</span>
                        </h2>
                        <p className="text-gray-400 text-sm">Tire suas dúvidas antes de se inscrever</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'Quais os pré-requisitos?',
                                a: 'Apenas um computador com acesso à internet que consiga rodar o VS Code. Isso é tudo! O curso é acessível para iniciantes.',
                            },
                            {
                                q: 'Como funciona o curso?',
                                a: 'Curso guiado passo a passo, desde a escolha do arsenal de ferramentas até o deploy na Vercel. Cobrimos as 10 principais provedoras de cloud e suas características.',
                            },
                            {
                                q: 'Vou aprender sobre LLMs?',
                                a: 'Sim, aprenderá a integrar GPT-4, Claude 3 e modelos Open Source da NVIDIA em suas aplicações reais.',
                            },
                            {
                                q: 'Tem garantia?',
                                a: 'Sim! Você tem 24 horas após a aula de apresentação para solicitar reembolso completo se não ficar satisfeito.',
                            },
                            {
                                q: 'As aulas são gravadas?',
                                a: 'Não, todas as aulas são 100% ao vivo via Google Meet, com interação em tempo real.',
                            },
                        ].map((item, idx) => (
                            <details
                                key={idx}
                                className="glass-card rounded-2xl group overflow-hidden border-white/5 transition-all duration-300 open:border-neon-500/40"
                            >
                                <summary className="p-6 cursor-pointer list-none flex justify-between items-center hover:bg-white/[0.02] font-semibold text-base text-gray-200">
                                    <span>{item.q}</span>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-open:rotate-90 transition-transform">
                                        <ArrowRight className="w-4 h-4 text-neon-500" />
                                    </div>
                                </summary>
                                <div className="px-6 pb-6 text-gray-400 leading-relaxed text-sm">{item.a}</div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ── Footer ─────────────────────────────────────────────────────── */}
                <footer className="py-16 border-t border-white/5 text-center px-6 bg-black/40">
                    <div className="mb-6 flex justify-center gap-4">
                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-neon-500 transition-colors cursor-pointer">
                            <Star className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-neon-500 transition-colors cursor-pointer">
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-neon-500 transition-colors cursor-pointer">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
                        © 2026 Sentinnelle IA. Desenvolvido para a revolução tecnológica.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-[10px] text-gray-600 uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-neon-400 transition-colors">Termos de Uso</a>
                        <a href="#" className="hover:text-neon-400 transition-colors">Política de Privacidade</a>
                        <a href="#" className="hover:text-neon-400 transition-colors">Cookies</a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LeadPage;
