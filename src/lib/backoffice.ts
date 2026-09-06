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
  getProducts,
  addProduct,
  getCategories,
  getCustomers,
  getPaymentGateways,
  togglePaymentGateway,
} from './mocks';

import { getOrders } from './mocks';

// ── Analytics helper (derived from mock orders) ─────────────────
export function getAnalytics(storeSlug?: string) {
  const storeOrders = getOrders(storeSlug);
  const totalOrders = storeOrders.length;
  const deliveredOrders = storeOrders.filter((o) => o.status === 'delivered');
  const returnedOrders = storeOrders.filter((o) => o.status === 'returned');
  const confirmedOrders = storeOrders.filter((o) => ['confirmed', 'shipping', 'delivered'].includes(o.status));
  const shippingOrders = storeOrders.filter((o) => ['shipping', 'delivered', 'returned'].includes(o.status));

  const totalRevenueDelivered = deliveredOrders.reduce((acc, curr) => acc + curr.total, 0);
  const totalRevenuePotential = storeOrders.reduce((acc, curr) => acc + curr.total, 0);

  const confirmationRate = totalOrders > 0 ? (confirmedOrders.length / totalOrders) * 100 : 0;
  const deliveryRate = shippingOrders.length > 0 ? (deliveredOrders.length / shippingOrders.length) * 100 : 0;
  const returnRate = shippingOrders.length > 0 ? (returnedOrders.length / shippingOrders.length) * 100 : 0;

  // Real Net Profit Calculation (Revenue Livré - Coût Marchandise - Coût Livraison)
  const totalCostOfGoods = deliveredOrders.reduce((acc, curr) => acc + curr.subtotal * 0.32, 0); // ~32% cost
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
    cityDistribution: [
      { city: 'Casablanca', orders: 48, rate: 92.4, revenue: 16800 },
      { city: 'Rabat', orders: 28, rate: 89.3, revenue: 9400 },
      { city: 'Marrakech', orders: 24, rate: 87.5, revenue: 8200 },
      { city: 'Tanger', orders: 19, rate: 84.2, revenue: 6500 },
      { city: 'Fès', orders: 15, rate: 80.0, revenue: 4900 },
      { city: 'Agadir', orders: 12, rate: 83.3, revenue: 4200 },
    ],
  };
}

// ── Funnel / Store Journey Model ────────────────────────────────
export function getFunnelData(_storeSlug?: string) {
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
