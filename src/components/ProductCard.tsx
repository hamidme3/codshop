'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/mockProducts';
import { useTheme } from '@/context/ThemeContext';
import { Star, ShieldCheck, ShoppingCart } from 'lucide-react';
import { CodCheckoutModal } from './CodCheckoutModal';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { theme, formatMAD } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const discountPercent = useMemo(() => {
    if (!product.originalPrice || product.originalPrice <= 0) return 0;
    if (product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }, [product.originalPrice, product.price]);

  return (
    <>
      <div
        className={`card-root group relative flex flex-col justify-between overflow-hidden border transition-[transform,box-shadow] duration-[var(--motion-base)] ease-[var(--easing-standard)] hover:shadow-xl hover:-translate-y-1 motion-reduce:transform-none motion-reduce:hover:shadow-none ${theme.styleTokens.cardRadius}`}
        style={
          {
            backgroundColor: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
            containerType: 'inline-size' as unknown as string,
          } as React.CSSProperties
        }
      >
        {/* Badges — logical props, max-w, focus-visible */}
        <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5 max-w-[60%]">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.stockLeft <= 10 && (
            <span className="bg-amber-500 text-zinc-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-sm truncate">
              Plus que {product.stockLeft} en stock
            </span>
          )}
        </div>

        {/* Image — with aspect, priority handled by parent */}
        <div
          className="relative aspect-square w-full overflow-hidden"
          style={{ backgroundColor: 'color-mix(in oklch, var(--theme-border) 30%, var(--theme-card-bg))' }}
        >
          <Link
            href={`/product/${product.slug}`}
            aria-label={product.title}
            className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2"
          >
            <img
              src={product.images[0]}
              alt={product.title}
              width={400}
              height={400}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              className="h-full w-full object-cover object-center transition-transform duration-[var(--motion-slow)] ease-[var(--easing-standard)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-amber-500 text-xs" role="img" aria-label={`${product.rating} sur 5`}>
              <div className="flex items-center" aria-hidden="true">
                {[...Array(5)].map((_, i) => {
                  const filled = i < Math.round(product.rating);
                  return <Star key={i} className={`w-3.5 h-3.5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />;
                })}
              </div>
              <span className="font-bold ml-1" style={{ color: 'var(--theme-text-primary)' }}>
                {product.rating}
              </span>
              <span className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
                ({product.reviewCount} avis)
              </span>
            </div>
            <h3 className={`mt-1.5 font-bold text-sm line-clamp-2 min-w-0 card-title ${theme.typography.scale.cardTitle}`} style={{ color: 'var(--theme-text-primary)' }}>
              <Link
                href={`/product/${product.slug}`}
                className="hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
              >
                {product.title}
              </Link>
              {/* Bilingual Darija/Arabic subtitle — stacked below French title */}
              {product.titleAr && (
                <bdi
                  dir="rtl"
                  className="block text-xs font-medium opacity-75 mt-0.5 line-clamp-1"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  {product.titleAr}
                </bdi>
              )}
            </h3>
            <p className="text-xs line-clamp-2 mt-1 min-w-0" style={{ color: 'var(--theme-text-secondary)' }}>
              {product.tagline}
            </p>
          </div>

          <div className="pt-2 space-y-2.5" style={{ borderTop: '1px solid var(--theme-border)' }}>
            {/* Price row — container query handles 320px via @container */}
            <div className="price-row flex items-baseline justify-between gap-2 flex-wrap min-w-0">
              <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                <span className="price-value text-lg font-black truncate" style={{ color: 'var(--theme-text-primary)' }} dir="ltr">
                  {formatMAD(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span
                    className="card-price-original text-xs line-through truncate"
                    style={{ color: 'color-mix(in oklch, var(--theme-text-secondary) 85%, var(--theme-card-bg))' }}
                    dir="ltr"
                  >
                    {formatMAD(product.originalPrice)}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0"
                style={{
                  color: 'var(--theme-badge-text)',
                  backgroundColor: 'var(--theme-badge-bg)',
                  borderColor: 'var(--theme-border)',
                }}
              >
                Paiement à la livraison
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              aria-haspopup="dialog"
              aria-controls={`checkout-${product.slug}`}
              className={`btn-primary w-full py-2.5 px-3 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-2 transition-opacity duration-[var(--motion-base)] ${theme.styleTokens.buttonRadius}`}
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Commander Maintenant</span>
            </button>
          </div>
        </div>
      </div>

      <CodCheckoutModal product={product} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
