'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { Product } from '@/lib/mockProducts';
import { useTheme } from '@/context/ThemeContext';
import { Star, ShieldCheck, ShoppingCart } from 'lucide-react';
import { CodCheckoutModal } from './CodCheckoutModal';

export function ProductCard({ product }: { product: Product }) {
  const { theme, formatMAD } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between overflow-hidden bg-white border border-zinc-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${theme.styleTokens.cardRadius}`}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
            -{discountPercent}%
          </span>
          {product.stockLeft <= 10 && (
            <span className="bg-amber-500 text-zinc-950 font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
              Plus que {product.stockLeft} en stock
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-zinc-100">
          <a href={`/product/${product.slug}`}>
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </a>
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Reviews */}
            <div className="flex items-center gap-1 text-amber-500 text-xs">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-zinc-700 ml-1">{product.rating}</span>
              <span className="text-zinc-400 text-[11px]">({product.reviewCount} avis)</span>
            </div>

            {/* Title */}
            <h3 className="mt-1.5 font-bold text-sm text-zinc-900 line-clamp-2 hover:text-emerald-700 transition">
              <a href={`/product/${product.slug}`}>{product.title}</a>
            </h3>

            {/* Tagline */}
            <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
              {product.tagline}
            </p>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-2 border-t border-zinc-100 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-lg font-black text-zinc-950">
                  {formatMAD(product.price)}
                </span>
                <span className="text-xs line-through text-zinc-400 ml-2">
                  {formatMAD(product.originalPrice)}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Paiement à la livraison
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={`w-full py-2.5 px-3 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 ${theme.styleTokens.buttonRadius}`}
              style={{
                backgroundColor: theme.colors.primary,
              }}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Commander Maintenant</span>
            </button>
          </div>
        </div>
      </div>

      <CodCheckoutModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
