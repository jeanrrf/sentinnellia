import emailjs from '@emailjs/browser';

export const OFFICIAL_CONTACT = {
  name: 'Jean Rosso',
  company: 'Sentinnelle IA',
  whatsappNumber: '5548991937304',
  whatsappDisplay: '+55 (48) 99193-7304',
  email: 'sentinnellia@gmail.com',
  adminEmails: ['sentinnellia@gmail.com', 'rosso.jeandasilva@gmail.com'],
};

export const EMAILJS_CONFIG = {
  serviceId: 'service_0payg1q',
  templateId: 'template_p7pweto',
  publicKey: 'Yf8WAs62wX91bK8qh',
};

export const LEADS_STORAGE_KEY = 'sentinnellia_leads';

export interface LeadPayload {
  nome: string;
  email: string;
  whatsapp: string;
  nivel?: string;
  mensagem?: string;
  origem?: string;
}

export interface LeadItem extends LeadPayload {
  id: string;
  timestamp: string;
  status: 'Pendente' | 'Atendido';
  origem: string;
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function formatWhatsAppMessage(payload: LeadPayload): string {
  const parts = [
    `*Olá Jean! Novo contato via Sentinnelle IA* 🚀`,
    ``,
    `*Nome:* ${payload.nome.trim()}`,
    `*WhatsApp:* ${payload.whatsapp.trim()}`,
    `*Email:* ${payload.email.trim()}`,
  ];

  if (payload.nivel && payload.nivel !== 'desconhecido') {
    parts.push(`*Nível / Perfil:* ${payload.nivel}`);
  }

  if (payload.origem) {
    parts.push(`*Origem:* ${payload.origem}`);
  }

  if (payload.mensagem && payload.mensagem.trim()) {
    parts.push(``, `*Mensagem:*`, payload.mensagem.trim());
  }

  return parts.join('\n');
}

export function getWhatsAppDirectUrl(customText?: string): string {
  const text = customText || 'Olá Jean! Gostaria de saber mais sobre a Mentoria Sentinnelle IA e o ecossistema de soluções.';
  return `https://wa.me/${OFFICIAL_CONTACT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function getLeadWhatsAppUrl(payload: LeadPayload): string {
  const msg = formatWhatsAppMessage(payload);
  return `https://wa.me/${OFFICIAL_CONTACT.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export function getLeadMailtoUrl(payload: LeadPayload): string {
  const subject = `[Sentinnelle IA] Novo Lead - ${payload.nome}`;
  const body = `Nome: ${payload.nome}\nEmail: ${payload.email}\nWhatsApp: ${payload.whatsapp}\nNível: ${payload.nivel || 'N/A'}\nOrigem: ${payload.origem || 'Website'}\n\nMensagem:\n${payload.mensagem || '—'}`;
  return `mailto:${OFFICIAL_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getStoredLeads(): LeadItem[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLead(payload: LeadPayload): LeadItem {
  const currentLeads = getStoredLeads();
  const id = `LEAD-${Date.now()}`;
  const newLead: LeadItem = {
    id,
    nome: payload.nome.trim(),
    email: payload.email.trim(),
    whatsapp: payload.whatsapp.trim(),
    nivel: payload.nivel || 'iniciante',
    mensagem: payload.mensagem?.trim() || '',
    timestamp: new Date().toISOString(),
    status: 'Pendente',
    origem: payload.origem || 'formulario_principal',
  };

  currentLeads.unshift(newLead);
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(currentLeads));

  // Dispatch custom event to notify any open dashboard or listeners in the app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sentinnellia:lead_saved', { detail: newLead }));
  }

  return newLead;
}

export async function syncLeadEmail(payload: LeadPayload): Promise<boolean> {
  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        from_name: payload.nome,
        from_email: payload.email,
        whatsapp: payload.whatsapp,
        nivel: payload.nivel || 'Geral',
        mensagem: payload.mensagem || '(Contato captado via site)',
        data_hora: new Date().toLocaleString('pt-BR'),
      },
      EMAILJS_CONFIG.publicKey
    );
    return true;
  } catch (err) {
    console.warn('[Sentinnelle LeadSync] EmailJS warning:', err);
    return false;
  }
}
