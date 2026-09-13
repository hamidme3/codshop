'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/navigation';
import { 
  Globe, Truck, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, 
  Smartphone, MessageCircle, DollarSign, Package, BarChart3, Layers, 
  Store, Users, Check, ExternalLink, Zap, ChevronRight, Star, Percent, 
  TrendingUp, RefreshCw, ShoppingBag, Award, ArrowUpRight, Play
} from 'lucide-react';
import { THEME_LIST, ThemeConfig } from '@/lib/themes';

// Universal Markets Supported
interface MarketHub {
  id: string;
  country: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  dialCode: string;
  phoneExample: string;
  popularHub: string;
  carriers: string[];
  inspectionCopy: string;
  inspectionCopyAr: string;
  headline: string;
  heroSub: string;
}

const GLOBAL_MARKETS: MarketHub[] = [
  {
    id: 'MA',
    country: 'Maroc',
    flag: '🇲🇦',
    currency: 'MAD',
    currencySymbol: 'DH',
    dialCode: '+212',
    phoneExample: '06 61 23 45 67',
    popularHub: 'Casablanca (24h Express)',
    carriers: ['Ozon Express', 'SendIt', 'Cathedis', 'Amana Poste Maroc'],
    inspectionCopy: 'Vérifiez votre colis avant de payer',
    inspectionCopyAr: 'عاين سلعتك قبل ما تخلص',
    headline: 'E-commerce COD #1 au Maroc',
    heroSub: 'Couvre Casablanca, Rabat, Marrakech et 16 régions avec expédition multi-transporteurs.',
  },
  {
    id: 'SA',
    country: 'Arabie Saoudite',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'SAR',
    dialCode: '+966',
    phoneExample: '050 123 4567',
    popularHub: 'Riyadh Hub (Same-Day / 24h)',
    carriers: ['SMSA Express', 'Aramex GCC', 'J&T Express', 'Careem Box'],
    inspectionCopy: 'الدفع عند الاستلام مع فحص الطلب',
    inspectionCopyAr: 'افحص طلبك بالكامل قبل تسليم المبلغ للمندوب',
    headline: 'الدفع عند الاستلام في المملكة العربية السعودية',
    heroSub: 'Scalable COD across Riyadh, Jeddah, Dammam & Mecca with automatic SMSA & Aramex manifests.',
  },
  {
    id: 'AE',
    country: 'Émirats Arabes Unis',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    dialCode: '+971',
    phoneExample: '050 123 4567',
    popularHub: 'Dubai Logistics City (4h-24h)',
    carriers: ['Aramex UAE', 'Fetchr', 'Careem Express', 'Emirates Post'],
    inspectionCopy: 'Cash on Delivery with Inspection Guarantee',
    inspectionCopyAr: 'الدفع عند الاستلام مع ضمان المعاينة الفورية',
    headline: 'High-Velocity COD in Dubai & UAE',
    heroSub: 'Ultra-fast delivery routing across 7 Emirates with zero card barrier.',
  },
  {
    id: 'KW',
    country: 'Koweït & GCC',
    flag: '🇰🇼',
    currency: 'KWD',
    currencySymbol: 'KWD',
    dialCode: '+965',
    phoneExample: '51 23 45 67',
    popularHub: 'Kuwait City Hub',
    carriers: ['Aramex GCC', 'Posta Plus', 'DHL Global COD'],
    inspectionCopy: 'Cash on Delivery - Pay upon Handover',
    inspectionCopyAr: 'الدفع عند الاستلام في جميع محافظات الكويت',
    headline: 'GCC High-AOV Cash on Delivery',
    heroSub: 'Unlock high basket values in Kuwait, Qatar, Bahrain & Oman with 1-tap ordering.',
  },
  {
    id: 'EG',
    country: 'Égypte',
    flag: '🇪🇬',
    currency: 'EGP',
    currencySymbol: 'EGP',
    dialCode: '+20',
    phoneExample: '010 1234 5678',
    popularHub: 'Cairo & Giza Mega-Hub',
    carriers: ['Bosta', 'Aramex Egypt', 'Mylerz', 'Egypt Post'],
    inspectionCopy: 'معاينة مجانية للشحنة قبل الدفع',
    inspectionCopyAr: 'افتح العلبة وافحص المنتج قبل ما تدفع أي مليم',
    headline: 'High-Volume COD in Egypt',
    heroSub: 'Massive consumer base in Cairo, Alexandria & Delta with native WhatsApp order confirmations.',
  },
  {
    id: 'EU',
    country: 'Europe & International',
    flag: '🇪🇺',
    currency: 'EUR',
    currencySymbol: '€',
    dialCode: '+34',
    phoneExample: '612 34 56 78',
    popularHub: 'Madrid / Rome / Paris Hubs',
    carriers: ['DHL Express COD', 'Correos Express', 'Mondial Relay', 'GLS Contra Reembolso'],
    inspectionCopy: 'Pago Contra Reembolso / Contanti alla consegna',
    inspectionCopyAr: 'Paiement à la livraison universel pour marchés européens',
    headline: 'Cash on Delivery in Southern & Eastern Europe',
    heroSub: 'Scale COD in Spain, Italy, Portugal, Romania & Greece where cash payments represent >40% of sales.',
  },
];

export function UniversalLandingPage() {
  const [selectedMarketId, setSelectedMarketId] = useState<string>('MA');
  const [selectedThemeCategory, setSelectedThemeCategory] = useState<string>('all');

  // Unit Economics Live Simulator State
  const [calcSellingPrice, setCalcSellingPrice] = useState<number>(299);
  const [calcCogs, setCalcCogs] = useState<number>(90);
  const [calcDeliveryFee, setCalcDeliveryFee] = useState<number>(35);
  const [calcReturnRate, setCalcReturnRate] = useState<number>(15);
  const [calcReturnFee, setCalcReturnFee] = useState<number>(20);

  const activeMarket = useMemo(() => {
    return GLOBAL_MARKETS.find((m) => m.id === selectedMarketId) || GLOBAL_MARKETS[0];
  }, [selectedMarketId]);

  // Unit Economics Calculations
  const calculatedEconomics = useMemo(() => {
    const grossMargin = calcSellingPrice - calcCogs;
    const deliveredRate = 1 - (calcReturnRate / 100);
    const returnRateDecimal = calcReturnRate / 100;
    
    // Delivered orders generate: (sellingPrice - cogs - deliveryFee)
    // Returned orders cost: (deliveryFee + returnFee) [stock restored, cogs not lost]
    const netProfitPerOrder = (deliveredRate * (grossMargin - calcDeliveryFee)) - (returnRateDecimal * (calcDeliveryFee + calcReturnFee));
    const netMarginPercent = calcSellingPrice > 0 ? (netProfitPerOrder / calcSellingPrice) * 100 : 0;
    
    // Portfolio projection on 100 orders
    const totalRevenue = 100 * deliveredRate * calcSellingPrice;
    const totalNetProfit = 100 * netProfitPerOrder;

    return {
      grossMargin,
      netProfitPerOrder: Math.round(netProfitPerOrder),
      netMarginPercent: Math.round(netMarginPercent * 10) / 10,
      totalRevenue: Math.round(totalRevenue),
      totalNetProfit: Math.round(totalNetProfit),
      isHealthy: netMarginPercent >= 25,
      isWarning: netMarginPercent >= 10 && netMarginPercent < 25,
      isDanger: netMarginPercent < 10,
    };
  }, [calcSellingPrice, calcCogs, calcDeliveryFee, calcReturnRate, calcReturnFee]);

  const filteredThemes: ThemeConfig[] = useMemo(() => {
    if (selectedThemeCategory === 'all') return THEME_LIST.slice(0, 12);
    return THEME_LIST.filter((t) => t.category === selectedThemeCategory).slice(0, 12);
  }, [selectedThemeCategory]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* ── Top Global SaaS Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-black text-lg">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">CODShop</span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Global COD SaaS
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-zinc-400">
            <a href="#markets" className="hover:text-white transition-colors">Marchés Mondiaux</a>
            <a href="#features" className="hover:text-white transition-colors">Bordereau Express</a>
            <a href="#carriers" className="hover:text-white transition-colors">Transporteurs</a>
            <a href="#themes" className="hover:text-white transition-colors">25 Thèmes</a>
            <a href="#calculator" className="hover:text-white transition-colors">Simulateur COD</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            {/* Live Demo Store Link */}
            <a
              href="https://ottavio.codshop.vipone.site"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <span>Boutique Démo Live</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            {/* Merchant Login */}
            <a
              href="/admin/login"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Connexion
            </a>

            {/* Create Store CTA */}
            <a
              href="/register-store"
              className="px-4 py-2 rounded-xl text-xs font-black text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>Créer Ma Boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero Section: The Universal COD Platform ────────────────── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Universal Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-zinc-900/90 border border-zinc-700/60 shadow-xl backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300">Plateforme E-Commerce Cash-on-Delivery Universelle</span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">MENA • GCC • Global</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Vendez Partout dans le Monde avec le{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Paiement à la Livraison
              </span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              La plateforme e-commerce multi-pays conçue pour les marchés où le cash règne. 
              Formulaires 1-tap à haute conversion, détection d’IP géographique, intégration automatique des transporteurs locaux et confirmation WhatsApp en langue locale.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <a
                href="/register-store"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Lancer Ma Boutique Gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://ottavio.codshop.vipone.site"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-bold text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>Tester la Boutique Démo (Ottavio)</span>
              </a>
            </div>

            <p className="text-[11px] font-mono text-zinc-500 pt-1">
              ✓ Aucune carte bancaire requise • 25 thèmes inclus • Prêt en 60 secondes
            </p>
          </div>

          {/* ── Interactive Market Switcher Pill Bar ──────────────────────── */}
          <div id="markets" className="mt-14 sm:mt-20">
            <div className="text-center mb-5">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                Sélectionnez un Marché Cible pour Tester la Dynamique Locale :
              </span>
            </div>

            {/* Market Tabs */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 admin-scrollbar px-2">
              {GLOBAL_MARKETS.map((market) => {
                const isActive = market.id === selectedMarketId;
                return (
                  <button
                    key={market.id}
                    onClick={() => setSelectedMarketId(market.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                      isActive
                        ? 'bg-zinc-800 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-105'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-base">{market.flag}</span>
                    <span>{market.country}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {market.currency}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Market Showcase Card */}
            <div className="mt-6 bg-[#121215] border border-zinc-800 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Market Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeMarket.flag}</span>
                    <div>
                      <h2 className="text-lg font-black text-white">{activeMarket.headline}</h2>
                      <p className="text-xs text-zinc-400">{activeMarket.heroSub}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Devise & Format</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">{activeMarket.currency} ({activeMarket.currencySymbol})</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80">
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Téléphone Local</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">{activeMarket.dialCode}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 col-span-2 sm:col-span-1">
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Hub Principal</div>
                      <div className="text-xs font-bold text-zinc-300 mt-0.5 truncate">{activeMarket.popularHub}</div>
                    </div>
                  </div>

                  {/* Trust Inspection Badge in Market Language */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-emerald-300">
                        Garantie Sérénité Locale Activée :
                      </div>
                      <div className="text-xs text-zinc-300 font-medium mt-0.5">
                        &quot;{activeMarket.inspectionCopy}&quot;
                      </div>
                      <div className="text-[11px] text-zinc-400 font-arabic mt-0.5 text-right" dir="rtl">
                        {activeMarket.inspectionCopyAr}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partner Fleet for this market */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-mono font-bold uppercase text-zinc-400 mb-2 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Transporteurs Prêts :</span>
                    </div>
                    <div className="space-y-1.5">
                      {activeMarket.carriers.map((carrier, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{carrier}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`/register-store?country=${activeMarket.id}`}
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold text-center text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                  >
                    Ouvrir en {activeMarket.country} ↗
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section 1: The Global COD Problem & Solution ─────────────── */}
      <section className="py-16 sm:py-24 bg-[#0d0d10] border-t border-b border-zinc-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              Pourquoi le Cash-on-Delivery ?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              80% des Acheteurs Refusent de Payer par Carte en Ligne
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Dans les marchés émergents du Moyen-Orient, d’Afrique du Nord et d’Europe du Sud, forcer un paiement par carte bancaire tue vos conversions. Le Cash-on-Delivery débloque l’achat immédiat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* The Classic Failure */}
            <div className="p-6 sm:p-8 rounded-2xl bg-rose-950/10 border border-rose-500/20 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                ✕
              </div>
              <h3 className="text-lg font-black text-white">Le Tunnel Classique (Shopify / WooCommerce)</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>5 étapes lentes (Panier &gt; Contact &gt; Adresse &gt; Livraison &gt; Paiement).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Demande de code postal et données inutiles en zone COD.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>68% d&apos;abandons de panier sur mobile 3G/4G.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Zéro intégration des livreurs locaux : copier-coller manuel d&apos;adresses.</span>
                </li>
              </ul>
            </div>

            {/* The CODShop Universal Engine */}
            <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                ✓
              </div>
              <h3 className="text-lg font-black text-white">La Machine CODShop Universelle</h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>1-Tap COD :</strong> Achat direct en 3 champs (Nom, Téléphone, Ville).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Bordereau Express :</strong> Rassurance visuelle type bon de livraison officiel.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Export Transporteurs 1-Clic :</strong> Manifests Excel/CSV pré-formatés pour Ozon, SendIt, Amana, SMSA, Aramex.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Confirmation WhatsApp Automatisée :</strong> En Darija, Arabe Khaliji, Français ou Anglais pour diviser les retours par deux.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: 5 Technological Pillars (Bento Grid) ─────────── */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              Architecture Enterprise B2B
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              5 Piliers Conçus pour Scaler le Cash-on-Delivery
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Tout ce dont une marque e-commerce et une équipe de media buyers ont besoin pour générer du cash-flow réel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: 1-Tap Waybill Checkout */}
            <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white">Bordereau Express : Le Formulaire COD le Plus Rapide</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Inspiré des bordereaux officiels de transporteurs avec codes-barres réactifs et sceau de garantie. 
                Permet l&apos;inspection du colis avant paiement, éliminant la méfiance des acheteurs et augmentant les conversions de <strong>+35%</strong>.
              </p>
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 flex items-center justify-between">
                <span>✓ Pack Duo (-100 DH / auto-livraison offerte)</span>
                <span className="text-emerald-400 font-bold">+28% Panier Moyen</span>
              </div>
            </div>

            {/* Bento Card 2: Edge Geo & Multi-Currency */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Moteur Multi-Pays Automatique</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Cloudflare Edge analyse l’IP du visiteur, sélectionne sa devise (MAD, SAR, AED, KWD, EUR), son indicatif téléphonique (+212, +966...) et calcule les frais de port de sa ville en direct.
              </p>
            </div>

            {/* Bento Card 3: Multi-Carrier Manifests */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Exports Manifests en 1-Clic</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Générez instantanément vos fichiers CSV pré-formatés avec encodage Excel UTF-8 BOM pour Ozon Express, SendIt, Cathedis, Amana, SMSA ou Aramex. Bon de Ramassage A4 imprimable inclus.
              </p>
            </div>

            {/* Bento Card 4: WhatsApp AI Automation */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">WhatsApp Darija & Khaliji</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Modèles de confirmation et relance en Darija marocaine, Arabe Khaliji, Français ou Anglais. Envoyez les coordonnées de livraison en 1 tap et prévenez les retours de colis.
              </p>
            </div>

            {/* Bento Card 5: Anti-Fraud & Unit Economics */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Anti-Fraude & Protection Prix</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Limiteur de spam CGNAT composite, détection des faux numéros et vérification cryptographique des prix côté serveur : aucune tentative de falsification de panier ne passe.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: 25 E-Commerce Themes Gallery ──────────────────── */}
      <section id="themes" className="py-20 bg-[#0d0d10] border-t border-b border-zinc-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Performance Visuelle
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                25 Thèmes E-Commerce Ultra-Rapides
              </h2>
              <p className="text-sm text-zinc-400 max-w-xl">
                Chaque thème est sculpté pour un temps de chargement &lt; 1 seconde sur les réseaux 3G/4G, avec typographies adaptées et conversion COD maximale.
              </p>
            </div>

            <a
              href="/admin/themes"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Explorer les 25 thèmes dans l&apos;espace vendeur</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Theme Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 admin-scrollbar">
            {[
              { id: 'all', label: 'Tous les 25 Thèmes' },
              { id: 'fashion', label: 'Mode & Luxe' },
              { id: 'beauty', label: 'Beauté & Soins' },
              { id: 'tech', label: 'High-Tech & Gadgets' },
              { id: 'lifestyle', label: 'Maison & Art de Vivre' },
              { id: 'general', label: 'Généraliste & Conversion' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedThemeCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  selectedThemeCategory === cat.id
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredThemes.map((theme) => (
              <div
                key={theme.id}
                className="group p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 space-y-3"
              >
                <div className="h-28 rounded-lg relative overflow-hidden flex items-center justify-center border border-zinc-800/80"
                  style={{ backgroundColor: theme.colors.bgPage }}
                >
                  <div className="text-center space-y-1">
                    <span className="text-xl">{theme.badge.split(' ')[0] || '✨'}</span>
                    <div className="text-xs font-bold" style={{ color: theme.colors.textPrimary }}>
                      {theme.name}
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: theme.colors.primary }} />
                    <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: theme.colors.accent }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{theme.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{theme.category}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{theme.tagline}</p>
                </div>

                <a
                  href={`https://ottavio.codshop.vipone.site?theme=${theme.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 rounded-lg text-[11px] font-bold text-center text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 block transition-colors"
                >
                  Tester ce thème ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Interactive COD Unit Economics Calculator ───── */}
      <section id="calculator" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              Rentabilité Réelle
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Simulateur de Marge Nette Unitaire COD
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              En Cash-on-Delivery, le chiffre d&apos;affaires ne veut rien dire : seule la marge nette après frais de livraison et taux de retour compte. Calculez votre vrai profit.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-[#121215] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              
              {/* Sliders Input */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-zinc-300">Prix de Vente (TTC) :</span>
                    <span className="text-emerald-400 font-mono text-sm">{calcSellingPrice} {activeMarket.currency}</span>
                  </div>
                  <input
                    type="range"
                    min="99"
                    max="1500"
                    step="10"
                    value={calcSellingPrice}
                    onChange={(e) => setCalcSellingPrice(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-zinc-300">Coût d&apos;Achat Produit (COGS) :</span>
                    <span className="text-white font-mono text-sm">{calcCogs} {activeMarket.currency}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="800"
                    step="5"
                    value={calcCogs}
                    onChange={(e) => setCalcCogs(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-zinc-300">Frais de Livraison Aller :</span>
                    <span className="text-white font-mono text-sm">{calcDeliveryFee} {activeMarket.currency}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={calcDeliveryFee}
                    onChange={(e) => setCalcDeliveryFee(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-zinc-300">Taux de Retour Estimé (RTO %) :</span>
                    <span className="text-rose-400 font-mono text-sm">{calcReturnRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="1"
                    value={calcReturnRate}
                    onChange={(e) => setCalcReturnRate(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-zinc-300">Frais de Retour Transporteur :</span>
                    <span className="text-zinc-400 font-mono text-sm">{calcReturnFee} {activeMarket.currency}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={calcReturnFee}
                    onChange={(e) => setCalcReturnFee(Number(e.target.value))}
                    className="w-full accent-zinc-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Profit Output Panel */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <span className="text-xs font-mono uppercase text-zinc-400">Santé de Rentabilité</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      calculatedEconomics.isHealthy
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : calculatedEconomics.isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {calculatedEconomics.isHealthy ? '● Excellente Marge' : calculatedEconomics.isWarning ? '▲ Marge Serrée' : '✕ Danger RTO'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-5">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Marge Nette / Commande</div>
                      <div className={`text-2xl font-black font-mono mt-1 ${
                        calculatedEconomics.netProfitPerOrder > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {calculatedEconomics.netProfitPerOrder} {activeMarket.currency}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Taux de Marge Nette</div>
                      <div className={`text-2xl font-black font-mono mt-1 ${
                        calculatedEconomics.netMarginPercent > 20 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {calculatedEconomics.netMarginPercent}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-2">
                    <div className="text-xs font-bold text-zinc-300">Projection sur 100 Commandes Générées :</div>
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>Chiffre d&apos;Affaires Encaissé :</span>
                      <strong className="text-white">{calculatedEconomics.totalRevenue} {activeMarket.currency}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400 font-mono">
                      <span>Bénéfice Net en Poche :</span>
                      <strong className="text-emerald-400 text-sm font-bold">{calculatedEconomics.totalNetProfit} {activeMarket.currency}</strong>
                    </div>
                  </div>
                </div>

                <a
                  href="/register-store"
                  className="w-full py-3 rounded-xl text-xs font-black text-black text-center bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all block"
                >
                  Lancer Cette Campagne sur CODShop ↗
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Transparent Pricing (0% Transaction Fees) ─────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#0d0d10] border-t border-b border-zinc-800/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              0% Commission sur vos Ventes
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Tarification Transparente et Sans Surprise
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Contrairement à d&apos;autres plateformes qui prélèvent des pourcentages sur votre chiffre d&apos;affaires, CODShop ne prend <strong>0% de commission</strong> sur vos commandes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold uppercase text-zinc-400">Starter Gratuit</div>
                <div className="text-3xl font-black text-white">
                  0 DH <span className="text-xs font-normal text-zinc-500">/ mois</span>
                </div>
                <p className="text-xs text-zinc-400">Idéal pour tester votre premier produit gagnant sans aucun engagement.</p>
                <ul className="space-y-2.5 text-xs text-zinc-300 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1 Boutique complète sur sous-domaine</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Jusqu&apos;à 50 commandes/mois</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 5 Thèmes essentiels</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Export standard CSV</li>
                </ul>
              </div>

              <a
                href="/register-store"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white bg-zinc-800 hover:bg-zinc-700 transition-colors block"
              >
                Démarrer Gratuitement
              </a>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121215] border-2 border-emerald-500 space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500 text-black">
                Le Plus Populaire
              </div>

              <div className="space-y-4">
                <div className="text-xs font-mono font-bold uppercase text-emerald-400">Pro Vendeur</div>
                <div className="text-3xl font-black text-white">
                  199 DH <span className="text-xs font-normal text-zinc-500">/ mois (~19 € / 79 SAR)</span>
                </div>
                <p className="text-xs text-zinc-400">Pour les e-commerçants actifs et media buyers qui scalent leurs campagnes.</p>
                <ul className="space-y-2.5 text-xs text-zinc-300 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Commandes illimitées</strong></li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Tous les 25 thèmes</strong> débloqués</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Formulaires Bordereau Express</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Manifests transporteurs (Ozon, SendIt, Amana, SMSA)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Templates WhatsApp Darija & Khaliji</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Multi-pays & devises en direct</li>
                </ul>
              </div>

              <a
                href="/register-store"
                className="w-full py-3 rounded-xl text-xs font-black text-center text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all block"
              >
                Créer Ma Boutique Pro ↗
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-mono font-bold uppercase text-zinc-400">Scale Enterprise</div>
                <div className="text-3xl font-black text-white">
                  499 DH <span className="text-xs font-normal text-zinc-500">/ mois (~49 € / 199 SAR)</span>
                </div>
                <p className="text-xs text-zinc-400">Pour les équipes avec call center dédié, marques multi-pays et gros volumes.</p>
                <ul className="space-y-2.5 text-xs text-zinc-300 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Tout du pack Pro Vendeur</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Accès multi-agents Call Center</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Intégration API transporteurs personnalisée</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Accompagnement VIP & Support WhatsApp 24/7</li>
                </ul>
              </div>

              <a
                href="/register-store"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-white bg-zinc-800 hover:bg-zinc-700 transition-colors block"
              >
                Contacter l&apos;Équipe Scale
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── Global SaaS Footer ──────────────────────────────────────── */}
      <footer className="py-12 bg-[#09090b] border-t border-zinc-800/80 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-black text-xs">
              C
            </div>
            <span className="font-bold text-white">CODShop Platform</span>
            <span>— The Universal Cash-on-Delivery E-Commerce SaaS</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="https://ottavio.codshop.vipone.site" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
              Boutique Démo Ottavio
            </a>
            <a href="/admin/login" className="hover:text-zinc-300 transition-colors">
              Espace Vendeur
            </a>
            <a href="/register-store" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
              Créer Boutique
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-zinc-800/50 text-center sm:text-left text-[11px] text-zinc-600">
          © 2026 CODShop. Tous droits réservés. Conçu pour les marchands et media buyers du Maroc, du Golfe (KSA, UAE, Koweït) et du monde entier.
        </div>
      </footer>

    </div>
  );
}
