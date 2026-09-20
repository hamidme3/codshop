'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Users, Repeat, TrendingUp, Sparkles } from 'lucide-react';

export interface RetentionCohortPoint {
  period: string;
  repeatPurchaseRate: number; // %
  cumulativeLtv: number; // MAD
  organicReorders: number;
}

interface CustomerRetentionChartProps {
  data?: RetentionCohortPoint[];
  currency?: string;
}

const DEFAULT_RETENTION: RetentionCohortPoint[] = [
  { period: 'Jour 1', repeatPurchaseRate: 0, cumulativeLtv: 380, organicReorders: 0 },
  { period: '15 Jours', repeatPurchaseRate: 8.4, cumulativeLtv: 440, organicReorders: 38 },
  { period: '30 Jours', repeatPurchaseRate: 16.2, cumulativeLtv: 560, organicReorders: 92 },
  { period: '45 Jours', repeatPurchaseRate: 23.5, cumulativeLtv: 690, organicReorders: 145 },
  { period: '60 Jours', repeatPurchaseRate: 31.8, cumulativeLtv: 850, organicReorders: 210 },
  { period: '90 Jours', repeatPurchaseRate: 39.4, cumulativeLtv: 1040, organicReorders: 285 },
];

export default function CustomerRetentionChart({ 
  data = DEFAULT_RETENTION, 
  currency = 'MAD' 
}: CustomerRetentionChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 h-[340px] flex items-center justify-center text-zinc-500 text-xs font-mono">
        Chargement de la rétention client...
      </div>
    );
  }

  const latest = data[data.length - 1];

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
              Rétention Client & Progression LTV (Valeur Vie Client)
            </h3>
            <span className="text-[10px] font-medium bg-purple-950/60 border border-purple-800/60 text-purple-300 px-2 py-0.5 rounded">
              Cohortes CRM
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Évolution du réachat organique et de la rentabilité client sans dépense publicitaire
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto font-mono">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 block uppercase">Taux Réachat 90J</span>
            <span className="text-sm font-bold text-purple-300 tabular-nums">+{latest.repeatPurchaseRate}%</span>
          </div>
          <div className="text-right border-l border-zinc-800 pl-3">
            <span className="text-[10px] text-zinc-500 block uppercase">LTV Moyen 90J</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">{latest.cumulativeLtv} {currency}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="period" stroke="#71717a" fontSize={11} tickLine={false} axisLine={{ stroke: '#27272a' }} />
            <YAxis yAxisId="rate" orientation="left" stroke="#a855f7" fontSize={11} tickLine={false} axisLine={false} unit="%" />
            <YAxis yAxisId="ltv" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} unit={` ${currency}`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl text-xs font-mono">
                      <p className="font-semibold text-zinc-200 mb-2 border-b border-zinc-800 pb-1">{label}</p>
                      <div className="text-purple-300 py-0.5 flex justify-between gap-4">
                        <span>Taux de Réachat :</span>
                        <span className="font-bold">{payload[0]?.value}%</span>
                      </div>
                      <div className="text-emerald-400 py-0.5 flex justify-between gap-4">
                        <span>LTV Cumulé :</span>
                        <span className="font-bold">{payload[1]?.value} {currency}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              formatter={(value) => <span className="text-zinc-400 text-xs">{value}</span>}
            />
            <Line
              yAxisId="rate"
              type="monotone"
              dataKey="repeatPurchaseRate"
              name="Taux de Réachat Cumulé (%)"
              stroke="#a855f7"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="ltv"
              type="monotone"
              dataKey="cumulativeLtv"
              name={`LTV Dépense Moyenne (${currency})`}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
