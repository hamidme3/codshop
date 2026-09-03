'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white">
      {/* 4 Pillars of Moroccan COD Trust */}
      <div className="border-b border-zinc-100 py-10 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900">Livraison Partout au Maroc</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">24h à 48h selon votre ville</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900">Paiement à la Livraison</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Payez uniquement après réception</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900">Garantie Échange 7 Jours</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Changement de taille ou modèle facile</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900">Service Client 7j/7</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">Support WhatsApp direct & réactif</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span>🇲🇦</span>
          <span>© {new Date().getFullYear()} {theme.name} — Plateforme E-commerce COD Maroc.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-zinc-400">Propulsé par le moteur Next.js CODShop</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">100% Cash On Delivery</span>
        </div>
      </div>
    </footer>
  );
}
