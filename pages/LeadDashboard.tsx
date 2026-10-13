import { GoogleLogin } from '@react-oauth/google';
import { AnimatePresence, motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import {
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
import {
  LEADS_STORAGE_KEY,
  OFFICIAL_CONTACT,
  cleanPhoneNumber,
  getStoredLeads,
  type LeadItem
} from '../utils/leadSync';
import { LogoEmblem } from '../components/Logo';

type FilterType = 'todos' | 'pendentes' | 'atendidos';

const AUTH_TOKEN_KEY = 'sentinnellia_dash_auth_token';

function isPending24h(lead: LeadItem): boolean {
  if (lead.status !== 'Pendente') return false;
  const diff = Date.now() - new Date(lead.timestamp).getTime();
  return diff > 24 * 60 * 60 * 1000;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function downloadCSV(leads: LeadItem[]) {
  const header = 'ID,Nome,Email,WhatsApp,Nível,Mensagem,Data/Hora,Status,Origem\n';
  const rows = leads.map((l) =>
    [
      l.id,
      `"${l.nome.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.whatsapp.replace(/"/g, '""')}"`,
      `"${l.nivel || ''}"`,
      `"${(l.mensagem || '').replace(/"/g, '""')}"`,
      fmtDate(l.timestamp),
      l.status,
      l.origem || 'formulario',
    ].join(',')
  ).join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads_sentinnellia_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// Google Auth Gate
const GoogleAuthGate: FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const email = (decoded?.email || '').toLowerCase();
      const isAuthorized = OFFICIAL_CONTACT.adminEmails.some(
        (adminEmail) => adminEmail.toLowerCase() === email
      );

      if (isAuthorized) {
        localStorage.setItem(AUTH_TOKEN_KEY, credentialResponse.credential);
        onAuth();
      } else {
        alert(
          `Acesso Negado: O email ${decoded.email} não está na lista de administradores autorizados (${OFFICIAL_CONTACT.adminEmails.join(', ')}).`
        );
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
        className="glass-card-strong p-10 rounded-3xl w-full max-w-sm text-center border border-neon-500/30"
      >
        <div className="flex justify-center mx-auto mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-cyan-400/30 shadow-[0_0_25px_rgba(0,229,255,0.25)]">
            <LogoEmblem size={52} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Sentinnelle Dashboard</h1>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Painel de Leads & Contatos Sincronizados.<br />
          <span className="text-cyan-400 font-mono text-xs block mt-2">
            Acesso Restrito: Jean Rosso
          </span>
        </p>

        <div className="flex justify-center mb-8">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Falha no login do Google.')}
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

// Main Dashboard
const LeadDashboard: FC = () => {
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Dashboard de Leads Sincronizados | Sentinnelle IA';
    if (localStorage.getItem(AUTH_TOKEN_KEY)) {
      setAuthed(true);
    }
  }, []);

  const reloadLeads = () => {
    setLeads(getStoredLeads());
  };

  useEffect(() => {
    if (authed) {
      reloadLeads();

      const handleStorageUpdate = () => {
        reloadLeads();
      };

      window.addEventListener('sentinnellia:lead_saved', handleStorageUpdate);
      window.addEventListener('storage', handleStorageUpdate);

      return () => {
        window.removeEventListener('sentinnellia:lead_saved', handleStorageUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    }
  }, [authed]);

  const overdue = useMemo(() => leads.filter(isPending24h), [leads]);
  const pending = useMemo(() => leads.filter((l) => l.status === 'Pendente'), [leads]);
  const attended = useMemo(() => leads.filter((l) => l.status === 'Atendido'), [leads]);

  const filtered = useMemo(() => {
    if (filter === 'pendentes') return pending;
    if (filter === 'atendidos') return attended;
    return leads;
  }, [filter, leads, pending, attended]);

  const markAtendido = (id: string) => {
    const updated = leads.map((l) =>
      l.id === id ? { ...l, status: 'Atendido' as const } : l
    );
    setLeads(updated);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteLead = (id: string) => {
    if (!confirm('Remover este lead permanentemente?')) return;
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleLogout = () => {
    if (!confirm('Deseja sair do painel?')) return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthed(false);
  };

  if (!authed) return <GoogleAuthGate onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans px-4 py-8 md:px-10">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <LogoEmblem size={28} />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Painel de Leads <span className="text-cyan-400">Sentinnelle IA</span>
            </h1>
          </div>
          <p className="text-gray-400 text-xs font-mono mt-1">
            Sincronização em Tempo Real · WhatsApp: {OFFICIAL_CONTACT.whatsappDisplay} · E-mail: {OFFICIAL_CONTACT.email}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-white px-3 py-2 rounded-xl bg-white/5 border border-white/10 transition-colors"
          >
            Ver Site
          </Link>

          <button
            onClick={reloadLeads}
            className="flex items-center gap-2 text-xs text-neon-400 hover:text-white px-3 py-2 rounded-xl bg-neon-500/10 border border-neon-500/20 hover:bg-neon-500/20 transition-all"
            title="Atualizar lista"
          >
            <RefreshCcw size={14} /> Atualizar
          </button>

          <button
            onClick={() => downloadCSV(leads)}
            disabled={leads.length === 0}
            className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white px-4 py-2 rounded-xl border border-white/10 transition-all"
          >
            <Download size={14} /> Exportar CSV
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 transition-all"
            title="Sair"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5 rounded-2xl border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Total Captado</span>
            <Users size={16} className="text-neon-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">{leads.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Pendentes</span>
            <Clock size={16} className="text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-400 font-mono">{pending.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Atendidos</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-mono">{attended.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Urgentes (&gt;24h)</span>
            <span className="text-amber-400 text-xs font-bold">⚠️</span>
          </div>
          <div className="text-3xl font-bold text-amber-400 font-mono">{overdue.length}</div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500 uppercase tracking-wider font-mono mr-2">Filtro:</span>
          {(['todos', 'pendentes', 'atendidos'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-neon-500 text-black font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {f} ({f === 'todos' ? leads.length : f === 'pendentes' ? pending.length : attended.length})
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center border-dashed border-white/10">
            <Inbox size={40} className="mx-auto text-gray-600 mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Nenhum Lead Encontrado</h3>
            <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
              Os contatos preenchidos no formulário da mentoria, pop-up de saída e modais de contato aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead) => {
              const isExpanded = expanded === lead.id;
              const isOver = isPending24h(lead);
              const cleanDigits = cleanPhoneNumber(lead.whatsapp);
              const waLink = cleanDigits
                ? `https://wa.me/55${cleanDigits}?text=${encodeURIComponent(
                    `Olá ${lead.nome}! Aqui é o Jean da Sentinnelle IA a respeito da sua solicitação no site.`
                  )}`
                : '';

              return (
                <motion.div
                  key={lead.id}
                  layout
                  className={`glass-card rounded-2xl overflow-hidden transition-all ${
                    isOver ? 'border-amber-500/40' : 'border-white/5'
                  }`}
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
                      <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap font-mono">
                        <Clock size={10} /> {fmtDate(lead.timestamp)}
                      </span>
                      {isOver && (
                        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          +24h
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          lead.status === 'Pendente'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}
                      >
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
                            <p className="text-gray-400">
                              <span className="text-gray-500">WhatsApp:</span>{' '}
                              <strong className="text-white">{lead.whatsapp || '—'}</strong>
                            </p>
                            <p className="text-gray-400">
                              <span className="text-gray-500">Nível:</span> {lead.nivel || 'N/A'}
                            </p>
                            <p className="text-gray-400">
                              <span className="text-gray-500">Origem:</span> {lead.origem || 'formulario'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider font-mono">
                              Mensagem do Lead
                            </p>
                            <p className="text-gray-300 text-sm bg-black/40 rounded-xl p-3 leading-relaxed border border-white/5">
                              {lead.mensagem || '—'}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="sm:col-span-2 flex flex-wrap gap-2.5 pt-2">
                            {lead.status === 'Pendente' && (
                              <button
                                onClick={() => markAtendido(lead.id)}
                                className="flex items-center gap-2 bg-neon-500 hover:bg-neon-600 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                              >
                                <CheckCircle2 size={14} /> Marcar como Atendido
                              </button>
                            )}

                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              >
                                <Phone size={14} /> Iniciar Conversa no WhatsApp
                              </a>
                            )}

                            <a
                              href={`mailto:${lead.email}?subject=Mentoria%20Sentinnelle%20IA%20-%20Contato`}
                              className="flex items-center gap-2 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs px-4 py-2.5 rounded-xl transition-all"
                            >
                              <Mail size={14} /> Enviar E-mail
                            </a>

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
