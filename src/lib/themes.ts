export type ThemeId =
  | 'luxury'
  | 'beauty'
  | 'tech'
  | 'minimal'
  | 'booster'
  | 'streetwear'
  | 'woodmart'
  | 'shoptimizer'
  | 'flatsome'
  | 'perfume'
  | 'jewelry'
  | 'babyjoy'
  | 'culinary'
  | 'fitness'
  | 'automotive'
  | 'eyewear'
  | 'botanica'
  | 'coffee_tea'
  | 'ceramics'
  | 'petcare'
  | 'kids_fashion'
  | 'leather_craft'
  | 'kitchen'
  | 'cyberpunk'
  | 'velocity_cod';

export type ThemeCategory = 'luxury' | 'fashion' | 'beauty' | 'tech' | 'home' | 'food' | 'general' | 'sports' | 'kids' | 'auto';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  badge: string;
  category: ThemeCategory;
  sourceInspiration: string;
  colors: {
    primary: string;
    primaryHover: string;
    accent: string;
    accentHover: string;
    bgPage: string;
    cardBg: string;
    border: string;
    borderStrong: string;
    shadowColor: string;
    textPrimary: string;
    textSecondary: string;
    badgeBg: string;
    badgeText: string;
  };
  typography: {
    fontFamily: string;
    headingClass: string;
    scale: {
      h1: string;
      h2: string;
      h3: string;
      cardTitle: string;
      caption: string;
      label: string;
    };
  };
  styleTokens: {
    buttonRadius: string;
    cardRadius: string;
    badgeStyle: string;
  };
  announcementText: string;
  announcementBg: string;
  announcementTextColor: string;
  heroHeadline: string;
  heroSubheadline: string;
  trustPills: Array<{ icon: string; title: string; subtitle: string }>;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  // 1. LUXURY (Prestige - Shopify)
  luxury: {
    id: 'luxury',
    name: 'Luxe & Artisanal',
    tagline: 'Maison de Haute Maroquinerie & Souliers Faits Main',
    badge: '👑 Prestige Marocain',
    category: 'luxury',
    sourceInspiration: 'Prestige (Shopify)',
    colors: {
      primary: '#090d16',
      primaryHover: '#1e293b',
      accent: '#c59b27',
      accentHover: '#d4af37',
      bgPage: '#faf9f6',
      cardBg: '#ffffff',
      border: '#e2e8f0',
      borderStrong: '#94a3b8',
      shadowColor: 'rgba(15,23,42,0.06)',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
      badgeBg: '#fef3c7',
      badgeText: '#92400e',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-none',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-amber-300 text-amber-900 bg-amber-50',
    },
    announcementText: 'Livraison Rapide Gratuite dès 400 DH • Paiement Cash à la Livraison après vérification de votre colis',
    announcementBg: '#c59b27',
    announcementTextColor: '#0f172a',
    heroHeadline: 'L’Élégance Pure, Façonnée à la Main.',
    heroSubheadline: 'Des créations nobles en cuir véritable façonnées par nos maîtres artisans à Fès. Vérifiez votre commande avant tout paiement.',
    trustPills: [
      { icon: 'Award', title: '100% Cuir Véritable', subtitle: 'Fabrication artisanale' },
      { icon: 'Truck', title: 'Livraison Express 24h/48h', subtitle: 'Partout au Maroc' },
      { icon: 'ShieldCheck', title: 'Paiement à la livraison', subtitle: 'Vérifiez avant de payer' },
      { icon: 'RotateCcw', title: 'Échange Gratuit', subtitle: 'Sous 7 jours garantis' },
    ],
  },

  // 2. BEAUTY (Sense - Shopify)
  beauty: {
    id: 'beauty',
    name: 'Beauté & Soins',
    tagline: 'Élixirs Botaniques & Rituels Naturels du Maroc',
    badge: '🌸 100% Bio & Naturel',
    category: 'beauty',
    sourceInspiration: 'Sense (Shopify)',
    colors: {
      primary: '#881337',
      primaryHover: '#9f1239',
      accent: '#f43f5e',
      accentHover: '#e11d48',
      bgPage: '#fff5f7',
      cardBg: '#ffffff',
      border: '#fecdd3',
      borderStrong: '#fda4af',
      shadowColor: 'rgba(76,5,25,0.08)',
      textPrimary: '#4c0519',
      textSecondary: '#9f1239',
      badgeBg: '#ffe4e6',
      badgeText: '#be123c',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-full',
      cardRadius: 'rounded-2xl',
      badgeStyle: 'border border-rose-200 text-rose-800 bg-rose-50',
    },
    announcementText: 'Offre Beauté : Pack Duo Huile d’Argan & Figue de Barbarie à prix doux • Livraison offerte !',
    announcementBg: '#e11d48',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Révélez l’Éclat Naturel de Votre Peau.',
    heroSubheadline: 'Cosmétiques purs pressés à froid au cœur du Souss. Formules certifiées sans parabènes ni sulfates.',
    trustPills: [
      { icon: 'Sparkles', title: 'Formule 100% Pure', subtitle: 'Huile d’argan certifiée' },
      { icon: 'HeartHandshake', title: 'Satisfait ou Remboursé', subtitle: 'Testé dermatologiquement' },
      { icon: 'Truck', title: 'Livraison Rapide', subtitle: 'Paiement en espèces à l’arrivée' },
      { icon: 'Clock', title: 'Service Client VIP', subtitle: 'Conseils personnalisés 7j/7' },
    ],
  },

  // 3. TECH (Electro - WooCommerce)
  tech: {
    id: 'tech',
    name: 'Tech & Innovations',
    tagline: 'Accessoires Intelligents & Innovations Connectées',
    badge: '⚡ Offre Flash Limitée',
    category: 'tech',
    sourceInspiration: 'Electro (WooCommerce)',
    colors: {
      primary: '#18181b',
      primaryHover: '#27272a',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      bgPage: '#f4f4f5',
      cardBg: '#ffffff',
      border: '#e4e4e7',
      borderStrong: '#a1a1aa',
      shadowColor: 'rgba(0,0,0,0.06)',
      textPrimary: '#09090b',
      textSecondary: '#52525b',
      badgeBg: '#dbeafe',
      badgeText: '#1e40af',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-xl',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-blue-200 text-blue-800 bg-blue-50',
    },
    announcementText: 'Vente Flash High-Tech : Stock Limité • Expédition en 24h chrono partout au Maroc',
    announcementBg: '#2563eb',
    announcementTextColor: '#ffffff',
    heroHeadline: 'La Technologie de Demain, au Meilleur Prix.',
    heroSubheadline: 'Gadgets haute performance, réduction active du bruit et autonomie prolongée garantis 1 an.',
    trustPills: [
      { icon: 'Zap', title: 'Garantie 1 An Remplacement', subtitle: 'SAV réactif au Maroc' },
      { icon: 'Truck', title: 'Expédition en 24h', subtitle: 'Paiement à la réception' },
      { icon: 'CheckCircle', title: 'Produit Certifié Original', subtitle: 'Notice en français & arabe' },
      { icon: 'Package', title: 'Colis Sécurisé', subtitle: 'Emballage antichoc renforcé' },
    ],
  },

  // 4. MINIMAL (Dawn - Shopify)
  minimal: {
    id: 'minimal',
    name: 'YouCan Minimalist',
    tagline: 'L’Essentiel du E-Commerce, Vitesse Maximale',
    badge: '🚀 Max Conversion',
    category: 'general',
    sourceInspiration: 'Dawn (Shopify)',
    colors: {
      primary: '#000000',
      primaryHover: '#171717',
      accent: '#10b981',
      accentHover: '#059669',
      bgPage: '#ffffff',
      cardBg: '#ffffff',
      border: '#e5e7eb',
      borderStrong: '#a1a1aa',
      shadowColor: 'rgba(0,0,0,0.06)',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
      badgeBg: '#d1fae5',
      badgeText: '#065f46',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-md',
      cardRadius: 'rounded-lg',
      badgeStyle: 'border border-emerald-300 text-emerald-800 bg-emerald-50',
    },
    announcementText: 'Paiement à la livraison après vérification • Aucun paiement par carte bancaire requis',
    announcementBg: '#10b981',
    announcementTextColor: '#0f172a',
    heroHeadline: 'Commandez en 30 Secondes Chrono.',
    heroSubheadline: 'Navigation ultra-fluide, commande simplifiée sans création de compte et livraison directement chez vous.',
    trustPills: [
      { icon: 'ShieldCheck', title: 'Zéro Risque', subtitle: 'Paiement à la réception' },
      { icon: 'Truck', title: 'Livraison Rapide', subtitle: 'Partout au Maroc' },
      { icon: 'Check', title: 'Qualité Vérifiée', subtitle: 'Contrôle avant envoi' },
      { icon: 'MessageCircle', title: 'Support WhatsApp', subtitle: 'Assistance 7j/7' },
    ],
  },

  // 5. BOOSTER (Booster - Shopify)
  booster: {
    id: 'booster',
    name: 'Booster Flash COD',
    tagline: 'Ventes Flash & Produits Gagnants TikTok / Facebook',
    badge: '🔥 Offre Exclusive -50%',
    category: 'general',
    sourceInspiration: 'Booster (Shopify)',
    colors: {
      primary: '#991b1b',
      primaryHover: '#7f1d1d',
      accent: '#dc2626',
      accentHover: '#b91c1c',
      bgPage: '#fef2f2',
      cardBg: '#ffffff',
      border: '#fecaca',
      borderStrong: '#fca5a5',
      shadowColor: 'rgba(127,29,29,0.08)',
      textPrimary: '#7f1d1d',
      textSecondary: '#991b1b',
      badgeBg: '#fee2e2',
      badgeText: '#991b1b',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-lg',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border-2 border-red-500 text-white bg-red-600 animate-pulse font-bold',
    },
    announcementText: '🔥 VENTE FLASH LIMITÉE : 1 ACHETÉ = 1 OFFERT • Fin de l’opération à minuit !',
    announcementBg: '#dc2626',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Ne Manquez Pas la Promotion du Jour !',
    heroSubheadline: 'Plus que 9 exemplaires restants en entrepôt à Casablanca. Commandez maintenant et payez à la livraison.',
    trustPills: [
      { icon: 'Flame', title: 'Forte Demande', subtitle: 'Stock presque épuisé' },
      { icon: 'Truck', title: 'Expédié Aujourd’hui', subtitle: 'Commandes avant 15h' },
      { icon: 'ShieldAlert', title: 'Garantie Totale', subtitle: 'Échange immédiat' },
      { icon: 'Award', title: 'Top Vente 2026', subtitle: 'Noté 4.9/5 par +2500 clients' },
    ],
  },

  // 6. STREETWEAR (Testament - Shopify)
  streetwear: {
    id: 'streetwear',
    name: 'Streetwear & Sneakers',
    tagline: 'Éditions Limitées, Sneakers & Mode Urbaine Casablanca',
    badge: '👟 Drop Limité',
    category: 'fashion',
    sourceInspiration: 'Testament (Shopify)',
    colors: {
      primary: '#09090b',
      primaryHover: '#18181b',
      accent: '#84cc16',
      accentHover: '#65a30d',
      bgPage: '#f4f4f5',
      cardBg: '#ffffff',
      border: '#27272a',
      borderStrong: '#52525b',
      shadowColor: 'rgba(0,0,0,0.08)',
      textPrimary: '#09090b',
      textSecondary: '#52525b',
      badgeBg: '#ecfccb',
      badgeText: '#3f6212',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-none',
      cardRadius: 'rounded-md',
      badgeStyle: 'border-2 border-black text-black bg-lime-400 font-black',
    },
    announcementText: 'NOUVEAU DROP DISPONIBLE • Tailles limitées • Livraison en 24h sur Casablanca & Rabat',
    announcementBg: '#84cc16',
    announcementTextColor: '#0f172a',
    heroHeadline: 'L’Allure Streetwear Revisitée.',
    heroSubheadline: 'Coupes oversize, tissus lourds 380 GSM et finitions premium. Portez la culture urbaine marocaine avec fierté.',
    trustPills: [
      { icon: 'CheckCircle', title: '100% Authentique', subtitle: 'Finitions irréprochables' },
      { icon: 'Truck', title: 'Livraison Rapide', subtitle: 'Essai possible à la réception' },
      { icon: 'RotateCcw', title: 'Échange de Taille Facile', subtitle: 'Coursier réexpédié en 24h' },
      { icon: 'Star', title: 'Communauté Street', subtitle: '+10 000 followers au Maroc' },
    ],
  },

  // 7. WOODMART (WoodMart - WooCommerce)
  woodmart: {
    id: 'woodmart',
    name: 'Mobilier & Déco Beldi',
    tagline: 'Art de Vivre Marocain, Salons, Tapis & Zelliges',
    badge: '🏺 Fait Main à Marrakech',
    category: 'home',
    sourceInspiration: 'WoodMart (WooCommerce)',
    colors: {
      primary: '#431407',
      primaryHover: '#571c08',
      accent: '#c2410c',
      accentHover: '#9a3412',
      bgPage: '#fefce8',
      cardBg: '#ffffff',
      border: '#fed7aa',
      borderStrong: '#fdba74',
      shadowColor: 'rgba(67,20,7,0.08)',
      textPrimary: '#431407',
      textSecondary: '#78350f',
      badgeBg: '#ffedd5',
      badgeText: '#9a3412',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-xl',
      cardRadius: 'rounded-2xl',
      badgeStyle: 'border border-amber-300 text-amber-900 bg-amber-100',
    },
    announcementText: 'Artisanat du Terroir : Tapis Beni Ouarain & Lanternes en Cuivre Ciselé • Livraison Meubles Spéciale',
    announcementBg: '#c2410c',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Sublimez Votre Intérieur aux Couleurs du Maroc.',
    heroSubheadline: 'Créations authentiques en bois de cèdre noble, poteries d’Essaouira et tissages traditionnels.',
    trustPills: [
      { icon: 'Award', title: 'Pièces Uniques', subtitle: 'Savoir-faire ancestral' },
      { icon: 'Truck', title: 'Livraison Soignée', subtitle: 'Colis volumineux protégés' },
      { icon: 'ShieldCheck', title: 'Paiement à Réception', subtitle: 'Contrôle à l’arrivée' },
      { icon: 'Heart', title: 'Soutien aux Artisans', subtitle: 'Commerce équitable local' },
    ],
  },

  // 8. SHOPTIMIZER (Shoptimizer - WooCommerce)
  shoptimizer: {
    id: 'shoptimizer',
    name: 'Speed Velocity COD',
    tagline: 'Tunnel de Vente COD Optimisé pour Téléphone Mobile',
    badge: '⚡ Vitesse Éclair < 0.8s',
    category: 'general',
    sourceInspiration: 'Shoptimizer (WooCommerce)',
    colors: {
      primary: '#047857',
      primaryHover: '#065f46',
      accent: '#f59e0b',
      accentHover: '#d97706',
      bgPage: '#ffffff',
      cardBg: '#ffffff',
      border: '#d1fae5',
      borderStrong: '#6ee7b7',
      shadowColor: 'rgba(6,78,59,0.08)',
      textPrimary: '#064e3b',
      textSecondary: '#065f46',
      badgeBg: '#ecfdf5',
      badgeText: '#065f46',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-lg',
      cardRadius: 'rounded-lg',
      badgeStyle: 'border border-emerald-400 text-emerald-900 bg-emerald-100 font-semibold',
    },
    announcementText: 'Livraison Gratuite 24h • Pas de carte bancaire, réglez en espèces en ouvrant le colis !',
    announcementBg: '#047857',
    announcementTextColor: '#ffffff',
    heroHeadline: 'L’Expérience d’Achat en Ligne la Plus Rapide du Maroc.',
    heroSubheadline: 'Un formulaire direct en 3 champs : Nom, Numéro et Ville. Votre commande est immédiatement expédiée par Ozon.',
    trustPills: [
      { icon: 'Zap', title: 'Validation 1-Clic', subtitle: 'Aucun formulaire complexe' },
      { icon: 'Truck', title: 'Livreurs Ozon & Sendit', subtitle: 'Suivi par SMS temps réel' },
      { icon: 'ShieldCheck', title: 'Vérification Colis', subtitle: 'Ouvrez avant de payer' },
      { icon: 'PhoneCall', title: 'Confirmation WhatsApp', subtitle: 'Message immédiat reçu' },
    ],
  },

  // 9. FLATSOME (Flatsome - WooCommerce)
  flatsome: {
    id: 'flatsome',
    name: 'Grand Bazar Megastore',
    tagline: 'Le Grand Hypermarché des Bonnes Affaires au Maroc',
    badge: '🛒 Électroménager & Maison',
    category: 'general',
    sourceInspiration: 'Flatsome (WooCommerce)',
    colors: {
      primary: '#1e3a8a',
      primaryHover: '#172554',
      accent: '#ea580c',
      accentHover: '#c2410c',
      bgPage: '#f8fafc',
      cardBg: '#ffffff',
      border: '#cbd5e1',
      borderStrong: '#94a3b8',
      shadowColor: 'rgba(15,23,42,0.06)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      badgeBg: '#ffedd5',
      badgeText: '#9a3412',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-md',
      cardRadius: 'rounded-lg',
      badgeStyle: 'border border-orange-300 text-orange-800 bg-orange-50 font-bold',
    },
    announcementText: 'Promotions de la Semaine : Jusqu’à -60% sur l’équipement maison & cuisine • Stock limité !',
    announcementBg: '#1e3a8a',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Tout pour la Famille et la Maison au Même Endroit.',
    heroSubheadline: 'Plus de 500 références disponibles immédiatement en stock. Livraison express dans les 12 régions du Maroc.',
    trustPills: [
      { icon: 'Package', title: 'Catalogue Géant', subtitle: 'Nouveautés chaque jour' },
      { icon: 'Tag', title: 'Prix de Gros', subtitle: 'Remises packs duo & trio' },
      { icon: 'Truck', title: 'Livraison Partout', subtitle: 'Même dans les petites villes' },
      { icon: 'CreditCard', title: 'Paiement à l’Arrivée', subtitle: 'Cash ou virement direct' },
    ],
  },

  // 10. PERFUME (Broadcast - Shopify)
  perfume: {
    id: 'perfume',
    name: 'Parfumerie & Oud Impérial',
    tagline: 'Fragrances Rares, Musc Pur & Encens Oriental',
    badge: '👑 Haute Parfumerie',
    category: 'luxury',
    sourceInspiration: 'Broadcast (Shopify)',
    colors: {
      primary: '#3b0764',
      primaryHover: '#2e0854',
      accent: '#eab308',
      accentHover: '#ca8a04',
      bgPage: '#fdf4ff',
      cardBg: '#ffffff',
      border: '#f5d0fe',
      borderStrong: '#e9d5ff',
      shadowColor: 'rgba(59,7,100,0.08)',
      textPrimary: '#3b0764',
      textSecondary: '#701a75',
      badgeBg: '#fef08a',
      badgeText: '#713f12',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-none',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-amber-300 text-amber-900 bg-amber-50 tracking-widest uppercase text-[10px]',
    },
    announcementText: 'Coffrets Cadeaux Parfum : Flacon d’essai 5ml offert avec chaque commande ce mois-ci',
    announcementBg: '#3b0764',
    announcementTextColor: '#ffffff',
    heroHeadline: 'L’Élixir des Souvenirs Éternels.',
    heroSubheadline: 'Notes envoûtantes d’ambre gris, bois de santal et roses de Kelaat M’Gouna. Sillage d’exception longue durée 24h.',
    trustPills: [
      { icon: 'Sparkles', title: 'Extrait de Parfum Pur', subtitle: 'Concentration supérieure à 25%' },
      { icon: 'ShieldCheck', title: 'Testeur Inclus', subtitle: 'Testez avant d’ouvrir le flacon' },
      { icon: 'Truck', title: 'Livraison Soignée', subtitle: 'Coffret rigide anti-casse' },
      { icon: 'Gift', title: 'Écrin Cadeau Offert', subtitle: 'Ruban satin sur demande' },
    ],
  },

  // 11. JEWELRY (Envy - Shopify)
  jewelry: {
    id: 'jewelry',
    name: 'Haute Joaillerie & Montres',
    tagline: 'Bijoux Argent 925, Or & Garde-Temps Chronographes',
    badge: '💎 Argent Pur 925 & Or',
    category: 'luxury',
    sourceInspiration: 'Envy (Shopify)',
    colors: {
      primary: '#0f172a',
      primaryHover: '#1e293b',
      accent: '#e2b342',
      accentHover: '#c59b27',
      bgPage: '#f8fafc',
      cardBg: '#ffffff',
      border: '#e2e8f0',
      borderStrong: '#94a3b8',
      shadowColor: 'rgba(15,23,42,0.06)',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-sm',
      cardRadius: 'rounded-lg',
      badgeStyle: 'border border-amber-400 text-amber-900 bg-amber-50 font-bold',
    },
    announcementText: 'Certificat d’Authenticité Fourni • Emballage Luxueux Offert • Paiement Sécurisé à la Livraison',
    announcementBg: '#0f172a',
    announcementTextColor: '#ffffff',
    heroHeadline: 'L’Éclat Intemporel des Grandes Occasions.',
    heroSubheadline: 'Des parures somptueuses inspirées de l’héritage andalou et des montres de précision à mouvement automatique.',
    trustPills: [
      { icon: 'Award', title: 'Poinçon d’État Garanti', subtitle: 'Argent 925 certifié' },
      { icon: 'ShieldCheck', title: 'Garantie 2 Ans', subtitle: 'Mouvement horloger garanti' },
      { icon: 'Truck', title: 'Livraison Discrète & Sécurisée', subtitle: 'Main propre au destinataire' },
      { icon: 'RotateCcw', title: 'Ajustement Gratuit', subtitle: 'Mise à taille offerte' },
    ],
  },

  // 12. BABYJOY (Showcase - Shopify)
  babyjoy: {
    id: 'babyjoy',
    name: 'Bébé, Maman & Éveil',
    tagline: 'Nid d’Amour, Vêtements Bio & Puériculture Douce',
    badge: '👶 100% Coton Hypoallergénique',
    category: 'kids',
    sourceInspiration: 'Showcase (Shopify)',
    colors: {
      primary: '#0369a1',
      primaryHover: '#075985',
      accent: '#f59e0b',
      accentHover: '#d97706',
      bgPage: '#f0f9ff',
      cardBg: '#ffffff',
      border: '#bae6fd',
      borderStrong: '#7dd3fc',
      shadowColor: 'rgba(3,105,161,0.08)',
      textPrimary: '#0369a1',
      textSecondary: '#0369a1',
      badgeBg: '#e0f2fe',
      badgeText: '#0369a1',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-full',
      cardRadius: 'rounded-3xl',
      badgeStyle: 'border-2 border-sky-300 text-sky-900 bg-sky-100 font-bold',
    },
    announcementText: 'Bienvenue Bébé : Pack Naissance Complet avec Livraison Rapide partout au Maroc !',
    announcementBg: '#0369a1',
    announcementTextColor: '#ffffff',
    heroHeadline: 'La Plus Grande Douceur pour Votre Bébé.',
    heroSubheadline: 'Des matières respirantes, sans colorants chimiques toxiques, adaptées à la peau sensible des tout-petits.',
    trustPills: [
      { icon: 'ShieldCheck', title: 'Certifié Oeko-Tex', subtitle: 'Zéro substance nocive' },
      { icon: 'Heart', title: 'Testé Pédiatrique', subtitle: 'Approuvé par les mamans' },
      { icon: 'Truck', title: 'Paiement à Domicile', subtitle: 'Pas besoin de vous déplacer' },
      { icon: 'RotateCcw', title: 'Retours Sans Tracas', subtitle: '14 jours pour échanger' },
    ],
  },

  // 13. CULINARY (Crave - Shopify)
  culinary: {
    id: 'culinary',
    name: 'Terroir & Épicerie Fine',
    tagline: 'Miels Purs du Maroc, Amlou aux Amandes & Safran Pur',
    badge: '🍯 Terroir Marocain Certifié',
    category: 'food',
    sourceInspiration: 'Crave (Shopify)',
    colors: {
      primary: '#14532d',
      primaryHover: '#166534',
      accent: '#d97706',
      accentHover: '#b45309',
      bgPage: '#fefce8',
      cardBg: '#ffffff',
      border: '#bbf7d0',
      borderStrong: '#86efac',
      shadowColor: 'rgba(20,83,45,0.08)',
      textPrimary: '#14532d',
      textSecondary: '#15803d',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-xl',
      cardRadius: 'rounded-2xl',
      badgeStyle: 'border border-amber-300 text-amber-900 bg-amber-50 font-bold',
    },
    announcementText: 'Miel de Thym (Zâatra) & Safran de Taliouine : Récolte fraîche 2026 • Analyse laboratoire certifiée',
    announcementBg: '#14532d',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Les Trésors Authentiques du Terroir Marocain.',
    heroSubheadline: 'Du producteur directement à votre table. Miels sauvages crus, Amlou traditionnel au miel d’oranger et huile d’olive pressée à froid.',
    trustPills: [
      { icon: 'Award', title: 'Certifié ONSSA', subtitle: 'Conforme aux normes de santé' },
      { icon: 'Sparkles', title: '100% Naturel Non Chauffé', subtitle: 'Toutes les vertus préservées' },
      { icon: 'Truck', title: 'Pots Sécurisés', subtitle: 'Emballage bulle antichoc' },
      { icon: 'Check', title: 'Paiement à la Livraison', subtitle: 'Dégustez la qualité' },
    ],
  },

  // 14. FITNESS (Impulse - Shopify)
  fitness: {
    id: 'fitness',
    name: 'Sport, Fitness & Musculation',
    tagline: 'Équipements d’Entraînement, Bandes & Nutrition Sportive',
    badge: '⚡ Performance & Puissance',
    category: 'sports',
    sourceInspiration: 'Impulse (Shopify)',
    colors: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      accent: '#f97316',
      accentHover: '#ea580c',
      bgPage: '#18181b',
      cardBg: '#27272a',
      border: '#3f3f46',
      borderStrong: '#52525b',
      shadowColor: 'rgba(0,0,0,0.40)',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      badgeBg: '#ffedd5',
      badgeText: '#9a3412',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-lg',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border-2 border-orange-500 text-white bg-orange-600 font-black tracking-wide',
    },
    announcementText: 'TRANSFORMEZ VOTRE PHYSIQUE • Pack Salle à Domicile en promo • Livraison Express 24h',
    announcementBg: '#f97316',
    announcementTextColor: '#0f172a',
    heroHeadline: 'Dépassez Vos Limites Chaque Jour.',
    heroSubheadline: 'Matériel de musculation haute résistance et accessoires conçus pour les athlètes exigeants au Maroc.',
    trustPills: [
      { icon: 'Zap', title: 'Ultra Résistant', subtitle: 'Supporte jusqu’à 250 kg' },
      { icon: 'ShieldCheck', title: 'Garantie Remplacement', subtitle: 'Matériel robuste testé' },
      { icon: 'Truck', title: 'Livraison 24h/48h', subtitle: 'Paiement cash à l’arrivée' },
      { icon: 'Star', title: '+500 Salles Équipées', subtitle: 'Recommandé par les coachs' },
    ],
  },

  // 15. AUTOMOTIVE (Warehouse - Shopify)
  automotive: {
    id: 'automotive',
    name: 'Auto-Moto & Outillage Pro',
    tagline: 'Entretien Auto, Ampoules LED, Valises Diagnostic & Outils',
    badge: '🚗 Pro & Garagistes',
    category: 'auto',
    sourceInspiration: 'Warehouse (Shopify)',
    colors: {
      primary: '#1e293b',
      primaryHover: '#0f172a',
      accent: '#ef4444',
      accentHover: '#dc2626',
      bgPage: '#f1f5f9',
      cardBg: '#ffffff',
      border: '#cbd5e1',
      borderStrong: '#94a3b8',
      shadowColor: 'rgba(15,23,42,0.06)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      badgeBg: '#fee2e2',
      badgeText: '#991b1b',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-md',
      cardRadius: 'rounded-md',
      badgeStyle: 'border-2 border-red-600 text-red-900 bg-red-50 font-bold',
    },
    announcementText: 'Spécial Automobilistes : Caméras Dashcam & Ampoules LED Canbus garanties anti-erreur ODB',
    announcementBg: '#1e293b',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Prenez Soin de Votre Véhicule Comme un Pro.',
    heroSubheadline: 'Accessoires électroniques, outillage de précision et produits d’entretien pour toutes marques de voitures au Maroc.',
    trustPills: [
      { icon: 'Wrench', title: 'Qualité Garage Pro', subtitle: 'Résistance professionnelle' },
      { icon: 'CheckCircle', title: 'Compatibilité Garantie', subtitle: 'Vérifiez votre modèle' },
      { icon: 'Truck', title: 'Livraison Toute Ville', subtitle: 'Partout au Maroc' },
      { icon: 'ShieldCheck', title: 'Garantie 1 An', subtitle: 'SAV immédiat' },
    ],
  },

  // 16. EYEWEAR (Focal - Shopify)
  eyewear: {
    id: 'eyewear',
    name: 'Optique & Lunettes Solaires',
    tagline: 'Montures Créateur, Verres Polarisés UV400 & Anti-Lumière Bleue',
    badge: '🕶️ Protection UV400 Maximale',
    category: 'fashion',
    sourceInspiration: 'Focal (Shopify)',
    colors: {
      primary: '#171717',
      primaryHover: '#262626',
      accent: '#b45309',
      accentHover: '#92400e',
      bgPage: '#fafaf9',
      cardBg: '#ffffff',
      border: '#e7e5e4',
      borderStrong: '#a8a29e',
      shadowColor: 'rgba(28,25,23,0.06)',
      textPrimary: '#1c1917',
      textSecondary: '#57534e',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-full',
      cardRadius: 'rounded-2xl',
      badgeStyle: 'border border-amber-300 text-amber-900 bg-amber-50',
    },
    announcementText: 'Étui Rigide & Microfibre de Nettoyage Offerts avec chaque paire • Livraison 24h',
    announcementBg: '#171717',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Regardez le Monde avec Clarté et Style.',
    heroSubheadline: 'Montures ultra-légères en acétate et verres polarisés haute définition pour affronter le soleil marocain sans éblouissement.',
    trustPills: [
      { icon: 'Eye', title: 'Verres Polarisés Cat. 3', subtitle: 'Protection oculaire totale' },
      { icon: 'ShieldCheck', title: 'Garantie Incassable', subtitle: 'Charnières flexibles renforcées' },
      { icon: 'Truck', title: 'Paiement à Réception', subtitle: 'Essayez à la livraison' },
      { icon: 'Package', title: 'Pack Complet Inclus', subtitle: 'Étui rigide + chiffonnette' },
    ],
  },

  // 17. BOTANICA (Canopy - Shopify)
  botanica: {
    id: 'botanica',
    name: 'Herboristerie & Remèdes Bio',
    tagline: 'Graine Noire (Nigelle), Spiruline, Tisanes & Santé Naturelle',
    badge: '🌿 Bien-Être & Vitalité',
    category: 'beauty',
    sourceInspiration: 'Canopy (Shopify)',
    colors: {
      primary: '#064e3b',
      primaryHover: '#065f46',
      accent: '#10b981',
      accentHover: '#059669',
      bgPage: '#f0fdf4',
      cardBg: '#ffffff',
      border: '#bbf7d0',
      borderStrong: '#86efac',
      shadowColor: 'rgba(6,78,59,0.08)',
      textPrimary: '#064e3b',
      textSecondary: '#047857',
      badgeBg: '#dcfce7',
      badgeText: '#14532d',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-2xl',
      cardRadius: 'rounded-2xl',
      badgeStyle: 'border border-emerald-300 text-emerald-900 bg-emerald-100 font-semibold',
    },
    announcementText: 'La Sagesse des Plantes : Produits 100% purs sans additifs chimiques • Conseils naturopathie sur WhatsApp',
    announcementBg: '#064e3b',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Retrouvez Votre Vitalité par la Nature.',
    heroSubheadline: 'Compléments alimentaires et poudres botaniques récoltées dans le respect des cycles biologiques naturels.',
    trustPills: [
      { icon: 'Sparkles', title: '100% Végétal & Pur', subtitle: 'Aucun conservateur' },
      { icon: 'Heart', title: 'Renforce l’Immunité', subtitle: 'Riche en antioxydants' },
      { icon: 'Truck', title: 'Livraison Rapide', subtitle: 'Partout au Maroc en 48h' },
      { icon: 'ShieldCheck', title: 'Conseils Personnalisés', subtitle: 'Équipe joignable 7j/7' },
    ],
  },

  // 18. COFFEE & TEA (Venue - Shopify)
  coffee_tea: {
    id: 'coffee_tea',
    name: 'Café d’Origine & Thé Beldi',
    tagline: 'Grains Fraîchement Torréfiés, Thé Vert Gunpowder & Accessoires',
    badge: '☕ Torréfaction Artisanale',
    category: 'food',
    sourceInspiration: 'Venue (Shopify)',
    colors: {
      primary: '#38220f',
      primaryHover: '#4a2d14',
      accent: '#c2410c',
      accentHover: '#9a3412',
      bgPage: '#fffbeb',
      cardBg: '#ffffff',
      border: '#fde68a',
      borderStrong: '#fcd34d',
      shadowColor: 'rgba(56,34,15,0.08)',
      textPrimary: '#38220f',
      textSecondary: '#78350f',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-xl',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-amber-300 text-amber-950 bg-amber-100',
    },
    announcementText: 'Le Goût Véritable du Café Frais : Torréfié chaque semaine à Casablanca • Pack Dégustation en promotion',
    announcementBg: '#38220f',
    announcementTextColor: '#ffffff',
    heroHeadline: 'L’Art de la Pause Café & du Thé à la Menthe.',
    heroSubheadline: 'Sélection rigoureuse des meilleurs crus d’Éthiopie et de Colombie et thés impériaux pour vos moments de partage.',
    trustPills: [
      { icon: 'Award', title: '100% Arabica & Terroir', subtitle: 'Grains de spécialité' },
      { icon: 'Package', title: 'Sachet Valve Fraîcheur', subtitle: 'Arômes intacts 6 mois' },
      { icon: 'Truck', title: 'Livraison en 24h', subtitle: 'Paiement à la réception' },
      { icon: 'Heart', title: 'Mouture sur Mesure', subtitle: 'Espresso, filtre ou moka' },
    ],
  },

  // 19. CERAMICS (Savoy - WooCommerce)
  ceramics: {
    id: 'ceramics',
    name: 'Céramique & Poterie de Safi',
    tagline: 'Tajines, Vaisselle Émaillée & Céramiques Contemporaines',
    badge: '🏺 Pièces Uniques Émaillées',
    category: 'home',
    sourceInspiration: 'Savoy (WooCommerce)',
    colors: {
      primary: '#7c2d12',
      primaryHover: '#9a3412',
      accent: '#1d4ed8',
      accentHover: '#1e40af',
      bgPage: '#fafaf9',
      cardBg: '#ffffff',
      border: '#e7e5e4',
      borderStrong: '#a8a29e',
      shadowColor: 'rgba(67,20,7,0.06)',
      textPrimary: '#431407',
      textSecondary: '#78350f',
      badgeBg: '#fee2e2',
      badgeText: '#991b1b',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-sm',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-stone-300 text-stone-900 bg-stone-100',
    },
    announcementText: 'Garantie Zéro Casse : Emballage renforcé double alvéole • Remboursement immédiat si bris',
    announcementBg: '#7c2d12',
    announcementTextColor: '#ffffff',
    heroHeadline: 'L’Élégance de la Terre Cuite à Votre Table.',
    heroSubheadline: 'Des décors peints à main levée à Safi et Fès. Chaque plat raconte une histoire séculaire d’argile et de feu.',
    trustPills: [
      { icon: 'ShieldCheck', title: 'Garantie Zéro Casse', subtitle: 'Remplacement immédiat' },
      { icon: 'Award', title: '100% Artisanal', subtitle: 'Peint à la main par nos maâlems' },
      { icon: 'Truck', title: 'Livraison Soignée', subtitle: 'Vérifiez le colis à l’arrivée' },
      { icon: 'Flame', title: 'Cuisson Haute Température', subtitle: 'Compatible lave-vaisselle' },
    ],
  },

  // 20. PETCARE (Pastel Pet - Shopify)
  petcare: {
    id: 'petcare',
    name: 'Animalerie & Soins Animaux',
    tagline: 'Accessoires, Litières, Jouets & Confort pour Chiens et Chats',
    badge: '🐾 Le Paradis de Vos Compagnons',
    category: 'general',
    sourceInspiration: 'Pastel Pet (Shopify)',
    colors: {
      primary: '#115e59',
      primaryHover: '#0f766e',
      accent: '#fb7185',
      accentHover: '#f43f5e',
      bgPage: '#f0fdfa',
      cardBg: '#ffffff',
      border: '#99f6e4',
      borderStrong: '#5eead4',
      shadowColor: 'rgba(19,78,74,0.08)',
      textPrimary: '#134e4a',
      textSecondary: '#115e59',
      badgeBg: '#ffe4e6',
      badgeText: '#be123c',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-full',
      cardRadius: 'rounded-3xl',
      badgeStyle: 'border border-teal-300 text-teal-900 bg-teal-100 font-semibold',
    },
    announcementText: 'Livraison Rapide Croquettes & Accessoires directement à votre porte partout au Maroc !',
    announcementBg: '#115e59',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Le Meilleur Confort pour Votre Animal de Compagnie.',
    heroSubheadline: 'Fontaines d’eau filtrante, lits apaisants ultra-doux et jouets interactifs testés et approuvés par les vétérinaires.',
    trustPills: [
      { icon: 'Heart', title: 'Confort Garanti', subtitle: 'Matériaux non toxiques doux' },
      { icon: 'Truck', title: 'Livraison Rapide', subtitle: 'Paiement à la réception' },
      { icon: 'CheckCircle', title: 'Approuvé Vétérinaire', subtitle: 'Sécurité totale' },
      { icon: 'RotateCcw', title: 'Échange Facile', subtitle: 'Si taille inadaptée' },
    ],
  },

  // 21. KIDS FASHION (Little Explorers - Shopify)
  kids_fashion: {
    id: 'kids_fashion',
    name: 'Mode Enfant & Junior',
    tagline: 'Vêtements Tendances, Djellabas Fêtes & Rentrée Scolaire',
    badge: '🎈 Couleurs & Joie de Vivre',
    category: 'kids',
    sourceInspiration: 'Little Explorers (Shopify)',
    colors: {
      primary: '#3730a3',
      primaryHover: '#312e81',
      accent: '#eab308',
      accentHover: '#ca8a04',
      bgPage: '#eef2ff',
      cardBg: '#ffffff',
      border: '#c7d2fe',
      borderStrong: '#a5b4fc',
      shadowColor: 'rgba(49,46,129,0.08)',
      textPrimary: '#312e81',
      textSecondary: '#4338ca',
      badgeBg: '#fef9c3',
      badgeText: '#854d0e',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-2xl',
      cardRadius: 'rounded-2xl',
      badgeStyle: 'border-2 border-indigo-400 text-indigo-900 bg-indigo-100 font-bold',
    },
    announcementText: 'Tenues Traditionnelles Enfants pour les Fêtes & l’Aïd • Pack Frère & Sœur en promotion !',
    announcementBg: '#3730a3',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Habillez Vos Petits avec Amour et Style.',
    heroSubheadline: 'Des collections colorées, confortables et faciles à entretenir pour accompagner chaque aventure de vos enfants.',
    trustPills: [
      { icon: 'Sparkles', title: 'Coton Doux Respirant', subtitle: 'Idéal pour le climat marocain' },
      { icon: 'RotateCcw', title: 'Échange de Taille Gratuit', subtitle: 'Nous renvoyons la bonne taille' },
      { icon: 'Truck', title: 'Paiement Espèces', subtitle: 'Au livreur directement' },
      { icon: 'Heart', title: '+3000 Mamans Conquises', subtitle: 'Noté 4.9/5' },
    ],
  },

  // 22. LEATHER CRAFT (Heritage Leather - WooCommerce)
  leather_craft: {
    id: 'leather_craft',
    name: 'Tannerie de Fès & Maroquinerie',
    tagline: 'Sacs de Voyage, Ceintures & Babouches Royales en Cuir Pleine Fleur',
    badge: '🇲🇦 Tannerie Chouara Fès',
    category: 'luxury',
    sourceInspiration: 'Heritage Leather (WooCommerce)',
    colors: {
      primary: '#451a03',
      primaryHover: '#7a2706',
      accent: '#b45309',
      accentHover: '#92400e',
      bgPage: '#fffbeb',
      cardBg: '#ffffff',
      border: '#fde68a',
      borderStrong: '#fcd34d',
      shadowColor: 'rgba(69,26,3,0.08)',
      textPrimary: '#451a03',
      textSecondary: '#78350f',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[-0.02em] font-serif text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight font-serif',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-serif',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-md',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-amber-400 text-amber-900 bg-amber-50 font-bold',
    },
    announcementText: 'Cuir Tanné Naturellement sans Chrome • Patine Exceptionnelle avec le Temps • Envoi Express',
    announcementBg: '#451a03',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Le Charme Inégalé du Cuir Pleine Fleur Marocain.',
    heroSubheadline: 'Sacs besace, cartables et sacs week-end cousus à la main au fil poissé pour durer toute une vie.',
    trustPills: [
      { icon: 'Award', title: 'Cuir Naturel 100%', subtitle: 'Tannage végétal traditionnel' },
      { icon: 'ShieldCheck', title: 'Garantie à Vie des Coutures', subtitle: 'Solidité à toute épreuve' },
      { icon: 'Truck', title: 'Livraison 24/48h', subtitle: 'Paiement à la réception' },
      { icon: 'Gift', title: 'Porte-Clés Cuir Offert', subtitle: 'Avec chaque commande' },
    ],
  },

  // 23. KITCHEN (Cookware Studio - Shopify)
  kitchen: {
    id: 'kitchen',
    name: 'Cuisine, Robots & Électroménager',
    tagline: 'Friteuses sans Huile Air Fryer, Poêles Granit & Hachoirs Express',
    badge: '🍳 Gain de Temps en Cuisine',
    category: 'home',
    sourceInspiration: 'Cookware Studio (Shopify)',
    colors: {
      primary: '#334155',
      primaryHover: '#1e293b',
      accent: '#e11d48',
      accentHover: '#be123c',
      bgPage: '#f8fafc',
      cardBg: '#ffffff',
      border: '#e2e8f0',
      borderStrong: '#94a3b8',
      shadowColor: 'rgba(15,23,42,0.06)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      badgeBg: '#ffe4e6',
      badgeText: '#be123c',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-lg',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-rose-300 text-rose-800 bg-rose-50 font-bold',
    },
    announcementText: 'Cuisinez Sainement : Friteuse sans huile Air Fryer XXL à prix choc • Livre de recettes marocaines offert',
    announcementBg: '#e11d48',
    announcementTextColor: '#ffffff',
    heroHeadline: 'Préparez les Meilleurs Plats Marocains en un Éclair.',
    heroSubheadline: 'Des appareils électroménagers puissants et robustes pour réussir tajines, pâtisseries et jus frais en toute simplicité.',
    trustPills: [
      { icon: 'Zap', title: 'Puissance Supérieure', subtitle: 'Cuisson rapide et homogène' },
      { icon: 'ShieldCheck', title: 'Garantie 1 An Complète', subtitle: 'Réparation ou échange rapide' },
      { icon: 'Truck', title: 'Livraison à Domicile', subtitle: 'Testez le produit à réception' },
      { icon: 'BookOpen', title: 'Recettes Offertes', subtitle: 'En darija & français' },
    ],
  },

  // 24. CYBERPUNK (Baseline - Shopify)
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Gaming & Cyber Setup',
    tagline: 'Claviers Mécaniques RGB, Souris Pro & Éclairages LED Néon',
    badge: '👾 Setup Pro Gamer Maroc',
    category: 'tech',
    sourceInspiration: 'Baseline (Shopify)',
    colors: {
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      accent: '#8b5cf6',
      accentHover: '#7c3aed',
      bgPage: '#09090b',
      cardBg: '#18181b',
      border: '#27272a',
      borderStrong: '#52525b',
      shadowColor: 'rgba(0,0,0,0.40)',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      badgeBg: '#3b0764',
      badgeText: '#c084fc',
    },
    typography: {
      fontFamily: 'monospace',
      headingClass: 'font-mono font-black tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-[0.04em] font-mono text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-[0.04em] font-mono',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3] font-mono',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2 font-mono',
        caption: 'text-[11px] leading-[1.4] tracking-widest font-mono',
        label: 'text-[10px] font-bold uppercase tracking-[0.14em] font-mono',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-none',
      cardRadius: 'rounded-md',
      badgeStyle: 'border border-purple-500 text-purple-300 bg-purple-950 font-mono text-xs',
    },
    announcementText: 'LEVEL UP YOUR SETUP : Nouveaux Claviers Mécaniques Swappables • Livraison 24h au Maroc',
    announcementBg: '#7c3aed',
    announcementTextColor: '#ffffff',
    heroHeadline: 'L’Arsenal Ultime pour Dominer Vos Parties.',
    heroSubheadline: 'Périphériques e-sport de haute précision, temps de réponse 1ms et éclairage néon immersif pour votre setup de streaming.',
    trustPills: [
      { icon: 'Zap', title: 'Temps de Réponse 1ms', subtitle: 'Performance sans latence' },
      { icon: 'ShieldCheck', title: 'Switchs Mécaniques Testés', subtitle: '+50M de frappes garanties' },
      { icon: 'Truck', title: 'Livraison Gaming Express', subtitle: 'Paiement cash à l’arrivée' },
      { icon: 'Package', title: 'Emballage Blindé', subtitle: 'Zéro dommage transport' },
    ],
  },

  // 25. VELOCITY COD (YouCan Max - Custom Moroccan COD)
  velocity_cod: {
    id: 'velocity_cod',
    name: 'YouCan Velocity COD Ultra',
    tagline: 'Le Thème Référence de Conversion COD avec Validation WhatsApp Directe',
    badge: '👑 Référence E-Commerce Maroc',
    category: 'general',
    sourceInspiration: 'YouCan.shop Proprietary Engine',
    colors: {
      primary: '#047857',
      primaryHover: '#065f46',
      accent: '#eab308',
      accentHover: '#ca8a04',
      bgPage: '#f8fafc',
      cardBg: '#ffffff',
      border: '#a7f3d0',
      borderStrong: '#6ee7b7',
      shadowColor: 'rgba(6,78,59,0.08)',
      textPrimary: '#064e3b',
      textSecondary: '#065f46',
      badgeBg: '#d1fae5',
      badgeText: '#065f46',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-bold tracking-tight',
      scale: {
        h1: 'text-[clamp(1.75rem,4vw+0.5rem,3rem)] font-black leading-[1.1] tracking-tight text-wrap-balance',
        h2: 'text-[clamp(1.25rem,2.5vw+0.5rem,1.875rem)] font-bold leading-[1.2] tracking-tight',
        h3: 'text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] font-semibold leading-[1.3]',
        cardTitle: 'text-[clamp(0.8125rem,1vw+0.5rem,0.875rem)] font-bold leading-[1.4] line-clamp-2',
        caption: 'text-[11px] leading-[1.4] tracking-wide',
        label: 'text-[10px] font-semibold uppercase tracking-widest',
      },
    },
    styleTokens: {
      buttonRadius: 'rounded-xl',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border-2 border-emerald-500 text-emerald-950 bg-emerald-100 font-black',
    },
    announcementText: '🇲🇦 N°1 du Cash on Delivery au Maroc • Livraison Gratuite dès 350 DH • Paiement après inspection du colis',
    announcementBg: '#047857',
    announcementTextColor: '#ffffff',
    heroHeadline: 'La Confiance Absolue du Paiement à la Livraison.',
    heroSubheadline: 'Ne payez rien à l’avance. Vous commandez en un clic, notre coursier vous livre à domicile, vous inspectez le colis puis vous réglez en espèces.',
    trustPills: [
      { icon: 'ShieldCheck', title: 'Vérification Obligatoire', subtitle: 'Ouvrez avant de payer' },
      { icon: 'Truck', title: 'Livraison 24h Partout', subtitle: 'Casablanca, Rabat, Marrakech...' },
      { icon: 'PhoneCall', title: 'Suivi WhatsApp Dédié', subtitle: 'Confirmation immédiate' },
      { icon: 'RotateCcw', title: 'Échange Gratuit 7j', subtitle: 'Satisfait ou remboursé' },
    ],
  },
};

export const THEME_LIST: ThemeConfig[] = Object.values(THEMES);

export function getThemeById(id: string): ThemeConfig {
  return THEMES[id as ThemeId] || THEMES.luxury;
}

export function getThemesByCategory(category: string): ThemeConfig[] {
  if (category === 'all') return THEME_LIST;
  return THEME_LIST.filter((t) => t.category === category);
}

// --- WCAG contrast helpers ---

export function getContrastText(bg: string): string {
  const hex = bg.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  const contrastWhite = 1.05 / (L + 0.05);
  const contrastBlack = (L + 0.05) / 0.05;
  return contrastWhite >= contrastBlack ? '#ffffff' : '#0f172a';
}

export function getAnnouncementTextColor(bg: string): string {
  return getContrastText(bg);
}

export function validateThemeContrast(theme: ThemeConfig): { announcement: boolean; textSecondary: boolean; badge: boolean } {
  const hexToLum = (hex: string) => {
    const h = hex.replace('#','');
    const r = parseInt(h.slice(0,2),16)/255, g=parseInt(h.slice(2,4),16)/255, b=parseInt(h.slice(4,6),16)/255;
    const toL=(c:number)=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4);
    return 0.2126*toL(r)+0.7152*toL(g)+0.0722*toL(b);
  };
  const contrast = (a:string,b:string)=>{
    const La=hexToLum(a), Lb=hexToLum(b);
    const l1=Math.max(La,Lb), l2=Math.min(La,Lb);
    return (l1+0.05)/(l2+0.05);
  };
  return {
    announcement: contrast(theme.announcementTextColor, theme.announcementBg) >= 4.5,
    textSecondary: contrast(theme.colors.textSecondary, theme.colors.cardBg) >= 4.5 && contrast(theme.colors.textSecondary, theme.colors.bgPage) >= 4.5,
    badge: contrast(theme.colors.badgeText, theme.colors.badgeBg) >= 4.5,
  };
}
