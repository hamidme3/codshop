'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Store, Phone, Zap, Clock } from 'lucide-react';
import { ThemeId } from '@/lib/themes';

export default function RegisterStorePage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [niche, setNiche] = useState<'fashion' | 'beauty' | 'tech' | 'general'>('fashion');
  const [themeId, setThemeId] = useState<ThemeId>('luxury');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatedSlug = storeName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'ma-boutique';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !whatsapp.trim()) {
      setError('Veuillez remplir le nom de la boutique et votre numéro WhatsApp.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stores/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: storeName,
          slug: generatedSlug,
          whatsapp,
          city,
          niche,
          themeId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      // Redirect directly to the visual page builder for their new store
      router.push(`/admin/builder?store=${data.store.slug}&new=1`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Essai Gratuit 14 Jours — Sans Engagement
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Lancez votre boutique COD au Maroc en <span className="text-amber-400">10 secondes</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Générez des ventes par paiement à la livraison (Cash on Delivery). Page builder visuel, formulaire 1-page ultra-rapide et export CSV instantané.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Store Name & Subdomain */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
                1. Nom de votre boutique commerciale
              </label>
              <div className="relative">
                <Store className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ex: Kaftan Royal, Aroma Bio, Electro Casa..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                <span>Lien de votre boutique :</span>
                <code className="text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-mono">
                  https://{generatedSlug}.codshop.vipone.site
                </code>
              </div>
            </div>

            {/* Step 2: WhatsApp Phone & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">
                  2. Votre Numéro WhatsApp (Maroc)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0661234567 ou +212 6..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <span className="text-[11px] text-slate-500">Pour recevoir les alertes de commandes instantanées.</span>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">
                  Ville d&apos;expédition principale
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="Casablanca">Casablanca (Hub Principal)</option>
                  <option value="Rabat">Rabat / Salé</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Fes">Fès / Meknès</option>
                  <option value="Agadir">Agadir</option>
                </select>
              </div>
            </div>

            {/* Step 3: Niche & Theme Presets */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
                3. Choisissez votre style de design de départ
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setNiche('fashion');
                    setThemeId('luxury');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    themeId === 'luxury'
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-amber-400 mb-2" />
                  <div className="font-bold text-white text-sm">Luxe & Artisanal</div>
                  <div className="text-xs text-slate-400 mt-1">Robes, Cuir, Caftans & Chaussures</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNiche('beauty');
                    setThemeId('beauty');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    themeId === 'beauty'
                      ? 'border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-rose-400 mb-2" />
                  <div className="font-bold text-white text-sm">Beauté & Soins</div>
                  <div className="text-xs text-slate-400 mt-1">Huile d&apos;argan, cosmétiques, bien-être</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNiche('tech');
                    setThemeId('tech');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    themeId === 'tech'
                      ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-cyan-400 mb-2" />
                  <div className="font-bold text-white text-sm">Tech & Gadgets</div>
                  <div className="text-xs text-slate-400 mt-1">Accessoires, électronique, montres</div>
                </button>
              </div>
            </div>

            {/* Trial Guarantee Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>14 jours d&apos;essai gratuit complet.</strong> Aucune carte bancaire requise.</span>
              </div>
              <span className="text-emerald-400 font-semibold shrink-0">0 DH aujourd&apos;hui</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-4 px-6 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 min-h-[48px]"
              aria-label="Créer ma boutique COD au Maroc"
            >
              {loading ? (
                <>
                  <Zap className="w-5 h-5 animate-spin" />
                  Génération de votre boutique...
                </>
              ) : (
                <>
                  Créer ma boutique & Ouvrir le Page Builder
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Moroccan Trust Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-center text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Formulaire COD 1-page ultra-rapide</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Export CSV & Suivi des commandes</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-900/40 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vérification téléphones marocains</span>
          </div>
        </div>
      </div>
    </div>
  );
}
