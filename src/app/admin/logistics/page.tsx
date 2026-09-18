'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Truck, Check, MapPin, Settings, Clock, ShieldCheck,
  Mail, EyeOff, Sparkles, HelpCircle, AlertCircle, Loader2
} from 'lucide-react';

function LogisticsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(400);
  const [casaFee, setCasaFee] = useState(20);
  const [rabatFee, setRabatFee] = useState(25);
  const [otherCitiesFee, setOtherCitiesFee] = useState(30);
  const [deliveryTimeframe, setDeliveryTimeframe] = useState('24h à 48h');
  
  // Checkout Email Field Mode state
  const [checkoutEmailMode, setCheckoutEmailMode] = useState<
    'hidden' | 'optional_collapsed' | 'optional_visible' | 'required'
  >('hidden');
  const [loadingEmailMode, setLoadingEmailMode] = useState(true);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load checkout settings on mount
  useEffect(() => {
    fetch(`/api/stores/${encodeURIComponent(storeSlug)}/checkout-settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.checkoutEmailMode) {
          setCheckoutEmailMode(data.checkoutEmailMode);
        }
      })
      .catch((err) => console.error('[Logistics Settings] Fetch error:', err))
      .finally(() => setLoadingEmailMode(false));
  }, [storeSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await fetch(`/api/stores/${encodeURIComponent(storeSlug)}/checkout-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutEmailMode }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('[Logistics Settings] Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const emailModeOptions = [
    {
      value: 'hidden' as const,
      badge: '0% Friction • Recommandé COD',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      title: 'Désactivé / Masqué',
      description: 'Le formulaire demande uniquement Nom, Téléphone et Ville. Vitesse d’achat maximale sur mobile.',
      icon: EyeOff,
    },
    {
      value: 'optional_collapsed' as const,
      badge: 'Meilleur Compromis',
      badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      title: 'Bouton Dépliable (Optionnel)',
      description: 'Affiche un lien discret "+ Ajouter une adresse e-mail pour le suivi" qui s’ouvre au clic.',
      icon: Sparkles,
    },
    {
      value: 'optional_visible' as const,
      badge: 'Capture Standard',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      title: 'Toujours Visible (Optionnel)',
      description: 'Le champ e-mail est affiché en clair avec la mention "(Optionnel)". Ne bloque pas la commande.',
      icon: Mail,
    },
    {
      value: 'required' as const,
      badge: 'Obligatoire',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      title: 'Obligatoire (*)',
      description: 'L’acheteur doit obligatoirement renseigner un e-mail valide pour soumettre sa commande.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Truck className="w-8 h-8 text-emerald-400" /> Paramètres Livraison & Formulaire COD
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Configurez les tarifs de livraison, le seuil de gratuité et le comportement du champ e-mail sur le formulaire de commande.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── NEW: CHECKOUT EMAIL FIELD CONTROLLER ── */}
        <div className="bg-[#13171c] border border-slate-800/70 bento-card rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-extrabold text-white">Champ Adresse E-mail (Formulaire de Commande)</h2>
            </div>
            <span className="text-xs text-zinc-400">Contrôle du formulaire acheteur</span>
          </div>

          <p className="text-xs text-zinc-400">
            Définissez comment le champ adresse e-mail doit apparaître aux visiteurs lors de la validation de commande.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {emailModeOptions.map((opt) => {
              const isSelected = checkoutEmailMode === opt.value;
              const Icon = opt.icon;

              return (
                <div
                  key={opt.value}
                  onClick={() => setCheckoutEmailMode(opt.value)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/20 border-emerald-500/80 ring-1 ring-emerald-500/50'
                      : 'bg-[#0c0f12] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`} />
                        <span className="text-xs font-bold text-white">{opt.title}</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                      {isSelected ? '✓ Mode Actif sur la Boutique' : 'Cliquer pour sélectionner'}
                    </span>
                    <input
                      type="radio"
                      name="checkoutEmailMode"
                      checked={isSelected}
                      onChange={() => setCheckoutEmailMode(opt.value)}
                      className="accent-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City Shipping Fees Grid */}
        <div className="bg-[#13171c] border border-slate-800/70 bento-card rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-extrabold text-white">Tarifs par Zone Géographique</h2>
            </div>
            <div className="text-xs text-zinc-400">Calcul automatique lors de la commande</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
              <label className="block text-zinc-300 font-semibold">Casablanca (DH) :</label>
              <input
                type="number"
                value={casaFee}
                onChange={(e) => setCasaFee(Number(e.target.value))}
                className="w-full bg-[#13171c] border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500">Tarif intra-muros standard</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
              <label className="block text-zinc-300 font-semibold">Rabat & Région (DH) :</label>
              <input
                type="number"
                value={rabatFee}
                onChange={(e) => setRabatFee(Number(e.target.value))}
                className="w-full bg-[#13171c] border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500">Zone Rabat-Salé-Kénitra</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
              <label className="block text-zinc-300 font-semibold">Autres Villes (DH) :</label>
              <input
                type="number"
                value={otherCitiesFee}
                onChange={(e) => setOtherCitiesFee(Number(e.target.value))}
                className="w-full bg-[#13171c] border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500">Toutes les autres villes</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Threshold & Timeframe */}
        <div className="bg-[#13171c] border border-slate-800/70 bento-card rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-extrabold text-white">Livraison Gratuite & Délais</h2>
            </div>
            <div className="text-xs text-zinc-400">Règles d&apos;affichage panier & checkout</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
              <label className="block text-zinc-300 font-semibold">Seuil Livraison Offerte (DH) :</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full bg-[#13171c] border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500">Toute commande &ge; à ce montant a les frais offerts (0 DH)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0c0f12] border border-slate-800/80 space-y-1.5">
              <label className="block text-zinc-300 font-semibold">Délai Estimé de Livraison :</label>
              <input
                type="text"
                value={deliveryTimeframe}
                onChange={(e) => setDeliveryTimeframe(e.target.value)}
                placeholder="Ex: 24h à 48h"
                className="w-full bg-[#13171c] border border-slate-800 rounded-lg p-2.5 text-white font-medium focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-[10px] text-zinc-500">Mention affichée sur le formulaire de commande</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-black py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enregistrement en cours...</span>
            </>
          ) : saved ? (
            <>
              <Check className="w-5 h-5" />
              <span>Paramètres Enregistrés avec Succès !</span>
            </>
          ) : (
            <>
              <Settings className="w-5 h-5" />
              <span>Enregistrer les Paramètres du Checkout</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function LogisticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement des paramètres...</div>}>
      <LogisticsContent />
    </Suspense>
  );
}
