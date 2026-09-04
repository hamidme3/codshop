export interface MoroccanCity {
  id: string;
  name: string;
  nameAr: string;
  regionId: string;
  deliveryHours: number;
  standardShippingFee: number;
}

export interface MoroccanRegion {
  id: string;
  name: string;
  nameAr: string;
  capital: string;
}

export const MOROCCAN_REGIONS: MoroccanRegion[] = [
  { id: 'reg_1', name: 'Casablanca-Settat', nameAr: 'الدار البيضاء - سطات', capital: 'Casablanca' },
  { id: 'reg_2', name: 'Rabat-Salé-Kénitra', nameAr: 'الرباط - سلا - القنيطرة', capital: 'Rabat' },
  { id: 'reg_3', name: 'Tanger-Tétouan-Al Hoceïma', nameAr: 'طنجة - تطوان - الحسيمة', capital: 'Tanger' },
  { id: 'reg_4', name: 'Marrakech-Safi', nameAr: 'مراكش - آسفي', capital: 'Marrakech' },
  { id: 'reg_5', name: 'Fès-Meknès', nameAr: 'فاس - مكناس', capital: 'Fès' },
  { id: 'reg_6', name: 'Souss-Massa', nameAr: 'سوس - ماسة', capital: 'Agadir' },
  { id: 'reg_7', name: "L'Oriental", nameAr: 'الشرق', capital: 'Oujda' },
  { id: 'reg_8', name: 'Béni Mellal-Khénifra', nameAr: 'بني ملال - خنيفرة', capital: 'Béni Mellal' },
  { id: 'reg_9', name: 'Drâa-Tafilalet', nameAr: 'درعة - تافيلالت', capital: 'Errachidia' },
  { id: 'reg_10', name: 'Guelmim-Oued Noun', nameAr: 'كلميم - واد نون', capital: 'Guelmim' },
  { id: 'reg_11', name: 'Laâyoune-Sakia El Hamra', nameAr: 'العيون - الساقية الحمراء', capital: 'Laâyoune' },
  { id: 'reg_12', name: 'Dakhla-Oued Ed-Dahab', nameAr: 'الداخلة - وادي الذهب', capital: 'Dakhla' },
];

export const MOROCCAN_CITIES: MoroccanCity[] = [
  // Casablanca-Settat
  { id: 'casablanca', name: 'Casablanca', nameAr: 'الدار البيضاء', regionId: 'reg_1', deliveryHours: 24, standardShippingFee: 20 },
  { id: 'mohammedia', name: 'Mohammédia', nameAr: 'المحمدية', regionId: 'reg_1', deliveryHours: 24, standardShippingFee: 25 },
  { id: 'el_jadida', name: 'El Jadida', nameAr: 'الجديدة', regionId: 'reg_1', deliveryHours: 48, standardShippingFee: 30 },
  { id: 'settat', name: 'Settat', nameAr: 'سطات', regionId: 'reg_1', deliveryHours: 48, standardShippingFee: 30 },
  { id: 'berrechid', name: 'Berrechid', nameAr: 'برشيد', regionId: 'reg_1', deliveryHours: 24, standardShippingFee: 25 },

  // Rabat-Salé-Kénitra
  { id: 'rabat', name: 'Rabat', nameAr: 'الرباط', regionId: 'reg_2', deliveryHours: 24, standardShippingFee: 20 },
  { id: 'sale', name: 'Salé', nameAr: 'سلا', regionId: 'reg_2', deliveryHours: 24, standardShippingFee: 20 },
  { id: 'temara', name: 'Témara', nameAr: 'تمارة', regionId: 'reg_2', deliveryHours: 24, standardShippingFee: 20 },
  { id: 'kenitra', name: 'Kénitra', nameAr: 'القنيطرة', regionId: 'reg_2', deliveryHours: 24, standardShippingFee: 25 },

  // Tanger-Tétouan
  { id: 'tanger', name: 'Tanger', nameAr: 'طنجة', regionId: 'reg_3', deliveryHours: 24, standardShippingFee: 25 },
  { id: 'tetouan', name: 'Tétouan', nameAr: 'تطوان', regionId: 'reg_3', deliveryHours: 48, standardShippingFee: 30 },
  { id: 'al_hoceima', name: 'Al Hoceïma', nameAr: 'الحسيمة', regionId: 'reg_3', deliveryHours: 48, standardShippingFee: 35 },
  { id: 'larache', name: 'Larache', nameAr: 'العرائش', regionId: 'reg_3', deliveryHours: 48, standardShippingFee: 30 },

  // Marrakech-Safi
  { id: 'marrakech', name: 'Marrakech', nameAr: 'مراكش', regionId: 'reg_4', deliveryHours: 24, standardShippingFee: 25 },
  { id: 'safi', name: 'Safi', nameAr: 'آسفي', regionId: 'reg_4', deliveryHours: 48, standardShippingFee: 30 },
  { id: 'essaouira', name: 'Essaouira', nameAr: 'الصويرة', regionId: 'reg_4', deliveryHours: 48, standardShippingFee: 35 },

  // Fès-Meknès
  { id: 'fes', name: 'Fès', nameAr: 'فاس', regionId: 'reg_5', deliveryHours: 24, standardShippingFee: 25 },
  { id: 'meknes', name: 'Meknès', nameAr: 'مكناس', regionId: 'reg_5', deliveryHours: 24, standardShippingFee: 25 },
  { id: 'taza', name: 'Taza', nameAr: 'تازة', regionId: 'reg_5', deliveryHours: 48, standardShippingFee: 35 },

  // Souss-Massa
  { id: 'agadir', name: 'Agadir', nameAr: 'أكادير', regionId: 'reg_6', deliveryHours: 48, standardShippingFee: 30 },
  { id: 'taroudant', name: 'Taroudant', nameAr: 'تارودانت', regionId: 'reg_6', deliveryHours: 48, standardShippingFee: 35 },
  { id: 'tiznit', name: 'Tiznit', nameAr: 'تيزنيت', regionId: 'reg_6', deliveryHours: 48, standardShippingFee: 35 },

  // L'Oriental
  { id: 'oujda', name: 'Oujda', nameAr: 'وجدة', regionId: 'reg_7', deliveryHours: 48, standardShippingFee: 35 },
  { id: 'nador', name: 'Nador', nameAr: 'الناظور', regionId: 'reg_7', deliveryHours: 48, standardShippingFee: 35 },
  { id: 'berkane', name: 'Berkane', nameAr: 'بركان', regionId: 'reg_7', deliveryHours: 48, standardShippingFee: 35 },

  // Provinces du Sud
  { id: 'guelmim', name: 'Guelmim', nameAr: 'كلميم', regionId: 'reg_10', deliveryHours: 48, standardShippingFee: 35 },
  { id: 'laayoune', name: 'Laâyoune', nameAr: 'العيون', regionId: 'reg_11', deliveryHours: 48, standardShippingFee: 35 },
  { id: 'dakhla', name: 'Dakhla', nameAr: 'الداخلة', regionId: 'reg_12', deliveryHours: 72, standardShippingFee: 40 },
];

export interface SupportedCountry {
  code: string;
  name: string;
  nameAr: string;
  currency: string;
  defaultShippingRate: number;
  phonePrefix: string;
}

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: 'MA', name: 'Maroc', nameAr: 'المغرب', currency: 'MAD', defaultShippingRate: 25, phonePrefix: '+212' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', currency: 'EUR', defaultShippingRate: 150, phonePrefix: '+33' },
  { code: 'ES', name: 'Espagne', nameAr: 'إسبانيا', currency: 'EUR', defaultShippingRate: 150, phonePrefix: '+34' },
  { code: 'BE', name: 'Belgique', nameAr: 'بلجيكا', currency: 'EUR', defaultShippingRate: 160, phonePrefix: '+32' },
  { code: 'AE', name: 'Émirats Arabes Unis', nameAr: 'الإمارات', currency: 'AED', defaultShippingRate: 200, phonePrefix: '+971' },
  { code: 'SA', name: 'Arabie Saoudite', nameAr: 'السعودية', currency: 'SAR', defaultShippingRate: 200, phonePrefix: '+966' },
];

export interface CountryCallingCode {
  country: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const COUNTRY_CALLING_CODES: CountryCallingCode[] = [
  { country: 'Maroc', code: 'MA', dialCode: '+212', flag: '🇲🇦' },
  { country: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { country: 'Espagne', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { country: 'Belgique', code: 'BE', dialCode: '+32', flag: '🇧🇪' },
  { country: 'Émirats Arabes Unis', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { country: 'Arabie Saoudite', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { country: 'États-Unis / Canada', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { country: 'Royaume-Uni', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
];

export function getCityById(id: string): MoroccanCity | undefined {
  return MOROCCAN_CITIES.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getCitiesByRegion(regionId: string): MoroccanCity[] {
  return MOROCCAN_CITIES.filter((c) => c.regionId === regionId);
}

