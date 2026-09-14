'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  TrendingUp, Truck, Phone, AlertOctagon, 
  MapPin, DollarSign, Wallet, ShieldCheck, ArrowUpRight 
} from 'lucide-react';
import { getAnalytics } from '@/lib/backoffice';

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const analytics = getAnalytics(storeSlug);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-400" /> Analytiques & Rentabilité COD
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Performances de confirmation, taux de livraison par ville et bénéfice net réel en Dirhams (MAD).
        </p>
      </div>

      {/* 4 Moroccan Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Taux de Livraison */}
        <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-2 bento-card shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Taux de Livraison (Réussite)</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {analytics.deliveryRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Moyenne marché Maroc : 75-80%
          </div>
        </div>

        {/* Taux de Confirmation */}
        <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-2 bento-card shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Taux de Confirmation</span>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Phone className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {analytics.confirmationRate}%
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Performance call center excellente
          </div>
        </div>

        {/* Taux de Retour */}
        <div className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 space-y-2 bento-card shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Taux de Retour</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-rose-400">
            {analytics.returnRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            Contrôlé grâce à la vérification WhatsApp
          </div>
        </div>

        {/* Bénéfice Net Estimé */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 bento-card shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
            <span>Bénéfice Net Réel</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {analytics.netProfit.toLocaleString()} <span className="text-sm font-semibold text-slate-400">DH</span>
          </div>
          <div className="text-[11px] text-emerald-300">
            Après déduction coût produit & transporteurs
          </div>
        </div>
      </div>

      {/* Net Profit Calculation Formula Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-extrabold text-white">Décomposition du Bénéfice Réel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400">CA Encaissé (Colis Livrés) :</div>
            <div className="text-lg font-black text-white mt-1">
              +{analytics.totalRevenueDelivered.toLocaleString()} DH
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400">Coût Marchandise & Packaging :</div>
            <div className="text-lg font-black text-rose-400 mt-1">
              -{(analytics.totalRevenueDelivered * 0.32).toFixed(0)} DH
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400">Frais de Livraison & Retours :</div>
            <div className="text-lg font-black text-rose-400 mt-1">
              -{(analytics.totalOrders * 22).toFixed(0)} DH
            </div>
          </div>
        </div>
      </div>

      {/* City by City Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" /> Taux de Livraison par Ville Marocaine
          </h2>
          <p className="text-xs text-slate-400">
            Identifiez les villes les plus rentables pour optimiser vos budgets publicitaires Facebook/TikTok.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50 font-semibold">
                <th className="py-3 px-4">Ville</th>
                <th className="py-3 px-4">Volume Commandes</th>
                <th className="py-3 px-4">Chiffre d&apos;Affaires</th>
                <th className="py-3 px-4">Taux de Livraison</th>
                <th className="py-3 px-4 text-right">Rentabilité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {analytics.cityDistribution.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    {item.city}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {item.orders} colis
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-white">
                    {item.revenue.toLocaleString()} DH
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full"
                          style={{ width: `${item.rate}%` }}
                        />
                      </div>
                      <span className="font-bold text-emerald-400">{item.rate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Top Rentable
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement des analytiques...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
