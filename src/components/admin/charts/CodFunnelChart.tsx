'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';
import { Filter, Users, PhoneCall, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export interface FunnelStage {
  id: string;
  name: string;
  count: number;
  rate: number; // percentage of original traffic
  stepRate: number; // percentage of previous step
  color: string;
  iconName: string;
}

interface CodFunnelChartProps {
  stages?: FunnelStage[];
  currency?: string;
  totalDeliveredRevenue?: number;
}

const DEFAULT_STAGES: FunnelStage[] = [
  { id: 'visits', name: 'Visiteurs Ads', count: 12450, rate: 100, stepRate: 100, color: '#64748b', iconName: 'Users' },
  { id: 'checkout', name: 'Formulaire Rempli', count: 560, rate: 4.5, stepRate: 4.5, color: '#3b82f6', iconName: 'Filter' },
  { id: 'confirmed', name: 'Confirmées Tél.', count: 485, rate: 3.9, stepRate: 86.6, color: '#06b6d4', iconName: 'PhoneCall' },
  { id: 'shipped', name: 'Expédiées Transporteur', count: 470, rate: 3.8, stepRate: 96.9, color: '#f59e0b', iconName: 'Truck' },
  { id: 'delivered', name: 'Livrées & Encaissées', count: 395, rate: 3.2, stepRate: 84.0, color: '#10b981', iconName: 'CheckCircle2' },
];

export default function CodFunnelChart({ 
  stages = DEFAULT_STAGES, 
  currency = 'MAD',
  totalDeliveredRevenue = 158400
}: CodFunnelChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 h-[340px] flex items-center justify-center text-slate-400 dark:text-zinc-500 text-xs font-mono">
        Chargement de l'entonnoir COD...
      </div>
    );
  }

  const deliveredStage = stages.find(s => s.id === 'delivered') || stages[stages.length - 1];
  const firstStage = stages[0];
  const overallCashConversion = ((deliveredStage.count / (firstStage.count || 1)) * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/60 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 tracking-tight">
              Entonnoir de Conversion Réelle &quot;Click-to-Cash&quot;
            </h3>
            <span className="text-[10px] font-medium bg-cyan-50 border border-cyan-200 text-cyan-700 dark:bg-cyan-950/60 dark:border-cyan-800/60 dark:text-cyan-300 px-2 py-0.5 rounded">
              Spécial COD
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Suivi des déperditions entre le clic publicitaire et l&apos;encaissement effectif
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block uppercase tracking-wider">Taux de Réalisation Cash</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{overallCashConversion}%</span>
          </div>
        </div>
      </div>

      {/* Visual Stepper Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
        {stages.map((stage, idx) => (
          <div 
            key={stage.id} 
            className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/70 rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 truncate pr-1">
                {idx + 1}. {stage.name}
              </span>
              <span 
                className="h-1.5 w-1.5 rounded-full" 
                style={{ backgroundColor: stage.color }} 
              />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-bold font-mono text-slate-900 dark:text-zinc-100 tabular-nums">
                {stage.count.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                {idx === 0 ? '100%' : `${stage.stepRate}%`}
              </span>
            </div>
            {idx < stages.length - 1 && (
              <div 
                className="h-0.5 w-full mt-2 rounded-full bg-slate-200 dark:bg-zinc-800" 
                style={{
                  background: `linear-gradient(to right, ${stage.color} 0%, ${stages[idx+1].color} 100%)`
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Horizontal Bar Visualizer */}
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={stages} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              width={130}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as FunnelStage;
                  return (
                    <div className="rounded-lg border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 p-3 shadow-xl text-xs font-mono">
                      <div className="font-semibold text-slate-900 dark:text-zinc-200 mb-1 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
                        {data.name}
                      </div>
                      <div className="text-slate-500 dark:text-zinc-400 py-0.5">
                        Volume : <span className="text-slate-900 dark:text-white font-bold">{data.count.toLocaleString()}</span>
                      </div>
                      <div className="text-slate-500 dark:text-zinc-400 py-0.5">
                        Rétention Étape Précédente : <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.stepRate}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {stages.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
