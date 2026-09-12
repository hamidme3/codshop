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
  deleteProduct,
  updateProductStock,
  getCategories,
  addCategory,
  deleteCategory,
  getCustomers,
  getPaymentGateways,
  togglePaymentGateway,
  checkInventory,
  decrementInventory,
} from './mocks';

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
