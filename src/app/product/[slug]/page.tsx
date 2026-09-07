'use client';

import React, { useState, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProductBySlug } from '@/lib/mockProducts';
import { getDeliveryDateEstimate } from '@/lib/moroccanCities';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useTheme } from '@/context/ThemeContext';
import { Star, ShieldCheck, Truck, RotateCcw, Check, Sparkles, MessageCircle } from 'lucide-react';
import { CodCheckoutModal } from '@/components/CodCheckoutModal';
import { CartWidget } from '@/components/CartWidget';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);
  const { formatMAD, theme } = useTheme();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.options.find((o) => o.inStock)?.name || ''
  );
  const [selectedQuantity, setSelectedQuantity] = useState(product?.quantityTiers[0]?.quantity || 1);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const deliveryEstimate = useMemo(
    () => (product ? getDeliveryDateEstimate('Casablanca', product.price) : null),
    [product]
  );

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

  const discountPercent = product?.originalPrice && product.originalPrice > 0 && product.price > 0
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* YouCan-style promo banner — zero-JS, mobile-first */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black tracking-wider backdrop-blur-sm border border-white/30">
              🔥 OFFERTE SPÉCIALE
            </div>
            <h2 className="font-black text-xl sm:text-2xl tracking-tight leading-none">Livraison Gratuite & Paiement COD</h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium">Dépêchez-vous ! Commandes avant 16h expédiées aujourd'hui.</p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <div className="font-mono text-2xl font-black text-white/90">24/48H</div>
            <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Livraison</div>
          </div>
        </div>
      </div>

      {/* Breadcrumb with cart widget */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400 min-w-0">
          <a href="/" className="hover:text-zinc-900 transition">Accueil</a>
          <span>/</span>
          <span className="text-zinc-600 font-medium capitalize">{product.theme}</span>
          <span>/</span>
          <span className="text-zinc-900 font-semibold truncate">{product.title}</span>
        </div>
        <CartWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm">
            <img
              src={product?.images?.[activeImage] || product?.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'}
              alt={product?.title || 'Produit'}
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
                  {formatMAD(product?.price ?? 0)}
                </span>
                <span className="text-sm line-through text-zinc-400 font-semibold">
                  {formatMAD(product?.originalPrice ?? 0)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                Économisez {formatMAD(Math.max(0, (product?.originalPrice ?? 0) - (product?.price ?? 0)))}
              </span>
            </div>
          </div>

          {/* YouCan-inspired urgency signals: countdown + stock urgency + real-time visitor */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 shadow-sm">
            <CountdownTimer endTimeISO={new Date(Date.now() + 24 * 3600 * 1000).toISOString()} />
            <div className="w-px h-5 bg-amber-200" />
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700">
              <span>Seulement {product?.stockLeft ?? 0} en stock!</span>
              <span>—</span>
              <span>1 visiteur en temps réel</span>
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

          {/* Quantity Tiers / Special Packs */}
          {product.quantityTiers.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                <span>Choisissez votre offre spéciale :</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Paiement à la livraison</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.quantityTiers.map((tier) => {
                  const isSelected = selectedQuantity === tier.quantity;
                  return (
                    <button
                      key={tier.quantity}
                      type="button"
                      onClick={() => setSelectedQuantity(tier.quantity)}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                          : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-zinc-900">{tier.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                      </div>
                      <div className="mt-2 flex items-baseline justify-between gap-1">
                        <span className="font-black text-sm text-zinc-950">{formatMAD(tier.totalPrice)}</span>
                        {tier.savingsBadge && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            {tier.savingsBadge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Moroccan Delivery Estimate Banner */}
          {deliveryEstimate && (
            <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-emerald-950">
                  Livraison estimée : {deliveryEstimate.formattedEstimate}
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Délai {deliveryEstimate.sla} • Paiement 100% Cash à la Livraison (COD)
                </p>
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
                `Salam, je souhaite commander : ${product?.title ?? 'ce produit'} (${formatMAD(product?.price ?? 0)})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-white hover:bg-zinc-50 text-zinc-800 border-2 border-zinc-200 font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-sm min-h-[48px]"
              aria-label="Commander via WhatsApp"
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
        initialQuantity={selectedQuantity}
        initialVariant={selectedVariant}
      />
    </div>
  );
}
