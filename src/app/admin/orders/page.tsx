'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShoppingBag, Search, Phone, MessageCircle, Truck, 
  CheckCircle2, XCircle, Clock, Filter, Printer, ExternalLink 
} from 'lucide-react';
import { getOrders, updateOrderStatus, Order, OrderStatus } from '@/lib/backoffice';
import { useLanguage } from '@/contexts/LanguageContext';

function OrdersContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>(getOrders(storeSlug));
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filterMap: Record<string, OrderStatus[]> = {
    all: ['new', 'to_confirm', 'confirmed', 'shipping', 'delivered', 'returned', 'canceled'],
    new: ['new'],
    to_confirm: ['to_confirm'],
    confirmed: ['confirmed'],
    shipping: ['shipping'],
    delivered: ['delivered'],
    returned: ['returned', 'canceled'],
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterMap[activeFilter]?.includes(o.status);
    const matchesQuery = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setOrders([...getOrders(storeSlug)]);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleOzonDispatch = (orderId: string) => {
    const tracking = `OZON-MA-${Math.floor(100000 + Math.random() * 900000)}`;
    updateOrderStatus(orderId, 'shipping', tracking);
    setOrders([...getOrders(storeSlug)]);
    alert(`Colis créé avec succès sur Ozon Express !\nN° de Suivi : ${tracking}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">{t.orders.tabs.new}</span>;
      case 'to_confirm':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">{t.orders.tabs.toConfirm}</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">{t.orders.tabs.confirmed}</span>;
      case 'shipping':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">{t.orders.tabs.shipping}</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">{t.orders.tabs.delivered}</span>;
      case 'returned':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">{t.orders.tabs.returned}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">Canceled</span>;
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-amber-400" /> {t.orders.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t.orders.subtitle}
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
          Total : <strong>{orders.length}</strong> ({orders.filter(o => o.status === 'delivered').length} {t.orders.tabs.delivered})
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
        {[
          { id: 'all', label: t.orders.tabs.all },
          { id: 'new', label: t.orders.tabs.new },
          { id: 'to_confirm', label: t.orders.tabs.toConfirm },
          { id: 'confirmed', label: t.orders.tabs.confirmed },
          { id: 'shipping', label: t.orders.tabs.shipping },
          { id: 'delivered', label: t.orders.tabs.delivered },
          { id: 'returned', label: t.orders.tabs.returned },
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

      {/* Search & Bulk Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${t.common.search} (06...), ville, N°...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          <strong>{filteredOrders.length}</strong> {t.orders.table.order}(s)
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50 font-semibold">
                <th className="py-3.5 px-4">{t.orders.table.order}</th>
                <th className="py-3.5 px-4">{t.orders.table.client}</th>
                <th className="py-3.5 px-4">{t.dashboard.city}</th>
                <th className="py-3.5 px-4">{t.orders.table.items}</th>
                <th className="py-3.5 px-4">{t.orders.table.amount}</th>
                <th className="py-3.5 px-4">{t.orders.table.status}</th>
                <th className="py-3.5 px-4 text-center">{t.orders.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Aucune commande trouvée pour ce filtre.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const rawPhone = order.phone.replace(/[^0-9]/g, '');
                  const waNumber = rawPhone.startsWith('0') ? `212${rawPhone.slice(1)}` : rawPhone;
                  const waMsg = encodeURIComponent(
                    `Salam ${order.customerName}, m3ak la boutique ${storeSlug.toUpperCase()}. Commanditi 3ndna ${order.items[0]?.title} b ${order.total} DH l ${order.city}. Bghiti nsayftouha lik ghdda nchaellah ?`
                  );

                  return (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
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

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-slate-400">{order.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{order.city}</span>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{order.address}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">
                          {order.items[0]?.title}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          x{order.items[0]?.quantity} {order.items[0]?.variant && `• ${order.items[0].variant}`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-white text-sm">{order.total} DH</div>
                        <div className="text-[10px] text-slate-400">Livraison : {order.shippingFee} DH</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                        {order.trackingNumber && (
                          <div className="text-[10px] font-mono text-cyan-400 mt-1">
                            {order.trackingNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* WhatsApp Green Button */}
                          <a
                            href={`https://wa.me/${waNumber}?text=${waMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors"
                            title="Confirmer via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                          </a>

                          {/* Direct Call Button */}
                          <a
                            href={`tel:${order.phone}`}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Appeler le client"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* Ozon Express 1-Click Dispatch */}
                          {['confirmed', 'to_confirm'].includes(order.status) && (
                            <button
                              onClick={() => handleOzonDispatch(order.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 transition-colors"
                              title="Expédier avec Ozon Express"
                            >
                              <Truck className="w-3.5 h-3.5" /> Expédier
                            </button>
                          )}
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-mono">Détails de la commande</span>
                <h3 className="text-lg font-black text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-slate-400">Client :</div>
                  <div className="font-bold text-white text-sm">{selectedOrder.customerName}</div>
                  <div className="text-slate-300">{selectedOrder.phone}</div>
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
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="new">Nouvelle</option>
                  <option value="to_confirm">À Confirmer</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="shipping">En Livraison</option>
                  <option value="delivered">Livrée & Encaissée</option>
                  <option value="returned">Retournée</option>
                  <option value="canceled">Annulée</option>
                </select>
              </div>

              {/* Items Summary */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-slate-300">Articles commandés :</div>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-200">
                    <span>{item.title} (x{item.quantity})</span>
                    <span className="font-bold">{item.price * item.quantity} DH</span>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-sm">
                  <span>Total à encaisser :</span>
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
                onClick={() => alert(`Impression du bordereau A6 pour ${selectedOrder.orderNumber}...`)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Imprimer Bordereau A6
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
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
