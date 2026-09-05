'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeId, THEMES, ThemeConfig } from '@/lib/themes';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  lang: 'fr' | 'ar';
  setLang: (l: 'fr' | 'ar') => void;
  formatMAD: (amount: number) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>('luxury');
  const [lang, setLangState] = useState<'fr' | 'ar'>('fr');

  useEffect(() => {
    // 1. Check URL query param ?theme= first
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get('theme') as ThemeId;
      if (urlTheme && THEMES[urlTheme]) {
        setThemeIdState(urlTheme);
        return;
      }

      // 2. If ?store= is present, fetch that store's active theme
      const storeSlug = params.get('store');
      if (storeSlug) {
        fetch(`/api/stores/${storeSlug}/theme`)
          .then((res) => res.json())
          .then((data) => {
            if (data.activeThemeId && THEMES[data.activeThemeId as ThemeId]) {
              setThemeIdState(data.activeThemeId as ThemeId);
            }
          })
          .catch(() => {});
      }
    }

    // 3. Fallback to localStorage if set
    const savedTheme = localStorage.getItem('codshop_theme') as ThemeId;
    if (savedTheme && THEMES[savedTheme]) {
      setThemeIdState(savedTheme);
    }
    const savedLang = localStorage.getItem('codshop_lang') as 'fr' | 'ar';
    if (savedLang) {
      setLangState(savedLang);
    }
  }, []);

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    localStorage.setItem('codshop_theme', id);
  };

  const setLang = (l: 'fr' | 'ar') => {
    setLangState(l);
    localStorage.setItem('codshop_lang', l);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = l;
    }
  };

  const theme = THEMES[themeId] || THEMES.luxury;

  const formatMAD = (amount: number) => {
    return lang === 'ar' ? `${amount.toLocaleString('fr-FR')} د.م.` : `${amount.toLocaleString('fr-FR')} DH`;
  };

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId, lang, setLang, formatMAD }}>
      <div
        style={{
          // Set dynamic CSS variables according to selected theme
          ['--theme-primary' as string]: theme.colors.primary,
          ['--theme-primary-hover' as string]: theme.colors.primaryHover,
          ['--theme-accent' as string]: theme.colors.accent,
          ['--theme-accent-hover' as string]: theme.colors.accentHover,
          ['--theme-bg-page' as string]: theme.colors.bgPage,
          ['--theme-card-bg' as string]: theme.colors.cardBg,
          ['--theme-border' as string]: theme.colors.border,
          ['--theme-text-primary' as string]: theme.colors.textPrimary,
          ['--theme-text-secondary' as string]: theme.colors.textSecondary,
          ['--theme-badge-bg' as string]: theme.colors.badgeBg,
          ['--theme-badge-text' as string]: theme.colors.badgeText,
          ['--theme-announcement-bg' as string]: theme.announcementBg,
        }}
        className={`min-h-screen transition-colors duration-300 ${theme.typography.fontFamily === 'serif' ? 'font-serif' : theme.typography.fontFamily === 'monospace' ? 'font-mono' : 'font-sans'}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
