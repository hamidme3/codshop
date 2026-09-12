'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, AlertCircle, Save, ExternalLink, 
  Send, Activity, ShieldCheck, Tag, ArrowRight, Zap 
} from 'lucide-react';

export default function AdsHubPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [metaPixelId, setMetaPixelId] = useState('');
  const [tiktokPixelId, setTiktokPixelId] = useState('');
  const [snapchatPixelId, setSnapchatPixelId] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleMerchantCenterId, setGoogleMerchantCenterId] = useState('');

  // Pinterest Partner Doubler
  const [pinterestPartnerId, setPinterestPartnerId] = useState('');
  const [pinterestClaimed, setPinterestClaimed] = useState(false);
  const [connectingPinterest, setConnectingPinterest] = useState(false);

  // Test event state
  const [testEventStatus, setTestEventStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ads/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.metaPixelId) setMetaPixelId(data.metaPixelId);
        if (data.tiktokPixelId) setTiktokPixelId(data.tiktokPixelId);
        if (data.snapchatPixelId) setSnapchatPixelId(data.snapchatPixelId);
        if (data.googleAnalyticsId) setGoogleAnalyticsId(data.googleAnalyticsId);
        if (data.googleMerchantCenterId) setGoogleMerchantCenterId(data.googleMerchantCenterId);
        if (data.pinterestPartnerId) setPinterestPartnerId(data.pinterestPartnerId);
        if (data.pinterestCreditClaimed) setPinterestClaimed(data.pinterestCreditClaimed);
      })
      .catch((err) => console.error('[Ads Hub] Load error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSavePixels = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/ads/pixels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metaPixelId,
          tiktokPixelId,
          snapchatPixelId,
          googleAnalyticsId,
          googleMerchantCenterId,
          pinterestPartnerId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: 'error', message: data.error || 'Erreur d enregistrement' });
        return;
      }

      setFeedback({ type: 'success', message: 'Pixels publicitaires enregistrés et synchronisés avec votre boutique !' });
    } catch {
      setFeedback({ type: 'error', message: 'Erreur réseau' });
    } finally {
      setSaving(false);
    }
  };

  const handleConnectPinterest = async () => {
    if (!pinterestPartnerId) return;
    setConnectingPinterest(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/ads/pinterest/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinterestPartnerId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: 'error', message: data.error || 'Erreur de connexion Pinterest' });
        return;
      }

      setPinterestClaimed(true);
      setFeedback({ type: 'success', message: data.message });
    } catch {
      setFeedback({ type: 'error', message: 'Erreur réseau' });
    } finally {
      setConnectingPinterest(false);
    }
  };

  const handleSendTestPurchase = async () => {
    setTestEventStatus('Envoi de l événement test Purchase (349 DH)...');
    try {
      const res = await fetch('/api/tracking/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Purchase',
          value: 349,
          currency: 'MAD',
          orderId: 'CMD-TEST-8491',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestEventStatus('Événement Purchase 349 DH validé avec succès (CAPI simulé) ✓');
        setTimeout(() => setTestEventStatus(null), 4000);
      }
    } catch {
      setTestEventStatus('Échec de la simulation.');
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xs text-slate-500 font-sans">
        Chargement du gestionnaire de pixels...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto font-sans">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Pixels Publicitaires & Partenaires Ads
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Suivez précisément vos conversions COD et synchronisez vos catalogues sur Meta, TikTok, Pinterest et Google.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.message}
        </div>
      )}

      {/* Hero Partner Banner: Pinterest Credit Doubler (YouCan Parity) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-900 border border-red-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
                Offre Partenaire Officiel
              </span>
              <span className="text-xs font-bold text-slate-400">Pinterest Ads</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Doublez votre crédit publicitaire Pinterest Ads !
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ajoutez l identifiant partenaire CODShop dans votre Business Manager Pinterest. Dès validation (sous 72h), votre premier budget publicitaire sera doublé pour lancer vos campagnes au Maroc.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shrink-0 w-full sm:w-80 space-y-3">
            <label className="text-[11px] font-bold text-slate-300 block">
              Identifiant Business Manager Pinterest
            </label>
            <input
              type="text"
              placeholder="Ex: 549755829104829"
              value={pinterestPartnerId}
              onChange={(e) => setPinterestPartnerId(e.target.value)}
              disabled={pinterestClaimed}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs outline-none focus:border-red-400"
            />
            <button
              type="button"
              onClick={handleConnectPinterest}
              disabled={connectingPinterest || !pinterestPartnerId || pinterestClaimed}
              className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              {pinterestClaimed ? 'Partenaire Connecté ✓' : connectingPinterest ? 'Connexion...' : 'Réclamer le double crédit'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Pixels Configuration */}
      <form onSubmit={handleSavePixels} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Meta Pixel */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                Meta Pixel (Facebook & Instagram)
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400">
              Injecte le script `fbq` pour tracker automatiquement les ajouts au panier et les commandes COD en Dirhams (MAD).
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Pixel ID (15-16 chiffres)</label>
              <input
                type="text"
                placeholder="Ex: 1386256236443220"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Card 2: TikTok Pixel */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-teal-400">
                TikTok Pixel
              </span>
              <span className="w-2 h-2 rounded-full bg-teal-400" />
            </div>
            <p className="text-xs text-slate-400">
              Permet de créer des audiences personnalisées et d optimiser le ROAS sur TikTok Ads au Maroc.
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">TikTok Pixel Code</label>
              <input
                type="text"
                placeholder="Ex: C8K92L81938"
                value={tiktokPixelId}
                onChange={(e) => setTiktokPixelId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Card 3: Snapchat Pixel */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                Snapchat Pixel
              </span>
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
            </div>
            <p className="text-xs text-slate-400">
              Essentiel pour les campagnes e-commerce orientées Stories & Discover sur le marché marocain.
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Snap Pixel ID</label>
              <input
                type="text"
                placeholder="Ex: snap-9482-1048-29"
                value={snapchatPixelId}
                onChange={(e) => setSnapchatPixelId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Card 4: Google Analytics 4 */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Google Analytics 4 & Ads
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <p className="text-xs text-slate-400">
              Mesurez le trafic de votre boutique et synchronisez vos produits avec Google Merchant Center.
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Measurement ID</label>
              <input
                type="text"
                placeholder="Ex: G-LN3S0WSM3B"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleSendTestPurchase}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span>Tester un événement d achat test (349 DH)</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-500/10"
          >
            {saving ? 'Enregistrement...' : (
              <><Save className="w-4 h-4" /> Enregistrer les pixels</>
            )}
          </button>
        </div>

        {testEventStatus && (
          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-400 text-xs font-mono">
            {testEventStatus}
          </div>
        )}
      </form>
    </div>
  );
}
