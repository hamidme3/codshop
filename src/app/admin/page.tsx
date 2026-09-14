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
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--admin-text-primary)] tracking-tight">
              Tableau de bord — <span className="capitalize">{storeSlug}</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Boutique active
            </span>
          </div>
          <p className="text-[var(--admin-text-secondary)] text-xs mt-1">
            Aperçu des performances de vente, encaissements et expéditions en paiement à la livraison (COD).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Pipeline Commandes
          </Link>
          <Link
            href={`/admin/products?store=${storeSlug}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--admin-bg-surface)] hover:bg-[var(--admin-bg-subtle)] text-[var(--admin-text-primary)] border border-[var(--admin-border)] font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Ajouter un Produit
          </Link>
        </div>
      </div>

      {/* 4 Executive Bento Financial & Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Cash Encaissé */}
        <div className="p-5 rounded-2xl bento-card space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--admin-text-secondary)] font-medium">
            <span>Cash Encaissé (Livré)</span>
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[var(--admin-text-primary)] tabular-nums">
            {totalDeliveredMad.toLocaleString('fr-MA')} <span className="text-xs font-normal text-[var(--admin-text-secondary)]">DH</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> {deliveredOrders.length} colis livrés avec succès
          </div>
        </div>

        {/* 2. Commandes Expédiées (Sky Blue) */}
        <div className="p-5 rounded-2xl bento-card space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--admin-text-secondary)] font-medium">
            <span>Commandes Expédiées</span>
            <span className="p-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 tabular-nums">
            {totalInTransitMad.toLocaleString('fr-MA')} <span className="text-xs font-normal text-[var(--admin-text-secondary)]">DH</span>
          </div>
          <div className="text-[11px] text-[var(--admin-text-secondary)] font-medium">
            {inTransitOrders.length} colis en cours de livraison
          </div>
        </div>

        {/* 3. Taux de Livraison Global */}
        <div className="p-5 rounded-2xl bento-card space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--admin-text-secondary)] font-medium">
            <span>Taux de Livraison</span>
            <span className="p-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 tabular-nums">
            {analytics.deliveryRate}%
          </div>
          <div className="text-[11px] text-[var(--admin-text-secondary)] font-medium">
            Taux de retour limité à <span className="text-rose-500 font-semibold tabular-nums">{analytics.returnRate}%</span>
          </div>
        </div>

        {/* 4. Commandes à Confirmer */}
        <div className="p-5 rounded-2xl bento-card space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--admin-text-secondary)] font-medium">
            <span>À Confirmer d&apos;Urgence</span>
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[var(--admin-text-primary)] tabular-nums">
            {pendingOrders.length} <span className="text-xs text-[var(--admin-text-muted)] font-normal">nouvelles</span>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Relancer sur WhatsApp</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Enterprise Milestones Progress */}
      <MilestoneWidget />

      {/* Executive Orders Lifecycle & Universal CSV Export Strip */}
      <div className="p-5 rounded-2xl bento-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--admin-border)] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--admin-text-primary)] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Traitement des Commandes & Export CSV</span>
            </h3>
            <p className="text-[11px] text-[var(--admin-text-secondary)] mt-0.5">
              Mise à jour directe des statuts et téléchargement au format CSV compatible Excel & Google Sheets.
            </p>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Pipeline des commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Nouvelles / À confirmer */}
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="p-3 rounded-xl bg-[var(--admin-bg-subtle)] border border-[var(--admin-border)] hover:border-slate-400 dark:hover:border-slate-600 transition space-y-1.5 cursor-pointer block group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--admin-text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">À Confirmer</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Étape 0</span>
            </div>
            <div className="text-lg font-bold text-[var(--admin-text-primary)] tabular-nums">{pendingOrders.length}</div>
            <div className="text-[11px] text-[var(--admin-text-secondary)]">À relancer par appel / WhatsApp</div>
          </Link>

          {/* Confirmées */}
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="p-3 rounded-xl bg-[var(--admin-bg-subtle)] border border-[var(--admin-border)] hover:border-slate-400 dark:hover:border-slate-600 transition space-y-1.5 cursor-pointer block group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--admin-text-primary)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Confirmées</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">Étape 1</span>
            </div>
            <div className="text-lg font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">{orders.filter((o) => o.status === 'confirmed').length}</div>
            <div className="text-[11px] text-[var(--admin-text-secondary)]">Prêtes à être expédiées</div>
          </Link>

          {/* Expédiées */}
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="p-3 rounded-xl bg-[var(--admin-bg-subtle)] border border-[var(--admin-border)] hover:border-slate-400 dark:hover:border-slate-600 transition space-y-1.5 cursor-pointer block group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--admin-text-primary)] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Expédiées</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Étape 2</span>
            </div>
            <div className="text-lg font-bold text-sky-600 dark:text-sky-400 tabular-nums">{inTransitOrders.length}</div>
            <div className="text-[11px] text-[var(--admin-text-secondary)]">En cours d&apos;acheminement</div>
          </Link>

          {/* Livrées */}
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="p-3 rounded-xl bg-[var(--admin-bg-subtle)] border border-[var(--admin-border)] hover:border-slate-400 dark:hover:border-slate-600 transition space-y-1.5 cursor-pointer block group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--admin-text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Livrées (CRBT)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Étape 3</span>
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{deliveredOrders.length}</div>
            <div className="text-[11px] text-[var(--admin-text-secondary)]">Encaissées avec succès</div>
          </Link>
        </div>
      </div>

      {/* High-Density Recent Orders Table */}
      <div className="p-5 rounded-2xl bento-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[var(--admin-text-primary)]">Dernières Commandes Reçues</h2>
            <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5">Flux des commandes avec coordonnées et statut d&apos;acheminement.</p>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Toutes les commandes ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Recent Orders Cards Stream (screens < md) */}
        <div className="block md:hidden space-y-2.5">
          {orders.slice(0, 5).map((order) => {
            const isConfirmed = order.status === 'confirmed';
            const isShipped = ['shipped', 'shipping'].includes(order.status);
            const isDelivered = order.status === 'delivered';
            const isReturned = ['returned', 'canceled'].includes(order.status);

            return (
              <div key={`mobile-ov-${order.id}`} className="p-3.5 rounded-xl bg-[var(--admin-bg-subtle)] border border-[var(--admin-border)] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs tabular-nums">{order.orderNumber}</span>
                  {isConfirmed ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold stage-pill-confirmed">1. Confirmée</span>
                  ) : isShipped ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold stage-pill-shipped">2. Expédiée</span>
                  ) : isDelivered ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold stage-pill-delivered">3. Livrée</span>
                  ) : isReturned ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold stage-pill-returned">4. Retournée</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold stage-pill-to_confirm">À Confirmer</span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-[var(--admin-text-primary)]">{order.customerName}</div>
                    <div className="text-[var(--admin-text-secondary)] text-[11px] mt-0.5">{order.city} • {order.phone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[var(--admin-text-primary)] text-sm tabular-nums">{order.total} DH</div>
                    <div className="text-[10px] text-[var(--admin-text-muted)]">Paiement COD</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--admin-border)] flex items-center justify-between">
                  <span className="text-[10px] text-[var(--admin-text-secondary)] truncate max-w-[200px]">
                    {order.items?.map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Articles'}
                  </span>
                  <Link
                    href={`/admin/orders?store=${storeSlug}`}
                    className="touch-target px-2.5 py-1 rounded-lg bg-[var(--admin-bg-surface)] hover:bg-[var(--admin-bg-subtle)] text-[var(--admin-text-primary)] border border-[var(--admin-border)] text-xs font-semibold flex items-center gap-1 shrink-0"
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
                    <td className="font-semibold text-[var(--admin-text-primary)] tabular-nums">
                      {order.orderNumber}
                    </td>

                    <td>
                      <div className="font-semibold text-[var(--admin-text-primary)]">{order.customerName}</div>
                      <div className="text-[11px] text-[var(--admin-text-muted)]">{order.phone}</div>
                    </td>

                    <td className="text-[var(--admin-text-secondary)] font-medium">
                      {order.city}
                    </td>

                    <td className="text-[var(--admin-text-secondary)] max-w-[180px] truncate">
                      {order.items?.map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Articles'}
                    </td>

                    <td className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">
                      {order.total} DH
                    </td>

                    <td>
                      {isConfirmed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold stage-pill-confirmed">
                          1. Confirmée
                        </span>
                      ) : isShipped ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold stage-pill-shipped">
                          2. Expédiée
                        </span>
                      ) : isDelivered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold stage-pill-delivered">
                          3. Livrée
                        </span>
                      ) : isReturned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold stage-pill-returned">
                          4. Retournée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold stage-pill-to_confirm">
                          À Confirmer
                        </span>
                      )}
                    </td>

                    <td className="text-right">
                      <Link
                        href={`/admin/orders?store=${storeSlug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--admin-bg-surface)] hover:bg-[var(--admin-bg-subtle)] text-[var(--admin-text-primary)] border border-[var(--admin-border)] text-xs font-semibold transition-colors"
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
    <Suspense fallback={<div className="p-8 text-[var(--admin-text-primary)]">Chargement du tableau de bord...</div>}>
      <OverviewContent />
    </Suspense>
  );
}
