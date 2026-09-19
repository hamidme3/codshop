'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, TrendingUp, Users, ShoppingCart, 
  CheckCircle2, AlertTriangle, Lightbulb, ArrowDown, 
  Sparkles, Clock, Package, Eye
} from 'lucide-react';

interface FunnelStep {
  name: string;
  visitors: number;
  percentage: number;
  dropoff: number;
}

interface Diagnostic {
  type: 'success' | 'warning' | 'tip';
  title: string;
  desc: string;
}

interface FunnelData {
  totalVisitors: number;
  conversionRate: number;
  steps: FunnelStep[];
  diagnostics: Diagnostic[];
}

function FunnelContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/admin/analytics/storefront?store=${encodeURIComponent(storeSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.funnel) {
          const f = data.funnel;
          const totalVisitors = f.visitors || 0;
          const productViews = f.productViews || 0;
          const initiated = f.initiatedCheckout || 0;
          const step2 = f.checkoutStep2 || 0;
          const completed = f.ordersCompleted || 0;
          const overallRate = f.overallConversionRate || (totalVisitors > 0 ? Number(((completed / totalVisitors) * 100).toFixed(1)) : 0);

          const step1Pct = totalVisitors > 0 ? 100 : 0;
          const step2Pct = totalVisitors > 0 ? Number(((productViews / totalVisitors) * 100).toFixed(1)) : (productViews > 0 ? 100 : 0);
          const step3Pct = totalVisitors > 0 ? Number(((initiated / totalVisitors) * 100).toFixed(1)) : (initiated > 0 ? 100 : 0);
          const step4Pct = totalVisitors > 0 ? Number(((step2 / totalVisitors) * 100).toFixed(1)) : (step2 > 0 ? 100 : 0);
          const step5Pct = totalVisitors > 0 ? Number(((completed / totalVisitors) * 100).toFixed(1)) : (completed > 0 ? 100 : 0);

          const steps: FunnelStep[] = [
            {
              name: '1. Vues Boutique & Catalogue',
              visitors: totalVisitors,
              percentage: step1Pct,
              dropoff: 0,
            },
            {
              name: '2. Fiches Produits Vues',
              visitors: productViews,
              percentage: step2Pct,
              dropoff: Math.max(0, Number((100 - step2Pct).toFixed(1))),
            },
            {
              name: '3. Formulaire COD Ouvert (Étape 1)',
              visitors: initiated,
              percentage: step3Pct,
              dropoff: Math.max(0, Number((step2Pct - step3Pct).toFixed(1))),
            },
            {
              name: '4. Saisie Téléphone & Ville (Étape 2)',
              visitors: step2,
              percentage: step4Pct,
              dropoff: Math.max(0, Number((step3Pct - step4Pct).toFixed(1))),
            },
            {
              name: '5. Commandes COD Confirmées',
              visitors: completed,
              percentage: step5Pct,
              dropoff: Math.max(0, Number((step4Pct - step5Pct).toFixed(1))),
            },
          ];

          const diagnostics: Diagnostic[] = [];
          if (overallRate >= 8) {
            diagnostics.push({
              type: 'success',
              title: `Taux de conversion global performant (${overallRate}%)`,
              desc: 'Votre boutique convertit au-dessus de la moyenne e-commerce COD au Maroc.',
            });
          } else if (totalVisitors > 0) {
            diagnostics.push({
              type: 'warning',
              title: `Taux de conversion (${overallRate}%) à optimiser`,
              desc: 'Activez les packs quantité (Duo/Trio) et vérifiez que les frais de livraison sont clairs dès l’ouverture du formulaire.',
            });
          }

          if (data.abandonment?.recoverableLeads > 0) {
            diagnostics.push({
              type: 'tip',
              title: `${data.abandonment.recoverableLeads} prospects avec numéro récupérables`,
              desc: 'Ces visiteurs ont saisi leur téléphone WhatsApp avant d’abandonner. Relancez-les pour récupérer ces commandes.',
            });
          } else {
            diagnostics.push({
              type: 'tip',
              title: 'Accélérez avec WhatsApp 1-Click',
              desc: 'Le bouton flottant WhatsApp permet de sauver les visiteurs qui hésitent à remplir le formulaire complet.',
            });
          }

          setFunnel({
            totalVisitors,
            conversionRate: overallRate,
            steps,
            diagnostics,
          });
        }
      })
      .catch((err) => console.error('[Funnel] Error fetching storefront analytics:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [storeSlug]);

  if (loading && !funnel) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">
        Chargement de l'entonnoir de vente en direct...
      </div>
    );
  }

  const currentFunnel = funnel || {
    totalVisitors: 0,
    conversionRate: 0,
    steps: [
      { name: '1. Vues Boutique & Catalogue', visitors: 0, percentage: 0, dropoff: 0 },
      { name: '2. Fiches Produits Vues', visitors: 0, percentage: 0, dropoff: 0 },
      { name: '3. Formulaire COD Ouvert (Étape 1)', visitors: 0, percentage: 0, dropoff: 0 },
      { name: '4. Saisie Téléphone & Ville (Étape 2)', visitors: 0, percentage: 0, dropoff: 0 },
      { name: '5. Commandes COD Confirmées', visitors: 0, percentage: 0, dropoff: 0 },
    ],
    diagnostics: [],
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Filter className="w-8 h-8 text-emerald-400" /> Entonnoir de Vente (Store Journey)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Suivi en temps réel des étapes clés du parcours visiteur jusqu&apos;à la confirmation de commande COD.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>Données réelles en direct</span>
        </div>
      </div>

      {/* New Store Zero-State Banner */}
      {currentFunnel.totalVisitors === 0 && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Entonnoir prêt pour vos premiers visiteurs</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chaque visiteur sur votre catalogue ou vos fiches produits sera comptabilisé en temps réel dans les étapes de conversion ci-dessous.
              </p>
            </div>
          </div>
          <a
            href={`/${storeSlug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
          >
            Visiter ma boutique ↗
          </a>
        </div>
      )}

      {/* Global Conversion Card */}
      <div className="bg-[#13171c] border border-slate-800/70 bento-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Performance Globale de la Boutique</span>
          <div className="text-3xl sm:text-4xl font-black text-white">
            {currentFunnel.conversionRate}% <span className="text-base font-normal text-slate-400">Taux de conversion global</span>
          </div>
          <p className="text-slate-400 text-xs max-w-md">
            Sur <strong>{currentFunnel.totalVisitors.toLocaleString()} visiteurs</strong> ayant atterri sur votre boutique, <strong>{currentFunnel.steps[4]?.visitors ?? 0} commandes</strong> ont été finalisées.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
          <div className="text-xs text-slate-400 font-semibold">Moyenne E-Commerce Maroc :</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">8% - 12%</div>
          <span className="text-[10px] text-emerald-400 font-bold">
            {currentFunnel.conversionRate >= 8 ? 'Votre boutique surperforme le marché' : 'Optimisez vos visuels pour dépasser 8%'}
          </span>
        </div>
      </div>

      {/* Visual Funnel Steps */}
      <div className="bg-[#13171c] border border-slate-800/70 bento-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" /> Étapes de Conversion & Déperdition de Trafic
        </h2>

        <div className="space-y-4">
          {currentFunnel.steps.map((step, idx) => {
            const isLast = idx === currentFunnel.steps.length - 1;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                    <span>{step.name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-mono text-slate-400">{step.visitors.toLocaleString()} visiteurs</span>
                    <span className="font-black text-white text-sm sm:text-base">{step.percentage}%</span>
                    {step.dropoff > 0 && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold">
                        -{step.dropoff}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLast
                        ? 'bg-gradient-to-r from-emerald-500 to-sky-400'
                        : 'bg-gradient-to-r from-sky-500 to-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, step.percentage))}%` }}
                  />
                </div>

                {!isLast && (
                  <div className="flex justify-center my-1 text-slate-600">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostics & AI Recommendations */}
      {currentFunnel.diagnostics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentFunnel.diagnostics.map((diag, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#13171c] border border-slate-800/70 bento-card space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                {diag.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : diag.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0" />
                )}
                <h3 className="font-bold text-white text-xs">{diag.title}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{diag.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FunnelPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement de l&apos;entonnoir...</div>}>
      <FunnelContent />
    </Suspense>
  );
}
