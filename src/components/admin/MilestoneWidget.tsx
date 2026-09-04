'use client';

import React, { useState, useEffect } from 'react';
import { Award, Lock, Sparkles, TrendingUp, ChevronRight, HelpCircle } from 'lucide-react';

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
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded" />
        <div className="h-3 w-full bg-slate-800 rounded-full" />
      </div>
    );
  }

  const { totalSalesMad, currentTier, nextTier, progressPercent, remainingToNext, tiers } = data;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Paliers de Vente — Milestones Gamification
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {currentTier ? currentTier.label : 'Nouveau Vendeur'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Débloquez des badges et récompenses au fur et à mesure de votre progression COD !
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/60 px-4 py-2.5 rounded-2xl border border-slate-800/80">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Ventes Consolidées</p>
            <p className="text-lg font-black text-white">
              {totalSalesMad.toLocaleString('fr-MA')} <span className="text-xs font-semibold text-slate-400">DH</span>
            </p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Objectif Suivant</p>
            <p className="text-sm font-bold text-amber-400">
              {nextTier.label} ({nextTier.thresholdMad.toLocaleString('fr-MA')} DH)
            </p>
          </div>
        </div>
      </div>

      {/* 5 Badges Progression Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tiers.map((tier) => {
          const isCurrent = currentTier?.key === tier.key;
          const isUnlocked = tier.unlocked;

          return (
            <div
              key={tier.key}
              style={{
                borderColor: isCurrent ? tier.color : isUnlocked ? `${tier.color}40` : '#334155',
              }}
              className={`p-3.5 rounded-2xl border flex flex-col items-center text-center relative transition-all ${
                isUnlocked
                  ? 'bg-slate-900/90 shadow-lg'
                  : 'bg-slate-950/40 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div
                style={{
                  backgroundColor: `${tier.color}20`,
                  color: tier.color,
                  borderColor: `${tier.color}50`,
                }}
                className="w-11 h-11 rounded-2xl border flex items-center justify-center mb-2 shadow-inner"
              >
                {isUnlocked ? (
                  <Award className="w-6 h-6 drop-shadow" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-500" />
                )}
              </div>

              <span className="font-extrabold text-xs text-white tracking-wide">
                {tier.label}
              </span>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                {tier.thresholdLabel}
              </span>

              {isCurrent && (
                <span
                  style={{ backgroundColor: tier.color }}
                  className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-black text-slate-950 tracking-wider uppercase shadow"
                >
                  Actuel
                </span>
              )}
              {isUnlocked && !isCurrent && (
                <span className="mt-2 text-[9px] font-bold text-emerald-400">
                  Débloqué ✓
                </span>
              )}
              {!isUnlocked && (
                <span className="mt-2 text-[9px] font-medium text-slate-500">
                  Verrouillé
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar & Countdown to Next Milestone */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Progression vers le badge <strong className="text-amber-400">{nextTier.label}</strong>
          </span>
          <span className="font-mono text-amber-400 font-black">{progressPercent}%</span>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
          <div
            style={{
              width: `${progressPercent}%`,
              backgroundColor: nextTier.color,
            }}
            className="h-full rounded-full transition-all duration-500 shadow-lg"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>
            {remainingToNext > 0 ? (
              <>
                Plus que <strong className="text-white font-mono">{remainingToNext.toLocaleString('fr-MA')} DH</strong> de chiffre d affaires pour décrocher le palier <strong>{nextTier.label}</strong>.
              </>
            ) : (
              <span className="text-emerald-400 font-bold">Félicitations ! Vous avez atteint le sommet Diamond !</span>
            )}
          </span>
          <span className="font-mono text-slate-500">
            {totalSalesMad.toLocaleString('fr-MA')} / {nextTier.thresholdMad.toLocaleString('fr-MA')} DH
          </span>
        </div>
      </div>
    </div>
  );
}
