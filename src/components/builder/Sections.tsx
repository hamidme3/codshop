'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Truck, Award, Clock, Flame, 
  Star, ChevronDown, MessageCircle, Check, ArrowRight,
  PackageCheck, Play, Sparkles, AlertCircle, ShoppingBag,
  RotateCcw, ThumbsUp, MapPin
} from 'lucide-react';
import { MOROCCAN_CITIES, getCityShipping } from '@/lib/moroccanCities';

export function getButtonRadiusClass(radius?: string) {
  if (radius === 'sharp') return 'rounded-none';
  if (radius === 'subtle') return 'rounded-lg';
  if (radius === 'rounded') return 'rounded-2xl';
  if (radius === 'pill') return 'rounded-full';
  return 'rounded-xl';
}

export function getFontFamilyClass(font?: string) {
  if (font === 'serif') return 'font-serif';
  if (font === 'mono') return 'font-mono';
  return 'font-sans';
}

// 0. ANNOUNCEMENT BAR
export function AnnouncementBarSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const text = settings.text || themeConfig?.announcementText || 'Livraison Rapide Gratuite dès 400 DH • Paiement Cash à la Livraison après vérification du colis';
  const bg = settings.bgColor || themeConfig?.accentColor || '#c59b27';

  return (
    <aside aria-label="Announcement" 
      className="py-2.5 px-4 text-center text-xs font-bold text-slate-950 transition-colors flex items-center justify-center gap-2 select-none"
      style={{ backgroundColor: bg }}
    >
      <span className="inline-block animate-pulse">🇲🇦</span>
      <span>{text}</span>
    </aside>
  );
}

// 1. HERO BANNER SECTION
export function HeroSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const accentColor = themeConfig?.accentColor || '#c59b27';
  const radiusClass = getButtonRadiusClass(themeConfig?.buttonRadius);
  const fontClass = getFontFamilyClass(themeConfig?.fontFamily);

  return (
    <section className={`relative overflow-hidden py-16 px-4 sm:px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800 ${fontClass}`}>
      {settings.bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: `url(${settings.bgImage})` }}
        />
      )}
      <div className="relative max-w-3xl mx-auto space-y-4">
        {settings.badgeText && (
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
            style={{ 
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}15`,
              color: accentColor 
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings.badgeText}</span>
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {settings.headline || 'Excellence & Savoir-Faire Marocain'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          {settings.subheadline || 'Produits 100% authentiques livrés directement à votre porte avec paiement à la livraison.'}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#cod-form"
            className={`inline-flex items-center gap-2 font-black px-8 py-3.5 shadow-lg text-sm sm:text-base transition-transform hover:scale-105 active:scale-95 text-slate-950 ${radiusClass}`}
            style={{ backgroundColor: accentColor }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{settings.ctaText || 'Commander — Paiement à la Livraison'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Colis vérifiable
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-400" /> Livraison 24h/48h
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" /> Échange facile
          </span>
        </div>
      </div>
    </section>
  );
}

// 2. FEATURES & MOROCCAN TRUST BADGES
export function FeaturesGridSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const accentColor = themeConfig?.accentColor || '#c59b27';
  const badges = settings.badges || [
    { title: 'Paiement à la Livraison', subtitle: 'Payez en espèces après inspection' },
    { title: 'Ouverture du Colis Garantie', subtitle: 'Vérifiez le produit avant de régler' },
    { title: 'Livraison Express 24/48h', subtitle: 'Partout au Maroc (Casablanca, Rabat...)' },
    { title: 'Échange Gratuit 7 Jours', subtitle: 'Service client WhatsApp réactif 7j/7' },
  ];

  return (
    <section className="py-10 px-4 bg-slate-950 border-b border-slate-800">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {badges.map((b: any, i: number) => (
          <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              {i === 0 ? <ShieldCheck className="w-5 h-5" /> : 
               i === 1 ? <PackageCheck className="w-5 h-5" /> : 
               i === 2 ? <Truck className="w-5 h-5" /> : 
               <RotateCcw className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">{b.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{b.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 3. URGENCY & STOCK COUNTDOWN
export function UrgencyTimerSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const accentColor = themeConfig?.accentColor || '#c59b27';
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return { hours: Math.max(0, prev.hours - 1), minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stockRemaining = settings.stockRemaining || 14;

  return (
    <section 
      className="py-5 px-4 border-y"
      style={{ 
        backgroundColor: `${accentColor}10`,
        borderColor: `${accentColor}30`,
        color: accentColor 
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 animate-pulse"
            style={{ backgroundColor: `${accentColor}25` }}
          >
            <Flame className="w-5 h-5" style={{ color: accentColor }} />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base text-white">
              {settings.title || 'Offre Spéciale Flash — Stock Très Limité'}
            </div>
            <div className="text-xs mt-0.5" style={{ color: accentColor }}>
              Plus que <strong>{stockRemaining} articles</strong> en stock pour livraison immédiate !
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono font-bold text-xs bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-white shadow-inner">
          <Clock className="w-4 h-4" style={{ color: accentColor }} />
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
          <span style={{ color: accentColor }}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    </section>
  );
}

// 4. 1-STEP MOROCCAN COD CHECKOUT BLOCK
export function CodCheckoutSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const accentColor = themeConfig?.accentColor || '#c59b27';
  const radiusClass = getButtonRadiusClass(themeConfig?.buttonRadius);

  const [selectedPack, setSelectedPack] = useState<'single' | 'duo' | 'trio'>('duo');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const basePrice = settings.price || 349;
  const comparePrice = settings.comparePrice || basePrice * 1.5;
  const duoDiscount = settings.packDuoDiscount || 100;
  const trioDiscount = settings.packTrioDiscount || 200;

  const getPackTotal = () => {
    if (selectedPack === 'single') return basePrice;
    if (selectedPack === 'duo') return basePrice * 2 - duoDiscount;
    return basePrice * 3 - trioDiscount;
  };

  const shippingInfo = getCityShipping(city, getPackTotal());
  const shippingFee = shippingInfo.fee;
  const total = getPackTotal() + shippingFee;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setSubmitting(true);

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { fullName, phone, city, address },
          product: { title: settings.productTitle || 'Article Boutique' },
          quantity: selectedPack === 'single' ? 1 : selectedPack === 'duo' ? 2 : 3,
          unitPrice: basePrice,
          total,
        }),
      });
      setSuccess(true);
    } catch (err) {
      alert('Erreur lors de la validation de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div id="cod-form" className="py-12 px-4 text-center bg-slate-900 border border-slate-800 rounded-3xl max-w-xl mx-auto my-8 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Commande Confirmée avec Succès !</h3>
        <p className="text-slate-300 text-sm mb-4">
          Merci <strong>{fullName}</strong>. Notre agent de confirmation vous contactera au <strong>{phone}</strong> dans les prochaines minutes.
        </p>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-1 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Ville de livraison :</span>
            <span className="text-white font-bold">{city}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Délai estimé :</span>
            <span className="text-emerald-400 font-bold">{shippingInfo.sla}</span>
          </div>
          <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
            <span>Total à régler au livreur :</span>
            <span className="text-sm font-black" style={{ color: accentColor }}>{total} DH</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="cod-form" className="py-12 px-4 bg-slate-950">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <span 
            className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
            style={{ 
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}15`,
              color: accentColor 
            }}
          >
            Formulaire de Commande Express 🇲🇦
          </span>
          <h2 className="text-2xl font-black text-white mt-3">
            {settings.productTitle || 'Commandez Votre Article'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Paiement Cash à la livraison après ouverture et vérification de votre colis.
          </p>
        </div>

        <form onSubmit={handleOrder} className="space-y-5">
          {/* Pack Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Choisissez votre offre avantage :
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPack('single')}
                className={`p-3 rounded-2xl border text-center text-xs transition-all ${
                  selectedPack === 'single'
                    ? 'border-amber-500 bg-amber-500/10 text-white font-bold ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px]">1 Article</div>
                <div className="font-black text-sm mt-0.5 text-white">{basePrice} DH</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPack('duo')}
                className={`p-3 rounded-2xl border text-center text-xs relative transition-all ${
                  selectedPack === 'duo'
                    ? 'border-amber-500 bg-amber-500/10 text-white font-bold ring-1 ring-amber-500 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span 
                  className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase text-slate-950"
                  style={{ backgroundColor: accentColor }}
                >
                  Top Vente
                </span>
                <div className="text-[11px]">Pack Duo (2)</div>
                <div className="font-black text-sm mt-0.5" style={{ color: accentColor }}>
                  {basePrice * 2 - duoDiscount} DH
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">-100 DH</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPack('trio')}
                className={`p-3 rounded-2xl border text-center text-xs relative transition-all ${
                  selectedPack === 'trio'
                    ? 'border-amber-500 bg-amber-500/10 text-white font-bold ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-500 text-slate-950">
                  Économique
                </span>
                <div className="text-[11px]">Pack Trio (3)</div>
                <div className="font-black text-sm mt-0.5 text-white">
                  {basePrice * 3 - trioDiscount} DH
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">-200 DH</div>
              </button>
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Nom & Prénom :
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Fatima Zahra El Amrani"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Moroccan Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              3. Téléphone (WhatsApp pour confirmation) :
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400 pointer-events-none">
                🇲🇦 +212
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="6 61 23 45 67"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-20 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>
          </div>

          {/* City Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                4. Ville :
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {MOROCCAN_CITIES.slice(0, 12).map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.shippingFee} DH - {c.deliverySla})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                5. Adresse ou Quartier :
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Maarif, Hay Riad..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Sous-total articles :</span>
              <span className="text-white font-bold">{getPackTotal()} DH</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Frais de livraison ({city}) :</span>
              <span className="text-emerald-400 font-bold">
                {shippingFee === 0 ? 'GRATUITE' : `${shippingFee} DH`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-sm font-bold text-white">Total à payer au livreur :</span>
              <span className="text-lg font-black" style={{ color: accentColor }}>
                {total} DH
              </span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 px-6 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${radiusClass}`}
            style={{ backgroundColor: accentColor }}
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Validation en cours...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Confirmer Ma Commande (Paiement Cash au Livreur)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

// 5. TESTIMONIALS & MOROCCAN REVIEWS SECTION
export function ReviewsSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const accentColor = themeConfig?.accentColor || '#c59b27';
  const reviews = settings.reviews || [
    { 
      name: 'Fatima Zahra M.', 
      city: 'Casablanca (Maârif)', 
      rating: 5, 
      comment: 'Tbarkellah la qualité top bezzaf ! Reçue en 24h, j\'ai pu ouvrir la boîte et vérifier avant de payer le livreur.',
      date: 'Hier'
    },
    { 
      name: 'Yassine Bennani', 
      city: 'Rabat (Agdal)', 
      rating: 5, 
      comment: 'Livreur très poli et ponctuel. Le produit correspond exactement aux photos. Service 5 étoiles.',
      date: 'Il y a 2 jours'
    },
    { 
      name: 'Mehdi B.', 
      city: 'Marrakech (Guéliz)', 
      rating: 5, 
      comment: 'Pack Duo commandé, excellent rapport qualité-prix. Je recommande cette boutique sans hésiter.',
      date: 'Il y a 3 jours'
    },
  ];

  return (
    <section className="py-14 px-4 bg-slate-900 border-t border-slate-800 text-center">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-2">
            {[...Array(5)].map((_, s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-white ml-2">4.9 / 5 sur 1 420+ avis clients</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {settings.title || 'Ce Que Disent Nos Clients Partout au Maroc'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Avis vérifiés après livraison par nos livreurs partenaires au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {reviews.map((r: any, i: number) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(r.rating || 5)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500">{r.date || 'Avis vérifié'}</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-white">{r.name}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-rose-400" />
                    <span>{r.city}</span>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Achat Vérifié 🇲🇦
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. VIDEO DEMO SHOWCASE
export function VideoShowcaseSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const accentColor = themeConfig?.accentColor || '#c59b27';
  const radiusClass = getButtonRadiusClass(themeConfig?.buttonRadius);

  return (
    <section className="py-14 px-4 bg-slate-950 border-t border-slate-800 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <span 
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-2"
            style={{ 
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}15`,
              color: accentColor 
            }}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{settings.badgeText || 'Démonstration en Vidéo'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {settings.title || 'Découvrez le Produit en Action'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {settings.subtitle || 'Regardez comment fonctionne le produit avant de passer votre commande.'}
          </p>
        </div>

        {/* Video Player Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center group cursor-pointer">
          {settings.thumbnailUrl ? (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${settings.thumbnailUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 opacity-90" />
          )}
          <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110"
            style={{ backgroundColor: accentColor, color: '#090d16' }}
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-slate-300 bg-slate-950/80 backdrop-blur-sm py-2 px-4 rounded-xl border border-slate-800">
            Démonstration 100% réelle • Produit conforme garanti
          </div>
        </div>

        <div>
          <a
            href="#cod-form"
            className={`inline-flex items-center gap-2 font-black px-6 py-3 shadow-lg text-xs uppercase tracking-wider text-slate-950 transition-transform hover:scale-105 ${radiusClass}`}
            style={{ backgroundColor: accentColor }}
          >
            <span>Commander Maintenant</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// 7. FAQ ACCORDION
export function FaqSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const accentColor = themeConfig?.accentColor || '#c59b27';
  const faqs = settings.faqs || [
    { 
      q: 'Puis-je ouvrir et vérifier le colis avant de payer ?', 
      a: 'Oui, absolument ! Tous nos livreurs ont instruction de vous laisser ouvrir et inspecter votre colis avant de régler.' 
    },
    { 
      q: 'Comment s\'effectue le paiement ?', 
      a: 'Le paiement se fait 100% en espèces (Cash on Delivery) directement au livreur à votre porte.' 
    },
    { 
      q: 'Quels sont vos délais de livraison ?', 
      a: 'Casablanca et Rabat : 24h. Marrakech, Fès, Tanger, Agadir et les autres villes du Maroc : 24h à 48h maximum.' 
    },
    { 
      q: 'Que faire en cas de problème ou échange de taille ?', 
      a: 'Nous vous offrons l\'échange gratuit sous 7 jours. Contactez simplement notre support WhatsApp qui vous enverra un livreur.' 
    },
  ];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-14 px-4 bg-slate-950 border-t border-slate-800">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-black text-white">Questions Fréquentes</h2>
          <p className="text-xs text-slate-400">Tout ce que vous devez savoir avant de commander.</p>
        </div>

        {faqs.map((f: any, i: number) => (
          <div key={i} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/50 transition-colors">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full p-4 text-left text-xs sm:text-sm font-bold text-white flex items-center justify-between"
            >
              <span>{f.q}</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${openIdx === i ? 'rotate-180' : 'text-slate-500'}`} 
                style={{ color: openIdx === i ? accentColor : undefined }}
              />
            </button>
            {openIdx === i && (
              <div className="px-4 pb-4 text-xs text-slate-300 border-t border-slate-800/40 pt-3 leading-relaxed">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// 8. FLOATING & STICKY WHATSAPP BUTTON
export function WhatsAppBarSection({ 
  settings, 
  themeConfig 
}: { 
  settings: any; 
  themeConfig?: any; 
}) {
  const phone = (settings.phone || '+212661000000').replace(/[^0-9]/g, '');
  const message = encodeURIComponent(settings.message || 'Salam, bghit nsewel 3la had l\'article w ncommander');

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2">
      <a
        href={`https://wa.me/${phone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-3 rounded-full shadow-2xl shadow-emerald-600/50 text-xs sm:text-sm transition-transform hover:scale-105 active:scale-95 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span>{settings.buttonText || 'Commander sur WhatsApp'}</span>
      </a>
    </aside>
  );
}

// MASTER DYNAMIC SECTION RENDERER
export function DynamicSectionRenderer({ 
  section, 
  themeConfig 
}: { 
  section: any; 
  themeConfig?: any; 
}) {
  if (section.hidden) return null;

  switch (section.type) {
    case 'announcement_bar':
      return <AnnouncementBarSection settings={section.settings} themeConfig={themeConfig} />;
    case 'hero_banner':
      return <HeroSection settings={section.settings} themeConfig={themeConfig} />;
    case 'features_grid':
      return <FeaturesGridSection settings={section.settings} themeConfig={themeConfig} />;
    case 'urgency_timer':
      return <UrgencyTimerSection settings={section.settings} themeConfig={themeConfig} />;
    case 'cod_checkout':
      return <CodCheckoutSection settings={section.settings} themeConfig={themeConfig} />;
    case 'testimonials_carousel':
      return <ReviewsSection settings={section.settings} themeConfig={themeConfig} />;
    case 'video_showcase':
      return <VideoShowcaseSection settings={section.settings} themeConfig={themeConfig} />;
    case 'faq_accordion':
      return <FaqSection settings={section.settings} themeConfig={themeConfig} />;
    case 'whatsapp_floating_bar':
      return <WhatsAppBarSection settings={section.settings} themeConfig={themeConfig} />;
    default:
      return null;
  }
}

