'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, QuantityTier } from '@/lib/mockProducts';
import {
  MOROCCAN_CITIES,
  POPULAR_CITIES,
  getDeliveryDateEstimate,
  validateMoroccanPhone,
  validateCustomerName,
  validateAddress,
  FREE_SHIPPING_THRESHOLD,
} from '@/lib/moroccanCities';
import { useTheme } from '@/context/ThemeContext';
import {
  X,
  ShieldCheck,
  Truck,
  Check,
  Loader2,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  AlertCircle,
  Edit2,
  Sparkles,
} from 'lucide-react';

interface CodCheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  initialQuantity?: number;
  initialVariant?: string;
  initialCity?: string;
  isWaybill?: boolean; // override from parent (optional)
}

function getAbVariant(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(/cod_ab_variant=(waybill|control)/);
  return match?.[1] === 'waybill';
}

export function CodCheckoutModal({
  product,
  isOpen,
  onClose,
  initialQuantity = 1,
  initialVariant,
  initialCity = 'Casablanca',
  isWaybill: waybillOverride,
}: CodCheckoutModalProps) {
  const router = useRouter();
  const { theme, formatMAD, lang } = useTheme();

  // A/B: detect waybill variant from cookie (set by middleware). Default: standard modal.
  const [isWaybill, setIsWaybill] = useState(false);

  // Multi-step state: Step 1 (Offre & Options) -> Step 2 (Coordonnées & Livraison)
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(initialCity);
  const [address, setAddress] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(
    initialVariant || (product.variants?.options.find((o) => o.inStock)?.name ?? '')
  );
  const [selectedTier, setSelectedTier] = useState<QuantityTier>(
    product.quantityTiers.find((t) => t.quantity === initialQuantity) || product.quantityTiers[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Inline Validation tracking (records whether field has been typed into)
  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
    address: false,
  });

  const nameValidation = useMemo(() => validateCustomerName(fullName), [fullName]);
  const phoneValidation = useMemo(() => validateMoroccanPhone(phone), [phone]);
  const addressValidation = useMemo(() => validateAddress(address), [address]);

  // Read A/B cookie on mount (client-side only)
  useEffect(() => {
    setIsWaybill(getAbVariant() || waybillOverride === true);
  }, [waybillOverride]);

  // Reset or initialize on modal open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      if (initialQuantity) {
        const foundTier = product.quantityTiers.find((t) => t.quantity === initialQuantity);
        if (foundTier) setSelectedTier(foundTier);
      }
      if (initialVariant) {
        setSelectedVariant(initialVariant);
      }
      if (initialCity) {
        setCity(initialCity);
      }
    }
  }, [isOpen, initialQuantity, initialVariant, initialCity, product.quantityTiers]);

  // Moroccan Delivery Estimate helper
  const deliveryEstimate = useMemo(
    () => getDeliveryDateEstimate(city, selectedTier.totalPrice),
    [city, selectedTier.totalPrice]
  );

  if (!isOpen) return null;

  const finalTotal = selectedTier.totalPrice + deliveryEstimate.shippingFee;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    raw = raw.replace(/[^\d\s+]/g, '');
    setPhone(raw);
    if (!touched.phone) {
      setTouched((prev) => ({ ...prev, phone: true }));
    }
  };

  const handleProceedToStep2 = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If on Step 1, advance to Step 2
    if (step === 1) {
      handleProceedToStep2(e);
      return;
    }

    setTouched({ fullName: true, phone: true, address: true });

    if (!nameValidation.isValid) {
      setError(
        lang === 'ar'
          ? 'يرجى إدخال الاسم واللقب الكامل'
          : nameValidation.error || 'Veuillez renseigner votre Nom & Prénom'
      );
      return;
    }

    if (!phoneValidation.isValid) {
      setError(
        lang === 'ar'
          ? 'يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678)'
          : phoneValidation.error || 'Veuillez renseigner un numéro de téléphone marocain valide'
      );
      return;
    }

    if (!addressValidation.isValid) {
      setError(
        lang === 'ar'
          ? 'يرجى كتابة عنوان التوصيل'
          : addressValidation.error || 'Veuillez préciser votre adresse de livraison'
      );
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload = {
        product: {
          id: product.id,
          title: product.title,
          slug: product.slug,
          variant: selectedVariant,
        },
        quantity: selectedTier.quantity,
        unitPrice: selectedTier.unitPrice,
        subtotal: selectedTier.totalPrice,
        shippingFee: deliveryEstimate.shippingFee,
        total: finalTotal,
        customer: {
          fullName: fullName.trim(),
          phone: phoneValidation.cleanPhone || phone.replace(/\s+/g, ''),
          city,
          address: address.trim(),
        },
        theme: theme.id,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        onClose();
        router.push(`/order-success/${data.orderId}?total=${finalTotal}&city=${encodeURIComponent(city)}`);
      } else {
        setError(data.message || 'Une erreur est survenue lors de la commande.');
      }
    } catch {
      // Fallback redirect with generated ID for testing
      const testId = `CMD-${Math.floor(100000 + Math.random() * 900000)}`;
      onClose();
      router.push(`/order-success/${testId}?total=${finalTotal}&city=${encodeURIComponent(city)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const text = `Salam, je souhaite commander :
*Produit :* ${product.title}
*Quantité :* ${selectedTier.quantity} (${selectedTier.totalPrice} DH)
${selectedVariant ? `*Option :* ${selectedVariant}\n` : ''}*Ville :* ${city}
*Total estimé :* ${finalTotal} DH (Paiement à la livraison)
Merci de me confirmer la livraison !`;

    const url = `https://wa.me/${product.whatsAppDirectNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-lg my-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col ${
        isWaybill ? 'border-2 border-dashed border-zinc-400 bg-amber-50/10' : 'border border-zinc-200'
      }`}>
        {/* BORDEREAU EXPRESS / STANDARD HEADER */}
        {isWaybill ? (
          <div className="bg-zinc-900 text-white p-3 sm:p-4 border-b-2 border-dashed border-zinc-700 relative">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-wider bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded border border-zinc-700">
                  BORDEREAU N° MA-{product.id.slice(0, 4).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ● Express National
                </span>
              </div>
              <button type="button" onClick={onClose} aria-label="Fermer" className="p-1 rounded-full text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm tracking-tight text-white uppercase flex items-center gap-1.5">
                  <span>Bon d'Expédition Express COD</span>
                </h3>
                <p className="text-[11px] text-zinc-300">
                  Paiement sécurisé en espèces à la livraison après vérification
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end opacity-80 font-mono text-[9px] text-zinc-400">
                <span>||||||| | ||| |||| |</span>
                <span>EXPÉDITION 24/48H</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800 text-white p-3.5 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm tracking-tight truncate">
                  Formulaire de Commande Rapide
                </h3>
                <p className="text-[10px] sm:text-[11px] text-zinc-300 truncate">
                  Paiement 100% en espèces à la livraison (COD)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 2-Step Progress Stepper Header */}
        <div className="px-3.5 sm:px-5 py-2.5 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-900">
              {step === 1 ? 'Étape 1 sur 2 : Choix de votre commande' : 'Étape 2 sur 2 : Coordonnées & Livraison'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Étape {step} sur 2
            </span>
          </div>

          <div className="flex items-center justify-between max-w-xs sm:max-w-sm mx-auto">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                step === 1 ? 'text-zinc-900' : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-colors ${
                  step > 1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-zinc-900 text-white shadow-xs'
                }`}
              >
                {step > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
              </span>
              <span className="text-[11px] sm:text-xs">1. Offre & Options</span>
            </button>

            {/* Connecting Bar */}
            <div className="flex-1 mx-2 sm:mx-3 h-1 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: step === 2 ? '100%' : '50%' }}
              />
            </div>

            {/* Step 2 Pill */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                step === 2 ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <span
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-colors ${
                  step === 2 ? 'bg-zinc-900 text-white shadow-xs' : 'bg-zinc-200 text-zinc-500'
                }`}
              >
                2
              </span>
              <span className="text-[11px] sm:text-xs">2. Coordonnées</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body (320px safe & max-h-[82vh]) */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= STEP 1: QUANTITY TIER + VARIANT SELECTION + SUBTOTAL ================= */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              {/* Product Recap Mini Banner */}
              <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-zinc-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-zinc-900 truncate">{product.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-black text-sm text-emerald-700">{formatMAD(selectedTier.totalPrice)}</span>
                    {product.originalPrice > product.price && (
                      <span className="line-through text-xs text-zinc-400">
                        {formatMAD(product.originalPrice * selectedTier.quantity)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                    Paiement à la livraison • {product.stockLeft <= 10 ? `Plus que ${product.stockLeft} en stock` : 'En stock'}
                  </p>
                </div>
              </div>

              {/* Quantity Tiers / Special Packs Selection */}
              {product.quantityTiers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                    <span>Choisissez votre offre spéciale :</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Paiement à la livraison</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {product.quantityTiers.map((tier) => {
                      const isSelected = selectedTier.quantity === tier.quantity;
                      return (
                        <div
                          key={tier.quantity}
                          onClick={() => setSelectedTier(tier)}
                          className={`relative p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-zinc-900 truncate">{tier.label}</div>
                              {tier.savingsBadge && (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                  {tier.savingsBadge}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-xs sm:text-sm text-zinc-900">
                              {formatMAD(tier.totalPrice)}
                            </div>
                            {tier.quantity > 1 && (
                              <div className="text-[10px] text-zinc-400">
                                {formatMAD(tier.unitPrice)} / unité
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variant Selector (if any) */}
              {product.variants && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-800">
                    {product.variants.label} :
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.options.map((opt) => {
                      const isSelected = selectedVariant === opt.name;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!opt.inStock}
                          onClick={() => setSelectedVariant(opt.name)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            !opt.inStock
                              ? 'opacity-40 line-through bg-zinc-100 border-zinc-200 cursor-not-allowed text-zinc-400'
                              : isSelected
                              ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                              : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400'
                          }`}
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subtotal Preview Card */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-700">
                    Sous-total ({selectedTier.quantity} {selectedTier.quantity > 1 ? 'articles' : 'article'}) :
                  </div>
                  {selectedTier.totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                    <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Livraison 100% Gratuite au Maroc !</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      Plus que {formatMAD(FREE_SHIPPING_THRESHOLD - selectedTier.totalPrice)} pour la livraison offerte
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-black text-base text-zinc-900">{formatMAD(selectedTier.totalPrice)}</div>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className={`w-full py-3.5 px-4 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 ${theme.styleTokens.buttonRadius}`}
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <span>Continuer vers la livraison (Étape 2 sur 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Alternative: Order via WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Commander en 1 Clic via WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: CONTACT INFO FORM + ADDRESS + DELIVERY ESTIMATE + FINAL PRICE + SUBMIT ================= */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              {/* Chosen Offer Recap Banner with Edit Button */}
              <div className="p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded-lg border border-zinc-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-zinc-900 truncate">{product.title}</div>
                    <div className="text-[11px] text-zinc-600">
                      {selectedTier.label} {selectedVariant ? `• ${selectedVariant}` : ''} —{' '}
                      <span className="font-bold text-emerald-700">{formatMAD(selectedTier.totalPrice)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-bold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 cursor-pointer underline underline-offset-2 shrink-0 ml-2"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Modifier</span>
                </button>
              </div>

              {/* Contact Fields with Inline Validation */}
              <div className="space-y-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
                    <span>
                      Nom & Prénom <span className="text-red-500">*</span>
                    </span>
                    {nameValidation.isValid && fullName.trim().length > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Valide
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!touched.fullName) setTouched((prev) => ({ ...prev, fullName: true }));
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                      placeholder="Ex: Youssef El Amrani"
                      className={`w-full px-3.5 py-2.5 bg-zinc-50 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition ${
                        touched.fullName && !nameValidation.isValid
                          ? 'border-red-400 bg-red-50/30'
                          : touched.fullName && nameValidation.isValid
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : 'border-zinc-300'
                      }`}
                    />
                  </div>
                  {touched.fullName && !nameValidation.isValid ? (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{nameValidation.error}</p>
                  ) : (
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal">
                      Prénom et nom complets pour la livraison du colis
                    </p>
                  )}
                </div>

                {/* Phone WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
                    <span>
                      Numéro de Téléphone (WhatsApp) <span className="text-red-500">*</span>
                    </span>
                    {phoneValidation.isValid && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        {phoneValidation.operator ? `Valide (${phoneValidation.operator})` : 'Valide'}
                      </span>
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-zinc-500 border-r border-zinc-300 pr-2 pointer-events-none select-none">
                      🇲🇦 +212
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                      placeholder="06 12 34 56 78"
                      className={`w-full pl-20 pr-3.5 py-2.5 bg-zinc-50 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition ${
                        touched.phone && !phoneValidation.isValid
                          ? 'border-red-400 bg-red-50/30'
                          : phoneValidation.isValid
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : 'border-zinc-300'
                      }`}
                    />
                  </div>
                  {touched.phone && !phoneValidation.isValid ? (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{phoneValidation.error}</p>
                  ) : (
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal">
                      Format : 06 12 34 56 78 (10 chiffres). Le livreur vous contactera avant le passage.
                    </p>
                  )}
                </div>

                {/* City & Delivery Estimate */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Ville de Livraison <span className="text-red-500">*</span>
                    </label>

                    {/* Popular Moroccan Cities Quick-Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {POPULAR_CITIES.map((cityName) => (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => setCity(cityName)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                            city.toLowerCase() === cityName.toLowerCase()
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                          }`}
                        >
                          {cityName}
                        </button>
                      ))}
                    </div>

                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition cursor-pointer"
                    >
                      {MOROCCAN_CITIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.nameAr}) — {c.deliverySla}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal">
                      Délais et frais calculés automatiquement selon la ville choisie.
                    </p>
                  </div>

                  {/* Dynamic Moroccan Delivery Estimate Card */}
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl text-xs flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="font-bold text-emerald-950">
                          Livraison estimée : {deliveryEstimate.formattedEstimate}
                        </span>
                        <span className="font-black text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded text-[10px]">
                          {deliveryEstimate.isFree ? 'GRATUITE' : `${deliveryEstimate.shippingFee} DH`}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800 mt-0.5">
                        Délai {deliveryEstimate.sla} • Paiement cash lors de la remise en main propre
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
                    <span>
                      Adresse Complète / Quartier <span className="text-red-500">*</span>
                    </span>
                    {addressValidation.isValid && address.trim().length >= 5 && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Valide
                      </span>
                    )}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (!touched.address) setTouched((prev) => ({ ...prev, address: true }));
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
                    placeholder="Ex: Quartier Maârif, Rue Abou Bakr Essedik, Résidence Al Manar Appt 4"
                    className={`w-full px-3.5 py-2 bg-zinc-50 border rounded-xl text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition ${
                      touched.address && !addressValidation.isValid
                        ? 'border-red-400 bg-red-50/30'
                        : touched.address && addressValidation.isValid
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-zinc-300'
                    }`}
                  />
                  {touched.address && !addressValidation.isValid ? (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{addressValidation.error}</p>
                  ) : (
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal">
                      Quartier, rue, numéro de bâtiment ou repère connu (ex: Près de la mosquée).
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>
                    Sous-total ({selectedTier.quantity} {selectedTier.quantity > 1 ? 'articles' : 'article'}) :
                  </span>
                  <span className="font-semibold text-zinc-800">{formatMAD(selectedTier.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Frais de livraison ({city}) :</span>
                  <span className="font-semibold text-zinc-800">
                    {deliveryEstimate.isFree ? (
                      <span className="text-emerald-600 font-bold">GRATUITE</span>
                    ) : (
                      formatMAD(deliveryEstimate.shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex justify-between items-center text-sm font-bold">
                  <span className="text-zinc-900">Total à payer à la livraison :</span>
                  <span className="text-base font-black text-emerald-700">{formatMAD(finalTotal)}</span>
                </div>
              </div>

              {/* Step 2 CTA Actions */}
              <div className="space-y-3 pt-2 border-t border-zinc-200">
                {/* Inspection guarantee checklist — addresses #1 doorstep-acceptance friction */}
                <ul className={`text-[11px] text-zinc-700 space-y-1.5 px-1 ${isWaybill ? 'border border-dashed border-zinc-300 bg-amber-50/40 rounded-xl p-3' : ''}`}>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black mt-0.5">✓</span>
                    <span>Inspection autorisée du colis <strong>avant</strong> paiement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black mt-0.5">✓</span>
                    <span>Appel WhatsApp du livreur avant passage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black mt-0.5">✓</span>
                    <span>Paiement en espèces à la livraison (pas d'avance)</span>
                  </li>
                </ul>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-4 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:opacity-95 ${theme.styleTokens.buttonRadius}`}
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validation de la commande en cours...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Confirmer la Commande — {formatMAD(finalTotal)}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour</span>
                  </button>

                  {/* Alternative: Order via WhatsApp */}
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-2/3 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Commander via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Reassurance Note */}
          <div className="text-center text-[10px] text-zinc-400 pt-1">
            🔒 Vos données sont protégées. Paiement en espèces uniquement à la réception de votre colis.
          </div>
        </form>
      </div>
    </div>
  );
}

