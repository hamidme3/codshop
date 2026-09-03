'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Users, Search, Phone, Mail, MapPin, 
  ShoppingBag, MessageCircle, Heart, UserPlus, 
  Sparkles, ArrowUpRight 
} from 'lucide-react';
import { getCustomers, Customer } from '@/lib/backoffice';

function CustomersContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [customers, setCustomers] = useState<Customer[]>(getCustomers(storeSlug));
  const [activeTab, setActiveTab] = useState<'all' | 'returning' | 'active' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchesTab = activeTab === 'all' || c.status === activeTab;
    const matchesQuery = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-400" /> CRM & Gestion des Clients
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Visualisez votre base client marocaine, segmentez vos acheteurs et relancez-les par WhatsApp.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
          Base : <strong>778 clients enregistrés</strong>
        </div>
      </div>

      {/* 4 KPI Cards like SimWebShop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">778</div>
          <div className="text-[11px] text-slate-400">Clients ayant commandé</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Clients Actifs</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">350</div>
          <div className="text-[11px] text-slate-400">Commandes dans les 30 jours</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Nouveaux Clients</span>
            <UserPlus className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400">40</div>
          <div className="text-[11px] text-slate-400">Cette semaine</div>
        </div>

        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>Clients Fidèles (Répétition)</span>
            <Heart className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <div className="text-3xl font-black text-amber-400">200</div>
          <div className="text-[11px] text-amber-300">2+ commandes au compteur</div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
          {[
            { id: 'all', label: 'Tous les clients' },
            { id: 'returning', label: 'Fidèles (VIP)' },
            { id: 'active', label: 'Actifs' },
            { id: 'new', label: 'Nouveaux' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, téléphone, ville..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50 font-semibold">
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Coordonnées</th>
                <th className="py-3.5 px-4">Ville</th>
                <th className="py-3.5 px-4">Commandes</th>
                <th className="py-3.5 px-4">Total Dépensé</th>
                <th className="py-3.5 px-4">Panier Moyen</th>
                <th className="py-3.5 px-4 text-right">Relance WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((c) => {
                const rawPhone = c.phone.replace(/[^0-9]/g, '');
                const waNumber = rawPhone.startsWith('0') ? `212${rawPhone.slice(1)}` : rawPhone;
                const waMsg = encodeURIComponent(
                  `Salam ${c.name}, m3ak la boutique ${storeSlug.toUpperCase()}. 3ndna nouvelle collection w remise exclusive de -20% pour nos clients fidèles de ${c.city} !`
                );

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                        {c.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          c.status === 'returning' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {c.status === 'returning' ? 'Client Fidèle' : c.status}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-semibold">{c.phone}</div>
                      <div className="text-[11px] text-slate-500">{c.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-white">
                      {c.city}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      {c.totalOrders} commande(s)
                      <div className="text-[10px] text-slate-400 font-normal">Dernière: {c.lastOrderDate}</div>
                    </td>

                    <td className="py-3.5 px-4 font-black text-amber-400 text-sm">
                      {c.totalSpend} DH
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {c.averageBasket} DH
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/${waNumber}?text=${waMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-[11px] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Relancer</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement du CRM...</div>}>
      <CustomersContent />
    </Suspense>
  );
}
