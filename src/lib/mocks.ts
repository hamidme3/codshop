import type { Order, Product, Category, Customer, PaymentGateway } from './types';

// ── Seed Moroccan Orders ────────────────────────────────────────
export let ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'CMD-84920',
    storeSlug: 'ottavio',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    customerName: 'Karim Bennani',
    phone: '0661234567',
    city: 'Casablanca',
    address: 'Maarif, Rue Jura, Résidence Al Manar Appt 4',
    status: 'new',
    items: [{ id: 'it_1', title: 'Sac Cuir Artisanal Marrakech', quantity: 2, price: 349, variant: 'Marron Vintage' }],
    subtotal: 598,
    shippingFee: 20,
    total: 618,
    courier: 'ozon',
    agentNotes: 'Client a commandé le Pack Duo.',
  },
  {
    id: 'ord_102',
    orderNumber: 'CMD-84919',
    storeSlug: 'ottavio',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    customerName: 'Fatima Ezzahra Kadiri',
    phone: '0678901234',
    city: 'Rabat',
    address: 'Agdal, Avenue Fal Ould Oumeir, N° 12',
    status: 'to_confirm',
    items: [{ id: 'it_2', title: 'Pochette Luxe Brodée', quantity: 1, price: 299 }],
    subtotal: 299,
    shippingFee: 25,
    total: 324,
    courier: 'ozon',
    agentNotes: 'Ne répond pas au 1er appel. Rappeler vers 16h.',
  },
  {
    id: 'ord_103',
    orderNumber: 'CMD-84918',
    storeSlug: 'ottavio',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    customerName: 'Yassine Mansouri',
    phone: '0665432198',
    city: 'Marrakech',
    address: 'Gueliz, Bd Mohammed V',
    status: 'confirmed',
    items: [{ id: 'it_1', title: 'Sac Cuir Artisanal Marrakech', quantity: 1, price: 349 }],
    subtotal: 349,
    shippingFee: 30,
    total: 379,
    courier: 'ozon',
    agentNotes: 'Confirmé par agent Salma. Expédition prête.',
  },
  {
    id: 'ord_104',
    orderNumber: 'CMD-84915',
    storeSlug: 'ottavio',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    customerName: 'Nadia Cherkaoui',
    phone: '0612348765',
    city: 'Tanger',
    address: 'Malabata, Résidence Vue Mer',
    status: 'shipping',
    items: [{ id: 'it_3', title: 'Ceinture Cuir Fait Main', quantity: 2, price: 180 }],
    subtotal: 360,
    shippingFee: 30,
    total: 390,
    courier: 'ozon',
    trackingNumber: 'OZON-MA-948291',
  },
  {
    id: 'ord_105',
    orderNumber: 'CMD-84910',
    storeSlug: 'ottavio',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    customerName: 'Hicham Tahiri',
    phone: '0655443322',
    city: 'Casablanca',
    address: 'Bourgogne, Rue Pierre Parent',
    status: 'delivered',
    items: [{ id: 'it_1', title: 'Sac Cuir Artisanal Marrakech', quantity: 1, price: 349 }],
    subtotal: 349,
    shippingFee: 20,
    total: 369,
    courier: 'ozon',
    trackingNumber: 'OZON-MA-948102',
    agentNotes: 'Colis livré et fonds encaissés par le coursier.',
  },
  {
    id: 'ord_106',
    orderNumber: 'CMD-84902',
    storeSlug: 'ottavio',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    customerName: 'Samir Alaoui',
    phone: '0622334455',
    city: 'Fes',
    address: 'Atlas, Rue des Saadiens',
    status: 'returned',
    items: [{ id: 'it_2', title: 'Pochette Luxe Brodée', quantity: 1, price: 299 }],
    subtotal: 299,
    shippingFee: 30,
    total: 329,
    courier: 'sendit',
    trackingNumber: 'SENDIT-992182',
    agentNotes: 'Client injoignable après 3 tentatives de passage.',
  },
];

// ── Seed Moroccan Products ──────────────────────────────────────
export let PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    storeSlug: 'ottavio',
    title: 'Sac Cuir Artisanal Marrakech',
    sku: 'OTT-BAG-01',
    category: 'Maroquinerie & Cuir',
    price: 349,
    comparePrice: 590,
    costPrice: 110,
    stock: 24,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
    variants: [
      { color: 'Marron Cuir', stock: 14 },
      { color: 'Noir Onyx', stock: 10 },
    ],
    status: 'active',
  },
  {
    id: 'prod_2',
    storeSlug: 'ottavio',
    title: 'Pochette de Soirée Brodée Faite Main',
    sku: 'OTT-POUCH-02',
    category: 'Maroquinerie & Cuir',
    price: 299,
    comparePrice: 450,
    costPrice: 85,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop'],
    variants: [{ color: 'Or Traditionnel', stock: 8 }],
    status: 'active',
  },
  {
    id: 'prod_3',
    storeSlug: 'ottavio',
    title: 'Ceinture Cuir Pur Tannage Végétal',
    sku: 'OTT-BELT-03',
    category: 'Accessoires',
    price: 180,
    comparePrice: 280,
    costPrice: 45,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'],
    variants: [
      { size: 'M (90cm)', stock: 15 },
      { size: 'L (105cm)', stock: 20 },
    ],
    status: 'active',
  },
  {
    id: 'prod_4',
    storeSlug: 'ottavio',
    title: 'Babouches Royales de Fès en Cuir',
    sku: 'OTT-SHOES-04',
    category: 'Chaussures & Babouches',
    price: 260,
    comparePrice: 380,
    costPrice: 70,
    stock: 4,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'],
    variants: [
      { size: '41', stock: 1 },
      { size: '42', stock: 2 },
      { size: '43', stock: 1 },
    ],
    status: 'active',
  },
];

// ── Seed Categories ─────────────────────────────────────────────
export let CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Maroquinerie & Cuir', slug: 'maroquinerie', productCount: 2 },
  { id: 'cat_2', name: 'Accessoires', slug: 'accessoires', productCount: 1 },
  { id: 'cat_3', name: 'Chaussures & Babouches', slug: 'chaussures', productCount: 1 },
  { id: 'cat_4', name: 'Tenues & Caftans', slug: 'caftans', productCount: 0 },
];

// ── Seed Customers ──────────────────────────────────────────────
export let CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    storeSlug: 'ottavio',
    name: 'Berrada Yasmine',
    phone: '0612345678',
    email: 'yasmine.berrada@gmail.com',
    city: 'Casablanca',
    totalOrders: 3,
    totalSpend: 1047,
    averageBasket: 349,
    lastOrderDate: "Aujourd'hui",
    status: 'returning',
  },
  {
    id: 'cust_2',
    storeSlug: 'ottavio',
    name: 'Karim Bennani',
    phone: '0661234567',
    email: 'k.bennani@outlook.com',
    city: 'Casablanca',
    totalOrders: 2,
    totalSpend: 698,
    averageBasket: 349,
    lastOrderDate: 'Hier',
    status: 'active',
  },
  {
    id: 'cust_3',
    storeSlug: 'ottavio',
    name: 'Fatima Ezzahra Kadiri',
    phone: '0678901234',
    email: 'fe.kadiri@gmail.com',
    city: 'Rabat',
    totalOrders: 1,
    totalSpend: 299,
    averageBasket: 299,
    lastOrderDate: 'Il y a 3 jours',
    status: 'new',
  },
  {
    id: 'cust_4',
    storeSlug: 'ottavio',
    name: 'Yassine Mansouri',
    phone: '0665432198',
    email: 'yassine.m@gmail.com',
    city: 'Marrakech',
    totalOrders: 4,
    totalSpend: 1396,
    averageBasket: 349,
    lastOrderDate: 'Il y a 5 jours',
    status: 'returning',
  },
  {
    id: 'cust_5',
    storeSlug: 'ottavio',
    name: 'Nadia Cherkaoui',
    phone: '0612348765',
    email: 'nadia.cherkaoui@yahoo.fr',
    city: 'Tanger',
    totalOrders: 1,
    totalSpend: 360,
    averageBasket: 360,
    lastOrderDate: 'Il y a 1 semaine',
    status: 'new',
  },
  {
    id: 'cust_6',
    storeSlug: 'ottavio',
    name: 'Hicham Tahiri',
    phone: '0655443322',
    email: 'hicham.tahiri@gmail.com',
    city: 'Casablanca',
    totalOrders: 2,
    totalSpend: 718,
    averageBasket: 359,
    lastOrderDate: 'Il y a 2 semaines',
    status: 'active',
  },
];

// ── Payment Gateways ────────────────────────────────────────────
export let PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    id: 'gw_cod',
    name: 'Paiement à la Livraison (Cash on Delivery)',
    type: 'cod',
    active: true,
    description: 'Le client paye en dirhams (MAD) au livreur lors de la réception du colis.',
    feeInfo: '0% de frais de passerelle',
  },
  {
    id: 'gw_virement',
    name: 'Virement Bancaire / Wafacash / Cash Plus',
    type: 'virement',
    active: true,
    description: 'Affichage de votre RIB bancaire marocain (Attijariwafa, CIH...) ou compte Cash Plus.',
    feeInfo: '0% de commission',
  },
  {
    id: 'gw_stripe',
    name: 'Carte Bancaire Marocaine / CMI / Stripe',
    type: 'card',
    active: false,
    description: 'Paiement en ligne sécurisé par carte bancaire nationale et internationale.',
    feeInfo: '1.4% + 2 DH par transaction',
  },
  {
    id: 'gw_paypal',
    name: 'PayPal Express & Portefeuilles Électroniques',
    type: 'wallet',
    active: false,
    description: "Idéal pour les clients MRE (Marocains résidant à l'étranger) ou ventes internationales.",
    feeInfo: '3.4% + frais PayPal',
  },
];

// ── Mock data helpers ───────────────────────────────────────────

export function getOrders(storeSlug: string): Order[] {
  if (!storeSlug) throw new Error('storeSlug is required');
  return ORDERS.filter((o) => o.storeSlug === storeSlug);
}

export const VALID_STATUSES: Order['status'][] = ['new', 'to_confirm', 'confirmed', 'shipping', 'delivered', 'returned', 'canceled'] as const;

export function updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string): boolean {
  if (!VALID_STATUSES.includes(status)) return false;
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return false;
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  return true;
}

export function getProducts(storeSlug: string): Product[] {
  if (!storeSlug) throw new Error('storeSlug is required');
  return PRODUCTS.filter((p) => p.storeSlug === storeSlug);
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  if (!product.title?.trim() || (product.price ?? 0) < 0 || (product.stock ?? 0) < 0) throw new Error('Invalid product input');
  const newProd: Product = {
    ...product,
    id: `prod_${Date.now()}`,
  };
  PRODUCTS.push(newProd); // append instead of unshift — avoids unbounded growth pattern
  if (PRODUCTS.length > 200) PRODUCTS.shift(); // cap total in-memory records
  return newProd;
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCustomers(storeSlug: string): Customer[] {
  if (!storeSlug) throw new Error('storeSlug is required');
  return CUSTOMERS.filter((c) => c.storeSlug === storeSlug);
}

export function getPaymentGateways(): PaymentGateway[] {
  return PAYMENT_GATEWAYS;
}

export function togglePaymentGateway(id: string): boolean {
  const gw = PAYMENT_GATEWAYS.find((g) => g.id === id);
  if (!gw) return false;
  gw.active = !gw.active;
  return true;
}

/** Reset all mock arrays to initial seed (useful for tests). */
export function resetMocks(): void {
  // No-op placeholder — re-importing module resets via HMR in dev;
  // kept for test convenience.
}
