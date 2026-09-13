'use client';

import React, { useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getCountryConfig } from '@/lib/geo';
import { getProductsByTheme, MOCK_PRODUCTS } from '@/lib/mockProducts';
import { ProductCard } from '@/components/ProductCard';
import { Award, Sparkles, Zap, ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';

export default function HomePage() {
  const { theme, lang, countryCode } = useTheme();
  const countryConfig = useMemo(() => getCountryConfig(countryCode), [countryCode]);
  const products = getProductsByTheme(theme.id);

  return (
    <div className="space-y-12 pb-16">
      {/* Dynamic Hero Section */}
      <section
        className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6 transition-colors duration-300"
        style={{
          background: `linear-gradient(to bottom, var(--theme-card-bg) 0%, transparent 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border"
              style={{
                backgroundColor: theme.colors.badgeBg,
                color: theme.colors.badgeText,
                borderColor: theme.colors.border,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{theme.badge}</span>
            </div>

            <h1
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] ${theme.typography.headingClass}`}
              style={{ color: 'var(--theme-text-primary)' }}
            >
              {theme.heroHeadline}
            </h1>

            <p
              className="text-sm sm:text-base max-w-xl mx-auto lg:mx-0"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
              {theme.heroSubheadline ? theme.heroSubheadline.replace(/au Maroc/gi, countryConfig.inCountryName || 'au Maroc') : theme.tagline}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
              <a
                href="#catalog"
                className={`w-full sm:w-auto px-6 py-4 text-white font-black text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] ${theme.styleTokens.buttonRadius}`}
                style={{
                  backgroundColor: theme.colors.primary,
                }}
                aria-label="Commander Maintenant - navigateur vers le catalogue"
              >
                <span>Commander Maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div
                className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border"
                style={{
                  backgroundColor: 'var(--theme-card-bg)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-primary)',
                }}
              >
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Livraison {countryConfig.defaultSla}</span>
              </div>
            </div>

            {/* Social Proof Star rating */}
            <div className="flex items-center gap-3 justify-center lg:justify-start pt-3 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold" style={{ color: 'var(--theme-text-primary)' }}>4.9 / 5</span>
              <span>•</span>
              <span>Plus de 5 000 clients satisfaits {countryConfig.inCountryName || ''}</span>
            </div>
          </div>

          {/* Hero Featured Product Card Preview */}
          {products[0] && (
            <div className="relative mx-auto max-w-md w-full">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-400/20 via-rose-400/20 to-blue-400/20 blur-xl opacity-70" />
              <div className="relative">
                <ProductCard product={products[0]} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {theme.trustPills.map((pill, i) => (
            <div
              key={i}
              className={`p-4 border flex items-center gap-3 shadow-xs transition-colors duration-200 ${theme.styleTokens.cardRadius}`}
              style={{
                backgroundColor: 'var(--theme-card-bg)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold"
                style={{
                  backgroundColor: `${theme.colors.accent}18`,
                  color: theme.colors.accent,
                }}
              >
                {pill.icon.toLowerCase().includes('truck') ? (
                  <Truck className="w-5 h-5 text-emerald-600" />
                ) : pill.icon.toLowerCase().includes('shield') ? (
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                ) : pill.icon.toLowerCase().includes('award') ? (
                  <Award className="w-5 h-5 text-amber-600" />
                ) : pill.icon.toLowerCase().includes('zap') || pill.icon.toLowerCase().includes('flame') ? (
                  <Zap className="w-5 h-5 text-orange-600" />
                ) : (
                  <Sparkles className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs" style={{ color: 'var(--theme-text-primary)' }}>{pill.title}</h4>
                <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
                  {pill.subtitle.replace(/au Maroc/gi, countryConfig.inCountryName || 'au Maroc')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-4" style={{ borderColor: 'var(--theme-border)' }}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.accent }}>
              Sélection Exclusive
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1" style={{ color: 'var(--theme-text-primary)' }}>
              Nos Meilleures Ventes du Moment
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
              {products.length} {products.length > 1 ? 'produits disponibles' : 'produit disponible'}
            </span>
            <a
              href="/catalog"
              className="text-xs font-bold flex items-center gap-1 hover:opacity-80 px-2.5 py-1 rounded-lg border transition"
              style={{
                color: 'var(--theme-text-primary)',
                borderColor: 'var(--theme-border)',
                backgroundColor: 'var(--theme-card-bg)',
              }}
            >
              <span>Voir tout ({MOCK_PRODUCTS.length})</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View Full Catalog Callout */}
        <div
          className="p-4 rounded-2xl border text-center flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs"
          style={{
            backgroundColor: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="text-left">
            <h4 className="text-xs font-bold" style={{ color: 'var(--theme-text-primary)' }}>
              Envie d'explorer plus d'articles ?
            </h4>
            <p className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
              Découvrez l'ensemble de notre catalogue avec filtres par catégorie, budget et recherche directe.
            </p>
          </div>
          <a
            href="/catalog"
            className="px-4 py-2 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <span>Accéder au Catalogue Complet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* Moroccan Assurance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-zinc-900 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Engagement Sûreté 100%
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Commandez en Toute Sérénité
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg">
              Aucune avance demandée. Notre livreur vous contacte par téléphone avant son passage. Vous ouvrez et vérifiez votre colis avant de régler.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/212661000000?text=Salam,%20je%20veux%20en%20savoir%20plus%20sur%20les%20commandes"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Discuter sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
