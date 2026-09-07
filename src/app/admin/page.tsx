'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  TrendingUp, ShoppingBag, Truck, AlertCircle, 
  ArrowUpRight, Palette, Plus, Phone, CheckCircle2, 
  Clock, Package 
} from 'lucide-react';
import { getOrders, getAnalytics, type Order } from '@/lib/backoffice';
import { useLanguage } from '@/contexts/LanguageContext';
import MilestoneWidget from '@/components/admin/MilestoneWidget';
import LuckyWheelWidget from '@/components/admin/LuckyWheelWidget';

function OverviewContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  // #13 — re-sync orders/analytics when storeSlug changes
  const [orders, setOrders] = useState<Order[]>(() => getOrders(storeSlug));
  const [analytics, setAnalytics] = useState(() => getAnalytics(storeSlug));
  useEffect(() => {
    setOrders(getOrders(storeSlug));
    setAnalytics(getAnalytics(storeSlug));
  }, [storeSlug]);
  const { t } = useLanguage();
  const pendingOrders = orders.filter((o) => ['new', 'to_confirm'].includes(o.status));

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.dashboard.title} — {storeSlug.toUpperCase()}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/builder?store=${storeSlug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-500/10"
          >
            <Palette className="w-4 h-4" /> {t.nav.builder}
          </Link>
          <Link
            href={`/admin/products?store=${storeSlug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" /> {t.common.addProduct}
          </Link>
        </div>
      </div>

      {/* 5-Tier Gamification Milestones Progress Widget ($1K to $10M) */}
      <MilestoneWidget />

      {/* Special Promotional Event Wheel */}
      <LuckyWheelWidget />

      {/* 4 High-Impact KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{t.dashboard.revenueDelivered}</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {analytics.totalRevenueDelivered.toLocaleString()} <span className="text-sm font-semibold text-slate-400">DH</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs semaine précédente
          </div>
        </div>

        {/* Confirmation Rate */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{t.dashboard.confirmationRate}</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Phone className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {analytics.confirmationRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Target &gt; 75% achieved
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{t.dashboard.deliveryRate}</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {analytics.deliveryRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Return rate capped at {analytics.returnRate}%
          </div>
        </div>

        {/* Pending Orders Alert */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span>{t.dashboard.urgentCalls}</span>
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {pendingOrders.length} <span className="text-xs font-normal text-amber-300">{t.orders.tabs.toConfirm}</span>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}&filter=pending`}
            className="text-[11px] text-amber-400 font-bold hover:underline inline-block"
          >
            {t.orders.whatsappConfirm} &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">{t.dashboard.recentOrders}</h2>
            <p className="text-xs text-slate-400">{t.dashboard.subtitle}</p>
          </div>
          <Link
            href={`/admin/orders?store=${storeSlug}`}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            {t.dashboard.viewAllOrders} ({orders.length}) &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">{t.orders.table.order}</th>
                <th className="py-3 px-3">{t.orders.table.client}</th>
                <th className="py-3 px-3">{t.dashboard.city}</th>
                <th className="py-3 px-3">{t.orders.table.items}</th>
                <th className="py-3 px-3">{t.dashboard.amount} (MAD)</th>
                <th className="py-3 px-3">{t.orders.table.status}</th>
                <th className="py-3 px-3 text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.slice(0, 5).map((order) => {
                const isNew = order.status === 'new';
                const isDelivered = order.status === 'delivered';
                const isConfirmed = order.status === 'confirmed';

                return (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400">{order.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-medium">
                      {order.city}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {order.items[0]?.title} (x{order.items[0]?.quantity})
                    </td>
                    <td className="py-3 px-3 font-extrabold text-white">
                      {order.total} DH
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isDelivered
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isConfirmed
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : isNew
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/orders?store=${storeSlug}&id=${order.id}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors text-[11px]"
                      >
                        Gérer
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
    <Suspense fallback={<div className="p-8 text-white">Chargement...</div>}>
      <OverviewContent />
    </Suspense>
  );
}
