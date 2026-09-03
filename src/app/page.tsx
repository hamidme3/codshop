'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { getProductsByTheme } from '@/lib/mockProducts';
import { ProductCard } from '@/components/ProductCard';
import { Award, Sparkles, Zap, ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';

export default function HomePage() {
  const { theme, lang } = useTheme();
  const products = getProductsByTheme(theme.id);

  return (
    <div className="space-y-12 pb-16">
      {/* Dynamic Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white via-zinc-50/50 to-transparent">
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

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[1.15]">
              {theme.id === 'luxury' && 'L’Élégance Pure, Façonnée à la Main.'}
              {theme.id === 'beauty' && 'Révélez l’Éclat Naturel de Votre Peau.'}
              {theme.id === 'tech' && 'La Technologie de Demain, au Meilleur Prix.'}
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto lg:mx-0">
              {theme.tagline}. Profitez d’une livraison express partout au Maroc avec vérification du colis et paiement à la réception.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
              <a
                href="#catalog"
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  borderRadius: theme.id === 'beauty' ? '9999px' : '10px',
                }}
              >
                <span>Découvrir le Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 bg-zinc-100 px-3.5 py-2.5 rounded-xl">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Livraison 24h/48h au Maroc</span>
              </div>
            </div>

            {/* Social Proof Star rating */}
            <div className="flex items-center gap-3 justify-center lg:justify-start pt-3 text-xs text-zinc-600">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-zinc-900">4.9 / 5</span>
              <span>•</span>
              <span>Plus de 5 000 clients satisfaits au Maroc</span>
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
              className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center gap-3 shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-800 font-bold">
                {theme.id === 'luxury' ? <Award className="w-5 h-5 text-amber-600" /> :
                 theme.id === 'beauty' ? <Sparkles className="w-5 h-5 text-rose-600" /> :
                 <Zap className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900">{pill.title}</h4>
                <p className="text-[11px] text-zinc-500">{pill.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Sélection Exclusive
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              Nos Meilleures Ventes du Moment
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {products.length} {products.length > 1 ? 'produits disponibles' : 'produit disponible'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
