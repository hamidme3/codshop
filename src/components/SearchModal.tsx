'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';
import { MOCK_PRODUCTS, Product } from '@/lib/mockProducts';
import { THEMES } from '@/lib/themes';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  PackageCheck,
  Tag,
  Clock,
  Compass,
} from 'lucide-react';

const POPULAR_SEARCHES = [
  'Babouches en Cuir',
  'Coffret Argan',
  'Écouteurs Sans Fil',
  'Miel d’Euphorbe',
  'Montre',
  'Sneakers',
];

const CATEGORY_SHORTCUTS = [
  { id: 'luxury', label: 'Luxe & Artisanal' },
  { id: 'beauty', label: 'Beauté & Soins' },
  { id: 'tech', label: 'High-Tech & Son' },
  { id: 'culinary', label: 'Terroir & Miels' },
  { id: 'fitness', label: 'Sport & Fitness' },
];

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch();
  const { theme, formatPrice, countryCode } = useTheme();
  const [query, setQuery] = useState('');
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Detect subdomain / store query on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      const rootDomain = (process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site').toLowerCase();
      const hasSub =
        (host.endsWith(rootDomain) && host !== rootDomain && host !== `www.${rootDomain}`) ||
        (host.endsWith('.localhost') && host !== 'localhost');
      setIsSubdomain(hasSub);

      let detected = '';
      if (hasSub) {
        detected = host.replace(`.${rootDomain}`, '').replace('.localhost', '');
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        detected = urlParams.get('store') || '';
      }

      const fetchSlug = detected || 'storet1';
      fetch(`/api/products?store=${encodeURIComponent(fetchSlug)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.products) && data.products.length > 0) {
            setStoreProducts(data.products);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Combine store products with base catalog
  const catalog = useMemo(() => {
    if (storeProducts.length === 0) return MOCK_PRODUCTS;
    const existingSlugs = new Set(storeProducts.map((p) => p.slug.toLowerCase()));
    const existingSkus = new Set(storeProducts.map((p) => (p.sku || p.id).toLowerCase()));
    const remainder = MOCK_PRODUCTS.filter(
      (p) => !existingSlugs.has(p.slug.toLowerCase()) && !existingSkus.has((p.sku || p.id).toLowerCase())
    );
    return [...storeProducts, ...remainder];
  }, [storeProducts]);

  // Lock body scroll and auto-focus when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(-1);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Search filter
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return catalog
      .filter((p) => {
        const title = p.title?.toLowerCase() || '';
        const titleAr = p.titleAr || '';
        const tagline = p.tagline?.toLowerCase() || '';
        const sku = p.sku?.toLowerCase() || '';
        const categoryName = THEMES[p.theme]?.name?.toLowerCase() || '';
        const categoryId = p.theme?.toLowerCase() || '';
        const desc = p.description?.toLowerCase() || '';

        return (
          title.includes(q) ||
          titleAr.includes(q) ||
          tagline.includes(q) ||
          categoryName.includes(q) ||
          categoryId.includes(q) ||
          sku.includes(q) ||
          desc.includes(q)
        );
      })
      .slice(0, 8); // top 8 results for ultra-fast predictive browsing
  }, [catalog, query]);

  // Build link preserving store parameter when not on subdomain
  const getProductHref = (slug: string) => {
    let url = `/product/${encodeURIComponent(slug)}`;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const store = urlParams.get('store');
      if (store && !isSubdomain) {
        url += `?store=${encodeURIComponent(store)}`;
      }
    }
    return url;
  };

  const getCatalogHref = (catId?: string, searchQuery?: string) => {
    const params = new URLSearchParams();
    if (catId && catId !== 'all') params.set('category', catId);
    if (searchQuery) params.set('q', searchQuery);
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const store = urlParams.get('store');
      if (store && !isSubdomain) {
        params.set('store', store);
      }
    }
    const qs = params.toString();
    return `/catalog${qs ? `?${qs}` : ''}`;
  };

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
        const item = filteredResults[selectedIndex];
        closeSearch();
        window.location.href = getProductHref(item.slug);
      } else if (query.trim()) {
        closeSearch();
        window.location.href = getCatalogHref(undefined, query.trim());
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recherche de produits"
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-16 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch();
      }}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sm:py-3.5 bg-zinc-50/70 dark:bg-zinc-900/70">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            placeholder="Rechercher un produit, une marque, une catégorie..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            aria-autocomplete="list"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 rounded border border-zinc-300/60 dark:border-zinc-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Scrollable Modal Content */}
        <div ref={resultsContainerRef} className="overflow-y-auto p-4 space-y-4">
          {query.trim() === '' ? (
            /* Suggestions & Category Shortcuts */
            <div className="space-y-5 py-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Recherches Populaires</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl transition cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Explorer par Catégorie</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_SHORTCUTS.map((cat) => (
                    <a
                      key={cat.id}
                      href={getCatalogHref(cat.id)}
                      onClick={() => closeSearch()}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition group text-left"
                    >
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white truncate">
                        {cat.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition group-hover:translate-x-0.5 shrink-0 ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredResults.length > 0 ? (
            /* Live Predictive Results List */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-medium px-1 pb-1">
                <span>Résultats ({filteredResults.length})</span>
                <span className="hidden sm:inline text-[11px] text-zinc-400">
                  Utilisez les flèches ↑↓ et Entrée
                </span>
              </div>
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800" role="listbox">
                {filteredResults.map((product, idx) => {
                  const isSelected = selectedIndex === idx;
                  const themeConfig = THEMES[product.theme];
                  const categoryName = themeConfig?.name || product.theme;

                  return (
                    <li key={product.id || product.slug} role="option" aria-selected={isSelected}>
                      <a
                        href={getProductHref(product.slug)}
                        onClick={() => closeSearch()}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl transition ${
                          isSelected
                            ? 'bg-zinc-100 dark:bg-zinc-800 shadow-xs'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=200&auto=format&fit=crop'}
                            alt={product.title}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                        </div>

                        {/* Title and Category */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                              {categoryName}
                            </span>
                            {product.stockLeft <= 5 && product.stockLeft > 0 && (
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                Plus que {product.stockLeft} restants
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {product.title}
                          </h4>
                          {product.tagline && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                              {product.tagline}
                            </p>
                          )}
                        </div>

                        {/* Price & Action */}
                        <div className="text-right shrink-0">
                          <div className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                            {formatPrice(product.price, countryCode || 'MA')}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-[11px] line-through text-zinc-400 font-semibold">
                              {formatPrice(product.originalPrice, countryCode || 'MA')}
                            </div>
                          )}
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            /* No Results State */
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Aucun produit trouvé pour &ldquo;{query}&rdquo;
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Vérifiez l’orthographe ou explorez l’ensemble de notre catalogue pour découvrir nos meilleures offres.
              </p>
              <a
                href={getCatalogHref()}
                onClick={() => closeSearch()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold rounded-xl transition hover:opacity-90"
              >
                <span>Voir tout le catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer with Catalog Jump */}
        {query.trim() && filteredResults.length > 0 && (
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between text-xs">
            <span className="text-zinc-500 text-[11px]">
              {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} prévisualisé{filteredResults.length > 1 ? 's' : ''}
            </span>
            <a
              href={getCatalogHref(undefined, query.trim())}
              onClick={() => closeSearch()}
              className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 transition"
            >
              <span>Voir tous les résultats dans le catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
