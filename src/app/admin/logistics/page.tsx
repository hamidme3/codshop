'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Truck, Check, ShieldCheck, Zap, 
  MapPin, Settings, RefreshCw, ArrowRight 
} from 'lucide-react';

function LogisticsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [ozonApiKey, setOzonApiKey] = useState('ozon_live_891823910283');
  const [ozonAutoDispatch, setOzonAutoDispatch] = useState(true);
  const [sendItApiKey, setSendItApiKey] = useState('');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(400);
  const [casaFee, setCasaFee] = useState(20);
  const [rabatFee, setRabatFee] = useState(25);
  const [otherCitiesFee, setOtherCitiesFee] = useState(30);
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
          <Truck className="w-8 h-8 text-amber-400" /> Intégration Transporteurs & Villes
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Connectez vos comptes Ozon Express & SendIt pour l&apos;expédition en 1 clic et la génération des étiquettes codes-barres A6.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Ozon Express Integration Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black">
                OZ
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Ozon Express Maroc</h2>
                <p className="text-xs text-slate-400">Livraison 24h Casablanca & 48h National</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Check className="w-3 h-3" /> Connecté
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Clé API Ozon Express :</label>
              <input
                type="password"
                value={ozonApiKey}
                onChange={(e) => setOzonApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="font-bold text-white text-xs">Auto-Dispatch Automatique</div>
                <div className="text-[11px] text-slate-400">
                  Créer automatiquement le colis sur Ozon dès qu&apos;une commande passe à &ldquo;Confirmée&rdquo;.
                </div>
              </div>
              <input
                type="checkbox"
                checked={ozonAutoDispatch}
                onChange={(e) => setOzonAutoDispatch(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SendIt Integration Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black">
                SI
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">SendIt Express Maroc</h2>
                <p className="text-xs text-slate-400">Transporteur alternatif avec ramassage quotidien</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
              Inactif
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Clé API SendIt :</label>
              <input
                type="text"
                value={sendItApiKey}
                onChange={(e) => setSendItApiKey(e.target.value)}
                placeholder="sendit_sec_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Moroccan City Shipping Fees Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-extrabold text-white">Frais de Livraison Facturés aux Clients</h2>
            </div>
            <div className="text-xs text-slate-400">Calcul automatique sur le bon de commande</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Casablanca (DH) :</label>
              <input
                type="number"
                value={casaFee}
                onChange={(e) => setCasaFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rabat & Région (DH) :</label>
              <input
                type="number"
                value={rabatFee}
                onChange={(e) => setRabatFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Autres Villes Maroc (DH) :</label>
              <input
                type="number"
                value={otherCitiesFee}
                onChange={(e) => setOtherCitiesFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Seuil Livraison Gratuite (DH) :
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-48 bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold text-xs"
              />
              <span className="text-xs text-slate-400">
                Toute commande supérieure à ce montant bénéficie de la livraison offerte (0 DH).
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-4 px-6 rounded-xl shadow-xl shadow-amber-500/20 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          {saved ? <Check className="w-5 h-5 text-emerald-950" /> : <Settings className="w-5 h-5" />}
          {saved ? 'Paramètres Enregistrés !' : 'Enregistrer la Configuration Logistique'}
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
