'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
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
import { getCountryConfig, validateCountryPhone } from '@/lib/geo';

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
  const { theme, formatPrice, countryCode } = useTheme();

  const [mode, setMode] = useState<'cart' | 'checkout'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState(POPULAR_CITIES[0]);
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'stopdesk'>('home');
  const [agencyName, setAgencyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const countryConfig = useMemo(() => getCountryConfig(countryCode || 'MA'), [countryCode]);

  // Reset to cart view when drawer closes
  useEffect(() => {
    if (!isDrawerOpen) {
      setMode('cart');
      setFormError(null);
    }
  }, [isDrawerOpen]);

  // Close on Escape key + handle body scroll lock
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
  const freeThreshold = countryConfig.freeShippingThreshold || FREE_SHIPPING_THRESHOLD;
  const isFreeShipping =
    deliveryType === 'stopdesk' ||
    totalCount >= 2 ||
    subtotal >= freeThreshold;

  const shippingFee = useMemo(() => {
    if (isFreeShipping) return 0;
    if (countryCode && countryCode !== 'MA') return countryConfig.defaultShippingFee;
    return getCityShipping(customerCity, subtotal).fee;
  }, [isFreeShipping, countryCode, countryConfig, customerCity, subtotal]);

  const grandTotal = subtotal + shippingFee;
  const progressToFree = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validation
    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError('Veuillez entrer votre nom complet.');
      return;
    }

    const phoneCheck =
      countryCode === 'MA'
        ? validateMoroccanPhone(customerPhone)
        : validateCountryPhone(customerPhone, countryCode);

    if (!phoneCheck.isValid) {
      setFormError(
        (phoneCheck as any).error ||
          `Numéro de téléphone invalide (${countryCode}). Ex: 0612345678`
      );
      return;
    }

    if (deliveryType === 'home' && (!customerAddress.trim() || customerAddress.trim().length < 5)) {
      setFormError('Veuillez préciser votre adresse de livraison.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: (phoneCheck as any).cleanPhone || customerPhone.trim(),
          customerCity,
          customerAddress: deliveryType === 'stopdesk' ? `Point Relais / Agence: ${agencyName || customerCity}` : customerAddress.trim(),
          deliveryType,
          agencyName: deliveryType === 'stopdesk' ? agencyName || customerCity : undefined,
          countryCode: countryCode || 'MA',
          items: items.map((it) => ({
            id: it.productId,
            productId: it.productId,
            slug: it.slug,
            title: it.title,
            quantity: it.quantity,
            price: it.price,
            variant: it.variant,
            color: it.color,
            size: it.size,
            sku: it.sku,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Échec de validation de la commande.');
      }

      const orderRef = data.order?.orderNumber || data.orderId || `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

      // Clear cart on successful order
      clearCart();
      closeCart();

      // Navigate to order confirmation
      router.push(`/order-success/${orderRef}?total=${grandTotal}&city=${encodeURIComponent(customerCity)}`);
    } catch (err: any) {
      setFormError(err.message || 'Une erreur est survenue lors de la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {mode === 'checkout' && (
              <button
                type="button"
                onClick={() => setMode('cart')}
                className="p-1.5 rounded-lg hover:bg-zinc-100 transition mr-1"
                aria-label="Retour au panier"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: theme.colors.primary }}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight">
                {mode === 'cart' ? 'Mon Panier' : 'Paiement à la Livraison'}
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
          ) : mode === 'cart' ? (
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
          ) : (
            /* Mode 2: In-Drawer Multi-Item COD Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-zinc-800">Nom & Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Yasmine Berrada"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white text-zinc-900"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-zinc-800">
                  Numéro de Téléphone (WhatsApp / Appel) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder={countryCode === 'MA' ? '06 12 34 56 78' : countryConfig.phone.placeholder}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white text-zinc-900"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-zinc-400">
                    {countryConfig.phone.flag}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Notre livreur vous appellera pour confirmer l'heure de passage.
                </p>
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-800">Ville de Réception *</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(countryCode === 'MA' ? POPULAR_CITIES : countryConfig.popularCities.slice(0, 6)).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCustomerCity(c)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition ${
                        customerCity.toLowerCase() === c.toLowerCase()
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <select
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white text-zinc-900"
                >
                  {countryCode === 'MA'
                    ? MOROCCAN_CITIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.nameAr}) • {c.deliverySla}
                        </option>
                      ))
                    : countryConfig.popularCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                </select>
              </div>

              {/* Delivery Type: Home vs Stopdesk */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-800">Mode de Livraison</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('home')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      deliveryType === 'home'
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>À Domicile</span>
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5 block">
                      {isFreeShipping ? 'Gratuit' : `${shippingFee} DH`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('stopdesk')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      deliveryType === 'stopdesk'
                        ? 'border-emerald-700 bg-emerald-700 text-white shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Point Relais</span>
                      <span className="text-[10px] bg-emerald-500/30 px-1 rounded">0 DH</span>
                    </div>
                    <span className="text-[10px] opacity-80 mt-0.5 block">Agence de votre ville</span>
                  </button>
                </div>
              </div>

              {/* Address */}
              {deliveryType === 'home' ? (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-800">Adresse de Livraison *</label>
                  <input
                    type="text"
                    required
                    placeholder="Quartier, Rue, N° d'immeuble ou maison"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white text-zinc-900"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-zinc-800">Agence Point Relais Souhaitée</label>
                  <input
                    type="text"
                    placeholder={`Ex: Agence Ozon / Cathedis ${customerCity}`}
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-zinc-300 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white text-zinc-900"
                  />
                </div>
              )}

              {/* Hidden anti-bot honeypot */}
              <input type="text" name="_hp" className="hidden" tabIndex={-1} autoComplete="off" />

              {/* Confirmation CTA button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-black text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validation en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer la Commande ({formatPrice(grandTotal)})</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Drawer Footer: Subtotal & Action Bar */}
        {items.length > 0 && mode === 'cart' && (
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
              onClick={() => setMode('checkout')}
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
    </div>
  );
}
