import { ThemeId } from './themes';

export type StoreStatus = 'trial' | 'active' | 'grace' | 'suspended';
export type PlanType = 'starter' | 'pro' | 'scale';

export interface SectionInstance {
  id: string;
  type: 
    | 'hero_banner'
    | 'features_grid'
    | 'urgency_timer'
    | 'cod_checkout'
    | 'video_review'
    | 'testimonials_carousel'
    | 'faq_accordion'
    | 'whatsapp_floating_bar';
  hidden?: boolean;
  settings: Record<string, any>;
}

export interface StorePage {
  id: string;
  slug: string;
  title: string;
  isHome: boolean;
  sections: SectionInstance[];
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  niche: 'fashion' | 'beauty' | 'tech' | 'general';
  themeId: ThemeId;
  whatsapp: string;
  city: string;
  plan: PlanType;
  status: StoreStatus;
  trialEndsAt: string;
  createdAt: string;
  courierConfig: {
    provider: 'ozon' | 'sendit' | 'manual';
    apiKey?: string;
    autoDispatch: boolean;
  };
  stats: {
    totalOrders: number;
    totalRevenue: number;
    deliveryRate: number;
  };
  pages: StorePage[];
}

const DEFAULT_SECTIONS: SectionInstance[] = [
  {
    id: 'sec_hero',
    type: 'hero_banner',
    settings: {
      headline: 'Excellence & Savoir-Faire Marocain',
      subheadline: 'Produits 100% authentiques livrés directement à votre porte avec paiement à la livraison.',
      ctaText: 'Commander Maintenant — Paiement à la Livraison',
      badgeText: 'Édition Limitée',
      bgImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
    },
  },
  {
    id: 'sec_features',
    type: 'features_grid',
    settings: {
      badges: [
        { icon: 'shield', title: 'Paiement à la Livraison', subtitle: 'Payez en espèces après inspection' },
        { icon: 'truck', title: 'Livraison Express 24/48h', subtitle: 'Partout au Maroc (Casablanca, Rabat...)' },
        { icon: 'award', title: 'Qualité 100% Garantie', subtitle: 'Satisfait ou remboursé sous 7 jours' },
      ],
    },
  },
  {
    id: 'sec_urgency',
    type: 'urgency_timer',
    settings: {
      title: 'Offre Spéciale — Stock Très Limité',
      countdownHours: 5,
      stockRemaining: 17,
      discountText: '-35% de Réduction Aujourd\'hui',
    },
  },
  {
    id: 'sec_cod',
    type: 'cod_checkout',
    settings: {
      productTitle: 'Article Premium — Édition Spéciale',
      price: 349,
      comparePrice: 590,
      packDuoDiscount: 100,
      packTrioDiscount: 200,
      shippingFeeCity: 20,
    },
  },
  {
    id: 'sec_reviews',
    type: 'testimonials_carousel',
    settings: {
      title: 'Avis de nos clients marocains',
      reviews: [
        { name: 'Khadija M. (Casablanca)', rating: 5, comment: 'Tbariqallah la qualité top bezzaf, w weslatni f 24h!' },
        { name: 'Mehdi B. (Rabat)', rating: 5, comment: 'Livrour ja f lweqt, produit kima f la photo exact.' },
        { name: 'Sara L. (Marrakech)', rating: 5, comment: 'Excellent service client, je recommande sans hésiter.' },
      ],
    },
  },
  {
    id: 'sec_faq',
    type: 'faq_accordion',
    settings: {
      faqs: [
        { q: 'Comment se passe le paiement ?', a: 'Le paiement s\'effectue en dirhams (MAD) directement auprès du livreur à la réception de votre colis.' },
        { q: 'Puis-je ouvrir et vérifier le colis ?', a: 'Oui, absolument ! Tous nos envois bénéficient de l\'option vérification avant paiement.' },
        { q: 'Quels sont les délais de livraison ?', a: 'Casablanca et Rabat en 24h. Les autres villes marocaines en 48h ouvrables.' },
      ],
    },
  },
  {
    id: 'sec_whatsapp',
    type: 'whatsapp_floating_bar',
    settings: {
      phone: '+212661000000',
      message: 'Salam, bghit nsewel 3la l\'article w ncommander svp',
    },
  },
];

// Initial seeded stores
const STORES_MAP: Map<string, Store> = new Map([
  [
    'ottavio',
    {
      id: 'store_ottavio',
      name: 'Ottavio Maroquinerie',
      slug: 'ottavio',
      niche: 'fashion',
      themeId: 'luxury',
      whatsapp: '+212661123456',
      city: 'Casablanca',
      plan: 'pro',
      status: 'active',
      trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      courierConfig: { provider: 'ozon', autoDispatch: true },
      stats: { totalOrders: 142, totalRevenue: 49700, deliveryRate: 91 },
      pages: [
        {
          id: 'page_home',
          slug: 'home',
          title: 'Accueil',
          isHome: true,
          sections: DEFAULT_SECTIONS,
        },
      ],
    },
  ],
  [
    'argan-bio',
    {
      id: 'store_argan',
      name: 'Argan Bio Botanica',
      slug: 'argan-bio',
      niche: 'beauty',
      themeId: 'beauty',
      whatsapp: '+212662987654',
      city: 'Agadir',
      plan: 'starter',
      status: 'trial',
      trialEndsAt: new Date(Date.now() + 12 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      courierConfig: { provider: 'sendit', autoDispatch: true },
      stats: { totalOrders: 68, totalRevenue: 18900, deliveryRate: 88 },
      pages: [
        {
          id: 'page_home',
          slug: 'home',
          title: 'Accueil',
          isHome: true,
          sections: DEFAULT_SECTIONS,
        },
      ],
    },
  ],
]);

export function getStoreBySlug(slug: string): Store | undefined {
  return STORES_MAP.get(slug.toLowerCase().trim());
}

export function getAllStores(): Store[] {
  return Array.from(STORES_MAP.values());
}

export function createStore(data: {
  name: string;
  slug?: string;
  whatsapp: string;
  city?: string;
  niche?: 'fashion' | 'beauty' | 'tech' | 'general';
  themeId?: ThemeId;
}): Store {
  const slug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-');
  const now = new Date();
  const trialEnds = new Date(now.getTime() + 14 * 86400000); // 14 days free trial

  const newStore: Store = {
    id: `store_${Math.random().toString(36).substring(2, 9)}`,
    name: data.name,
    slug,
    niche: data.niche || 'general',
    themeId: data.themeId || 'luxury',
    whatsapp: data.whatsapp,
    city: data.city || 'Casablanca',
    plan: 'pro',
    status: 'trial',
    trialEndsAt: trialEnds.toISOString(),
    createdAt: now.toISOString(),
    courierConfig: {
      provider: 'ozon',
      autoDispatch: false,
    },
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      deliveryRate: 100,
    },
    pages: [
      {
        id: `page_${Date.now()}`,
        slug: 'home',
        title: 'Accueil',
        isHome: true,
        sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
      },
    ],
  };

  STORES_MAP.set(slug, newStore);
  return newStore;
}

export function updateStoreSections(slug: string, sections: SectionInstance[]): boolean {
  const store = STORES_MAP.get(slug);
  if (!store) return false;
  if (store.pages[0]) {
    store.pages[0].sections = sections;
  }
  return true;
}
