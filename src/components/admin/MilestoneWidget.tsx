'use client';

import React, { useState, useEffect } from 'react';
import { Award, Lock, TrendingUp, CheckCircle2, ShieldCheck } from 'lucide-react';

interface MilestoneTier {
  key: string;
  label: string;
  thresholdMad: number;
  thresholdUsd: number;
  thresholdLabel: string;
  color: string;
  unlocked: boolean;
}

interface MilestonesData {
  totalSalesMad: number;
  currentTier: MilestoneTier | null;
  nextTier: MilestoneTier;
  progressPercent: number;
  remainingToNext: number;
  tiers: MilestoneTier[];
  stats: {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    formatted_total_sales: string;
    formatted_aov: string;
  };
}

export default function MilestoneWidget() {
  const [data, setData] = useState<MilestonesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/milestones')
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error('[MilestoneWidget] Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800 animate-pulse space-y-3">
        <div className="h-5 w-48 bg-zinc-800 rounded" />
        <div className="h-2 w-full bg-zinc-800 rounded-full" />
      </div>
    );
  }

  const { totalSalesMad, currentTier, nextTier, progressPercent, remainingToNext, tiers } = data;

  return (
    <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-black text-white tracking-tight">
              Paliers de Croissance & Volume d&apos;Affaires
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {currentTier ? currentTier.label : 'Nouveau Vendeur'}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Paliers de performance consolidés pour votre boutique e-commerce au Maroc.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#09090b] px-3.5 py-2 rounded-xl border border-zinc-800 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500">Volume Consolidé</p>
            <p className="text-base font-black text-white tabular-nums font-mono">
              {totalSalesMad.toLocaleString('fr-MA')} <span className="text-xs text-zinc-400 font-sans">DH</span>
            </p>
          </div>
          <div className="h-7 w-px bg-zinc-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500">Prochain Palier</p>
            <p className="text-xs font-bold text-amber-400 font-mono tabular-nums">
              {nextTier.label} ({nextTier.thresholdMad.toLocaleString('fr-MA')} DH)
            </p>
          </div>
        </div>
      </div>

      {/* 5 Progression Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {tiers.map((tier) => {
          const isCurrent = currentTier?.key === tier.key;
          const isUnlocked = tier.unlocked;

          return (
            <div
              key={tier.key}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                isCurrent
                  ? 'bg-amber-500/5 border-amber-500/50 shadow-sm'
                  : isUnlocked
                  ? 'bg-[#18181b] border-zinc-700/60'
                  : 'bg-[#09090b]/40 border-zinc-800/60 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white tracking-tight">{tier.label}</span>
                {isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Lock className="w-3 h-3 text-zinc-600" />
                )}
              </div>

              <div className="font-mono text-xs text-zinc-400 tabular-nums">
                {tier.thresholdLabel}
              </div>

              {isCurrent ? (
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500 text-zinc-950 text-center uppercase">
                  Actuel
                </span>
              ) : isUnlocked ? (
                <span className="text-[9px] font-semibold text-emerald-400 font-mono">
                  Atteint ✓
                </span>
              ) : (
                <span className="text-[9px] text-zinc-600 font-mono">
                  Verrouillé
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Progression vers l&apos;échelon</span>
            <strong className="text-amber-400">{nextTier.label}</strong>
          </span>
          <span className="font-mono text-amber-400 font-black tabular-nums">{progressPercent}%</span>
        </div>

        <div className="h-2 w-full rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
          <span>
            {remainingToNext > 0 ? (
              <>
                Plus que <strong className="text-zinc-200 font-mono tabular-nums">{remainingToNext.toLocaleString('fr-MA')} DH</strong> pour atteindre le palier {nextTier.label}.
              </>
            ) : (
              <span className="text-emerald-400 font-bold">Palier maximal atteint avec succès !</span>
            )}
          </span>
          <span className="font-mono tabular-nums text-zinc-500">
            {totalSalesMad.toLocaleString('fr-MA')} / {nextTier.thresholdMad.toLocaleString('fr-MA')} DH
          </span>
        </div>
      </div>
    </div>
  );
}
