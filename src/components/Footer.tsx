'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className="mt-16 border-t"
      style={{
        borderColor: 'var(--theme-border)',
        backgroundColor: 'var(--theme-card-bg)',
      }}
    >
      {/* 4 Pillars of Moroccan COD Trust */}
      <div
        className="border-b py-10"
        style={{
          borderColor: 'var(--theme-border)',
          backgroundColor: 'color-mix(in oklch, var(--theme-border) 20%, var(--theme-card-bg))',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-bold text-xs" style={{ color: 'var(--theme-text-primary)' }}>
                Livraison Partout au Maroc
              </h4>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                24h à 48h selon votre ville
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-bold text-xs" style={{ color: 'var(--theme-text-primary)' }}>
                Paiement à la Livraison
              </h4>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                Payez uniquement après réception
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-bold text-xs" style={{ color: 'var(--theme-text-primary)' }}>
                Garantie Échange 7 Jours
              </h4>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                Changement de taille ou modèle facile
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-bold text-xs" style={{ color: 'var(--theme-text-primary)' }}>
                Service Client 7j/7
              </h4>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                Support WhatsApp direct & réactif
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Links */}
      <div className="border-b py-6" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
            <a href="/" className="hover:underline">
              Accueil
            </a>
            <span>•</span>
            <a href="/catalog" className="hover:underline flex items-center gap-1 font-bold" style={{ color: theme.colors.primary }}>
              Catalogue Complet
            </a>
            <span>•</span>
            <a href="/catalog" className="hover:underline" style={{ color: 'var(--theme-text-secondary)' }}>
              Maroquinerie & Chaussures
            </a>
            <span>•</span>
            <a href="/catalog" className="hover:underline" style={{ color: 'var(--theme-text-secondary)' }}>
              Terroir & Miels d'Atlas
            </a>
            <span>•</span>
            <a href="/catalog" className="hover:underline" style={{ color: 'var(--theme-text-secondary)' }}>
              High-Tech & Son
            </a>
          </div>

          <div className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
            Paiement Cash • Vérification avant de payer
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2" style={{ color: 'var(--theme-text-secondary)' }}>
          <span aria-hidden="true">🇲🇦</span>
          <span>
            © {new Date().getFullYear()} {theme.name} — Plateforme E-commerce COD Maroc.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
          <span>Propulsé par le moteur Next.js CODShop</span>
          <span aria-hidden="true">•</span>
          <span className="font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
            100% Cash On Delivery
          </span>
        </div>
      </div>
    </footer>
  );
}
