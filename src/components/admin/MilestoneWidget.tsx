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
      <div className="p-5 rounded-2xl bg-[var(--admin-bg-surface)] border border-[var(--admin-border)] animate-pulse space-y-3 bento-card">
        <div className="h-5 w-48 bg-[var(--admin-bg-subtle)] rounded" />
        <div className="h-2 w-full bg-[var(--admin-bg-subtle)] rounded-full" />
      </div>
    );
  }

  const { totalSalesMad, currentTier, nextTier, progressPercent, remainingToNext, tiers } = data;

  return (
    <div className="p-5 rounded-2xl bg-[var(--admin-bg-surface)] border border-[var(--admin-border)] space-y-5 bento-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-[var(--admin-text-primary)] tracking-tight">
              Paliers de Ventes & Volume d&apos;Affaires
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {currentTier ? currentTier.label : 'Nouveau Vendeur'}
            </span>
          </div>
          <p className="text-xs text-[var(--admin-text-secondary)]">
            Progression de votre chiffre d&apos;affaires consolidé en livraison contre remboursement (COD).
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[var(--admin-bg-subtle)] px-3.5 py-2 rounded-xl border border-[var(--admin-border)] text-xs">
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--admin-text-muted)] tracking-wider">Volume Réalisé</p>
            <p className="text-base font-extrabold text-[var(--admin-text-primary)] tabular-nums">
              {totalSalesMad.toLocaleString('fr-MA')} <span className="text-xs text-[var(--admin-text-secondary)] font-normal">DH</span>
            </p>
          </div>
          <div className="h-7 w-px bg-[var(--admin-border)]" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--admin-text-muted)] tracking-wider">Prochain Palier</p>
            <p className="text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
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
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xs'
                  : isUnlocked
                  ? 'bg-[var(--admin-bg-subtle)] border-[var(--admin-border)]'
                  : 'bg-[var(--admin-bg-subtle)]/40 border-[var(--admin-border)] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--admin-text-primary)] tracking-tight">{tier.label}</span>
                {isUnlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lock className="w-3 h-3 text-[var(--admin-text-muted)]" />
                )}
              </div>

              <div className="text-xs font-medium text-[var(--admin-text-secondary)] tabular-nums">
                {tier.thresholdLabel}
              </div>

              {isCurrent ? (
                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500 text-white text-center uppercase">
                  Actuel
                </span>
              ) : isUnlocked ? (
                <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Atteint ✓
                </span>
              ) : (
                <span className="text-[9px] text-[var(--admin-text-muted)]">
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
          <span className="text-[var(--admin-text-secondary)] flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Progression vers</span>
            <strong className="text-sky-600 dark:text-sky-400">{nextTier.label}</strong>
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">{progressPercent}%</span>
        </div>

        <div className="h-2 w-full rounded-full bg-[var(--admin-bg-subtle)] border border-[var(--admin-border)] overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[var(--admin-text-muted)] pt-0.5">
          <span>
            {remainingToNext > 0 ? (
              <>
                Plus que <strong className="text-[var(--admin-text-primary)] font-semibold tabular-nums">{remainingToNext.toLocaleString('fr-MA')} DH</strong> pour atteindre le palier {nextTier.label}.
              </>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Palier maximal atteint avec succès !</span>
            )}
          </span>
          <span className="tabular-nums text-[var(--admin-text-muted)]">
            {totalSalesMad.toLocaleString('fr-MA')} / {nextTier.thresholdMad.toLocaleString('fr-MA')} DH
          </span>
        </div>
      </div>
    </div>
  );
}
