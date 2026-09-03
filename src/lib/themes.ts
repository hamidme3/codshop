export type ThemeId = 'luxury' | 'beauty' | 'tech';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  badge: string;
  colors: {
    primary: string;
    primaryHover: string;
    accent: string;
    accentHover: string;
    bgPage: string;
    cardBg: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    badgeBg: string;
    badgeText: string;
  };
  typography: {
    fontFamily: string;
    headingClass: string;
  };
  styleTokens: {
    buttonRadius: string;
    cardRadius: string;
    badgeStyle: string;
  };
  trustPills: Array<{ icon: string; title: string; subtitle: string }>;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  luxury: {
    id: 'luxury',
    name: 'Luxe & Artisanal',
    tagline: 'Maison de Haute Maroquinerie & Souliers Faits Main',
    badge: 'Artisanat Marocain',
    colors: {
      primary: '#090d16',
      primaryHover: '#1e293b',
      accent: '#c59b27',
      accentHover: '#d4af37',
      bgPage: '#faf9f6',
      cardBg: '#ffffff',
      border: '#e2e8f0',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
      badgeBg: '#fef3c7',
      badgeText: '#92400e',
    },
    typography: {
      fontFamily: 'serif',
      headingClass: 'font-serif tracking-tight',
    },
    styleTokens: {
      buttonRadius: 'rounded-none',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-amber-300 text-amber-900 bg-amber-50',
    },
    trustPills: [
      { icon: 'Award', title: '100% Cuir Véritable', subtitle: 'Fabrication artisanale' },
      { icon: 'Truck', title: 'Livraison Express 24h/48h', subtitle: 'Partout au Maroc' },
      { icon: 'ShieldCheck', title: 'Paiement à la livraison', subtitle: 'Vérifiez avant de payer' },
      { icon: 'RotateCcw', title: 'Échange Gratuit', subtitle: 'Sous 7 jours garantis' },
    ],
  },
  beauty: {
    id: 'beauty',
    name: 'Beauté & Soins',
    tagline: 'Élixirs Botaniques & Rituels Naturels du Maroc',
    badge: '100% Bio & Naturel',
    colors: {
      primary: '#881337',
      primaryHover: '#9f1239',
      accent: '#f43f5e',
      accentHover: '#e11d48',
      bgPage: '#fff5f7',
      cardBg: '#ffffff',
      border: '#fecdd3',
      textPrimary: '#4c0519',
      textSecondary: '#9f1239',
      badgeBg: '#ffe4e6',
      badgeText: '#be123c',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-extrabold tracking-tight',
    },
    styleTokens: {
      buttonRadius: 'rounded-full',
      cardRadius: 'rounded-2xl',
      badgeStyle: 'border border-rose-200 text-rose-800 bg-rose-50',
    },
    trustPills: [
      { icon: 'Sparkles', title: 'Formule 100% Pure', subtitle: 'Huile d’argan certifiée' },
      { icon: 'HeartHandshake', title: 'Satisfait ou Remboursé', subtitle: 'Testé dermatologiquement' },
      { icon: 'Truck', title: 'Livraison Rapide', subtitle: 'Paiement en espèces à l’arrivée' },
      { icon: 'Clock', title: 'Service Client VIP', subtitle: 'Conseils personnalisés 7j/7' },
    ],
  },
  tech: {
    id: 'tech',
    name: 'Tech & Gadgets',
    tagline: 'Accessoires Intelligents & Innovations Connectées',
    badge: 'Offre Flash Limitée',
    colors: {
      primary: '#18181b',
      primaryHover: '#27272a',
      accent: '#2563eb',
      accentHover: '#1d4ed8',
      bgPage: '#f4f4f5',
      cardBg: '#ffffff',
      border: '#e4e4e7',
      textPrimary: '#09090b',
      textSecondary: '#71717a',
      badgeBg: '#dbeafe',
      badgeText: '#1e40af',
    },
    typography: {
      fontFamily: 'sans-serif',
      headingClass: 'font-sans font-black tracking-tight',
    },
    styleTokens: {
      buttonRadius: 'rounded-xl',
      cardRadius: 'rounded-xl',
      badgeStyle: 'border border-blue-200 text-blue-800 bg-blue-50',
    },
    trustPills: [
      { icon: 'Zap', title: 'Garantie 1 An Remplacement', subtitle: 'SAV réactif au Maroc' },
      { icon: 'Truck', title: 'Expédition en 24h', subtitle: 'Paiement à la réception' },
      { icon: 'CheckCircle', title: 'Produit Certifié Original', subtitle: 'Notice en français & arabe' },
      { icon: 'Package', title: 'Colis Sécurisé', subtitle: 'Emballage antichoc renforcé' },
    ],
  },
};
