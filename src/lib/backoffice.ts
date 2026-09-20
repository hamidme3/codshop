// Backoffice — lean helpers + re-exports
// Types are canonical in ./types, mock data in ./mocks.
// This barrel keeps existing `from '@/lib/backoffice'` imports working.

export type { OrderStatus, OrderItem, Order, Product, Category, Customer, FunnelStep, PaymentGateway } from './types';

export {
  ORDERS,
  PRODUCTS,
  CATEGORIES,
  CUSTOMERS,
  PAYMENT_GATEWAYS,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  getCategories,
  addCategory,
  deleteCategory,
  reassignAndDeleteCategory,
  getCustomers,
  updateCustomerNotes,
  getPaymentGateways,
  togglePaymentGateway,
  checkInventory,
  decrementInventory,
} from './mocks';

export {
  normalizeSkuToken,
  deriveBaseSkuPrefix,
  cartesianProduct,
  generateVariantMatrix,
  batchFillStock,
  computeTotalStock,
  setPrimaryImage,
  reorderImages,
  addProductImage,
  removeProductImage,
  MOROCCAN_PRODUCT_IMAGE_PRESETS,
} from './variant-matrix';
export type { MatrixGenerationConfig, ImagePreset } from './variant-matrix';

export {
  calculateUnitEconomics,
  calculateQuantityPackEconomics,
  getMarginHealth,
  calculateDailyProfit,
  MOROCCAN_COD_DEFAULTS,
} from './moroccan-cod-economics';
export type {
  CodEconomicsInputs,
  UnitEconomicsResult,
  QuantityPackEconomics,
  HealthEvaluation,
} from './moroccan-cod-economics';

import { getOrders } from './mocks';

// ── Analytics helper (derived from mock orders) ─────────────────
export function getAnalytics(storeSlug: string) {
  if (!storeSlug) throw new Error('storeSlug is required');
  const storeOrders = getOrders(storeSlug);
  const totalOrders = storeOrders.length;
  const deliveredOrders = storeOrders.filter((o) => o.status === 'delivered');
  const returnedOrders = storeOrders.filter((o) => o.status === 'returned');
  const confirmedOrders = storeOrders.filter((o) => ['confirmed', 'shipped', 'shipping', 'delivered'].includes(o.status));
  const shippingOrders = storeOrders.filter((o) => ['shipped', 'shipping', 'delivered', 'returned'].includes(o.status));

  const totalRevenueDelivered = deliveredOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const totalRevenuePotential = storeOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  const confirmationRate = totalOrders > 0 ? (confirmedOrders.length / totalOrders) * 100 : 0;
  const deliveryRate = shippingOrders.length > 0 ? (deliveredOrders.length / shippingOrders.length) * 100 : 0;
  const returnRate = shippingOrders.length > 0 ? (returnedOrders.length / shippingOrders.length) * 100 : 0;

  // Real Net Profit Calculation (Revenue Livré - Coût Marchandise - Coût Livraison)
  const totalCostOfGoods = deliveredOrders.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0) * 0.32, 0); // ~32% cost
  const totalShippingPaid = deliveredOrders.length * 25 + returnedOrders.length * 15; // delivery fee + return return-fee
  const netProfit = Math.max(0, totalRevenueDelivered - totalCostOfGoods - totalShippingPaid);

  return {
    totalOrders,
    totalRevenueDelivered,
    totalRevenuePotential,
    confirmationRate: Number(confirmationRate.toFixed(1)),
    deliveryRate: Number(deliveryRate.toFixed(1)),
    returnRate: Number(returnRate.toFixed(1)),
    netProfit: Math.round(netProfit),
    // ── Dynamic city distribution scoped to storeSlug ──────────────────────
    cityDistribution: (() => {
      const cityMap = new Map<string, { orders: number; revenue: number }>();
      storeOrders.forEach((o) => {
        const c = o.city ?? 'Autre';
        const existing = cityMap.get(c) ?? { orders: 0, revenue: 0 };
        cityMap.set(c, {
          orders: existing.orders + 1,
          revenue: existing.revenue + (Number(o.total) || 0),
        });
      });
      const total = storeOrders.length || 1;
      return Array.from(cityMap.entries())
        .sort((a, b) => b[1].revenue - a[1].revenue)
        .slice(0, 6)
        .map(([city, data]) => ({
          city,
          orders: data.orders,
          rate: Number(((data.orders / total) * 100).toFixed(1)),
          revenue: Math.round(data.revenue),
        }));
    })(),

    // ── Dynamic Order Pipeline Velocity ───────────────────────────
    pipelineStages: (() => {
      const pending = storeOrders.filter((o) => ['new', 'to_confirm'].includes(o.status));
      const confirmed = storeOrders.filter((o) => o.status === 'confirmed');
      const inTransit = storeOrders.filter((o) => ['shipped', 'shipping'].includes(o.status));
      const delivered = storeOrders.filter((o) => o.status === 'delivered');
      const returned = storeOrders.filter((o) => ['returned', 'canceled'].includes(o.status));

      return [
        { key: 'to_confirm', name: '1. À Confirmer', count: pending.length, value: Math.round(pending.reduce((s, o) => s + (Number(o.total) || 0), 0)), color: '#94a3b8' },
        { key: 'confirmed', name: '2. Confirmées', count: confirmed.length, value: Math.round(confirmed.reduce((s, o) => s + (Number(o.total) || 0), 0)), color: '#06b6d4' },
        { key: 'shipped', name: '3. En Transit', count: inTransit.length, value: Math.round(inTransit.reduce((s, o) => s + (Number(o.total) || 0), 0)), color: '#38bdf8' },
        { key: 'delivered', name: '4. Livrées & Encaissées', count: delivered.length, value: Math.round(delivered.reduce((s, o) => s + (Number(o.total) || 0), 0)), color: '#10b981' },
        { key: 'returned', name: '5. Retours / Refus', count: returned.length, value: Math.round(returned.reduce((s, o) => s + (Number(o.total) || 0), 0)), color: '#f43f5e' },
      ];
    })(),

    // ── Dynamic Top Products Realized Cashflow ────────────────────
    topProducts: (() => {
      const pMap = new Map<string, {
        title: string;
        totalOrders: number;
        totalQuantity: number;
        grossRevenue: number;
        deliveredRevenue: number;
        deliveredCount: number;
        returnedCount: number;
      }>();

      for (const order of storeOrders) {
        const items = order.items || [];
        const isDelivered = order.status === 'delivered';
        const isReturned = ['returned', 'canceled'].includes(order.status);

        for (const item of items) {
          const title = item.title || 'Produit sans titre';
          const existing = pMap.get(title) || {
            title,
            totalOrders: 0,
            totalQuantity: 0,
            grossRevenue: 0,
            deliveredRevenue: 0,
            deliveredCount: 0,
            returnedCount: 0,
          };

          const qty = Number(item.quantity) || 1;
          const itemTotal = (Number(item.price) || 0) * qty;

          existing.totalOrders += 1;
          existing.totalQuantity += qty;
          existing.grossRevenue += itemTotal;
          if (isDelivered) {
            existing.deliveredRevenue += itemTotal;
            existing.deliveredCount += 1;
          }
          if (isReturned) {
            existing.returnedCount += 1;
          }
          pMap.set(title, existing);
        }
      }

      return Array.from(pMap.values())
        .map((p) => {
          const dispatched = p.deliveredCount + p.returnedCount;
          const deliveryRate = dispatched > 0
            ? (p.deliveredCount / dispatched) * 100
            : (p.totalOrders > 0 ? (p.deliveredCount / p.totalOrders) * 100 : 0);
          const returnRate = dispatched > 0 ? (p.returnedCount / dispatched) * 100 : 0;
          return {
            title: p.title,
            totalOrders: p.totalOrders,
            totalQuantity: p.totalQuantity,
            grossRevenue: Math.round(p.grossRevenue),
            deliveredRevenue: Math.round(p.deliveredRevenue),
            deliveryRate: Number(deliveryRate.toFixed(1)),
            returnRate: Number(returnRate.toFixed(1)),
          };
        })
        .sort((a, b) => b.deliveredRevenue - a.deliveredRevenue)
        .slice(0, 6);
    })(),
  };
}

// ── Funnel / Store Journey Model ────────────────────────────────
export function getFunnelData(storeSlug: string) {
  if (!storeSlug) throw new Error('storeSlug is required');
  return {
    totalVisitors: 2840,
    conversionRate: 14.2,
    steps: [
      { name: '1. Vues Produits (Landing)', visitors: 2840, percentage: 100, dropoff: 0 },
      { name: '2. Clic Commander (Formulaire COD)', visitors: 2045, percentage: 72.0, dropoff: 28.0 },
      { name: '3. Saisie Téléphone & Ville', visitors: 1192, percentage: 42.0, dropoff: 58.0 },
      { name: '4. Commandes Confirmées (Succès)', visitors: 403, percentage: 14.2, dropoff: 85.8 },
    ],
    diagnostics: [
      {
        type: 'success',
        title: 'Taux de passage Produit -> Formulaire excellent (72%)',
        desc: "Votre offre et votre bouton d'appel à l'action fonctionnent très bien sur mobile.",
      },
      {
        type: 'warning',
        title: "Perte de 28% à l'étape formulaire",
        desc: 'Assurez-vous que le montant de livraison pour Casablanca (20 DH) est clairement affiché dès le début.',
      },
      {
        type: 'tip',
        title: 'Accélérez avec WhatsApp 1-Click',
        desc: '18% des visiteurs qui abandonnent le formulaire finalisent leur commande via le bouton flottant WhatsApp.',
      },
    ],
  };
}
