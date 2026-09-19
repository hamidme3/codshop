'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Users, Search, Phone, Mail, MapPin, 
  ShoppingBag, MessageCircle, Heart, UserPlus, 
  Sparkles, ArrowUpRight, CheckCircle2, Truck, DollarSign,
  AlertTriangle, ChevronRight, X, Clock, RefreshCw, Package,
  Save, Copy, Check, ShieldCheck, ArrowRight, CornerDownRight
} from 'lucide-react';
import { getCustomers, updateCustomerNotes, Customer, OrderStatus } from '@/lib/backoffice';
import { normalizeMoroccanPhone } from '@/lib/whatsapp-templates';
import { normalizePhoneForWhatsApp, COUNTRIES } from '@/lib/geo';

function getContextualWhatsAppUrl(customer: Customer, storeSlug: string): string {
  const countryCode = ((customer.recentOrders?.[0] as any)?.countryCode || (customer as any)?.country || 'MA').toUpperCase();
  const waPhone = countryCode === 'MA' ? normalizeMoroccanPhone(customer.phone) : normalizePhoneForWhatsApp(customer.phone, countryCode);

  const storeName = storeSlug.toUpperCase();
  const orderNum = customer.lastOrderNumber || 'votre commande';
  const totalVal = customer.recentOrders?.[0]?.total || customer.totalSpend || 0;
  const status = customer.lastOrderStatus;
  const courier = customer.recentOrders?.[0]?.courier || 'transporteur';
  const tracking = customer.lastTrackingNumber;
  const curr = customer.recentOrders?.[0]?.currency || (COUNTRIES[countryCode] || COUNTRIES.MA).currency.symbol;

  let message = '';

  if (countryCode === 'SA' || countryCode === 'AE') {
    if (status === 'confirmed') {
      message = `السلام عليكم ورحمة الله وبركاته يا ${customer.name} 👋، معك متجر ${storeName}. تم تأكيد طلبكم ${orderNum} بقيمة ${totalVal} ${curr} بنجاح! نقوم حالياً بتجهيز الشحنة لإرسالها إليكم في ${customer.city}.`;
    } else if (status === 'shipped' || status === 'shipping') {
      const trackingTxt = tracking ? ` (رقم التتبع: ${tracking})` : '';
      message = `السلام عليكم يا ${customer.name} 👋، تم شحن طلبكم ${orderNum} مع ${courier.toUpperCase()}${trackingTxt}. سيتواصل معكم مندوب التوصيل قريباً. يرجى تجهيز ${totalVal} ${curr} نقداً عند الاستلام.`;
    } else if (status === 'delivered') {
      message = `السلام عليكم يا ${customer.name} 👋، شكراً لثقتكم بنا! تم تسليم طلبكم ${orderNum} بنجاح. يسعدنا تقديم خصم 15% على طلبكم القادم بكود: VIP15!`;
    } else if (status === 'returned' || status === 'canceled') {
      message = `السلام عليكم يا ${customer.name} 👋، تعذر على المندوب تسليم طلبكم ${orderNum} في ${customer.city}. هل ترغبون بإعادة جدولة موعد التسليم في وقت مناسب؟`;
    } else {
      message = `السلام عليكم يا ${customer.name} 👋، معك متجر ${storeName}. تلقينا طلبكم ${orderNum} بقيمة ${totalVal} ${curr}. هل تؤكدون شحن الطلب إلى عنوانكم في ${customer.city}؟`;
    }
  } else if (countryCode === 'EG') {
    if (status === 'confirmed') {
      message = `أهلاً بحضرتك يا ${customer.name} 👋، معاك متجر ${storeName}. أوردرك ${orderNum} بقيمة ${totalVal} ${curr} تم تأكيده بنجاح! وجاري تجهيزه للشحن إلى ${customer.city}.`;
    } else if (status === 'shipped' || status === 'shipping') {
      const trackingTxt = tracking ? ` (رقم البوليصة: ${tracking})` : '';
      message = `أهلاً بحضرتك يا ${customer.name} 👋، أوردرك ${orderNum} خرج مع المندوب دلوقتي عبر ${courier.toUpperCase()}${trackingTxt}. المندوب هيتصل بحضرتك قريباً. يرجى تجهيز ${totalVal} ${curr} كاش عند الاستلام.`;
    } else if (status === 'delivered') {
      message = `أهلاً بحضرتك يا ${customer.name} 👋، شكراً لثقتك فينا! أوردرك ${orderNum} وصل بسلامة. هدية لحضرتك خصم 15% على الأوردر القادم بكود: VIP15!`;
    } else if (status === 'returned' || status === 'canceled') {
      message = `أهلاً بحضرتك يا ${customer.name} 👋، المندوب لم يتمكن من تسليم أوردرك ${orderNum} في ${customer.city}. تحب نحدد معاد تاني مناسب لحضرتك؟`;
    } else {
      message = `أهلاً بحضرتك يا ${customer.name} 👋، معاك متجر ${storeName}. استلمنا أوردرك ${orderNum} بقيمة ${totalVal} ${curr}. تحب نؤكد الشحن لعنوانك في ${customer.city}؟`;
    }
  } else if (countryCode === 'FR' || countryCode === 'SN' || countryCode === 'CI') {
    if (status === 'confirmed') {
      message = `Bonjour ${customer.name} 👋, de la part de la boutique ${storeName}. Votre commande ${orderNum} d'un montant de ${totalVal} ${curr} est bien confirmée ! Notre équipe prépare votre colis pour expédition à ${customer.city}.`;
    } else if (status === 'shipped' || status === 'shipping') {
      const trackingTxt = tracking ? ` (N° Suivi : ${tracking})` : '';
      message = `Bonjour ${customer.name} 👋, votre colis ${orderNum} est expédié avec ${courier.toUpperCase()}${trackingTxt}. Le livreur va vous contacter très prochainement. Merci de préparer ${totalVal} ${curr} à la livraison.`;
    } else if (status === 'delivered') {
      message = `Bonjour ${customer.name} 👋, merci pour votre confiance ! Votre commande ${orderNum} a bien été livrée. Profitez de -15% sur votre prochain achat avec le code : VIP15 !`;
    } else if (status === 'returned' || status === 'canceled') {
      message = `Bonjour ${customer.name} 👋, nous avons constaté que votre commande ${orderNum} n'a pas pu vous être remise à ${customer.city}. Souhaitez-vous reprogrammer votre livraison ?`;
    } else {
      message = `Bonjour ${customer.name} 👋, de la part de la boutique ${storeName}. Nous avons bien reçu votre commande ${orderNum} d'un montant de ${totalVal} ${curr}. Confirmez-vous l'envoi à votre adresse à ${customer.city} ?`;
    }
  } else {
    // Morocco / Algeria / Default Darija
    if (status === 'confirmed') {
      message = `Salam ${customer.name}, m3ak la boutique ${storeName}. Votre commande ${orderNum} de ${totalVal} ${curr} est bien confirmée ! Notre équipe prépare actuellement votre colis pour expédition rapide à ${customer.city}.`;
    } else if (status === 'shipped' || status === 'shipping') {
      const trackingTxt = tracking ? ` (N° Suivi : ${tracking})` : '';
      message = `Salam ${customer.name}, votre colis ${orderNum} est expédié avec ${courier.toUpperCase()}${trackingTxt}. Le livreur va vous contacter très prochainement. Merci de bien vouloir préparer ${totalVal} ${curr} en espèces à la livraison.`;
    } else if (status === 'delivered') {
      message = `Salam ${customer.name}, merci pour votre confiance ! Votre commande ${orderNum} a bien été livrée. Pour vous remercier de votre fidélité chez ${storeName}, profitez de -15% sur votre prochaine commande avec le code : VIP15 !`;
    } else if (status === 'returned' || status === 'canceled') {
      message = `Salam ${customer.name}, nous avons constaté que votre commande ${orderNum} n'a pas pu vous être remise par le livreur à ${customer.city} (Colis retourné). Souhaitez-vous reprogrammer votre livraison à une autre date ?`;
    } else {
      // new / to_confirm
      message = `Salam ${customer.name}, m3ak la boutique ${storeName}. Nous avons bien reçu votre commande ${orderNum} d'un montant de ${totalVal} ${curr}. Confirmez-vous l'envoi à votre adresse à ${customer.city} ?`;
    }
  }

  return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
}

function CustomersContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'shipped' | 'delivered' | 'returning' | 'risk'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>({});
  const [notesSaved, setNotesSaved] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  // Sync selected customer's active order & notes when drawer opens
  React.useEffect(() => {
    if (selectedCustomer) {
      setActiveOrderId(selectedCustomer.recentOrders?.[0]?.id || null);
      if (typeof window !== 'undefined') {
        const localSaved = localStorage.getItem(`cod_customer_notes_${selectedCustomer.phone}`);
        if (localSaved !== null) {
          setCustomerNotes((prev) => ({ ...prev, [selectedCustomer.id]: localSaved }));
        } else if (selectedCustomer.addressNotes) {
          setCustomerNotes((prev) => ({ ...prev, [selectedCustomer.id]: selectedCustomer.addressNotes || '' }));
        }
      }
    }
  }, [selectedCustomer]);

  const fetchLiveCustomers = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/customers?store=${encodeURIComponent(storeSlug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }
      }
    } catch (err) {
      console.warn('[Admin Customers] Could not fetch live customers, using fallback:', err);
    }
  }, [storeSlug]);

  React.useEffect(() => {
    fetchLiveCustomers();
  }, [storeSlug, fetchLiveCustomers]);

  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    const notesToSave = customerNotes[selectedCustomer.id] ?? selectedCustomer.addressNotes ?? '';
    updateCustomerNotes(selectedCustomer.phone, notesToSave, storeSlug);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cod_customer_notes_${selectedCustomer.phone}`, notesToSave);
    }
    // Persist customer notes to database asynchronously
    fetch('/api/admin/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: selectedCustomer.phone, notes: notesToSave, storeSlug }),
    }).catch((err) => console.warn('[Admin Customers] Save notes error:', err));

    setSelectedCustomer({ ...selectedCustomer, addressNotes: notesToSave });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const handleCopyTracking = (trackNum: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(trackNum);
      setCopiedTracking(trackNum);
      setTimeout(() => setCopiedTracking(null), 2000);
    }
  };

  const refreshCustomers = () => {
    setCustomers(getCustomers(storeSlug));
    fetchLiveCustomers();
  };

  // Real-time synchronization with order pipeline updates
  React.useEffect(() => {
    const handleSync = () => {
      setCustomers(getCustomers(storeSlug));
      fetchLiveCustomers();
    };
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
  }, [storeSlug, fetchLiveCustomers]);

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
    <div className="p-4 sm:p-6 md:p-10 space-y-6 max-w-7xl mx-auto font-sans">
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
            Synchronisé avec vos 4 étapes : <span className="text-cyan-300 font-mono text-[11px]">1. Confirmée</span>, <span className="text-sky-300 font-mono text-[11px]">2. Expédiée</span>, <span className="text-emerald-300 font-mono text-[11px]">3. Livrée</span>, <span className="text-rose-300 font-mono text-[11px]">4. Retournée</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshCustomers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors shadow-sm cursor-pointer"
            title="Rafraîchir les données CRM"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>
          <div className="text-xs font-mono text-zinc-400 bg-[#13171c] px-3 py-1.5 rounded-lg border border-slate-800/80">
            Base active: <strong className="text-zinc-200 tabular-nums">{totalCustomersCount}</strong>
          </div>
        </div>
      </div>

      {/* 4 Synchronized KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Base */}
        <div className="p-4 rounded-xl bg-[#13171c] border border-slate-800/70 bento-card space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Total Clients CRM</span>
            <Users className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-white tracking-tight">{totalCustomersCount}</div>
          <div className="text-[11px] text-zinc-500">Identifiés par téléphone normalisé</div>
        </div>

        {/* 1. Confirmer (Cyan) */}
        <div className="p-4 rounded-xl bg-[#13171c] border border-slate-800/70 bento-card space-y-1.5 shadow-sm">
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

        {/* 2. Expédier (Sky Blue) */}
        <div className="p-4 rounded-xl bg-[#13171c] border border-slate-800/70 bento-card space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Étape 2 : En Expédition
            </span>
            <Truck className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-mono tabular-nums font-bold text-white tracking-tight">{shippedPipelineCount}</div>
          <div className="text-[11px] text-zinc-500">En cours d&apos;acheminement transporteur</div>
        </div>

        {/* 3. Livrée & Cash Encaissé (Emerald) */}
        <div className="p-4 rounded-xl bg-[#13171c] border border-slate-800/70 bento-card space-y-1.5 shadow-sm">
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
        <div className="flex items-center gap-1 p-1 bg-[#121215] border border-zinc-800/80 rounded-lg overflow-x-auto admin-scrollbar no-scrollbar text-xs">
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
              className={`shrink-0 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Synchronized Customers Table Container */}
      <div className="bg-[#121215] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
        {/* Mobile Customer Cards Stream (screens < md) */}
        <div className="block md:hidden divide-y divide-zinc-800/60 p-2 sm:p-3 space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs">
              Aucun client trouvé pour ce filtre.
            </div>
          ) : (
            filteredCustomers.map((c) => {
              const waUrl = getContextualWhatsAppUrl(c, storeSlug);
              const deliveryRate = c.deliverySuccessRate ?? 100;

              return (
                <div
                  key={`mobile-cust-${c.id}`}
                  className="p-3 rounded-xl bg-[#0d0d10] border border-zinc-800/80 space-y-3 cursor-pointer hover:border-zinc-700/80 transition-colors"
                  onClick={() => setSelectedCustomer(c)}
                >
                  {/* Top row: Avatar + Name + VIP/Risk Badge + Total Spend */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-medium text-zinc-200 text-xs shrink-0">
                        {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-xs truncate">{c.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {c.status === 'returning' ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
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
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-sm text-white tabular-nums">
                        {c.totalSpend} <span className="text-[10px] font-sans text-zinc-400">MAD</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {c.totalOrders} cmd{c.totalOrders > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Middle row: Coordinates + Pipeline Status */}
                  <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-[#121215] border border-zinc-800/80 text-xs">
                    <div>
                      <div className="text-[10px] text-zinc-500">Ville & Tél</div>
                      <div className="text-zinc-200 font-medium truncate">{c.city}</div>
                      <a
                        href={`tel:${c.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-mono text-zinc-400 hover:text-white underline tabular-nums"
                      >
                        {c.phone}
                      </a>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500">Dernier Statut</div>
                      <div className="mt-0.5">
                        {c.lastOrderStatus === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold stage-pill-confirmed font-mono">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Confirmée
                          </span>
                        ) : c.lastOrderStatus === 'shipped' || c.lastOrderStatus === 'shipping' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold stage-pill-shipped font-mono">
                            <Truck className="w-2.5 h-2.5" /> Expédiée
                          </span>
                        ) : c.lastOrderStatus === 'delivered' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold stage-pill-delivered font-mono">
                            <DollarSign className="w-2.5 h-2.5" /> Livrée
                          </span>
                        ) : c.lastOrderStatus === 'returned' || c.lastOrderStatus === 'canceled' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold stage-pill-returned font-mono">
                            <AlertTriangle className="w-2.5 h-2.5" /> Retournée
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold stage-pill-to_confirm font-mono">
                            <Clock className="w-2.5 h-2.5" /> À Confirmer
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{deliveryRate}% livré</div>
                    </div>
                  </div>

                  {/* Actions row: WhatsApp Darija + Open Timeline */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-target flex-1 px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {c.lastOrderStatus === 'confirmed' ? 'Notifier Préparation' :
                         c.lastOrderStatus === 'shipped' ? 'Envoyer Suivi' :
                         c.lastOrderStatus === 'delivered' ? 'Offre VIP' :
                         'Relancer WhatsApp'}
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(c)}
                      className="touch-target px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <span>Historique</span>
                      <ChevronRight className="w-3 h-3 text-zinc-400" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table (screens >= md) */}
        <div className="hidden md:block overflow-x-auto admin-scrollbar">
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
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/30">
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
                            deliveryRate >= 80 ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' : deliveryRate >= 50 ? 'text-sky-400 bg-sky-950/40 border border-sky-800/40' : 'text-rose-400 bg-rose-950/40 border border-rose-800/40'
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
            className="w-full max-w-lg bg-[#121215] border-l border-zinc-800 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto shadow-2xl admin-scrollbar cursor-default min-h-[100dvh]"
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

              {/* Order Selection & Historical Delivery Timeline */}
              {(() => {
                const customerOrders = (selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0)
                  ? selectedCustomer.recentOrders
                  : [{
                      id: `ord_${selectedCustomer.id}`,
                      orderNumber: selectedCustomer.lastOrderNumber || 'CMD-84925',
                      createdAt: new Date().toISOString(),
                      status: selectedCustomer.lastOrderStatus || 'delivered',
                      total: selectedCustomer.totalSpend || 349,
                      itemsSummary: 'Sac Cuir Artisanal Marrakech (Marron Vintage) x1',
                      courier: 'manual',
                      trackingNumber: selectedCustomer.lastTrackingNumber || 'EXP-MA-774419',
                    }];
                const activeOrder = 
                  customerOrders.find((o) => o.id === activeOrderId) || 
                  customerOrders[0];
                const currentNotes = customerNotes[selectedCustomer.id] ?? selectedCustomer.addressNotes ?? '';

                return (
                  <div className="space-y-4">
                    {/* Header with order switcher */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          <span>Chronologie Logistique & Livraison</span>
                        </h3>
                        {activeOrder && (
                          <span className="font-mono text-[11px] text-zinc-400">
                            {activeOrder.orderNumber}
                          </span>
                        )}
                      </div>

                      {/* Multi-Order Tabs */}
                      {customerOrders.length > 1 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 admin-scrollbar">
                          {customerOrders.map((ord) => (
                            <button
                              key={ord.id}
                              type="button"
                              onClick={() => setActiveOrderId(ord.id)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all border cursor-pointer ${
                                (activeOrder?.id === ord.id)
                                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 font-semibold shadow-xs'
                                  : 'bg-[#0d0d10] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {ord.orderNumber} ({ord.total} MAD)
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Historical Timeline Steps */}
                    {activeOrder ? (
                      <div className="p-4 bg-[#0d0d10] rounded-xl border border-zinc-800/80 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">{activeOrder.orderNumber}</span>
                            <span className="text-zinc-500">•</span>
                            <span className="text-xs font-mono tabular-nums text-zinc-300 font-semibold">{activeOrder.total} MAD</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            activeOrder.status === 'confirmed' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' :
                            activeOrder.status === 'shipped' || activeOrder.status === 'shipping' ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30' :
                            activeOrder.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                            activeOrder.status === 'returned' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                            'bg-zinc-800 text-zinc-300'
                          }`}>
                            {activeOrder.status === 'confirmed' ? '1. Confirmée' :
                             activeOrder.status === 'shipped' || activeOrder.status === 'shipping' ? '2. Expédiée' :
                             activeOrder.status === 'delivered' ? '3. Livrée' :
                             activeOrder.status === 'returned' ? '4. Retournée' :
                             'À Confirmer'}
                          </span>
                        </div>

                        {/* Visual Step Timeline Rail */}
                        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
                          {/* Step 1: Storefront Order */}
                          <div className="relative space-y-1">
                            <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-zinc-200">1. Commande Enregistrée (COD)</span>
                              <span className="text-[10px] font-mono text-zinc-500">{activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Storefront'}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 line-clamp-1">
                              {activeOrder.itemsSummary || 'Articles enregistrés avec paiement à la livraison.'}
                            </p>
                          </div>

                          {/* Step 2: Phone Confirmation */}
                          <div className="relative space-y-1">
                            <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              activeOrder.status !== 'new' && activeOrder.status !== 'to_confirm'
                                ? 'bg-emerald-500/20 border border-emerald-500'
                                : 'bg-sky-500/20 border border-sky-500 animate-pulse'
                            }`}>
                              {activeOrder.status !== 'new' && activeOrder.status !== 'to_confirm' ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <Clock className="w-2.5 h-2.5 text-sky-400" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-zinc-200">2. Confirmation & Qualification</span>
                              <span className={`text-[10px] font-mono ${
                                activeOrder.status !== 'new' && activeOrder.status !== 'to_confirm' ? 'text-emerald-400' : 'text-sky-400'
                              }`}>
                                {activeOrder.status !== 'new' && activeOrder.status !== 'to_confirm' ? 'Validée ✓' : 'En attente ⏳'}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              Appel téléphonique en Darija pour valider l&apos;adresse à {selectedCustomer.city}.
                            </p>
                          </div>

                          {/* Step 3: Courier Handover & Tracking */}
                          <div className="relative space-y-1.5">
                            <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              ['shipped', 'shipping', 'delivered', 'returned'].includes(activeOrder.status)
                                ? 'bg-emerald-500/20 border border-emerald-500'
                                : 'bg-zinc-800 border border-zinc-700'
                            }`}>
                              {['shipped', 'shipping', 'delivered', 'returned'].includes(activeOrder.status) ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <Truck className="w-2.5 h-2.5 text-zinc-500" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-zinc-200">3. Expédition & Suivi</span>
                              <span className="text-[10px] font-mono uppercase text-zinc-400">
                                {activeOrder.trackingNumber ? 'Expédiée' : 'En cours'}
                              </span>
                            </div>
                            {activeOrder.trackingNumber ? (
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="font-mono text-[11px] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-sky-300">
                                  {activeOrder.trackingNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyTracking(activeOrder.trackingNumber!)}
                                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                  title="Copier le numéro de suivi"
                                >
                                  {copiedTracking === activeOrder.trackingNumber ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <p className="text-[11px] text-zinc-500">Bordereau en cours de génération.</p>
                            )}
                          </div>

                          {/* Step 4: Regional Hub & Dispatch */}
                          <div className="relative space-y-1">
                            <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              ['delivered', 'returned'].includes(activeOrder.status)
                                ? 'bg-emerald-500/20 border border-emerald-500'
                                : ['shipped', 'shipping'].includes(activeOrder.status)
                                ? 'bg-sky-500/20 border border-sky-500 animate-pulse'
                                : 'bg-zinc-800 border border-zinc-700'
                            }`}>
                              {['delivered', 'returned'].includes(activeOrder.status) ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <MapPin className="w-2.5 h-2.5 text-zinc-500" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-zinc-200">4. Acheminement Régional</span>
                              <span className="text-[10px] font-mono text-zinc-500">Hub {selectedCustomer.city}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              Attribution au livreur du secteur pour livraison à domicile ou agence.
                            </p>
                          </div>

                          {/* Step 5: Final Delivery or Return */}
                          <div className="relative space-y-1">
                            <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                              activeOrder.status === 'delivered'
                                ? 'bg-emerald-500/20 border border-emerald-500'
                                : activeOrder.status === 'returned'
                                ? 'bg-rose-500/20 border border-rose-500'
                                : 'bg-zinc-800 border border-zinc-700'
                            }`}>
                              {activeOrder.status === 'delivered' ? (
                                <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                              ) : activeOrder.status === 'returned' ? (
                                <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                              ) : (
                                <Clock className="w-2.5 h-2.5 text-zinc-500" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-zinc-200">5. Remise du Colis & Encaissement</span>
                              <span className={`text-[10px] font-mono font-medium ${
                                activeOrder.status === 'delivered' ? 'text-emerald-400' :
                                activeOrder.status === 'returned' ? 'text-rose-400' :
                                'text-zinc-500'
                              }`}>
                                {activeOrder.status === 'delivered' ? 'Encaissé ✓' :
                                 activeOrder.status === 'returned' ? 'Retourné ✕' :
                                 'En attente'}
                              </span>
                            </div>
                            {activeOrder.status === 'delivered' ? (
                              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300">
                                Colis remis et vérifié par l&apos;acheteur. Montant de <span className="font-mono font-bold">{activeOrder.total} MAD</span> collecté en espèces.
                              </div>
                            ) : activeOrder.status === 'returned' ? (
                              <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-800/40 text-[11px] text-rose-300">
                                Échec de livraison ou refus de commande. Colis réintégré dans votre stock d&apos;entrepôt.
                              </div>
                            ) : (
                              <p className="text-[11px] text-zinc-500">
                                En attente de finalisation par le livreur local.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#0d0d10] rounded-xl border border-zinc-800 text-center text-xs text-zinc-500">
                        Aucune commande passée par ce client.
                      </div>
                    )}

                    {/* Address & Moroccan Delivery Notes Section */}
                    <div className="p-4 bg-[#0d0d10] rounded-xl border border-zinc-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <span>Adresse & Repères de Livraison</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">{selectedCustomer.city}, Maroc</span>
                      </div>

                      <div className="text-xs text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/70">
                        {selectedCustomer.address || `Adresse principale enregistrée à ${selectedCustomer.city}`}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-medium text-zinc-400">
                            Notes & Repères pour le Livreur :
                          </label>
                          {notesSaved && (
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono animate-in fade-in">
                              <CheckCircle2 className="w-3 h-3" /> Note enregistrée ✓
                            </span>
                          )}
                        </div>
                        <textarea
                          value={currentNotes}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomerNotes((prev) => ({ ...prev, [selectedCustomer.id]: val }));
                          }}
                          placeholder="Ex: En face de la pharmacie, appeler avant de venir, code interphone 14B..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-sans placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveNotes}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700/80 flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Enregistrer Note</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Drawer Action */}
            <div className="pt-4 border-t border-zinc-800/80 mt-5 space-y-2">
              <a
                href={getContextualWhatsAppUrl(selectedCustomer, storeSlug)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Ouvrir WhatsApp en Darija</span>
              </a>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 font-medium text-xs transition-colors cursor-pointer"
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
