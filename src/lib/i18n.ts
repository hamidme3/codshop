export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
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
  };
  kpis: {
    deliveredRevenue: string;
    confirmationRate: string;
    deliveryRate: string;
    urgentCalls: string;
    netProfit: string;
  };
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
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
    },
    kpis: {
      deliveredRevenue: 'Delivered Revenue (MAD)',
      confirmationRate: 'Confirmation Rate',
      deliveryRate: 'Delivery Success Rate',
      urgentCalls: 'Urgent Pending Confirmations',
      netProfit: 'Estimated Net Cash Profit',
    },
  },
  fr: {
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
    },
    kpis: {
      deliveredRevenue: 'Chiffre d\'Affaires Livré (MAD)',
      confirmationRate: 'Taux de Confirmation',
      deliveryRate: 'Taux de Livraison Réussi',
      urgentCalls: 'Commandes à Confirmer',
      netProfit: 'Bénéfice Net Réel',
    },
  },
  ar: {
    nav: {
      overview: 'نظرة عامة',
      orders: 'طلبيات الدفع عند الاستلام',
      products: 'المنتجات والمخزون',
      builder: 'مُصمم الصفحات المرئي',
      analytics: 'الإحصائيات والأرباح',
      funnel: 'مسار التحويل والمبيعات',
      customers: 'إدارة العملاء',
      payments: 'بوابات الدفع',
      logistics: 'شركات الشحن والتوصيل',
      billing: 'الاشتراك التجريبي (14 يوم)',
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
    },
    kpis: {
      deliveredRevenue: 'المبيعات المسلّمة (درهم)',
      confirmationRate: 'نسبة تأكيد الطلبات',
      deliveryRate: 'نسبة نجاح التوصيل',
      urgentCalls: 'طلبات في انتظار التأكيد',
      netProfit: 'صافي الأرباح النقدية',
    },
  },
};

export function getTranslation(lang: Language = 'en'): Translations {
  return DICTIONARY[lang] || DICTIONARY.en;
}
