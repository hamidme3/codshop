'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  TrendingUp, Truck, Phone, AlertOctagon, 
  MapPin, DollarSign, Wallet, ShieldCheck, ArrowUpRight,
  Users, Eye, ShoppingCart, Filter, ArrowRight, MessageCircle,
  Activity, Sparkles, RefreshCw, Search, UserX, AlertTriangle, CheckCircle2,
  Package, Compass, Flame, Clock, X, Zap
} from 'lucide-react';
import {} from '@/lib/backoffice';
import { buildWhatsAppLink } from '@/lib/whatsapp-templates';
import CodCashflowChart from '@/components/admin/charts/CodCashflowChart';
import CodFunnelChart from '@/components/admin/charts/CodFunnelChart';
import OrderVelocityChart, { PipelineStageMetric } from '@/components/admin/charts/OrderVelocityChart';
import TopProductsPerformanceChart, { ProductPerformanceMetric } from '@/components/admin/charts/TopProductsPerformanceChart';
import RegionalDistributionChart from '@/components/admin/charts/RegionalDistributionChart';

interface StorefrontAnalyticsData {
  live: {
    activeNow: number;
    inCheckout: number;
    activeProducts: { title: string; activeViewers: number }[];
  };
  funnel: {
    visitors: number;
    catalogViews: number;
    productViews: number;
    initiatedCheckout: number;
    checkoutStep2: number;
    ordersCompleted: number;
    overallConversionRate: number;
  };
  abandonment: {
    totalAbandoned: number;
    step1Abandoned: number;
    step2Abandoned: number;
    recoverableLeads: number;
    recoveryRate: number;
  };
  searches: {
    query: string;
    count: number;
    resultsCount: number;
    isZeroResult: boolean;
  }[];
  products: {
    id: string;
    title: string;
    uniqueVisitors: number;
    totalViews: number;
    ordersCount: number;
    conversionRate: number;
  }[];
  channels: {
    webOrders: number;
    webPercentage: number;
    whatsappRescues: number;
    whatsappPercentage: number;
  };
  source: string;
}

interface OperationsAnalyticsData {
  totalOrders: number;
  totalRevenueDelivered: number;
  totalRevenuePotential: number;
  confirmationRate: number;
  deliveryRate: number;
  returnRate: number;
  totalCostOfGoods?: number;
  totalShippingPaid?: number;
  netProfit: number;
  cityDistribution: { city: string; orders: number; rate: number; revenue: number; deliveryRate?: number }[];
  dailyCashflow?: { date: string; deliveredCash: number; inTransitCash: number; returnedLoss: number }[];
  pipelineStages?: PipelineStageMetric[];
  topProducts?: ProductPerformanceMetric[];
  source?: string;
}

function AnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || (typeof window !== 'undefined' ? localStorage.getItem('codshop_active_store') : null) || "";
  const urlTab = searchParams.get('tab') === 'operations' ? 'operations' : 'storefront';

  const [activeTab, setActiveTab] = useState<'storefront' | 'operations'>(() => urlTab);

  const handleTabChange = (tab: 'storefront' | 'operations') => {
    setActiveTab(tab);
    const newParams = new URLSearchParams(searchParams.toString());
    if (tab === 'storefront') {
      newParams.delete('tab');
    } else {
      newParams.set('tab', tab);
    }
    router.replace(`/admin/analytics?${newParams.toString()}`, { scroll: false });
  };
  const [storefrontData, setStorefrontData] = useState<StorefrontAnalyticsData | null>(null);
  const [operationsData, setOperationsData] = useState<OperationsAnalyticsData | null>(null);
  const [loadingStorefront, setLoadingStorefront] = useState(true);
  const [loadingOperations, setLoadingOperations] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Abandoned Checkouts Lead Recovery State
  const [abandonedOrders, setAbandonedOrders] = useState<any[]>([]);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [convertingOrderId, setConvertingOrderId] = useState<string | null>(null);
  const [convertedOrderIds, setConvertedOrderIds] = useState<Set<string>>(new Set());

  // Search Analytics Filter State
  const [searchFilterTab, setSearchFilterTab] = useState<'all' | 'zero'>('all');

  // Synchronous fallback from memory
  const fallbackAnalytics: any = {
    totalOrders: 0,
    totalRevenueDelivered: 0,
    totalRevenuePotential: 0,
    confirmationRate: 0,
    deliveryRate: 0,
    returnRate: 0,
    netProfit: 0,
    cityDistribution: [],
    pipelineStages: [],
    topProducts: [],
  };
  const analytics = operationsData || fallbackAnalytics;

  const fetchStorefrontAnalytics = () => {
    setLoadingStorefront(true);
    fetch(`/api/admin/analytics/storefront?store=${encodeURIComponent(storeSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStorefrontData(data);
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      })
      .catch((err) => console.warn('[Storefront Analytics] Fetch notice:', err))
      .finally(() => setLoadingStorefront(false));
  };

  const fetchOperationsAnalytics = () => {
    setLoadingOperations(true);
    fetch(`/api/admin/analytics/operations?store=${encodeURIComponent(storeSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOperationsData(data);
        }
      })
      .catch((err) => console.warn('[Operations Analytics] Fetch notice:', err))
      .finally(() => setLoadingOperations(false));
  };

  const fetchAbandonedOrders = () => {
    fetch(`/api/admin/orders?store=${encodeURIComponent(storeSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          const abns = data.orders.filter((o: any) => o.status === 'abandoned');
          setAbandonedOrders(abns);
        }
      })
      .catch((err) => console.warn('[Analytics] Error fetching abandoned orders:', err));
  };

  const handleConvertLead = async (orderId: string) => {
    setConvertingOrderId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: 'confirmed',
          storeSlug,
        }),
      });
      if (res.ok) {
        setConvertedOrderIds((prev) => new Set([...prev, orderId]));
        fetchAbandonedOrders();
        fetchStorefrontAnalytics();
        fetchOperationsAnalytics();
      }
    } catch (err) {
      console.error('[Analytics] Failed to convert order:', err);
    } finally {
      setConvertingOrderId(null);
    }
  };

  useEffect(() => {
    fetchStorefrontAnalytics();
    fetchOperationsAnalytics();
    fetchAbandonedOrders();
    const interval = setInterval(() => {
      fetchStorefrontAnalytics();
      fetchOperationsAnalytics();
      fetchAbandonedOrders();
    }, 15000);
    return () => clearInterval(interval);
  }, [storeSlug]);

  return (
    <div className="p-4 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tableau de Bord Stratégique • {storeSlug.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Analytiques & Rentabilité COD
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Trafic en direct, entonnoir de conversion, recherches clients et rentabilité nette réelle en Dirhams (MAD).
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 shadow-inner self-start sm:self-auto backdrop-blur-md">
          <button
            onClick={() => handleTabChange('storefront')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'storefront'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Trafic & Entonnoir (Live)</span>
          </button>
          <button
            onClick={() => handleTabChange('operations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'operations'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Commandes & Rentabilité</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRE-PURCHASE STOREFRONT INTELLIGENCE (PostHog & Realtime) */}
      {activeTab === 'storefront' && (
        <div className="space-y-8">
          {/* Live Command Center Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1419] border border-emerald-500/30 dark:border-emerald-500/40 shadow-xs relative overflow-hidden text-slate-900 dark:text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                    Radar en Direct • Boutique Active
                  </span>
                  {lastUpdated && (
                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                      (Mis à jour à {lastUpdated})
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-xs font-mono">
                    {storefrontData?.live?.activeNow ?? 0}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
                    acheteurs en ligne en ce moment
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
                  Clients naviguant sur votre storefront à la seconde près. Données ClickHouse actualisées toutes les 15 secondes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-emerald-500/20 shadow-xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">En cours de checkout</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {storefrontData?.live?.inCheckout ?? 0} <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">clients à l'Étape 2</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={fetchStorefrontAnalytics}
                  title="Actualiser les données"
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <RefreshCw className={`w-5 h-5 ${loadingStorefront ? 'animate-spin text-emerald-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Currently viewed products strip */}
            {storefrontData?.live?.activeProducts && storefrontData.live.activeProducts.length > 0 && (
              <div className="relative z-10 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5 mr-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Consultés en ce moment :
                </span>
                {storefrontData.live.activeProducts.map((ap, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-500/20 text-xs font-semibold flex items-center gap-2 shadow-2xs">
                    <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="max-w-[200px] truncate">{ap.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                      {ap.activeViewers} en direct
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* New Store Zero Visitors Banner */}
          {storefrontData && storefrontData.funnel.visitors === 0 && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Boutique prête à enregistrer votre trafic réel. Partagez le lien de votre boutique pour suivre vos premiers visiteurs et conversions en direct.</span>
              </div>
              <a
                href={`https://${storeSlug}.codshop.vipone.site`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition whitespace-nowrap self-start sm:self-auto"
              >
                Ouvrir la boutique ↗
              </a>
            </div>
          )}

          {/* 5-Step COD Conversion Funnel */}
          <div className="p-6 sm:p-8 rounded-3xl admin-surface bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400 mb-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Pipeline d'Acquisition</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Entonnoir de Conversion COD (30 Derniers Jours)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Visualisez le parcours client : de la visite initiale à la livraison finale, avec taux de passage précis.
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-2 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                <span>Conversion Globale : {storefrontData?.funnel?.overallConversionRate ?? 0}%</span>
              </div>
            </div>

            {/* Funnel Visual Horizontal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {/* Step 1: Visiteurs */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 relative shadow-xs">
                <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>1. Visiteurs</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{storefrontData?.funnel?.visitors ?? 0}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Trafic global boutique</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-slate-400 h-full rounded-full w-full" />
                </div>
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                  <ChevronRightSmall />
                </div>
              </div>

              {/* Step 2: Catalogue & Fiches */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 relative shadow-xs">
                <div className="text-[11px] uppercase font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span>2. Catalogue & Vues</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{storefrontData?.funnel?.productViews ?? 0}</div>
                <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                  {storefrontData?.funnel?.catalogViews ?? 0} vues catalogue
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-sky-500 dark:bg-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, Math.round(((storefrontData?.funnel?.productViews ?? 0) / Math.max(1, storefrontData?.funnel?.visitors ?? 1)) * 100))}%` }} />
                </div>
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                  <ChevronRightSmall />
                </div>
              </div>

              {/* Step 3: Étape 1 Pack & Offre */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 relative shadow-xs">
                <div className="text-[11px] uppercase font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>3. Formulaire Étape 1</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{storefrontData?.funnel?.initiatedCheckout ?? 0}</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Choix Pack & Quantité</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 dark:bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, Math.round(((storefrontData?.funnel?.initiatedCheckout ?? 0) / Math.max(1, storefrontData?.funnel?.productViews ?? 1)) * 100))}%` }} />
                </div>
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                  <ChevronRightSmall />
                </div>
              </div>

              {/* Step 4: Étape 2 Coordonnées */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2 relative shadow-xs">
                <div className="text-[11px] uppercase font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  <span>4. Formulaire Étape 2</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{storefrontData?.funnel?.checkoutStep2 ?? 0}</div>
                <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Saisie Téléphone & Adresse</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-purple-500 dark:bg-purple-400 h-full rounded-full" style={{ width: `${Math.min(100, Math.round(((storefrontData?.funnel?.checkoutStep2 ?? 0) / Math.max(1, storefrontData?.funnel?.initiatedCheckout ?? 1)) * 100))}%` }} />
                </div>
                <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                  <ChevronRightSmall />
                </div>
              </div>

              {/* Step 5: Commandes Finalisées */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 shadow-xs">
                <div className="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>5. Commandes Livrées</span>
                </div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{storefrontData?.funnel?.ordersCompleted ?? 0}</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Finalisées avec succès</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Abandons & Search Intent Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Abandonment Breakdown Card */}
            <div className="p-6 sm:p-7 rounded-3xl admin-surface bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-1">
                    <UserX className="w-3.5 h-3.5" />
                    <span>Déperditions de Commande</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Abandons du Formulaire COD
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 text-xs font-bold">
                  {storefrontData?.abandonment?.totalAbandoned ?? 0} abandons
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Détection de l'étape exacte où les clients ont fermé le modal sans confirmer leur commande.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Abandon à l'Étape 1</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {storefrontData?.abandonment?.step1Abandoned ?? 0}
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Hésitation offre ou prix</div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Abandon à l'Étape 2</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {storefrontData?.abandonment?.step2Abandoned ?? 0}
                  </div>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Hésitation adresse/livraison</div>
                </div>
              </div>

              {/* Recoverable Phone Leads Banner */}
              <div 
                onClick={() => setIsRecoveryOpen(true)}
                className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between gap-4 transition cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{Math.max(abandonedOrders.length, storefrontData?.abandonment?.recoverableLeads ?? 0)} Prospects Récupérables</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Paniers abandonnés avec numéro de contact. Cliquez pour relancer en 1 clic.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRecoveryOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm cursor-pointer shrink-0 active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Relancer ({Math.max(abandonedOrders.length, storefrontData?.abandonment?.recoverableLeads ?? 0)})</span>
                </button>
              </div>
            </div>

            {/* Top Searched Queries & Keywords */}
            {(() => {
              const allSearches = storefrontData?.searches || [];
              const zeroSearchesCount = allSearches.filter((s) => s.isZeroResult || s.resultsCount === 0).length;
              const displayedSearches = searchFilterTab === 'zero'
                ? allSearches.filter((s) => s.isZeroResult || s.resultsCount === 0)
                : allSearches;

              return (
                <div className="p-6 sm:p-7 rounded-3xl admin-surface bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400 mb-1">
                        <Search className="w-3.5 h-3.5" />
                        <span>Intention d'Achat Réelle</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Direct</span>
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Top Recherches & Mots-Clés</span>
                        {allSearches.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold font-mono">
                            {allSearches.length}
                          </span>
                        )}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Filter Tabs */}
                      <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setSearchFilterTab('all')}
                          className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                            searchFilterTab === 'all'
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Tous ({allSearches.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSearchFilterTab('zero')}
                          className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                            searchFilterTab === 'zero'
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'text-slate-500 hover:text-rose-500'
                          }`}
                        >
                          <span>0 résultat</span>
                          {zeroSearchesCount > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${searchFilterTab === 'zero' ? 'bg-white/20 text-white' : 'bg-rose-500/15 text-rose-500'}`}>
                              {zeroSearchesCount}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Manual Refresh */}
                      <button
                        type="button"
                        onClick={fetchStorefrontAnalytics}
                        disabled={loadingStorefront}
                        title="Actualiser les requêtes"
                        aria-label="Actualiser les requêtes"
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingStorefront ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mots-clés tapés par les visiteurs dans la barre de recherche et le catalogue. Permet de détecter la demande non satisfaite pour ajouter de nouveaux produits.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs admin-table">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 font-semibold">
                          <th className="py-2.5 px-3">Terme recherché</th>
                          <th className="py-2.5 px-3 text-center">Volume</th>
                          <th className="py-2.5 px-3 text-right">Articles trouvés</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                        {displayedSearches.length > 0 ? (
                          displayedSearches.map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] flex items-center justify-center font-mono shrink-0">
                                  {idx + 1}
                                </span>
                                <span className="truncate">"{s.query}"</span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-sky-600 dark:text-sky-400 font-extrabold">
                                {s.count}
                              </td>
                              <td className="py-3 px-3 text-right">
                                {s.isZeroResult || s.resultsCount === 0 ? (
                                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30 inline-flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>0 résultat (À ajouter !)</span>
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">{s.resultsCount} article{s.resultsCount > 1 ? 's' : ''}</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-8 text-center">
                              <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                                  <Search className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  {searchFilterTab === 'zero'
                                    ? 'Aucune recherche avec 0 résultat'
                                    : 'Aucune recherche enregistrée pour le moment'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {searchFilterTab === 'zero'
                                    ? 'Tous les mots-clés saisis par vos visiteurs ont retourné des produits correspondants dans votre catalogue.'
                                    : 'Les termes recherchés par vos clients via la barre de recherche ou sur le catalogue s\'enregistrent automatiquement ici avec leur volume.'}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* COD Conversion-to-Cash Realization Funnel */}
          {(() => {
            const visitors = storefrontData?.funnel?.visitors ?? 0;
            const checkout = storefrontData?.funnel?.initiatedCheckout ?? 0;
            const confirmed = operationsData?.pipelineStages?.find((s) => s.key === 'confirmed')?.count 
              ?? (operationsData?.totalOrders ? Math.round(operationsData.totalOrders * (operationsData.confirmationRate / 100)) : 0);
            const shipped = operationsData?.pipelineStages?.find((s) => s.key === 'shipped')?.count 
              ?? (operationsData?.totalOrders ? Math.round(operationsData.totalOrders * ((operationsData.deliveryRate + operationsData.returnRate) / 100)) : 0);
            const delivered = operationsData?.pipelineStages?.find((s) => s.key === 'delivered')?.count 
              ?? (operationsData?.totalOrders ? Math.round(operationsData.totalOrders * (operationsData.deliveryRate / 100)) : 0);

            const visitRate = 100;
            const checkoutRate = visitors > 0 ? Number(((checkout / visitors) * 100).toFixed(1)) : 0;
            const confirmedRate = visitors > 0 ? Number(((confirmed / visitors) * 100).toFixed(1)) : 0;
            const shippedRate = visitors > 0 ? Number(((shipped / visitors) * 100).toFixed(1)) : 0;
            const deliveredRate = visitors > 0 ? Number(((delivered / visitors) * 100).toFixed(1)) : 0;

            const stepCheckout = visitors > 0 ? Number(((checkout / visitors) * 100).toFixed(1)) : 0;
            const stepConfirmed = checkout > 0 ? Number(((confirmed / checkout) * 100).toFixed(1)) : (operationsData?.confirmationRate ?? 0);
            const stepShipped = confirmed > 0 ? Number(((shipped / confirmed) * 100).toFixed(1)) : 0;
            const stepDelivered = shipped > 0 ? Number(((delivered / shipped) * 100).toFixed(1)) : (operationsData?.deliveryRate ?? 0);

            return (
              <CodFunnelChart 
                stages={[
                  { id: 'visits', name: 'Visiteurs Uniques', count: visitors, rate: visitRate, stepRate: 100, color: '#64748b', iconName: 'Users' },
                  { id: 'checkout', name: 'Formulaire Rempli', count: checkout, rate: checkoutRate, stepRate: stepCheckout, color: '#3b82f6', iconName: 'Filter' },
                  { id: 'confirmed', name: 'Confirmées Tél.', count: confirmed, rate: confirmedRate, stepRate: stepConfirmed, color: '#06b6d4', iconName: 'PhoneCall' },
                  { id: 'shipped', name: 'Expédiées Transporteur', count: shipped, rate: shippedRate, stepRate: stepShipped, color: '#f59e0b', iconName: 'Truck' },
                  { id: 'delivered', name: 'Livrées & Encaissées', count: delivered, rate: deliveredRate, stepRate: stepDelivered, color: '#10b981', iconName: 'CheckCircle2' },
                ]}
                currency="MAD"
                totalDeliveredRevenue={analytics.totalRevenueDelivered}
              />
            );
          })()}

          {/* Product Visitor & Conversion Breakdown Table */}
          <div className="p-6 sm:p-8 rounded-3xl admin-surface bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400 mb-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Performance de l'Offre</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Visiteurs et Taux de Conversion par Produit
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Mesurez l'attractivité réelle de chaque article : volume de visiteurs uniques vs commandes finalisées.
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Articles analysés : <strong className="text-slate-900 dark:text-white font-mono">{storefrontData?.products?.length ?? 0}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs admin-table">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 font-semibold">
                    <th className="py-3 px-4">Produit</th>
                    <th className="py-3 px-4 text-center">Visiteurs Uniques</th>
                    <th className="py-3 px-4 text-center">Vues Totales</th>
                    <th className="py-3 px-4 text-center">Commandes COD</th>
                    <th className="py-3 px-4 text-center">Taux de Conversion</th>
                    <th className="py-3 px-4 text-right">Diagnostic Produit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {storefrontData?.products && storefrontData.products.length > 0 ? (
                    storefrontData.products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">
                          <div className="max-w-[280px] truncate flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{prod.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-600 dark:text-sky-400">
                          {prod.uniqueVisitors}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                          {prod.totalViews}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {prod.ordersCount}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 font-bold font-mono text-slate-900 dark:text-white">
                            <span>{prod.conversionRate}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {prod.conversionRate >= 5.0 ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              🔥 Top Vendeur
                            </span>
                          ) : prod.uniqueVisitors > 200 ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              ⚠️ À Optimiser
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              ⭐ Standard
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
                            <Package className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Aucune donnée produit pour le moment
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Les visites et conversions de vos fiches produits s'afficheront ici dès les premiers clics de vos visiteurs.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Acquisition & WhatsApp Rescue Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl admin-surface bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Commandes Directes Formulaire COD</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                {storefrontData?.channels?.webOrders ?? 0} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">commandes</span>
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {storefrontData?.channels?.webPercentage ?? 0}% du volume total finalisé
              </div>
            </div>

            <div className="p-6 rounded-3xl admin-surface bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Commandes Sauvées via WhatsApp</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <MessageCircle className="w-5 h-5" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                +{storefrontData?.channels?.whatsappRescues ?? 0} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">sauvées</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {storefrontData?.channels?.whatsappPercentage ?? 0}% de ventes récupérées en 1-clic après hésitation
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POST-PURCHASE DATABASE OPERATIONS & NET PROFIT */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          {analytics.totalOrders === 0 && (
            <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Boutique en attente de premières commandes</h3>
                  <p className="text-xs text-slate-400">
                    Dès que vos premiers clients valident des commandes en Cash on Delivery, vous suivrez ici votre taux de livraison réel, vos marges nettes et vos villes les plus rentables.
                  </p>
                </div>
              </div>
              <a
                href={`/${storeSlug}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
              >
                Tester ma boutique ↗
              </a>
            </div>
          )}

          {/* 4 Moroccan Operational KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Taux de Livraison */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/70 space-y-2 bento-card shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Taux de Livraison (Réussite)</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Truck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {analytics.deliveryRate}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Moyenne marché Maroc : 75-80%
              </div>
            </div>

            {/* Taux de Confirmation */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/70 space-y-2 bento-card shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Taux de Confirmation</span>
                <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Phone className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {analytics.confirmationRate}%
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Performance call center excellente
              </div>
            </div>

            {/* Taux de Retour */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/70 space-y-2 bento-card shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>Taux de Retour</span>
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <AlertOctagon className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
                {analytics.returnRate}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Contrôlé grâce à la vérification WhatsApp
              </div>
            </div>

            {/* Bénéfice Net Estimé */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 space-y-2 bento-card shadow-xs">
              <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                <span>Bénéfice Net Réel</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {analytics.netProfit.toLocaleString()} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">DH</span>
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Après déduction coût produit & transporteurs
              </div>
            </div>
          </div>

          {/* Interactive Recharts COD Cashflow Stream */}
          <CodCashflowChart data={operationsData?.dailyCashflow} currency="MAD" />

          {/* 2-Column Grid: Order Pipeline Velocity & Regional Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderVelocityChart 
              currency="MAD" 
              data={analytics.pipelineStages} 
            />
            <RegionalDistributionChart 
              currency="MAD"
              data={analytics.cityDistribution.map((cd: any, idx: any) => ({
                name: cd.city,
                value: cd.rate,
                revenue: cd.revenue,
                deliveryRate: cd.deliveryRate ?? 0,
                color: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][idx % 6]
              }))}
            />
          </div>

          {/* Real Top Products SKU Realized Cashflow & Return Risk */}
          <TopProductsPerformanceChart 
            currency="MAD" 
            data={analytics.topProducts} 
          />

          {/* Net Profit Calculation Formula Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Décomposition du Bénéfice Réel</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400">CA Encaissé (Colis Livrés) :</div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  +{analytics.totalRevenueDelivered.toLocaleString()} DH
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400">Coût Marchandise & Packaging :</div>
                <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-1">
                  -{(operationsData?.totalCostOfGoods ?? Math.round(analytics.totalRevenueDelivered * 0.35)).toLocaleString()} DH
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 dark:text-slate-400">Frais de Livraison & Retours :</div>
                <div className="text-lg font-black text-rose-600 dark:text-rose-400 mt-1">
                  -{(operationsData?.totalShippingPaid ?? Math.round(analytics.totalOrders * 22)).toLocaleString()} DH
                </div>
              </div>
            </div>
          </div>

          {/* City by City Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-500 dark:text-sky-400" /> Taux de Livraison par Ville Marocaine
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identifiez les villes les plus rentables pour optimiser vos budgets publicitaires Facebook/TikTok.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 font-semibold">
                    <th className="py-3 px-4">Ville</th>
                    <th className="py-3 px-4">Volume Commandes</th>
                    <th className="py-3 px-4">Chiffre d&apos;Affaires</th>
                    <th className="py-3 px-4">Taux de Livraison</th>
                    <th className="py-3 px-4 text-right">Rentabilité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {analytics.cityDistribution.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                        Aucune commande enregistrée pour l'instant. Les statistiques par ville apparaîtront dès vos premières ventes.
                      </td>
                    </tr>
                  ) : (
                    analytics.cityDistribution.map((item: any, idx: any) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white text-sm">
                          {item.city}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {item.orders} colis
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                          {item.revenue.toLocaleString()} DH
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full"
                                style={{ width: `${item.deliveryRate ?? item.rate}%` }}
                              />
                            </div>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{item.deliveryRate ?? item.rate}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Top Rentable
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Actionable Lead Recovery Slide-Over Drawer ── */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#0e1217] border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Relance Paniers Abandonnés</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {abandonedOrders.length} {abandonedOrders.length === 1 ? 'Prospect Récupérable' : 'Prospects Récupérables'}
                </h3>
              </div>
              <button
                onClick={() => setIsRecoveryOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Leads List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3.5">
              {abandonedOrders.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aucun panier abandonné en attente</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Tous vos prospects ont complété leur commande ou ont déjà été convertis !
                  </p>
                </div>
              ) : (
                abandonedOrders.map((lead) => {
                  const isConverted = convertedOrderIds.has(lead.id);
                  const isConverting = convertingOrderId === lead.id;
                  const item = lead.items?.[0];

                  return (
                    <div
                      key={lead.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151921] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-xs"
                    >
                      {/* Top Row: Customer & Time */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{lead.customerName || 'Prospect Anonyme'}</span>
                            {lead.countryCode && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                                {lead.countryCode}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            {lead.phone}
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* City & Address */}
                      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold">{lead.city}</span>
                        {lead.address && lead.address !== 'Coordonnées incomplètes' && (
                          <span className="text-slate-400 dark:text-slate-500 truncate max-w-[200px]">• {lead.address}</span>
                        )}
                      </div>

                      {/* Product & Price */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c0f14] border border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between text-xs">
                        <div className="truncate pr-2">
                          <span className="font-bold text-slate-900 dark:text-white">{item?.title || 'Produit'}</span>
                          {item?.variant && <span className="text-slate-500 text-[11px] block">{item.variant}</span>}
                        </div>
                        <div className="font-mono font-black text-slate-900 dark:text-white shrink-0 text-sm">
                          {lead.total} <span className="text-xs text-emerald-600 dark:text-emerald-400 font-sans">{lead.currency || 'DH'}</span>
                        </div>
                      </div>

                      {/* 1-Click Action Buttons */}
                      {isConverted ? (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Commande Confirmée ✓ ({lead.orderNumber})</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <a
                            href={buildWhatsAppLink(lead, 'abandoned', storeSlug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                            title="Ouvrir WhatsApp avec script pré-rempli"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${lead.phone}`}
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
                            title="Appeler directement le client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Appeler</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleConvertLead(lead.id)}
                            disabled={isConverting}
                            className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                            title="Créer la commande officielle"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>{isConverting ? '...' : 'Convertir'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0c0f14] flex items-center justify-between">
              <a
                href={`/admin/orders?store=${encodeURIComponent(storeSlug)}&filter=abandoned`}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Voir tous les abandons dans Commandes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsRecoveryOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
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

function ChevronRightSmall() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default AnalyticsContent;
