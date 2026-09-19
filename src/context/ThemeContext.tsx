'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useTransition } from 'react';
import { ThemeId, THEMES, ThemeConfig } from '@/lib/themes';
import { detectClientVisitorCountry, formatCountryPrice } from '@/lib/geo';

export interface StoreShippingSettings {
  freeShippingThreshold: number;
  casaFee: number;
  rabatFee: number;
  otherCitiesFee: number;
  deliveryTimeframe: string;
  checkoutEmailMode: 'hidden' | 'optional_collapsed' | 'optional_visible' | 'required';
}

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  lang: 'fr' | 'ar';
  setLang: (l: 'fr' | 'ar') => void;
  countryCode: string;
  setCountryCode: (c: string) => void;
  shippingSettings: StoreShippingSettings;
  setShippingSettings: React.Dispatch<React.SetStateAction<StoreShippingSettings>>;
  formatPrice: (amount: number, overrideCountry?: string) => string;
  formatMAD: (amount: number) => string;
  storeSlug: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>('luxury');
  const [lang, setLangState] = useState<'fr' | 'ar'>('fr');
  const [countryCode, setCountryCodeState] = useState<string>('MA');
  const [storeSlug, setStoreSlug] = useState<string>('ottavio');
  const [shippingSettings, setShippingSettings] = useState<StoreShippingSettings>({
    freeShippingThreshold: 400,
    casaFee: 20,
    rabatFee: 25,
    otherCitiesFee: 30,
    deliveryTimeframe: '24h à 48h',
    checkoutEmailMode: 'hidden',
  });
  const [mounted, setMounted] = useState(false);
  const [, startTransition] = useTransition();

  // Safely hydrate theme and lang from URL or localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get('theme') as ThemeId;
      if (urlTheme && THEMES[urlTheme]) {
        setThemeIdState(urlTheme);
      } else {
        const saved = localStorage.getItem('codshop_theme') as ThemeId;
        if (saved && THEMES[saved]) {
          setThemeIdState(saved);
        }
      }

      const savedLang = localStorage.getItem('codshop_lang') as 'fr' | 'ar';
      if (savedLang && (savedLang === 'fr' || savedLang === 'ar')) {
        setLangState(savedLang);
      }

      const detectedCountry = detectClientVisitorCountry('MA');
      if (detectedCountry) setCountryCodeState(detectedCountry);
    } catch {
      // Guard against SSR/storage access issues
    }
  }, []);

  const theme = useMemo(() => THEMES[themeId] || THEMES.luxury, [themeId]);

  // Sync data-theme attribute and CSS custom properties on documentElement for dark mode tokens and scrollbars
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', themeId);
      root.style.setProperty('--theme-primary', theme.colors.primary);
      root.style.setProperty('--theme-primary-hover', theme.colors.primaryHover);
      root.style.setProperty('--theme-accent', theme.colors.accent);
      root.style.setProperty('--theme-accent-hover', theme.colors.accentHover);
      root.style.setProperty('--theme-bg-page', theme.colors.bgPage);
      root.style.setProperty('--theme-card-bg', theme.colors.cardBg);
      root.style.setProperty('--theme-border', theme.colors.border);
      root.style.setProperty('--theme-border-strong', theme.colors.borderStrong);
      root.style.setProperty('--theme-shadow-color', theme.colors.shadowColor);
      root.style.setProperty('--theme-text-primary', theme.colors.textPrimary);
      root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
      root.style.setProperty('--theme-badge-bg', theme.colors.badgeBg);
      root.style.setProperty('--theme-badge-text', theme.colors.badgeText);
      root.style.setProperty('--theme-announcement-bg', theme.announcementBg);
      root.style.setProperty('--theme-announcement-text', (theme as any).announcementTextColor || '#0f172a');
    }
  }, [themeId, theme]);

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
      let resolvedSlug = params.get('store');
      if (!resolvedSlug && typeof window !== 'undefined') {
        const host = window.location.hostname.toLowerCase();
        const rootDomain = (process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site').toLowerCase();
        if (host.endsWith(rootDomain) && host !== rootDomain && host !== `www.${rootDomain}`) {
          resolvedSlug = host.replace(`.${rootDomain}`, '');
        } else if (host.endsWith('.localhost') && host !== 'localhost') {
          resolvedSlug = host.replace('.localhost', '');
        }
      }
      if (!resolvedSlug) return;
      setStoreSlug(resolvedSlug);

      const ctrl = new AbortController();
      if (!params.get('theme')) {
        fetch(`/api/stores/${resolvedSlug}/theme`, { signal: ctrl.signal })
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
      }

      fetch(`/api/stores/${encodeURIComponent(resolvedSlug)}/checkout-settings`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setShippingSettings({
              freeShippingThreshold: typeof data.freeShippingThreshold === 'number' ? data.freeShippingThreshold : 400,
              casaFee: typeof data.casaFee === 'number' ? data.casaFee : 20,
              rabatFee: typeof data.rabatFee === 'number' ? data.rabatFee : 25,
              otherCitiesFee: typeof data.otherCitiesFee === 'number' ? data.otherCitiesFee : 30,
              deliveryTimeframe: data.deliveryTimeframe || '24h à 48h',
              checkoutEmailMode: data.checkoutEmailMode || 'hidden',
            });
          }
        })
        .catch(() => {});

      return () => ctrl.abort();
    } catch {
      // ignore
    }
  }, []); // run once

  // Listen to live updates from admin logistics page
  useEffect(() => {
    const handleSettingsUpdated = () => {
      if (!storeSlug) return;
      fetch(`/api/stores/${encodeURIComponent(storeSlug)}/checkout-settings`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setShippingSettings({
              freeShippingThreshold: typeof data.freeShippingThreshold === 'number' ? data.freeShippingThreshold : 400,
              casaFee: typeof data.casaFee === 'number' ? data.casaFee : 20,
              rabatFee: typeof data.rabatFee === 'number' ? data.rabatFee : 25,
              otherCitiesFee: typeof data.otherCitiesFee === 'number' ? data.otherCitiesFee : 30,
              deliveryTimeframe: data.deliveryTimeframe || '24h à 48h',
              checkoutEmailMode: data.checkoutEmailMode || 'hidden',
            });
          }
        })
        .catch(() => {});
    };

    window.addEventListener('shipping-settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('shipping-settings-updated', handleSettingsUpdated);
  }, [storeSlug]);

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

  const setCountryCode = (c: string) => {
    const upper = c.trim().toUpperCase();
    setCountryCodeState(upper);
    try {
      if (typeof document !== 'undefined') {
        document.cookie = `cod_visitor_country=${upper}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch {}
  };

  const formatPrice = (amount: number, overrideCountry?: string) => {
    return formatCountryPrice(amount, overrideCountry || countryCode, lang);
  };

  const formatMAD = (amount: number) => {
    return formatPrice(amount, countryCode);
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

  const isDark = useMemo(() => {
    if (theme.id === 'fitness' || theme.id === 'cyberpunk') return true;
    try {
      const hex = theme.colors.bgPage.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return lum < 0.25;
    } catch {
      return false;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId, lang, setLang, countryCode, setCountryCode, shippingSettings, setShippingSettings, formatPrice, formatMAD, storeSlug }}>
      <div
        data-theme={themeId}
        suppressHydrationWarning
        style={{
          ...styleVars,
          backgroundColor: 'var(--theme-bg-page)',
          color: 'var(--theme-text-primary)',
          colorScheme: isDark ? 'dark' : 'light',
        } as React.CSSProperties}
        className={`min-h-screen ${mounted ? 'transition-[background-color,color,border-color] duration-[var(--motion-base)]' : ''} ${theme.typography.fontFamily === 'serif' ? 'font-serif' : theme.typography.fontFamily === 'monospace' ? 'font-mono' : 'font-sans'}`}
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
