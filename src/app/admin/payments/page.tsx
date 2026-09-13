'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CreditCard, Check, ShieldCheck, Wallet, 
  Building2, Banknote, Settings, AlertCircle 
} from 'lucide-react';
import { getPaymentGateways, togglePaymentGateway, PaymentGateway } from '@/lib/backoffice';

function PaymentsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [gateways, setGateways] = useState<PaymentGateway[]>(getPaymentGateways());
  const [editingGw, setEditingGw] = useState<PaymentGateway | null>(null);

  const handleToggle = (id: string) => {
    togglePaymentGateway(id);
    setGateways([...getPaymentGateways()]);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-emerald-400" /> Passerelles & Méthodes de Paiement
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Activez et configurez le paiement en espèces à la livraison, les virements bancaires et le paiement en ligne par carte CMI.
        </p>
      </div>

      {/* Moroccan Payment Culture Alert */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Recommandation Maroc :</strong> Plus de 95% des transactions e-commerce au Maroc se font par <strong>Paiement à la livraison (Cash on Delivery)</strong>. Nous vous recommandons de toujours laisser le COD activé pour maximiser vos conversions publicitaires.
        </div>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gateways.map((gw) => {
          const isActive = gw.active;

          return (
            <div
              key={gw.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 ${
                isActive
                  ? 'bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-900/50 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    gw.type === 'cod' ? 'bg-emerald-500/10 text-emerald-400' :
                    gw.type === 'virement' ? 'bg-sky-500/10 text-sky-400' :
                    gw.type === 'card' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                  }`}>
                    {gw.type === 'cod' && <Banknote className="w-5 h-5" />}
                    {gw.type === 'virement' && <Building2 className="w-5 h-5" />}
                    {gw.type === 'card' && <CreditCard className="w-5 h-5" />}
                    {gw.type === 'wallet' && <Wallet className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{gw.name}</h3>
                    <div className="text-[11px] text-slate-400">{gw.feeInfo}</div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{gw.description}</p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setEditingGw(gw)}
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" /> Réglages
                </button>

                <button
                  type="button"
                  onClick={() => handleToggle(gw.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                  }`}
                >
                  {isActive ? 'Désactiver' : 'Activer'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Settings Modal */}
      {editingGw && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Réglages : {editingGw.name}</h3>
              <button onClick={() => setEditingGw(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              {editingGw.type === 'virement' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom de la Banque :</label>
                    <input
                      type="text"
                      defaultValue="Attijariwafa Bank"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">RIB Bancaire (24 chiffres) :</label>
                    <input
                      type="text"
                      defaultValue="007 780 0001234567890123 45"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                </>
              )}

              {editingGw.type === 'card' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Clé Publique Stripe (Publishable Key) :</label>
                    <input
                      type="text"
                      placeholder="pk_live_..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Clé Secrète Stripe (Secret Key) :</label>
                    <input
                      type="password"
                      placeholder="sk_live_..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                </>
              )}

              {editingGw.type === 'cod' && (
                <p className="text-slate-400">
                  Le paiement à la livraison ne requiert aucune clé API. Vos livreurs Ozon Express ou SendIt collectent le montant directement auprès du client.
                </p>
              )}

              {editingGw.type === 'wallet' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Client PayPal :</label>
                  <input
                    type="email"
                    placeholder="paypal@votre-boutique.ma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Réglages de paiement sauvegardés !');
                  setEditingGw(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setEditingGw(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement des passerelles...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}
