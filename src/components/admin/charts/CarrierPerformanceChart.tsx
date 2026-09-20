'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Truck, CheckCircle2, RotateCcw, Clock } from 'lucide-react';

export interface CarrierMetric {
  carrier: string;
  deliveredRate: number; // %
  returnRate: number; // %
  avgTransitHours: number;
  totalParcels: number;
  collectedCash: number;
}

interface CarrierPerformanceChartProps {
  metrics?: CarrierMetric[];
  currency?: string;
}

const DEFAULT_CARRIERS: CarrierMetric[] = [
  { carrier: 'Ozon Express', deliveredRate: 84.5, returnRate: 11.2, avgTransitHours: 26, totalParcels: 284, collectedCash: 112500 },
  { carrier: 'SendIt', deliveredRate: 81.0, returnRate: 13.8, avgTransitHours: 28, totalParcels: 142, collectedCash: 58200 },
  { carrier: 'Cathedis', deliveredRate: 77.4, returnRate: 16.5, avgTransitHours: 34, totalParcels: 89, collectedCash: 34900 },
  { carrier: 'Amana', deliveredRate: 71.8, returnRate: 19.4, avgTransitHours: 48, totalParcels: 45, collectedCash: 17800 },
];

export default function CarrierPerformanceChart({ 
  metrics = DEFAULT_CARRIERS, 
  currency = 'MAD' 
}: CarrierPerformanceChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 h-[340px] flex items-center justify-center text-zinc-500 text-xs font-mono">
        Chargement des performances transporteurs...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
              Benchmark Transporteurs & Flotte COD
            </h3>
            <span className="text-[10px] font-medium bg-amber-950/60 border border-amber-800/60 text-amber-300 px-2 py-0.5 rounded">
              Multi-Transporteurs
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Comparatif du taux de livraison effectif, des retours et de la rapidité d&apos;encaissement
          </p>
        </div>
      </div>

      {/* Grid of Micro-Stat Cards for Top Carriers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {metrics.map((c) => (
          <div key={c.carrier} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-zinc-200">{c.carrier}</span>
              <span className="text-[10px] text-zinc-500 font-mono">{c.totalParcels} colis</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  {c.deliveredRate}%
                </div>
                <div className="text-[10px] text-zinc-500">Taux Livraison</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-zinc-300 tabular-nums">
                  {c.avgTransitHours}h
                </div>
                <div className="text-[10px] text-zinc-500">Délai Moyen</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recharts Bar Chart */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="carrier" stroke="#71717a" fontSize={11} tickLine={false} axisLine={{ stroke: '#27272a' }} />
            <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-zinc-800 bg-zinc-950/95 p-3 shadow-2xl text-xs font-mono">
                      <p className="font-semibold text-zinc-200 mb-2 border-b border-zinc-800 pb-1">{label}</p>
                      {payload.map((entry: any, i: number) => (
                        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
                          <span style={{ color: entry.color }}>{entry.name} :</span>
                          <span className="font-bold text-white">{entry.value}%</span>
                        </div>
                      ))}
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
            <Bar dataKey="deliveredRate" name="Taux de Livraison Réussi" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="returnRate" name="Taux de Retour Colis" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
