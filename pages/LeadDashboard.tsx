import { GoogleLogin } from '@react-oauth/google';
import { AnimatePresence, motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Download,
    Filter,
    Inbox,
    LogOut,
    Mail,
    Phone,
    RefreshCcw,
    ShieldCheck,
    Trash2,
    Users
} from 'lucide-react';
import { useEffect, useMemo, useState, type FC } from 'react';
import { Link } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Lead {
    id: string;
    nome: string;
    email: string;
    whatsapp: string;
    nivel: string;
    mensagem: string;
    timestamp: string;
    status: 'Pendente' | 'Atendido';
    origem?: string;
}

type Filter = 'todos' | 'pendentes' | 'atendidos';

const AUTH_TOKEN_KEY = 'sentinnellia_dash_auth_token';
const LEADS_KEY = 'sentinnellia_leads';
const ADMIN_EMAIL = 'sentinnellia@gmail.com';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isPending24h(lead: Lead): boolean {
    if (lead.status !== 'Pendente') return false;
    const diff = Date.now() - new Date(lead.timestamp).getTime();
    return diff > 24 * 60 * 60 * 1000;
}

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function downloadCSV(leads: Lead[]) {
    const header = 'ID,Nome,Email,WhatsApp,Nível,Mensagem,Data/Hora,Status,Origem\n';
    const rows = leads.map(l =>
        [l.id, l.nome, l.email, l.whatsapp, l.nivel,
        `"${l.mensagem?.replace(/"/g, '""') ?? ''}"`, fmtDate(l.timestamp), l.status, l.origem ?? 'formulario']
            .join(',')
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_sentinnellia_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
}

// ─── Google Auth Gate ─────────────────────────────────────────────────────────
const GoogleAuthGate: FC<{ onAuth: () => void }> = ({ onAuth }) => {
    const handleGoogleSuccess = (credentialResponse: any) => {
        try {
            const decoded: any = jwtDecode(credentialResponse.credential);
            if (decoded.email === ADMIN_EMAIL) {
                localStorage.setItem(AUTH_TOKEN_KEY, credentialResponse.credential);
                onAuth();
            } else {
                alert(`Acesso Negado: O email ${decoded.email} não tem permissão de administrador.`);
            }
        } catch (err) {
            console.error('Auth Error:', err);
            alert('Erro na autenticação. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-strong p-10 rounded-3xl w-full max-w-sm text-center"
            >
                <div className="w-16 h-16 bg-neon-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neon-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <ShieldCheck className="w-8 h-8 text-neon-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Sentinnelle Dashboard</h1>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Login restrito ao administrador<br /><span className="text-neon-400/60 font-mono text-xs">sentinnellia@gmail.com</span></p>

                <div className="flex justify-center mb-8">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => alert('Falha no login do Google.')}
                        useOneTap
                        theme="filled_black"
                        shape="pill"
                        text="signin_with"
                    />
                </div>

                <Link
                    to="/"
                    className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                    ← Voltar ao Início
                </Link>
            </motion.div>
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const LeadDashboard: FC = () => {
    const [authed, setAuthed] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filter, setFilter] = useState<Filter>('todos');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Dashboard de Leads | Sentinnelle IA';
        if (localStorage.getItem(AUTH_TOKEN_KEY)) setAuthed(true);
    }, []);

    useEffect(() => {
        if (authed) {
            const raw = localStorage.getItem(LEADS_KEY);
            setLeads(raw ? JSON.parse(raw) : []);
        }
    }, [authed]);

    const overdue = useMemo(() => leads.filter(isPending24h), [leads]);
    const pending = useMemo(() => leads.filter(l => l.status === 'Pendente'), [leads]);
    const attended = useMemo(() => leads.filter(l => l.status === 'Atendido'), [leads]);

    const filtered = useMemo(() => {
        if (filter === 'pendentes') return pending;
        if (filter === 'atendidos') return attended;
        return [...leads].reverse(); // newest first
    }, [filter, leads, pending, attended]);

    const markAtendido = (id: string) => {
        const updated = leads.map(l =>
            l.id === id ? { ...l, status: 'Atendido' as const } : l
        );
        setLeads(updated);
        localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    };

    const deleteLead = (id: string) => {
        if (!confirm('Remover este lead permanentemente?')) return;
        const updated = leads.filter(l => l.id !== id);
        setLeads(updated);
        localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
    };

    const refresh = () => {
        const raw = localStorage.getItem(LEADS_KEY);
        setLeads(raw ? JSON.parse(raw) : []);
    };

    const handleLogout = () => {
        if (!confirm('Deseja sair do painel?')) return;
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthed(false);
    };

    if (!authed) return <GoogleAuthGate onAuth={() => setAuthed(true)} />;

    return (
        <div className="min-h-screen bg-dark-950 text-white font-sans px-4 py-8 md:px-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 bg-neon-500/20 rounded-xl flex items-center justify-center border border-neon-500/30">
                                <Inbox className="w-5 h-5 text-neon-400" />
                            </div>
                            <h1 className="text-2xl font-bold">Dashboard de Leads</h1>
                        </div>
                        <p className="text-gray-400 text-sm ml-[52px]">Sentinnelle IA · Gestão de Contatos</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={refresh}
                            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl hover:border-white/30 text-gray-300 hover:text-white transition-all text-sm"
                        >
                            <RefreshCcw size={15} /> Atualizar
                        </button>
                        <button
                            onClick={() => downloadCSV(leads)}
                            className="flex items-center gap-2 px-4 py-2 bg-neon-500/10 border border-neon-500/30 hover:bg-neon-500/20 text-neon-400 rounded-xl transition-all text-sm font-medium"
                        >
                            <Download size={15} /> Exportar CSV
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
                        >
                            <LogOut size={15} /> Sair
                        </button>
                    </div>
                </div>

                {/* 24h Alert Banner */}
                <AnimatePresence>
                    {overdue.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex items-center gap-3"
                        >
                            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-amber-300 text-sm">
                                    ⚠️ {overdue.length} lead{overdue.length > 1 ? 's' : ''} pendente{overdue.length > 1 ? 's' : ''} há mais de 24 horas!
                                </p>
                                <p className="text-amber-400/70 text-xs mt-0.5">
                                    Ação imediata recomendada — entre em contato para não perder oportunidades.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total de Leads', value: leads.length, icon: <Users size={18} className="text-neon-400" />, color: 'border-neon-500/20' },
                        { label: 'Pendentes', value: pending.length, icon: <Clock size={18} className="text-amber-400" />, color: 'border-amber-500/20' },
                        { label: 'Atendidos', value: attended.length, icon: <CheckCircle2 size={18} className="text-green-400" />, color: 'border-green-500/20' },
                    ].map((s, i) => (
                        <div key={i} className={`glass-card rounded-2xl p-4 border ${s.color}`}>
                            <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs">{s.icon}{s.label}</div>
                            <div className="text-3xl font-bold text-white">{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['todos', 'pendentes', 'atendidos'] as Filter[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f
                                ? 'bg-neon-500 text-black font-bold'
                                : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                                }`}
                        >
                            <Filter size={12} className="inline mr-1.5" />
                            {f} {f === 'todos' ? `(${leads.length})` : f === 'pendentes' ? `(${pending.length})` : `(${attended.length})`}
                        </button>
                    ))}
                </div>

                {/* Lead Table / Cards */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-600">
                        <Inbox size={48} className="mx-auto mb-4 opacity-30" />
                        <p>Nenhum lead encontrado nesta categoria.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((lead) => {
                            const isOver = isPending24h(lead);
                            const isExpanded = expanded === lead.id;
                            return (
                                <motion.div
                                    key={lead.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`glass-card rounded-2xl overflow-hidden transition-all ${isOver ? 'border-amber-500/40' : 'border-white/5'}`}
                                >
                                    {/* Summary Row */}
                                    <div
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 cursor-pointer hover:bg-white/[0.02]"
                                        onClick={() => setExpanded(isExpanded ? null : lead.id)}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 bg-neon-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-neon-500/20">
                                                <span className="text-neon-400 font-bold text-sm">
                                                    {lead.nome.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-white text-sm truncate">{lead.nome}</p>
                                                <p className="text-gray-400 text-xs truncate flex items-center gap-1">
                                                    <Mail size={10} /> {lead.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                                                <Clock size={10} /> {fmtDate(lead.timestamp)}
                                            </span>
                                            {isOver && (
                                                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                                    +24h
                                                </span>
                                            )}
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${lead.status === 'Pendente'
                                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-5 border-t border-white/5 pt-4 grid sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2 text-sm">
                                                        <p className="text-gray-400"><span className="text-gray-500">WhatsApp:</span> {lead.whatsapp || '—'}</p>
                                                        <p className="text-gray-400"><span className="text-gray-500">Nível:</span> {lead.nivel}</p>
                                                        <p className="text-gray-400"><span className="text-gray-500">Origem:</span> {lead.origem ?? 'formulario'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Mensagem</p>
                                                        <p className="text-gray-300 text-sm bg-black/30 rounded-lg p-3 leading-relaxed">
                                                            {lead.mensagem || '—'}
                                                        </p>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
                                                        {lead.status === 'Pendente' && (
                                                            <button
                                                                onClick={() => markAtendido(lead.id)}
                                                                id={`mark-attended-${lead.id}`}
                                                                className="flex items-center gap-2 bg-neon-500 hover:bg-neon-600 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                                                            >
                                                                <CheckCircle2 size={14} /> Marcar como Atendido
                                                            </button>
                                                        )}
                                                        <a
                                                            href={`mailto:${lead.email}`}
                                                            className="flex items-center gap-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs px-4 py-2.5 rounded-xl transition-all"
                                                        >
                                                            <Mail size={14} /> Enviar Email
                                                        </a>
                                                        {lead.whatsapp && (
                                                            <a
                                                                href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs px-4 py-2.5 rounded-xl transition-all"
                                                            >
                                                                <Phone size={14} /> WhatsApp
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => deleteLead(lead.id)}
                                                            className="flex items-center gap-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs px-4 py-2.5 rounded-xl transition-all ml-auto"
                                                        >
                                                            <Trash2 size={14} /> Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadDashboard;
