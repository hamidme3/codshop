'use client';

import React, { useState, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_PRODUCTS, Product } from '@/lib/mockProducts';
import { ProductCard } from '@/components/ProductCard';
import { getCountryConfig } from '@/lib/geo';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  PackageCheck,
  Truck,
  ShieldCheck,
  X,
  Compass,
  Check,
  Filter,
} from 'lucide-react';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export default function CatalogPage() {
  const { theme, formatPrice, countryCode } = useTheme();
  const countryConfig = useMemo(() => getCountryConfig(countryCode || 'MA'), [countryCode]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Dynamic Category Definitions based on mock catalog
  const categories = useMemo(
    () => [
      { id: 'all', label: 'Tous les produits', count: MOCK_PRODUCTS.length },
      {
        id: 'luxury',
        label: 'Maroquinerie & Luxe',
        count: MOCK_PRODUCTS.filter((p) => p.theme === 'luxury').length,
      },
      {
        id: 'beauty',
        label: 'Beauté & Soins',
        count: MOCK_PRODUCTS.filter((p) => p.theme === 'beauty').length,
      },
      {
        id: 'tech',
        label: 'High-Tech & Son',
        count: MOCK_PRODUCTS.filter((p) => p.theme === 'tech').length,
      },
      {
        id: 'culinary',
        label: 'Terroir & Miels',
        count: MOCK_PRODUCTS.filter((p) => p.theme === 'culinary').length,
      },
      {
        id: 'fitness',
        label: 'Sport & Fitness',
        count: MOCK_PRODUCTS.filter((p) => p.theme === 'fitness').length,
      },
      {
        id: 'kitchen',
        label: 'Maison & Artisanat',
        count: MOCK_PRODUCTS.filter((p) => p.theme === 'kitchen').length,
      },
      {
        id: 'streetwear',
        label: 'Mode & Barbershop',
        count: MOCK_PRODUCTS.filter((p) => p.theme === 'streetwear').length,
      },
    ],
    []
  );

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchTitleAr = p.titleAr ? p.titleAr.includes(q) : false;
        const matchTagline = p.tagline.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        if (!matchTitle && !matchTitleAr && !matchTagline && !matchSku) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && p.theme !== selectedCategory) {
        return false;
      }

      // 3. Price Range Filter (in MAD)
      if (selectedPriceRange === 'under-250' && p.price >= 250) return false;
      if (selectedPriceRange === '250-400' && (p.price < 250 || p.price > 400)) return false;
      if (selectedPriceRange === 'over-400' && p.price <= 400) return false;

      // 4. In Stock Filter
      if (inStockOnly && p.stockLeft <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // 'featured' keeps curated order
    });
  }, [searchQuery, selectedCategory, selectedPriceRange, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSortBy('featured');
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header Banner */}
      <section
        className="relative border-b py-10 px-4 sm:px-6 transition-colors duration-200"
        style={{
          backgroundColor: 'color-mix(in oklch, var(--theme-card-bg) 90%, transparent)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
            <a href="/" className="hover:underline">
              Accueil
            </a>
            <span>/</span>
            <span style={{ color: 'var(--theme-text-primary)' }} className="font-bold">
              Catalogue & Collections
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-2"
                style={{
                  backgroundColor: theme.colors.badgeBg,
                  color: theme.colors.badgeText,
                  borderColor: theme.colors.border,
                }}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Boutique Officielle {countryConfig.name}</span>
              </div>
              <h1
                className={`text-2xl sm:text-4xl font-black tracking-tight ${theme.typography.headingClass}`}
                style={{ color: 'var(--theme-text-primary)' }}
              >
                Nos Collections & Produits
              </h1>
              <p className="text-xs sm:text-sm mt-1 max-w-xl" style={{ color: 'var(--theme-text-secondary)' }}>
                Articles authentiques garantis • Paiement 100% à la livraison (COD) • Vérification du colis autorisée.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div
              className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl border text-xs font-semibold self-start md:self-auto"
              style={{
                backgroundColor: 'var(--theme-card-bg)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-primary)',
              }}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>
                Livraison {countryConfig.defaultSla} ({countryConfig.hubSla.hubName})
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Controls & Search Bar */}
        <div
          className="p-4 rounded-2xl border space-y-4 shadow-xs"
          style={{
            backgroundColor: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
          }}
        >
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Rechercher un produit, référence ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border transition focus:outline-none focus:ring-2 bg-white text-zinc-900 placeholder:text-zinc-400"
                style={{
                  borderColor: 'var(--theme-border)',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & In-Stock Controls */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900 border-zinc-300"
                />
                <span style={{ color: 'var(--theme-text-primary)' }}>En stock uniquement</span>
              </label>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Trier les produits"
                  className="text-xs font-bold py-2.5 px-3 rounded-xl border bg-white text-zinc-800 focus:outline-none focus:ring-2 cursor-pointer shadow-xs"
                  style={{
                    borderColor: 'var(--theme-border)',
                  }}
                >
                  <option value="featured">✨ Populaire & Recommandé</option>
                  <option value="price-asc">Prix : Moins cher au plus cher</option>
                  <option value="price-desc">Prix : Plus cher au moins cher</option>
                  <option value="rating">⭐ Meilleures Notes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'shadow-xs text-white'
                      : 'border hover:bg-black/5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                    borderColor: isSelected ? theme.colors.primary : 'var(--theme-border)',
                    color: isSelected ? '#ffffff' : 'var(--theme-text-primary)',
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-zinc-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Price Range Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t text-xs font-medium" style={{ borderColor: 'var(--theme-border)' }}>
            <span className="text-[11px] font-bold" style={{ color: 'var(--theme-text-secondary)' }}>
              Budget :
            </span>
            {[
              { id: 'all', label: 'Tous les prix' },
              { id: 'under-250', label: `< 250 ${countryConfig.currency.symbol}` },
              { id: '250-400', label: `250 - 400 ${countryConfig.currency.symbol}` },
              { id: 'over-400', label: `> 400 ${countryConfig.currency.symbol}` },
            ].map((pRange) => (
              <button
                key={pRange.id}
                type="button"
                onClick={() => setSelectedPriceRange(pRange.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  selectedPriceRange === pRange.id
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {pRange.label}
              </button>
            ))}

            {(searchQuery || selectedCategory !== 'all' || selectedPriceRange !== 'all' || inStockOnly) && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-auto text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--theme-text-secondary)' }}>
          <span>
            {filteredProducts.length} {filteredProducts.length > 1 ? 'articles trouvés' : 'article trouvé'}
          </span>
          <span>Paiement à la livraison sur toute la sélection</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div
            className="py-20 text-center rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--theme-card-bg)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <Compass className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-black text-lg text-zinc-800">Aucun produit ne correspond à vos critères</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                Essayez d'élargir votre recherche ou de réinitialiser vos filtres pour voir l'ensemble de la collection.
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Voir tous les produits ({MOCK_PRODUCTS.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Reassurance Banner */}
        <section className="pt-8">
          <div className="rounded-2xl bg-zinc-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sécurité & Garantie COD</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold">
                Commandez en Ligne, Réglez à la Réception
              </h3>
              <p className="text-xs text-zinc-400 max-w-lg">
                Notre livreur vous contacte avant son passage. Vous examinez vos articles avant de remettre les espèces.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
              <div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Inspection autorisée</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zéro avance demandée</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
