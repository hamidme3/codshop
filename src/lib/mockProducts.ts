import { ThemeId } from './themes';
import { COUNTRIES } from './geo/countries';

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

export interface Product {
  id: string;
  slug: string;
  sku: string;
  theme: ThemeId;
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

export const MOCK_PRODUCTS: Product[] = [
  // LUXURY / FASHION — Dual Axis (Color + Size)
  {
    id: 'lux-1',
    slug: 'souliers-richelieu-cuir-italien',
    sku: 'OTT-RICHELIEU',
    theme: 'luxury',
    title: 'Souliers Richelieu Cousu Goodyear',
    titleAr: 'حذاء كلاسيكي من الجلد الطبيعي الأصيل',
    tagline: 'Cuir pleine fleur italien tanné végétalement, patiné à la main à Fès',
    price: 699,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 148,
    stockLeft: 23,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80', // Marron
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', // Noir
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80', // Cognac
    ],
    description: 'Une pièce maîtresse d’élégance intemporelle. Confectionné selon la noble tradition du cousu Goodyear, ce modèle offre un confort ergonomique exceptionnel et une longévité de plus de 10 ans.',
    features: [
      'Cuir de veau pleine fleur importé d’Italie',
      'Semelle extérieure en cuir renforcée avec patin gomme anti-dérapant',
      'Doublure respirante anti-transpiration',
      'Livré avec embauchoirs en bois et crème de soin offerte',
    ],
    colors: [
      {
        id: 'marron',
        name: 'Marron Vintage',
        hex: '#5c3826',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
        inStock: true,
      },
      {
        id: 'noir',
        name: 'Noir Onyx',
        hex: '#18181b',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
        inStock: true,
      },
      {
        id: 'cognac',
        name: 'Cognac Patiné',
        hex: '#9a3412',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
        inStock: true,
      },
    ],
    sizes: [
      { id: '39', name: '39', inStock: true },
      { id: '40', name: '40', inStock: true },
      { id: '41', name: '41', inStock: true },
      { id: '42', name: '42', inStock: true },
      { id: '43', name: '43', inStock: true },
      { id: '44', name: '44', inStock: false },
      { id: '45', name: '45', inStock: true },
    ],
    variantMatrix: [
      // Marron Vintage
      { id: 'vm-rich-m-39', sku: 'OTT-RICH-BRN-39', color: 'Marron Vintage', size: '39', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-m-40', sku: 'OTT-RICH-BRN-40', color: 'Marron Vintage', size: '40', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-m-41', sku: 'OTT-RICH-BRN-41', color: 'Marron Vintage', size: '41', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-m-42', sku: 'OTT-RICH-BRN-42', color: 'Marron Vintage', size: '42', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-m-43', sku: 'OTT-RICH-BRN-43', color: 'Marron Vintage', size: '43', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-m-44', sku: 'OTT-RICH-BRN-44', color: 'Marron Vintage', size: '44', stock: 0, inStock: false, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-m-45', sku: 'OTT-RICH-BRN-45', color: 'Marron Vintage', size: '45', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80' },
      // Noir Onyx
      { id: 'vm-rich-n-39', sku: 'OTT-RICH-BLK-39', color: 'Noir Onyx', size: '39', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-n-40', sku: 'OTT-RICH-BLK-40', color: 'Noir Onyx', size: '40', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-n-41', sku: 'OTT-RICH-BLK-41', color: 'Noir Onyx', size: '41', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-n-42', sku: 'OTT-RICH-BLK-42', color: 'Noir Onyx', size: '42', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-n-43', sku: 'OTT-RICH-BLK-43', color: 'Noir Onyx', size: '43', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-n-44', sku: 'OTT-RICH-BLK-44', color: 'Noir Onyx', size: '44', stock: 0, inStock: false, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-n-45', sku: 'OTT-RICH-BLK-45', color: 'Noir Onyx', size: '45', stock: 0, inStock: false, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
      // Cognac Patiné
      { id: 'vm-rich-c-39', sku: 'OTT-RICH-COG-39', color: 'Cognac Patiné', size: '39', stock: 0, inStock: false, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-c-40', sku: 'OTT-RICH-COG-40', color: 'Cognac Patiné', size: '40', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-c-41', sku: 'OTT-RICH-COG-41', color: 'Cognac Patiné', size: '41', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-c-42', sku: 'OTT-RICH-COG-42', color: 'Cognac Patiné', size: '42', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-c-43', sku: 'OTT-RICH-COG-43', color: 'Cognac Patiné', size: '43', stock: 50, inStock: true, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-c-44', sku: 'OTT-RICH-COG-44', color: 'Cognac Patiné', size: '44', stock: 0, inStock: false, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-rich-c-45', sku: 'OTT-RICH-COG-45', color: 'Cognac Patiné', size: '45', stock: 0, inStock: false, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80' },
    ],
    variants: {
      type: 'multi',
      label: 'Pointure (EU)',
      options: [
        { id: '39', name: '39', inStock: true, sku: 'OTT-RICH-39' },
        { id: '40', name: '40', inStock: true, sku: 'OTT-RICH-40' },
        { id: '41', name: '41', inStock: true, sku: 'OTT-RICH-41' },
        { id: '42', name: '42', inStock: true, sku: 'OTT-RICH-42' },
        { id: '43', name: '43', inStock: true, sku: 'OTT-RICH-43' },
        { id: '44', name: '44', inStock: false, sku: 'OTT-RICH-44' },
        { id: '45', name: '45', inStock: true, sku: 'OTT-RICH-45' },
      ],
    },
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Paire (Standard)', unitPrice: 699, totalPrice: 699, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo (2 Paires)', unitPrice: 599, totalPrice: 1198, savingsBadge: 'Économisez 200 DH', isPopular: true, freeDelivery: true, badge: '🔥 Le Plus Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio VIP (3 Paires)', unitPrice: 549, totalPrice: 1647, savingsBadge: 'Économisez 450 DH + Embauchoirs Offerts 🎁', freeDelivery: true, freeGift: 'Embauchoirs en cèdre naturel offerts', badge: '💎 Pack Collectionneur' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  {
    id: 'lux-2',
    slug: 'sac-voyage-weekender-cuir',
    sku: 'OTT-WEEKENDER',
    theme: 'luxury',
    title: 'Sac de Voyage Weekender Grand Format',
    titleAr: 'حقيبة سفر من الجلد الفاخر',
    tagline: 'Le compagnon parfait de vos escapades et voyages d’affaires',
    price: 849,
    originalPrice: 1400,
    rating: 4.8,
    reviewCount: 92,
    stockLeft: 8,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Robuste et raffiné, ce sac weekender est taillé dans un cuir épais patiné naturellement avec le temps. Finitions laiton brossé et compartiment chaussures dédié.',
    features: [
      'Compartiment zippé indépendant pour 2 paires de souliers',
      'Bandoulière amovible réglable avec renfort épaule',
      'Format cabine accepté par toutes les compagnies aériennes',
    ],
    colors: [
      {
        id: 'havane',
        name: 'Cuir Havane / Cognac',
        hex: '#78350f',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        inStock: true,
      },
      {
        id: 'noir',
        name: 'Noir Ébène',
        hex: '#1c1917',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        inStock: true,
      },
    ],
    variantMatrix: [
      { id: 'vm-week-havane', sku: 'OTT-WEEK-HAV', color: 'Cuir Havane / Cognac', stock: 5, inStock: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-week-noir', sku: 'OTT-WEEK-BLK', color: 'Noir Ébène', stock: 3, inStock: true, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
    ],
    variants: {
      type: 'color',
      label: 'Couleur du Cuir',
      options: [
        { id: 'havane', name: 'Cuir Havane / Cognac', inStock: true, sku: 'OTT-WEEK-HAV', stock: 5 },
        { id: 'noir', name: 'Noir Ébène', inStock: true, sku: 'OTT-WEEK-BLK', stock: 3 },
      ],
    },
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Sac (Standard)', unitPrice: 849, totalPrice: 849, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo Prestige (2 Sacs)', unitPrice: 749, totalPrice: 1498, savingsBadge: 'Économisez 200 DH', isPopular: true, freeDelivery: true, badge: '🔥 Le Plus Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio Voyageur (3 Sacs)', unitPrice: 699, totalPrice: 2097, savingsBadge: 'Économisez 450 DH + Trousse Cuir Offerte 🎁', freeDelivery: true, freeGift: 'Trousse de toilette en cuir assortie offerte', badge: '💎 Pack Famille & Cadeaux' },
    ],
    whatsAppDirectNumber: '212661000000',
  },

  // BEAUTY / SKINCARE
  {
    id: 'bt-1',
    slug: 'elixir-huile-argan-pepites-or',
    sku: 'BIO-ARGAN',
    theme: 'beauty',
    title: 'Sérum Précieux Argan & Figue de Barbarie',
    titleAr: 'سيروم التين الشوكي وزيت الأركان النقي',
    tagline: '100% Biologique pressé à froid à Taroudant • Anti-âge & Éclat Royal',
    price: 249,
    originalPrice: 420,
    rating: 5.0,
    reviewCount: 312,
    stockLeft: 12,
    images: [
      'https://images.unsplash.com/photo-1608248597359-577c4493393b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Le secret de jeunesse des femmes marocaines. Une concentration ultime d’acides gras essentiels et de vitamine E naturelle pour lifter le visage, lisser les ridules et restaurer un teint éclatant dès 7 jours.',
    features: [
      'Huile de graines de figue de barbarie pure à 100% (certifiée bio)',
      'Texture légère et non grasse à pénétration immédiate',
      'Atténue visiblement les cernes, taches brunes et ridules',
      'Convient à tous types de peaux, même sensibles',
    ],
    variantMatrix: [
      { id: 'vm-argan-30', sku: 'BIO-ARG-30ML', size: '30 ml (Cure 1 Mois)', stock: 10, inStock: true },
      { id: 'vm-argan-50', sku: 'BIO-ARG-50ML', size: '50 ml (Format Économique)', stock: 2, inStock: true },
    ],
    variants: {
      type: 'volume',
      label: 'Contenance',
      options: [
        { id: '30ml', name: '30 ml (Cure 1 Mois)', inStock: true, sku: 'BIO-ARG-30ML', stock: 10 },
        { id: '50ml', name: '50 ml (Format Économique)', inStock: true, sku: 'BIO-ARG-50ML', stock: 2 },
      ],
    },
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Flacon (Standard)', unitPrice: 249, totalPrice: 249, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo Éclat (2 Flacons)', unitPrice: 199, totalPrice: 398, savingsBadge: 'Économisez 100 DH', isPopular: true, freeDelivery: true, badge: '🔥 Le Plus Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio Cure Royale (3 Flacons)', unitPrice: 166, totalPrice: 498, savingsBadge: '1 Flacon Offert + Savon Noir Bio 🎁', freeDelivery: true, freeGift: 'Savon noir à l’eucalyptus & gant kessa offerts', badge: '💎 Cure Complète 3 Mois' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  {
    id: 'bt-2',
    slug: 'masque-argile-ghassoul-rose-damas',
    sku: 'BIO-GHASSOUL',
    theme: 'beauty',
    title: 'Masque Purifiant Ghassoul & Eau de Rose',
    titleAr: 'قناع الغاسول الطبيعي بماء الورد المقطر',
    tagline: 'Nettoyage des pores en profondeur & effet peau de pêche immédiat',
    price: 159,
    originalPrice: 280,
    rating: 4.9,
    reviewCount: 204,
    stockLeft: 18,
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Argile minérale récoltée dans les gisements de l’Atlas et enrichie en eau florale de rose de Kelaat M’Gouna. Détoxifie l’épiderme sans l’assécher.',
    features: [
      'Resserre les pores dilatés et élimine les impuretés',
      'Régule l’excès de sébum et illumine le teint',
      'Prêt à l’emploi, texture crémeuse parfumée naturellement',
    ],
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Pot 200g (Standard)', unitPrice: 159, totalPrice: 159, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo Fraîcheur (2 Pots)', unitPrice: 129, totalPrice: 258, savingsBadge: 'Économisez 60 DH', isPopular: true, freeDelivery: true, badge: '🔥 Le Plus Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio Beauté (3 Pots)', unitPrice: 119, totalPrice: 357, savingsBadge: 'Économisez 120 DH + Pinceau Applicateur 🎁', freeDelivery: true, freeGift: 'Pinceau applicateur en silicone offert', badge: '💎 Pack Économique 6 Mois' },
    ],
    whatsAppDirectNumber: '212661000000',
  },

  // TECH / GADGETS
  {
    id: 'tech-1',
    slug: 'montre-connectee-amoled-ultra-pro',
    sku: 'TECH-SMARTWATCH',
    theme: 'tech',
    title: 'Smartwatch Ultra Pro AMOLED HD',
    titleAr: 'ساعة ذكية عالية الدقة مع قياس النبض والمكالمات',
    tagline: 'Écran AMOLED 1.96", Appels Bluetooth, Autonomie 10 Jours & Résistant à l’eau',
    price: 389,
    originalPrice: 699,
    rating: 4.8,
    reviewCount: 425,
    stockLeft: 7,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'La montre connectée la plus complète du marché. Recevez vos appels, notifications WhatsApp, mesurez votre rythme cardiaque, saturation O2, et enregistrez plus de 100 modes sportifs avec précision GPS.',
    features: [
      'Haut-parleur et micro intégrés pour passer et recevoir vos appels',
      'Batterie longue durée 450mAh (jusqu’à 10 jours d’autonomie)',
      'Boîtier en titane ultra-résistant et étanche IP68',
      'Compatible iPhone (iOS) et Android',
    ],
    colors: [
      {
        id: 'noir',
        name: 'Noir Carbone',
        hex: '#18181b',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
        inStock: true,
      },
      {
        id: 'argent',
        name: 'Argent Métal',
        hex: '#94a3b8',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
        inStock: true,
      },
      {
        id: 'orange',
        name: 'Orange Aventure',
        hex: '#ea580c',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
        inStock: false,
      },
    ],
    variantMatrix: [
      { id: 'vm-watch-blk', sku: 'TECH-WATCH-BLK', color: 'Noir Carbone', stock: 4, inStock: true, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-watch-slv', sku: 'TECH-WATCH-SLV', color: 'Argent Métal', stock: 3, inStock: true, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80' },
      { id: 'vm-watch-org', sku: 'TECH-WATCH-ORG', color: 'Orange Aventure', stock: 0, inStock: false, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80' },
    ],
    variants: {
      type: 'color',
      label: 'Couleur du Boîtier & Bracelet',
      options: [
        { id: 'noir', name: 'Noir Carbone', inStock: true, sku: 'TECH-WATCH-BLK', stock: 4 },
        { id: 'argent', name: 'Argent Métal', inStock: true, sku: 'TECH-WATCH-SLV', stock: 3 },
        { id: 'orange', name: 'Orange Aventure', inStock: false, sku: 'TECH-WATCH-ORG', stock: 0 },
      ],
    },
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Montre (Standard)', unitPrice: 389, totalPrice: 389, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo Lui & Elle (2 Montres)', unitPrice: 329, totalPrice: 658, savingsBadge: 'Économisez 120 DH', isPopular: true, freeDelivery: true, badge: '🔥 Le Plus Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio Famille (3 Montres)', unitPrice: 299, totalPrice: 897, savingsBadge: 'Économisez 270 DH + Bracelet Métal Offert 🎁', freeDelivery: true, freeGift: 'Bracelet milanais magnétique offert', badge: '💎 Pack Famille Connectée' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  {
    id: 'tech-2',
    slug: 'ecouteurs-sans-fil-anc-reduction-bruit',
    sku: 'TECH-ANC-TWS',
    theme: 'tech',
    title: 'Écouteurs TWS Réduction de Bruit Active (ANC)',
    titleAr: 'سماعات بلوتوث لاسلكية عازلة للضوضاء',
    tagline: 'Son Spatial 3D, 40h d’autonomie avec boîtier, Basses profondes',
    price: 269,
    originalPrice: 499,
    rating: 4.7,
    reviewCount: 189,
    stockLeft: 14,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Isolez-vous du monde extérieur grâce à la réduction active du bruit jusqu’à -35dB. Microphones Quad avec réduction du bruit de vent pour des appels téléphoniques cristallins en voiture ou dans la rue.',
    features: [
      'Double mode : Réduction de bruit (ANC) & Mode Transparence',
      'Basses profondes avec transducteur dynamique de 12mm',
      'Charge ultra-rapide USB-C (10 min de charge = 2h d’écoute)',
    ],
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Paire (Standard)', unitPrice: 269, totalPrice: 269, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo Partage (2 Paires)', unitPrice: 229, totalPrice: 458, savingsBadge: 'Économisez 80 DH', isPopular: true, freeDelivery: true, badge: '🔥 Le Plus Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio Cadeau (3 Paires)', unitPrice: 199, totalPrice: 597, savingsBadge: 'Économisez 210 DH + Coque Silicone Offerte 🎁', freeDelivery: true, freeGift: 'Coque de protection antichoc avec mousqueton offerte', badge: '💎 Pack Partage Cadeaux' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  // 7. TERROIR & CULINARY — Miel d'Euphorbe Pur du Haut Atlas
  {
    id: 'culinary-1',
    slug: 'miel-euphorbe-pur-daghmous-atlas',
    sku: 'TERR-MIEL-DAGH',
    theme: 'culinary',
    title: 'Miel d’Euphorbe Sauvage (Dagmouss) du Haut Atlas',
    titleAr: 'عسل الدغموس الحر الأصيل من جبال الأطلس المغربي',
    tagline: 'Récolte artisanale de Souss-Massa, 100% pur, non pasteurisé & certifié',
    price: 290,
    originalPrice: 450,
    rating: 4.9,
    reviewCount: 234,
    stockLeft: 18,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Le miel de Dagmouss est réputé au Maroc pour sa saveur unique piquante en gorge et ses vertus thérapeutiques ancestrales contre les coups de froid et maux d’hiver.',
    features: [
      '100% pur & naturel récolté dans la région d’Aït Baha',
      'Non chauffé, non pasteurisé pour préserver ses enzymes actives',
      'Pot hermétique en verre avec cuillère en bois d’olivier offerte',
    ],
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Pot 500g', unitPrice: 290, totalPrice: 290, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo Santé 2 × 500g', unitPrice: 249, totalPrice: 498, savingsBadge: 'Économisez 82 DH', isPopular: true, freeDelivery: true, badge: '🔥 Pack Familial Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio Curatif (3 Pots + Cuillère)', unitPrice: 220, totalPrice: 660, savingsBadge: 'Économisez 210 DH + Cadeau 🎁', freeDelivery: true, freeGift: 'Cuillère à miel artisanale en bois d’olivier', badge: '💎 Meilleur Prix' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  // 8. STREETWEAR & MODE — Coffret Soin Barbe & Argan Bio
  {
    id: 'street-1',
    slug: 'coffret-soin-barbe-huile-argan-cedre',
    sku: 'STR-BEARD-KIT',
    theme: 'streetwear',
    title: 'Coffret Premium Barbe & Soin à l’Argan et Cèdre de l’Atlas',
    titleAr: 'مجموعة العناية باللحية الفاخرة بزيت الأركان المغربي',
    tagline: 'Huile pure pressée à froid, baume sculptant et peigne en bois de poirier',
    price: 249,
    originalPrice: 390,
    rating: 4.8,
    reviewCount: 97,
    stockLeft: 22,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Le rituel de soin masculin marocain par excellence. Formule 100% bio enrichie en huile d’argan pure de Taroudant et essence de cèdre de l’Atlas.',
    features: [
      'Huile à barbe 50ml nourrissante anti-démangeaisons',
      'Baume fixateur naturel 60g au beurre de karité et cire d’abeille',
      'Peigne antistatique en bois de poirier gravé au laser',
    ],
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : Le Coffret Essentiel', unitPrice: 249, totalPrice: 249, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo Grooming (2 Coffrets)', unitPrice: 219, totalPrice: 438, savingsBadge: 'Économisez 60 DH', isPopular: true, freeDelivery: true, badge: '🔥 Pack Populaire Préféré' },
      { quantity: 3, label: 'Pack 3 : Trio Barber Pro', unitPrice: 189, totalPrice: 567, savingsBadge: 'Économisez 180 DH + Cire Offerte 🎁', freeDelivery: true, freeGift: 'Cire coiffante mate 50ml offerte', badge: '💎 Meilleure Valeur' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  // 9. FITNESS & SPORT — Ensemble Compression Thermique Pro
  {
    id: 'fit-1',
    slug: 'ensemble-fitness-compression-thermique',
    sku: 'FIT-COMP-SET',
    theme: 'fitness',
    title: 'Ensemble Sport Compression & Maintien Musculaire Pro',
    titleAr: 'طقم رياضي رجالي ضاغط عالي الأداء للتداريب',
    tagline: 'Tissu respirant Dry-Fit, coutures plates anti-frottements, maintien optimal',
    price: 349,
    originalPrice: 520,
    rating: 4.8,
    reviewCount: 162,
    stockLeft: 31,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Optimisez vos performances et votre récupération. Conçu en polyamide élasthanne technique avec technologie de compression ciblée favorisant le retour veineux.',
    features: [
      'Tissu thermo-régulateur respirant avec séchage express',
      'Bande élastique antidérapante à la taille pour un maintien parfait',
      'Résistant aux lavages répétés et aux étirements intensifs',
    ],
    sizes: [
      { id: 'm', name: 'M (65-75 kg)', inStock: true },
      { id: 'l', name: 'L (75-85 kg)', inStock: true },
      { id: 'xl', name: 'XL (85-95 kg)', inStock: true },
      { id: 'xxl', name: 'XXL (95-105 kg)', inStock: true },
    ],
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : Ensemble Complet (Haut + Bas)', unitPrice: 349, totalPrice: 349, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo 2 Ensembles (Noir + Gris)', unitPrice: 299, totalPrice: 598, savingsBadge: 'Économisez 100 DH', isPopular: true, freeDelivery: true, badge: '🔥 Le Plus Populaire (الأكثر طلباً)' },
      { quantity: 3, label: 'Pack 3 : Trio Athlète (3 Ensembles)', unitPrice: 269, totalPrice: 807, savingsBadge: 'Économisez 240 DH + Gourde Sport 🎁', freeDelivery: true, freeGift: 'Gourde isotherme inox 750ml offerte', badge: '💎 Pack Performance' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  // 10. MAISON & ARTISANAT — Tajine en Terre Cuite Émaillée de Safi
  {
    id: 'kitchen-1',
    slug: 'tajine-artisanal-terre-cuite-vernissee',
    sku: 'HOME-TAJINE-SAF',
    theme: 'kitchen',
    title: 'Tajine Traditionnel en Terre Cuite Émaillée de Safi (4-6 pers)',
    titleAr: 'طاجين مغربي أصيل من طين آسفي الحر المقاوم للحرارة',
    tagline: 'Façonné à la main, résistant aux hautes chaleurs, cuisson à l’étouffée douce',
    price: 199,
    originalPrice: 320,
    rating: 4.9,
    reviewCount: 310,
    stockLeft: 12,
    images: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Le véritable goût du tajine marocain. L’argile réfractaire de Safi cuite à haute température assure une diffusion homogène de la chaleur pour des viandes tendres et fondantes.',
    features: [
      'Terre cuite 100% naturelle sans plomb conforme aux normes alimentaires',
      'Diamètre généreux de 32 cm idéal pour les repas en famille',
      'Compatible gaz, charbon et four traditionnel',
    ],
    quantityTiers: [
      { quantity: 1, label: 'Pack 1 : 1 Tajine 32cm', unitPrice: 199, totalPrice: 199, freeDelivery: false },
      { quantity: 2, label: 'Pack 2 : Duo (Grand 32cm + Moyen 26cm)', unitPrice: 179, totalPrice: 358, savingsBadge: 'Économisez 40 DH', isPopular: true, freeDelivery: true, badge: '🔥 Pack Populaire Découverte' },
      { quantity: 3, label: 'Pack 3 : Trio Cadeau Terroir', unitPrice: 159, totalPrice: 477, savingsBadge: 'Économisez 120 DH + Dessous Plat Liège 🎁', freeDelivery: true, freeGift: 'Dessous de plat en liège et céramique offert', badge: '💎 Meilleure Affaire' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
];

export function getProductQuantityTiers(product: Product, countryCode: string = 'MA'): QuantityTier[] {
  if (product.quantityTiers && product.quantityTiers.length >= 3) {
    return product.quantityTiers;
  }
  const base = product.price;
  const duoUnit = Math.round(base * 0.85);
  const trioUnit = Math.round(base * 0.75);
  const curr = (COUNTRIES[countryCode?.toUpperCase()] || COUNTRIES.MA).currency.symbol;
  return [
    {
      quantity: 1,
      label: 'Pack 1 : 1 Pièce (Standard)',
      unitPrice: base,
      totalPrice: base,
      freeDelivery: false,
    },
    {
      quantity: 2,
      label: 'Pack 2 : Duo (2 Pièces)',
      unitPrice: duoUnit,
      totalPrice: duoUnit * 2,
      savingsBadge: `Économisez ${base * 2 - duoUnit * 2} ${curr}`,
      isPopular: true,
      freeDelivery: true,
      badge: '🔥 Le Plus Populaire (الأكثر طلباً)',
    },
    {
      quantity: 3,
      label: 'Pack 3 : Trio VIP (3 Pièces)',
      unitPrice: trioUnit,
      totalPrice: trioUnit * 3,
      savingsBadge: `Économisez ${base * 3 - trioUnit * 3} ${curr} + Cadeau 🎁`,
      freeDelivery: true,
      freeGift: 'Cadeau surprise exclusif offert 🎁',
      badge: '💎 Meilleure Valeur (أفضل توفير)',
    },
  ];
}

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByTheme(theme: ThemeId): Product[] {
  const matching = MOCK_PRODUCTS.filter((p) => p.theme === theme);
  if (matching.length > 0) return matching;

  // Smart authentic category mapping so all 25 themes have beautiful product cards
  if (['luxury', 'jewelry', 'perfume', 'leather_craft', 'eyewear', 'woodmart'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'luxury');
  }
  if (['beauty', 'botanica', 'babyjoy'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'beauty');
  }
  if (['tech', 'cyberpunk', 'automotive'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'tech');
  }
  if (['culinary', 'coffee_tea'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'culinary');
  }
  if (['fitness'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'fitness');
  }
  if (['kitchen', 'ceramics', 'home' as any].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'kitchen');
  }
  if (['streetwear', 'minimal', 'kids_fashion', 'booster', 'shoptimizer', 'flatsome', 'velocity_cod'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'streetwear' || p.theme === 'luxury');
  }

  return MOCK_PRODUCTS;
}

/**
 * Resolves the active variant SKU, stock, and image based on user selections.
 */
export function getProductVariantInfo(
  product: Product,
  selectedColor?: string,
  selectedSize?: string,
  selectedVariantName?: string,
  selectedSku?: string
): {
  sku: string;
  stock: number;
  inStock: boolean;
  image?: string;
  price: number;
  label: string;
} {
  const baseSku = product.sku || product.slug.toUpperCase().replace(/-/g, '_');
  const basePrice = product.price;

  // 1. Try finding exact match in variantMatrix (dual-axis or explicit)
  if (product.variantMatrix && product.variantMatrix.length > 0) {
    let match = selectedSku
      ? product.variantMatrix.find((vm) => vm.sku.toLowerCase() === selectedSku.toLowerCase())
      : undefined;

    if (!match && (selectedColor || selectedSize)) {
      match = product.variantMatrix.find((vm) => {
        const matchColor = selectedColor ? vm.color?.toLowerCase() === selectedColor.toLowerCase() : true;
        const matchSize = selectedSize ? vm.size?.toLowerCase() === selectedSize.toLowerCase() : true;
        return matchColor && matchSize;
      });
    }

    if (!match && !selectedColor && !selectedSize && !selectedSku) {
      match = product.variantMatrix[0];
    }

    if (match) {
      const parts: string[] = [];
      if (match.color) parts.push(match.color);
      if (match.size) parts.push(match.size);
      return {
        sku: match.sku,
        stock: match.stock,
        inStock: match.stock > 0,
        image: match.image,
        price: match.price || basePrice,
        label: parts.join(' / ') || 'Standard',
      };
    }
  }

  // 2. Try single-axis options list
  if (product.variants?.options) {
    const optName = selectedVariantName || selectedSize || selectedColor;
    const matchOpt = product.variants.options.find(
      (o) =>
        (selectedSku && o.sku?.toLowerCase() === selectedSku.toLowerCase()) ||
        (optName && o.name.toLowerCase() === optName.toLowerCase())
    );
    if (matchOpt) {
      const optSku = matchOpt.sku || `${baseSku}-${matchOpt.id.toUpperCase()}`;
      const optStock = matchOpt.stock !== undefined ? matchOpt.stock : (matchOpt.inStock ? product.stockLeft : 0);
      return {
        sku: optSku,
        stock: optStock,
        inStock: optStock > 0 && matchOpt.inStock,
        image: matchOpt.image,
        price: matchOpt.price || basePrice,
        label: matchOpt.name,
      };
    }
  }

  // 3. Fallback: Base product info
  return {
    sku: baseSku,
    stock: product.stockLeft,
    inStock: product.stockLeft > 0,
    image: product.images[0],
    price: basePrice,
    label: selectedVariantName || 'Standard',
  };
}

/**
 * Check stock availability for an order request.
 */
export function checkMockProductStock(
  productSlugOrId: string,
  quantity: number,
  options?: { color?: string; size?: string; variant?: string; sku?: string } | string
): { available: boolean; currentStock: number; sku: string; error?: string } {
  const product = MOCK_PRODUCTS.find(
    (p) => p.slug === productSlugOrId || p.id === productSlugOrId || p.sku === productSlugOrId
  );

  if (!product) {
    return { available: false, currentStock: 0, sku: '', error: 'Produit introuvable' };
  }

  const optObj = typeof options === 'string' ? { sku: options } : options;
  const info = getProductVariantInfo(product, optObj?.color, optObj?.size, optObj?.variant, optObj?.sku);

  if (info.stock < quantity) {
    return {
      available: false,
      currentStock: info.stock,
      sku: info.sku,
      error: info.stock === 0
        ? `Variante épuisée (${info.label || info.sku}). Rupture de stock dans notre dépôt.`
        : `Stock insuffisant : seulement ${info.stock} disponible(s) pour (${info.label || info.sku}), vous avez demandé ${quantity}.`,
    };
  }

  return {
    available: true,
    currentStock: info.stock,
    sku: info.sku,
  };
}

/**
 * Decrement stock in mock inventory on order creation.
 */
export function decrementMockProductStock(
  productSlugOrId: string,
  quantity: number,
  options?: { color?: string; size?: string; variant?: string; sku?: string } | string
): { success: boolean; newStock: number; sku: string; error?: string } {
  const product = MOCK_PRODUCTS.find(
    (p) => p.slug === productSlugOrId || p.id === productSlugOrId || p.sku === productSlugOrId
  );

  if (!product) {
    return { success: false, newStock: 0, sku: '', error: 'Produit introuvable' };
  }

  const optObj = typeof options === 'string' ? { sku: options } : options;
  let foundSku = product.sku;
  let remainingStock = product.stockLeft;

  // 1. Decrement in variantMatrix if applicable
  if (product.variantMatrix && product.variantMatrix.length > 0) {
    const match = product.variantMatrix.find((vm) => {
      if (optObj?.sku && vm.sku.toLowerCase() === optObj.sku.toLowerCase()) return true;
      const matchColor = optObj?.color ? vm.color?.toLowerCase() === optObj.color.toLowerCase() : true;
      const matchSize = optObj?.size ? vm.size?.toLowerCase() === optObj.size.toLowerCase() : true;
      return (optObj?.color || optObj?.size) ? (matchColor && matchSize) : false;
    });

    if (match) {
      match.stock = Math.max(0, match.stock - quantity);
      match.inStock = match.stock > 0;
      foundSku = match.sku;
      remainingStock = match.stock;
    }
  }

  // 2. Decrement in variants options if applicable
  if (product.variants?.options) {
    const optName = optObj?.variant || optObj?.size || optObj?.color;
    const matchOpt = product.variants.options.find(
      (o) =>
        (optObj?.sku && o.sku?.toLowerCase() === optObj.sku.toLowerCase()) ||
        (optName && o.name.toLowerCase() === optName.toLowerCase())
    );
    if (matchOpt) {
      if (matchOpt.stock !== undefined) {
        matchOpt.stock = Math.max(0, matchOpt.stock - quantity);
        matchOpt.inStock = matchOpt.stock > 0;
        remainingStock = matchOpt.stock;
      }
      if (matchOpt.sku) foundSku = matchOpt.sku;
    }
  }

  // 3. Decrement overall product stockLeft
  product.stockLeft = Math.max(0, product.stockLeft - quantity);

  return {
    success: true,
    newStock: remainingStock,
    sku: foundSku,
  };
}

/**
 * Restore stock in mock inventory on order cancellation or return.
 */
export function restoreMockProductStock(
  productSlugOrId: string,
  quantity: number,
  options?: { color?: string; size?: string; variant?: string; sku?: string }
): { success: boolean; newStock: number; sku: string } {
  const product = MOCK_PRODUCTS.find(
    (p) => p.slug === productSlugOrId || p.id === productSlugOrId || p.sku === productSlugOrId
  );

  if (!product) {
    return { success: false, newStock: 0, sku: '' };
  }

  let foundSku = product.sku;

  // 1. Restore in variantMatrix if applicable
  if (product.variantMatrix && product.variantMatrix.length > 0) {
    const match = product.variantMatrix.find((vm) => {
      if (options?.sku && vm.sku === options.sku) return true;
      const matchColor = options?.color ? vm.color?.toLowerCase() === options.color.toLowerCase() : true;
      const matchSize = options?.size ? vm.size?.toLowerCase() === options.size.toLowerCase() : true;
      return matchColor && matchSize;
    });

    if (match) {
      match.stock += quantity;
      match.inStock = match.stock > 0;
      foundSku = match.sku;
    }
  }

  // 2. Restore in variants options if applicable
  if (product.variants?.options) {
    const optName = options?.variant || options?.size || options?.color;
    const matchOpt = product.variants.options.find(
      (o) => (options?.sku && o.sku === options.sku) || (optName && o.name.toLowerCase() === optName.toLowerCase())
    );
    if (matchOpt) {
      if (matchOpt.stock !== undefined) {
        matchOpt.stock += quantity;
        matchOpt.inStock = matchOpt.stock > 0;
      }
      if (matchOpt.sku) foundSku = matchOpt.sku;
    }
  }

  // 3. Restore overall product stockLeft
  product.stockLeft += quantity;

  return {
    success: true,
    newStock: product.stockLeft,
    sku: foundSku,
  };
}

