'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Layers, CheckCircle2, Clock, Truck, DollarSign, AlertTriangle } from 'lucide-react';

export interface PipelineStageMetric {
  key: string;
  name: string;
  count: number;
  value: number; // MAD
  color: string;
}

interface OrderVelocityChartProps {
  data?: PipelineStageMetric[];
  currency?: string;
}

const STAGE_ICONS: Record<string, React.ReactNode> = {
  to_confirm: <Clock className="w-3.5 h-3.5 text-slate-400" />,
  confirmed: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />,
  shipped: <Truck className="w-3.5 h-3.5 text-sky-400" />,
  delivered: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
  returned: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
};

export default function OrderVelocityChart({ 
  data = [], 
  currency = 'MAD' 
}: OrderVelocityChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 h-[360px] flex items-center justify-center text-slate-400 dark:text-zinc-500 text-xs font-mono">
        Chargement de la vélocité des commandes...
      </div>
    );
  }

  const totalOrders = data.reduce((acc, stage) => acc + stage.count, 0) || 1;
  const totalPipelineValue = data.reduce((acc, stage) => acc + stage.value, 0);

  // Fallback if completely empty
  const displayData = data.length > 0 ? data : [
    { key: 'to_confirm', name: '1. À Confirmer', count: 0, value: 0, color: '#94a3b8' },
    { key: 'confirmed', name: '2. Confirmées', count: 0, value: 0, color: '#06b6d4' },
    { key: 'shipped', name: '3. En Transit', count: 0, value: 0, color: '#38bdf8' },
    { key: 'delivered', name: '4. Livrées & Encaissées', count: 0, value: 0, color: '#10b981' },
    { key: 'returned', name: '5. Retours / Refus', count: 0, value: 0, color: '#f43f5e' },
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 tracking-tight">
              Vélocité du Pipeline Commandes COD
            </h3>
            <span className="text-[10px] font-medium bg-cyan-50 border border-cyan-200 text-cyan-700 dark:bg-cyan-950/60 dark:border-cyan-800/60 dark:text-cyan-300 px-2 py-0.5 rounded font-mono">
              Données Réelles Boutique
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Répartition et conversion des commandes à travers vos 5 étapes opérationnelles.
          </p>
        </div>

        <div className="text-right font-mono">
          <div className="text-[10px] uppercase text-slate-400 dark:text-zinc-500 font-semibold tracking-wider">Valeur Totale Pipeline</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
            {totalPipelineValue.toLocaleString()} <span className="text-slate-500 dark:text-zinc-400 text-xs">{currency}</span>
          </div>
        </div>
      </div>

      {/* Stage Progression Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {displayData.map((stage) => {
          const share = Math.round((stage.count / totalOrders) * 100);
          return (
            <div 
              key={stage.key} 
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0d0d10] border border-slate-200/80 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-medium truncate flex items-center gap-1">
                  {STAGE_ICONS[stage.key]}
                  <span className="truncate">{stage.name}</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 dark:text-zinc-500">{share}%</span>
              </div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {stage.count} <span className="text-[10px] font-normal text-slate-500 dark:text-zinc-500 font-sans">colis</span>
              </div>
              <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-zinc-300 tabular-nums mt-0.5">
                {stage.value.toLocaleString()} {currency}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Horizontal Bar Visualizer */}
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as PipelineStageMetric;
                  return (
                    <div className="bg-white/95 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-xl text-xs font-mono space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </div>
                      <div className="text-slate-600 dark:text-zinc-300">
                        Volume : <strong className="text-slate-900 dark:text-white">{d.count}</strong> commandes ({Math.round((d.count / totalOrders) * 100)}%)
                      </div>
                      <div className="text-slate-600 dark:text-zinc-300">
                        Montant : <strong className="text-emerald-600 dark:text-emerald-400">{d.value.toLocaleString()} {currency}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
