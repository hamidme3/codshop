'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Truck, Check, MapPin, Settings, Clock, ShieldCheck
} from 'lucide-react';

function LogisticsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [freeShippingThreshold, setFreeShippingThreshold] = useState(400);
  const [casaFee, setCasaFee] = useState(20);
  const [rabatFee, setRabatFee] = useState(25);
  const [otherCitiesFee, setOtherCitiesFee] = useState(30);
  const [deliveryTimeframe, setDeliveryTimeframe] = useState('24h à 48h');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Truck className="w-8 h-8 text-emerald-400" /> Frais de Livraison & Villes
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Configurez les tarifs de livraison facturés à vos clients sur le bon de commande et le seuil de livraison offerte.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
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
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {saved ? <Check className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          {saved ? 'Tarifs Enregistrés avec Succès !' : 'Enregistrer les Frais de Livraison'}
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
