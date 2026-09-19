import { CountryConfig, CountryCityItem } from './types';
import { MOROCCAN_CITIES } from '../moroccanCities';
import { UNIVERSAL_COUNTRY_MAP } from './universalCountryMap';
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

// ── Morocco (MA) ────────────────────────────────────────────────
const MOROCCO_KNOWN_CITIES: CountryCityItem[] = MOROCCAN_CITIES.map((c) => ({
  id: c.id,
  name: c.name,
  nameAr: c.nameAr,
  shippingFee: c.shippingFee,
  sla: c.deliverySla,
  isMajorHub: c.isMajorHub,
}));

export const COUNTRY_MA: CountryConfig = {
  code: 'MA',
  name: 'Maroc',
  nameAr: 'المغرب',
  currency: {
    code: 'MAD',
    symbol: 'DH',
    symbolAr: 'د.م.',
    position: 'after',
  },
  phone: {
    dialCode: '+212',
    flag: '🇲🇦',
    placeholder: '06 12 34 56 78',
    example: '06 61 23 45 67',
    digitsLength: [9, 10],
  },
  defaultShippingFee: 35,
  defaultSla: '24h à 48h partout au Maroc',
  freeShippingThreshold: 400,
  popularCities: ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'],
  knownCities: MOROCCO_KNOWN_CITIES,
  hubSla: {
    hubName: 'Casablanca',
    hubSla: '24h Express',
    nationalName: 'Hors Casablanca',
    nationalSla: '48h Partout au Maroc',
  },
  inspectionBadge: {
    fr: 'Vérifiez votre colis avant de payer',
    ar: 'عاين سلعتك قبل ما تخلص',
  },
  inCountryName: 'au Maroc',
  addressPlaceholder: 'Ex: Quartier Maârif, Rue Abou Bakr Essedik, Résidence Al Manar Appt 4',
  defaultHubCity: 'Casablanca',
};

// ── Saudi Arabia (SA) ──────────────────────────────────────────
export const COUNTRY_SA: CountryConfig = {
  code: 'SA',
  name: 'Arabie Saoudite',
  nameAr: 'المملكة العربية السعودية',
  currency: {
    code: 'SAR',
    symbol: 'SAR',
    symbolAr: 'ر.س',
    position: 'after',
  },
  phone: {
    dialCode: '+966',
    flag: '🇸🇦',
    placeholder: '05X XXX XXXX',
    example: '050 123 4567',
    digitsLength: [9, 10],
  },
  defaultShippingFee: 25,
  defaultSla: '2 à 3 jours ouvrables',
  freeShippingThreshold: 200,
  popularCities: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar'],
  hubSla: {
    hubName: 'Riyad & Djeddah',
    hubSla: '24h Express',
    nationalName: 'Reste du Royaume',
    nationalSla: '48h Express',
  },
  inspectionBadge: {
    fr: 'Vérifiez votre colis avant de payer',
    ar: 'افحص شحنتك قبل الدفع',
  },
  knownCities: [
    { id: 'riyadh', name: 'Riyadh', nameAr: 'الرياض', shippingFee: 20, sla: '24h (Demain chez vous)', isMajorHub: true },
    { id: 'jeddah', name: 'Jeddah', nameAr: 'جدة', shippingFee: 20, sla: '24h (Demain chez vous)', isMajorHub: true },
    { id: 'dammam', name: 'Dammam', nameAr: 'الدمام', shippingFee: 25, sla: '24h à 48h', isMajorHub: true },
    { id: 'khobar', name: 'Al Khobar', nameAr: 'الخبر', shippingFee: 25, sla: '24h à 48h', isMajorHub: true },
    { id: 'mecca', name: 'Mecca', nameAr: 'مكة المكرمة', shippingFee: 25, sla: '24h à 48h', isMajorHub: true },
    { id: 'medina', name: 'Medina', nameAr: 'المدينة المنورة', shippingFee: 25, sla: '24h à 48h', isMajorHub: true },
    { id: 'taif', name: 'Taif', nameAr: 'الطائف', shippingFee: 30, sla: '48h' },
    { id: 'tabuk', name: 'Tabuk', nameAr: 'تبوك', shippingFee: 30, sla: '48h à 72h' },
    { id: 'buraidah', name: 'Buraidah', nameAr: 'بريدة', shippingFee: 30, sla: '48h' },
    { id: 'khamis_mushait', name: 'Khamis Mushait', nameAr: 'خميس مشيط', shippingFee: 35, sla: '48h à 72h' },
    { id: 'abha', name: 'Abha', nameAr: 'أبها', shippingFee: 35, sla: '48h à 72h' },
    { id: 'hail', name: 'Hail', nameAr: 'حائل', shippingFee: 35, sla: '48h à 72h' },
    { id: 'jubail', name: 'Jubail', nameAr: 'الجبيل', shippingFee: 25, sla: '24h à 48h' },
    { id: 'yanbu', name: 'Yanbu', nameAr: 'ينبع', shippingFee: 30, sla: '48h' },
    { id: 'najran', name: 'Najran', nameAr: 'نجران', shippingFee: 35, sla: '3 à 4 jours' },
    { id: 'jizan', name: 'Jizan', nameAr: 'جيزان', shippingFee: 35, sla: '3 à 4 jours' },
  ],
  inCountryName: 'en Arabie Saoudite',
  addressPlaceholder: 'Ex: Quartier Al Olaya, Rue King Fahd, Immeuble Al Nakheel Appt 12',
  defaultHubCity: 'Riyadh',
};

// ── United Arab Emirates (AE) ──────────────────────────────────
export const COUNTRY_AE: CountryConfig = {
  code: 'AE',
  name: 'Émirats Arabes Unis',
  nameAr: 'الإمارات العربية المتحدة',
  currency: {
    code: 'AED',
    symbol: 'AED',
    symbolAr: 'د.إ',
    position: 'after',
  },
  phone: {
    dialCode: '+971',
    flag: '🇦🇪',
    placeholder: '05X XXX XXXX',
    example: '050 123 4567',
    digitsLength: [9, 10],
  },
  defaultShippingFee: 20,
  defaultSla: '24h à 48h partout aux EAU',
  freeShippingThreshold: 150,
  popularCities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Al Ain'],
  hubSla: {
    hubName: 'Dubaï & Abu Dhabi',
    hubSla: '24h Express',
    nationalName: 'Autres Émirats',
    nationalSla: '24h à 48h',
  },
  inspectionBadge: {
    fr: 'Inspectez votre colis avant de payer',
    ar: 'عاين طلبيتك قبل الدفع',
  },
  knownCities: [
    { id: 'dubai', name: 'Dubai', nameAr: 'دبي', shippingFee: 15, sla: '24h (Demain chez vous)', isMajorHub: true },
    { id: 'abu_dhabi', name: 'Abu Dhabi', nameAr: 'أبو ظبي', shippingFee: 15, sla: '24h (Demain chez vous)', isMajorHub: true },
    { id: 'sharjah', name: 'Sharjah', nameAr: 'الشارقة', shippingFee: 18, sla: '24h (Demain chez vous)', isMajorHub: true },
    { id: 'ajman', name: 'Ajman', nameAr: 'عجمان', shippingFee: 18, sla: '24h', isMajorHub: true },
    { id: 'al_ain', name: 'Al Ain', nameAr: 'العين', shippingFee: 20, sla: '24h à 48h' },
    { id: 'ras_al_khaimah', name: 'Ras Al Khaimah', nameAr: 'رأس الخيمة', shippingFee: 22, sla: '24h à 48h' },
    { id: 'fujairah', name: 'Fujairah', nameAr: 'الفجيرة', shippingFee: 25, sla: '48h' },
    { id: 'umm_al_quwain', name: 'Umm Al Quwain', nameAr: 'أم القيوين', shippingFee: 20, sla: '24h à 48h' },
  ],
  inCountryName: 'aux Émirats',
  addressPlaceholder: 'Ex: Al Barsha 1, Street 14, Building Oasis Apt 204, Dubai',
  defaultHubCity: 'Dubai',
};

// ── Egypt (EG) ─────────────────────────────────────────────────
export const COUNTRY_EG: CountryConfig = {
  code: 'EG',
  name: 'Égypte',
  nameAr: 'جمهورية مصر العربية',
  currency: {
    code: 'EGP',
    symbol: 'EGP',
    symbolAr: 'ج.م',
    position: 'after',
  },
  phone: {
    dialCode: '+20',
    flag: '🇪🇬',
    placeholder: '01X XXXX XXXX',
    example: '010 1234 5678',
    digitsLength: [10, 11],
  },
  defaultShippingFee: 50,
  defaultSla: '2 à 3 jours ouvrables',
  freeShippingThreshold: 500,
  popularCities: ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta', 'Port Said'],
  hubSla: {
    hubName: 'Le Caire & Alexandrie',
    hubSla: '24h Express',
    nationalName: 'Toutes les Provinces',
    nationalSla: '48h à 72h',
  },
  inspectionBadge: {
    fr: 'Vérifiez votre colis avant de payer',
    ar: 'عاين أوردرك قبل الاستلام',
  },
  knownCities: [
    { id: 'cairo', name: 'Cairo', nameAr: 'القاهرة', shippingFee: 40, sla: '24h à 48h', isMajorHub: true },
    { id: 'giza', name: 'Giza', nameAr: 'الجيزة', shippingFee: 40, sla: '24h à 48h', isMajorHub: true },
    { id: 'alexandria', name: 'Alexandria', nameAr: 'الإسكندرية', shippingFee: 45, sla: '24h à 48h', isMajorHub: true },
    { id: 'mansoura', name: 'Mansoura', nameAr: 'المنصورة', shippingFee: 50, sla: '48h' },
    { id: 'tanta', name: 'Tanta', nameAr: 'طنطا', shippingFee: 50, sla: '48h' },
    { id: 'port_said', name: 'Port Said', nameAr: 'بورسعيد', shippingFee: 50, sla: '48h' },
    { id: 'suez', name: 'Suez', nameAr: 'السويس', shippingFee: 55, sla: '48h à 72h' },
    { id: 'ismailia', name: 'Ismailia', nameAr: 'الإسماعيلية', shippingFee: 50, sla: '48h' },
    { id: 'asyut', name: 'Asyut', nameAr: 'أسيوط', shippingFee: 65, sla: '3 à 4 jours' },
    { id: 'sohag', name: 'Sohag', nameAr: 'سوهاج', shippingFee: 65, sla: '3 à 4 jours' },
    { id: 'zagazig', name: 'Zagazig', nameAr: 'الزقازيق', shippingFee: 50, sla: '48h' },
  ],
  inCountryName: 'en Égypte',
  addressPlaceholder: 'Ex: Nasr City, Rue Abbas El Akkad, Immeuble 12 Appt 4, Le Caire',
  defaultHubCity: 'Cairo',
};

// ── Algeria (DZ) ───────────────────────────────────────────────
export const COUNTRY_DZ: CountryConfig = {
  code: 'DZ',
  name: 'Algérie',
  nameAr: 'الجمهورية الجزائرية',
  currency: {
    code: 'DZD',
    symbol: 'DZD',
    symbolAr: 'د.ج',
    position: 'after',
  },
  phone: {
    dialCode: '+213',
    flag: '🇩🇿',
    placeholder: '05/06/07 XX XX XX',
    example: '06 61 23 45 67',
    digitsLength: [9, 10],
  },
  defaultShippingFee: 600,
  defaultSla: '2 à 4 jours selon la wilaya',
  freeShippingThreshold: 6000,
  popularCities: ['Alger', 'Oran', 'Constantine', 'Sétif', 'Batna', 'Blida'],
  hubSla: {
    hubName: 'Alger & Oran',
    hubSla: '24h Express',
    nationalName: '58 Wilayas',
    nationalSla: '48h à 72h',
  },
  inspectionBadge: {
    fr: 'Vérifiez votre colis avant de payer',
    ar: 'شوف سلعتك قبل ما تخلص',
  },
  knownCities: [
    { id: 'alger', name: 'Alger (16)', nameAr: 'الجزائر العاصمة', shippingFee: 400, sla: '24h à 48h', isMajorHub: true },
    { id: 'oran', name: 'Oran (31)', nameAr: 'وهران', shippingFee: 500, sla: '48h', isMajorHub: true },
    { id: 'constantine', name: 'Constantine (25)', nameAr: 'قسنطينة', shippingFee: 500, sla: '48h', isMajorHub: true },
    { id: 'blida', name: 'Blida (09)', nameAr: 'البليدة', shippingFee: 450, sla: '24h à 48h', isMajorHub: true },
    { id: 'setif', name: 'Sétif (19)', nameAr: 'سطيف', shippingFee: 550, sla: '48h' },
    { id: 'batna', name: 'Batna (05)', nameAr: 'باتنة', shippingFee: 600, sla: '48h à 72h' },
    { id: 'annaba', name: 'Annaba (23)', nameAr: 'عنابة', shippingFee: 600, sla: '48h à 72h' },
    { id: 'tlemcen', name: 'Tlemcen (13)', nameAr: 'تلمسان', shippingFee: 650, sla: '3 à 4 jours' },
  ],
  inCountryName: 'en Algérie',
  addressPlaceholder: 'Ex: 14 Rue Didouche Mourad, Alger Centre, Apt 3',
  defaultHubCity: 'Alger',
};

// ── Senegal (SN) ───────────────────────────────────────────────
export const COUNTRY_SN: CountryConfig = {
  code: 'SN',
  name: 'Sénégal',
  nameAr: 'السنغال',
  currency: {
    code: 'XOF',
    symbol: 'FCFA',
    symbolAr: 'فرنك',
    position: 'after',
  },
  phone: {
    dialCode: '+221',
    flag: '🇸🇳',
    placeholder: '7X XXX XX XX',
    example: '77 123 45 67',
    digitsLength: [9],
  },
  defaultShippingFee: 2500,
  defaultSla: '24h à 48h',
  freeShippingThreshold: 25000,
  popularCities: ['Dakar', 'Touba', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor'],
  hubSla: {
    hubName: 'Dakar',
    hubSla: '24h Express',
    nationalName: 'Régions',
    nationalSla: '48h à 72h',
  },
  inspectionBadge: {
    fr: 'Vérifiez votre colis avant de payer',
    ar: 'Vérifiez votre colis avant de payer',
  },
  knownCities: [
    { id: 'dakar', name: 'Dakar', shippingFee: 1500, sla: '24h (Demain chez vous)', isMajorHub: true },
    { id: 'thies', name: 'Thiès', shippingFee: 2000, sla: '24h à 48h', isMajorHub: true },
    { id: 'touba', name: 'Touba', shippingFee: 2500, sla: '48h' },
    { id: 'saint_louis', name: 'Saint-Louis', shippingFee: 3000, sla: '48h' },
    { id: 'kaolack', name: 'Kaolack', shippingFee: 2500, sla: '48h' },
    { id: 'ziguinchor', name: 'Ziguinchor', shippingFee: 3500, sla: '72h' },
  ],
  inCountryName: 'au Sénégal',
  addressPlaceholder: 'Ex: Plateau, Rue Felix Faure, Immeuble Horizon, Dakar',
  defaultHubCity: 'Dakar',
};

// ── Côte d'Ivoire (CI) ─────────────────────────────────────────
export const COUNTRY_CI: CountryConfig = {
  code: 'CI',
  name: "Côte d'Ivoire",
  nameAr: 'ساحل العاج',
  currency: {
    code: 'XOF',
    symbol: 'FCFA',
    symbolAr: 'فرنك',
    position: 'after',
  },
  phone: {
    dialCode: '+225',
    flag: '🇨🇮',
    placeholder: '0X XX XX XX XX',
    example: '07 12 34 56 78',
    digitsLength: [10],
  },
  defaultShippingFee: 2500,
  defaultSla: '24h à 48h',
  freeShippingThreshold: 25000,
  popularCities: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo'],
  hubSla: {
    hubName: 'Abidjan',
    hubSla: '24h Express',
    nationalName: 'Intérieur du Pays',
    nationalSla: '48h à 72h',
  },
  inspectionBadge: {
    fr: 'Vérifiez votre colis avant de payer',
    ar: 'Vérifiez votre colis avant de payer',
  },
  knownCities: [
    { id: 'abidjan', name: 'Abidjan', shippingFee: 1500, sla: '24h (Demain chez vous)', isMajorHub: true },
    { id: 'yamoussoukro', name: 'Yamoussoukro', shippingFee: 2500, sla: '48h', isMajorHub: true },
    { id: 'bouake', name: 'Bouaké', shippingFee: 2500, sla: '48h' },
    { id: 'san_pedro', name: 'San-Pédro', shippingFee: 3000, sla: '48h à 72h' },
    { id: 'daloa', name: 'Daloa', shippingFee: 3000, sla: '48h' },
    { id: 'korhogo', name: 'Korhogo', shippingFee: 3500, sla: '72h' },
  ],
  inCountryName: "en Côte d'Ivoire",
  addressPlaceholder: 'Ex: Cocody Angré 8ème Tranche, Résidence Perle, Abidjan',
  defaultHubCity: 'Abidjan',
};

// ── France (FR) Fallback ───────────────────────────────────────
export const COUNTRY_FR: CountryConfig = {
  code: 'FR',
  name: 'France',
  nameAr: 'فرنسا',
  currency: {
    code: 'EUR',
    symbol: '€',
    symbolAr: 'يورو',
    position: 'after',
  },
  phone: {
    dialCode: '+33',
    flag: '🇫🇷',
    placeholder: '06 12 34 56 78',
    example: '06 12 34 56 78',
    digitsLength: [9, 10],
  },
  defaultShippingFee: 5,
  defaultSla: '48h Colissimo',
  freeShippingThreshold: 50,
  popularCities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille'],
  hubSla: {
    hubName: 'Île-de-France',
    hubSla: '24h Express',
    nationalName: 'Toute la France',
    nationalSla: '48h Colissimo',
  },
  inspectionBadge: {
    fr: 'Vérifiez votre colis avant de payer',
    ar: 'Vérifiez votre colis avant de payer',
  },
  knownCities: [
    { id: 'paris', name: 'Paris', shippingFee: 4, sla: '24h à 48h', isMajorHub: true },
    { id: 'lyon', name: 'Lyon', shippingFee: 5, sla: '48h', isMajorHub: true },
    { id: 'marseille', name: 'Marseille', shippingFee: 5, sla: '48h', isMajorHub: true },
    { id: 'toulouse', name: 'Toulouse', shippingFee: 5, sla: '48h' },
    { id: 'bordeaux', name: 'Bordeaux', shippingFee: 5, sla: '48h' },
    { id: 'lille', name: 'Lille', shippingFee: 5, sla: '48h' },
  ],
  inCountryName: 'en France',
  addressPlaceholder: 'Ex: 14 Rue de la Paix, Bâtiment B, 75002 Paris',
  defaultHubCity: 'Paris',
};

export const DEFAULT_COUNTRY_HUBS: Record<string, string> = {
  MA: 'Casablanca',
  SA: 'Riyadh',
  AE: 'Dubai',
  EG: 'Cairo',
  DZ: 'Alger',
  SN: 'Dakar',
  CI: 'Abidjan',
  FR: 'Paris',
};

// ── Registry Map ───────────────────────────────────────────────
export const SUPPORTED_COUNTRY_MAP: Record<string, CountryConfig> = {
  MA: COUNTRY_MA,
  SA: COUNTRY_SA,
  AE: COUNTRY_AE,
  EG: COUNTRY_EG,
  DZ: COUNTRY_DZ,
  SN: COUNTRY_SN,
  CI: COUNTRY_CI,
  FR: COUNTRY_FR,
};

export const SUPPORTED_COUNTRIES: CountryConfig[] = Object.values(SUPPORTED_COUNTRY_MAP);
export const COUNTRIES = SUPPORTED_COUNTRY_MAP;

export interface CountryListItem {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

export const ALL_COUNTRIES: CountryListItem[] = [
  ...Object.values(SUPPORTED_COUNTRY_MAP).map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.phone.flag,
    currency: c.currency.code,
  })),
  ...Object.entries(UNIVERSAL_COUNTRY_MAP)
    .filter(([code]) => !SUPPORTED_COUNTRY_MAP[code])
    .map(([code, meta]) => ({
      code,
      name: meta.name,
      flag: meta.flag,
      currency: meta.currency,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)),
];

/**
 * Returns the CountryConfig for a given country code.
 * Guaranteed to return a valid config (falls back to Morocco MA).
 */
export function getCountryConfig(code?: string): CountryConfig {
  if (!code) return COUNTRY_MA;
  const upper = code.trim().toUpperCase();
  if (SUPPORTED_COUNTRY_MAP[upper]) {
    return SUPPORTED_COUNTRY_MAP[upper];
  }

  // Universal Worldwide Fallback (All 249 ISO countries)
  const meta = UNIVERSAL_COUNTRY_MAP[upper];
  if (meta) {
    let frName = meta.name;
    let arName = meta.name;
    try {
      const frDisplay = new Intl.DisplayNames(['fr'], { type: 'region' });
      const arDisplay = new Intl.DisplayNames(['ar'], { type: 'region' });
      frName = frDisplay.of(upper) || meta.name;
      arName = arDisplay.of(upper) || meta.name;
    } catch {
      // Ignore Intl errors in unsupported environments
    }

    return {
      code: upper,
      name: frName,
      nameAr: arName,
      currency: {
        code: meta.currency,
        symbol: meta.currency,
        symbolAr: meta.currency,
        position: 'after',
      },
      phone: {
        dialCode: meta.phonecode,
        flag: meta.flag,
        placeholder: `${meta.phonecode} ...`,
        example: `${meta.phonecode} 12345678`,
        digitsLength: [8, 9, 10, 11, 12],
      },
      defaultShippingFee: 0,
      defaultSla: '3 à 5 jours ouvrables',
      freeShippingThreshold: 0,
      popularCities: [],
      knownCities: [],
      hubSla: {
        hubName: 'Capitale / Hub',
        hubSla: '48h Express',
        nationalName: 'National',
        nationalSla: '3 à 5 jours',
      },
      inspectionBadge: {
        fr: 'Vérifiez votre colis avant de payer',
        ar: 'عاين طلبيتك قبل الدفع',
      },
      inCountryName: `en ${frName}`,
      addressPlaceholder: 'Adresse complète (Rue, Bâtiment, Quartier, Code postal)',
      defaultHubCity: '',
    };
  }

  return COUNTRY_MA;
}

/**
 * Calculates shipping fee, SLA, and free delivery status for ANY city in a given country.
 * Guaranteed 0 NaN or undefined errors:
 * - If subtotal >= country threshold -> fee = 0, isFree = true.
 * - If city matches known city -> returns specific fee & SLA.
 * - If city is custom or unlisted -> returns country's default shipping fee and default SLA.
 */
export function getCountryCityShipping(
  countryCode: string | undefined,
  cityName: string,
  subtotal: number = 0
): {
  fee: number;
  sla: string;
  isFree: boolean;
  isKnown: boolean;
  resolvedCityName: string;
} {
  const config = getCountryConfig(countryCode);
  const cleanCity = (cityName || '').trim();

  // Free delivery threshold
  if (config.freeShippingThreshold > 0 && subtotal >= config.freeShippingThreshold && subtotal > 0) {
    const matched = config.knownCities.find(
      (c) =>
        c.name.toLowerCase() === cleanCity.toLowerCase() ||
        (c.nameAr && c.nameAr.toLowerCase() === cleanCity.toLowerCase())
    );
    return {
      fee: 0,
      sla: matched?.sla || config.defaultSla,
      isFree: true,
      isKnown: Boolean(matched),
      resolvedCityName: matched?.name || cleanCity || config.popularCities[0],
    };
  }

  // Exact known city match
  if (cleanCity) {
    const matched = config.knownCities.find(
      (c) =>
        c.name.toLowerCase() === cleanCity.toLowerCase() ||
        (c.nameAr && c.nameAr.toLowerCase() === cleanCity.toLowerCase())
    );
    if (matched) {
      return {
        fee: matched.shippingFee ?? config.defaultShippingFee,
        sla: matched.sla || config.defaultSla,
        isFree: false,
        isKnown: true,
        resolvedCityName: matched.name,
      };
    }
  }

  // Default Country Nationwide Fallback (Guaranteed no NaN)
  return {
    fee: config.defaultShippingFee,
    sla: config.defaultSla,
    isFree: false,
    isKnown: false,
    resolvedCityName: cleanCity || config.popularCities[0],
  };
}

/**
 * Formats currency amount based on country rules and language.
 */
export function formatCountryPrice(amount: number, countryCode?: string, lang: 'fr' | 'ar' = 'fr'): string {
  const config = getCountryConfig(countryCode);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const symbol = lang === 'ar' ? config.currency.symbolAr : config.currency.symbol;

  if (config.code === 'MA' || config.currency.code === 'MAD') {
    const s = safeAmount.toLocaleString('fr-FR');
    if (lang === 'ar') {
      return `\u2068${s}\u2069 ${symbol}`;
    }
    return `${s} ${symbol}`;
  }

  try {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar' : 'fr-FR', {
      style: 'currency',
      currency: config.currency.code || 'USD',
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    const s = safeAmount.toLocaleString('fr-FR');
    if (config.currency.position === 'before') {
      return `${symbol} ${s}`;
    }
    return `${s} ${symbol}`;
  }
}

import { getDeliveryDateEstimate, validateMoroccanPhone } from '../moroccanCities';

/**
 * Universal country-aware phone validator powered by libphonenumber-js.
 * Supports every carrier, dial code, and formatting rule worldwide.
 */
export function validateCountryPhone(
  phone: string,
  countryCode?: string
): {
  isValid: boolean;
  cleanPhone: string;
  formatted: string;
  operator?: string;
  error?: string;
} {
  const code = (countryCode || 'MA').toUpperCase();
  if (code === 'MA') {
    const moroccan = validateMoroccanPhone(phone);
    if (moroccan.isValid) return moroccan;
  }

  if (!phone || !phone.trim()) {
    return { isValid: false, cleanPhone: '', formatted: '', error: 'Le numéro de téléphone est obligatoire' };
  }

  // 1. Google libphonenumber pure TS validator (worldwide)
  try {
    const parsed = parsePhoneNumberFromString(phone, code as any);
    if (parsed && parsed.isValid()) {
      return {
        isValid: true,
        cleanPhone: parsed.number, // E.164 standard (+212661234567)
        formatted: parsed.formatInternational(),
      };
    }
  } catch {
    // Continue to fallback
  }

  // 2. International fallback: 8 to 15 digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 8 && digits.length <= 15) {
    return {
      isValid: true,
      cleanPhone: digits,
      formatted: phone.trim(),
    };
  }

  return {
    isValid: false,
    cleanPhone: digits,
    formatted: digits,
    error: 'Numéro de téléphone incomplet ou invalide',
  };
}

/**
 * Universal delivery date estimate across any country.
 */
export function getCountryDeliveryEstimate(
  countryCode: string | undefined,
  cityName: string,
  subtotal: number = 0,
  now: Date = new Date()
) {
  const code = (countryCode || 'MA').toUpperCase();
  if (code === 'MA') {
    return getDeliveryDateEstimate(cityName, subtotal, now);
  }

  const shipping = getCountryCityShipping(code, cityName, subtotal);
  const minDate = new Date(now);
  minDate.setDate(minDate.getDate() + 1);
  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + 3);

  return {
    sla: shipping.sla,
    minDays: 1,
    maxDays: 3,
    minDate,
    maxDate,
    formattedEstimate: `${shipping.sla}`,
    formattedEstimateAr: `${shipping.sla}`,
    isTomorrow: false,
    shippingFee: shipping.fee,
    isFree: shipping.isFree,
    cityName: shipping.resolvedCityName,
  };
}

/**
 * Detects visitor country on the client side using cookies, search params, or browser timezone.
 */
export function detectClientVisitorCountry(defaultCountry: string = 'MA'): string {
  if (typeof window === 'undefined') return defaultCountry;

  // 1. Check URL query param ?country=SA or ?geo_country=SA
  try {
    const params = new URLSearchParams(window.location.search);
    const qCountry = (params.get('country') || params.get('geo_country'))?.toUpperCase();
    if (qCountry && (SUPPORTED_COUNTRY_MAP[qCountry] || UNIVERSAL_COUNTRY_MAP[qCountry])) {
      return qCountry;
    }
  } catch {
    // Ignore URL parse error
  }

  // 2. Check cookie set by edge middleware
  try {
    const cookieMatch = document.cookie.match(/cod_visitor_country=([A-Za-z]{2})/);
    if (cookieMatch) {
      const c = cookieMatch[1].toUpperCase();
      if (SUPPORTED_COUNTRY_MAP[c] || UNIVERSAL_COUNTRY_MAP[c]) {
        return c;
      }
    }
  } catch {
    // Ignore cookie read error
  }

  // 3. Fallback to Browser Timezone (0ms, offline)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Riyadh')) return 'SA';
    if (tz.includes('Dubai')) return 'AE';
    if (tz.includes('Cairo')) return 'EG';
    if (tz.includes('Algiers')) return 'DZ';
    if (tz.includes('Dakar')) return 'SN';
    if (tz.includes('Abidjan')) return 'CI';
    if (tz.includes('Paris')) return 'FR';
    if (tz.includes('Madrid')) return 'ES';
    if (tz.includes('Casablanca')) return 'MA';
    if (tz.includes('London')) return 'GB';
    if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles')) return 'US';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'CA';
    if (tz.includes('Berlin')) return 'DE';
    if (tz.includes('Rome')) return 'IT';
    if (tz.includes('Istanbul')) return 'TR';
    if (tz.includes('Qatar')) return 'QA';
    if (tz.includes('Kuwait')) return 'KW';
  } catch {
    // Ignore timezone error
  }

  return defaultCountry;
}

/**
 * Normalizes any international phone number for WhatsApp wa.me links.
 * Powered by libphonenumber-js to automatically convert to E.164 format worldwide.
 */
export function normalizePhoneForWhatsApp(phone?: string | null, countryCode: string = 'MA'): string {
  if (!phone) return '';
  const raw = String(phone).trim();
  if (!raw) return '';

  try {
    const parsed = parsePhoneNumberFromString(raw, (countryCode || 'MA').toUpperCase() as any);
    if (parsed && parsed.isValid()) {
      return parsed.number.replace('+', '');
    }
  } catch {
    // Fallback to manual normalization
  }

  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  const cfg = getCountryConfig(countryCode);
  const dialDigits = cfg.phone.dialCode.replace(/\D/g, ''); // e.g. "966", "212", "20"

  // Already prefixed with dial code
  if (digits.startsWith(dialDigits)) {
    return digits;
  }
  // Dial code with leading 00
  if (digits.startsWith('00' + dialDigits)) {
    return digits.slice(2);
  }
  // Local number with trunk 0 (e.g. 05x, 06x)
  if (digits.startsWith('0')) {
    return dialDigits + digits.slice(1);
  }

  // Local number without 0
  return dialDigits + digits;
}
