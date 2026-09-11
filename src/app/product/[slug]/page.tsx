'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { getProductBySlug, getProductQuantityTiers, getProductVariantInfo } from '@/lib/mockProducts';
import { getDeliveryDateEstimate } from '@/lib/moroccanCities';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useTheme } from '@/context/ThemeContext';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Sparkles,
  MessageCircle,
  Gift,
  ArrowRight,
  PackageCheck,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { CodCheckoutModal } from '@/components/CodCheckoutModal';
import { CartWidget } from '@/components/CartWidget';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);
  const { formatMAD, theme } = useTheme();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.find((c) => c.inStock !== false)?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.find((s) => s.inStock !== false)?.name || ''
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.options?.find((o) => o.inStock)?.name || ''
  );

  const activeVariantInfo = useMemo(() => {
    if (!product) {
      return { sku: '', stock: 0, inStock: false, label: '', price: 0 };
    }
    return getProductVariantInfo(product, selectedColor, selectedSize, selectedVariant);
  }, [product, selectedColor, selectedSize, selectedVariant]);

  // Synchronize color selection with primary preview image
  useEffect(() => {
    if (activeVariantInfo?.image && product?.images) {
      const idx = product.images.findIndex((img) => img === activeVariantInfo.image);
      if (idx !== -1) {
        setActiveImage(idx);
      }
    }
  }, [activeVariantInfo?.image, product?.images]);

  const quantityTiers = useMemo(
    () => (product ? getProductQuantityTiers(product) : []),
    [product]
  );
  const [selectedQuantity, setSelectedQuantity] = useState(
    product?.quantityTiers?.[0]?.quantity || 1
  );
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const activeTier = useMemo(
    () => quantityTiers.find((t) => t.quantity === selectedQuantity) || quantityTiers[0],
    [quantityTiers, selectedQuantity]
  );

  const deliveryEstimate = useMemo(
    () => (product ? getDeliveryDateEstimate('Casablanca', activeTier?.totalPrice ?? product.price) : null),
    [product, activeTier]
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-28 md:pb-12 space-y-12">
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

            {/* Dynamic SKU & Real-Time Warehouse Stock Badge */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="font-mono text-xs font-black text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200">
                SKU: {activeVariantInfo.sku}
              </span>
              {activeVariantInfo.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeVariantInfo.stock <= 5
                    ? `Seulement ${activeVariantInfo.stock} en stock (Dépôt Aïn Sebaâ)`
                    : 'En stock (Expédié depuis Aïn Sebaâ)'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Rupture de Stock (Épuisé)
                </span>
              )}
            </div>

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

          {/* Authentic Variant-Level Urgency: countdown + dynamic variant stock + visitors */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 shadow-sm">
            <CountdownTimer endTimeISO={new Date(Date.now() + 24 * 3600 * 1000).toISOString()} />
            <div className="w-px h-5 bg-amber-200" />
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700">
              {activeVariantInfo.inStock ? (
                <span>Plus que {activeVariantInfo.stock} en stock pour cette option!</span>
              ) : (
                <span className="text-rose-700 font-bold">Option actuellement épuisée</span>
              )}
              <span>—</span>
              <span>1 visiteur en temps réel</span>
            </div>
          </div>

          {/* 1. Color Selector (if product has colors) */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                <span>Couleur :</span>
                {selectedColor && <span className="text-emerald-700 font-bold">Sélectionné: {selectedColor}</span>}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.image) {
                          const idx = product.images.findIndex((img) => img === c.image);
                          if (idx !== -1) setActiveImage(idx);
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-md ring-2 ring-zinc-900/20'
                          : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      {c.hex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                      )}
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Size / Pointure Selector (if product has sizes) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                <span>Pointure / Taille (EU) :</span>
                {selectedSize && <span className="text-emerald-700 font-bold">Pointure: {selectedSize}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s.name;
                  const comboInfo = getProductVariantInfo(product, selectedColor, s.name);
                  const isComboOutOfStock = !comboInfo.inStock;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSize(s.name)}
                      className={`min-w-[44px] px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        isComboOutOfStock
                          ? 'opacity-35 line-through bg-zinc-100 border-zinc-200 text-zinc-400'
                          : isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                          : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500'
                      }`}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Single-Axis Variants (Volume / Contenance / etc. if not using dual-axis) */}
          {!product.colors && !product.sizes && product.variants && (
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

          {/* Moroccan COD Warehouse Out-Of-Stock Protection Alert */}
          {!activeVariantInfo.inStock && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Rupture de stock pour cette combinaison :</span>
                <p className="mt-0.5 text-[11px] text-rose-600 leading-relaxed">
                  L'article <strong>{activeVariantInfo.label || activeVariantInfo.sku}</strong> est actuellement épuisé dans notre dépôt d'Aïn Sebaâ. Veuillez choisir une autre pointure ou couleur.
                </p>
              </div>
            </div>
          )}

          {/* Multi-tier quantity upsells (Pack 1: Standard, Pack 2: Duo [Most Popular], Pack 3: Trio + Gift) */}
          {quantityTiers.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                <span className="flex items-center gap-1.5">
                  <span>Choisissez votre pack spécial :</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Paiement à la livraison (COD)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {quantityTiers.map((tier) => {
                  const isSelected = selectedQuantity === tier.quantity;
                  const isPopular = tier.isPopular || tier.quantity === 2;
                  const isTrio = tier.quantity === 3;

                  return (
                    <button
                      key={tier.quantity}
                      type="button"
                      onClick={() => setSelectedQuantity(tier.quantity)}
                      className={`relative p-3 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[110px] ${
                        isSelected
                          ? isPopular
                            ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                            : isTrio
                            ? 'border-purple-600 bg-purple-50/40 shadow-md ring-2 ring-purple-500/20'
                            : 'border-zinc-900 bg-zinc-50 shadow-sm ring-1 ring-zinc-900'
                          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-xs'
                      }`}
                    >
                      {/* High-converting Moroccan Urgency Badges */}
                      {isPopular && (
                        <span className="absolute -top-2.5 right-2 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          🔥 Plus Populaire (الأكثر طلباً)
                        </span>
                      )}
                      {isTrio && (
                        <span className="absolute -top-2.5 right-2 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          🎁 Pack Trio + Cadeau
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? isPopular
                                    ? 'border-emerald-600 bg-emerald-600 text-white'
                                    : isTrio
                                    ? 'border-purple-600 bg-purple-600 text-white'
                                    : 'border-zinc-900 bg-zinc-900 text-white'
                                  : 'border-zinc-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-bold text-zinc-900 truncate">{tier.label}</span>
                          </div>
                        </div>

                        {/* Badges: Free delivery + Free gift */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(tier.freeDelivery || tier.quantity >= 2) ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                              <Truck className="w-3 h-3 text-emerald-700 shrink-0" />
                              Livraison Gratuite 24h
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                              Livraison standard
                            </span>
                          )}
                          {tier.freeGift && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-800 bg-purple-100/90 px-1.5 py-0.5 rounded">
                              <Gift className="w-3 h-3 text-purple-700 shrink-0" />
                              Cadeau Offert 🎁
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-zinc-200/70 flex items-baseline justify-between gap-1">
                        <div>
                          <span className="font-black text-sm sm:text-base text-zinc-950">
                            {formatMAD(tier.totalPrice)}
                          </span>
                          {tier.quantity > 1 && (
                            <span className="text-[10px] text-zinc-500 font-medium ml-1">
                              ({formatMAD(tier.unitPrice)}/u)
                            </span>
                          )}
                        </div>
                        {tier.savingsBadge && (
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                              isPopular
                                ? 'text-emerald-800 bg-emerald-100'
                                : isTrio
                                ? 'text-purple-800 bg-purple-100'
                                : 'text-amber-800 bg-amber-100'
                            }`}
                          >
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

          {/* Moroccan COD Trust Signals: Parcel Inspection Guarantee & Fast Delivery Promise */}
          <div className="p-3.5 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border border-emerald-200/90 rounded-2xl shadow-xs space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <PackageCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-black text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5 flex-wrap">
                  <span>Garantie Sérénité : "Vérifiez votre colis avant de payer"</span>
                  <span className="text-[11px] font-bold text-emerald-700">(عاين سلعتك قبل ما تخلص)</span>
                </div>
                <p className="text-[11px] text-emerald-900/90 mt-0.5 leading-relaxed">
                  Ouvrez le carton et vérifiez vos articles <strong>devant le livreur</strong> avant de régler en espèces. Zéro avance demandée, 100% sans risque.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 text-[11px]">
              <div className="flex items-center gap-1.5 bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-zinc-900">Casablanca :</span>{' '}
                  <span className="text-emerald-700 font-semibold">24h Express</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-xs">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-zinc-900">Hors Casa :</span>{' '}
                  <span className="text-emerald-700 font-semibold">48h Partout au Maroc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Moroccan Delivery Estimate Banner */}
          {deliveryEstimate && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="text-xs min-w-0 flex-1">
                <div className="font-bold text-zinc-900 flex items-center justify-between">
                  <span>Livraison estimée : {deliveryEstimate.formattedEstimate}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {activeTier.freeDelivery || activeTier.quantity >= 2 ? 'GRATUITE' : 'Standard'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Délai {deliveryEstimate.sla} • Paiement 100% Cash à la Livraison (COD)
                </p>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              disabled={!activeVariantInfo.inStock}
              onClick={() => setShowCheckoutModal(true)}
              className={`w-full py-4 px-6 text-white font-black text-base shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 ${theme.styleTokens.buttonRadius}`}
              style={{ backgroundColor: activeVariantInfo.inStock ? theme.colors.primary : '#6b7280' }}
            >
              {activeVariantInfo.inStock ? (
                <>
                  <span>Acheter Maintenant — Paiement à la Livraison</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Variante Épuisée — Choisissez une autre option</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/${product.whatsAppDirectNumber}?text=${encodeURIComponent(
                `Salam, je souhaite commander : ${product?.title ?? 'ce produit'}\n🏷️ Réf/SKU : ${activeVariantInfo.sku}\n${selectedColor ? `🎨 Couleur : ${selectedColor}\n` : ''}${selectedSize ? `📏 Pointure : ${selectedSize}\n` : ''}${selectedVariant && !selectedColor && !selectedSize ? `📦 Option : ${selectedVariant}\n` : ''}💰 Total : ${formatMAD(activeTier?.totalPrice ?? product?.price ?? 0)} (${activeTier?.label ?? 'Standard'})\nPaiement Cash à la Livraison au Maroc. Merci !`
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
              <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Inspection autorisée</strong> avant paiement</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Casa 24h</strong>, Hors Casa 48h</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Paiement Cash à l'arrivée (COD)</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-700">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Échange garanti sous 7 jours</span>
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

      {/* Sticky Mobile Buy Bar (< 768px) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          {/* Left: Dynamic Price & Delivery Badge */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 truncate">
              <span className="text-lg font-black text-zinc-950 tracking-tight">
                {formatMAD(activeTier?.totalPrice ?? product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs line-through text-zinc-400 font-semibold truncate">
                  {formatMAD(Math.round((product.originalPrice / product.price) * (activeTier?.totalPrice ?? product.price)))}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTier?.freeDelivery || (activeTier?.quantity ?? 1) >= 2
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-zinc-100 text-zinc-700'
                }`}
              >
                <Truck className="w-3 h-3 stroke-[2.5]" />
                {activeTier?.freeDelivery || (activeTier?.quantity ?? 1) >= 2
                  ? 'Livraison Gratuite 24h'
                  : 'Livraison 24h/48h COD'}
              </span>
              {activeTier?.freeGift && (
                <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-[9px] font-black">
                  + Cadeau 🎁
                </span>
              )}
            </div>
          </div>

          {/* Right: High-Converting CTA Button */}
          <button
            type="button"
            disabled={!activeVariantInfo.inStock}
            onClick={() => setShowCheckoutModal(true)}
            className="py-3 px-4 sm:px-5 text-white font-black text-xs sm:text-sm tracking-tight shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-h-[48px] rounded-xl"
            style={{ backgroundColor: activeVariantInfo.inStock ? theme.colors.primary : '#6b7280' }}
            aria-label="Acheter maintenant - Paiement à la livraison"
          >
            <span>{activeVariantInfo.inStock ? 'Acheter Maintenant' : 'Épuisé'}</span>
            {activeVariantInfo.inStock && <ArrowRight className="w-4 h-4 stroke-[3]" />}
          </button>
        </div>
      </div>

      <CodCheckoutModal
        product={product}
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        initialQuantity={selectedQuantity}
        initialVariant={activeVariantInfo.label}
        initialSku={activeVariantInfo.sku}
        initialColor={selectedColor}
        initialSize={selectedSize}
      />
    </div>
  );
}
