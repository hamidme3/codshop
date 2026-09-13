'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Plus, Clock, CheckCircle, AlertCircle, 
  MessageCircle, ExternalLink, ShieldCheck, ChevronRight,
  Filter, Search, ArrowUpRight, LifeBuoy
} from 'lucide-react';

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  latestMessage: string;
  messageCount: number;
}

const DEPARTMENT_LABELS: Record<string, { label: string; color: string }> = {
  cod_orders: { label: 'Commandes COD & Livraisons', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  theme_builder: { label: 'Thème & Page Builder', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  pixels_ads: { label: 'Pixels & Publicités', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  billing: { label: 'Facturation & Abonnements', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  technical: { label: 'Support Technique & API', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  open: { label: 'Ouvert', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  in_progress: { label: 'En cours', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  waiting_merchant: { label: 'En attente de votre réponse', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  closed: { label: 'Résolu', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: 'Faible', color: 'text-slate-400' },
  normal: { label: 'Normale', color: 'text-blue-400' },
  urgent: { label: 'Urgente 🔥', color: 'text-rose-400 font-semibold' },
};

export default function SupportDeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New ticket modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('cod_orders');
  const [priority, setPriority] = useState('normal');
  const [message, setMessage] = useState('');

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      if (data.tickets) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('[Support Desk] Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          department,
          priority,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du ticket');
      }

      // Reset form & reload
      setSubject('');
      setMessage('');
      setShowModal(false);
      await loadTickets();
    } catch (err: any) {
      setFormError(err.message || 'Impossible de créer le ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const openCount = tickets.filter((t) => t.status !== 'closed').length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <LifeBuoy className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Support & Assistance Marchand</h1>
          </div>
          <p className="text-sm text-slate-400">
            Équipe de support dédiée aux e-commerçants marocains — Casablanca & Rabat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau Ticket
          </button>
        </div>
      </div>

      {/* Quick Assist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* WhatsApp VIP */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                VIP Concierge
              </span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              WhatsApp Dédié 7j/7
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Assistance instantanée en Darija / Français de 09h00 à 21h00 pour vos urgences checkout et livreurs.
            </p>
          </div>
          <a
            href="https://wa.me/212661234567?text=Bonjour%20Support%20CODShop,%20j%27ai%20besoin%20d%27assistance%20sur%20ma%20boutique"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
          >
            Contacter sur WhatsApp
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* SLA Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Temps de Réponse
              </span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Garantie &lt; 15 Minutes</h3>
            <p className="text-xs text-slate-400 mb-2">
              Nos spécialistes e-commerce traitent vos tickets techniques et configurations en priorité.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Disponibilité</span>
            <span className="text-emerald-400 font-medium">99.9% Opérationnel</span>
          </div>
        </div>

        {/* Active Tickets Stat */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Vos Dossiers
              </span>
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{openCount}</h3>
            <p className="text-xs text-slate-400">
              {openCount === 0 ? 'Aucun ticket en attente.' : `${openCount} ticket(s) actuellement ouvert(s).`}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total Historique</span>
            <span className="text-white font-medium">{tickets.length} ticket(s)</span>
          </div>
        </div>
      </div>

      {/* Tickets List Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
            {['all', 'open', 'in_progress', 'waiting_merchant', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  filterStatus === status
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {status === 'all' ? 'Tous les tickets' : STATUS_LABELS[status]?.label || status}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par numéro ou sujet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent mb-3" />
            <p>Chargement de vos tickets de support...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">Aucun ticket trouvé</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
              Vous n’avez aucune demande en cours dans cette catégorie. Si vous avez une question, ouvrez un ticket ou écrivez-nous sur WhatsApp.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Créer mon premier ticket
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredTickets.map((t) => {
              const dept = DEPARTMENT_LABELS[t.department] || { label: t.department, color: 'bg-slate-700 text-slate-300' };
              const stat = STATUS_LABELS[t.status] || { label: t.status, badge: 'bg-slate-700 text-slate-300' };
              const prio = PRIORITY_LABELS[t.priority] || { label: t.priority, color: 'text-slate-400' };

              return (
                <Link
                  key={t.id}
                  href={`/admin/support/tickets/${t.id}`}
                  className="p-4 hover:bg-slate-800/40 transition flex items-center justify-between gap-4 block"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-emerald-400 font-semibold">{t.ticketNumber}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${dept.color}`}>
                        {dept.label}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border ${stat.badge}`}>
                        {stat.label}
                      </span>
                      <span className={`text-xs ${prio.color}`}>
                        Priorité: {prio.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate">{t.subject}</h4>
                    {t.latestMessage && (
                      <p className="text-xs text-slate-400 truncate max-w-2xl">
                        {t.latestMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 text-right">
                    <div className="hidden sm:block">
                      <div className="text-xs text-slate-400">
                        {new Date(t.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {t.messageCount} message(s)
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Ouvrir un Nouveau Ticket</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Sujet de votre demande *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Problème d'attribution Pixel Facebook ou livraison Ozon"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Département *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cod_orders">Commandes & Livraisons COD</option>
                    <option value="pixels_ads">Pixels & Publicités (Meta/TikTok)</option>
                    <option value="theme_builder">Thème & Checkout</option>
                    <option value="billing">Facturation & Abonnement</option>
                    <option value="technical">Support Technique Général</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Priorité *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="low">Faible (Question générale)</option>
                    <option value="normal">Normale (Configuration)</option>
                    <option value="urgent">Urgente 🔥 (Blocage tunnel)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description détaillée *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Expliquez en détail votre situation (liens, commandes concernées, captures d'écran, etc.)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  {submitting ? 'Envoi en cours...' : 'Soumettre le ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
