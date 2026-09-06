'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const { theme } = useTheme();

  return (
    <header
      className="navbar-root border-b backdrop-blur z-40"
      style={{
        borderColor: 'var(--theme-border)',
        backgroundColor: 'color-mix(in oklch, var(--theme-card-bg) 95%, transparent)',
      }}
    >
      {/* Top Moroccan Promo Ticker */}
      <div
        className="announcement-bar text-[11px] leading-tight py-1.5 px-4 text-center font-medium shadow-xs line-clamp-2"
        style={{
          backgroundColor: theme.announcementBg || theme.colors.primary,
          color: theme.announcementTextColor || 'var(--theme-announcement-text)',
        }}
        title={theme.announcementText}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 min-w-0">
          <span aria-hidden="true">🇲🇦</span>
          <span className="truncate sm:whitespace-nowrap">{theme.announcementText}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 min-w-0">
        {/* Logo / Store Name */}
        <a
          href="/"
          className="flex items-center gap-2 group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 rounded-lg"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {theme.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div
              className="font-black tracking-tight text-base sm:text-lg group-hover:opacity-80 transition truncate"
              style={{ color: 'var(--theme-text-primary)' }}
            >
              {theme.name.toUpperCase()}
            </div>
            <div
              className="text-[10px] -mt-1 font-medium tracking-wide truncate max-w-[200px] sm:max-w-xs"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {theme.tagline}
            </div>
          </div>
        </a>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://wa.me/212661000000?text=Salam,%20j'ai%20une%20question%20sur%20vos%20produits"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Assistance WhatsApp</span>
          </a>

          <div
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium border"
            style={{
              color: 'var(--theme-text-secondary)',
              backgroundColor: 'color-mix(in oklch, var(--theme-border) 30%, var(--theme-card-bg))',
              borderColor: 'var(--theme-border)',
            }}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span className="hidden md:inline">Garantie Qualité 100%</span>
          </div>
        </div>
      </div>
    </header>
  );
}
