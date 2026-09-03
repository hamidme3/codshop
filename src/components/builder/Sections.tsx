'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Truck, Award, Clock, Flame, 
  Star, ChevronDown, MessageCircle, Check, ArrowRight,
  PackageCheck
} from 'lucide-react';
import { MOROCCAN_CITIES } from '@/lib/moroccanCities';

// 1. HERO BANNER SECTION
export function HeroSection({ settings }: { settings: any }) {
  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800">
      {settings.bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: `url(${settings.bgImage})` }}
        />
      )}
      <div className="relative max-w-3xl mx-auto space-y-4">
        {settings.badgeText && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {settings.badgeText}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {settings.headline || 'Titre de votre produit ou collection'}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          {settings.subheadline || 'Sous-titre descriptif pour séduire vos visiteurs.'}
        </p>
        <div className="pt-4">
          <a
            href="#cod-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-full shadow-lg shadow-amber-500/20 text-sm sm:text-base transition-transform hover:scale-105"
          >
            {settings.ctaText || 'Commander — Paiement à la Livraison'}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// 2. FEATURES & MOROCCAN TRUST BADGES
export function FeaturesGridSection({ settings }: { settings: any }) {
  const badges = settings.badges || [
    { title: 'Paiement à la Livraison', subtitle: 'Payez en espèces après inspection' },
    { title: 'Livraison Express 24/48h', subtitle: 'Partout au Maroc (Casablanca, Rabat...)' },
    { title: 'Qualité 100% Garantie', subtitle: 'Satisfait ou remboursé' },
  ];

  return (
    <section className="py-10 px-4 bg-slate-950 border-b border-slate-800">
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {badges.map((b: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              {i === 0 ? <ShieldCheck className="w-5 h-5" /> : i === 1 ? <Truck className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-white text-xs sm:text-sm">{b.title}</div>
              <div className="text-[11px] text-slate-400">{b.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// 3. URGENCY & STOCK COUNTDOWN
export function UrgencyTimerSection({ settings }: { settings: any }) {
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

  return (
    <section className="py-6 px-4 bg-amber-500/10 border-y border-amber-500/20 text-amber-300">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <div className="font-extrabold text-sm sm:text-base text-white">
              {settings.title || 'Offre Spéciale — Stock Très Limité'}
            </div>
            <div className="text-xs text-amber-400">
              Plus que <strong>{settings.stockRemaining || 14} articles</strong> disponibles à ce tarif !
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono font-bold text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-amber-500/30 text-white">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
          <span className="text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    </section>
  );
}

// 4. 1-STEP MOROCCAN COD CHECKOUT BLOCK
export function CodCheckoutSection({ settings }: { settings: any }) {
  const [selectedPack, setSelectedPack] = useState<'single' | 'duo' | 'trio'>('duo');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const basePrice = settings.price || 349;
  const duoDiscount = settings.packDuoDiscount || 100;
  const trioDiscount = settings.packTrioDiscount || 200;

  const getPackTotal = () => {
    if (selectedPack === 'single') return basePrice;
    if (selectedPack === 'duo') return basePrice * 2 - duoDiscount;
    return basePrice * 3 - trioDiscount;
  };

  const shippingFee = city === 'Casablanca' ? 20 : city === 'Rabat' ? 25 : 30;
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
      alert('Erreur lors de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div id="cod-form" className="py-12 px-4 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Commande Confirmée !</h3>
        <p className="text-slate-300 text-sm mb-4">
          Merci <strong>{fullName}</strong>. Notre agent va vous appeler au <strong>{phone}</strong> dans les prochaines minutes pour confirmation.
        </p>
        <span className="text-xs text-amber-400 font-semibold">Paiement : {total} DH à la livraison à {city}.</span>
      </div>
    );
  }

  return (
    <section id="cod-form" className="py-12 px-4 bg-slate-950">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Formulaire de Commande Express</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {settings.productTitle || 'Commandez Votre Article'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Remplissez les informations ci-dessous. Paiement en espèces à la livraison.</p>
        </div>

        <form onSubmit={handleOrder} className="space-y-5">
          {/* Pack Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase">Choisissez votre pack :</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPack('single')}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  selectedPack === 'single' ? 'border-amber-500 bg-amber-500/10 text-white font-bold' : 'border-slate-800 text-slate-400'
                }`}
              >
                <div>1 Article</div>
                <div className="text-amber-400 font-extrabold mt-0.5">{basePrice} DH</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPack('duo')}
                className={`p-2.5 rounded-xl border text-center text-xs relative transition-all ${
                  selectedPack === 'duo' ? 'border-amber-500 bg-amber-500/10 text-white font-bold shadow-md shadow-amber-500/10' : 'border-slate-800 text-slate-400'
                }`}
              >
                <span className="absolute -top-2 right-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                  Top Vente
                </span>
                <div>Pack Duo (2)</div>
                <div className="text-amber-400 font-extrabold mt-0.5">{basePrice * 2 - duoDiscount} DH</div>
                <div className="text-[10px] text-emerald-400">-100 DH</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPack('trio')}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  selectedPack === 'trio' ? 'border-amber-500 bg-amber-500/10 text-white font-bold' : 'border-slate-800 text-slate-400'
                }`}
              >
                <div>Pack Trio (3)</div>
                <div className="text-amber-400 font-extrabold mt-0.5">{basePrice * 3 - trioDiscount} DH</div>
                <div className="text-[10px] text-emerald-400">-200 DH</div>
              </button>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nom Complet :</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Fatima Zahra El Amrani"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Moroccan Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Numéro de Téléphone (Maroc) :</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0661234567"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* City Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ville :</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Casablanca">Casablanca (20 DH)</option>
                <option value="Rabat">Rabat (25 DH)</option>
                <option value="Marrakech">Marrakech (30 DH)</option>
                <option value="Tanger">Tanger (30 DH)</option>
                <option value="Fes">Fès (30 DH)</option>
                <option value="Agadir">Agadir (30 DH)</option>
                <option value="Autre ville">Autre Ville (35 DH)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Adresse ou Quartier :</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Maarif, Rue 12"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Total Calculation */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total à payer à la livraison :</span>
            <span className="text-base font-extrabold text-amber-400">{total} DH</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-amber-500/20 text-sm uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {submitting ? 'Validation...' : 'Confirmer Ma Commande (Payer au livreur)'}
          </button>
        </form>
      </div>
    </section>
  );
}

// 5. TESTIMONIALS & REVIEWS SECTION
export function ReviewsSection({ settings }: { settings: any }) {
  const reviews = settings.reviews || [];
  return (
    <section className="py-12 px-4 bg-slate-900 border-t border-slate-800 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          {settings.title || 'Avis de nos clients marocains'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {reviews.map((r: any, i: number) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic">&ldquo;{r.comment}&rdquo;</p>
              <div className="text-[11px] font-bold text-white">{r.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. FAQ ACCORDION
export function FaqSection({ settings }: { settings: any }) {
  const faqs = settings.faqs || [];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-12 px-4 bg-slate-950 border-t border-slate-800">
      <div className="max-w-2xl mx-auto space-y-3">
        <h2 className="text-xl font-bold text-white text-center mb-6">Questions Fréquentes</h2>
        {faqs.map((f: any, i: number) => (
          <div key={i} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full p-4 text-left text-xs sm:text-sm font-semibold text-white flex items-center justify-between"
            >
              <span>{f.q}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${openIdx === i ? 'rotate-180 text-amber-400' : 'text-slate-400'}`} />
            </button>
            {openIdx === i && (
              <div className="px-4 pb-4 text-xs text-slate-300 border-t border-slate-800/50 pt-2">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// 7. FLOATING WHATSAPP BUTTON
export function WhatsAppBarSection({ settings }: { settings: any }) {
  const phone = settings.phone || '+212661000000';
  const message = encodeURIComponent(settings.message || 'Salam, bghit ncommander');

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-emerald-600/50 text-xs sm:text-sm transition-transform hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span>Commander via WhatsApp</span>
      </a>
    </aside>
  );
}

// MASTER DYNAMIC SECTION RENDERER
export function DynamicSectionRenderer({ section }: { section: any }) {
  if (section.hidden) return null;

  switch (section.type) {
    case 'hero_banner':
      return <HeroSection settings={section.settings} />;
    case 'features_grid':
      return <FeaturesGridSection settings={section.settings} />;
    case 'urgency_timer':
      return <UrgencyTimerSection settings={section.settings} />;
    case 'cod_checkout':
      return <CodCheckoutSection settings={section.settings} />;
    case 'testimonials_carousel':
      return <ReviewsSection settings={section.settings} />;
    case 'faq_accordion':
      return <FaqSection settings={section.settings} />;
    case 'whatsapp_floating_bar':
      return <WhatsAppBarSection settings={section.settings} />;
    default:
      return null;
  }
}
