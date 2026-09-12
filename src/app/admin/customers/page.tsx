'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Users, Search, Phone, Mail, MapPin, 
  ShoppingBag, MessageCircle, Heart, UserPlus, 
  Sparkles, ArrowUpRight, CheckCircle2, Truck, DollarSign,
  AlertTriangle, ChevronRight, X, Clock, RefreshCw, Package
} from 'lucide-react';
import { getCustomers, Customer, OrderStatus } from '@/lib/backoffice';
import { normalizeMoroccanPhone } from '@/lib/whatsapp-templates';

function getContextualWhatsAppUrl(customer: Customer, storeSlug: string): string {
  const waPhone = normalizeMoroccanPhone(customer.phone);

  const storeName = storeSlug.toUpperCase();
  const orderNum = customer.lastOrderNumber || 'votre commande';
  const totalVal = customer.recentOrders?.[0]?.total || customer.totalSpend || 0;
  const status = customer.lastOrderStatus;
  const courier = customer.recentOrders?.[0]?.courier || 'transporteur';
  const tracking = customer.lastTrackingNumber;

  let message = '';

  if (status === 'confirmed') {
    message = `Salam ${customer.name}, m3ak la boutique ${storeName}. Votre commande ${orderNum} de ${totalVal} DH est bien confirmée ! Notre équipe prépare actuellement votre colis pour expédition rapide à ${customer.city}.`;
  } else if (status === 'shipped' || status === 'shipping') {
    const trackingTxt = tracking ? ` (N° Suivi : ${tracking})` : '';
    message = `Salam ${customer.name}, votre colis ${orderNum} est expédié avec ${courier.toUpperCase()}${trackingTxt}. Le livreur va vous contacter très prochainement. Merci de bien vouloir préparer ${totalVal} DH en espèces à la livraison.`;
  } else if (status === 'delivered') {
    message = `Salam ${customer.name}, merci pour votre confiance ! Votre commande ${orderNum} a bien été livrée. Pour vous remercier de votre fidélité chez ${storeName}, profitez de -15% sur votre prochaine commande avec le code : VIP15 !`;
  } else if (status === 'returned' || status === 'canceled') {
    message = `Salam ${customer.name}, nous avons constaté que votre commande ${orderNum} n'a pas pu vous être remise par le livreur à ${customer.city} (Colis retourné). Souhaitez-vous reprogrammer votre livraison à une autre date ?`;
  } else {
    // new / to_confirm
    message = `Salam ${customer.name}, m3ak la boutique ${storeName}. Nous avons bien reçu votre commande ${orderNum} d'un montant de ${totalVal} DH. Confirmez-vous l'envoi à votre adresse à ${customer.city} ?`;
  }

  return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
}

function CustomersContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [customers, setCustomers] = useState<Customer[]>(() => getCustomers(storeSlug));
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'shipped' | 'delivered' | 'returning' | 'risk'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const refreshCustomers = () => {
    setCustomers(getCustomers(storeSlug));
  };

  // Real-time synchronization with order pipeline updates
  React.useEffect(() => {
    const handleSync = () => setCustomers(getCustomers(storeSlug));
    window.addEventListener('cod_orders_updated', handleSync);
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('cod_pipeline_sync');
      bc.onmessage = () => handleSync();
    } catch (_) {}

    return () => {
      window.removeEventListener('cod_orders_updated', handleSync);
      if (bc) bc.close();
    };
  }, [storeSlug]);

  // ── Dynamic KPIs calculated directly from synchronized store customers ──
  const totalCustomersCount = customers.length;
  const confirmedPipelineCount = customers.filter((c) => c.lastOrderStatus === 'confirmed' || (c.confirmedOrders || 0) > 0).length;
  const shippedPipelineCount = customers.filter((c) => ['shipped', 'shipping'].includes(c.lastOrderStatus || '') || (c.shippedOrders || 0) > 0).length;
  const deliveredPipelineCount = customers.filter((c) => c.lastOrderStatus === 'delivered' || (c.deliveredOrders || 0) > 0).length;
  const totalDeliveredRevenue = customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
  const vipCustomersCount = customers.filter((c) => c.status === 'returning' || (c.deliveredOrders || 0) >= 2).length;
  const riskCustomersCount = customers.filter((c) => c.status === 'risk' || (c.returnedOrders || 0) > 0).length;

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      let matchesTab = true;
      if (activeTab === 'confirmed') {
        matchesTab = c.lastOrderStatus === 'confirmed' || (c.confirmedOrders || 0) > 0;
      } else if (activeTab === 'shipped') {
        matchesTab = c.lastOrderStatus === 'shipped' || c.lastOrderStatus === 'shipping' || (c.shippedOrders || 0) > 0;
      } else if (activeTab === 'delivered') {
        matchesTab = c.lastOrderStatus === 'delivered' || (c.deliveredOrders || 0) > 0;
      } else if (activeTab === 'returning') {
        matchesTab = c.status === 'returning' || (c.deliveredOrders || 0) >= 2;
      } else if (activeTab === 'risk') {
        matchesTab = c.status === 'risk' || (c.returnedOrders || 0) > 0;
      }

      const q = searchQuery.toLowerCase();
      const matchesQuery = 
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.lastOrderNumber && c.lastOrderNumber.toLowerCase().includes(q)) ||
        (c.lastTrackingNumber && c.lastTrackingNumber.toLowerCase().includes(q)) ||
        c.email.toLowerCase().includes(q);

      return matchesTab && matchesQuery;
    });
  }, [customers, activeTab, searchQuery]);

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Relation Client & CRM</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-400 font-mono tabular-nums">{totalCustomersCount} profils acheteurs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-zinc-200" /> CRM & Profils Acheteurs
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Synchronisé avec vos 4 étapes : <span className="text-cyan-300 font-mono text-[11px]">1. Confirmée</span>, <span className="text-amber-300 font-mono text-[11px]">2. Expédiée</span>, <span className="text-emerald-300 font-mono text-[11px]">3. Livrée</span>, <span className="text-rose-300 font-mono text-[11px]">4. Retournée</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshCustomers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors shadow-sm"
            title="Rafraîchir les données CRM"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <div className="text-xs font-mono text-zinc-400 bg-[#121215] px-3 py-1.5 rounded-lg border border-zinc-800/80">
            Base active: <strong className="text-zinc-200 tabular-nums">{totalCustomersCount}</strong>
          </div>
        </div>
      </div>

      {/* 4 Synchronized KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Base */}
        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Total Clients CRM</span>
            <Users className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-white tracking-tight">{totalCustomersCount}</div>
          <div className="text-[11px] text-zinc-500">Identifiés par téléphone normalisé</div>
        </div>

        {/* 1. Confirmer (Cyan) */}
        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Étape 1 : Confirmées
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-white tracking-tight">{confirmedPipelineCount}</div>
          <div className="text-[11px] text-zinc-500">En cours de préparation / emballage</div>
        </div>

        {/* 2. Expédier (Amber) */}
        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Étape 2 : En Expédition
            </span>
            <Truck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-white tracking-tight">{shippedPipelineCount}</div>
          <div className="text-[11px] text-zinc-500">En cours d'acheminement transporteur</div>
        </div>

        {/* 3. Livrée & Cash Encaissé (Emerald) */}
        <div className="p-4 rounded-xl bg-[#121215] border border-zinc-800/80 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Étape 3 : Cash Encaissé
            </span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-emerald-400 tracking-tight">{totalDeliveredRevenue.toLocaleString()} MAD</div>
          <div className="text-[11px] text-zinc-500">{deliveredPipelineCount} client(s) ayant réglé le COD</div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#121215] border border-zinc-800/80 rounded-lg overflow-x-auto admin-scrollbar text-xs">
          {[
            { id: 'all', label: `Tous (${totalCustomersCount})` },
            { id: 'confirmed', label: `1. Confirmés (${confirmedPipelineCount})` },
            { id: 'shipped', label: `2. En Expédition (${shippedPipelineCount})` },
            { id: 'delivered', label: `3. Livrés (${deliveredPipelineCount})` },
            { id: 'returning', label: `Fidèles VIP (${vipCustomersCount})` },
            { id: 'risk', label: `Retours (${riskCustomersCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, téléphone, N° commande, suivi..."
            className="w-full bg-[#121215] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Synchronized Customers Table */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto admin-scrollbar">
          <table className="w-full text-left text-xs admin-table">
            <thead>
              <tr className="border-b border-zinc-800/90 text-zinc-400 bg-[#0d0d10] font-semibold">
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Dernière Commande & Étape</th>
                <th className="py-2.5 px-3">Coordonnées</th>
                <th className="py-2.5 px-3">Ville</th>
                <th className="py-2.5 px-3">Commandes & Taux Livré</th>
                <th className="py-2.5 px-3">Total Dépensé</th>
                <th className="py-2.5 px-3 text-right">Relance WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-500">
                    Aucun client trouvé pour ce filtre.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const waUrl = getContextualWhatsAppUrl(c, storeSlug);
                  const deliveryRate = c.deliverySuccessRate ?? 100;

                  return (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedCustomer(c)}
                      className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    >
                      {/* Client info */}
                      <td className="py-2.5 px-3 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-medium text-zinc-200 text-xs shrink-0">
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-100 text-xs">{c.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {c.status === 'returning' ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                ★ VIP Fidèle
                              </span>
                            ) : c.status === 'risk' ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                Risque Retour
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                                {c.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 4-Stage Pipeline Switch Status Badge */}
                      <td className="py-2.5 px-3">
                        {c.lastOrderStatus === 'confirmed' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                              <CheckCircle2 className="w-3 h-3" /> 1. Confirmée
                            </span>
                            <div className="font-mono text-[11px] text-zinc-300">{c.lastOrderNumber}</div>
                          </div>
                        ) : c.lastOrderStatus === 'shipped' || c.lastOrderStatus === 'shipping' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              <Truck className="w-3 h-3" /> 2. Expédiée
                            </span>
                            <div className="font-mono text-[10px] text-zinc-400">{c.lastTrackingNumber || c.lastOrderNumber}</div>
                          </div>
                        ) : c.lastOrderStatus === 'delivered' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                              <DollarSign className="w-3 h-3" /> 3. Livrée (Payée)
                            </span>
                            <div className="font-mono text-[11px] text-zinc-400">{c.lastOrderNumber}</div>
                          </div>
                        ) : c.lastOrderStatus === 'returned' || c.lastOrderStatus === 'canceled' ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30">
                              <AlertTriangle className="w-3 h-3" /> 4. Retournée
                            </span>
                            <div className="font-mono text-[11px] text-zinc-400">{c.lastOrderNumber}</div>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                              <Clock className="w-3 h-3" /> À Confirmer
                            </span>
                            <div className="font-mono text-[11px] text-zinc-300">{c.lastOrderNumber}</div>
                          </div>
                        )}
                      </td>

                      {/* Phone & email */}
                      <td className="py-2.5 px-3 text-zinc-300">
                        <div className="font-mono tabular-nums text-xs text-zinc-200">{c.phone}</div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[150px]">{c.email}</div>
                      </td>

                      {/* City */}
                      <td className="py-2.5 px-3 font-medium text-zinc-200">
                        <div>{c.city}</div>
                        {c.address && (
                          <div className="text-[10px] text-zinc-500 truncate max-w-[130px]">{c.address}</div>
                        )}
                      </td>

                      {/* Orders & Delivery Rate */}
                      <td className="py-2.5 px-3">
                        <div className="font-mono tabular-nums text-zinc-200 font-medium">
                          {c.totalOrders} commande(s)
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono tabular-nums font-medium ${
                            deliveryRate >= 80 ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' : deliveryRate >= 50 ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40' : 'text-rose-400 bg-rose-950/40 border border-rose-800/40'
                          }`}>
                            {deliveryRate}% Livré
                          </span>
                          <span className="text-[10px] text-zinc-500">• {c.lastOrderDate}</span>
                        </div>
                      </td>

                      {/* Total Spend */}
                      <td className="py-2.5 px-3">
                        <div className="font-mono tabular-nums font-semibold text-zinc-100 text-xs">
                          {c.totalSpend} MAD
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono tabular-nums">Panier : {c.averageBasket} MAD</div>
                      </td>

                      {/* Contextual WhatsApp Button */}
                      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 font-medium text-[11px] transition-colors"
                          title="Envoyer un message WhatsApp contextuel basé sur l'étape de commande"
                        >
                          <MessageCircle className="w-3 h-3 fill-current" />
                          <span>
                            {c.lastOrderStatus === 'confirmed' ? 'Notifier Préparation' :
                             c.lastOrderStatus === 'shipped' ? 'Envoyer Suivi' :
                             c.lastOrderStatus === 'delivered' ? 'Offre VIP' :
                             'Relancer'}
                          </span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer (Order History & 4-Stage Tracking) */}
      {selectedCustomer && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setSelectedCustomer(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#121215] border-l border-zinc-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl admin-scrollbar cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-medium text-sm text-zinc-200">
                    {selectedCustomer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">{selectedCustomer.name}</h2>
                    <p className="text-xs text-zinc-400 font-mono">{selectedCustomer.phone} • {selectedCustomer.city}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Customer Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-[#0d0d10] rounded-lg border border-zinc-800/80 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Commandes</div>
                  <div className="text-base font-mono tabular-nums font-bold text-white mt-0.5">{selectedCustomer.totalOrders}</div>
                </div>
                <div className="p-3 bg-[#0d0d10] rounded-lg border border-zinc-800/80 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Encaissé</div>
                  <div className="text-base font-mono tabular-nums font-bold text-emerald-400 mt-0.5">{selectedCustomer.totalSpend} MAD</div>
                </div>
                <div className="p-3 bg-[#0d0d10] rounded-lg border border-zinc-800/80 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Taux Livré</div>
                  <div className="text-base font-mono tabular-nums font-bold text-zinc-100 mt-0.5">{selectedCustomer.deliverySuccessRate ?? 100}%</div>
                </div>
              </div>

              {/* Order History Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-zinc-400" />
                  Historique Commandes ({selectedCustomer.recentOrders?.length || 0})
                </h3>

                <div className="space-y-2">
                  {(selectedCustomer.recentOrders || []).map((ord) => (
                    <div 
                      key={ord.id}
                      className="p-3 bg-[#0d0d10] rounded-lg border border-zinc-800/80 space-y-1.5 hover:border-zinc-700/80 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs font-semibold text-zinc-200">{ord.orderNumber}</div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          ord.status === 'confirmed' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' :
                          ord.status === 'shipped' || ord.status === 'shipping' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                          ord.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                          ord.status === 'returned' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {ord.status === 'confirmed' ? '1. Confirmée' :
                           ord.status === 'shipped' || ord.status === 'shipping' ? '2. Expédiée' :
                           ord.status === 'delivered' ? '3. Livrée' :
                           ord.status === 'returned' ? '4. Retournée' :
                           ord.status}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-400 line-clamp-1">
                        {ord.itemsSummary || 'Articles commandés'}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[11px]">
                        <div className="text-zinc-500">
                          {ord.trackingNumber && (
                            <span className="font-mono text-zinc-300">Suivi: {ord.trackingNumber}</span>
                          )}
                        </div>
                        <div className="font-mono tabular-nums font-semibold text-zinc-100">{ord.total} MAD</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Drawer Action */}
            <div className="pt-4 border-t border-zinc-800/80 mt-5 space-y-2">
              <a
                href={getContextualWhatsAppUrl(selectedCustomer, storeSlug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Ouvrir WhatsApp en Darija</span>
              </a>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 font-medium text-xs transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
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
