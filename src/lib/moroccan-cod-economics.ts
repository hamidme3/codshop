/**
 * Moroccan COD Unit Economics & Profitability Engine
 * 
 * Defines standard mathematical rules and financial models specifically adapted
 * to Cash-On-Delivery (COD) commerce across Morocco:
 * - Direct COGS and carrier shipping fees (Casablanca Hub vs Hors-Casablanca)
 * - Return rates (Taux de retour/refus: 10% - 20%, baseline 15%)
 * - Courier return penalty fees (Frais de retour: 15 - 20 DH)
 * - Maximum break-even CPA (ad spend allowance)
 * - Daily volume break-even thresholds
 * - Automated Quantity Pack Upsells (Pack Duo -100 DH + Free Delivery, Pack Trio -200 DH + Free Gift)
 */

export interface CodEconomicsInputs {
  /** Public Selling Price in MAD (Prix de vente TTC au client) */
  sellingPrice: number;
  /** Supplier Cost of Goods Sold in MAD (Coût d'achat fournisseur unitaire) */
  cogs: number;
  /** Courier delivery fee for successful delivery in MAD (35 DH Casa vs 45 DH National) */
  deliveryFee?: number;
  /** Courier return fee charged per returned parcel in MAD (typically 15 to 20 DH) */
  returnFee?: number;
  /** Estimated parcel return/rejection rate between 0 and 1 (default: 0.15 = 15%) */
  returnRate?: number;
  /** Optional customer acquisition cost / Ad spend per order in MAD (CPA moyen) */
  cpa?: number;
  /** Fixed daily business operating costs in MAD (e.g., call center agent, SaaS, phone) */
  dailyFixedCosts?: number;
}

export interface UnitEconomicsResult {
  sellingPrice: number;
  cogs: number;
  deliveryFee: number;
  returnFee: number;
  returnRate: number;
  deliverySuccessRate: number;

  /** Unit Gross Margin in MAD = Selling Price - COGS */
  grossMarginMAD: number;
  /** Unit Gross Margin % = (Gross Margin / Selling Price) * 100 */
  grossMarginPercent: number;

  /** Delivered order profit before return adjustment = Selling Price - COGS - Delivery Fee */
  deliveredProfitMAD: number;

  /** Estimated Net Profit per Dispatched Order in MAD (accounting for delivery success & return fees) */
  netProfitMAD: number;
  /** Estimated Net Margin % = (Net Profit / Selling Price) * 100 */
  netMarginPercent: number;

  /** Estimated Net Profit after CPA / Ad Spend in MAD */
  netProfitAfterCpaMAD: number;
  /** Net Margin % after CPA */
  netMarginAfterCpaPercent: number;

  /** Maximum CPA (Ad spend per order) before losing money = netProfitMAD */
  maxBreakEvenCpa: number;

  /** Theoretical maximum return rate before this order becomes unprofitable */
  breakEvenReturnRatePercent: number;

  /** Financial health evaluation based on Moroccan COD benchmarks */
  health: HealthEvaluation;
}

export type MarginHealthLevel = 'green' | 'amber' | 'red';

export interface HealthEvaluation {
  level: MarginHealthLevel;
  badgeLabel: string;
  badgeClass: string;
  description: string;
  actionableAdvice: string;
}

export interface QuantityPackTierEconomics {
  tierName: string;
  quantity: number;
  sellingPrice: number;
  cogsTotal: number;
  deliveryFee: number;
  customerSavingsMAD: number;
  perks: string[];
  netProfitMAD: number;
  netMarginPercent: number;
  profitMultiplierVsSolo: number;
}

export interface QuantityPackEconomics {
  solo: QuantityPackTierEconomics;
  duo: QuantityPackTierEconomics;
  trio: QuantityPackTierEconomics;
}

export interface DailyProfitResult {
  dailyOrders: number;
  grossRevenueMAD: number;
  totalNetProfitMAD: number;
  dailyFixedCosts: number;
  netDailyProfitMAD: number;
  breakEvenOrdersPerDay: number;
}

// ── Standard Moroccan COD Industry Defaults ──
export const MOROCCAN_COD_DEFAULTS = {
  DELIVERY_FEE_CASA: 35,
  DELIVERY_FEE_NATIONAL: 45,
  DELIVERY_FEE_BLENDED: 41, // 40% Casa + 60% Hors-Casa
  RETURN_FEE_STANDARD: 20,
  RETURN_FEE_ECONOMY: 15,
  RETURN_RATE_DEFAULT: 0.15, // 15% standard Moroccan average
  FREE_GIFT_COGS: 12, // Wholesale cost of handcrafted leather keychain
  DAILY_FIXED_COSTS: 150, // 1 confirmation operator + tel/internet
} as const;

/**
 * Evaluates margin health according to Moroccan COD benchmarks:
 * - Green (> 35%): Excellent profitability, resilient to ad fluctuation & logistics variance.
 * - Amber (15% - 35%): Moderate profitability, vulnerable to ROAS drops. Pack Duo/Trio strongly advised.
 * - Red (< 15% or negative): Critical risk of insolvency in COD.
 */
export function getMarginHealth(netMarginPercent: number): HealthEvaluation {
  if (netMarginPercent >= 35) {
    return {
      level: 'green',
      badgeLabel: 'Excellente Rentabilité',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Marge saine (> 35%). Absorbe sans danger les fluctuations de livraison et de pub.',
      actionableAdvice: 'Produit idéal pour scaling agressif sur Meta Ads et TikTok Ads.',
    };
  }

  if (netMarginPercent >= 15) {
    return {
      level: 'amber',
      badgeLabel: 'Marge Modérée',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Marge acceptable (15% à 35%), mais vulnérable aux variations de coût publicitaire.',
      actionableAdvice: 'Activez les packs Duo (-100 DH) et Trio pour augmenter le panier moyen (AOV).',
    };
  }

  return {
    level: 'red',
    badgeLabel: 'Marge Critique / Danger',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    description: 'Marge inférieure à 15% ou négative. Risque élevé de perte nette dès 15% de retour.',
    actionableAdvice: 'Rehaussez le prix de vente ou renégociez le coût d\'achat fournisseur immédiatement.',
  };
}

/**
 * Calculates complete Moroccan COD Unit Economics for a single product.
 */
export function calculateUnitEconomics(inputs: CodEconomicsInputs): UnitEconomicsResult {
  const sellingPrice = Math.max(0, inputs.sellingPrice || 0);
  const cogs = Math.max(0, inputs.cogs || 0);
  const deliveryFee = inputs.deliveryFee !== undefined ? Math.max(0, inputs.deliveryFee) : MOROCCAN_COD_DEFAULTS.DELIVERY_FEE_CASA;
  const returnFee = inputs.returnFee !== undefined ? Math.max(0, inputs.returnFee) : MOROCCAN_COD_DEFAULTS.RETURN_FEE_STANDARD;
  const returnRate = inputs.returnRate !== undefined ? Math.max(0, Math.min(1, inputs.returnRate)) : MOROCCAN_COD_DEFAULTS.RETURN_RATE_DEFAULT;
  const deliverySuccessRate = 1 - returnRate;
  const cpa = Math.max(0, inputs.cpa || 0);

  // 1. Gross Margins
  const grossMarginMAD = sellingPrice - cogs;
  const grossMarginPercent = sellingPrice > 0 ? (grossMarginMAD / sellingPrice) * 100 : 0;

  // 2. Delivered profit
  const deliveredProfitMAD = sellingPrice - cogs - deliveryFee;

  // 3. Expected Net Profit per Dispatched Order
  // Formula: Net Profit = (Selling Price - COGS - Delivery Fee) * (1 - Return Rate) - (Return Fee * Return Rate)
  const netProfitMAD = deliveredProfitMAD * deliverySuccessRate - returnFee * returnRate;
  const netMarginPercent = sellingPrice > 0 ? (netProfitMAD / sellingPrice) * 100 : 0;

  // 4. Net Profit after CPA
  const netProfitAfterCpaMAD = netProfitMAD - cpa;
  const netMarginAfterCpaPercent = sellingPrice > 0 ? (netProfitAfterCpaMAD / sellingPrice) * 100 : 0;

  // 5. Maximum Break-even CPA
  const maxBreakEvenCpa = Math.max(0, netProfitMAD);

  // 6. Theoretical Maximum Return Rate before Loss
  // (P - C - D) * (1 - R) - F_ret * R = 0  =>  R = (P - C - D) / (P - C - D + F_ret)
  let breakEvenReturnRatePercent = 0;
  if (deliveredProfitMAD > 0) {
    const denom = deliveredProfitMAD + returnFee;
    breakEvenReturnRatePercent = denom > 0 ? (deliveredProfitMAD / denom) * 100 : 0;
  }

  // 7. Health Evaluation
  const health = getMarginHealth(netMarginPercent);

  return {
    sellingPrice,
    cogs,
    deliveryFee,
    returnFee,
    returnRate,
    deliverySuccessRate,
    grossMarginMAD: Math.round(grossMarginMAD * 100) / 100,
    grossMarginPercent: Math.round(grossMarginPercent * 10) / 10,
    deliveredProfitMAD: Math.round(deliveredProfitMAD * 100) / 100,
    netProfitMAD: Math.round(netProfitMAD * 100) / 100,
    netMarginPercent: Math.round(netMarginPercent * 10) / 10,
    netProfitAfterCpaMAD: Math.round(netProfitAfterCpaMAD * 100) / 100,
    netMarginAfterCpaPercent: Math.round(netMarginAfterCpaPercent * 10) / 10,
    maxBreakEvenCpa: Math.round(maxBreakEvenCpa * 100) / 100,
    breakEvenReturnRatePercent: Math.round(breakEvenReturnRatePercent * 10) / 10,
    health,
  };
}

/**
 * Computes exact Moroccan Quantity Pack Upsell Economics (Pack Duo & Pack Trio):
 * - Pack Duo (2 units): Price = (Price * 2) - 100 DH, Auto Free Shipping = true (Save 100 DH + 35 DH delivery)
 * - Pack Trio (3 units): Price = (Price * 3) - 200 DH, Free Gift = "Porte-clés Cuir Artisanal Offert"
 */
export function calculateQuantityPackEconomics(
  basePrice: number,
  baseCogs: number,
  params?: Partial<CodEconomicsInputs>
): QuantityPackEconomics {
  const deliveryFee = params?.deliveryFee ?? MOROCCAN_COD_DEFAULTS.DELIVERY_FEE_CASA;
  const returnFee = params?.returnFee ?? MOROCCAN_COD_DEFAULTS.RETURN_FEE_STANDARD;
  const returnRate = params?.returnRate ?? MOROCCAN_COD_DEFAULTS.RETURN_RATE_DEFAULT;
  const successRate = 1 - returnRate;

  // ── Solo Tier (1 unit) ──
  const soloNetProfit = (basePrice - baseCogs - deliveryFee) * successRate - returnFee * returnRate;
  const soloNetMargin = basePrice > 0 ? (soloNetProfit / basePrice) * 100 : 0;
  const solo: QuantityPackTierEconomics = {
    tierName: 'Pack Solo (1 Pièce)',
    quantity: 1,
    sellingPrice: basePrice,
    cogsTotal: baseCogs,
    deliveryFee,
    customerSavingsMAD: 0,
    perks: ['Livraison standard'],
    netProfitMAD: Math.round(soloNetProfit * 100) / 100,
    netMarginPercent: Math.round(soloNetMargin * 10) / 10,
    profitMultiplierVsSolo: 1,
  };

  // ── Pack Duo (2 units) ──
  // Price = (Price * 2) - 100 DH
  // Auto Free Delivery to customer (merchant still pays single delivery fee to carrier)
  const duoPrice = Math.max(0, basePrice * 2 - 100);
  const duoCogs = baseCogs * 2;
  const duoSavings = 100 + deliveryFee; // 100 DH discount + free delivery benefit
  const duoDeliveredProfit = duoPrice - duoCogs - deliveryFee;
  const duoNetProfit = duoDeliveredProfit * successRate - returnFee * returnRate;
  const duoNetMargin = duoPrice > 0 ? (duoNetProfit / duoPrice) * 100 : 0;
  const duoMultiplier = soloNetProfit > 0 ? Math.round((duoNetProfit / soloNetProfit) * 10) / 10 : 0;

  const duo: QuantityPackTierEconomics = {
    tierName: 'Pack Duo (2 Pièces)',
    quantity: 2,
    sellingPrice: duoPrice,
    cogsTotal: duoCogs,
    deliveryFee, // 1 single shipping package shipped
    customerSavingsMAD: duoSavings,
    perks: ['-100 DH Réduction Immédiate', 'Livraison Gratuite Automatique (Économie 35 DH)'],
    netProfitMAD: Math.round(duoNetProfit * 100) / 100,
    netMarginPercent: Math.round(duoNetMargin * 10) / 10,
    profitMultiplierVsSolo: duoMultiplier,
  };

  // ── Pack Trio (3 units) ──
  // Price = (Price * 3) - 200 DH
  // Free Gift included: "Porte-clés Cuir Artisanal Offert"
  const trioPrice = Math.max(0, basePrice * 3 - 200);
  const giftCogs = MOROCCAN_COD_DEFAULTS.FREE_GIFT_COGS;
  const trioCogs = baseCogs * 3 + giftCogs;
  const trioSavings = 200 + deliveryFee + 50; // 200 DH discount + 35 DH delivery + 50 DH perceived gift value
  const trioDeliveredProfit = trioPrice - trioCogs - deliveryFee;
  const trioNetProfit = trioDeliveredProfit * successRate - returnFee * returnRate;
  const trioNetMargin = trioPrice > 0 ? (trioNetProfit / trioPrice) * 100 : 0;
  const trioMultiplier = soloNetProfit > 0 ? Math.round((trioNetProfit / soloNetProfit) * 10) / 10 : 0;

  const trio: QuantityPackTierEconomics = {
    tierName: 'Pack Trio (3 Pièces)',
    quantity: 3,
    sellingPrice: trioPrice,
    cogsTotal: trioCogs,
    deliveryFee,
    customerSavingsMAD: trioSavings,
    perks: [
      '-200 DH Réduction Immédiate',
      'Porte-clés Cuir Artisanal Offert',
      'Livraison Gratuite Express',
    ],
    netProfitMAD: Math.round(trioNetProfit * 100) / 100,
    netMarginPercent: Math.round(trioNetMargin * 10) / 10,
    profitMultiplierVsSolo: trioMultiplier,
  };

  return { solo, duo, trio };
}

/**
 * Calculates daily break-even orders and projected daily profit.
 */
export function calculateDailyProfit(
  netProfitPerOrder: number,
  dailyOrders: number,
  dailyFixedCosts: number = MOROCCAN_COD_DEFAULTS.DAILY_FIXED_COSTS,
  sellingPrice: number = 0
): DailyProfitResult {
  const safeOrders = Math.max(0, dailyOrders);
  const safeNetProfit = netProfitPerOrder;
  const grossRevenueMAD = safeOrders * sellingPrice;
  const totalNetProfitMAD = safeOrders * safeNetProfit;
  const netDailyProfitMAD = totalNetProfitMAD - dailyFixedCosts;

  let breakEvenOrdersPerDay = 0;
  if (safeNetProfit > 0) {
    breakEvenOrdersPerDay = Math.ceil(dailyFixedCosts / safeNetProfit);
  }

  return {
    dailyOrders: safeOrders,
    grossRevenueMAD: Math.round(grossRevenueMAD),
    totalNetProfitMAD: Math.round(totalNetProfitMAD),
    dailyFixedCosts,
    netDailyProfitMAD: Math.round(netDailyProfitMAD),
    breakEvenOrdersPerDay,
  };
}
