'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  TrendingUp, ShoppingBag, Truck, AlertCircle, 
  ArrowUpRight, Palette, Plus, Phone, CheckCircle2, 
  Clock, Package, DollarSign, RotateCcw, FileText, ArrowRight,
  ShieldCheck, Send
} from 'lucide-react';
import { getOrders, getAnalytics, type Order } from '@/lib/backoffice';
import { useLanguage } from '@/contexts/LanguageContext';
import MilestoneWidget from '@/components/admin/MilestoneWidget';

function OverviewContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const [orders, setOrders] = useState<Order[]>(() => getOrders(storeSlug));
  const [analytics, setAnalytics] = useState(() => getAnalytics(storeSlug));

  useEffect(() => {
    setOrders(getOrders(storeSlug));
    setAnalytics(getAnalytics(storeSlug));

    // Fetch live orders from PostgreSQL database
    fetch(`/api/admin/orders?store=${encodeURIComponent(storeSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.warn('[OverviewContent] Live orders fetch notice:', err));
  }, [storeSlug]);

  const { t } = useLanguage();
  const pendingOrders = orders.filter((o) => ['new', 'to_confirm'].includes(o.status));
  const inTransitOrders = orders.filter((o) => ['shipped', 'shipping'].includes(o.status));
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const returnedOrders = orders.filter((o) => ['returned', 'canceled'].includes(o.status));

  // Cash flow calculations
  const totalInTransitMad = inTransitOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const totalDeliveredMad = analytics.totalRevenueDelivered;

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Tableau de Bord Exécutif — {storeSlug.toUpperCase()}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ● TEMPS RÉEL
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            Pilotage des flux de trésorerie COD, logistique multi-transporteurs et expéditions Maroc.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition-colors shadow-sm shadow-emerald-500/20"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Pipeline Commandes
          </Link>
          <Link
            href={`/admin/products?store=${storeSlug}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-zinc-200 border border-slate-800 font-bold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" /> Ajouter un Produit
          </Link>
        </div>
      </div>

      {/* 4 Executive Bento Financial & Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Cash Encaissé */}
        <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-2 shadow-sm bento-card">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <span>Cash Encaissé (Livré)</span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {totalDeliveredMad.toLocaleString('fr-MA')} <span className="text-xs font-sans text-zinc-400">DH</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> {deliveredOrders.length} colis livrés avec succès
          </div>
        </div>

        {/* 2. En Cours d'Acheminement (Sky Blue) */}
        <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-2 shadow-sm bento-card">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <span>En Transit Transporteurs</span>
            <span className="p-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono tabular-nums">
            {totalInTransitMad.toLocaleString('fr-MA')} <span className="text-xs font-sans text-zinc-400">DH</span>
          </div>
          <div className="text-[11px] text-zinc-400 font-medium">
            {inTransitOrders.length} colis en route (Ozon, SendIt...)
          </div>
        </div>

        {/* 3. Taux de Livraison Global */}
        <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-2 shadow-sm bento-card">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <span>Taux de Livraison</span>
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono tabular-nums">
            {analytics.deliveryRate}%
          </div>
          <div className="text-[11px] text-zinc-400 font-medium">
            Taux de retour limité à <span className="text-rose-400 font-mono tabular-nums">{analytics.returnRate}%</span>
          </div>
        </div>

        {/* 4. Commandes à Confirmer */}
        <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-2 shadow-sm bento-card">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold">
            <span>À Confirmer d&apos;Urgence</span>
            <span className="p-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {pendingOrders.length} <span className="text-xs font-sans text-zinc-500 font-normal">nouvelles</span>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="text-[11px] text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Relancer sur WhatsApp</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Enterprise Milestones Progress */}
      <MilestoneWidget />

      {/* Moroccan Courier Fleets & Reconciliation Strip */}
      <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-4 bento-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/70 pb-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-400" />
              <span>Flotte Logistique & Réconciliation Transporteurs</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Suivi consolidé des bordereaux et ramassages multi-opérateurs (BOM UTF-8 Windows Excel).
            </p>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Gérer les manifests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Ozon Express */}
          <div className="p-3 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white">Ozon Express</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">Casablanca & National</span>
            </div>
            <div className="text-[11px] text-zinc-400">Hubs Derb Ghallef / Ain Sebaa</div>
            <div className="text-xs font-mono font-bold text-zinc-200">Format API & CSV ✓</div>
          </div>

          {/* SendIt */}
          <div className="p-3 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white">SendIt Maroc</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Express 24h</span>
            </div>
            <div className="text-[11px] text-zinc-400">Rabat, Fès, Marrakech, Tanger</div>
            <div className="text-xs font-mono font-bold text-zinc-200">Ramassage 0 DH ✓</div>
          </div>

          {/* Cathedis */}
          <div className="p-3 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white">Cathedis</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">National 48h</span>
            </div>
            <div className="text-[11px] text-zinc-400">Réseau Agences & Relais</div>
            <div className="text-xs font-mono font-bold text-zinc-200">CRBT Garanti ✓</div>
          </div>

          {/* Amana */}
          <div className="p-3 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white">Amana Poste</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Tout le Maroc</span>
            </div>
            <div className="text-[11px] text-zinc-400">Villes & Zones Éloignées</div>
            <div className="text-xs font-mono font-bold text-zinc-200">Reçu Officiel ✓</div>
          </div>
        </div>
      </div>

      {/* High-Density Recent Orders Table */}
      <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-4 shadow-sm bento-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white">Dernières Commandes Reçues</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Flux en temps réel avec coordonnées et statut d&apos;acheminement.</p>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Toutes les commandes ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Recent Orders Cards Stream (screens < md) */}
        <div className="block md:hidden divide-y divide-slate-800/60 space-y-2.5">
          {orders.slice(0, 5).map((order) => {
            const isConfirmed = order.status === 'confirmed';
            const isShipped = ['shipped', 'shipping'].includes(order.status);
            const isDelivered = order.status === 'delivered';
            const isReturned = ['returned', 'canceled'].includes(order.status);

            return (
              <div key={`mobile-ov-${order.id}`} className="p-3 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-emerald-400 text-xs tabular-nums">{order.orderNumber}</span>
                  {isConfirmed ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-confirmed font-mono">1. Confirmée</span>
                  ) : isShipped ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-shipped font-mono">2. Expédiée</span>
                  ) : isDelivered ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-delivered font-mono">3. Livrée</span>
                  ) : isReturned ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-returned font-mono">4. Retournée</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold stage-pill-to_confirm font-mono">À Confirmer</span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-zinc-400 text-[11px] font-mono mt-0.5">{order.city} • {order.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white text-sm tabular-nums">{order.total} DH</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Paiement COD</div>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                    {order.items?.map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Articles'}
                  </span>
                  <Link
                    href={`/admin/orders?store=${storeSlug}`}
                    className="touch-target px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <span>Gérer</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table (screens >= md) */}
        <div className="hidden md:block overflow-x-auto admin-scrollbar">
          <table className="w-full text-left text-xs admin-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Destination</th>
                <th>Articles</th>
                <th>Montant</th>
                <th>Étape Pipeline</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => {
                const isConfirmed = order.status === 'confirmed';
                const isShipped = ['shipped', 'shipping'].includes(order.status);
                const isDelivered = order.status === 'delivered';
                const isReturned = ['returned', 'canceled'].includes(order.status);

                return (
                  <tr key={order.id}>
                    <td className="font-mono font-bold text-white tabular-nums">
                      {order.orderNumber}
                    </td>

                    <td>
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[11px] font-mono text-zinc-500">{order.phone}</div>
                    </td>

                    <td className="text-zinc-300 font-medium">
                      {order.city}
                    </td>

                    <td className="text-zinc-400 max-w-[180px] truncate">
                      {order.items?.map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Articles'}
                    </td>

                    <td className="font-mono font-bold text-emerald-400 tabular-nums text-sm">
                      {order.total} DH
                    </td>

                    <td>
                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold stage-pill-confirmed font-mono">
                          1. Confirmée
                        </span>
                      ) : isShipped ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold stage-pill-shipped font-mono">
                          2. Expédiée
                        </span>
                      ) : isDelivered ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold stage-pill-delivered font-mono">
                          3. Livrée
                        </span>
                      ) : isReturned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold stage-pill-returned font-mono">
                          4. Retournée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold stage-pill-to_confirm font-mono">
                          À Confirmer
                        </span>
                      )}
                    </td>

                    <td className="text-right">
                      <Link
                        href={`/admin/orders?store=${storeSlug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
                      >
                        <span>Ouvrir</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
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

export default function OverviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement du tableau de bord...</div>}>
      <OverviewContent />
    </Suspense>
  );
}
