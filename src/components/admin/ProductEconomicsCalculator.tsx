'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Package,
  Layers,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  calculateUnitEconomics,
  calculateQuantityPackEconomics,
  calculateDailyProfit,
  MOROCCAN_COD_DEFAULTS,
} from '@/lib/moroccan-cod-economics';

export interface ProductEconomicsCalculatorProps {
  initialPrice?: number;
  initialCogs?: number;
  onApplyPricing?: (pricing: { price: number; cogs: number }) => void;
  compact?: boolean;
}

export const ProductEconomicsCalculator: React.FC<ProductEconomicsCalculatorProps> = ({
  initialPrice = 350,
  initialCogs = 110,
  onApplyPricing,
  compact = false,
}) => {
  const [sellingPrice, setSellingPrice] = useState<number>(initialPrice);
  const [cogs, setCogs] = useState<number>(initialCogs);
  const [deliveryFee, setDeliveryFee] = useState<number>(MOROCCAN_COD_DEFAULTS.DELIVERY_FEE_CASA);
  const [returnRatePercent, setReturnRatePercent] = useState<number>(15);
  const [returnFee, setReturnFee] = useState<number>(MOROCCAN_COD_DEFAULTS.RETURN_FEE_STANDARD);
  const [cpa, setCpa] = useState<number>(0);
  const [dailyOrdersTarget, setDailyOrdersTarget] = useState<number>(10);
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);

  // Unit Economics calculation
  const economics = useMemo(() => {
    return calculateUnitEconomics({
      sellingPrice,
      cogs,
      deliveryFee,
      returnFee,
      returnRate: returnRatePercent / 100,
      cpa,
    });
  }, [sellingPrice, cogs, deliveryFee, returnFee, returnRatePercent, cpa]);

  // Quantity Pack Upsell calculations
  const packs = useMemo(() => {
    return calculateQuantityPackEconomics(sellingPrice, cogs, {
      deliveryFee,
      returnFee,
      returnRate: returnRatePercent / 100,
    });
  }, [sellingPrice, cogs, deliveryFee, returnFee, returnRatePercent]);

  // Daily profit projection
  const dailyProjections = useMemo(() => {
    return calculateDailyProfit(
      cpa > 0 ? economics.netProfitAfterCpaMAD : economics.netProfitMAD,
      dailyOrdersTarget,
      MOROCCAN_COD_DEFAULTS.DAILY_FIXED_COSTS,
      sellingPrice
    );
  }, [economics.netProfitMAD, economics.netProfitAfterCpaMAD, cpa, dailyOrdersTarget, sellingPrice]);

  return (
    <div className="bg-white dark:bg-[#0f0f12] border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 text-slate-800 dark:text-zinc-100 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <span>Calculateur de Rentabilité & Unit Economics COD Maroc</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${economics.health.badgeClass}`}>
                {economics.health.badgeLabel}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
              Modélisation financière avec taux de retour réels (15%) et frais de livraison.
            </p>
          </div>
        </div>

        {compact && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 flex items-center gap-1 p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800/60"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Main KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/80">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">Marge Brute Unitaire</div>
          <div className="text-base font-mono tabular-nums font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
            +{economics.grossMarginMAD} MAD
          </div>
          <div className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-zinc-400 mt-0.5">
            ({economics.grossMarginPercent}% du PV)
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/80">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">Bénéfice Net Réel / Colis</div>
          <div
            className={`text-base font-mono tabular-nums font-bold mt-0.5 ${
              economics.netProfitMAD > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {economics.netProfitMAD > 0 ? '+' : ''}
            {economics.netProfitMAD} MAD
          </div>
          <div className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-zinc-400 mt-0.5">
            Après {returnRatePercent}% retours & livr.
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/80">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">Marge Nette Réelle (%)</div>
          <div
            className={`text-base font-mono tabular-nums font-bold mt-0.5 ${
              economics.health.level === 'green'
                ? 'text-emerald-600 dark:text-emerald-400'
                : economics.health.level === 'amber'
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {economics.netMarginPercent}%
          </div>
          <div className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-zinc-400 mt-0.5">
            Seuil vert : &gt; 35%
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/80">
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">CPA Max (Break-even Pub)</div>
          <div className="text-base font-mono tabular-nums font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
            {economics.maxBreakEvenCpa} MAD
          </div>
          <div className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-zinc-400 mt-0.5">
            Plafond pub Meta/TikTok
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Inputs Section */}
          <div className="p-3.5 rounded-lg bg-slate-50/80 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800/80 space-y-3">
            <div className="text-xs font-semibold text-slate-800 dark:text-zinc-300 flex items-center gap-1.5">
              <span>Paramètres Économiques du Produit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Selling Price */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-zinc-400 mb-1">
                  Prix de Vente Client (DH)
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-300 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 dark:focus:border-zinc-600"
                />
              </div>

              {/* COGS */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-zinc-400 mb-1">
                  Coût Achat Fournisseur (DH)
                </label>
                <input
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-300 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 dark:focus:border-zinc-600"
                />
              </div>

              {/* Delivery Fee Selector */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-zinc-400 mb-1">
                  Frais Livraison Transporteur
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryFee(MOROCCAN_COD_DEFAULTS.DELIVERY_FEE_CASA)}
                    className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors border ${
                      deliveryFee === 35
                        ? 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Casa 35 DH
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryFee(MOROCCAN_COD_DEFAULTS.DELIVERY_FEE_NATIONAL)}
                    className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors border ${
                      deliveryFee === 45
                        ? 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    National 45 DH
                  </button>
                </div>
              </div>

              {/* Courier Return Fee */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-zinc-400 mb-1">
                  Frais de Retour Colis Refusé
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setReturnFee(MOROCCAN_COD_DEFAULTS.RETURN_FEE_STANDARD)}
                    className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors border ${
                      returnFee === 20
                        ? 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Standard 20 DH
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnFee(MOROCCAN_COD_DEFAULTS.RETURN_FEE_ECONOMY)}
                    className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-colors border ${
                      returnFee === 15
                        ? 'bg-slate-200 text-slate-900 border-slate-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    Éco 15 DH
                  </button>
                </div>
              </div>
            </div>

            {/* Slider: Return Rate */}
            <div className="pt-1.5 border-t border-slate-200 dark:border-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                <span className="text-[11px] text-slate-700 dark:text-zinc-300">
                  Taux de Retour Estimé (Moyenne Maroc : 10% à 20%) :
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-zinc-100 text-xs">
                  {returnRatePercent}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={returnRatePercent}
                onChange={(e) => setReturnRatePercent(Number(e.target.value))}
                className="w-full sm:w-48 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Actionable Strategic Advice Banner */}
          <div
            className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              economics.health.level === 'green'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/40 dark:text-emerald-300'
                : economics.health.level === 'amber'
                ? 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950/20 dark:border-sky-800/40 dark:text-sky-300'
                : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800/40 dark:text-rose-300'
            }`}
          >
            {economics.health.level === 'green' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold">{economics.health.description}</div>
              <div className="text-[11px] opacity-90 mt-0.5">{economics.health.actionableAdvice}</div>
              <div className="text-[10px] font-mono opacity-75 mt-1">
                Taux de retour maximum avant déficit : {economics.breakEvenReturnRatePercent}%
              </div>
            </div>
          </div>

          {/* Moroccan Quantity Pack Upsell Simulator */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Solo Card */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Pack Solo (1 Unité)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400">
                      Standard
                    </span>
                  </div>
                  <div className="text-base font-mono tabular-nums font-bold text-slate-900 dark:text-zinc-100 mt-2">
                    {packs.solo.sellingPrice} MAD
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Coût COGS : {packs.solo.cogsTotal} MAD
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-zinc-800/60 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">Bénéfice Net :</span>
                    <span className="font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      +{packs.solo.netProfitMAD} MAD
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400">
                    <span>Marge Nette :</span>
                    <span className="font-mono">{packs.solo.netMarginPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Pack Duo Card */}
              <div className="p-3.5 rounded-lg bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 relative flex flex-col justify-between">
                <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-bold tracking-wide uppercase">
                  Best Seller Maroc
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">Pack Duo (2 Unités)</span>
                  </div>
                  <div className="text-base font-mono tabular-nums font-bold text-slate-900 dark:text-zinc-100 mt-2">
                    {packs.duo.sellingPrice} MAD
                    <span className="text-[10px] line-through text-slate-400 dark:text-zinc-500 font-normal ml-2">
                      {sellingPrice * 2} MAD
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium mt-1">
                    Client économise {packs.duo.customerSavingsMAD} DH (100 DH + Livraison Gratuite)
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-purple-200 dark:border-purple-800/30 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-700 dark:text-purple-300">Bénéfice Net :</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      +{packs.duo.netProfitMAD} MAD
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-purple-700/80 dark:text-purple-300/80">
                    <span>Impact Profit vs Solo :</span>
                    <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                      +{packs.duo.profitMultiplierVsSolo}x plus de cash
                    </span>
                  </div>
                </div>
              </div>

              {/* Pack Trio Card */}
              <div className="p-3.5 rounded-lg bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-sky-900 dark:text-sky-200">Pack Trio (3 Unités)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 font-medium">
                      + Cadeau Offert
                    </span>
                  </div>
                  <div className="text-base font-mono tabular-nums font-bold text-slate-900 dark:text-zinc-100 mt-2">
                    {packs.trio.sellingPrice} MAD
                    <span className="text-[10px] line-through text-slate-400 dark:text-zinc-500 font-normal ml-2">
                      {sellingPrice * 3} MAD
                    </span>
                  </div>
                  <div className="text-[10px] text-sky-700 dark:text-sky-300 font-medium mt-1">
                    Porte-clés Cuir Artisanal Offert + Livr. Gratuite
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-sky-200 dark:border-sky-800/30 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-sky-700 dark:text-sky-300">Bénéfice Net :</span>
                    <span className="font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      +{packs.trio.netProfitMAD} MAD
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-sky-700/80 dark:text-sky-300/80">
                    <span>Impact Profit vs Solo :</span>
                    <span className="font-mono font-bold text-sky-700 dark:text-sky-300">
                      +{packs.trio.profitMultiplierVsSolo}x plus de cash
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Break-Even Threshold Simulator */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="text-slate-800 dark:text-zinc-300 font-medium">Seuil de Rentabilité Quotidienne :</span>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Avec {dailyProjections.dailyFixedCosts} DH/jour de frais fixes (téléphonie + call center).
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Point mort (0 DH perte)</div>
                <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-zinc-100">
                  {dailyProjections.breakEvenOrdersPerDay} colis/jour
                </div>
              </div>

              <div className="h-7 w-px bg-slate-200 dark:bg-zinc-800" />

              <div className="text-right">
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">Gain Net à {dailyOrdersTarget} colis/j</div>
                <div
                  className={`font-mono tabular-nums font-bold ${
                    dailyProjections.netDailyProfitMAD >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {dailyProjections.netDailyProfitMAD >= 0 ? '+' : ''}
                  {dailyProjections.netDailyProfitMAD} MAD / jour
                </div>
              </div>
            </div>
          </div>

          {/* Apply button if callback provided */}
          {onApplyPricing && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onApplyPricing({ price: sellingPrice, cogs })}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-semibold text-xs transition-colors shadow-sm"
              >
                Appliquer ces Prix au Produit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProductEconomicsCalculator;
