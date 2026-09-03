export type OrderStatus = 
  | 'new'           // Nouvelle commande
  | 'to_confirm'     // À confirmer par téléphone
  | 'confirmed'      // Confirmée par le client
  | 'shipping'       // En cours de livraison (Ozon/SendIt)
  | 'delivered'      // Livrée & Encaissée (Cash collecté)
  | 'returned'       // Colis refusé ou retourné
  | 'canceled';      // Annulée

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  storeSlug: string;
  createdAt: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  courier?: 'ozon' | 'sendit' | 'manual';
  trackingNumber?: string;
  agentNotes?: string;
}

export interface Product {
  id: string;
  storeSlug: string;
  title: string;
  sku: string;
  category: string;
  price: number;
  comparePrice?: number;
  costPrice: number; // Prix de revient pour calcul du bénéfice net
  stock: number;
  images: string[];
  variants: { size?: string; color?: string; stock: number }[];
  status: 'active' | 'draft';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

// Seed Moroccan Orders
let ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'CMD-84920',
    storeSlug: 'ottavio',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
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

// Seed Moroccan Products
let PRODUCTS: Product[] = [
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
    stock: 4, // Low stock alert!
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'],
    variants: [
      { size: '41', stock: 1 },
      { size: '42', stock: 2 },
      { size: '43', stock: 1 },
    ],
    status: 'active',
  },
];

// Seed Categories
let CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Maroquinerie & Cuir', slug: 'maroquinerie', productCount: 2 },
  { id: 'cat_2', name: 'Accessoires', slug: 'accessoires', productCount: 1 },
  { id: 'cat_3', name: 'Chaussures & Babouches', slug: 'chaussures', productCount: 1 },
  { id: 'cat_4', name: 'Tenues & Caftans', slug: 'caftans', productCount: 0 },
];

export function getOrders(storeSlug?: string): Order[] {
  if (storeSlug) {
    return ORDERS.filter((o) => o.storeSlug === storeSlug);
  }
  return ORDERS;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string): boolean {
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return false;
  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  return true;
}

export function getProducts(storeSlug?: string): Product[] {
  if (storeSlug) {
    return PRODUCTS.filter((p) => p.storeSlug === storeSlug);
  }
  return PRODUCTS;
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const newProd: Product = {
    ...product,
    id: `prod_${Date.now()}`,
  };
  PRODUCTS.unshift(newProd);
  return newProd;
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

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
  const totalCostOfGoods = deliveredOrders.reduce((acc, curr) => acc + (curr.subtotal * 0.32), 0); // ~32% cost
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
