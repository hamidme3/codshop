export type OrderStatus =
  | 'new' // Nouvelle commande
  | 'to_confirm' // À confirmer par téléphone
  | 'confirmed' // Confirmée par le client
  | 'shipping' // En cours de livraison (Ozon/SendIt)
  | 'delivered' // Livrée & Encaissée (Cash collecté)
  | 'returned' // Colis refusé ou retourné
  | 'canceled'; // Annulée

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

export interface Customer {
  id: string;
  storeSlug: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  averageBasket: number;
  lastOrderDate: string;
  status: 'active' | 'new' | 'returning';
}

export interface FunnelStep {
  name: string;
  visitors: number;
  percentage: number;
  dropoff: number;
}

export interface PaymentGateway {
  id: string;
  name: string;
  type: 'cod' | 'virement' | 'card' | 'wallet';
  active: boolean;
  description: string;
  feeInfo: string;
}
