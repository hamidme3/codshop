import type { Order, Product, Category, Customer, PaymentGateway, OrderStatus, CustomerOrderSummary } from './types';
import { restoreMockProductStock, decrementMockProductStock } from './mockProducts';

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
      { color: 'Marron Cuir', stock: 14, sku: 'OTT-BAG-01-BRN' },
      { color: 'Noir Onyx', stock: 10, sku: 'OTT-BAG-01-BLK' },
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
    variants: [{ color: 'Or Traditionnel', stock: 8, sku: 'OTT-POUCH-02-GLD' }],
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
      { size: 'M (90cm)', stock: 15, sku: 'OTT-BELT-03-M' },
      { size: 'L (105cm)', stock: 20, sku: 'OTT-BELT-03-L' },
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
      { size: '41', stock: 1, sku: 'OTT-SHOES-04-41' },
      { size: '42', stock: 2, sku: 'OTT-SHOES-04-42' },
      { size: '43', stock: 1, sku: 'OTT-SHOES-04-43' },
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

/**
 * Normalizes Moroccan phone number for CRM customer identification
 */
function normalizeCustomerPhone(phone?: string): string {
  if (!phone) return '';
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('212') && digits.length === 12) {
    digits = `0${digits.slice(3)}`;
  } else if (digits.startsWith('00212') && digits.length === 14) {
    digits = `0${digits.slice(5)}`;
  } else if (!digits.startsWith('0') && digits.length === 9) {
    digits = `0${digits}`;
  }
  return digits;
}

function formatRelativeOrderDate(dateStr?: string): string {
  if (!dateStr) return "Aujourd'hui";
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return "Aujourd'hui";
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return "Aujourd'hui";
  if (diffHours < 48) return 'Hier';
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} jours`;
}

/**
 * Synchronizes and computes live CRM customer profiles directly from store orders.
 * Seamlessly tracks:
 * - [1. Confirmer] (Cyan): increments confirmedOrders and sets lastOrderStatus = 'confirmed'
 * - [2. Expédier] (Orange): increments shippedOrders, records trackingNumber, and sets lastOrderStatus = 'shipped'
 * - [3. Livrée] (Green): increments deliveredOrders, updates paid totalSpend and sets lastOrderStatus = 'delivered'
 * - Canceled/Returned: records return risk flags
 */
export function syncCustomersFromOrders(storeSlug: string): Customer[] {
  if (!storeSlug) throw new Error('storeSlug is required');

  const storeOrders = ORDERS.filter((o) => o.storeSlug === storeSlug);
  const customerMap = new Map<string, Customer>();

  // 1. Seed with existing CUSTOMERS for contact info/email retention
  for (const c of CUSTOMERS.filter((c) => c.storeSlug === storeSlug)) {
    const key = normalizeCustomerPhone(c.phone) || c.name.toLowerCase().trim();
    customerMap.set(key, {
      ...c,
      confirmedOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      returnedOrders: 0,
      canceledOrders: 0,
      recentOrders: [],
      totalSpend: c.totalSpend || 0,
    });
  }

  // 2. Sort orders from newest to oldest for accurate last-order state
  const sortedOrders = [...storeOrders].sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // 3. Aggregate each order into customer profiles
  for (const order of sortedOrders) {
    const key = normalizeCustomerPhone(order.phone) || order.customerName.toLowerCase().trim();
    let cust = customerMap.get(key);

    if (!cust) {
      cust = {
        id: `cust_${key || Date.now()}`,
        storeSlug,
        name: order.customerName,
        phone: order.phone,
        email: `${order.customerName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@client.ma`,
        city: order.city,
        address: order.address,
        totalOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        returnedOrders: 0,
        canceledOrders: 0,
        totalSpend: 0,
        averageBasket: 0,
        lastOrderDate: formatRelativeOrderDate(order.createdAt),
        status: 'new',
        recentOrders: [],
      };
      customerMap.set(key, cust);
    }

    // Keep name/city/address up to date from most recent orders
    if (!cust.address && order.address) cust.address = order.address;
    if (order.city) cust.city = order.city;

    const itemsSummary = (order.items || [])
      .map((it) => `${it.title}${it.variant ? ` (${it.variant})` : ''} x${it.quantity}`)
      .join(', ');

    cust.recentOrders = cust.recentOrders || [];
    cust.recentOrders.push({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
      itemsSummary,
      courier: order.courier,
      trackingNumber: order.trackingNumber,
    });

    // Count 3-stage switch pipeline statuses
    if (order.status === 'confirmed') {
      cust.confirmedOrders = (cust.confirmedOrders || 0) + 1;
    } else if (order.status === 'shipped' || order.status === 'shipping') {
      cust.shippedOrders = (cust.shippedOrders || 0) + 1;
    } else if (order.status === 'delivered') {
      cust.deliveredOrders = (cust.deliveredOrders || 0) + 1;
    } else if (order.status === 'returned' || order.status === 'canceled') {
      cust.returnedOrders = (cust.returnedOrders || 0) + 1;
    }
  }

  // 4. Compute final CRM metrics for each customer
  const result: Customer[] = [];

  for (const cust of Array.from(customerMap.values())) {
    const ordersList = cust.recentOrders || [];
    cust.totalOrders = Math.max(cust.totalOrders || 0, ordersList.length);

    // Latest order is the first item (since sorted desc)
    const latestOrder = ordersList[0];
    if (latestOrder) {
      cust.lastOrderNumber = latestOrder.orderNumber;
      cust.lastOrderStatus = latestOrder.status;
      cust.lastTrackingNumber = latestOrder.trackingNumber;
      cust.lastOrderDate = formatRelativeOrderDate(latestOrder.createdAt);
    }

    // Cash delivered total spend (Strict Moroccan COD: Only count collected cash upon delivery)
    const deliveredSum = ordersList
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    
    const initialSpend = cust.totalSpend || 0;
    cust.totalSpend = deliveredSum > 0 ? deliveredSum : initialSpend;

    cust.averageBasket = cust.totalOrders > 0 ? Math.round(cust.totalSpend / Math.max(1, cust.deliveredOrders || cust.totalOrders)) : 0;

    // Delivery Success Rate: delivered / (delivered + returned)
    const finishedShipments = (cust.deliveredOrders || 0) + (cust.returnedOrders || 0);
    if (finishedShipments > 0) {
      cust.deliverySuccessRate = Math.round(((cust.deliveredOrders || 0) / finishedShipments) * 100);
    } else {
      cust.deliverySuccessRate = (cust.returnedOrders || 0) > 0 ? 0 : 100;
    }

    // Status classification:
    if ((cust.returnedOrders || 0) > 0) {
      cust.status = 'risk';
    } else if ((cust.deliveredOrders || 0) >= 2 || (cust.totalOrders >= 2 && (cust.deliveredOrders || 0) >= 1)) {
      cust.status = 'returning'; // Client VIP / Fidèle
    } else if ((cust.deliveredOrders || 0) >= 1 || (cust.shippedOrders || 0) >= 1 || (cust.confirmedOrders || 0) >= 1) {
      cust.status = 'active'; // Client Actif
    } else {
      cust.status = 'new'; // Nouveau Client
    }

    result.push(cust);
  }

  // Update global CUSTOMERS in memory to keep parity
  CUSTOMERS = result;

  return result;
}

export const VALID_STATUSES: Order['status'][] = ['new', 'to_confirm', 'confirmed', 'shipped', 'shipping', 'delivered', 'returned', 'canceled'] as const;

export function updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string, courier?: Order['courier']): boolean {
  if (!VALID_STATUSES.includes(status)) return false;
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return false;

  const previousStatus = order.status;
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courier) order.courier = courier;

  // Add contextual timestamps for pipeline audit
  const nowIso = new Date().toISOString();
  if (status === 'confirmed' && !order.confirmedAt) order.confirmedAt = nowIso;
  if (status === 'shipped' && !order.shippedAt) order.shippedAt = nowIso;
  if (status === 'delivered' && !order.deliveredAt) order.deliveredAt = nowIso;
  if (status === 'canceled' && !order.canceledAt) order.canceledAt = nowIso;
  if (status === 'returned' && !order.returnedAt) order.returnedAt = nowIso;

  // Restore inventory if transitioned to canceled or returned from an active state
  if ((status === 'canceled' || status === 'returned') && previousStatus !== 'canceled' && previousStatus !== 'returned') {
    for (const item of order.items) {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      if (prod) {
        prod.stock = (prod.stock ?? 0) + item.quantity;
      }
      restoreMockProductStock(item.id, item.quantity, { variant: item.variant });
    }
  } else if ((previousStatus === 'canceled' || previousStatus === 'returned') && status !== 'canceled' && status !== 'returned') {
    // Re-decrement inventory when transitioning back to an active state
    for (const item of order.items) {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, (prod.stock ?? 0) - item.quantity);
      }
      decrementMockProductStock(item.id, item.quantity, { variant: item.variant });
    }
  }

  // Synchronize CRM immediately
  syncCustomersFromOrders(order.storeSlug);

  // Broadcast real-time update event to CRM and active browser tabs
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cod_orders_updated', { detail: { orderId, status } }));
    try {
      const bc = new BroadcastChannel('cod_pipeline_sync');
      bc.postMessage({ type: 'ORDER_UPDATED', orderId, status });
      bc.close();
    } catch (_) {}
  }

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

export function deleteProduct(productId: string): boolean {
  const index = PRODUCTS.findIndex((p) => p.id === productId);
  if (index === -1) return false;
  PRODUCTS.splice(index, 1);
  return true;
}

export function updateProductStock(productId: string, newStock: number): boolean {
  const prod = PRODUCTS.find((p) => p.id === productId);
  if (!prod) return false;
  prod.stock = Math.max(0, newStock);
  return true;
}

export function getCategories(storeSlug: string = 'ottavio'): Category[] {
  const storeProducts = PRODUCTS.filter((p) => !storeSlug || p.storeSlug === storeSlug);
  return CATEGORIES.map((cat) => {
    const count = storeProducts.filter((p) => {
      const pCat = (p.category || '').toLowerCase().trim();
      const cName = cat.name.toLowerCase().trim();
      const cSlug = cat.slug.toLowerCase().trim();
      return pCat === cName || pCat === cSlug;
    }).length;
    return {
      ...cat,
      productCount: count,
    };
  });
}

export function addCategory(category: { name: string; slug?: string }): Category {
  const trimmedName = category.name.trim();
  if (!trimmedName) throw new Error('Le nom de la catégorie est obligatoire.');
  const slug = (category.slug?.trim() || trimmedName)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existing = CATEGORIES.find(
    (c) => c.slug === slug || c.name.toLowerCase().trim() === trimmedName.toLowerCase()
  );
  if (existing) {
    return existing;
  }

  const newCat: Category = {
    id: `cat_${Date.now()}`,
    name: trimmedName,
    slug: slug || `cat-${Date.now()}`,
    productCount: 0,
  };
  CATEGORIES.push(newCat);
  return newCat;
}

export function deleteCategory(idOrSlug: string, storeSlug: string = 'ottavio'): { success: boolean; error?: string } {
  const cat = CATEGORIES.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  if (!cat) return { success: false, error: 'Catégorie introuvable.' };

  const storeProducts = PRODUCTS.filter((p) => !storeSlug || p.storeSlug === storeSlug);
  const activeProducts = storeProducts.filter((p) => {
    const pCat = (p.category || '').toLowerCase().trim();
    return pCat === cat.name.toLowerCase().trim() || pCat === cat.slug.toLowerCase().trim();
  });

  if (activeProducts.length > 0) {
    return {
      success: false,
      error: `Impossible de supprimer "${cat.name}" : ${activeProducts.length} produit(s) y sont encore associés dans votre catalogue. Réassignez d'abord ces produits.`,
    };
  }

  CATEGORIES = CATEGORIES.filter((c) => c.id !== cat.id);
  return { success: true };
}

export function deleteOrder(orderId: string, storeSlug: string = 'ottavio'): boolean {
  const index = ORDERS.findIndex((o) => o.id === orderId);
  if (index === -1) return false;
  const order = ORDERS[index];

  // Restore inventory if order was active (not canceled or returned)
  if (order.status !== 'canceled' && order.status !== 'returned') {
    for (const item of order.items) {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      if (prod) {
        prod.stock = (prod.stock ?? 0) + item.quantity;
      }
      restoreMockProductStock(item.id, item.quantity, { variant: item.variant });
    }
  }

  ORDERS.splice(index, 1);
  syncCustomersFromOrders(order.storeSlug || storeSlug);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cod_orders_updated', { detail: { orderId, action: 'deleted' } }));
  }

  return true;
}

export function getCustomers(storeSlug: string): Customer[] {
  if (!storeSlug) throw new Error('storeSlug is required');
  return syncCustomersFromOrders(storeSlug);
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

export interface InventoryItemRequest {
  id?: string;
  sku?: string;
  title?: string;
  variant?: string;
  size?: string;
  color?: string;
  quantity: number;
}

export function checkInventory(
  storeSlug: string,
  items: InventoryItemRequest[]
): { available: boolean; error?: string; itemErrors?: { sku?: string; title: string; available: number; requested: number }[] } {
  const storeProducts = PRODUCTS.filter((p) => p.storeSlug === storeSlug);
  const errors: { sku?: string; title: string; available: number; requested: number }[] = [];

  for (const item of items) {
    const prod = storeProducts.find(
      (p) => (item.id && p.id === item.id) || (item.sku && p.sku === item.sku) || (item.title && p.title.toLowerCase() === item.title.toLowerCase())
    );

    if (!prod) continue;

    if (prod.variants && prod.variants.length > 0) {
      const matchVariant = prod.variants.find((v) => {
        if (item.sku && v.sku === item.sku) return true;
        if (item.color && v.color?.toLowerCase() === item.color.toLowerCase()) return true;
        if (item.size && v.size?.toLowerCase() === item.size.toLowerCase()) return true;
        if (item.variant && (v.color?.toLowerCase() === item.variant.toLowerCase() || v.size?.toLowerCase() === item.variant.toLowerCase())) return true;
        return false;
      });

      if (matchVariant) {
        if (matchVariant.stock < item.quantity) {
          errors.push({
            sku: matchVariant.sku || prod.sku,
            title: `${prod.title} (${matchVariant.color || matchVariant.size || 'Variante'})`,
            available: matchVariant.stock,
            requested: item.quantity,
          });
        }
        continue;
      }
    }

    if (prod.stock < item.quantity) {
      errors.push({
        sku: prod.sku,
        title: prod.title,
        available: prod.stock,
        requested: item.quantity,
      });
    }
  }

  if (errors.length > 0) {
    const detail = errors.map((e) => `'${e.title}': ${e.available} en stock (demandé: ${e.requested})`).join(', ');
    return {
      available: false,
      error: `Rupture ou stock insuffisant : ${detail}`,
      itemErrors: errors,
    };
  }

  return { available: true };
}

export function decrementInventory(
  storeSlug: string,
  items: InventoryItemRequest[]
): boolean {
  const storeProducts = PRODUCTS.filter((p) => p.storeSlug === storeSlug);

  for (const item of items) {
    const prod = storeProducts.find(
      (p) => (item.id && p.id === item.id) || (item.sku && p.sku === item.sku) || (item.title && p.title.toLowerCase() === item.title.toLowerCase())
    );

    if (!prod) continue;

    if (prod.variants && prod.variants.length > 0) {
      const matchVariant = prod.variants.find((v) => {
        if (item.sku && v.sku === item.sku) return true;
        if (item.color && v.color?.toLowerCase() === item.color.toLowerCase()) return true;
        if (item.size && v.size?.toLowerCase() === item.size.toLowerCase()) return true;
        if (item.variant && (v.color?.toLowerCase() === item.variant.toLowerCase() || v.size?.toLowerCase() === item.variant.toLowerCase())) return true;
        return false;
      });

      if (matchVariant) {
        matchVariant.stock = Math.max(0, matchVariant.stock - item.quantity);
      }
    }

    prod.stock = Math.max(0, prod.stock - item.quantity);
  }

  return true;
}

/** Reset all mock arrays to initial seed (useful for tests). */
export function resetMocks(): void {
  // No-op placeholder — re-importing module resets via HMR in dev;
  // kept for test convenience.
}
