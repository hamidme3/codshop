import { ThemeId } from './themes';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "41", "42", "50ml", "Noir"
  inStock: boolean;
}

export interface QuantityTier {
  quantity: number;
  label: string;
  unitPrice: number;
  totalPrice: number;
  savingsBadge?: string;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  slug: string;
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
  variants?: {
    type: 'size' | 'color' | 'volume';
    label: string;
    options: ProductVariant[];
  };
  quantityTiers: QuantityTier[];
  whatsAppDirectNumber: string; // "+212600000000"
}

export const MOCK_PRODUCTS: Product[] = [
  // LUXURY / FASHION
  {
    id: 'lux-1',
    slug: 'souliers-richelieu-cuir-italien',
    theme: 'luxury',
    title: 'Souliers Richelieu Cousu Goodyear',
    titleAr: 'حذاء كلاسيكي من الجلد الطبيعي الأصيل',
    tagline: 'Cuir pleine fleur italien tanné végétalement, patiné à la main à Fès',
    price: 699,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 148,
    stockLeft: 7,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Une pièce maîtresse d’élégance intemporelle. Confectionné selon la noble tradition du cousu Goodyear, ce modèle offre un confort ergonomique exceptionnel et une longévité de plus de 10 ans.',
    features: [
      'Cuir de veau pleine fleur importé d’Italie',
      'Semelle extérieure en cuir renforcée avec patin gomme anti-dérapant',
      'Doublure respirante anti-transpiration',
      'Livré avec embauchoirs en bois et crème de soin offerte',
    ],
    variants: {
      type: 'size',
      label: 'Pointure (EU)',
      options: [
        { id: '39', name: '39', inStock: true },
        { id: '40', name: '40', inStock: true },
        { id: '41', name: '41', inStock: true },
        { id: '42', name: '42', inStock: true },
        { id: '43', name: '43', inStock: true },
        { id: '44', name: '44', inStock: false },
        { id: '45', name: '45', inStock: true },
      ],
    },
    quantityTiers: [
      { quantity: 1, label: '1 Paire', unitPrice: 699, totalPrice: 699 },
      { quantity: 2, label: '2 Paires (Pack Duo)', unitPrice: 599, totalPrice: 1198, savingsBadge: 'Économisez 200 DH', isPopular: true },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  {
    id: 'lux-2',
    slug: 'sac-voyage-weekender-cuir',
    theme: 'luxury',
    title: 'Sac de Voyage Weekender Grand Format',
    titleAr: 'حقيبة سفر من الجلد الفاخر',
    tagline: 'Le compagnon parfait de vos escapades et voyages d’affaires',
    price: 849,
    originalPrice: 1400,
    rating: 4.8,
    reviewCount: 92,
    stockLeft: 4,
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
    quantityTiers: [
      { quantity: 1, label: '1 Sac', unitPrice: 849, totalPrice: 849 },
      { quantity: 2, label: 'Pack Cadeau (2 Sacs)', unitPrice: 749, totalPrice: 1498, savingsBadge: 'Économisez 200 DH', isPopular: true },
    ],
    whatsAppDirectNumber: '212661000000',
  },

  // BEAUTY / SKINCARE
  {
    id: 'bt-1',
    slug: 'elixir-huile-argan-pepites-or',
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
    variants: {
      type: 'volume',
      label: 'Contenance',
      options: [
        { id: '30ml', name: '30 ml (Cure 1 Mois)', inStock: true },
        { id: '50ml', name: '50 ml (Format Économique)', inStock: true },
      ],
    },
    quantityTiers: [
      { quantity: 1, label: '1 Flacon', unitPrice: 249, totalPrice: 249 },
      { quantity: 2, label: 'Pack Duo (Cure Complète)', unitPrice: 199, totalPrice: 398, savingsBadge: 'Le Plus Vendu (-100 DH)', isPopular: true },
      { quantity: 3, label: 'Pack Famille (3 Flacons)', unitPrice: 166, totalPrice: 498, savingsBadge: '1 Flacon Offert !' },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  {
    id: 'bt-2',
    slug: 'masque-argile-ghassoul-rose-damas',
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
      { quantity: 1, label: '1 Pot (200g)', unitPrice: 159, totalPrice: 159 },
      { quantity: 2, label: '2 Pots (Cure 3 Mois)', unitPrice: 129, totalPrice: 258, savingsBadge: 'Économisez 60 DH', isPopular: true },
    ],
    whatsAppDirectNumber: '212661000000',
  },

  // TECH / GADGETS
  {
    id: 'tech-1',
    slug: 'montre-connectee-amoled-ultra-pro',
    theme: 'tech',
    title: 'Smartwatch Ultra Pro AMOLED HD',
    titleAr: 'ساعة ذكية عالية الدقة مع قياس النبض والمكالمات',
    tagline: 'Écran AMOLED 1.96", Appels Bluetooth, Autonomie 10 Jours & Résistant à l’eau',
    price: 389,
    originalPrice: 699,
    rating: 4.8,
    reviewCount: 425,
    stockLeft: 9,
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
    variants: {
      type: 'color',
      label: 'Couleur du Boîtier & Bracelet',
      options: [
        { id: 'noir', name: 'Noir Carbone', inStock: true },
        { id: 'argent', name: 'Argent Métal', inStock: true },
        { id: 'orange', name: 'Orange Aventure', inStock: true },
      ],
    },
    quantityTiers: [
      { quantity: 1, label: '1 Montre', unitPrice: 389, totalPrice: 389 },
      { quantity: 2, label: 'Pack 2 Montres (Lui & Elle)', unitPrice: 329, totalPrice: 658, savingsBadge: 'Économisez 120 DH', isPopular: true },
    ],
    whatsAppDirectNumber: '212661000000',
  },
  {
    id: 'tech-2',
    slug: 'ecouteurs-sans-fil-anc-reduction-bruit',
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
      { quantity: 1, label: '1 Paire d’Écouteurs', unitPrice: 269, totalPrice: 269 },
      { quantity: 2, label: '2 Paires (Pack Cadeau)', unitPrice: 229, totalPrice: 458, savingsBadge: 'Économisez 80 DH', isPopular: true },
    ],
    whatsAppDirectNumber: '212661000000',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByTheme(theme: ThemeId): Product[] {
  const matching = MOCK_PRODUCTS.filter((p) => p.theme === theme);
  if (matching.length > 0) return matching;

  // Smart category fallback so all 25 themes have beautiful product cards
  if (['luxury', 'jewelry', 'perfume', 'leather_craft', 'eyewear', 'woodmart'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'luxury');
  }
  if (['beauty', 'botanica', 'babyjoy'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'beauty');
  }
  if (['tech', 'cyberpunk', 'automotive', 'fitness'].includes(theme)) {
    return MOCK_PRODUCTS.filter((p) => p.theme === 'tech');
  }

  return MOCK_PRODUCTS;
}

