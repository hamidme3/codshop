'use client';

import React, { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getCountryConfig } from '@/lib/geo';
import { MessageCircle, ShieldCheck, ShoppingBag, Compass, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSearch } from '@/context/SearchContext';

export function Navbar() {
  const { theme, countryCode } = useTheme();
  const { totalCount, openCart } = useCart();
  const { openSearch } = useSearch();
  const countryConfig = useMemo(() => getCountryConfig(countryCode || 'MA'), [countryCode]);

  const announcement = useMemo(() => {
    let text = theme.announcementText || '';
    if (countryConfig.code !== 'MA') {
      text = text
        .replace(/🇲🇦/g, countryConfig.phone.flag)
        .replace(/au Maroc/gi, countryConfig.inCountryName || 'au Maroc')
        .replace(/(?:dès\s+)?(?:350|400)\s*DH/gi, `dès ${countryConfig.freeShippingThreshold} ${countryConfig.currency.symbol}`);
    }
    return text;
  }, [theme.announcementText, countryConfig]);

  return (
    <header
      className="navbar-root border-b backdrop-blur z-40"
      style={{
        borderColor: 'var(--theme-border)',
        backgroundColor: 'color-mix(in oklch, var(--theme-card-bg) 95%, transparent)',
      }}
    >
      {/* Top Country-Aware Promo Ticker */}
      <div
        className="announcement-bar text-[11px] leading-tight py-1.5 px-4 text-center font-medium shadow-xs line-clamp-2"
        style={{
          backgroundColor: theme.announcementBg || theme.colors.primary,
          color: theme.announcementTextColor || 'var(--theme-announcement-text)',
        }}
        title={announcement}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 min-w-0">
          <span aria-hidden="true">{countryConfig.phone.flag}</span>
          <span className="truncate sm:whitespace-nowrap">{announcement}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 min-w-0">
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
              className="text-[10px] -mt-1 font-medium tracking-wide truncate max-w-[150px] sm:max-w-xs"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {theme.tagline}
            </div>
          </div>
        </a>

        {/* Central Storefront Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 font-bold text-xs" aria-label="Navigation principale">
          <a
            href="/"
            className="px-3 py-1.5 rounded-lg transition hover:bg-black/5"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            Accueil
          </a>
          <a
            href="/catalog"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition hover:bg-black/5"
            style={{ color: 'var(--theme-text-primary)' }}
          >
            <Compass className="w-3.5 h-3.5" style={{ color: theme.colors.accent }} />
            <span>Catalogue & Collections</span>
            <span
              className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded"
              style={{
                backgroundColor: theme.colors.badgeBg,
                color: theme.colors.badgeText,
              }}
            >
              Boutique
            </span>
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Instant Search Trigger - Desktop */}
          <button
            type="button"
            onClick={openSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer hover:opacity-90 shadow-xs"
            style={{
              backgroundColor: 'var(--theme-card-bg)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
            aria-label="Rechercher des produits (Cmd+K)"
            title="Rechercher des produits (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Rechercher...</span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-black/5 dark:bg-white/10 rounded border border-black/10 dark:border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Instant Search Trigger - Mobile */}
          <button
            type="button"
            onClick={openSearch}
            className="sm:hidden p-2 rounded-xl border flex items-center justify-center transition shadow-xs cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'var(--theme-card-bg)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
            aria-label="Rechercher des produits"
            title="Rechercher"
          >
            <Search className="w-4 h-4" />
          </button>

          <a
            href="https://wa.me/212661000000?text=Salam,%20j'ai%20une%20question%20sur%20vos%20produits"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>Assistance WhatsApp</span>
          </a>

          {/* Quick Mobile Catalog Icon Link */}
          <a
            href="/catalog"
            className="md:hidden p-2 rounded-xl border flex items-center justify-center transition shadow-xs"
            style={{
              backgroundColor: 'var(--theme-card-bg)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
            aria-label="Voir le catalogue"
          >
            <Compass className="w-4 h-4" />
          </a>

          {/* Global Reactive Cart Drawer Button */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Panier (${totalCount} articles)`}
            className="relative px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl border flex items-center gap-2 font-bold text-xs transition shadow-xs cursor-pointer hover:opacity-95"
            style={{
              backgroundColor: 'var(--theme-card-bg)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-primary)',
            }}
          >
            <ShoppingBag className="w-4 h-4" style={{ color: theme.colors.primary }} />
            <span className="hidden sm:inline">Panier</span>
            {totalCount > 0 ? (
              <span className="bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                {totalCount}
              </span>
            ) : (
              <span className="text-[10px] opacity-60 font-normal">(0)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
