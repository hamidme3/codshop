'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, Search, Phone, MessageCircle, Truck, 
  CheckCircle2, Clock, Download, Check, X, DollarSign,
  RotateCcw, FileSpreadsheet, ChevronDown, ChevronUp, AlertCircle, Trash2, Copy,
  Columns, Layers, Printer
} from 'lucide-react';
import { getOrders, updateOrderStatus, deleteOrder, Order, OrderStatus } from '@/lib/backoffice';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  buildWhatsAppLink, 
  WhatsAppTemplateType, 
  getCourierManifestWhatsAppText, 
  buildManifestWhatsAppLink 
} from '@/lib/whatsapp-templates';
import { 
  exportCourierManifest, 
  generateBonDeRamassageHtml, 
  CourierKey, 
  ShippingCourier 
} from '@/lib/courier-manifest';

function OrdersContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>(() => getOrders(storeSlug));
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const fetchLiveOrders = React.useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoadingLive(true);
      const res = await fetch(`/api/admin/orders?store=${encodeURIComponent(storeSlug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.warn('[Admin Orders] Could not fetch live orders, using fallback:', err);
    } finally {
      if (!silent) setIsLoadingLive(false);
    }
  }, [storeSlug]);

  useEffect(() => {
    // Initial sync from memory
    setOrders(getOrders(storeSlug));
    // Fetch live from database
    fetchLiveOrders();
  }, [storeSlug, fetchLiveOrders]);

  // Bulk Selection State
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeWaOrderId, setActiveWaOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manifest & Dispatch Modal State (Option 1 + WhatsApp Share)
  const [manifestModal, setManifestModal] = useState<{
    isOpen: boolean;
    label: string;
    filterKey: 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'current' | 'selected';
    orders: Order[];
    courier: CourierKey;
    driverPhone: string;
    autoShip: boolean;
    showPreviewText: boolean;
    copied: boolean;
  }>({
    isOpen: false,
    label: '',
    filterKey: 'confirmed',
    orders: [],
    courier: 'ozon',
    driverPhone: '',
    autoShip: false,
    showPreviewText: false,
    copied: false,
  });

  // Global Escape key dismiss listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedOrder(null);
        setIsExportOpen(false);
        setActiveWaOrderId(null);
        setManifestModal((prev) => ({ ...prev, isOpen: false }));
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

  // Kanban Stage Columns for Tactical Pipeline View
  const kanbanColumns = useMemo(() => [
    {
      id: 'to_confirm',
      title: '1. À Confirmer',
      statuses: ['new', 'to_confirm'] as OrderStatus[],
      dot: 'bg-sky-400',
      pillClass: 'stage-pill-to_confirm',
      totalMad: orders.filter((o) => ['new', 'to_confirm'].includes(o.status)).reduce((acc, o) => acc + (Number(o.total) || 0), 0),
    },
    {
      id: 'confirmed',
      title: '2. Confirmées',
      statuses: ['confirmed'] as OrderStatus[],
      dot: 'bg-cyan-400',
      pillClass: 'stage-pill-confirmed',
      totalMad: orders.filter((o) => o.status === 'confirmed').reduce((acc, o) => acc + (Number(o.total) || 0), 0),
    },
    {
      id: 'shipped',
      title: '3. En Transit',
      statuses: ['shipped', 'shipping'] as OrderStatus[],
      dot: 'bg-sky-400',
      pillClass: 'stage-pill-shipped',
      totalMad: orders.filter((o) => ['shipped', 'shipping'].includes(o.status)).reduce((acc, o) => acc + (Number(o.total) || 0), 0),
    },
    {
      id: 'delivered',
      title: '4. Livrées',
      statuses: ['delivered'] as OrderStatus[],
      dot: 'bg-emerald-400',
      pillClass: 'stage-pill-delivered',
      totalMad: orders.filter((o) => o.status === 'delivered').reduce((acc, o) => acc + (Number(o.total) || 0), 0),
    },
    {
      id: 'returned',
      title: '5. Retours / Refus',
      statuses: ['returned', 'canceled'] as OrderStatus[],
      dot: 'bg-rose-400',
      pillClass: 'stage-pill-returned',
      totalMad: orders.filter((o) => ['returned', 'canceled'].includes(o.status)).reduce((acc, o) => acc + (Number(o.total) || 0), 0),
    },
  ], [orders]);

  // 1-Click Fast Status Transition
  const handleQuickTransition = (orderId: string, newStatus: OrderStatus, tracking?: string, courier?: Order['courier']) => {
    updateOrderStatus(orderId, newStatus, tracking, courier);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? {
              ...o,
              status: newStatus,
              trackingNumber: tracking || o.trackingNumber,
              courier: courier || o.courier,
            }
          : o
      )
    );
    if (selectedOrder?.id === orderId || selectedOrder?.orderNumber === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        trackingNumber: tracking || selectedOrder.trackingNumber,
        courier: courier || selectedOrder.courier,
      });
    }

    // Persist to PostgreSQL database asynchronously
    fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeSlug, orderId, status: newStatus, trackingNumber: tracking, courier }),
    }).catch(() => {});

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
    const existingOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
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
    selectedOrderIds.forEach((id) => {
      updateOrderStatus(id, 'confirmed');
      fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeSlug, orderId: id, status: 'confirmed' }),
      }).catch(() => {});
    });
    setOrders((prev) =>
      prev.map((o) => (selectedOrderIds.includes(o.id) ? { ...o, status: 'confirmed' as const } : o))
    );
    showToast(`${selectedOrderIds.length} commandes confirmées en 1 clic !`);
    setSelectedOrderIds([]);
  };

  const handleBulkDispatch = (courier: ShippingCourier = 'ozon') => {
    selectedOrderIds.forEach((id) => {
      const existing = orders.find((o) => o.id === id || o.orderNumber === id);
      const tracking = existing?.trackingNumber || `${courier.toUpperCase()}-MA-${Math.floor(100000 + Math.random() * 900000)}`;
      updateOrderStatus(id, 'shipped', tracking, courier);
      fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeSlug, orderId: id, status: 'shipped', trackingNumber: tracking, courier }),
      }).catch(() => {});
    });
    setOrders((prev) =>
      prev.map((o) =>
        selectedOrderIds.includes(o.id)
          ? { ...o, status: 'shipped' as const, courier }
          : o
      )
    );
    showToast(`${selectedOrderIds.length} commandes expédiées avec ${courier.toUpperCase()} !`);
    setSelectedOrderIds([]);
  };

  const handleDeleteSingleOrder = (orderId: string) => {
    if (confirm(`Confirmez-vous la suppression définitive de la commande #${orderId} ?`)) {
      deleteOrder(orderId, storeSlug);
      setOrders((prev) => prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId));
      if (selectedOrder?.id === orderId || selectedOrder?.orderNumber === orderId) setSelectedOrder(null);
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
      fetch(`/api/admin/orders?orderId=${encodeURIComponent(orderId)}&store=${encodeURIComponent(storeSlug)}`, {
        method: 'DELETE',
      }).catch(() => {});
      showToast(`Commande #${orderId} supprimée.`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrderIds.length === 0) return;
    if (confirm(`Voulez-vous vraiment supprimer définitivement ces ${selectedOrderIds.length} commandes sélectionnées ?`)) {
      selectedOrderIds.forEach((id) => {
        deleteOrder(id, storeSlug);
        fetch(`/api/admin/orders?orderId=${encodeURIComponent(id)}&store=${encodeURIComponent(storeSlug)}`, {
          method: 'DELETE',
        }).catch(() => {});
      });
      setOrders((prev) => prev.filter((o) => !selectedOrderIds.includes(o.id)));
      showToast(`${selectedOrderIds.length} commandes supprimées avec succès.`);
      setSelectedOrderIds([]);
      if (selectedOrder && selectedOrderIds.includes(selectedOrder.id)) setSelectedOrder(null);
    }
  };

  const courierNames: Record<CourierKey, string> = {
    standard: 'Standard Universel',
    ozon: 'Ozon Express',
    sendit: 'Sendit Maroc',
    cathedis: 'Cathedis',
    amana: 'Amana Poste Maroc',
    manual: 'Livraison Interne / Manuel',
  };

  // Open Manifest & WhatsApp Dispatch Modal (Option 1 + WhatsApp Share)
  const handleOpenManifestModal = (
    statusFilter: 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'current' | 'selected',
    preferredCourier: CourierKey = 'ozon'
  ) => {
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
    } else if (statusFilter === 'selected') {
      ordersToExport = orders.filter((o) => selectedOrderIds.includes(o.id));
      label = `Sélection (${ordersToExport.length} commandes)`;
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

    setManifestModal({
      isOpen: true,
      label,
      filterKey: statusFilter,
      orders: ordersToExport,
      courier: preferredCourier,
      driverPhone: '',
      autoShip: statusFilter === 'confirmed' || ordersToExport.some((o) => o.status === 'confirmed'),
      showPreviewText: false,
      copied: false,
    });
    setIsExportOpen(false);
  };

  // 1-Click Filtered Export opens the Manifest & WhatsApp Dispatch Modal
  const handleExportByStatus = (statusFilter: 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'current', courier: CourierKey = 'ozon') => {
    handleOpenManifestModal(statusFilter, courier);
  };

  // Specific courier triggers open the Manifest & WhatsApp Dispatch Modal
  const handleExportManifest = (courier: CourierKey = 'ozon') => {
    handleOpenManifestModal(selectedOrderIds.length > 0 ? 'selected' : 'current', courier);
  };

  // Deliberate CSV file download action triggered from the modal
  const handleExecuteDownload = () => {
    const { courier, orders: ordersToExport, filterKey, autoShip } = manifestModal;
    if (ordersToExport.length === 0) return;

    const result = exportCourierManifest(courier, ordersToExport, `${storeSlug}_${filterKey}`);
    const blob = new Blob([result.content], { type: result.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (autoShip) {
      const confirmedOrders = ordersToExport.filter((o) => o.status === 'confirmed');
      if (confirmedOrders.length > 0) {
        confirmedOrders.forEach((o) => {
          const prefix = courier === 'standard' ? 'EXP' : courier.toUpperCase();
          const tracking = o.trackingNumber || `${prefix}-MA-${Math.floor(100000 + Math.random() * 900000)}`;
          updateOrderStatus(o.id, 'shipped', tracking, courier === 'standard' ? 'ozon' : (courier as ShippingCourier));
        });
        setOrders([...getOrders(storeSlug)]);
        showToast(`${confirmedOrders.length} commande(s) passée(s) en « Expédiée » avec tracking !`);
      }
    }

    showToast(`Bordereau ${courier.toUpperCase()} téléchargé (${result.orderCount} colis - ${result.totalCrbt} DH)`);
    setManifestModal((prev) => ({ ...prev, isOpen: false }));
  };

  const manifestTotalCrbt = useMemo(() => {
    return manifestModal.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [manifestModal.orders]);

  const manifestCitiesSummary = useMemo(() => {
    const cityCounts: Record<string, number> = {};
    manifestModal.orders.forEach((o) => {
      const c = o.city || 'Maroc';
      cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
    return Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => `${city} (${count})`)
      .slice(0, 3)
      .join(', ');
  }, [manifestModal.orders]);

  const manifestWhatsAppText = useMemo(() => {
    if (!manifestModal.isOpen || manifestModal.orders.length === 0) return '';
    return getCourierManifestWhatsAppText(
      manifestModal.orders,
      storeSlug,
      courierNames[manifestModal.courier] || 'Transporteur'
    );
  }, [manifestModal.isOpen, manifestModal.orders, manifestModal.courier, storeSlug]);

  const handleCopyWhatsAppManifest = async () => {
    try {
      await navigator.clipboard.writeText(manifestWhatsAppText);
      setManifestModal((prev) => ({ ...prev, copied: true }));
      showToast('Listing WhatsApp copié dans le presse-papier !');
      setTimeout(() => setManifestModal((prev) => ({ ...prev, copied: false })), 3000);
    } catch {
      showToast('Impossible de copier dans le presse-papier.');
    }
  };

  const handleSendWhatsAppManifest = () => {
    const link = buildManifestWhatsAppLink(manifestModal.driverPhone, manifestWhatsAppText);
    window.open(link, '_blank');
  };

  const handlePrintBonDeRamassage = () => {
    const html = generateBonDeRamassageHtml(
      `BDR-${storeSlug.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      manifestModal.orders,
      storeSlug,
      courierNames[manifestModal.courier] || 'Transporteur'
    );
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Copy Tracking Number State
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const copyTracking = (tracking: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(tracking);
      setCopiedTracking(tracking);
      setTimeout(() => setCopiedTracking(null), 2000);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-new font-mono">Nouvelle</span>;
      case 'to_confirm':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-to_confirm font-mono">À Confirmer</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-confirmed font-mono">1. Confirmée</span>;
      case 'shipped':
      case 'shipping':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-shipped font-mono">2. Expédiée</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-delivered font-mono">3. Livrée</span>;
      case 'returned':
      case 'canceled':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-returned font-mono">4. Retournée</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 max-w-7xl mx-auto font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#121215] border border-emerald-500/40 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-emerald-400" /> Pipeline Commandes COD Maroc
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              5-ÉTAPES SYNCHRONISÉES
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            Fulfillment opérationnel, expéditions multi-transporteurs (Ozon, SendIt, Cathedis, Amana) et suivi Darija.
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
                  <span className="text-emerald-400">Excel / Sheets</span>
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
                  className="w-full text-left px-3 py-2 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span>1-Clic : Expédiées ({shippedCount})</span>
                  </span>
                  <Download className="w-3.5 h-3.5 text-sky-400" />
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
                  <Download className="w-3.5 h-3.5 text-sky-400" />
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
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            )}
          </div>

          <div className="text-xs font-mono text-zinc-400 bg-[#13171c] px-3 py-2 rounded-xl border border-slate-800/70">
            Total : <strong className="text-white tabular-nums font-mono">{orders.length}</strong> ({deliveredCount} Livrées, {returnedCount} Retournées)
          </div>
        </div>
      </div>

      {/* Top Executive Bento Stage Strip (Option 2 x 3 Fusion) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {kanbanColumns.map((col) => (
          <div
            key={`bento-${col.id}`}
            onClick={() => setActiveFilter(col.id === 'to_confirm' ? 'new' : col.id)}
            className={`p-3.5 rounded-2xl bg-[#13171c] border transition-all cursor-pointer bento-card ${
              activeFilter === col.id || (col.id === 'to_confirm' && (activeFilter === 'new' || activeFilter === 'to_confirm'))
                ? 'border-emerald-500/60 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'border-slate-800/70 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className="text-[11px] font-bold text-zinc-300">{col.title}</span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${col.pillClass}`}>
                {orders.filter((o) => col.statuses.includes(o.status)).length}
              </span>
            </div>
            <div className="text-lg font-black text-white font-mono tabular-nums mt-2">
              {col.totalMad.toLocaleString('fr-MA')} <span className="text-[10px] font-sans text-zinc-400">DH</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs with Live Counts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-slate-800/80 text-xs no-scrollbar">
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
            className={`shrink-0 px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-slate-800 text-white border border-slate-700/80 shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1-Click Status Export Toolbar (Direct filtered exports) */}
      <div className="flex items-center justify-between gap-2 p-2.5 bg-[#13171c] border border-slate-800/70 rounded-xl text-xs overflow-x-auto bento-card no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 pl-1 shrink-0">
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export 1-Clic :
          </span>
          <button
            onClick={() => handleExportByStatus('confirmed')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Télécharger immédiatement toutes les commandes confirmées prêtes pour expédition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Confirmées ({confirmedCount})</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <button
            onClick={() => handleExportByStatus('shipped')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/60 border border-sky-800/50 text-sky-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Télécharger immédiatement toutes les commandes expédiées en cours de livraison"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>Expédiées ({shippedCount})</span>
            <Truck className="w-3.5 h-3.5 text-sky-400" />
          </button>
          <button
            onClick={() => handleExportByStatus('delivered')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Télécharger immédiatement toutes les commandes livrées et encaissées (CRBT)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Livrées ({deliveredCount})</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            onClick={() => handleExportByStatus('returned')}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Télécharger immédiatement toutes les commandes retournées ou refusées pour rapprochement transporteur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Retournées ({returnedCount})</span>
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
          </button>
        </div>

        <div className="text-[11px] text-zinc-500 pr-2 shrink-0 hidden lg:block font-mono">
          ⚡ Windows Excel UTF-8 BOM
        </div>
      </div>

      {/* Search, View Switcher & Counter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#13171c] border border-slate-800/70 rounded-xl p-3 bento-card">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par N° commande, client, téléphone (06...), ville..."
            className="w-full bg-[#0c0f12] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Dual-View Switcher: Table vs Kanban */}
          <div className="hidden md:flex items-center p-0.5 bg-[#0c0f12] border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black shadow-emerald-500/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Tableau</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black shadow-emerald-500/20' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Pipeline Kanban</span>
            </button>
          </div>

          <div className="text-xs text-zinc-400">
            <strong className="text-white font-mono tabular-nums">{filteredOrders.length}</strong> commande(s) affichée(s)
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (Appears when items are selected) */}
      {selectedOrderIds.length > 0 && (
        <div className="fixed bottom-16 sm:static left-3 right-3 z-40 sm:z-auto bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 text-xs text-zinc-200">
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-100 font-mono text-[11px] font-bold flex items-center justify-center">
              {selectedOrderIds.length}
            </span>
            <span className="font-medium text-zinc-300">commandes sélectionnées</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleBulkConfirm}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/50 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Confirmer
            </button>
            <button
              onClick={() => handleBulkDispatch('ozon')}
              className="px-3 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-700/50 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-sky-400" /> Expédier (Ozon)
            </button>
            <button
              onClick={() => handleExportManifest('standard')}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 font-medium text-xs flex items-center gap-1.5 transition-colors"
              title="Exporter les commandes sélectionnées au format CSV universel"
            >
              <Download className="w-3.5 h-3.5" /> Exporter CSV
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white font-medium text-xs flex items-center gap-1.5 border border-rose-700/50 transition-colors cursor-pointer"
              title="Supprimer définitivement les commandes sélectionnées"
            >
              <Trash2 className="w-3.5 h-3.5" /> Supprimer
            </button>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-colors"
            >
              Désélectionner
            </button>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="bg-[#13171c] border border-slate-800/70 rounded-xl overflow-hidden shadow-sm bento-card">
        {/* Mobile Stream (screens < md) */}
        <div className="block md:hidden divide-y divide-slate-800/60 p-2 sm:p-3 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs">
              Aucune commande trouvée pour ce filtre.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = selectedOrderIds.includes(order.id);
              return (
                <div
                  key={`mobile-${order.id}`}
                  className={`p-3 rounded-xl border transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-[#0e1217] border-slate-800/80'
                  }`}
                >
                  {/* Top row: Checkbox + Order # + Time + Status badge */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="w-4 h-4 accent-emerald-500 rounded cursor-pointer shrink-0"
                      />
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="font-mono font-bold text-emerald-400 text-xs truncate tabular-nums text-left hover:underline"
                      >
                        {order.orderNumber}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-zinc-500 font-mono tabular-nums">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Customer info & Amount */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs truncate">{order.customerName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <a 
                          href={`tel:${order.phone}`} 
                          className="text-[11px] font-mono text-zinc-300 hover:text-white tabular-nums underline"
                        >
                          {order.phone}
                        </a>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[11px] text-zinc-300 font-medium">{order.city}</span>
                        {order.deliveryType === 'stopdesk' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            Stopdesk
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">{order.address}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-black text-sm text-white tabular-nums">
                        {order.total} <span className="text-[10px] font-sans text-zinc-400">DH</span>
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono">
                        Livraison {order.shippingFee} DH
                      </div>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-slate-800/80 text-[11px] text-zinc-300 flex items-center justify-between">
                    <span className="truncate pr-2">{order.items[0]?.title}</span>
                    <span className="font-mono text-[10px] text-zinc-400 shrink-0">x{order.items[0]?.quantity}</span>
                  </div>

                  {/* Action buttons bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                    <a
                      href={buildWhatsAppLink(order, 'confirmation', storeSlug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-target px-2.5 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-xs font-bold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      {(order.status === 'new' || order.status === 'to_confirm') && (
                        <button
                          onClick={() => handleQuickTransition(order.id, 'confirmed')}
                          className="touch-target px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 text-xs font-bold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirmer</span>
                        </button>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleQuickDispatch(order.id, 'ozon')}
                          className="touch-target px-2.5 py-1.5 rounded-lg bg-sky-950/60 hover:bg-sky-900 text-sky-300 border border-sky-800/50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5 text-sky-400" />
                          <span>Expédier</span>
                        </button>
                      )}

                      {(order.status === 'shipped' || order.status === 'shipping') && (
                        <>
                          <button
                            onClick={() => handleQuickTransition(order.id, 'delivered')}
                            className="touch-target px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-xs font-bold flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Livrée</span>
                          </button>
                          <button
                            onClick={() => handleQuickTransition(order.id, 'returned')}
                            className="touch-target p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/50"
                            title="Retour"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="touch-target px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table or Kanban Pipeline (screens >= md) */}
        <div className="hidden md:block overflow-x-auto admin-scrollbar">
          {viewMode === 'kanban' ? (
            /* Tactical Pipeline Kanban Grid (Option 3 Bento Fusion) */
            <div className="p-4 grid grid-cols-5 gap-3.5 items-start min-w-[1050px]">
              {kanbanColumns.map((col) => {
                const columnOrders = filteredOrders.filter((o) => col.statuses.includes(o.status));
                return (
                  <div
                    key={`kanban-col-${col.id}`}
                    className="bg-[#0e1217] rounded-xl border border-slate-800/80 flex flex-col max-h-[750px] overflow-hidden shadow-sm"
                  >
                    {/* Column Header */}
                    <div className="p-3 border-b border-slate-800/80 bg-[#13171c] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-xs font-bold text-zinc-200">{col.title}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${col.pillClass}`}>
                        {columnOrders.length}
                      </span>
                    </div>

                    {/* Column Cards Stream */}
                    <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1 admin-scrollbar min-h-[140px]">
                      {columnOrders.length === 0 ? (
                        <div className="text-center py-8 text-[11px] text-zinc-500 font-medium">
                          Aucune commande
                        </div>
                      ) : (
                        columnOrders.map((order) => {
                          const isSelected = selectedOrderIds.includes(order.id);
                          return (
                            <div
                              key={`kanban-card-${order.id}`}
                              onClick={() => setSelectedOrder(order)}
                              className={`p-3 rounded-lg border transition-all cursor-pointer hover:border-slate-600 space-y-2 group ${
                                isSelected
                                  ? 'bg-emerald-500/10 border-emerald-500/40'
                                  : 'bg-[#13171c] border-slate-800/80 hover:bg-[#161b22]'
                              }`}
                            >
                              {/* Order Number + Time + Total MAD */}
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-mono font-bold text-emerald-400 text-xs tabular-nums group-hover:underline">
                                  {order.orderNumber}
                                </span>
                                <span className="text-[11px] font-mono font-black text-white tabular-nums">
                                  {order.total} <span className="text-[9px] font-sans text-zinc-400">DH</span>
                                </span>
                              </div>

                              {/* Customer Name & City */}
                              <div>
                                <div className="font-bold text-white text-xs truncate">{order.customerName}</div>
                                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                                  <span className="truncate">{order.city}</span>
                                  {order.deliveryType === 'stopdesk' && (
                                    <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
                                      Stopdesk
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Item Summary */}
                              <div className="text-[10px] text-zinc-300 bg-[#0c0f12] px-2 py-1 rounded border border-slate-800/60 flex items-center justify-between">
                                <span className="truncate pr-1">{order.items[0]?.title}</span>
                                <span className="font-mono text-zinc-400 shrink-0">x{order.items[0]?.quantity}</span>
                              </div>

                              {/* Footer: WhatsApp + Direct Call + Quick Action button */}
                              <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-800/60" onClick={(e) => e.stopPropagation()}>
                                <a
                                  href={buildWhatsAppLink(order, 'confirmation', storeSlug)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-md bg-emerald-950/50 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                  title="WhatsApp Darija"
                                >
                                  <MessageCircle className="w-3 h-3 fill-current" />
                                </a>

                                <a
                                  href={`tel:${order.phone}`}
                                  className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                  title="Appeler le client"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>

                                {/* Contextual Next Action Button */}
                                {col.id === 'to_confirm' && (
                                  <button
                                    onClick={() => handleQuickTransition(order.id, 'confirmed')}
                                    className="flex-1 py-1 px-2 rounded-md bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Confirmer</span>
                                  </button>
                                )}

                                {col.id === 'confirmed' && (
                                  <button
                                    onClick={() => handleQuickDispatch(order.id, order.courier || 'ozon')}
                                    className="flex-1 py-1 px-2 rounded-md bg-sky-950/60 hover:bg-sky-900 text-sky-300 border border-sky-800/50 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <Truck className="w-3 h-3 text-sky-400" />
                                    <span>Expédier</span>
                                  </button>
                                )}

                                {col.id === 'shipped' && (
                                  <button
                                    onClick={() => handleQuickTransition(order.id, 'delivered')}
                                    className="flex-1 py-1 px-2 rounded-md bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    <span>Livrée</span>
                                  </button>
                                )}

                                {col.id === 'returned' && (
                                  <button
                                    onClick={() => handleQuickTransition(order.id, 'new')}
                                    className="flex-1 py-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 text-zinc-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Réactiver</span>
                                  </button>
                                )}

                                {col.id === 'delivered' && (
                                  <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-950/40 border border-emerald-800/30 rounded text-center flex-1">
                                    Encaissé ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <table className="w-full text-left text-xs admin-table">
              <thead>
                <tr className="border-b border-slate-800/90 text-zinc-400 bg-[#0e1217] font-semibold">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
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
              <tbody className="divide-y divide-slate-800/40">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-zinc-500">
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
                        className={`hover:bg-slate-800/30 transition-colors border-b border-slate-800/40 ${isSelected ? 'bg-emerald-500/5' : ''}`}
                      >
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOrder(order.id)}
                            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                          />
                        </td>

                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors tabular-nums cursor-pointer"
                          >
                            {order.orderNumber}
                          </button>
                          <div className="text-[10px] text-zinc-500 mt-0.5 font-mono tabular-nums">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <div className="text-[11px] text-zinc-400 font-mono tabular-nums">{order.phone}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-zinc-200">{order.city}</span>
                            {order.deliveryType === 'stopdesk' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                🏢 Stopdesk
                              </span>
                            )}
                            {order.abVariant && (
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                                order.abVariant === 'waybill'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {order.abVariant}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-[200px]">{order.address}</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="text-zinc-200 font-medium flex items-center gap-1.5 flex-wrap">
                            <span>{order.items[0]?.title}</span>
                            {order.items[0]?.sku && (
                              <span className="font-mono text-[9px] bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded border border-zinc-700">
                                {order.items[0].sku}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1 flex-wrap">
                            <span className="font-mono">x{order.items[0]?.quantity}</span>
                            {order.items[0]?.variant && <span className="text-zinc-300">• {order.items[0].variant}</span>}
                            {order.items[0]?.color && <span className="text-emerald-300/90">• {order.items[0].color}</span>}
                            {order.items[0]?.size && <span className="bg-zinc-800 text-cyan-300 px-1 py-0.2 rounded text-[9px] font-bold">T.{order.items[0].size}</span>}
                            {order.items.length > 1 && <span className="text-zinc-500 font-medium">(+{order.items.length - 1} autre)</span>}
                          </div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-extrabold text-white text-sm font-mono tabular-nums">{order.total} DH</div>
                          <div className="text-[10px] text-zinc-400 font-mono">Livraison : {order.shippingFee} DH</div>
                        </td>

                        <td className="py-2.5 px-3">
                          {getStatusBadge(order.status)}
                          {order.trackingNumber && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40 tabular-nums">
                                {order.trackingNumber}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => copyTracking(order.trackingNumber!, e)}
                                className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
                                title="Copier le numéro de suivi"
                              >
                                {copiedTracking === order.trackingNumber ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
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
                                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                                    : ['shipped', 'shipping', 'delivered'].includes(order.status)
                                    ? 'bg-cyan-950/40 text-cyan-400/60 border border-cyan-900/30'
                                    : 'bg-[#18181b] hover:bg-cyan-950/40 text-zinc-400 hover:text-cyan-300 border border-zinc-800'
                                }`}
                                title={order.status === 'confirmed' ? 'Statut : Confirmée (Actuel)' : 'Basculer vers : 1. Confirmée'}
                              >
                                <Check className="w-3 h-3" />
                                <span>1. Confirmer</span>
                              </button>

                              <span className="text-zinc-600 text-[10px] font-bold">→</span>

                              {/* Switch 2: Shipped Switch */}
                              <button
                                onClick={() => handleQuickDispatch(order.id, order.courier || 'ozon')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                                  ['shipped', 'shipping'].includes(order.status)
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm shadow-sky-500/20'
                                    : order.status === 'delivered'
                                    ? 'bg-sky-950/40 text-sky-400/60 border border-sky-900/30'
                                    : 'bg-[#18181b] hover:bg-sky-950/40 text-zinc-400 hover:text-sky-300 border border-zinc-800'
                                }`}
                                title={['shipped', 'shipping'].includes(order.status) ? 'Statut : Expédiée (Actuel)' : 'Basculer vers : 2. Expédier'}
                              >
                                <Truck className="w-3 h-3 text-sky-400" />
                                <span>2. Expédier</span>
                              </button>

                              <span className="text-zinc-600 text-[10px] font-bold">→</span>

                              {/* Switch 3: Delivered Switch */}
                              <button
                                onClick={() => handleQuickTransition(order.id, 'delivered')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                                  order.status === 'delivered'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/20 font-black'
                                    : 'bg-[#18181b] hover:bg-emerald-950/40 text-zinc-400 hover:text-emerald-300 border border-zinc-800'
                                }`}
                                title={order.status === 'delivered' ? 'Statut : Livrée & Encaissée (Actuel)' : 'Basculer vers : 3. Livrée (Encaissée)'}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>3. Livrée</span>
                              </button>

                              <span className="text-zinc-700 text-[10px] font-bold mx-0.5">|</span>

                              {/* Switch 4: Retournée (Replaces both Annuler & Retour) */}
                              <button
                                onClick={() => handleQuickTransition(order.id, order.status === 'returned' || order.status === 'canceled' ? 'new' : 'returned')}
                                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                                  order.status === 'returned' || order.status === 'canceled'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-500/20 font-black'
                                    : 'bg-[#18181b] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border border-zinc-800'
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

                            {/* Quick Delete Order Action */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSingleOrder(order.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Supprimer cette commande"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 cursor-pointer"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-[#13171c] border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto admin-scrollbar space-y-4 sm:space-y-5 shadow-2xl animate-in zoom-in-95 cursor-default bento-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-[11px] text-zinc-400 font-mono tracking-wider uppercase">Détails de la commande</span>
                <h3 className="text-lg font-mono font-bold text-white tracking-tight">{selectedOrder.orderNumber}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-zinc-400 hover:text-white hover:bg-slate-800/80 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-[#0e1217] border border-slate-800/80">
                <div>
                  <div className="text-zinc-400 text-[11px] mb-0.5">Client</div>
                  <div className="font-semibold text-white text-sm">{selectedOrder.customerName}</div>
                  <div className="text-zinc-300 font-mono text-xs">{selectedOrder.phone}</div>
                </div>
                <div>
                  <div className="text-zinc-400 text-[11px] mb-0.5">Destination</div>
                  <div className="font-semibold text-white text-sm">{selectedOrder.city}</div>
                  <div className="text-zinc-400 text-xs line-clamp-2">{selectedOrder.address}</div>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div>
                <label className="block text-zinc-300 mb-1.5 text-xs font-medium">Mettre à jour le statut</label>
                <select
                  value={selectedOrder.status === 'shipping' ? 'shipped' : selectedOrder.status === 'canceled' ? 'returned' : selectedOrder.status}
                  onChange={(e) => handleQuickTransition(selectedOrder.id, e.target.value as OrderStatus)}
                  className="w-full bg-[#0e1217] border border-slate-800 rounded-lg p-2.5 text-zinc-100 text-xs font-medium focus:border-emerald-500 focus:outline-none"
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
                    className={`py-1.5 px-1 rounded-md text-[10px] font-medium transition-colors text-center cursor-pointer ${
                      selectedOrder.status === 'confirmed'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-zinc-800'
                    }`}
                  >
                    ✓ 1. Confirmer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDispatch(selectedOrder.id, selectedOrder.courier || 'ozon')}
                    className={`py-1.5 px-1 rounded-md text-[10px] font-medium transition-colors text-center cursor-pointer ${
                      ['shipped', 'shipping'].includes(selectedOrder.status)
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-sky-300 hover:bg-sky-950/40 border border-zinc-800'
                    }`}
                  >
                    🚚 2. Expédier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTransition(selectedOrder.id, 'delivered')}
                    className={`py-1.5 px-1 rounded-md text-[10px] font-medium transition-colors text-center cursor-pointer ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-zinc-800'
                    }`}
                  >
                    💰 3. Livrée
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickTransition(selectedOrder.id, selectedOrder.status === 'returned' || selectedOrder.status === 'canceled' ? 'new' : 'returned')}
                    className={`py-1.5 px-1 rounded-md text-[10px] font-medium transition-colors text-center cursor-pointer ${
                      selectedOrder.status === 'returned' || selectedOrder.status === 'canceled'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-rose-300 hover:bg-rose-950/40 border border-zinc-800'
                    }`}
                  >
                    ↩ 4. Retournée
                  </button>
                </div>
              </div>

              {/* Items Summary */}
              <div className="p-3 rounded-lg bg-[#0e1217] border border-slate-800/80 space-y-2">
                <div className="font-semibold text-zinc-300 text-xs flex items-center justify-between">
                  <span>Articles à emballer</span>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Bordereau Colis</span>
                </div>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-zinc-200 py-1.5 border-b border-zinc-800/60 last:border-0">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-zinc-100">{item.title}</span>
                        {item.sku && (
                          <span className="font-mono text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700">
                            {item.sku}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono tabular-nums">Qté: x{item.quantity}</span>
                        {item.variant && <span>• {item.variant}</span>}
                        {item.color && <span className="text-zinc-300">• Couleur: {item.color}</span>}
                        {item.size && <span className="text-cyan-400 font-medium">• Taille: {item.size}</span>}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-sm text-zinc-100">{item.price * item.quantity} MAD</span>
                  </div>
                ))}
                <div className="border-t border-zinc-800/80 pt-2 flex justify-between items-center font-medium text-zinc-200 text-xs">
                  <span>Total à encaisser (COD) :</span>
                  <span className="text-white font-mono tabular-nums font-bold text-sm">{selectedOrder.total} MAD</span>
                </div>
              </div>

              {selectedOrder.agentNotes && (
                <div className="p-3 rounded-lg bg-[#0d0d10] border border-zinc-800/80">
                  <div className="text-zinc-400 font-medium text-[11px] mb-1">Notes de l&apos;agent :</div>
                  <div className="text-zinc-300 text-xs italic">{selectedOrder.agentNotes}</div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-800/80">
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
                className="flex-1 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Exporter CSV
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSingleOrder(selectedOrder.id)}
                className="py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/50 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Supprimer définitivement cette commande"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 font-medium text-xs transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manifest & WhatsApp Dispatch Modal (Option 1 + WhatsApp Share) */}
      {manifestModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 cursor-pointer"
          onClick={() => setManifestModal((prev) => ({ ...prev, isOpen: false }))}
        >
          <div
            className="bg-[#13171c] border border-slate-800 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto admin-scrollbar space-y-4 sm:space-y-5 shadow-2xl animate-in zoom-in-95 cursor-default bento-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-mono font-bold text-white tracking-tight flex items-center gap-2">
                    Bordereau & Manifeste d&apos;Expédition
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {manifestModal.label} • <strong className="text-white font-mono">{manifestModal.orders.length}</strong> colis •{' '}
                    <strong className="text-emerald-400 font-mono">
                      {manifestTotalCrbt.toLocaleString('fr-MA')} DH
                    </strong>{' '}
                    CRBT
                  </p>
                </div>
              </div>
              <button
                onClick={() => setManifestModal((prev) => ({ ...prev, isOpen: false }))}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#0c0f12] border border-slate-800/80 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Volume</span>
                <div className="text-base font-black font-mono text-white mt-0.5">
                  {manifestModal.orders.length} colis
                </div>
              </div>
              <div className="bg-[#0c0f12] border border-slate-800/80 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Total CRBT</span>
                <div className="text-base font-black font-mono text-emerald-400 mt-0.5">
                  {manifestTotalCrbt.toLocaleString('fr-MA')} DH
                </div>
              </div>
              <div className="bg-[#0c0f12] border border-slate-800/80 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Destinations</span>
                <div className="text-xs font-semibold text-zinc-300 truncate mt-1" title={manifestCitiesSummary}>
                  {manifestCitiesSummary || 'Maroc'}
                </div>
              </div>
            </div>

            {/* 1. Courier Format Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                1. Choisir le format de bordereau / transporteur
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'ozon', name: 'Ozon Express', badge: 'CRBT Direct', icon: Truck },
                  { id: 'sendit', name: 'Sendit Maroc', badge: 'Rabat & Casa', icon: Truck },
                  { id: 'cathedis', name: 'Cathedis', badge: 'National 48h', icon: Truck },
                  { id: 'amana', name: 'Amana Poste', badge: 'Poste Maroc', icon: Truck },
                  { id: 'standard', name: 'Standard CSV', badge: 'Excel UTF-8', icon: FileSpreadsheet },
                ].map((c) => {
                  const isSelected = manifestModal.courier === c.id;
                  const IconComp = c.icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setManifestModal((prev) => ({ ...prev, courier: c.id as CourierKey }))}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-white ring-1 ring-emerald-500/30'
                          : 'bg-[#0c0f12] border-slate-800 text-zinc-400 hover:text-zinc-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-zinc-400">
                          {c.badge}
                        </span>
                      </div>
                      <span className="text-xs font-bold mt-2">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. WhatsApp Courier Dispatch Card */}
            <div className="bg-[#0c0f12] border border-emerald-950/40 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">2. Partager le bordereau sur WhatsApp</h4>
                    <p className="text-[11px] text-zinc-400">Transmettez le listing directement au chauffeur ou à l&apos;agence sans fichier lourd.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setManifestModal((prev) => ({ ...prev, showPreviewText: !prev.showPreviewText }))}
                  className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  {manifestModal.showPreviewText ? 'Masquer texte' : 'Voir le texte'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="tel"
                    value={manifestModal.driverPhone}
                    onChange={(e) => setManifestModal((prev) => ({ ...prev, driverPhone: e.target.value }))}
                    placeholder="N° WhatsApp du livreur (ex: 0661234567) ou laisser vide"
                    className="w-full bg-[#13171c] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleSendWhatsAppManifest}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    title="Ouvrir WhatsApp avec le listing pré-rempli"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Envoyer sur WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyWhatsAppManifest}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      manifestModal.copied
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-zinc-300 hover:text-white'
                    }`}
                    title="Copier le listing formaté dans le presse-papier"
                  >
                    {manifestModal.copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{manifestModal.copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
              </div>

              {manifestModal.showPreviewText && (
                <div className="p-2.5 bg-[#13171c] border border-slate-800/80 rounded-lg text-[11px] font-mono text-zinc-300 whitespace-pre-wrap max-h-40 overflow-y-auto admin-scrollbar">
                  {manifestWhatsAppText}
                </div>
              )}
            </div>

            {/* 3. Fulfillment Automation Toggle */}
            {manifestModal.orders.some((o) => o.status === 'confirmed') && (
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0c0f12] border border-slate-800/80 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={manifestModal.autoShip}
                  onChange={(e) => setManifestModal((prev) => ({ ...prev, autoShip: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-700 accent-emerald-500 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-white">
                    Passer automatiquement les {manifestModal.orders.filter((o) => o.status === 'confirmed').length} commande(s) confirmée(s) en « Expédiées »
                  </span>
                  <p className="text-[11px] text-zinc-500">
                    Génère les numéros de suivi {manifestModal.courier.toUpperCase()} et met à jour le stock en temps réel.
                  </p>
                </div>
              </label>
            )}

            {/* 4. Mini Orders Table Preview */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-[#0c0f12] border-b border-slate-800 text-[11px] font-bold text-zinc-400 flex items-center justify-between">
                <span>Colis inclus dans ce bordereau ({manifestModal.orders.length})</span>
                <span className="text-zinc-500 text-[10px]">Aperçu avant téléchargement</span>
              </div>
              <div className="max-h-36 overflow-y-auto admin-scrollbar divide-y divide-slate-800/60 text-xs">
                {manifestModal.orders.map((o) => (
                  <div key={o.id} className="p-2.5 flex items-center justify-between hover:bg-slate-800/20">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-white text-xs">{o.orderNumber}</span>
                      <span className="text-zinc-300 truncate">{o.customerName}</span>
                      <span className="text-zinc-500 text-[11px]">({o.city})</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">{o.total} DH</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handlePrintBonDeRamassage}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span>Imprimer Bon de Ramassage A4</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setManifestModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 font-medium text-xs transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDownload}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-zinc-950" />
                  <span>Télécharger le Fichier (.csv)</span>
                </button>
              </div>
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
