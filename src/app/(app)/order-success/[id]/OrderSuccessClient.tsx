'use client';

import React, { useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  PackageCheck,
  PhoneCall,
  Truck,
  Banknote,
  MessageCircle,
  ArrowLeft,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  Clock,
  Zap,
  Loader2,
  Check,
  Plus,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { detectClientVisitorCountry, getCountryConfig, formatCountryPrice } from '@/lib/geo';
import { fetchAndInitPixels, trackPurchase } from '@/lib/pixel-tracker';

interface OrderSuccessClientProps {
  orderId: string;
  customerName: string;
  city: string;
  total: number | null;
  subtotal?: number;
  shippingFee?: number;
  items?: Array<{
    id?: string;
    title: string;
    quantity: number;
    price: number;
    variant?: string;
    sku?: string;
  }>;
  countryCode?: string;
  currency?: string;
}

export default function OrderSuccessClient({
  orderId,
  customerName,
  city,
  total,
  subtotal,
  shippingFee = 0,
  items = [],
  countryCode: initialCountryCode,
  currency: initialCurrency,
}: OrderSuccessClientProps) {
  const { formatMAD, formatPrice, countryCode: contextCountryCode } = useTheme();

  const [visitorCountry, setVisitorCountry] = useState<string>(
    initialCountryCode || contextCountryCode || 'MA'
  );

  // Live order state (updated when 1-click upsells are accepted)
  const [currentTotal, setCurrentTotal] = useState<number | null>(total);
  const [currentItems, setCurrentItems] = useState(items);
  const [acceptedUpsellIds, setAcceptedUpsellIds] = useState<string[]>([]);
  const [loadingUpsellId, setLoadingUpsellId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // 5-minute packing countdown timer
  const [secondsLeft, setSecondsLeft] = useState(299);

  useEffect(() => {
    setVisitorCountry(detectClientVisitorCountry(initialCountryCode || contextCountryCode || 'MA'));
  }, [initialCountryCode, contextCountryCode]);

  const countryConfig = useMemo(() => getCountryConfig(visitorCountry), [visitorCountry]);

  // Countdown timer effect
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Launch festive order celebration confetti on mount
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#d97706', '#2563eb', '#dc2626'],
      });
    } catch {
      // ignore non-critical confetti errors
    }

    // Initialize pixels and fire deduplicated Purchase event
    fetchAndInitPixels().then(() => {
      trackPurchase({
        orderId,
        total: total || 0,
        items,
        customerCity: city,
      });
    });
  }, [orderId, total, items, city]);

  const primaryItem = useMemo(() => {
    return currentItems.length > 0 ? currentItems[0] : null;
  }, [currentItems]);

  // Compute dynamic upsell offers
  const upsellOffers = useMemo(() => {
    const offers = [];

    // Offer 1: BOGO / 2nd Unit at 50% discount (Highest Converting COD Upsell)
    if (primaryItem) {
      const bogoPrice = Math.max(1, Math.round(primaryItem.price * 0.5));
      offers.push({
        id: `bogo_${primaryItem.id || 'unit'}`,
        type: 'bogo' as const,
        badge: 'OFFRE LIMITÉE -50%',
        title: `2ème Exemplaire : ${primaryItem.title}`,
        description:
          'Ajoutez un second exemplaire dans le même carton pour un proche ou comme pièce de rechange. 0 DH de frais de livraison supplémentaires !',
        price: bogoPrice,
        regularPrice: primaryItem.price,
        item: {
          id: `upsell_bogo_${primaryItem.id || 'item'}`,
          title: `${primaryItem.title} (Offre 2ème unité -50%)`,
          price: bogoPrice,
          quantity: 1,
          variant: primaryItem.variant,
          sku: primaryItem.sku,
        },
      });
    }

    // Offer 2: 1-Year Instant Replacement Guarantee (Pure Margin, High Perceived Value)
    const warrantyPrice = visitorCountry === 'SA' ? 19 : visitorCountry === 'AE' ? 19 : 29;
    const regularWarrantyPrice = warrantyPrice * 2;
    offers.push({
      id: 'warranty_1yr',
      type: 'warranty' as const,
      badge: 'TRANQUILLITÉ TOTALE',
      title: 'Garantie Échange à Neuf 1 An (Casse & Panne)',
      description:
        'En cas de moindre anomalie, casse ou dysfonctionnement sous 12 mois, nous vous livrons un produit neuf directement chez vous sans frais.',
      price: warrantyPrice,
      regularPrice: regularWarrantyPrice,
      item: {
        id: 'srv_warranty_1yr',
        title: 'Garantie Échange à Neuf 1 An (Casse & Panne)',
        price: warrantyPrice,
        quantity: 1,
      },
    });

    return offers;
  }, [primaryItem, visitorCountry]);

  // 1-Click Upsell Click Handler
  const handleAddUpsell = async (offer: (typeof upsellOffers)[number]) => {
    if (loadingUpsellId || acceptedUpsellIds.includes(offer.id)) return;
    setLoadingUpsellId(offer.id);

    try {
      const res = await fetch('/api/order/upsell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          item: offer.item,
          upsellType: offer.type,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCurrentTotal(data.newTotal);
        if (data.items) {
          setCurrentItems(data.items);
        } else {
          setCurrentItems((prev) => [...prev, data.addedItem]);
        }
        setAcceptedUpsellIds((prev) => [...prev, offer.id]);
        setNotification(
          `✓ ${offer.title} a été ajouté à votre colis ! Le montant à régler au livreur a été mis à jour.`
        );

        // Celebration micro-confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#10b981', '#f59e0b', '#3b82f6'],
          });
        } catch {}
      } else {
        alert(data.message || 'Impossible d’ajouter l’article à votre commande.');
      }
    } catch (err) {
      console.error('[Upsell Action Error]:', err);
      alert('Une erreur est survenue lors de l’ajout.');
    } finally {
      setLoadingUpsellId(null);
    }
  };

  const whatsAppUrl = `https://wa.me/212661000000?text=${encodeURIComponent(
    `Salam, je confirme ma commande #${orderId} au nom de ${customerName} (${city}${
      currentTotal ? `, Total: ${formatCountryPrice(currentTotal, visitorCountry)}` : ''
    })`
  )}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          Commande Enregistrée avec Succès
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
          Merci {customerName} pour votre confiance !
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto">
          Votre commande <span className="font-mono font-bold text-zinc-900">#{orderId}</span> au
          nom de <span className="font-semibold text-zinc-900">{customerName}</span> a bien été
          enregistrée et transmise à notre équipe de préparation.
        </p>
      </div>

      {/* ── 1-CLICK POST-PURCHASE UPSELL FUNNEL SECTION ── */}
      {secondsLeft > 0 && upsellOffers.length > 0 && (
        <div className="p-5 sm:p-6 bg-linear-to-b from-amber-50/80 via-emerald-50/40 to-white rounded-2xl border-2 border-emerald-500/30 shadow-md text-left space-y-5 animate-in fade-in zoom-in-95 duration-300">
          {/* Section Header with Live Urgency Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                Colis en cours de préparation dans notre entrepôt
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-300 rounded-full text-amber-900 text-xs font-bold shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>Fermeture du colis dans :</span>
              <span className="font-mono font-black text-amber-700">{formatCountdown(secondsLeft)}</span>
            </div>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-black text-zinc-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Complétez votre colis en 1 Clic (Sans Frais de Port)</span>
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              Profitez d’un ajout exceptionnel à tarif préférentiel dans le même colis. Le montant à régler au livreur sera automatiquement mis à jour.
            </p>
          </div>

          {/* Upsell Success Toast */}
          {notification && (
            <div className="p-3 bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
              <Check className="w-4 h-4 text-emerald-700 stroke-[3] shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Upsell Cards List */}
          <div className="grid grid-cols-1 gap-3.5">
            {upsellOffers.map((offer) => {
              const isAccepted = acceptedUpsellIds.includes(offer.id);
              const isLoading = loadingUpsellId === offer.id;

              return (
                <div
                  key={offer.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAccepted
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-white border-zinc-200 hover:border-emerald-400 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                          {offer.badge}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          Livraison Gratuite (Même Colis)
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-zinc-900">{offer.title}</h3>
                      <p className="text-[11px] text-zinc-500 leading-relaxed max-w-md">
                        {offer.description}
                      </p>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                      <div className="text-left sm:text-right">
                        <span className="text-xs line-through text-zinc-400 mr-2 sm:mr-0 sm:block font-semibold">
                          {formatCountryPrice(offer.regularPrice, visitorCountry)}
                        </span>
                        <span className="text-base sm:text-lg font-black text-emerald-700">
                          {formatCountryPrice(offer.price, visitorCountry)}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={isAccepted || isLoading}
                        onClick={() => handleAddUpsell(offer)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[42px] ${
                          isAccepted
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white active:scale-95'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Ajout au colis...</span>
                          </>
                        ) : isAccepted ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Inclus dans votre colis</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>Ajouter en 1 Clic</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recap Box with Live Updated Total */}
      <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left space-y-3">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-zinc-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Client :</span>
          </span>
          <span className="font-bold text-zinc-900">{customerName}</span>
        </div>

        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-zinc-500">Numéro de Commande :</span>
          <span className="font-mono font-bold text-zinc-900">#{orderId}</span>
        </div>

        <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-100">
          <span className="text-zinc-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>Destination :</span>
          </span>
          <span className="font-bold text-zinc-900">{city}</span>
        </div>

        {currentItems && currentItems.length > 0 && (
          <div className="text-xs pb-3 border-b border-zinc-100 space-y-1.5">
            <span className="text-zinc-500 font-semibold block">Articles dans votre colis :</span>
            {currentItems.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-zinc-800">
                <span className="truncate pr-2">
                  {it.quantity}x {it.title}
                </span>
                <span className="font-bold shrink-0">
                  {formatCountryPrice(it.price * it.quantity, visitorCountry)}
                </span>
              </div>
            ))}
          </div>
        )}

        {currentTotal !== null && (
          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span className="text-zinc-900">Montant à régler au livreur à réception :</span>
            <span className="text-lg font-black text-emerald-700">
              {formatCountryPrice(currentTotal, visitorCountry)}
            </span>
          </div>
        )}
      </div>

      {/* 3 Steps Timeline */}
      <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-left space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500">
          Ce qui va se passer maintenant :
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Appel de confirmation téléphonique</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Notre agent va vous appeler dans les prochaines heures pour confirmer votre adresse à{' '}
                {city} et convenir de l'horaire de livraison.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Expédition express sous 24h</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Votre colis est confié à notre transporteur express partenaire pour acheminement vers{' '}
                {city}.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Réception & Paiement en espèces</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Vous vérifiez votre produit directement devant le livreur, puis réglez en{' '}
                {countryConfig.currency.symbol} en toute confiance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Suivre ma commande sur WhatsApp</span>
        </a>

        <a
          href="/"
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retourner à la boutique</span>
        </a>
      </div>
    </div>
  );
}
