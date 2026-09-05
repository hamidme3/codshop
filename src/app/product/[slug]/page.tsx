'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProductBySlug } from '@/lib/mockProducts';
import { useTheme } from '@/context/ThemeContext';
import { Star, ShieldCheck, Truck, RotateCcw, Check, Sparkles, MessageCircle } from 'lucide-react';
import { CodCheckoutModal } from '@/components/CodCheckoutModal';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);
  const { formatMAD, theme } = useTheme();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.options.find((o) => o.inStock)?.name || ''
  );
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Produit introuvable</h1>
        <p className="text-xs text-zinc-500">Ce produit n’est plus disponible ou a été déplacé.</p>
        <a href="/" className="inline-block px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold">
          Retour à la boutique
        </a>
      </div>
    );
  }

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <a href="/" className="hover:text-zinc-900 transition">Accueil</a>
        <span>/</span>
        <span className="text-zinc-600 font-medium capitalize">{product.theme}</span>
        <span>/</span>
        <span className="text-zinc-900 font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
            <img
              src={product.images[activeImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-sm">
                -{discountPercent}% OFF
              </span>
              <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                Paiement Cash à la Livraison
              </span>
            </div>
          </div>

          {/* Thumbnail row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImage === idx ? 'border-zinc-900 shadow-md' : 'border-zinc-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Area */}
        <div className="space-y-6">
          <div>
            {/* Reviews */}
            <div className="flex items-center gap-2 text-amber-500 text-xs">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-zinc-800">{product.rating} / 5</span>
              <span className="text-zinc-400">({product.reviewCount} avis certifiés)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
              {product.tagline}
            </p>
          </div>

          {/* Price Tag */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-500">Prix Spécial Promotionnel :</div>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-3xl font-black text-zinc-950">
                  {formatMAD(product.price)}
                </span>
                <span className="text-sm line-through text-zinc-400 font-semibold">
                  {formatMAD(product.originalPrice)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                Économisez {formatMAD(product.originalPrice - product.price)}
              </span>
            </div>
          </div>

          {/* Variants (Pointure / Contenance / Couleur) */}
          {product.variants && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                <span>{product.variants.label} :</span>
                {selectedVariant && <span className="text-emerald-700">Sélectionné: {selectedVariant}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.options.map((opt) => {
                  const isSelected = selectedVariant === opt.name;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={!opt.inStock}
                      onClick={() => setSelectedVariant(opt.name)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        !opt.inStock
                          ? 'opacity-30 line-through bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed'
                          : isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                          : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500'
                      }`}
                    >
                      {opt.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowCheckoutModal(true)}
              className={`w-full py-4 px-6 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 ${theme.styleTokens.buttonRadius}`}
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span>Acheter Maintenant — Paiement à la Livraison</span>
            </button>

            <a
              href={`https://wa.me/${product.whatsAppDirectNumber}?text=${encodeURIComponent(
                `Salam, je souhaite commander : ${product.title} (${formatMAD(product.price)})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 bg-white hover:bg-zinc-50 text-zinc-800 border-2 border-zinc-200 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Commander en 1 Clic via WhatsApp</span>
            </a>
          </div>

          {/* Reassurance list */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200 text-xs">
            <div className="flex items-center gap-2 text-zinc-700">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Livraison 24h/48h au Maroc</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Paiement Cash à l'arrivée</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Échange garanti sous 7 jours</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Produit 100% garanti conforme</span>
            </div>
          </div>

          {/* Detailed Features */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <h3 className="text-sm font-bold text-zinc-900">Points Forts & Caractéristiques :</h3>
            <ul className="space-y-2">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-600">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <CodCheckoutModal
        product={product}
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        initialVariant={selectedVariant}
      />
    </div>
  );
}
