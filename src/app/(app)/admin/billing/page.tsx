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

  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'growth' | 'scale'>('growth');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'virement'>('card');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubscribe = () => {
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-[var(--admin-bg-base)] text-[var(--admin-text-primary)] font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/admin/builder?store=${storeSlug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au Page Builder ({storeSlug})
          </Link>
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Boutique : {storeSlug}.codshop.vipone.site
          </div>
        </div>

        {/* Trial Status Header */}
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">
              <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Essai Gratuit Actif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Il vous reste <span className="text-emerald-600 dark:text-emerald-400">14 jours</span> d&apos;essai gratuit
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-lg">
              Toutes les fonctionnalités Pro sont débloquées. Choisissez votre forfait dès maintenant pour assurer la continuité de vos ventes sans interruption.
            </p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <div className="text-xs text-slate-500 dark:text-slate-400">Prochaine facturation :</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">Dans 14 jours</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">0 DH prélevé aujourd&apos;hui</div>
          </div>
        </div>

        {confirmed ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Abonnement Activé avec Succès !</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
              Votre formule <strong>{selectedPlan.toUpperCase()}</strong> a été enregistrée. Votre boutique reste active avec le Page Builder complet et l&apos;expédition automatique.
            </p>
            <Link
              href={`/admin/builder?store=${storeSlug}`}
              className="inline-flex items-center gap-2 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold px-6 py-3 rounded-xl text-sm hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
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
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Starter</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">199</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">DH / mois</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Pour lancer un premier produit en COD.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> 1 Boutique en ligne</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Formulaire COD 1-page</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> 3 Thèmes standards</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Jusqu&apos;à 100 commandes/mois</li>
                </ul>
              </div>

              {/* Growth (Most Popular) */}
              <div
                onClick={() => setSelectedPlan('growth')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all relative ${
                  selectedPlan === 'growth'
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Zap className="w-3 h-3 fill-current" /> Le Plus Populaire
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Growth</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">399</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">DH / mois</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Pour scaler vos ventes COD au Maroc.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> 3 Boutiques en ligne</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> 25 Thèmes Premium Débloqués</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Visual Page Builder Complet</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Tous les Pixels (TikTok, Meta, Snap)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Manifestes Transporteurs 1-Clic</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Commandes illimitées</li>
                </ul>
              </div>

              {/* Scale / Enterprise */}
              <div
                onClick={() => setSelectedPlan('scale')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan === 'scale'
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-md ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scale</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">799</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">DH / mois</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Pour marques établies & équipes média.</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> 10 Boutiques en ligne</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Domaines personnalisés illimités</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Accès Multi-Utilisateurs / Équipe</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Intégration API Transporteurs Directe</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Support Dédié WhatsApp 7j/7</li>
                </ul>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mode de paiement au Maroc :</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">Carte Bancaire Marocaine / CMI</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Attijari, BCP, CIH, BMCE... Débit après 14 jours</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('virement')}
                  className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                    paymentMethod === 'virement'
                      ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs">Virement Bancaire / Cash Plus / Wafacash</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Paiement manuel en agence ou application</div>
                  </div>
                </button>
              </div>

              {paymentMethod === 'virement' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">RIB Bancaire pour Virement :</div>
                  <div>Banque : Attijariwafa Bank</div>
                  <div>Titulaire : CODSHOP MAROC SARL</div>
                  <div>RIB : 007 780 0001234567890123 45</div>
                </div>
              )}
            </div>

            {/* Subscribe Action */}
            <button
              onClick={handleSubscribe}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 text-sm uppercase tracking-wider transition-all hover:scale-[1.01] cursor-pointer"
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
