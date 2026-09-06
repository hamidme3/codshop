'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useTransition } from 'react';
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

function getInitialThemeId(): ThemeId {
  if (typeof window === 'undefined') return 'luxury';
  try {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme') as ThemeId;
    if (urlTheme && THEMES[urlTheme]) return urlTheme;
    const saved = localStorage.getItem('codshop_theme') as ThemeId;
    if (saved && THEMES[saved]) return saved;
  } catch {
    // SSR guard
  }
  return 'luxury';
}

function getInitialLang(): 'fr' | 'ar' {
  if (typeof window === 'undefined') return 'fr';
  try {
    return (localStorage.getItem('codshop_lang') as 'fr' | 'ar') || 'fr';
  } catch {
    return 'fr';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => getInitialThemeId());
  const [lang, setLangState] = useState<'fr' | 'ar'>(() => getInitialLang());
  const [, startTransition] = useTransition();

  const theme = useMemo(() => THEMES[themeId] || THEMES.luxury, [themeId]);

  // Sync lang dir/lang on mount + changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // Async storeSlug with AbortController + precedence lock
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('theme')) return; // URL wins, no fetch
      const storeSlug = params.get('store');
      if (!storeSlug) return;
      const ctrl = new AbortController();
      fetch(`/api/stores/${storeSlug}/theme`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => {
          if (data.activeThemeId && THEMES[data.activeThemeId as ThemeId]) {
            const saved = localStorage.getItem('codshop_theme');
            if (!saved || saved === themeId) {
              startTransition(() => setThemeIdState(data.activeThemeId as ThemeId));
            }
          }
        })
        .catch(() => {});
      return () => ctrl.abort();
    } catch {
      // ignore
    }
  }, []); // run once

  const setThemeId = (id: ThemeId) => {
    // View transition progressive
    const update = () => {
      startTransition(() => setThemeIdState(id));
      try {
        localStorage.setItem('codshop_theme', id);
        const url = new URL(window.location.href);
        url.searchParams.set('theme', id);
        window.history.replaceState({}, '', url);
      } catch {}
    };
    const doc = document as unknown as { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (doc.startViewTransition) {
      doc.startViewTransition(update);
    } else {
      update();
    }
  };

  const setLang = (l: 'fr' | 'ar') => {
    setLangState(l);
    try {
      localStorage.setItem('codshop_lang', l);
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = l;
    } catch {}
  };

  const formatMAD = (amount: number) => {
    if (!Number.isFinite(amount) || amount < 0) amount = 0;
    const s = amount.toLocaleString('fr-FR');
    return lang === 'ar' ? `\u2068${s}\u2069 \u062f.\u0645.` : `${s} DH`;
  };

  const styleVars = useMemo(
    () =>
      ({
        ['--theme-primary']: theme.colors.primary,
        ['--theme-primary-hover']: theme.colors.primaryHover,
        ['--theme-accent']: theme.colors.accent,
        ['--theme-accent-hover']: theme.colors.accentHover,
        ['--theme-bg-page']: theme.colors.bgPage,
        ['--theme-card-bg']: theme.colors.cardBg,
        ['--theme-border']: theme.colors.border,
        ['--theme-border-strong']: theme.colors.borderStrong,
        ['--theme-shadow-color']: theme.colors.shadowColor,
        ['--theme-text-primary']: theme.colors.textPrimary,
        ['--theme-text-secondary']: theme.colors.textSecondary,
        ['--theme-badge-bg']: theme.colors.badgeBg,
        ['--theme-badge-text']: theme.colors.badgeText,
        ['--theme-announcement-bg']: theme.announcementBg,
        ['--theme-announcement-text']: (theme as unknown as { announcementTextColor: string }).announcementTextColor || '#0f172a',
      }) as React.CSSProperties,
    [theme]
  );

  const isDark = theme.id === 'fitness' || theme.id === 'cyberpunk';

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId, lang, setLang, formatMAD }}>
      <div
        data-theme={themeId}
        style={{ ...styleVars, colorScheme: isDark ? 'dark' : 'light' } as React.CSSProperties}
        className={`min-h-screen transition-[background-color,color,border-color] duration-[var(--motion-base)] ${theme.typography.fontFamily === 'serif' ? 'font-serif' : theme.typography.fontFamily === 'monospace' ? 'font-mono' : 'font-sans'}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
