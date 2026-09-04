export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
  dir: 'ltr' | 'rtl';
  nav: {
    overview: string;
    orders: string;
    products: string;
    builder: string;
    analytics: string;
    funnel: string;
    customers: string;
    payments: string;
    logistics: string;
    billing: string;
  };
  common: {
    activeStore: string;
    liveStorefront: string;
    trialRemaining: string;
    supportOnline: string;
    addProduct: string;
    coachIA: string;
    save: string;
    cancel: string;
    copy: string;
    copied: string;
    search: string;
    status: string;
    actions: string;
    loading: string;
    success: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    revenueDelivered: string;
    confirmationRate: string;
    deliveryRate: string;
    urgentCalls: string;
    recentOrders: string;
    viewAllOrders: string;
    customer: string;
    amount: string;
    city: string;
  };
  orders: {
    title: string;
    subtitle: string;
    tabs: {
      all: string;
      new: string;
      toConfirm: string;
      confirmed: string;
      shipping: string;
      delivered: string;
      returned: string;
    };
    table: {
      order: string;
      client: string;
      items: string;
      amount: string;
      status: string;
      actions: string;
    };
    whatsappConfirm: string;
    directCall: string;
    dispatchOzon: string;
    printLabel: string;
  };
  products: {
    title: string;
    subtitle: string;
    allProducts: string;
    categories: string;
    sellingPrice: string;
    costPrice: string;
    netMargin: string;
    stock: string;
    units: string;
    lowStock: string;
    active: string;
    addModalTitle: string;
  };
  aiCoach: {
    title: string;
    badge: string;
    subtitle: string;
    niche: string;
    productKeyword: string;
    targetPrice: string;
    regenerate: string;
    recommendedTitle: string;
    darijaHook: string;
    frenchHook: string;
    reassuranceTitle: string;
    bundlesTitle: string;
    applyToProduct: string;
    close: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    netProfit: string;
    deliverySuccess: string;
    confirmationRate: string;
    returnRate: string;
    topCities: string;
    deliveredRatio: string;
  };
  funnel: {
    title: string;
    subtitle: string;
    overallConversion: string;
    landingStep: string;
    formStep: string;
    contactStep: string;
    successStep: string;
    diagnostics: string;
  };
  customers: {
    title: string;
    subtitle: string;
    totalCount: string;
    allTab: string;
    returningTab: string;
    activeTab: string;
    newTab: string;
    ltv: string;
    aov: string;
    whatsappReactivate: string;
  };
  payments: {
    title: string;
    subtitle: string;
    moroccoAlert: string;
    active: string;
    inactive: string;
    configure: string;
  };
  logistics: {
    title: string;
    subtitle: string;
    ozonGateway: string;
    senditGateway: string;
    autoDispatch: string;
    ratesMatrix: string;
  };
  billing: {
    title: string;
    subtitle: string;
    trialBadge: string;
    starterPlan: string;
    proPlan: string;
    scalePlan: string;
    subscribe: string;
    includedFeatures: string;
  };
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    dir: 'ltr',
    nav: {
      overview: 'Overview',
      orders: 'COD Orders',
      products: 'Products & Stock',
      builder: 'Visual Page Builder',
      analytics: 'Analytics & KPIs',
      funnel: 'Sales Funnel',
      customers: 'CRM & Customers',
      payments: 'Payment Gateways',
      logistics: 'Couriers (Ozon)',
      billing: 'Subscription (14d)',
    },
    common: {
      activeStore: 'Active Store:',
      liveStorefront: 'View live',
      trialRemaining: 'Free trial: 14 days',
      supportOnline: 'WhatsApp Support: Online',
      addProduct: 'Add Product',
      coachIA: 'Moroccan AI Coach',
      save: 'Save Changes',
      cancel: 'Cancel',
      copy: 'Copy',
      copied: 'Copied!',
      search: 'Search...',
      status: 'Status',
      actions: 'Actions',
      loading: 'Loading...',
      success: 'Success',
    },
    dashboard: {
      title: 'Merchant Command Center',
      subtitle: 'Real-time performance metrics for your Moroccan Cash-On-Delivery store.',
      revenueDelivered: 'Delivered Revenue',
      confirmationRate: 'Confirmation Rate',
      deliveryRate: 'Delivery Success Rate',
      urgentCalls: 'Urgent Pending Calls',
      recentOrders: 'Recent Orders',
      viewAllOrders: 'View all orders',
      customer: 'Customer',
      amount: 'Amount',
      city: 'City',
    },
    orders: {
      title: 'Moroccan COD Orders Pipeline',
      subtitle: 'Confirm orders by WhatsApp/Phone, dispatch Ozon Express couriers, and print thermal A6 labels.',
      tabs: {
        all: 'All Orders',
        new: 'New',
        toConfirm: 'To Confirm',
        confirmed: 'Confirmed',
        shipping: 'In Transit',
        delivered: 'Delivered & Paid',
        returned: 'Returned',
      },
      table: {
        order: 'Order',
        client: 'Customer',
        items: 'Items',
        amount: 'Total',
        status: 'Status',
        actions: 'Quick Actions',
      },
      whatsappConfirm: 'WhatsApp Confirm',
      directCall: 'Call',
      dispatchOzon: 'Dispatch Ozon',
      printLabel: 'Print A6 Label',
    },
    products: {
      title: 'Product Catalog & Inventory',
      subtitle: 'Manage items, cost of goods (COGS), real net profit margins, and collections.',
      allProducts: 'All Products',
      categories: 'Categories & Collections',
      sellingPrice: 'Selling Price',
      costPrice: 'Cost Price (COGS)',
      netMargin: 'Net Margin',
      stock: 'Remaining Stock',
      units: 'units',
      lowStock: 'Low Stock Alert!',
      active: 'Active',
      addModalTitle: 'Add a New Product',
    },
    aiCoach: {
      title: 'Moroccan AI Coach (Darija / FR)',
      badge: 'Powered by Moroccan E-Commerce AI',
      subtitle: 'Instantly generate high-converting Darija headlines, French copy, and lucrative bundle packs.',
      niche: 'Industry / Niche:',
      productKeyword: 'Product Name or Keyword:',
      targetPrice: 'Target Selling Price (MAD):',
      regenerate: 'Regenerate New Variations',
      recommendedTitle: 'Recommended E-commerce Title',
      darijaHook: 'High-Converting Darija Hook (Moroccan Arabic)',
      frenchHook: 'Elegant French Hook',
      reassuranceTitle: 'Moroccan Cash-On-Delivery Trust Badges:',
      bundlesTitle: 'Recommended Bundle Pack Offers:',
      applyToProduct: 'Apply Directly to Product Form',
      close: 'Close',
    },
    analytics: {
      title: 'Moroccan COD Analytics & Profit Tracker',
      subtitle: 'Real delivered cash, true confirmation rates, and courier return analytics.',
      netProfit: 'Real Net Cash Profit',
      deliverySuccess: 'Delivery Success Rate',
      confirmationRate: 'Confirmation Rate',
      returnRate: 'Return Rate',
      topCities: 'Top Moroccan Cities by Delivery Rate',
      deliveredRatio: 'Delivered vs Total Orders',
    },
    funnel: {
      title: 'Sales Funnel Tracker (Store Journey)',
      subtitle: 'Real-time funnel diagnostics from visitor landing to confirmed cash-on-delivery order.',
      overallConversion: 'Overall Store Conversion Rate',
      landingStep: '1. Product Page Views',
      formStep: '2. Click COD Form',
      contactStep: '3. Phone & City Input',
      successStep: '4. Confirmed COD Orders',
      diagnostics: 'Automated Growth Diagnostics',
    },
    customers: {
      title: 'CRM & Customer Directory',
      subtitle: 'Track repeat buyers, calculate customer lifetime value, and reactivate via WhatsApp.',
      totalCount: 'Registered Customers',
      allTab: 'All Customers',
      returningTab: 'Loyal / Returning',
      activeTab: 'Active',
      newTab: 'New Buyers',
      ltv: 'Total Spend (LTV)',
      aov: 'Average Basket',
      whatsappReactivate: 'WhatsApp Reactivate',
    },
    payments: {
      title: 'Payment Methods & Gateways',
      subtitle: 'Configure Cash on Delivery (COD), Moroccan bank transfers (RIB), and CMI card payments.',
      moroccoAlert: 'Morocco Pro Tip: Over 95% of e-commerce transactions in Morocco are Cash on Delivery. Keep COD active to maximize advertising ROI.',
      active: 'Active',
      inactive: 'Disabled',
      configure: 'Configure',
    },
    logistics: {
      title: 'Couriers & Logistics Configuration',
      subtitle: 'Connect your Ozon Express and SendIt API credentials and set custom city delivery rates.',
      ozonGateway: 'Ozon Express Gateway',
      senditGateway: 'SendIt Courier Gateway',
      autoDispatch: 'Auto-Dispatch Confirmed Orders',
      ratesMatrix: 'Moroccan City Delivery Rates Matrix',
    },
    billing: {
      title: 'Billing & Store Subscription',
      subtitle: 'Manage your recurring subscription and free trial period.',
      trialBadge: '14-Day Free Trial Active',
      starterPlan: 'Starter Tier',
      proPlan: 'Pro Growth Tier',
      scalePlan: 'Scale Master Tier',
      subscribe: 'Select Plan',
      includedFeatures: 'What is included:',
    },
  },
  fr: {
    dir: 'ltr',
    nav: {
      overview: 'Vue d\'Ensemble',
      orders: 'Commandes COD',
      products: 'Produits & Stocks',
      builder: 'Page Builder Visuel',
      analytics: 'Analytiques & KPIs',
      funnel: 'Entonnoir (Funnel)',
      customers: 'CRM Clients',
      payments: 'Moyens de Paiement',
      logistics: 'Transporteurs (Ozon)',
      billing: 'Abonnement (14j)',
    },
    common: {
      activeStore: 'Boutique active :',
      liveStorefront: 'Voir en direct',
      trialRemaining: 'Essai gratuit : 14 jours',
      supportOnline: 'Support WhatsApp : En Ligne',
      addProduct: 'Ajouter un Produit',
      coachIA: 'Coach IA Marocain',
      save: 'Enregistrer',
      cancel: 'Annuler',
      copy: 'Copier',
      copied: 'Copié !',
      search: 'Rechercher...',
      status: 'Statut',
      actions: 'Actions',
      loading: 'Chargement...',
      success: 'Succès',
    },
    dashboard: {
      title: 'Centre de Commandement Vendeur',
      subtitle: 'Métriques de performance en temps réel pour votre boutique COD marocaine.',
      revenueDelivered: 'Chiffre d\'Affaires Livré',
      confirmationRate: 'Taux de Confirmation',
      deliveryRate: 'Taux de Livraison Réussi',
      urgentCalls: 'Commandes à Confirmer d\'Urgence',
      recentOrders: 'Commandes Récentes',
      viewAllOrders: 'Voir toutes les commandes',
      customer: 'Client',
      amount: 'Montant',
      city: 'Ville',
    },
    orders: {
      title: 'Pipeline Commandes COD Maroc',
      subtitle: 'Confirmez vos commandes par WhatsApp/Appel, expédiez avec Ozon Express et imprimez les étiquettes A6.',
      tabs: {
        all: 'Toutes les Commandes',
        new: 'Nouvelles',
        toConfirm: 'À Confirmer',
        confirmed: 'Confirmées',
        shipping: 'En Livraison',
        delivered: 'Livrées & Encaissées',
        returned: 'Retournées',
      },
      table: {
        order: 'Commande',
        client: 'Client',
        items: 'Articles',
        amount: 'Total',
        status: 'Statut',
        actions: 'Actions Rapides',
      },
      whatsappConfirm: 'Confirmer WhatsApp',
      directCall: 'Appeler',
      dispatchOzon: 'Expédier Ozon',
      printLabel: 'Étiquette A6',
    },
    products: {
      title: 'Catalogue Produits & Stocks',
      subtitle: 'Gérez vos articles, prix de revient, marges bénéficiaires et catégories.',
      allProducts: 'Tous les Produits',
      categories: 'Catégories & Collections',
      sellingPrice: 'Prix de Vente',
      costPrice: 'Prix de Revient',
      netMargin: 'Marge Nette',
      stock: 'Stock Restant',
      units: 'unités',
      lowStock: 'Stock faible !',
      active: 'Actif',
      addModalTitle: 'Ajouter un Nouveau Produit',
    },
    aiCoach: {
      title: 'Coach IA Marocain (Darija / FR)',
      badge: 'Propulsé par IA E-commerce Maroc',
      subtitle: 'Générez instantanément des titres vendeurs, des accroches en Darija et des packs irrésistibles.',
      niche: 'Secteur / Niche :',
      productKeyword: 'Nom ou mot-clé :',
      targetPrice: 'Prix de Vente Ciblé (DH) :',
      regenerate: 'Régénérer de Nouvelles Variantes',
      recommendedTitle: 'Titre E-commerce Recommandé',
      darijaHook: 'Accroche Vendeuse en Darija (Haute Conversion)',
      frenchHook: 'Accroche en Français (Élégante & Professionnelle)',
      reassuranceTitle: 'Arguments de Réassurance Spécifiques au Maroc :',
      bundlesTitle: 'Packs & Offres Dégressives Suggérés :',
      applyToProduct: 'Appliquer Directement au Produit',
      close: 'Fermer',
    },
    analytics: {
      title: 'Analytiques COD & Bénéfice Réel',
      subtitle: 'Chiffre d\'affaires encaissé, taux de confirmation réel et retours transporteur.',
      netProfit: 'Bénéfice Net Réel',
      deliverySuccess: 'Taux de Livraison',
      confirmationRate: 'Taux de Confirmation',
      returnRate: 'Taux de Retour',
      topCities: 'Classement des Villes par Taux de Livraison',
      deliveredRatio: 'Livrées vs Total Commandes',
    },
    funnel: {
      title: 'Entonnoir de Vente (Store Journey)',
      subtitle: 'Suivi du parcours visiteur de la vue produit jusqu\'à la commande validée.',
      overallConversion: 'Taux de Conversion Global',
      landingStep: '1. Vues Produits (Landing)',
      formStep: '2. Clic Formulaire COD',
      contactStep: '3. Saisie Téléphone & Ville',
      successStep: '4. Commandes Confirmées',
      diagnostics: 'Diagnostics d\'Optimisation Automatiques',
    },
    customers: {
      title: 'CRM & Base de Données Clients',
      subtitle: 'Visualisez vos acheteurs, suivez la valeur vie client et relancez par WhatsApp.',
      totalCount: 'Clients Enregistrés',
      allTab: 'Tous les Clients',
      returningTab: 'Clients Fidèles',
      activeTab: 'Clients Actifs',
      newTab: 'Nouveaux Acheteurs',
      ltv: 'Total Dépensé (LTV)',
      aov: 'Panier Moyen',
      whatsappReactivate: 'Relancer WhatsApp',
    },
    payments: {
      title: 'Passerelles & Méthodes de Paiement',
      subtitle: 'Configurez le Cash on Delivery (COD), virements bancaires marocains et cartes CMI.',
      moroccoAlert: 'Conseil Maroc : Plus de 95% des achats en ligne au Maroc se font en Paiement à la Livraison. Laissez le COD activé pour maximiser vos ventes.',
      active: 'Actif',
      inactive: 'Désactivé',
      configure: 'Configurer',
    },
    logistics: {
      title: 'Transporteurs & Logistique Maroc',
      subtitle: 'Connectez vos clés API Ozon Express et SendIt et personnalisez les tarifs par ville.',
      ozonGateway: 'Passerelle Ozon Express',
      senditGateway: 'Passerelle SendIt Express',
      autoDispatch: 'Expédition Automatique des Confirmées',
      ratesMatrix: 'Grille Tarifaire par Ville Marocaine',
    },
    billing: {
      title: 'Facturation & Abonnement Boutique',
      subtitle: 'Gérez votre abonnement mensuel et votre période d\'essai gratuit.',
      trialBadge: 'Période d\'Essai 14 Jours Active',
      starterPlan: 'Formule Starter',
      proPlan: 'Formule Pro',
      scalePlan: 'Formule Scale',
      subscribe: 'Choisir ce Forfait',
      includedFeatures: 'Fonctionnalités incluses :',
    },
  },
  ar: {
    dir: 'rtl',
    nav: {
      overview: 'نظرة عامة',
      orders: 'طلبيات الدفع عند الاستلام',
      products: 'المنتجات والمخزون',
      builder: 'مُصمم الصفحات المرئي',
      analytics: 'الإحصائيات والأرباح',
      funnel: 'مسار التحويل والمبيعات',
      customers: 'إدارة العملاء (CRM)',
      payments: 'بوابات الدفع',
      logistics: 'شركات الشحن والتوصيل',
      billing: 'الاشتراك والفوترة',
    },
    common: {
      activeStore: 'المتجر النشط :',
      liveStorefront: 'معاينة مباشرة',
      trialRemaining: 'فترة تجريبية : 14 يوماً',
      supportOnline: 'الدعم الفني عبر واتساب : متصل',
      addProduct: 'إضافة منتج جديد',
      coachIA: 'المساعد الذكي المغربي',
      save: 'حفظ التغييرات',
      cancel: 'إلغاء',
      copy: 'نسخ',
      copied: 'تم النسخ!',
      search: 'بحث...',
      status: 'الحالة',
      actions: 'إجراءات',
      loading: 'جاري التحميل...',
      success: 'تم بنجاح',
    },
    dashboard: {
      title: 'لوحة التحكم والقيادة للتجارة الإلكترونية',
      subtitle: 'مؤشرات الأداء المباشرة لمتجرك بنظام الدفع عند الاستلام في المغرب.',
      revenueDelivered: 'المبيعات المسلّمة والمحصلة',
      confirmationRate: 'نسبة تأكيد الطلبات',
      deliveryRate: 'نسبة نجاح التوصيل',
      urgentCalls: 'طلبات عاجلة للتأكيد الهاتفي',
      recentOrders: 'أحدث الطلبيات',
      viewAllOrders: 'عرض جميع الطلبيات',
      customer: 'الزبون',
      amount: 'المبلغ',
      city: 'المدينة',
    },
    orders: {
      title: 'إدارة طلبيات الدفع عند الاستلام بالمغرب',
      subtitle: 'أكّد الطلبيات عبر واتساب والمكالمات، اشحن مع أوزون إكسبريس واطبع بوالص الشحن A6.',
      tabs: {
        all: 'جميع الطلبات',
        new: 'جديدة',
        toConfirm: 'في انتظار التأكيد',
        confirmed: 'مؤكدة',
        shipping: 'قيد التوصيل',
        delivered: 'تم التوصيل والتحصيل',
        returned: 'مرتجعة',
      },
      table: {
        order: 'الطلبية',
        client: 'الزبون',
        items: 'المنتجات',
        amount: 'المجموع',
        status: 'الحالة',
        actions: 'إجراءات سريعة',
      },
      whatsappConfirm: 'تأكيد عبر واتساب',
      directCall: 'اتصال هاتفي',
      dispatchOzon: 'إرسال لـ Ozon Express',
      printLabel: 'طباعة البوليصة A6',
    },
    products: {
      title: 'كتالوج المنتجات والمخزون',
      subtitle: 'إدارة المنتجات، تكلفة السلعة، هوامش الربح الصافي وتصنيفات المتجر.',
      allProducts: 'جميع المنتجات',
      categories: 'التصنيفات والمجموعات',
      sellingPrice: 'سعر البيع',
      costPrice: 'تكلفة السلعة (سعر الجملة)',
      netMargin: 'الربح الصافي',
      stock: 'المخزون المتوفر',
      units: 'قطعة',
      lowStock: 'تنبيه: مخزون قارب على النفاد!',
      active: 'نشط',
      addModalTitle: 'إضافة منتج جديد للمتجر',
    },
    aiCoach: {
      title: 'المساعد الذكي لكتابة الإعلانات (بالدارجة والفرنسية)',
      badge: 'مدعوم بالذكاء الاصطناعي للتجارة المغربية',
      subtitle: 'توليد فوري لعناوين جذابة بالدارجة، نصوص إقناعية وعروض مجمعة مربحة.',
      niche: 'المجال / التخصص :',
      productKeyword: 'اسم المنتج أو الكلمة الدلالية :',
      targetPrice: 'سعر البيع المقترح (درهم) :',
      regenerate: 'توليد نصوص جديدة',
      recommendedTitle: 'عنوان تسويقي جذاب للمنتج',
      darijaHook: 'جملة افتتاحية قوية بالدارجة المغربية',
      frenchHook: 'وصف إعلاني راقي بالفرنسية',
      reassuranceTitle: 'ضمانات وتطمينات خاصة بالزبون المغربي :',
      bundlesTitle: 'باقات وعروض تخفيض مقترحة (Bundles) :',
      applyToProduct: 'تطبيق مباشر على بطاقة المنتج',
      close: 'إغلاق',
    },
    analytics: {
      title: 'تحليلات المبيعات والأرباح الصافية',
      subtitle: 'المداخيل المحصلة نقدياً، نسب التأكيد الفعلية ونسب استرجاع الطرود.',
      netProfit: 'صافي الأرباح النقدية',
      deliverySuccess: 'نسبة نجاح التوصيل',
      confirmationRate: 'نسبة تأكيد الطلبيات',
      returnRate: 'نسبة الطرود المرتجعة',
      topCities: 'ترتيب المدن المغربية حسب نسبة التوصيل',
      deliveredRatio: 'المسلّم مقارنة بإجمالي الطلبات',
    },
    funnel: {
      title: 'مسار المبيعات والتحويل (Store Journey)',
      subtitle: 'متابعة مسار الزائر خطوة بخطوة من زيارة المنتج حتى تأكيد طلبية الدفع عند الاستلام.',
      overallConversion: 'معدل التحويل الإجمالي للمتجر',
      landingStep: '1. معاينة صفحة المنتج',
      formStep: '2. النقر على استمارة الطلب',
      contactStep: '3. إدخال الهاتف والمدينة',
      successStep: '4. طلبيات مؤكدة وناجحة',
      diagnostics: 'تشخيص وتوصيات تحسين المبيعات',
    },
    customers: {
      title: 'إدارة قاعدة بيانات الزبائن (CRM)',
      subtitle: 'تصنيف المشترين، تتبع القيمة الإجمالية للزبون وإعادة الاستهداف عبر واتساب.',
      totalCount: 'إجمالي الزبائن المسجلين',
      allTab: 'جميع الزبائن',
      returningTab: 'زبائن أوفياء (معاودين الشراء)',
      activeTab: 'زبائن نشطون',
      newTab: 'مشترون جدد',
      ltv: 'إجمالي المشتريات (LTV)',
      aov: 'متوسط قيمة الطلب',
      whatsappReactivate: 'إعادة تفعيل عبر واتساب',
    },
    payments: {
      title: 'طرق وبوابات الدفع',
      subtitle: 'تفعيل الدفع عند الاستلام، التحويلات البنكية المحلية (RIB)، وبطاقات CMI.',
      moroccoAlert: 'نصيحة للمغرب : أكثر من 95% من المعاملات تتم عبر الدفع عند الاستلام (COD). ينصح بإبقائه مفعلاً لرفع نسبة المبيعات.',
      active: 'مفعل',
      inactive: 'معطل',
      configure: 'إعداد',
    },
    logistics: {
      title: 'شركات الشحن والخدمات اللوجستية',
      subtitle: 'ربط حسابات Ozon Express و SendIt وتحديد أسعار التوصيل لكل مدينة.',
      ozonGateway: 'بوابة أوزون إكسبريس (Ozon)',
      senditGateway: 'بوابة سند إت (SendIt)',
      autoDispatch: 'إرسال آلي للطلبيات المؤكدة',
      ratesMatrix: 'جدول تسعيرة الشحن حسب المدن',
    },
    billing: {
      title: 'الفوترة وخطة الاشتراك',
      subtitle: 'إدارة خطتك الشهرية وفترة التجربة المجانية.',
      trialBadge: 'فترة تجريبية مجانية لمدة 14 يوماً نشطة',
      starterPlan: 'باقة المبتدئين (Starter)',
      proPlan: 'باقة المحترفين (Pro)',
      scalePlan: 'باقة التوسع (Scale)',
      subscribe: 'اختيار هذه الباقة',
      includedFeatures: 'الميزات المضمنة في الباقة :',
    },
  },
};

export function getTranslation(lang: Language = 'en'): Translations {
  return DICTIONARY[lang] || DICTIONARY.en;
}
