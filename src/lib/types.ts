export type OrderStatus =
  | 'new' // Nouvelle commande
  | 'to_confirm' // À confirmer par téléphone
  | 'confirmed' // Confirmée par le client
  | 'shipped' // Expédiée avec transporteur
  | 'shipping' // Alias rétrocompatible pour shipped
  | 'delivered' // Livrée & Encaissée (Cash collecté)
  | 'returned' // Colis refusé ou retourné
  | 'canceled'; // Annulée

export type CourierName = 'manual' | 'standard' | 'ozon' | 'sendit' | 'cathedis' | 'amana' | string;

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  variant?: string;
  sku?: string;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  storeSlug: string;
  createdAt: string;
  customerName: string;
  email?: string;
  phone: string;
  city: string;
  address: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  courier?: CourierName;
  trackingNumber?: string;
  agentNotes?: string;
  abVariant?: 'control' | 'waybill' | string;
  deliveryType?: 'home' | 'stopdesk';
  agencyName?: string;
  source?: 'web' | 'whatsapp';
  countryCode?: string;
  currency?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  returnedAt?: string;
  canceledAt?: string;
}

export interface ProductVariantItem {
  id?: string;
  size?: string;
  color?: string;
  stock: number;
  sku?: string;
  image?: string;
  price?: number;
  comparePrice?: number;
  costPrice?: number;
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
  variants: ProductVariantItem[];
  status: 'active' | 'draft';
  badge?: string;
  packDuoPrice?: number;
  packDuoFreeShipping?: boolean;
  packTrioPrice?: number;
  packTrioGift?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  icon?: string;
  description?: string;
}

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  itemsSummary: string;
  courier?: string;
  trackingNumber?: string;
  countryCode?: string;
  currency?: string;
}

export interface Customer {
  id: string;
  storeSlug: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
  addressNotes?: string;
  totalOrders: number;
  confirmedOrders?: number;
  shippedOrders?: number;
  deliveredOrders?: number;
  returnedOrders?: number;
  canceledOrders?: number;
  totalSpend: number;
  averageBasket: number;
  lastOrderDate: string;
  lastOrderNumber?: string;
  lastOrderStatus?: OrderStatus;
  lastTrackingNumber?: string;
  deliverySuccessRate?: number;
  status: 'active' | 'new' | 'returning' | 'risk';
  recentOrders?: CustomerOrderSummary[];
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
