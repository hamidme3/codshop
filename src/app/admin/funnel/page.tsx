'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, TrendingUp, Users, ShoppingCart, 
  CheckCircle2, AlertTriangle, Lightbulb, ArrowDown, 
  Sparkles, Clock 
} from 'lucide-react';
import { getFunnelData } from '@/lib/backoffice';

function FunnelContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const funnel = getFunnelData(storeSlug);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Filter className="w-8 h-8 text-emerald-400" /> Entonnoir de Vente (Store Journey)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Suivi en temps réel des étapes clés du parcours visiteur jusqu&apos;à la confirmation de commande COD.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>Mis à jour en direct</span>
        </div>
      </div>

      {/* Global Conversion Card */}
      <div className="bg-[#13171c] border border-slate-800/70 bento-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Performance Globale de la Boutique</span>
          <div className="text-3xl sm:text-4xl font-black text-white">
            {funnel.conversionRate}% <span className="text-base font-normal text-slate-400">Taux de conversion global</span>
          </div>
          <p className="text-slate-400 text-xs max-w-md">
            Sur <strong>{funnel.totalVisitors.toLocaleString()} visiteurs</strong> ayant atterri sur votre boutique, <strong>{funnel.steps[3].visitors} commandes</strong> ont été finalisées.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <div className="text-xs text-slate-400 font-semibold">Moyenne E-Commerce Maroc :</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">8% - 12%</div>
          <span className="text-[10px] text-emerald-400 font-bold">Votre boutique surperforme de +22%</span>
        </div>
      </div>

      {/* Visual Funnel Steps like SimWebShop */}
      <div className="bg-[#13171c] border border-slate-800/70 bento-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" /> Étapes de Conversion & Déperdition de Trafic
        </h2>

        <div className="space-y-4">
          {funnel.steps.map((step, idx) => {
            const isLast = idx === funnel.steps.length - 1;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                    <span>{step.name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-mono text-slate-400">{step.visitors.toLocaleString()} visiteurs</span>
                    <span className="font-black text-white text-sm sm:text-base">{step.percentage}%</span>
                    {step.dropoff > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">
                        -{step.dropoff}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLast
                        ? 'bg-gradient-to-r from-emerald-500 to-sky-400'
                        : 'bg-gradient-to-r from-sky-500 to-emerald-500'
                    }`}
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>

                {!isLast && (
                  <div className="flex justify-center my-1 text-slate-600">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostics & AI Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {funnel.diagnostics.map((diag, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 bento-card space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              {diag.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : diag.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0" />
              ) : (
                <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0" />
              )}
              <h3 className="font-bold text-white text-xs">{diag.title}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{diag.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FunnelPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement de l&apos;entonnoir...</div>}>
      <FunnelContent />
    </Suspense>
  );
}
