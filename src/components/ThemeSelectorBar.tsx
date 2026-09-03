'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ThemeId } from '@/lib/themes';
import { Sparkles, Crown, Zap, Globe } from 'lucide-react';

export function ThemeSelectorBar() {
  const { themeId, setThemeId, lang, setLang } = useTheme();

  const themes: Array<{ id: ThemeId; label: string; icon: React.ReactNode }> = [
    { id: 'luxury', label: 'Luxe & Artisanal', icon: <Crown className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'beauty', label: 'Beauté & Soins', icon: <Sparkles className="w-3.5 h-3.5 text-rose-500" /> },
    { id: 'tech', label: 'Tech & Gadgets', icon: <Zap className="w-3.5 h-3.5 text-blue-500" /> },
  ];

  return (
    <div className="sticky top-0 z-50 bg-zinc-950 text-white border-b border-zinc-800 text-xs px-3 py-1.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-bold tracking-wide text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CODShop Studio
          </span>
          <span className="hidden sm:inline text-zinc-400 text-[11px]">
            Moteur de Thèmes & Checkout Marocain
          </span>
        </div>

        {/* Theme Switcher buttons */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
          {themes.map((t) => {
            const isActive = themeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId(t.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer text-[11px] ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Language selector */}
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
  );
}
