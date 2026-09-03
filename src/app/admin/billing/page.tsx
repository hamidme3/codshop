'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Check, Clock, ShieldCheck, ArrowLeft, 
  CreditCard, Building2, Zap, ArrowRight, Sparkles 
} from 'lucide-react';

function BillingContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'scale'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'virement'>('card');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubscribe = () => {
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/admin/builder?store=${storeSlug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au Page Builder ({storeSlug})
          </Link>
          <div className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Boutique : {storeSlug}.codshop.site
          </div>
        </div>

        {/* Trial Status Header */}
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Essai Gratuit Actif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Il vous reste <span className="text-amber-400">14 jours</span> d&apos;essai gratuit
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
              Toutes les fonctionnalités Pro sont débloquées. Choisissez votre forfait dès maintenant pour assurer la continuité de vos ventes sans interruption.
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <div className="text-xs text-slate-400">Prochaine facturation :</div>
            <div className="text-lg font-bold text-white">Dans 14 jours</div>
            <div className="text-[11px] text-emerald-400 font-semibold">0 DH prélevé aujourd&apos;hui</div>
          </div>
        </div>

        {confirmed ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Abonnement Activé avec Succès !</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Votre formule <strong>{selectedPlan.toUpperCase()}</strong> a été enregistrée. Votre boutique reste active avec le Page Builder complet et l&apos;expédition automatique.
            </p>
            <Link
              href={`/admin/builder?store=${storeSlug}`}
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm hover:bg-amber-400 transition-colors"
            >
              Retourner à ma boutique <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Pricing Tiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Starter */}
              <div
                onClick={() => setSelectedPlan('starter')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'starter'
                    ? 'border-amber-500 bg-slate-900 shadow-xl shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">199</span>
                  <span className="text-xs text-slate-400">DH / mois</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Pour lancer un premier produit en COD.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1 Boutique en ligne</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Formulaire COD 1-page</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 3 Thèmes standards</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Jusqu&apos;à 100 commandes/mois</li>
                </ul>
              </div>

              {/* Pro (Popular) */}
              <div
                onClick={() => setSelectedPlan('pro')}
                className={`p-6 rounded-2xl border relative cursor-pointer transition-all ${
                  selectedPlan === 'pro'
                    ? 'border-amber-500 bg-slate-900 shadow-xl shadow-amber-500/20 ring-1 ring-amber-500'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" /> Le Plus Populaire
                </div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Vendeur Pro</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">399</span>
                  <span className="text-xs text-slate-400">DH / mois</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Pour scaler vos campagnes TikTok & Facebook.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-semibold text-white"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Page Builder Visuel Complet</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Blocs Urgence & Vidéos Avis</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Expédition Ozon Express & SendIt</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Jusqu&apos;à 1 000 commandes/mois</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Nom de domaine personnalisé (.ma)</li>
                </ul>
              </div>

              {/* Scale */}
              <div
                onClick={() => setSelectedPlan('scale')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'scale'
                    ? 'border-amber-500 bg-slate-900 shadow-xl shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scale & Équipe</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">799</span>
                  <span className="text-xs text-slate-400">DH / mois</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Pour marques et équipes de confirmation.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Commandes illimitées</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Fast Dialer pour centre d&apos;appels</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Bot WhatsApp de confirmation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 0% de commission sur vos ventes</li>
                </ul>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Mode de paiement au Maroc :</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">Carte Bancaire Marocaine / CMI</div>
                    <div className="text-[11px] text-slate-400">Attijari, BCP, CIH, BMCE... Débit après 14 jours</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('virement')}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${
                    paymentMethod === 'virement'
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">Virement Bancaire / Cash Plus / Wafacash</div>
                    <div className="text-[11px] text-slate-400">Paiement manuel en agence ou application</div>
                  </div>
                </button>
              </div>

              {paymentMethod === 'virement' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                  <div className="text-amber-400 font-bold">RIB Bancaire pour Virement :</div>
                  <div>Banque : Attijariwafa Bank</div>
                  <div>Titulaire : CODSHOP MAROC SARL</div>
                  <div>RIB : 007 780 0001234567890123 45</div>
                </div>
              )}
            </div>

            {/* Subscribe Action */}
            <button
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-4 px-6 rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 text-sm uppercase tracking-wider transition-all hover:scale-[1.01]"
            >
              <Zap className="w-5 h-5" />
              Confirmer l&apos;Abonnement {selectedPlan.toUpperCase()} (0 DH aujourd&apos;hui — Début après l&apos;essai)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Chargement...</div>}>
      <BillingContent />
    </Suspense>
  );
}
