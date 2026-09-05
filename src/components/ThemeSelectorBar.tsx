'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { THEME_LIST, ThemeConfig, ThemeId } from '@/lib/themes';
import { 
  Sparkles, Crown, Zap, Globe, ChevronDown, Check,
  Palette, ShoppingBag, Eye, X, Filter
} from 'lucide-react';

export function ThemeSelectorBar() {
  const { themeId, setThemeId, lang, setLang, theme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tous (25)' },
    { id: 'luxury', label: 'Luxe & Bijoux' },
    { id: 'general', label: 'Top COD & Vitesse' },
    { id: 'tech', label: 'High-Tech & Gaming' },
    { id: 'beauty', label: 'Beauté & Santé' },
    { id: 'fashion', label: 'Mode & Streetwear' },
    { id: 'home', label: 'Maison & Déco' },
    { id: 'food', label: 'Terroir & Cuisine' },
    { id: 'kids', label: 'Bébé & Enfants' },
  ];

  const filteredThemes = selectedCategory === 'all'
    ? THEME_LIST
    : THEME_LIST.filter((t) => t.category === selectedCategory || (selectedCategory === 'food' && t.category === 'home'));

  return (
    <>
      <div className="sticky top-0 z-50 bg-zinc-950 text-white border-b border-zinc-800 text-xs px-3 py-1.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold tracking-wide text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              CODShop Studio
            </span>
            <span className="hidden sm:inline text-zinc-400 text-[11px]">
              Catalogue 25 Thèmes Shopify & WooCommerce • Moteur COD Maroc
            </span>
          </div>

          {/* Quick Active Theme Display & Modal Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg text-[11px] font-semibold text-zinc-200 transition shadow-xs"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="truncate max-w-[140px] sm:max-w-none">{theme.name}</span>
              <span className="text-[10px] text-zinc-400 font-normal hidden md:inline">
                ({theme.sourceInspiration})
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Quick 3 shortcut buttons */}
            <div className="hidden lg:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-[11px]">
              {[
                { id: 'luxury', label: 'Luxe', icon: <Crown className="w-3 h-3 text-amber-400" /> },
                { id: 'beauty', label: 'Beauté', icon: <Sparkles className="w-3 h-3 text-rose-400" /> },
                { id: 'tech', label: 'Tech', icon: <Zap className="w-3 h-3 text-blue-400" /> },
                { id: 'velocity_cod', label: 'Velocity COD', icon: <ShoppingBag className="w-3 h-3 text-emerald-400" /> },
              ].map((shortcut) => (
                <button
                  key={shortcut.id}
                  onClick={() => setThemeId(shortcut.id as ThemeId)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                    themeId === shortcut.id
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {shortcut.icon}
                  <span>{shortcut.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-2 py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition"
            >
              Explorer les 25 thèmes
            </button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                lang === 'fr' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              FR
            </button>
            <span className="text-zinc-600">|</span>
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                lang === 'ar' ? 'bg-white text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </div>

      {/* 25 Themes Modal Explorer */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg sm:text-xl font-bold text-white">Catalogue des 25 Thèmes E-Commerce COD</h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Inspirés des meilleurs best-sellers Shopify & WooCommerce, configurés pour le marché marocain.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="p-3 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Themes Grid */}
            <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredThemes.map((t) => {
                const isActive = themeId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setThemeId(t.id);
                      setModalOpen(false);
                    }}
                    className={`relative rounded-xl border p-4 text-left transition-all cursor-pointer group flex flex-col justify-between ${
                      isActive
                        ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500'
                        : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      {/* Color dots & inspiration badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: t.colors.primary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: t.colors.accent }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: t.colors.bgPage }}
                          />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {t.sourceInspiration}
                        </span>
                      </div>

                      {/* Theme Name & Tagline */}
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition flex items-center justify-between">
                        <span>{t.name}</span>
                        {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {t.tagline}
                      </p>

                      {/* Badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                          {t.badge}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 font-mono">
                          Font: {t.typography.fontFamily}
                        </span>
                      </div>
                    </div>

                    {/* Apply Button Footer */}
                    <div className="pt-4 mt-3 border-t border-zinc-800/60 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">
                        {t.trustPills.length} piliers de réassurance
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md transition ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-300 group-hover:bg-amber-500 group-hover:text-zinc-950'
                        }`}
                      >
                        {isActive ? 'Actif' : 'Appliquer'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>
                Astuce : Chaque thème modifie instantanément la palette, la typographie, les formulaires COD et les badges.
              </span>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
