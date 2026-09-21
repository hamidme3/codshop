'use client';

import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { MapPin } from 'lucide-react';

export interface RegionalData {
  name: string;
  value: number;
  revenue: number;
  deliveryRate: number;
  color: string;
}

interface RegionalDistributionChartProps {
  data?: RegionalData[];
  currency?: string;
}

const DEFAULT_REGIONS: RegionalData[] = [
  { name: 'Casablanca-Settat', value: 38, revenue: 124500, deliveryRate: 86.4, color: '#3b82f6' },
  { name: 'Rabat-Salé-Kénitra', value: 20, revenue: 64200, deliveryRate: 83.1, color: '#06b6d4' },
  { name: 'Marrakech-Safi', value: 15, revenue: 48900, deliveryRate: 79.5, color: '#10b981' },
  { name: 'Tanger-Tétouan', value: 12, revenue: 39100, deliveryRate: 81.2, color: '#f59e0b' },
  { name: 'Fès-Meknès', value: 9, revenue: 29800, deliveryRate: 74.0, color: '#8b5cf6' },
  { name: 'Souss-Massa (Agadir)', value: 6, revenue: 19500, deliveryRate: 78.8, color: '#ec4899' },
];

export default function RegionalDistributionChart({ 
  data = DEFAULT_REGIONS, 
  currency = 'MAD' 
}: RegionalDistributionChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 h-[340px] flex items-center justify-center text-slate-400 dark:text-zinc-500 text-xs font-mono">
        Chargement de la répartition géographique...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 tracking-tight">
              Répartition Régionale Maroc & Taux de Livraison
            </h3>
            <span className="text-[10px] font-medium bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/60 dark:border-blue-800/60 dark:text-blue-300 px-2 py-0.5 rounded">
              12 Régions
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Concentration des commandes et performance de livraison par bassin urbain
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut Chart */}
        <div className="w-full h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const entry = payload[0].payload as RegionalData;
                    return (
                      <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3 shadow-xl text-xs font-mono">
                        <p className="font-semibold text-slate-900 dark:text-zinc-200 mb-1 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          {entry.name}
                        </p>
                        <p className="text-slate-500 dark:text-zinc-400">Part Commandes : <span className="text-slate-900 dark:text-white font-bold">{entry.value}%</span></p>
                        <p className="text-slate-500 dark:text-zinc-400">Chiffre d&apos;Affaires : <span className="text-emerald-600 dark:text-emerald-400 font-bold">{entry.revenue.toLocaleString()} {currency}</span></p>
                        <p className="text-slate-500 dark:text-zinc-400">Taux Livraison : <span className="text-blue-600 dark:text-blue-400 font-bold">{entry.deliveryRate}%</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Breakdown List */}
        <div className="space-y-2">
          {data.map((region) => (
            <div 
              key={region.name} 
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/60 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: region.color }} />
                <span className="font-medium text-slate-900 dark:text-zinc-200 truncate max-w-[140px]">{region.name}</span>
              </div>
              <div className="flex items-center gap-3 text-right font-mono">
                <span className="text-slate-500 dark:text-zinc-400 text-[11px]">{region.value}%</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] tabular-nums">
                  {region.revenue.toLocaleString()} {currency}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  {region.deliveryRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
