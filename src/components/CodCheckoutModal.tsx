'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, QuantityTier, getProductQuantityTiers } from '@/lib/mockProducts';
import {
  MOROCCAN_CITIES,
  POPULAR_CITIES,
  getDeliveryDateEstimate,
  validateMoroccanPhone,
  validateCustomerName,
  validateAddress,
  FREE_SHIPPING_THRESHOLD,
} from '@/lib/moroccanCities';
import {
  getCountryConfig,
  getCountryDeliveryEstimate,
  validateCountryPhone,
  detectClientVisitorCountry,
} from '@/lib/geo';
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
  Gift,
  PackageCheck,
  Zap,
} from 'lucide-react';
import { trackInitiateCheckout } from '@/lib/pixel-tracker';

interface CodCheckoutModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  storeSlug?: string;
  countryCode?: string; // e.g. 'MA' | 'SA' | 'AE' | 'EG' | 'DZ' | 'SN' | 'CI'
  initialQuantity?: number;
  initialVariant?: string;
  initialSku?: string;
  initialColor?: string;
  initialSize?: string;
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
  storeSlug,
  countryCode,
  initialQuantity = 1,
  initialVariant,
  initialSku,
  initialColor,
  initialSize,
  initialCity,
  isWaybill: waybillOverride,
}: CodCheckoutModalProps) {
  const router = useRouter();
  const { theme, formatMAD, lang } = useTheme();
  const formRef = React.useRef<HTMLFormElement>(null);

  // Multi-country configuration & dynamic visitor detection
  const [activeCountry, setActiveCountry] = useState<string>(countryCode || 'MA');

  // Auto-detect visitor country on client mount (respecting cookies, URL params, or browser timezone)
  useEffect(() => {
    const detected = detectClientVisitorCountry(countryCode || (product as any)?.country || 'MA');
    if (detected && detected !== activeCountry) {
      setActiveCountry(detected);
    }
  }, [countryCode, product]);

  const effectiveCountryCode = useMemo(() => {
    return activeCountry || countryCode || (product as any)?.country || 'MA';
  }, [activeCountry, countryCode, product]);

  const countryConfig = useMemo(() => getCountryConfig(effectiveCountryCode), [effectiveCountryCode]);

  const handleCountrySwitch = (newCountry: string) => {
    setActiveCountry(newCountry);
    const newCfg = getCountryConfig(newCountry);
    setCity(newCfg.popularCities[0] || '');
    if (typeof document !== 'undefined') {
      document.cookie = `cod_visitor_country=${newCountry}; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  // Detect active store slug from prop, search param, or subdomain
  const effectiveStoreSlug = React.useMemo(() => {
    if (storeSlug) return storeSlug;
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search).get('store');
      if (sp) return sp;
      const host = window.location.hostname.toLowerCase();
      const rootDomain = 'codshop.vipone.site';
      if (host.endsWith(rootDomain) && host !== rootDomain && host !== `www.${rootDomain}`) {
        return host.replace(`.${rootDomain}`, '');
      }
      if (host.endsWith('.localhost')) {
        return host.replace('.localhost', '');
      }
    }
    return (product as any)?.storeSlug || 'ottavio';
  }, [storeSlug, product]);

  // Stable waybill serial number (initialized deterministically to prevent hydration mismatch)
  const [waybillNumber, setWaybillNumber] = useState(
    `${effectiveCountryCode}-${product.id.slice(0, 4).toUpperCase()}-1088`
  );
  useEffect(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setWaybillNumber(`${effectiveCountryCode}-${product.id.slice(0, 4).toUpperCase()}-${rand}`);
  }, [product.id, effectiveCountryCode]);

  // A/B: detect waybill variant from cookie (set by middleware). Default: standard modal.
  const [isWaybill, setIsWaybill] = useState(false);

  // Multi-step state: Step 1 (Offre & Options) -> Step 2 (Coordonnées & Livraison)
  const [step, setStep] = useState<1 | 2>(1);

  // Reset scroll to top of form when step changes
  useEffect(() => {
    formRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(initialCity || countryConfig.popularCities[0] || 'Casablanca');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'stopdesk'>('home');
  const [agencyName, setAgencyName] = useState('');
  const tiers = useMemo(() => getProductQuantityTiers(product, effectiveCountryCode), [product, effectiveCountryCode]);
  const [selectedVariant, setSelectedVariant] = useState(
    initialVariant || (product.variants?.options.find((o) => o.inStock)?.name ?? '')
  );
  const [selectedSku, setSelectedSku] = useState(initialSku || product.sku || '');
  const [selectedColor, setSelectedColor] = useState(initialColor || '');
  const [selectedSize, setSelectedSize] = useState(initialSize || '');

  const [selectedTier, setSelectedTier] = useState<QuantityTier>(
    tiers.find((t) => t.quantity === initialQuantity) || tiers[0]
  );

  // Country-aware price formatter
  const formatPrice = (amount: number) => {
    if (effectiveCountryCode === 'MA') return formatMAD(amount);
    return `${amount} ${countryConfig.currency.symbol}`;
  };

  // Track InitiateCheckout on pixel channels when modal is opened
  useEffect(() => {
    if (isOpen) {
      trackInitiateCheckout({
        id: product.id,
        title: product.title,
        price: selectedTier?.unitPrice || product.price,
        quantity: selectedTier?.quantity || 1,
      });
    }
  }, [isOpen, product.id, product.title, selectedTier]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Inline Validation tracking (records whether field has been typed into)
  const [touched, setTouched] = useState({
    fullName: false,
    phone: false,
    address: false,
  });

  const nameValidation = useMemo(() => validateCustomerName(fullName), [fullName]);
  const phoneValidation = useMemo(
    () => validateCountryPhone(phone, effectiveCountryCode),
    [phone, effectiveCountryCode]
  );
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
        const foundTier = tiers.find((t) => t.quantity === initialQuantity);
        if (foundTier) setSelectedTier(foundTier);
      }
      if (initialVariant) {
        setSelectedVariant(initialVariant);
      }
      if (initialSku) {
        setSelectedSku(initialSku);
      }
      if (initialColor) {
        setSelectedColor(initialColor);
      }
      if (initialSize) {
        setSelectedSize(initialSize);
      }
      if (initialCity) {
        setCity(initialCity);
      } else if (!city) {
        setCity(countryConfig.popularCities[0] || 'Casablanca');
      }
    }
  }, [isOpen, initialQuantity, initialVariant, initialSku, initialColor, initialSize, initialCity, tiers, countryConfig]);

  // Universal Delivery Estimate helper (country-aware with dynamic SLA & guaranteed flat fee fallback)
  const deliveryEstimate = useMemo(
    () => getCountryDeliveryEstimate(effectiveCountryCode, city, selectedTier.totalPrice),
    [effectiveCountryCode, city, selectedTier.totalPrice]
  );

  // COD Upsell Economics: Pack Duo (2+ units) OR Stopdesk/Agence pickup gets Free Shipping!
  const isFreeShipping = selectedTier.quantity >= 2 || selectedTier.freeDelivery || deliveryType === 'stopdesk' || deliveryEstimate.isFree;
  const effectiveShippingFee = isFreeShipping ? 0 : deliveryEstimate.shippingFee;
  const finalTotal = selectedTier.totalPrice + effectiveShippingFee;

  if (!isOpen) return null;

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
          ? (effectiveCountryCode === 'MA' ? 'يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678)' : `يرجى إدخال رقم هاتف صحيح (${countryConfig.phone.example})`)
          : phoneValidation.error || `Veuillez renseigner un numéro de téléphone valide (${countryConfig.phone.example})`
      );
      return;
    }

    if (deliveryType === 'home' && !addressValidation.isValid) {
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
          sku: selectedSku,
          color: selectedColor,
          size: selectedSize,
        },
        items: [
          {
            id: product.id,
            title: product.title,
            quantity: selectedTier.quantity,
            price: selectedTier.unitPrice,
            variant: selectedVariant,
            sku: selectedSku,
            color: selectedColor,
            size: selectedSize,
          },
        ],
        storeSlug: effectiveStoreSlug,
        store: effectiveStoreSlug,
        quantity: selectedTier.quantity,
        unitPrice: selectedTier.unitPrice,
        subtotal: selectedTier.totalPrice,
        shippingFee: effectiveShippingFee,
        total: finalTotal,
        abVariant: isWaybill ? 'waybill' : 'control',
        countryCode: effectiveCountryCode,
        country: effectiveCountryCode,
        deliveryType,
        agencyName: deliveryType === 'stopdesk' ? (agencyName.trim() || `Agence principale ${city}`) : undefined,
        source: 'web',
        customer: {
          fullName: fullName.trim(),
          phone: phoneValidation.cleanPhone || phone.replace(/\s+/g, ''),
          city,
          address: deliveryType === 'stopdesk'
            ? `[STOPDESK / POINT RELAIS ${city}] ${agencyName.trim() || 'Agence la plus proche'}`
            : address.trim(),
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
        router.push(`/order-success/${data.orderId}?total=${finalTotal}&city=${encodeURIComponent(city)}&store=${encodeURIComponent(effectiveStoreSlug)}`);
      } else {
        if (data.code === 'OUT_OF_STOCK') {
          setError(`⚠️ RUPTURE DE STOCK : ${data.message || 'Cette variante est en rupture de stock.'}`);
        } else {
          setError(data.message || 'Une erreur est survenue lors de la commande.');
        }
      }
    } catch (err) {
      console.error('[COD Checkout] Order submission error:', err);
      setError('Impossible de finaliser la commande. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    // 1. Asynchronous non-blocking lead capture so merchant never loses the client even if they abandon WhatsApp
    try {
      fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeSlug: effectiveStoreSlug,
          store: effectiveStoreSlug,
          product: {
            id: product.id,
            title: product.title,
            slug: product.slug,
            variant: selectedVariant,
            sku: selectedSku,
            color: selectedColor,
            size: selectedSize,
          },
          items: [
            {
              id: product.id,
              title: product.title,
              quantity: selectedTier.quantity,
              price: selectedTier.unitPrice,
              variant: selectedVariant,
              sku: selectedSku,
              color: selectedColor,
              size: selectedSize,
            },
          ],
          quantity: selectedTier.quantity,
          unitPrice: selectedTier.unitPrice,
          subtotal: selectedTier.totalPrice,
          shippingFee: effectiveShippingFee,
          total: finalTotal,
          abVariant: isWaybill ? 'waybill' : 'control',
          countryCode: effectiveCountryCode,
          country: effectiveCountryCode,
          deliveryType,
          agencyName: deliveryType === 'stopdesk' ? (agencyName.trim() || `Agence principale ${city}`) : undefined,
          source: 'whatsapp',
          customerName: fullName.trim() || 'Client WhatsApp 1-Clic',
          customerPhone: phoneValidation.cleanPhone || phone.replace(/\s+/g, '') || 'À confirmer via WhatsApp',
          customerCity: city,
          customerAddress: deliveryType === 'stopdesk'
            ? `[STOPDESK WHATSAPP] ${agencyName.trim() || 'Agence principale'}`
            : (address.trim() || 'Adresse à confirmer par WhatsApp'),
        }),
      }).catch(() => {});
    } catch {}

    // 2. High-converting Moroccan Darija + French hybrid message
    const packText = selectedTier.quantity > 1
      ? `${selectedTier.quantity} Pièces (${selectedTier.label}) — 🚚 Livraison Gratuite${selectedTier.freeGift ? ` + 🎁 Cadeau : ${selectedTier.freeGift}` : ''}`
      : '1 Pièce (Standard)';
    const modeText = deliveryType === 'stopdesk'
      ? `🏢 En Agence / Point Relais Stopdesk (${city})`
      : `🏠 Livraison à Domicile (${city})`;

    const text = `Salam / السلام عليكم ! 👋
Je souhaite commander en 1 Clic :
📦 *Produit :* ${product.title}
${selectedSku ? `🏷️ *SKU :* ${selectedSku}\n` : ''}${selectedVariant ? `🎨 *Option :* ${selectedVariant}\n` : ''}${selectedColor ? `🎨 *Couleur :* ${selectedColor}\n` : ''}${selectedSize ? `📏 *Pointure/Taille :* ${selectedSize}\n` : ''}🔢 *Quantité :* ${packText}
💰 *Total à payer :* ${formatPrice(finalTotal)} (Paiement Cash à la réception)
📍 *Ville :* ${city || countryConfig.popularCities[0]} (${countryConfig.name})
🚚 *Délais :* ${deliveryEstimate.sla}
🚚 *Mode :* ${modeText}
${fullName.trim() ? `👤 *Nom complet :* ${fullName.trim()}\n` : ''}${deliveryType === 'home' && address.trim() ? `🏠 *Adresse :* ${address.trim()}\n` : ''}
✅ *Garantie Royale :* "${countryConfig.inspectionBadge.fr}" (${countryConfig.inspectionBadge.ar})
Merci de me confirmer la livraison !`;

    const url = `https://wa.me/${product.whatsAppDirectNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-lg my-auto bg-white ${theme.styleTokens.cardRadius || 'rounded-2xl'} shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col ${
        isWaybill ? 'border-2 border-dashed border-zinc-400 bg-amber-50/10' : 'border border-zinc-200'
      }`}>
        {/* BORDEREAU EXPRESS / STANDARD HEADER */}
        {isWaybill ? (
          <div className="bg-zinc-900 text-white p-3 sm:p-4 border-b-2 border-dashed border-zinc-700 relative">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span suppressHydrationWarning className="font-mono text-[10px] tracking-wider bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded border border-zinc-700">
                  BORDEREAU N° {waybillNumber}
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ● Express National
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 font-medium tracking-wide">
                  Formulaire de Commande Rapide
                </div>
                <h3 className="font-black text-sm tracking-tight text-white uppercase flex items-center gap-1.5">
                  <span>Bon d'Expédition Express COD</span>
                </h3>
                <p className="text-[11px] text-zinc-300">
                  Paiement sécurisé en espèces à la livraison après vérification
                </p>
              </div>
              <div className="flex flex-col items-end opacity-85 font-mono text-[9px] text-zinc-300">
                <span className="tracking-widest">||||||| | ||| |||| |</span>
                <span className="text-[8px] text-emerald-400 font-bold">EXPÉDITION 24/48H</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="text-white p-3.5 sm:p-4 flex items-center justify-between transition-colors"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm tracking-tight truncate">
                  Formulaire de Commande Rapide
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/80 truncate">
                  Paiement 100% en espèces à la livraison (COD)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
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
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-colors text-white shadow-xs"
                style={{
                  backgroundColor: step > 1 ? '#059669' : theme.colors.primary,
                }}
              >
                {step > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
              </span>
              <span className="text-[11px] sm:text-xs">1. Offre & Options</span>
            </button>

            {/* Connecting Bar */}
            <div className="flex-1 mx-2 sm:mx-3 h-1 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: step === 2 ? '100%' : '50%',
                  backgroundColor: theme.colors.primary,
                }}
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
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-colors shadow-xs"
                style={{
                  backgroundColor: step === 2 ? theme.colors.primary : '#e4e4e7',
                  color: step === 2 ? '#ffffff' : '#71717a',
                }}
              >
                2
              </span>
              <span className="text-[11px] sm:text-xs">2. Coordonnées</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body (320px safe & max-h-[82vh]) */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-3.5 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ================= STEP 1: QUANTITY TIER + VARIANT SELECTION + SUBTOTAL ================= */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              {/* Trust signals banner */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200/90 rounded-xl flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <PackageCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-emerald-950 text-[11px] truncate">
                    "Vérifiez votre colis avant de payer" (عاين سلعتك)
                  </span>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full shrink-0">
                  Casa 24h • Maroc 48h
                </span>
              </div>

              {/* Product Recap Mini Banner */}
              <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-zinc-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-zinc-900 truncate">{product.title}</h4>
                  {(selectedSku || selectedVariant) && (
                    <div className="text-[10px] text-zinc-500 font-medium truncate flex items-center gap-1.5 mt-0.5">
                      {selectedSku && <span className="font-mono font-bold text-zinc-700 bg-zinc-200/70 px-1.5 py-0.5 rounded text-[9px]">{selectedSku}</span>}
                      {selectedVariant && <span>{selectedVariant}</span>}
                      {selectedColor && <span>• {selectedColor}</span>}
                      {selectedSize && <span>• T.{selectedSize}</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-black text-sm text-emerald-700">{formatPrice(selectedTier.totalPrice)}</span>
                    {product.originalPrice > product.price && (
                      <span className="line-through text-xs text-zinc-400">
                        {formatPrice(Math.round((product.originalPrice / product.price) * selectedTier.totalPrice))}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                    Paiement à la livraison • {product.stockLeft <= 10 ? `Plus que ${product.stockLeft} en stock` : 'En stock'}
                  </p>
                </div>
              </div>

              {/* Multi-tier quantity upsells (Pack 1: Standard, Pack 2: Duo [Most Popular], Pack 3: Trio + Gift) */}
              {tiers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                    <span>Choisissez votre pack spécial :</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Paiement à la livraison (COD)</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {tiers.map((tier) => {
                      const isSelected = selectedTier.quantity === tier.quantity;
                      const isPackDuo = tier.isPopular || tier.quantity === 2;
                      const isPackTrio = tier.quantity === 3;
                      const isMulti = tier.quantity > 1 || tier.freeDelivery;

                      return (
                        <div
                          key={tier.quantity}
                          onClick={() => setSelectedTier(tier)}
                          className={`relative p-2.5 sm:p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? isPackDuo
                                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                                : isPackTrio
                                ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-600'
                                : 'border-zinc-900 bg-zinc-50 shadow-xs ring-1 ring-zinc-900'
                              : 'border-zinc-200 bg-white hover:border-zinc-300'
                          }`}
                        >
                          {/* High-converting Moroccan COD Urgency / Value Badges */}
                          {isPackDuo && (
                            <span className="absolute -top-2.5 right-3 text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                              🔥 Plus Populaire (الأكثر طلباً)
                            </span>
                          )}
                          {isPackTrio && (
                            <span className="absolute -top-2.5 right-3 text-[9px] font-black uppercase tracking-wider bg-purple-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                              🎁 Pack Trio + Cadeau Offert
                            </span>
                          )}

                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? isPackDuo
                                    ? 'border-emerald-600 bg-emerald-600'
                                    : isPackTrio
                                    ? 'border-purple-600 bg-purple-600'
                                    : 'border-zinc-900 bg-zinc-900'
                                  : 'border-zinc-300'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-zinc-900 truncate flex items-center gap-1.5">
                                <span>{tier.label}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {isMulti && (
                                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <Truck className="w-3 h-3 text-emerald-700" />
                                    Livraison Gratuite 24h
                                  </span>
                                )}
                                {tier.freeGift && (
                                  <span className="text-[9px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                    <Gift className="w-3 h-3 text-purple-700" />
                                    Cadeau Offert 🎁
                                  </span>
                                )}
                                {tier.savingsBadge && (
                                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                    {tier.savingsBadge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-xs sm:text-sm text-zinc-900">
                              {formatPrice(tier.totalPrice)}
                            </div>
                            {tier.quantity > 1 && (
                              <div className="text-[10px] text-zinc-400">
                                {formatPrice(tier.unitPrice)} / u
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Free gift callout if selectedTier has gift */}
              {selectedTier.freeGift && (
                <div className="p-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl flex items-center gap-2 text-xs text-purple-950">
                  <Gift className="w-4 h-4 text-purple-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-black text-[11px]">Cadeau VIP Inclus : </span>
                    <span className="text-[11px] text-purple-800 font-medium">{selectedTier.freeGift}</span>
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
                          className={`px-3 py-2 min-h-[44px] flex items-center justify-center text-xs font-bold rounded-lg border transition-all cursor-pointer ${
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

              {/* Subtotal Preview Card with Free Delivery Callout */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-700">
                    Sous-total ({selectedTier.quantity} {selectedTier.quantity > 1 ? 'articles' : 'article'}) :
                  </div>
                  {isFreeShipping ? (
                    <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Livraison 100% Gratuite {countryConfig.inCountryName} (Pack Offert !)</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                      💡 Astuce : Commandez le Pack Duo (2 pièces) pour la livraison GRATUITE !
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-black text-base text-zinc-900">{formatPrice(selectedTier.totalPrice)}</div>
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
                  className="w-full py-3 px-4 min-h-[44px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
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
              {/* Moroccan COD Trust Reassurance Micro-Banner */}
              <div className="p-2.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-semibold shadow-2xs">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Garantie Sérénité : Ouvrez et vérifiez votre colis avant de payer (عاين سلعتك)</span>
              </div>

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
                    <div className="text-[11px] text-zinc-600 truncate">
                      {selectedTier.label} {selectedVariant ? `• ${selectedVariant}` : ''} {selectedSku ? `[SKU: ${selectedSku}]` : ''} —{' '}
                      <span className="font-bold text-emerald-700">{formatPrice(selectedTier.totalPrice)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-[44px] px-2 text-[11px] font-bold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 cursor-pointer underline underline-offset-2 shrink-0 ml-2"
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
                      name="name"
                      autoComplete="name"
                      autoCapitalize="words"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (!touched.fullName) setTouched((prev) => ({ ...prev, fullName: true }));
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
                      placeholder="Ex: Youssef El Amrani"
                      className={`w-full px-3.5 py-2.5 bg-zinc-50 border rounded-xl text-base sm:text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition ${
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
                  <div className={`flex rounded-xl border overflow-hidden transition ${
                    touched.phone && !phoneValidation.isValid
                      ? 'border-red-400 bg-red-50/30 ring-1 ring-red-400'
                      : phoneValidation.isValid
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-zinc-300 bg-zinc-50 focus-within:ring-2 focus-within:ring-zinc-900 focus-within:bg-white'
                  }`}>
                    <div className="flex items-center px-3 bg-zinc-100/90 border-r border-zinc-300 text-xs font-bold text-zinc-700 select-none shrink-0 gap-1.5">
                      <span>{countryConfig.phone.flag}</span>
                      <span>{countryConfig.phone.dialCode}</span>
                    </div>
                    <input
                      type="tel"
                      name="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                      placeholder={countryConfig.phone.placeholder}
                      className="w-full px-3 py-2.5 bg-transparent border-0 text-base sm:text-xs font-medium focus:outline-none text-zinc-900"
                    />
                  </div>
                  {touched.phone && !phoneValidation.isValid ? (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">{phoneValidation.error}</p>
                  ) : (
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal">
                      Format : {countryConfig.phone.example}. Le livreur vous contactera avant le passage.
                    </p>
                  )}
                </div>

                {/* City & Delivery Mode Selection */}
                <div className="space-y-2">
                  <div>
                    {/* Cross-Border Destination Country Strip */}
                    <div className="flex items-center justify-between gap-1 mb-2 pb-2 border-b border-zinc-200/80">
                      <span className="text-[11px] font-bold text-zinc-600 flex items-center gap-1">
                        <span>Destination :</span>
                        <span className="text-zinc-900 font-extrabold">{countryConfig.name}</span>
                      </span>
                      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                        {[
                          { code: 'MA', flag: '🇲🇦', label: 'Maroc' },
                          { code: 'SA', flag: '🇸🇦', label: 'Arabie S.' },
                          { code: 'AE', flag: '🇦🇪', label: 'Émirats' },
                          { code: 'EG', flag: '🇪🇬', label: 'Égypte' },
                          { code: 'DZ', flag: '🇩🇿', label: 'Algérie' },
                        ].map((c) => {
                          const isActive = effectiveCountryCode === c.code;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleCountrySwitch(c.code)}
                              className={`px-2 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0 ${
                                isActive
                                  ? 'bg-zinc-900 text-white shadow-xs scale-105'
                                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                              }`}
                              title={c.label}
                            >
                              <span>{c.flag}</span>
                              <span className="text-[10px] font-mono">{c.code}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
                      <span>
                        Ville de Livraison <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal">
                        1-Tap ou tapez librement
                      </span>
                    </label>

                    {/* Popular Country Cities Quick-Chips with accessible touch targets */}
                    {countryConfig.popularCities && countryConfig.popularCities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {countryConfig.popularCities.map((cityName) => (
                          <button
                            key={cityName}
                            type="button"
                            onClick={() => setCity(cityName)}
                            className={`text-xs px-3 py-1.5 min-h-[38px] rounded-lg border font-semibold transition-all cursor-pointer ${
                              city.trim().toLowerCase() === cityName.toLowerCase()
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                                : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                            }`}
                          >
                            {cityName}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Smart Autocomplete with Free-Text Freedom: Type or pick ANY city */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="city"
                        id="checkout-city-input"
                        list="checkout-city-datalist"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={`Tapez ou choisissez votre ville (ex: ${countryConfig.popularCities[0] || 'Casablanca'})...`}
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-base sm:text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition"
                        autoComplete="address-level2"
                      />
                      <datalist id="checkout-city-datalist">
                        {countryConfig.knownCities.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.nameAr ? `${c.name} (${c.nameAr})` : c.name}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1.5 font-normal">
                      <span>
                        {city.trim() ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            {deliveryEstimate.sla}
                          </span>
                        ) : (
                          'Délais et frais calculés automatiquement selon la ville.'
                        )}
                      </span>
                      <span className="font-semibold text-zinc-700 text-right">
                        {effectiveShippingFee === 0 || isFreeShipping ? (
                          <span className="text-emerald-600 font-bold">Livraison Gratuite</span>
                        ) : (
                          `${effectiveShippingFee} ${countryConfig.currency.symbol}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Mode Choice: Home vs Stopdesk / Agence (Positioned above estimate) */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      Mode de Réception <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('home')}
                        className={`p-2.5 rounded-xl border-2 text-left transition cursor-pointer flex flex-col justify-between min-h-[56px] ${
                          deliveryType === 'home'
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                            : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 font-bold text-xs">
                          <span>🏠 À Domicile</span>
                          <span className={`text-[10px] font-black ${
                            deliveryType === 'home' ? 'text-emerald-300' : 'text-emerald-700'
                          }`}>
                            {effectiveShippingFee === 0 || isFreeShipping ? 'Gratuit' : formatPrice(deliveryEstimate.shippingFee)}
                          </span>
                        </div>
                        <span className={`text-[10px] mt-1 ${deliveryType === 'home' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          Livreur à votre porte
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('stopdesk')}
                        className={`p-2.5 rounded-xl border-2 text-left transition cursor-pointer flex flex-col justify-between relative min-h-[56px] ${
                          deliveryType === 'stopdesk'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                            : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                        }`}
                      >
                        <span className="absolute -top-2 right-2 text-[8px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-full shadow-xs">
                          100% Gratuit
                        </span>
                        <div className="flex items-center justify-between gap-1 font-bold text-xs text-emerald-800">
                          <span>🏢 Point Relais</span>
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Gratuit
                          </span>
                        </div>
                        <span className="text-[10px] mt-1 text-emerald-700">
                          En agence / Point Relais
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Delivery Estimate Card */}
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-xl text-xs flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="font-bold text-emerald-950">
                          {deliveryType === 'stopdesk'
                            ? `Point Relais / Agence : ${city}`
                            : `Livraison estimée : ${deliveryEstimate.formattedEstimate}`}
                        </span>
                        <span className="font-black text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded text-[10px]">
                          {effectiveShippingFee === 0 ? 'GRATUITE' : formatPrice(effectiveShippingFee)}
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800 mt-0.5">
                        {deliveryType === 'stopdesk'
                          ? `Colis conservé 48h au point relais (${countryConfig.pickupPartnerText || 'Agence Locale'}) • SMS dès réception`
                          : `Délai ${deliveryEstimate.sla} • Paiement cash lors de la remise en main propre`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address or Agency Selection */}
                {deliveryType === 'home' ? (
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
                      name="address"
                      autoComplete="street-address"
                      autoCapitalize="sentences"
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (!touched.address) setTouched((prev) => ({ ...prev, address: true }));
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
                      placeholder={countryConfig.addressPlaceholder || "Ex: Quartier Maârif, Rue Abou Bakr Essedik, Résidence Al Manar Appt 4"}
                      className={`w-full px-3.5 py-2 bg-zinc-50 border rounded-xl text-base sm:text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition ${
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
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center justify-between">
                      <span>
                        Agence souhaitée ou Quartier à {city}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Sans adresse requise
                      </span>
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder={countryConfig.agencyPlaceholder || "Ex: Agence Relais Maârif, Agence Agdal, ou agence la plus proche"}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-base sm:text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:bg-white focus:outline-none transition"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal">
                      Laissez vide pour recevoir le colis à l'agence la plus proche de votre zone. SMS envoyé dès réception.
                    </p>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>
                    Sous-total ({selectedTier.quantity} {selectedTier.quantity > 1 ? 'articles' : 'article'}) :
                  </span>
                  <span className="font-semibold text-zinc-800">{formatPrice(selectedTier.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Frais de livraison ({city}) :</span>
                  <span className="font-semibold text-zinc-800">
                    {effectiveShippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">
                        GRATUITE {selectedTier.quantity >= 2 ? '(Pack Duo 🎉)' : (deliveryType === 'stopdesk' ? '(Point Relais 🏢)' : '')}
                      </span>
                    ) : (
                      formatPrice(effectiveShippingFee)
                    )}
                  </span>
                </div>
                {/* Free gift item if tier has gift */}
                {selectedTier.freeGift && (
                  <div className="flex justify-between text-purple-700">
                    <span className="flex items-center gap-1 font-medium">
                      <Gift className="w-3.5 h-3.5 text-purple-600" />
                      <span>Cadeau Exclusif Trio :</span>
                    </span>
                    <span className="font-bold text-purple-800">OFFERT (0 {countryConfig.currency.symbol} 🎁)</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-200 flex justify-between items-center text-sm font-bold">
                  <span className="text-zinc-900">Total à payer à la livraison :</span>
                  <span className="text-base font-black text-emerald-700">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Step 2 CTA Actions */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-200">
                {/* 1. Compact Reassurance Badge right above CTA */}
                <div className="p-2.5 bg-emerald-50 border border-emerald-200/90 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <PackageCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-bold text-emerald-950 text-[11px] truncate">
                      "Vérifiez votre colis avant de payer" (عاين سلعتك قبل ما تخلص)
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    100% Cash COD
                  </span>
                </div>

                {/* 2. Primary CTA Button directly visible */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-4 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:opacity-95 min-h-[48px] ${theme.styleTokens.buttonRadius}`}
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
                      <span>Confirmer la Commande — {formatPrice(finalTotal)}</span>
                    </>
                  )}
                </button>

                {/* 3. Secondary Actions: Back & WhatsApp */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 px-3 min-h-[44px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-2/3 py-2.5 px-3 min-h-[44px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Commander via WhatsApp</span>
                  </button>
                </div>

                {/* 4. Detailed Guarantees Checklist placed underneath for trust */}
                <div className={`p-2.5 rounded-xl border text-[10px] space-y-1 ${
                  isWaybill ? 'border-dashed border-amber-300 bg-amber-50/50' : 'border-emerald-200/80 bg-emerald-50/30'
                }`}>
                  <div className="font-bold text-zinc-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Garanties COD Shop : Inspection avant paiement • Appel du livreur • Zéro avance bancaire</span>
                  </div>
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

