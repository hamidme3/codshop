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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-amber-400" /> CRM & Gestion des Clients
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Synchronisé en temps réel avec vos 4 étapes commandes : <strong className="text-cyan-400">1. Confirmée</strong>, <strong className="text-amber-400">2. Expédiée</strong>, <strong className="text-emerald-400">3. Livrée</strong>, <strong className="text-rose-400">4. Retournée</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshCustomers}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Rafraîchir les données CRM"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
            Base active : <strong className="text-white">{totalCustomersCount} clients</strong>
          </div>
        </div>
      </div>

      {/* 4 Synchronized KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Base */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Clients CRM</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalCustomersCount}</div>
          <div className="text-[11px] text-slate-400">Clients identifiés par téléphone</div>
        </div>

        {/* 1. Confirmer (Cyan) */}
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>Étape 1 : Confirmées</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400">{confirmedPipelineCount}</div>
          <div className="text-[11px] text-cyan-300">En cours de préparation / emballage</div>
        </div>

        {/* 2. Expédier (Orange) */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Étape 2 : En Expédition</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{shippedPipelineCount}</div>
          <div className="text-[11px] text-amber-300">Colis sur la route avec numéro de suivi</div>
        </div>

        {/* 3. Livrée & Cash Encaissé (Green) */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Étape 3 : Livrées (Encaissé)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{totalDeliveredRevenue.toLocaleString()} DH</div>
          <div className="text-[11px] text-emerald-300">{deliveredPipelineCount} client(s) ayant payé en espèces</div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
          {[
            { id: 'all', label: `Tous (${totalCustomersCount})` },
            { id: 'confirmed', label: `🔵 1. Confirmés (${confirmedPipelineCount})` },
            { id: 'shipped', label: `🚚 2. En Expédition (${shippedPipelineCount})` },
            { id: 'delivered', label: `💰 3. Livrés (${deliveredPipelineCount})` },
            { id: 'returning', label: `⭐ Fidèles VIP (${vipCustomersCount})` },
            { id: 'risk', label: `⚠️ Retours (${riskCustomersCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, téléphone, N° commande, suivi..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Synchronized Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50 font-semibold">
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Dernière Commande & Étape</th>
                <th className="py-3.5 px-4">Coordonnées</th>
                <th className="py-3.5 px-4">Ville</th>
                <th className="py-3.5 px-4">Commandes & Taux Livré</th>
                <th className="py-3.5 px-4">Total Dépensé</th>
                <th className="py-3.5 px-4 text-right">Relance WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
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
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      {/* Client info */}
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{c.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {c.status === 'returning' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                ★ VIP Fidèle
                              </span>
                            ) : c.status === 'risk' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                Risque Retour
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-400">
                                {c.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 3-Stage Pipeline Switch Status Badge */}
                      <td className="py-3.5 px-4">
                        {c.lastOrderStatus === 'confirmed' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                              <CheckCircle2 className="w-3 h-3" /> 1. Confirmée
                            </span>
                            <div className="font-mono text-[11px] text-white font-semibold">{c.lastOrderNumber}</div>
                          </div>
                        ) : c.lastOrderStatus === 'shipped' || c.lastOrderStatus === 'shipping' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                              <Truck className="w-3 h-3" /> 2. Expédiée
                            </span>
                            <div className="font-mono text-[10px] text-amber-300 font-semibold">{c.lastTrackingNumber || c.lastOrderNumber}</div>
                          </div>
                        ) : c.lastOrderStatus === 'delivered' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              <DollarSign className="w-3 h-3" /> 3. Livrée (Payée)
                            </span>
                            <div className="font-mono text-[11px] text-slate-300">{c.lastOrderNumber}</div>
                          </div>
                        ) : c.lastOrderStatus === 'returned' || c.lastOrderStatus === 'canceled' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                              <AlertTriangle className="w-3 h-3" /> 4. Retournée
                            </span>
                            <div className="font-mono text-[11px] text-rose-300">{c.lastOrderNumber}</div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                              <Clock className="w-3 h-3" /> À Confirmer
                            </span>
                            <div className="font-mono text-[11px] text-white font-semibold">{c.lastOrderNumber}</div>
                          </div>
                        )}
                      </td>

                      {/* Phone & email */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="font-semibold text-white font-mono">{c.phone}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{c.email}</div>
                      </td>

                      {/* City */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{c.city}</div>
                        {c.address && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{c.address}</div>
                        )}
                      </td>

                      {/* Orders & Delivery Rate */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {c.totalOrders} commande(s)
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            deliveryRate >= 80 ? 'text-emerald-400 bg-emerald-950/40' : deliveryRate >= 50 ? 'text-amber-400 bg-amber-950/40' : 'text-rose-400 bg-rose-950/40'
                          }`}>
                            {deliveryRate}% Livré
                          </span>
                          <span className="text-[10px] text-slate-500">• {c.lastOrderDate}</span>
                        </div>
                      </td>

                      {/* Total Spend */}
                      <td className="py-3.5 px-4 font-black text-amber-400 text-sm">
                        {c.totalSpend} DH
                        <div className="text-[10px] text-slate-500 font-normal">Panier : {c.averageBasket} DH</div>
                      </td>

                      {/* Contextual WhatsApp Button */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-[11px] transition-colors border border-emerald-500/30"
                          title="Envoyer un message WhatsApp contextuel basé sur l'étape de commande"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>
                            {c.lastOrderStatus === 'confirmed' ? 'Notifier Préparation' :
                             c.lastOrderStatus === 'shipped' ? 'Envoyer Suivi' :
                             c.lastOrderStatus === 'delivered' ? 'Offre VIP Fidélité' :
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

      {/* Customer Detail Drawer (Order History & 3-Stage Tracking) */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
                    {selectedCustomer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{selectedCustomer.name}</h2>
                    <p className="text-xs text-slate-400 font-mono">{selectedCustomer.phone} • {selectedCustomer.city}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Commandes</div>
                  <div className="text-lg font-black text-white mt-0.5">{selectedCustomer.totalOrders}</div>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Encaissé</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">{selectedCustomer.totalSpend} DH</div>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Taux Livré</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">{selectedCustomer.deliverySuccessRate ?? 100}%</div>
                </div>
              </div>

              {/* Order History Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  Historique des Commandes ({selectedCustomer.recentOrders?.length || 0})
                </h3>

                <div className="space-y-2.5">
                  {(selectedCustomer.recentOrders || []).map((ord) => (
                    <div 
                      key={ord.id}
                      className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs font-bold text-white">{ord.orderNumber}</div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'confirmed' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          ord.status === 'shipped' || ord.status === 'shipping' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          ord.status === 'returned' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {ord.status === 'confirmed' ? '1. Confirmée' :
                           ord.status === 'shipped' || ord.status === 'shipping' ? '2. Expédiée' :
                           ord.status === 'delivered' ? '3. Livrée' :
                           ord.status === 'returned' ? 'Retourné' :
                           ord.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300">
                        {ord.itemsSummary || 'Articles commandés'}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                        <div className="text-slate-400">
                          {ord.trackingNumber && (
                            <span className="font-mono text-amber-400">Suivi: {ord.trackingNumber}</span>
                          )}
                        </div>
                        <div className="font-black text-white">{ord.total} DH</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Drawer Action */}
            <div className="pt-6 border-t border-slate-800 mt-6 space-y-2">
              <a
                href={getContextualWhatsAppUrl(selectedCustomer, storeSlug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Ouvrir WhatsApp en Darija</span>
              </a>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
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
