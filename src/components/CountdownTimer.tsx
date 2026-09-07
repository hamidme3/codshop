// YouCan-inspired countdown timer — real from vipone.youcan.store product pages
// Shows: 00Jour 01heure 00minute 59seconde (counts down to cutoff)

'use client';

import React, { useState, useEffect } from 'react';

export function CountdownTimer({ endTimeISO }: { endTimeISO?: string }) {
  const [remaining, setRemaining] = useState({
    d: 0, h: 0, m: 0, s: 59,
  });

  useEffect(() => {
    // Default: end of day tomorrow (simulating YouCan urgency)
    const target = endTimeISO ? new Date(endTimeISO) : new Date(Date.now() + 24 * 3600 * 1000);
    
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const d = Math.floor(diff / (86400 * 1000));
      const h = Math.floor((diff % (86400 * 1000)) / (3600 * 1000));
      const m = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
      const s = Math.floor((diff % (60 * 1000)) / 1000);
      setRemaining({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTimeISO]);

  const fmt = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1 border border-amber-200 shadow-sm">
      <span className="tabular-nums">{fmt(remaining.d)}Jour</span>
      <span className="text-zinc-300">|</span>
      <span className="tabular-nums">{fmt(remaining.h)}heure</span>
      <span className="text-zinc-300">|</span>
      <span className="tabular-nums">{fmt(remaining.m)}minute</span>
      <span className="text-zinc-300">|</span>
      <span className="tabular-nums">{fmt(remaining.s)}seconde</span>
    </div>
  );
}
