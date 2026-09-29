'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export interface CashflowPoint {
  date: string;
  deliveredCash: number;
  inTransitCash: number;
  returnedLoss: number;
}

interface CodCashflowChartProps {
  data?: CashflowPoint[];
  currency?: string;
}

function generateEmptyCashflow(days: number = 14): CashflowPoint[] {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' });
  const points: CashflowPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    points.push({
      date: formatter.format(d).replace('.', ''),
      deliveredCash: 0,
      inTransitCash: 0,
      returnedLoss: 0,
    });
  }
  return points;
}

export default function CodCashflowChart({ data, currency = 'MAD' }: CodCashflowChartProps) {
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<'7D' | '14D' | '30D'>('14D');

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const points = data && data.length > 0 ? data : generateEmptyCashflow(14);
    if (range === '7D') return points.slice(-7);
    if (range === '30D' && points.length < 30) {
      // If 30D requested but only 14 points, pad with earlier rolling days
      return points;
    }
    return points;
  }, [data, range]);

  const totals = useMemo(() => {
    const delivered = chartData.reduce((acc, p) => acc + p.deliveredCash, 0);
    const inTransit = chartData.reduce((acc, p) => acc + p.inTransitCash, 0);
    const losses = chartData.reduce((acc, p) => acc + p.returnedLoss, 0);
    return { delivered, inTransit, losses };
  }, [chartData]);

  const growthRate = useMemo(() => {
    if (chartData.length < 2) return '0.0%';
    const mid = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, mid).reduce((acc, p) => acc + p.deliveredCash, 0);
    const secondHalf = chartData.slice(mid).reduce((acc, p) => acc + p.deliveredCash, 0);
    if (firstHalf === 0 && secondHalf === 0) return '0.0%';
    if (firstHalf === 0) return '+100%';
    const pct = ((secondHalf - firstHalf) / firstHalf) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
  }, [chartData]);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 h-[380px] flex items-center justify-center text-slate-400 dark:text-zinc-500 text-xs font-mono">
        Chargement de la réconciliation financière...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 transition-all shadow-xs">
      {/* Header with Title & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 tracking-tight">
              Réconciliation & Flux de Trésorerie COD
            </h3>
            <span className="text-[10px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-0.5 rounded">
              Temps Réel
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Cash encaissé à la livraison vs fonds en transit chez les transporteurs
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-0.5 rounded-lg self-start sm:self-auto">
          {(['7D', '14D', '30D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                range === r
                  ? 'bg-white text-slate-900 dark:bg-zinc-800 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {r === '7D' ? '7 Jours' : r === '14D' ? '14 Jours' : '30 Jours'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Micro-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-emerald-50/50 dark:bg-zinc-900/60 border border-emerald-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
              Cash Encaissé (Livré)
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">{growthRate}</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-zinc-100 tabular-nums">
            {totals.delivered.toLocaleString()} <span className="text-xs text-slate-500 dark:text-zinc-500 font-normal">{currency}</span>
          </div>
        </div>

        <div className="bg-amber-50/50 dark:bg-zinc-900/60 border border-amber-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              En Transit Transporteurs
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">En cours</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-amber-300 tabular-nums">
            {totals.inTransit.toLocaleString()} <span className="text-xs text-slate-500 dark:text-zinc-500 font-normal">{currency}</span>
          </div>
        </div>

        <div className="bg-rose-50/50 dark:bg-zinc-900/60 border border-rose-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium text-rose-800 dark:text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Pertes Retours
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-mono text-[11px]">Frais transport</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-rose-300 tabular-nums">
            {totals.losses.toLocaleString()} <span className="text-xs text-slate-500 dark:text-zinc-500 font-normal">{currency}</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="transitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3 shadow-xl backdrop-blur-md text-xs font-mono">
                      <p className="font-semibold text-slate-900 dark:text-zinc-300 mb-2 border-b border-slate-100 dark:border-zinc-800 pb-1">{label}</p>
                      {payload.map((entry: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
                          <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-zinc-100 tabular-nums">
                            {Number(entry.value).toLocaleString()} {currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="deliveredCash"
              name="Cash Encaissé"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#deliveredGrad)"
            />
            <Area
              type="monotone"
              dataKey="inTransitCash"
              name="En Transit"
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#transitGrad)"
            />
            <Area
              type="monotone"
              dataKey="returnedLoss"
              name="Pertes Retours"
              stroke="#f43f5e"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#returnGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
