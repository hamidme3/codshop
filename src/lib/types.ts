export type OrderStatus =
  | 'new' // Nouvelle commande
  | 'to_confirm' // À confirmer par téléphone
  | 'confirmed' // Confirmée par le client
  | 'shipped' // Expédiée avec transporteur
  | 'shipping' // Alias rétrocompatible pour shipped
  | 'delivered' // Livrée & Encaissée (Cash collecté)
  | 'returned' // Colis refusé ou retourné
  | 'canceled' // Annulée
  | 'abandoned'; // Panier abandonné récupérable

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
  shippedAt?: string;
  agentNotes?: string;
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
  abandonedOrders?: number;
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

// ── Navigation & Menus ──────────────────────────────────────────
export type MenuPlacement = 'header' | 'mobile_drawer' | 'footer_col_1' | 'footer_col_2';

export type MenuLinkType = 'home' | 'catalog' | 'category' | 'product' | 'page' | 'whatsapp' | 'url';

export interface MenuItem {
  id: string;
  label: string;
  type: MenuLinkType;
  url: string;
  targetId?: string; // Optional category slug, product SKU/ID, or page slug
  badgeText?: string; // e.g. "HOT", "NEW", "PROMO"
  badgeColor?: 'primary' | 'accent' | 'rose' | 'amber' | 'emerald';
  isOpenNewTab?: boolean;
  order: number;
  children?: MenuItem[]; // Up to 2 levels of nesting
}

export interface StoreMenu {
  id: string;
  storeSlug: string;
  placement: MenuPlacement;
  title: string;
  items: MenuItem[];
  updatedAt: string;
}

// ── Custom Pages & Legal Policies ──────────────────────────────
export type PolicyType = 'terms' | 'privacy' | 'shipping' | 'returns' | 'about' | 'custom';

export interface StorePage {
  id: string;
  storeSlug: string;
  title: string;
  slug: string;
  content: string;
  policyType: PolicyType;
  isSystemPolicy: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}


export interface QuantityTier {
  quantity: number;
  label: string;
  labelAr?: string;
  unitPrice: number;
  totalPrice: number;
  savingsBadge?: string;
  isPopular?: boolean;
  freeDelivery?: boolean;
  freeGift?: string;
  badge?: string;
  badgeAr?: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "41", "42", "50ml", "Noir"
  inStock: boolean;
  sku?: string;
  stock?: number;
  image?: string;
  color?: string;
  size?: string;
  price?: number;
}

export interface ProductColorOption {
  id: string;
  name: string;
  hex?: string;
  image?: string;
  inStock?: boolean;
}

export interface ProductSizeOption {
  id: string;
  name: string;
  inStock?: boolean;
}

export interface VariantMatrixItem {
  id: string;
  sku: string;
  color?: string;
  size?: string;
  stock: number;
  inStock: boolean;
  image?: string;
  price?: number;
}

export interface StorefrontProduct {
  id: string;
  slug: string;
  sku: string;
  theme: any;
  title: string;
  titleAr?: string;
  tagline: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  stockLeft: number;
  images: string[];
  description: string;
  features: string[];
  colors?: ProductColorOption[];
  sizes?: ProductSizeOption[];
  variantMatrix?: VariantMatrixItem[];
  variants?: {
    type: 'size' | 'color' | 'volume' | 'multi';
    label: string;
    options: ProductVariant[];
  };
  quantityTiers: QuantityTier[];
  whatsAppDirectNumber: string; // "+212600000000"
}
