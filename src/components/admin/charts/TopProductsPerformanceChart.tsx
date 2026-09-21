'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Package, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, ArrowUpDown } from 'lucide-react';

export interface ProductPerformanceMetric {
  title: string;
  totalOrders: number;
  totalQuantity: number;
  grossRevenue: number;
  deliveredRevenue: number; // MAD Realized
  deliveryRate: number; // %
  returnRate: number; // %
}

interface TopProductsPerformanceChartProps {
  data?: ProductPerformanceMetric[];
  currency?: string;
}

export default function TopProductsPerformanceChart({ 
  data = [], 
  currency = 'MAD' 
}: TopProductsPerformanceChartProps) {
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'cash' | 'volume' | 'risk'>('cash');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 h-[360px] flex items-center justify-center text-slate-500 dark:text-zinc-500 text-xs font-mono shadow-xs">
        Aucune donnée de produit disponible
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'cash') return b.deliveredRevenue - a.deliveredRevenue;
    if (sortBy === 'volume') return b.totalQuantity - a.totalQuantity;
    if (sortBy === 'risk') return b.returnRate - a.returnRate;
    return 0;
  });

  const totalRealizedCash = data.reduce((acc, p) => acc + p.deliveredRevenue, 0);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 transition-all space-y-5 shadow-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 tracking-tight">
              Rentabilité Réelle & Risque de Retour par Produit
            </h3>
            <span className="text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-300 px-2 py-0.5 rounded font-mono">
              Données Réelles Boutique
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Chiffre d&apos;affaires net encaissé à la livraison et détection des articles à fort taux de retour.
          </p>
        </div>

        {/* Sort Switcher Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSortBy('cash')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              sortBy === 'cash' 
                ? 'bg-white text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold border border-slate-200 dark:border-emerald-500/40 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Cash Encaissé
          </button>
          <button
            type="button"
            onClick={() => setSortBy('volume')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              sortBy === 'volume' 
                ? 'bg-white text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 font-bold border border-slate-200 dark:border-sky-500/40 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Volume Unités
          </button>
          <button
            type="button"
            onClick={() => setSortBy('risk')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
              sortBy === 'risk' 
                ? 'bg-white text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 font-bold border border-slate-200 dark:border-rose-500/40 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Risque Retour
          </button>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-[#0d0d10] border border-slate-200 dark:border-zinc-800/80 text-slate-500 dark:text-zinc-500 text-xs font-mono">
          Aucune commande enregistrée pour le moment. Vos performances produits s&apos;afficheront dès les premières commandes.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedData.map((prod, idx) => {
            const hasHighReturnRisk = prod.returnRate >= 20;
            const cashShare = totalRealizedCash > 0 ? Math.round((prod.deliveredRevenue / totalRealizedCash) * 100) : 0;

            return (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#0d0d10] border border-slate-200/80 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Product Title & Rank */}
                <div className="flex items-center gap-3 min-w-[240px] max-w-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-slate-700 dark:text-zinc-300 shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 dark:text-zinc-100 text-xs truncate" title={prod.title}>
                      {prod.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-500 font-mono mt-0.5">
                      {prod.totalQuantity} pièces vendues • {prod.totalOrders} commandes
                    </div>
                  </div>
                </div>

                {/* Performance Indicators & Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                  {/* Realized Cash */}
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-slate-500 dark:text-zinc-500 font-medium">Cash Encaissé</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {prod.deliveredRevenue.toLocaleString()} {currency}
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal ml-1">({cashShare}%)</span>
                    </div>
                  </div>

                  {/* Delivery Success Rate */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-[10px] uppercase text-slate-500 dark:text-zinc-500 font-medium">Taux Livré</div>
                    <div className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                      {prod.deliveryRate}%
                    </div>
                  </div>

                  {/* Return Risk Rate */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-[10px] uppercase text-slate-500 dark:text-zinc-500 font-medium">Taux Retour</div>
                    <div className={`inline-flex items-center gap-1 font-bold ${
                      hasHighReturnRisk ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-zinc-400'
                    }`}>
                      {hasHighReturnRisk && <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0 animate-pulse" />}
                      {prod.returnRate}%
                    </div>
                  </div>

                  {/* Diagnostic Badge */}
                  <div className="min-w-[120px] text-right">
                    {hasHighReturnRisk ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30">
                        Alerte Refus
                      </span>
                    ) : prod.deliveredRevenue > 0 && prod.deliveryRate >= 80 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                        Top Rentable
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 border border-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700/60">
                        Stable
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
