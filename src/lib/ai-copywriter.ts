export interface BundleOffer {
  name: string;
  qty: number;
  priceTotal: number;
  discountBadge: string;
  isPopular?: boolean;
}

export interface MoroccanAICopy {
  title: string;
  hookDarija: string;
  hookFrench: string;
  sellingPoints: string[];
  reassurancesDarija: string[];
  suggestedPrice: number;
  suggestedComparePrice: number;
  suggestedCostPrice: number;
  bundles: BundleOffer[];
}

export const MOROCCAN_NICHES = [
  'Maroquinerie & Sacs',
  'Caftans & Prêt-à-porter',
  'Cosmétiques & Huiles Naturelles',
  'High-Tech & Gadgets',
  'Maison & Cuisine',
  'Parfums & Senteurs',
] as const;

export type MoroccanNiche = typeof MOROCCAN_NICHES[number];

const KNOWLEDGE_BASE: Record<string, {
  titles: string[];
  hooksDarija: string[];
  hooksFrench: string[];
  sellingPoints: string[];
  reassurancesDarija: string[];
  multiplier: number;
  costRatio: number;
}> = {
  'Maroquinerie & Sacs': {
    titles: [
      'Sac à Main Cuir Véritable Fès - Élégance & Finition Fait Main',
      'Sacoche Prestige Cuir Artisanat Marocain Édition Limitée',
      'Pochette Royale en Cuir Véritable avec Fermoir Doré',
    ],
    hooksDarija: [
      '🔥 همزة لا تعوض! جلد طبيعي أصيل ومقاوم، كيعطيك هيبة وأناقة فين ما مشيتي.',
      '✨ كتقلبي على الفخامة؟ حقيبة جلدية أصلية باليد، سلعة نقية والكمية محدودة بزاف!',
    ],
    hooksFrench: [
      'Sublimez votre élégance au quotidien avec notre cuir 100% véritable façonné par nos maîtres artisans.',
      'L\'alliance parfaite entre tradition marocaine et modernité. Résistant, spacieux et chic.',
    ],
    sellingPoints: [
      'Cuir véritable 100% premier choix - Ne s\'écaille jamais',
      'Compartiments multiples avec fermetures zippées renforcées',
      'Finition premium avec coutures doublées faites main',
      'Bandoulière réglable et amovible incluse',
    ],
    reassurancesDarija: [
      '✅ شوف وقَلب السلعة ديالك فاش يوصلك الكولي عاد خلص',
      '🚚 التوصيل سريع حتى لباب دارك فجميع مدن المغرب',
      '🛡️ ضمان استبدال واسترجاع لمدة 7 أيام إلى معجباتكش السلعة',
    ],
    multiplier: 1.5,
    costRatio: 0.32,
  },
  'Caftans & Prêt-à-porter': {
    titles: [
      'Caftan Soie et Dentelle Dubaï - Broderie Rbati Haute Couture',
      'Gandoura Moderne Tissu Crêpe Premium pour Soirées & Fêtes',
      'Djellaba Élégance Marocaine avec Sfifa et Aakad Royaux',
    ],
    hooksDarija: [
      '👑 كوني نجمة المناسبات! قفطان ملكي بتطريز متقون وثوب كيطيح غزال على الفورمة.',
      '✨ أناقة مغربية راقية: زواقة المعلم وسفيفة نقية، التوصيل فابور حتى لباب الدار!',
    ],
    hooksFrench: [
      'Révélez votre grâce marocaine avec nos créations Haute Couture brodées aux finitions royales.',
      'Tissu soyeux respirant, coupe moderne qui sublime votre silhouette lors de toutes vos réceptions.',
    ],
    sellingPoints: [
      'Tissu Crêpe de soie royal infroissable et ultra fluide',
      'Broderie artisanale fine avec sfifa et aakad dorés',
      'Ceinture assortie offerte avec boucle ornée de cristaux',
      'Disponible en plusieurs tailles (S au XXL) et couleurs tendances',
    ],
    reassurancesDarija: [
      '👗 كيسي وقيسي السلعة عند الليفرور عاد خلصي',
      '🚚 التوصيل فابور حتى للباب في 24 إلى 48 ساعة',
      '🔄 إمكانية تبديل المقاس مجاناً إذا ما جاش قادك',
    ],
    multiplier: 1.6,
    costRatio: 0.35,
  },
  'Cosmétiques & Huiles Naturelles': {
    titles: [
      'Pack Beauté Bio : Huile d\'Argan Pure + Sérum Figue de Barbarie',
      'Élixir Anti-Âge 100% Naturel aux Plantes de l\'Atlas',
      'Coffret Soin Visage & Cheveux Éclat Traditionnel Marocain',
    ],
    hooksDarija: [
      '🌿 سر الجمال المغربي الطبيعي! تخلصي من التجاعيد والبقع وعطي لوجهك نظارة حقيقية.',
      '💧 زيت أركان وصبار أصليين 100% معصورين على البارد - نتايج كتبان من أول أسبوع!',
    ],
    hooksFrench: [
      'Offrez à votre peau l\'excellence de la nature marocaine. Certifié pur, pressé à froid.',
      'Régénérez votre teint et effacez les signes de fatigue dès 7 jours d\'utilisation.',
    ],
    sellingPoints: [
      '100% Pur et Naturel sans additifs chimiques ni conservateurs',
      'Riche en Vitamine E et acides gras essentiels Oméga 6 & 9',
      'Hydratation profonde et effet liftant immédiat',
      'Convient à tous les types de peaux, même les plus sensibles',
    ],
    reassurancesDarija: [
      '🧪 منتوجات مرخصة ومضمونة 100% طبيعية',
      '🚚 الدفع عند الاستلام بعد معاينة العلبة',
      '⭐ أكثر من 1,400 سيدة راضية عن النتيجة',
    ],
    multiplier: 2.2,
    costRatio: 0.25,
  },
  'High-Tech & Gadgets': {
    titles: [
      'Écouteurs Sans Fil Pro Sound Isolation Active + Boîtier Powerbank',
      'Montre Connectée Sport & Santé Ultra HD avec Suivi Cardiaque',
      'Support Téléphone Voiture Chargeur Sans Fil à Induction 15W',
    ],
    hooksDarija: [
      '⚡ تقنية جديدة كتهنيك من الخيوط وصداع الراس! صوت نقي وبطارية شادة نهار كامل.',
      '🔥 آخر ما كاين فالتكنولوجيا بثمن هبال! جرب وقيس عاد تخلص الكورسير.',
    ],
    hooksFrench: [
      'La haute technologie à portée de main au meilleur prix du marché marocain.',
      'Son immersif, autonomie record et compatibilité universelle iPhone & Android.',
    ],
    sellingPoints: [
      'Connexion Bluetooth 5.3 instantanée et stable jusqu\'à 15 mètres',
      'Autonomie longue durée : jusqu\'à 36 heures d\'écoute avec le boîtier',
      'Résistant aux éclaboussures et à la transpiration (Norme IPX5)',
      'Commandes tactiles intuitives et microphone HD avec réduction de bruit',
    ],
    reassurancesDarija: [
      '🔌 جرب المنتوج وتأكد من الخدمة ديالو عاد خلص',
      '🛡️ ضمان 6 أشهر مع التبديل الفوري في حالة وجود عيب',
      '🚀 التوصيل في الدار البيضاء والرباط خلال 24 ساعة فقط',
    ],
    multiplier: 1.8,
    costRatio: 0.38,
  },
  'Maison & Cuisine': {
    titles: [
      'Hachoir Électrique Multifonction Inox 3L - Moteur Cuivre Puissant',
      'Set Ustensiles de Cuisine Anti-Adhésifs Granite 12 Pièces',
      'Organisateur d\'Épices Rotatif Moderne avec Bocaux Hermétiques',
    ],
    hooksDarija: [
      '🍲 رتاحي من التم Stick والتقطاع فالمطبخ! طحني اللحم والخضرة فـ 5 ثواني فقط.',
      '✨ همزة المطبخ للي ما كتفلتش: جودة الإينوكس الأصلي لي كيدوم سنين وسنين!',
    ],
    hooksFrench: [
      'Gagnez un temps précieux en cuisine avec des équipements performants et durables.',
      'Moteur robuste en cuivre pur, idéal pour toutes vos préparations traditionnelles marocaines.',
    ],
    sellingPoints: [
      'Lames en acier inoxydable 304 ultra tranchantes',
      'Capacité familiale généreuse avec double vitesse de rotation',
      'Nettoyage facile au lave-vaisselle ou à l\'eau tiède',
      'Sécurité anti-surchauffe avec arrêt automatique',
    ],
    reassurancesDarija: [
      '🥩 تأكد من الموطور والريوص عاد تخلص الليفرور',
      '🚚 التوصيل بالمجان لجميع أنحاء المملكة',
      '📦 تغليف محكم ضد الصدمات والكسر',
    ],
    multiplier: 1.7,
    costRatio: 0.35,
  },
  'Parfums & Senteurs': {
    titles: [
      'Extrait de Parfum Oriental Oud & Ambre - Sillage Puissant 48H',
      'Musk Tahara Blanc Pur de Médine - Douceur & Fraîcheur Absolue',
      'Coffret Duo Parfum Royal : Oud Noir + Vanille Gourmande',
    ],
    hooksDarija: [
      '🌸 ريحة تابتة ومميزة للي يشوفك يسولك عليها! كدوم أكتر من 48 ساعة فاللباس.',
      '✨ عطر الملوك والأمراء: عود نقي وزيوت مركزة بدون كحول مخفف.',
    ],
    hooksFrench: [
      'Laissez un sillage inoubliable avec nos extraits de parfum orientaux raffinés.',
      'Tenue exceptionnelle garantie, concentration maximale en huiles précieuses.',
    ],
    sellingPoints: [
      'Concentration Eau de Parfum / Extrait intense sans dilution',
      'Tenue testée supérieure à 48 heures sur les vêtements',
      'Flacon de luxe en verre lourd avec capuchon magnétique',
      'Unisexe : convient parfaitement pour hommes et femmes élégants',
    ],
    reassurancesDarija: [
      '👃 شم الريحة وجرب عاد تخلص',
      '🚚 التوصيل فابور حتى لباب الدار',
      '🎁 كادو صغير مرفق مع كل طلبية',
    ],
    multiplier: 2.0,
    costRatio: 0.28,
  },
};

export function generateMoroccanProductCopy(
  category: string,
  baseTitle?: string,
  targetPrice?: number
): MoroccanAICopy {
  const data = KNOWLEDGE_BASE[category] || KNOWLEDGE_BASE['Maroquinerie & Sacs'];
  
  const title = baseTitle && baseTitle.trim().length > 3 
    ? baseTitle 
    : data.titles[Math.floor(Math.random() * data.titles.length)];

  const price = targetPrice && targetPrice > 0 ? targetPrice : 299;
  const comparePrice = Math.round((price * 1.45) / 10) * 10 - 1; // e.g. 449 DH
  const costPrice = Math.round(price * data.costRatio);

  const bundles: BundleOffer[] = [
    {
      name: 'Offre Découverte (1 Pièce)',
      qty: 1,
      priceTotal: price,
      discountBadge: 'Prix Normal',
      isPopular: false,
    },
    {
      name: 'Pack Économique (2 Pièces)',
      qty: 2,
      priceTotal: Math.round((price * 1.7) / 10) * 10 - 1, // save ~30% on second item
      discountBadge: `Économisez ${price * 2 - (Math.round((price * 1.7) / 10) * 10 - 1)} DH`,
      isPopular: true,
    },
    {
      name: 'Pack Famille (3 Pièces - 2 + 1 Offert)',
      qty: 3,
      priceTotal: price * 2,
      discountBadge: '1 Gratuit + Livraison Offerte',
      isPopular: false,
    },
  ];

  return {
    title,
    hookDarija: data.hooksDarija[Math.floor(Math.random() * data.hooksDarija.length)],
    hookFrench: data.hooksFrench[Math.floor(Math.random() * data.hooksFrench.length)],
    sellingPoints: data.sellingPoints,
    reassurancesDarija: data.reassurancesDarija,
    suggestedPrice: price,
    suggestedComparePrice: comparePrice,
    suggestedCostPrice: costPrice,
    bundles,
  };
}
