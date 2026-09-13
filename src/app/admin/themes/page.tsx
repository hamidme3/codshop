'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Palette, Check, ExternalLink, Sliders, 
  Search, Zap, RefreshCw, AlertCircle, ArrowRight,
  Sparkles, CheckCircle2, Eye, ShieldCheck, Truck, ShoppingBag
} from 'lucide-react';
import { THEMES, THEME_LIST, ThemeConfig, ThemeId, ThemeCategory } from '@/lib/themes';
import { useLanguage } from '@/contexts/LanguageContext';

const CATEGORIES: { id: ThemeCategory | 'all'; labelFr: string; labelEn: string; labelAr: string }[] = [
  { id: 'all', labelFr: 'Tous les thèmes (25)', labelEn: 'All Themes (25)', labelAr: 'جميع القوالب (25)' },
  { id: 'luxury', labelFr: 'Luxe & Prestige', labelEn: 'Luxury & Prestige', labelAr: 'فخامة وأناقة' },
  { id: 'general', labelFr: 'Top COD & Vitesse', labelEn: 'Top COD & High Speed', labelAr: 'الدفع عند الاستلام وسرعة فائقة' },
  { id: 'tech', labelFr: 'High-Tech & Gadgets', labelEn: 'Tech & Gadgets', labelAr: 'تكنولوجيا وإلكترونيات' },
  { id: 'beauty', labelFr: 'Beauté & Soins', labelEn: 'Beauty & Skincare', labelAr: 'تجميل وعناية' },
  { id: 'fashion', labelFr: 'Mode & Style', labelEn: 'Fashion & Apparel', labelAr: 'موضة وأزياء' },
  { id: 'home', labelFr: 'Maison & Déco', labelEn: 'Home & Living', labelAr: 'منزل وديكور' },
  { id: 'food', labelFr: 'Terroir & Bio', labelEn: 'Food & Organic', labelAr: 'أغذية ومنتجات طبيعية' },
  { id: 'kids', labelFr: 'Enfants & Bébés', labelEn: 'Kids & Baby', labelAr: 'أطفال ورضع' },
  { id: 'sports', labelFr: 'Sport & Fitness', labelEn: 'Sports & Fitness', labelAr: 'رياضة ولياقة' },
  { id: 'auto', labelFr: 'Auto & Moto', labelEn: 'Auto & Moto', labelAr: 'سيارات ودراجات' },
];

function MiniThemeMockup({ theme }: { theme: ThemeConfig }) {
  return (
    <div 
      className="w-full aspect-[16/10] p-3 flex flex-col justify-between rounded-xl relative overflow-hidden select-none border transition-transform duration-300"
      style={{ 
        backgroundColor: theme.colors.bgPage,
        borderColor: theme.colors.border,
      }}
    >
      {/* Mini Announcement Bar */}
      <div 
        className="w-full py-0.5 px-2 rounded text-[8px] font-medium text-white truncate text-center shadow-xs"
        style={{ backgroundColor: theme.announcementBg }}
      >
        {theme.announcementText}
      </div>

      {/* Mini Header / Store Title */}
      <div className="flex items-center justify-between px-1 py-1 border-b border-black/5">
        <div className="flex items-center gap-1">
          <div 
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <span 
            className={`text-[10px] font-bold tracking-tight truncate max-w-[120px] ${
              theme.typography.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
            }`}
            style={{ color: theme.colors.textPrimary }}
          >
            {theme.name}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[8px] text-slate-400">
          <ShoppingBag className="w-2.5 h-2.5" />
          <span className="font-mono">COD</span>
        </div>
      </div>

      {/* Mini Hero Card */}
      <div 
        className={`p-2.5 rounded-lg border shadow-xs flex flex-col justify-center space-y-1.5 ${theme.styleTokens.cardRadius}`}
        style={{ 
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border
        }}
      >
        <span 
          className={`text-[8px] font-semibold px-1.5 py-0.5 rounded w-fit ${theme.styleTokens.badgeStyle}`}
        >
          {theme.badge}
        </span>
        <h4 
          className={`text-[11px] font-extrabold leading-tight line-clamp-1 ${
            theme.typography.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
          }`}
          style={{ color: theme.colors.textPrimary }}
        >
          {theme.heroHeadline}
        </h4>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[9px] font-bold" style={{ color: theme.colors.accent }}>
            399 DH
          </span>
          <div 
            className={`px-2 py-0.5 text-[8px] font-bold text-white shadow-xs ${theme.styleTokens.buttonRadius}`}
            style={{ backgroundColor: theme.colors.primary }}
          >
            Acheter COD
          </div>
        </div>
      </div>

      {/* Mini COD Trust Bar */}
      <div className="flex items-center justify-between text-[7px] text-slate-500 px-1 pt-0.5 border-t border-black/5">
        <span className="flex items-center gap-0.5">
          <Truck className="w-2 h-2 text-amber-500" />
          <span>Livraison 24h</span>
        </span>
        <span className="flex items-center gap-0.5">
          <ShieldCheck className="w-2 h-2 text-emerald-500" />
          <span>Paiement après vérification</span>
        </span>
      </div>
    </div>
  );
}

function ThemeGalleryContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const { language } = useLanguage();

  const [activeThemeId, setActiveThemeId] = useState<ThemeId>('luxury');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingTheme, setLoadingTheme] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch active store theme on mount and store change
  useEffect(() => {
    let mounted = true;
    fetch(`/api/stores/${storeSlug}/theme`)
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.activeThemeId) {
          setActiveThemeId(data.activeThemeId);
        }
      })
      .catch((err) => {
        console.error('Failed to load store theme:', err);
      });

    return () => {
      mounted = false;
    };
  }, [storeSlug]);

  // Activate a theme
  const handleActivateTheme = async (theme: ThemeConfig) => {
    setLoadingTheme(theme.id);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/stores/${storeSlug}/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId: theme.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’activation du thème');
      }

      setActiveThemeId(theme.id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('codshop_theme', theme.id);
      }
      setSuccessMessage(
        language === 'ar'
          ? `تم تفعيل قالب "${theme.name}" بنجاح!`
          : language === 'en'
          ? `Theme "${theme.name}" successfully activated!`
          : `Thème "${theme.name}" activé avec succès pour votre boutique !`
      );

      // Auto-clear message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Impossible d’activer ce thème.');
    } finally {
      setLoadingTheme(null);
    }
  };

  const activeTheme = THEMES[activeThemeId] || THEMES.luxury;

  // Filter themes
  const filteredThemes = THEME_LIST.filter((theme) => {
    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    const matchesSearch =
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.sourceInspiration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.heroHeadline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Design System & Vitrine</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-400 font-mono">25 Thèmes Benchmarkés</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-amber-400" />
            {language === 'ar' ? 'معرض القوالب الاحترافية (25 قالب)' : language === 'en' ? 'Theme Gallery (25 Benchmarked Themes)' : 'Galerie de Thèmes E-Commerce (25 Thèmes)'}
          </h1>
          <p className="mt-1 text-xs text-zinc-400 max-w-3xl">
            {language === 'ar'
              ? 'قوالب مستوحاة من أفضل متاجر Shopify (Prestige, Dawn, Booster, Impulse) وWooCommerce (Flatsome, WoodMart) مع تحسين فوري لمعدل التحويل والدفع عند الاستلام بالمغرب.'
              : language === 'en'
              ? 'Hand-crafted templates benchmarked against top Shopify (Prestige, Dawn, Booster, Impulse) and WooCommerce (Flatsome, WoodMart) themes, fine-tuned for Moroccan COD.'
              : 'Thèmes inspirés des meilleures boutiques Shopify (Prestige, Dawn, Booster, Impulse) et WooCommerce (Flatsome, WoodMart) optimisés pour la vitesse et le Cash-on-Delivery au Maroc.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/builder?store=${storeSlug}`}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-2 border border-zinc-800 transition shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'مُصمم الصفحات المرئي' : language === 'en' ? 'Visual Page Builder' : 'Page Builder Visuel'}</span>
          </Link>
          <a
            href={`/?store=${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
          >
            <span>{language === 'ar' ? 'معاينة المتجر المباشر' : language === 'en' ? 'View Live Store' : 'Voir Storefront en Direct'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <a
            href={`/?store=${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white text-xs flex items-center gap-1"
          >
            Voir le résultat <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active Theme Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121215] p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-48 shrink-0">
              <MiniThemeMockup theme={activeTheme} />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {language === 'ar' ? 'القالب المفعّل حالياً' : language === 'en' ? 'Currently Active Theme' : 'Thème Actuellement Actif'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                  Benchmark: {activeTheme.sourceInspiration}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeTheme.badge}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {activeTheme.name}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">{activeTheme.tagline}</p>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-3 pt-1 text-xs text-zinc-400 flex-wrap">
                <span className="text-[11px] font-medium text-zinc-300">Palette :</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: activeTheme.colors.primary }}
                    title={`Primaire: ${activeTheme.colors.primary}`}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: activeTheme.colors.accent }}
                    title={`Accent: ${activeTheme.colors.accent}`}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: activeTheme.colors.bgPage }}
                    title={`Arrière-plan: ${activeTheme.colors.bgPage}`}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-xs"
                    style={{ backgroundColor: activeTheme.colors.cardBg }}
                    title={`Cartes: ${activeTheme.colors.cardBg}`}
                  />
                </div>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px]">Police: <strong className="text-zinc-200 capitalize font-mono">{activeTheme.typography.fontFamily}</strong></span>
                <span className="text-zinc-600">•</span>
                <span className="text-[11px]">Boutons: <strong className="text-zinc-200 capitalize font-mono">{activeTheme.styleTokens.buttonRadius}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/admin/builder?store=${storeSlug}`}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-2 border border-zinc-800 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Personnaliser dans Page Builder</span>
            </Link>
            <a
              href={`/?store=${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Tester en Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'ابحث باسم القالب أو المعيار أو المميزات...'
                  : language === 'en'
                  ? 'Search by theme name, benchmark (Shopify/WooCommerce)...'
                  : 'Rechercher par nom, benchmark (Shopify/WooCommerce)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono">
            <span>Affichage de <strong className="text-white">{filteredThemes.length}</strong> sur 25 thèmes</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 admin-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const label = language === 'ar' ? cat.labelAr : language === 'en' ? cat.labelEn : cat.labelFr;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                    : 'bg-[#121215] hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80'
                }`}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 25-Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => {
          const isActive = activeThemeId === theme.id;
          const isLoading = loadingTheme === theme.id;

          return (
            <div
              key={theme.id}
              className={`flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden bg-[#121215] hover:border-zinc-700/80 ${
                isActive
                  ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-md shadow-amber-500/10'
                  : 'border-zinc-800/80'
              }`}
            >
              {/* Card Header Preview Mockup */}
              <div className="p-4 pb-0">
                <MiniThemeMockup theme={theme} />
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-amber-400 border border-amber-400/20">
                          {theme.sourceInspiration}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-950 text-zinc-300 border border-zinc-800">
                          {theme.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight">{theme.name}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{theme.tagline}</p>
                    </div>
                  </div>

                  {/* Color Chips */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-zinc-500 font-medium">Palette :</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.colors.primary }}
                        title={`Couleur primaire: ${theme.colors.primary}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.colors.accent }}
                        title={`Couleur d'accent: ${theme.colors.accent}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.colors.bgPage }}
                        title={`Fond de page: ${theme.colors.bgPage}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: theme.colors.cardBg }}
                        title={`Cartes: ${theme.colors.cardBg}`}
                      />
                    </div>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-[10px] text-zinc-400 capitalize font-mono">{theme.typography.fontFamily}</span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-[10px] text-zinc-400 capitalize font-mono">{theme.styleTokens.buttonRadius}</span>
                  </div>

                  {/* Trust Pills / Highlights */}
                  <div className="space-y-1 pt-1">
                    {theme.trustPills.slice(0, 2).map((pill, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                        <div className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-zinc-300 font-medium">{pill.title}</span>
                        <span className="text-zinc-500">— {pill.subtitle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                  {isActive ? (
                    <button
                      disabled
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/30 cursor-default"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Thème Actif</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateTheme(theme)}
                      disabled={isLoading}
                      className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Activation...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Activer ce thème</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Direct Storefront Preview with theme override */}
                  <a
                    href={`/?store=${storeSlug}&theme=${theme.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs transition cursor-pointer"
                    title="Aperçu direct de ce thème dans un nouvel onglet"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminThemesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
            <span>Chargement de la galerie de thèmes...</span>
          </div>
        </div>
      }
    >
      <ThemeGalleryContent />
    </Suspense>
  );
}
