'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { trackOrderCompleted } from '@/lib/posthog';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  POPULAR_CITIES,
  MOROCCAN_CITIES,
  FREE_SHIPPING_THRESHOLD,
  validateMoroccanPhone,
  getCityShipping,
} from '@/lib/moroccanCities';
import { getCountryConfig, validateCountryPhone, getCountryCityShipping } from '@/lib/geo';
import { CodCheckoutModal } from './CodCheckoutModal';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal,
    isDrawerOpen,
    closeCart,
  } = useCart();
  const { theme, formatPrice, countryCode, shippingSettings } = useTheme();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const countryConfig = useMemo(() => getCountryConfig(countryCode || 'MA'), [countryCode]);

  // Reset modal when drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setIsCheckoutModalOpen(false);
    }
  }, [isDrawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!isDrawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isDrawerOpen, closeCart]);

  // Free shipping threshold calculation
  const freeThreshold =
    countryCode === 'MA' && typeof shippingSettings?.freeShippingThreshold === 'number'
      ? shippingSettings.freeShippingThreshold
      : countryConfig.freeShippingThreshold || FREE_SHIPPING_THRESHOLD;
  const hasItemFreeDelivery = items.some((it) => Boolean(it.freeDelivery));
  const isFreeShipping =
    totalCount >= 2 ||
    hasItemFreeDelivery ||
    (freeThreshold > 0 && subtotal >= freeThreshold);

  const shippingFee = useMemo(() => {
    if (isFreeShipping) return 0;
    if (countryCode && countryCode !== 'MA') {
      return getCountryCityShipping(countryCode, POPULAR_CITIES[0], subtotal).fee;
    }
    return getCityShipping(POPULAR_CITIES[0], subtotal, shippingSettings).fee;
  }, [isFreeShipping, countryCode, subtotal, shippingSettings]);

  const grandTotal = subtotal + shippingFee;
  const progressToFree = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeCart}
      role="dialog"
      aria-modal="true"
      aria-label="Mon Panier"
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--theme-card-bg)',
          color: 'var(--theme-text-primary)',
        }}
      >
        {/* Top Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: theme.colors.primary }}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight">
                Mon Panier
              </h2>
              <p className="text-[11px] text-zinc-500 font-medium">
                {totalCount} {totalCount > 1 ? 'articles' : 'article'} • {countryConfig.inspectionBadge.fr}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {subtotal > 0 && (
          <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-100 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {isFreeShipping ? (
                  <span className="text-emerald-700">🎉 Livraison Gratuite Débloquée !</span>
                ) : (
                  <span>
                    Plus que <strong className="text-emerald-700">{formatPrice(freeThreshold - subtotal)}</strong> pour la livraison offerte
                  </span>
                )}
              </span>
              <span className="text-[11px] text-zinc-400">{progressToFree}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>
        )}

        {/* Middle Body: Cart Items OR Checkout Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-zinc-800">Votre panier est vide</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto mt-1">
                  Découvrez nos collections exclusives et profitez du paiement à la livraison.
                </p>
              </div>
              <a
                href="/catalog"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <span>Explorer le Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            /* Mode 1: Cart Items List */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover bg-zinc-100 shrink-0 border border-zinc-100"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-zinc-500">
                        {item.color && (
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            Taille: {item.size}
                          </span>
                        )}
                        {item.variant && !item.color && !item.size && (
                          <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {item.variant}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-black text-xs text-zinc-950">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-zinc-200 text-zinc-600 rounded-l-lg transition"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-zinc-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-zinc-200 text-zinc-600 rounded-r-lg transition"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-zinc-400 hover:text-red-600 transition"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Moroccan COD Inspection Guarantee Pill */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px]">
                  <strong>Garantie Sérénité :</strong> Ouvrez et inspectez vos colis devant le livreur avant tout règlement en espèces. Zéro avance demandée.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Drawer Footer: Subtotal & Action Bar */}
        {items.length > 0 && (
          <div
            className="p-5 border-t bg-zinc-50/90 shrink-0 space-y-3"
            style={{ borderColor: 'var(--theme-border)' }}
          >
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Sous-total ({totalCount} articles)</span>
                <span className="font-bold text-zinc-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span className="flex items-center gap-1">
                  <span>Livraison COD</span>
                  {isFreeShipping && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                      GRATUITE
                    </span>
                  )}
                </span>
                <span className="font-bold text-zinc-900">
                  {isFreeShipping ? '0 DH' : `${shippingFee} DH`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Total à Payer (Espèces)</span>
                <span className="text-base" style={{ color: theme.colors.primary }}>
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl text-white font-black text-sm shadow-lg hover:shadow-xl active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <span>Passer la Commande (COD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zéro avance
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                Livraison {countryConfig.defaultSla}
              </span>
            </div>
          </div>
        )}
      </div>

      {isCheckoutModalOpen && (
        <CodCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          product={{ 
            id: 'cart', 
            title: 'Panier', 
            price: subtotal,
            originalPrice: subtotal,
            images: [items[0]?.image || ''],
            stockLeft: 99,
            slug: 'cart',
            whatsAppDirectNumber: '212600000000'
          } as any}
          cartItems={items}
          cartSubtotal={subtotal}
        />
      )}
    </div>
  );
}
