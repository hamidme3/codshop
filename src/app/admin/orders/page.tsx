'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, Search, Phone, MessageCircle, Truck, 
  CheckCircle2, Clock, Download, Check, X, DollarSign,
  RotateCcw, FileSpreadsheet, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { getOrders, updateOrderStatus, Order, OrderStatus } from '@/lib/backoffice';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildWhatsAppLink, WhatsAppTemplateType } from '@/lib/whatsapp-templates';
import { exportCourierManifest, CourierKey, ShippingCourier } from '@/lib/courier-manifest';

function OrdersContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>(getOrders(storeSlug));
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Bulk Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeWaOrderId, setActiveWaOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Escape key dismiss listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrder(null);
        setIsExportOpen(false);
        setActiveWaOrderId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filterMap: Record<string, OrderStatus[]> = {
    all: ['new', 'to_confirm', 'confirmed', 'shipped', 'shipping', 'delivered', 'returned', 'canceled'],
    new: ['new'],
    to_confirm: ['to_confirm'],
    confirmed: ['confirmed'],
    shipped: ['shipped', 'shipping'],
    delivered: ['delivered'],
    returned: ['returned', 'canceled'],
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = filterMap[activeFilter]?.includes(o.status);
      const q = searchQuery.toLowerCase();
      const name = (o.customerName ?? '').toLowerCase();
      const phone = (o.phone ?? '').toLowerCase();
      const num = (o.orderNumber ?? '').toLowerCase();
      const city = (o.city ?? '').toLowerCase();
      const matchesQuery =
        name.includes(q) || phone.includes(q) || num.includes(q) || city.includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [orders, activeFilter, searchQuery]);

  const confirmedCount = useMemo(() => orders.filter((o) => o.status === 'confirmed').length, [orders]);
  const shippedCount = useMemo(() => orders.filter((o) => ['shipped', 'shipping'].includes(o.status)).length, [orders]);
  const deliveredCount = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders]);
  const returnedCount = useMemo(() => orders.filter((o) => ['returned', 'canceled'].includes(o.status)).length, [orders]);
  const newCount = useMemo(() => orders.filter((o) => ['new', 'to_confirm'].includes(o.status)).length, [orders]);

  // 1-Click Fast Status Transition
  const handleQuickTransition = (orderId: string, newStatus: OrderStatus, tracking?: string, courier?: Order['courier']) => {
    updateOrderStatus(orderId, newStatus, tracking, courier);
    setOrders([...getOrders(storeSlug)]);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, trackingNumber: tracking || selectedOrder.trackingNumber });
    }
    const statusLabels: Record<string, string> = {
      confirmed: 'Confirmée ✓',
      shipped: 'Expédiée 🚚',
      delivered: 'Livrée & Encaissée 💰',
      returned: 'Retournée (Refus / Retour) ↩',
      canceled: 'Retournée (Refus / Retour) ↩',
    };
    showToast(`Commande ${orderId} passée à "${statusLabels[newStatus] || newStatus}"`);
  };

  // 1-Click Fast Dispatch with Moroccan Couriers
  const handleQuickDispatch = (orderId: string, courier: ShippingCourier = 'ozon') => {
    const existingOrder = orders.find((o) => o.id === orderId);
    const courierPrefix = courier.toUpperCase();
    const tracking = existingOrder?.trackingNumber || `${courierPrefix}-MA-${Math.floor(100000 + Math.random() * 900000)}`;
    handleQuickTransition(orderId, 'shipped', tracking, courier);
  };

  // Bulk Operations
  const handleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkConfirm = () => {
    selectedOrderIds.forEach((id) => updateOrderStatus(id, 'confirmed'));
    setOrders([...getOrders(storeSlug)]);
    showToast(`${selectedOrderIds.length} commandes confirmées en 1 clic !`);
    setSelectedOrderIds([]);
  };

  const handleBulkDispatch = (courier: ShippingCourier = 'ozon') => {
    selectedOrderIds.forEach((id) => {
      const existing = orders.find((o) => o.id === id);
      const tracking = existing?.trackingNumber || `${courier.toUpperCase()}-MA-${Math.floor(100000 + Math.random() * 900000)}`;
      updateOrderStatus(id, 'shipped', tracking, courier);
    });
    setOrders([...getOrders(storeSlug)]);
    showToast(`${selectedOrderIds.length} commandes expédiées avec ${courier.toUpperCase()} !`);
    setSelectedOrderIds([]);
  };

  // 1-Click Filtered Export for Confirmed, Shipped, Delivered, Returned, or Current View
  const handleExportByStatus = (statusFilter: 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'current', courier: CourierKey = 'standard') => {
    let ordersToExport: Order[] = [];
    let label = '';

    if (statusFilter === 'confirmed') {
      ordersToExport = orders.filter((o) => o.status === 'confirmed');
      label = 'Commandes Confirmées';
    } else if (statusFilter === 'shipped') {
      ordersToExport = orders.filter((o) => ['shipped', 'shipping'].includes(o.status));
      label = 'Commandes Expédiées';
    } else if (statusFilter === 'delivered') {
      ordersToExport = orders.filter((o) => o.status === 'delivered');
      label = 'Commandes Livrées & Encaissées';
    } else if (statusFilter === 'returned') {
      ordersToExport = orders.filter((o) => ['returned', 'canceled'].includes(o.status));
      label = 'Commandes Retournées (Refus / Retours)';
    } else {
      ordersToExport = selectedOrderIds.length > 0
        ? orders.filter((o) => selectedOrderIds.includes(o.id))
        : filteredOrders;
      label = `Commandes Affichées (${ordersToExport.length})`;
    }

    if (ordersToExport.length === 0) {
      showToast(`Aucune commande disponible pour : ${label}.`);
      return;
    }

    const result = exportCourierManifest(courier, ordersToExport, `${storeSlug}_${statusFilter}`);
    const blob = new Blob([result.content], { type: result.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExportOpen(false);
    showToast(`Export ${label} téléchargé (${result.orderCount} commandes - Total: ${result.totalCrbt} DH)`);
  };

  // Export Manifest Engine (CSV download)
  const handleExportManifest = (courier: CourierKey = 'standard') => {
    let ordersToExport: Order[] = [];
    if (selectedOrderIds.length > 0) {
      ordersToExport = orders.filter((o) => selectedOrderIds.includes(o.id));
    } else if (activeFilter === 'all' || activeFilter === 'new') {
      ordersToExport = orders.filter((o) => ['confirmed', 'shipped', 'shipping'].includes(o.status));
    } else {
      ordersToExport = filteredOrders.filter((o) => !['canceled', 'returned'].includes(o.status));
    }

    if (ordersToExport.length === 0) {
      showToast(`Aucune commande prête pour expédition (${courier.toUpperCase()}).`);
      return;
    }

    const result = exportCourierManifest(courier, ordersToExport, `${storeSlug}_manifest`);
    const blob = new Blob([result.content], { type: result.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExportOpen(false);
    showToast(`Manifeste ${courier.toUpperCase()} téléchargé (${result.orderCount} commandes - ${result.totalCrbt} DH)`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">Nouvelle</span>;
      case 'to_confirm':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">À Confirmer</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Confirmée</span>;
      case 'shipped':
      case 'shipping':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Expédiée</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Livrée & Encaissée</span>;
      case 'returned':
      case 'canceled':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">Retournée</span>;
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-black text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-slate-950" /> {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-amber-400" /> Pipeline Commandes COD Maroc
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gestion 1-Clic, confirmation WhatsApp en Darija & Manifestes transporteurs (Ozon, SendIt, Cathedis, Amana).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export CSV Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 shadow-md transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exporter CSV</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-40 space-y-1 text-xs">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Export 1-Clic par Statut</span>
                  <span className="text-amber-400">Excel / Sheets</span>
                </div>
                <button
                  onClick={() => handleExportByStatus('confirmed')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>1-Clic : Confirmées ({confirmedCount})</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleExportByStatus('shipped')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span>1-Clic : Expédiées ({shippedCount})</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                </button>
                <button
                  onClick={() => handleExportByStatus('delivered')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>1-Clic : Livrées ({deliveredCount})</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                </button>
                <button
                  onClick={() => handleExportByStatus('returned')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>1-Clic : Retournées ({returnedCount})</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                </button>
                <button
                  onClick={() => handleExportByStatus('current')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-between"
                >
                  <span>📄 Filtre Actuel ({filteredOrders.length})</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-b border-slate-800 mt-1">
                  Formats Transporteurs Spécifiques
                </div>
                <button
                  onClick={() => handleExportManifest('ozon')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                >
                  <span>📦 Ozon Express (.csv)</span>
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                </button>
                <button
                  onClick={() => handleExportManifest('sendit')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                >
                  <span>📦 SendIt Express (.csv)</span>
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleExportManifest('cathedis')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                >
                  <span>📦 Cathedis (.csv)</span>
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                </button>
                <button
                  onClick={() => handleExportManifest('amana')}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-between"
                >
                  <span>📦 Amana Poste Maroc (.csv)</span>
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                </button>
              </div>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            Total : <strong>{orders.length}</strong> ({deliveredCount} Livrées, {returnedCount} Retournées)
          </div>
        </div>
      </div>

      {/* Filter Tabs with Live Counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
        {[
          { id: 'all', label: `Toutes (${orders.length})` },
          { id: 'new', label: `Nouvelles (${newCount})` },
          { id: 'confirmed', label: `Confirmées (${confirmedCount})` },
          { id: 'shipped', label: `Expédiées (${shippedCount})` },
          { id: 'delivered', label: `Livrées (${deliveredCount})` },
          { id: 'returned', label: `Retournées (${returnedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
              activeFilter === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1-Click Status Export Toolbar (Direct filtered exports) */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl text-xs overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-1">
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export 1-Clic :
          </span>
          <button
            onClick={() => handleExportByStatus('confirmed')}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Télécharger immédiatement toutes les commandes confirmées prêtes pour expédition"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Confirmées ({confirmedCount})</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <button
            onClick={() => handleExportByStatus('shipped')}
            className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Télécharger immédiatement toutes les commandes expédiées en cours de livraison"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Expédiées ({shippedCount})</span>
            <Truck className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => handleExportByStatus('delivered')}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Télécharger immédiatement toutes les commandes livrées et encaissées (CRBT)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Livrées ({deliveredCount})</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            onClick={() => handleExportByStatus('returned')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Télécharger immédiatement toutes les commandes retournées ou refusées pour rapprochement transporteur"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Retournées ({returnedCount})</span>
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          </button>
        </div>

        <div className="text-[11px] text-slate-400 pr-2 shrink-0 hidden lg:block">
          ⚡ 1-Clic pour exporter sans sélection manuelle
        </div>
      </div>

      {/* Bulk Action Bar (Appears when items are selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[11px]">
              {selectedOrderIds.length}
            </span>
            <span className="font-bold">commandes sélectionnées pour traitement par lot</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkConfirm}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Confirmer la sélection
            </button>
            <button
              onClick={() => handleBulkDispatch('ozon')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" /> Expédier avec Ozon
            </button>
            <button
              onClick={() => handleExportManifest('standard')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-500 shadow-sm"
              title="Exporter les commandes sélectionnées au format CSV universel"
            >
              <Download className="w-3.5 h-3.5" /> Exporter CSV ({selectedOrderIds.length})
            </button>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-semibold"
            >
              Désélectionner
            </button>
          </div>
        </div>
      )}

      {/* Search & Counter Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par N° commande, client, téléphone (06...), ville..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          <strong>{filteredOrders.length}</strong> commande(s) affichée(s)
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50 font-semibold">
                <th className="py-2.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Commande</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Ville</th>
                <th className="py-2.5 px-3">Articles</th>
                <th className="py-2.5 px-3">Montant COD</th>
                <th className="py-2.5 px-3">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions Rapides 1-Clic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    Aucune commande trouvée pour ce filtre.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const isWaOpen = activeWaOrderId === order.id;

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-amber-500/5' : ''}`}
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="font-mono font-bold text-amber-400 hover:underline"
                        >
                          {order.orderNumber}
                        </button>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{order.phone}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-200">{order.city}</span>
                          {order.deliveryType === 'stopdesk' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                              🏢 Stopdesk
                            </span>
                          )}
                          {order.abVariant && (
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                              order.abVariant === 'waybill'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {order.abVariant}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{order.address}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-slate-200 font-medium flex items-center gap-1.5 flex-wrap">
                          <span>{order.items[0]?.title}</span>
                          {order.items[0]?.sku && (
                            <span className="font-mono text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded border border-slate-700">
                              {order.items[0].sku}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 flex-wrap">
                          <span>x{order.items[0]?.quantity}</span>
                          {order.items[0]?.variant && <span className="text-slate-300">• {order.items[0].variant}</span>}
                          {order.items[0]?.color && <span className="text-amber-200/90">• {order.items[0].color}</span>}
                          {order.items[0]?.size && <span className="bg-slate-800 text-cyan-300 px-1 py-0.2 rounded text-[9px] font-bold">T.{order.items[0].size}</span>}
                          {order.items.length > 1 && <span className="text-slate-500 font-medium">(+{order.items.length - 1} autre)</span>}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-extrabold text-white text-sm tabular-nums">{order.total} DH</div>
                        <div className="text-[10px] text-slate-400">Livraison : {order.shippingFee} DH</div>
                      </td>

                      <td className="py-2.5 px-3">
                        {getStatusBadge(order.status)}
                        {order.trackingNumber && (
                          <div className="text-[10px] font-mono text-cyan-400 mt-1">
                            {order.trackingNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* WhatsApp Darija Smart Button with Template Chooser */}
                          <div className="relative">
                            <a
                              href={buildWhatsAppLink(order, 'confirmation', storeSlug)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors flex items-center gap-1"
                              title="Confirmer via WhatsApp Darija"
                            >
                              <MessageCircle className="w-4 h-4 fill-current" />
                            </a>
                            <button
                              onClick={() => setActiveWaOrderId(isWaOpen ? null : order.id)}
                              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-[9px] border border-slate-700"
                              title="Modèles Darija WhatsApp"
                            >
                              ▾
                            </button>

                            {isWaOpen && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={() => setActiveWaOrderId(null)} />
                                <div className="absolute right-0 top-8 w-56 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-30 text-[11px] space-y-1">
                                <div className="text-[9px] font-bold uppercase text-slate-500 px-2 py-1">
                                  Modèles Darija WhatsApp
                                </div>
                                <a
                                  href={buildWhatsAppLink(order, 'confirmation', storeSlug)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                                  onClick={() => setActiveWaOrderId(null)}
                                >
                                  🟢 1. Confirmation Darija
                                </a>
                                <a
                                  href={buildWhatsAppLink(order, 'unreachable', storeSlug)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                                  onClick={() => setActiveWaOrderId(null)}
                                >
                                  📞 2. Relance Injoignable
                                </a>
                                <a
                                  href={buildWhatsAppLink(order, 'gps_request', storeSlug)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                                  onClick={() => setActiveWaOrderId(null)}
                                >
                                  📍 3. Demande Localisation GPS
                                </a>
                                <a
                                  href={buildWhatsAppLink(order, 'shipped', storeSlug)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-2 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                                  onClick={() => setActiveWaOrderId(null)}
                                >
                                  🚚 4. Avis d&apos;Expédition
                                </a>
                              </div>
                            </>
                          )}
                          </div>

                          {/* Direct Call */}
                          <a
                            href={`tel:${order.phone}`}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Appeler le client"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* ── Order Pipeline: Confirmed -> Shipped -> Delivered | Retournée ── */}
                          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 shadow-inner">
                            {/* Switch 1: Confirmed Switch */}
                            <button
                              onClick={() => handleQuickTransition(order.id, 'confirmed')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                                order.status === 'confirmed'
                                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-400'
                                  : ['shipped', 'shipping', 'delivered'].includes(order.status)
                                  ? 'bg-cyan-950/60 text-cyan-400/70 border border-cyan-800/40'
                                  : 'bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white font-bold'
                              }`}
                              title={order.status === 'confirmed' ? 'Statut : Confirmée (Actuel)' : 'Basculer vers : 1. Confirmée'}
                            >
                              <Check className="w-3 h-3" />
                              <span>1. Confirmer</span>
                            </button>

                            <span className="text-slate-600 text-[10px] font-bold">→</span>

                            {/* Switch 2: Shipped Switch */}
                            <button
                              onClick={() => handleQuickDispatch(order.id, order.courier || 'ozon')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                                ['shipped', 'shipping'].includes(order.status)
                                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
                                  : order.status === 'delivered'
                                  ? 'bg-amber-950/60 text-amber-400/70 border border-amber-800/40'
                                  : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold'
                              }`}
                              title={['shipped', 'shipping'].includes(order.status) ? 'Statut : Expédiée (Actuel)' : 'Basculer vers : 2. Expédier'}
                            >
                              <Truck className="w-3 h-3" />
                              <span>2. Expédier</span>
                            </button>

                            <span className="text-slate-600 text-[10px] font-bold">→</span>

                            {/* Switch 3: Delivered Switch */}
                            <button
                              onClick={() => handleQuickTransition(order.id, 'delivered')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400 font-black'
                                  : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 font-bold'
                              }`}
                              title={order.status === 'delivered' ? 'Statut : Livrée & Encaissée (Actuel)' : 'Basculer vers : 3. Livrée (Encaissée)'}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>3. Livrée</span>
                            </button>

                            <span className="text-slate-700 text-[10px] font-bold mx-0.5">|</span>

                            {/* Switch 4: Retournée (Replaces both Annuler & Retour) */}
                            <button
                              onClick={() => handleQuickTransition(order.id, order.status === 'returned' || order.status === 'canceled' ? 'new' : 'returned')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                                order.status === 'returned' || order.status === 'canceled'
                                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400 font-black'
                                  : 'bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 font-bold'
                              }`}
                              title={
                                order.status === 'returned' || order.status === 'canceled'
                                  ? 'Colis Retourné / Refusé (Cliquer pour réactiver)'
                                  : 'Basculer vers : 4. Retournée (Refus / Annulation)'
                              }
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>4. Retournée</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-mono">Détails de la commande</span>
                <h3 className="text-lg font-black text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-slate-400">Client :</div>
                  <div className="font-bold text-white text-sm">{selectedOrder.customerName}</div>
                  <div className="text-slate-300 font-mono">{selectedOrder.phone}</div>
                </div>
                <div>
                  <div className="text-slate-400">Destination :</div>
                  <div className="font-bold text-white text-sm">{selectedOrder.city}</div>
                  <div className="text-slate-300">{selectedOrder.address}</div>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mettre à jour le statut :</label>
                <select
                  value={selectedOrder.status === 'shipping' ? 'shipped' : selectedOrder.status === 'canceled' ? 'returned' : selectedOrder.status}
                  onChange={(e) => handleQuickTransition(selectedOrder.id, e.target.value as OrderStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="new">Nouvelle (À Valider)</option>
                  <option value="to_confirm">À Confirmer (Injoignable)</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="shipped">Expédiée (En Livraison)</option>
                  <option value="delivered">Livrée & Encaissée</option>
                  <option value="returned">Retournée (Refus / Annulation)</option>
                </select>

                {/* Quick 4-Stage Transition Switches */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => handleQuickTransition(selectedOrder.id, 'confirmed')}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      selectedOrder.status === 'confirmed'
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900 text-cyan-400 hover:bg-cyan-950/60 border border-cyan-800/40'
                    }`}
                  >
                    ✓ 1. Confirmer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDispatch(selectedOrder.id, selectedOrder.courier || 'ozon')}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      ['shipped', 'shipping'].includes(selectedOrder.status)
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900 text-amber-400 hover:bg-amber-950/60 border border-amber-800/40'
                    }`}
                  >
                    🚚 2. Expédier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTransition(selectedOrder.id, 'delivered')}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-900 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-800/40'
                    }`}
                  >
                    💰 3. Livrée
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTransition(selectedOrder.id, selectedOrder.status === 'returned' || selectedOrder.status === 'canceled' ? 'new' : 'returned')}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center ${
                      selectedOrder.status === 'returned' || selectedOrder.status === 'canceled'
                        ? 'bg-rose-500 text-white font-black shadow-sm'
                        : 'bg-slate-900 text-rose-400 hover:bg-rose-950/60 border border-rose-800/40'
                    }`}
                  >
                    ↩ 4. Retournée
                  </button>
                </div>
              </div>

              {/* Items Summary */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-300 flex items-center justify-between">
                  <span>Articles à emballer (Derb Ghallef / Aïn Sebaâ) :</span>
                  <span className="text-[10px] text-slate-400 font-mono">Bordereau Colis</span>
                </div>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-200 py-1 border-b border-slate-900 last:border-0">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold">{item.title}</span>
                        {item.sku && (
                          <span className="font-mono text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                            {item.sku}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>Qté : x{item.quantity}</span>
                        {item.variant && <span>• {item.variant}</span>}
                        {item.color && <span className="text-slate-300">• Couleur : {item.color}</span>}
                        {item.size && <span className="text-cyan-400 font-bold">• Pointure/Taille : {item.size}</span>}
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-100">{item.price * item.quantity} DH</span>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-sm">
                  <span>Total à encaisser (COD) :</span>
                  <span className="text-amber-400">{selectedOrder.total} DH</span>
                </div>
              </div>

              {selectedOrder.agentNotes && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Notes de l&apos;agent :</div>
                  <div className="text-slate-300 italic">{selectedOrder.agentNotes}</div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  const result = exportCourierManifest('standard', [selectedOrder], storeSlug);
                  const blob = new Blob([result.content], { type: result.mimeType });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `commande_${selectedOrder.orderNumber}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  showToast(`Commande ${selectedOrder.orderNumber} exportée en CSV`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" /> Exporter en CSV
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
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

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement des commandes...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
