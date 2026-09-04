'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Send, CheckCircle, AlertCircle, ShieldAlert,
  Clock, LifeBuoy, CheckCircle2, Lock, User, Headset
} from 'lucide-react';

interface Message {
  id: string;
  senderType: 'merchant' | 'support_staff' | 'system';
  message: string;
  attachments: any[];
  createdAt: string;
}

interface TicketDetail {
  id: string;
  ticketNumber: string;
  subject: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

const DEPARTMENT_LABELS: Record<string, string> = {
  cod_orders: 'Commandes COD & Livraisons',
  theme_builder: 'Thème & Page Builder',
  pixels_ads: 'Pixels & Publicités',
  billing: 'Facturation & Abonnements',
  technical: 'Support Technique & API',
};

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  open: { label: 'Ouvert', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  in_progress: { label: 'En cours de traitement', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  waiting_merchant: { label: 'En attente de votre réponse', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  closed: { label: 'Résolu / Clôturé', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export default function TicketConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/support/tickets/${ticketId}`);
      const data = await res.json();
      if (!res.ok || !data.ticket) {
        throw new Error(data.error || 'Impossible de trouver ce ticket');
      }
      setTicket(data.ticket);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l envoi');
      }

      setReplyText('');
      await loadTicket();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l envoi de votre réponse');
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!confirm('Êtes-vous sûr de vouloir marquer ce ticket comme résolu ?')) return;

    setClosing(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/close`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Impossible de fermer le ticket');
      }
      await loadTicket();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la fermeture');
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent mb-3" />
        <p className="text-sm">Chargement du fil de discussion...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Ticket introuvable</h2>
        <p className="text-sm text-slate-400">{error || 'Ce ticket n existe pas ou a été supprimé.'}</p>
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au support
        </Link>
      </div>
    );
  }

  const stat = STATUS_LABELS[ticket.status] || { label: ticket.status, badge: 'bg-slate-700 text-slate-300' };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top navigation & actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à tous les tickets
        </Link>

        {ticket.status !== 'closed' && (
          <button
            onClick={handleCloseTicket}
            disabled={closing}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 rounded-lg text-xs font-medium transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {closing ? 'Clôture en cours...' : 'Marquer comme Résolu'}
          </button>
        )}
      </div>

      {/* Ticket Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
            {ticket.ticketNumber}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {DEPARTMENT_LABELS[ticket.department] || ticket.department}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${stat.badge}`}>
            {stat.label}
          </span>
          <span className="text-xs text-slate-400 ml-auto">
            Créé le {new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">{ticket.subject}</h1>
      </div>

      {/* Messages Thread */}
      <div className="space-y-4">
        {ticket.messages && ticket.messages.map((msg) => {
          const isMerchant = msg.senderType === 'merchant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${isMerchant ? 'justify-end' : 'justify-start'}`}
            >
              {!isMerchant && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0 mt-1">
                  <Headset className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-2 text-sm ${
                  isMerchant
                    ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-100 rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className={`font-semibold ${isMerchant ? 'text-emerald-400' : 'text-blue-400'}`}>
                    {isMerchant ? 'Vous (Marchand)' : 'Support CODShop Maroc'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>
              </div>

              {isMerchant && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reply Box */}
      {ticket.status === 'closed' ? (
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          Ce ticket est clôturé. Pour toute nouvelle demande, veuillez ouvrir un nouveau ticket.
        </div>
      ) : (
        <form onSubmit={handleSendReply} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Votre Réponse
          </label>
          <textarea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Écrivez votre message ou précisions supplémentaires..."
            className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Réponse moyenne par nos agents : &lt; 15 min.
            </span>
            <button
              type="submit"
              disabled={sending || !replyText.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Envoi...' : 'Envoyer la réponse'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
