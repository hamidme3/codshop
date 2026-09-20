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

const DEFAULT_DATA: CashflowPoint[] = [
  { date: '10 Sep', deliveredCash: 4850, inTransitCash: 2100, returnedLoss: 250 },
  { date: '11 Sep', deliveredCash: 6200, inTransitCash: 2850, returnedLoss: 320 },
  { date: '12 Sep', deliveredCash: 5400, inTransitCash: 3400, returnedLoss: 180 },
  { date: '13 Sep', deliveredCash: 7900, inTransitCash: 4100, returnedLoss: 450 },
  { date: '14 Sep', deliveredCash: 9350, inTransitCash: 4800, returnedLoss: 290 },
  { date: '15 Sep', deliveredCash: 8600, inTransitCash: 3950, returnedLoss: 510 },
  { date: '16 Sep', deliveredCash: 11200, inTransitCash: 5300, returnedLoss: 380 },
  { date: '17 Sep', deliveredCash: 10450, inTransitCash: 6100, returnedLoss: 420 },
  { date: '18 Sep', deliveredCash: 12800, inTransitCash: 5800, returnedLoss: 310 },
  { date: '19 Sep', deliveredCash: 14600, inTransitCash: 7200, returnedLoss: 490 },
  { date: '20 Sep', deliveredCash: 13900, inTransitCash: 6500, returnedLoss: 360 },
];

export default function CodCashflowChart({ data = DEFAULT_DATA, currency = 'MAD' }: CodCashflowChartProps) {
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<'7D' | '14D' | '30D'>('14D');

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const points = data && data.length > 0 ? data : DEFAULT_DATA;
    if (range === '7D') return points.slice(-7);
    return points;
  }, [data, range]);

  const totals = useMemo(() => {
    const delivered = chartData.reduce((acc, p) => acc + p.deliveredCash, 0);
    const inTransit = chartData.reduce((acc, p) => acc + p.inTransitCash, 0);
    const losses = chartData.reduce((acc, p) => acc + p.returnedLoss, 0);
    return { delivered, inTransit, losses };
  }, [chartData]);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 h-[380px] flex items-center justify-center text-zinc-500 text-xs font-mono">
        Chargement de la réconciliation financière...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 transition-all">
      {/* Header with Title & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
              Réconciliation & Flux de Trésorerie COD
            </h3>
            <span className="text-[10px] font-medium bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
              Temps Réel
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cash encaissé à la livraison vs fonds en transit chez les transporteurs
          </p>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg self-start sm:self-auto">
          {(['7D', '14D', '30D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                range === r
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r === '7D' ? '7 Jours' : r === '14D' ? '14 Jours' : '30 Jours'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Micro-Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-900/60 border border-emerald-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Cash Encaissé (Livré)
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">+18.4%</span>
          </div>
          <div className="text-xl font-bold font-mono text-zinc-100 tabular-nums">
            {totals.delivered.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">{currency}</span>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-amber-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              En Transit Transporteurs
            </span>
            <span className="text-amber-400 font-mono text-[11px]">En cours</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
            {totals.inTransit.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">{currency}</span>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-rose-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Pertes Retours
            </span>
            <span className="text-rose-400 font-mono text-[11px]">Frais transport</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-300 tabular-nums">
            {totals.losses.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">{currency}</span>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#71717a" 
              fontSize={11} 
              tickLine={false} 
              axisLine={{ stroke: '#27272a' }}
            />
            <YAxis 
              stroke="#71717a" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-md text-xs font-mono">
                      <p className="font-semibold text-zinc-300 mb-2 border-b border-zinc-800 pb-1">{label}</p>
                      {payload.map((entry: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
                          <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            {entry.name}
                          </span>
                          <span className="font-bold text-zinc-100 tabular-nums">
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
