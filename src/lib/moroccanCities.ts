export interface MoroccanCity {
  id: string;
  name: string;
  nameAr: string;
  region: string;
  shippingFee: number;
  deliverySla: string;
  isMajorHub?: boolean;
}

export const MOROCCAN_CITIES: MoroccanCity[] = [
  { id: 'casablanca', name: 'Casablanca', nameAr: 'الدار البيضاء', region: 'Casablanca-Settat', shippingFee: 20, deliverySla: '24h (Demain chez vous)', isMajorHub: true },
  { id: 'rabat', name: 'Rabat', nameAr: 'الرباط', region: 'Rabat-Salé-Kénitra', shippingFee: 25, deliverySla: '24h (Demain chez vous)', isMajorHub: true },
  { id: 'sale', name: 'Salé', nameAr: 'سلا', region: 'Rabat-Salé-Kénitra', shippingFee: 25, deliverySla: '24h (Demain chez vous)', isMajorHub: true },
  { id: 'marrakech', name: 'Marrakech', nameAr: 'مراكش', region: 'Marrakech-Safi', shippingFee: 30, deliverySla: '24h à 48h', isMajorHub: true },
  { id: 'tanger', name: 'Tanger', nameAr: 'طنجة', region: 'Tanger-Tétouan-Al Hoceïma', shippingFee: 30, deliverySla: '24h à 48h', isMajorHub: true },
  { id: 'fes', name: 'Fès', nameAr: 'فاس', region: 'Fès-Meknès', shippingFee: 30, deliverySla: '24h à 48h', isMajorHub: true },
  { id: 'agadir', name: 'Agadir', nameAr: 'أكادير', region: 'Souss-Massa', shippingFee: 35, deliverySla: '24h à 48h', isMajorHub: true },
  { id: 'meknes', name: 'Meknès', nameAr: 'مكناس', region: 'Fès-Meknès', shippingFee: 30, deliverySla: '24h à 48h' },
  { id: 'oujda', name: 'Oujda', nameAr: 'وجدة', region: 'Oriental', shippingFee: 35, deliverySla: '48h' },
  { id: 'kenitra', name: 'Kénitra', nameAr: 'القنيطرة', region: 'Rabat-Salé-Kénitra', shippingFee: 25, deliverySla: '24h' },
  { id: 'tetouan', name: 'Tétouan', nameAr: 'تطوان', region: 'Tanger-Tétouan-Al Hoceïma', shippingFee: 30, deliverySla: '24h à 48h' },
  { id: 'mohammedia', name: 'Mohammedia', nameAr: 'المحمدية', region: 'Casablanca-Settat', shippingFee: 20, deliverySla: '24h' },
  { id: 'temara', name: 'Témara', nameAr: 'تمارة', region: 'Rabat-Salé-Kénitra', shippingFee: 25, deliverySla: '24h' },
  { id: 'safi', name: 'Safi', nameAr: 'آسفي', region: 'Marrakech-Safi', shippingFee: 35, deliverySla: '48h' },
  { id: 'el-jadida', name: 'El Jadida', nameAr: 'الجديدة', region: 'Casablanca-Settat', shippingFee: 30, deliverySla: '24h à 48h' },
  { id: 'nador', name: 'Nador', nameAr: 'الناظور', region: 'Oriental', shippingFee: 35, deliverySla: '48h' },
  { id: 'beni-mellal', name: 'Béni Mellal', nameAr: 'بني ملال', region: 'Béni Mellal-Khénifra', shippingFee: 35, deliverySla: '48h' },
  { id: 'taza', name: 'Taza', nameAr: 'تازة', region: 'Fès-Meknès', shippingFee: 35, deliverySla: '48h' },
  { id: 'khouribga', name: 'Khouribga', nameAr: 'خريبكة', region: 'Béni Mellal-Khénifra', shippingFee: 35, deliverySla: '48h' },
  { id: 'settat', name: 'Settat', nameAr: 'سطات', region: 'Casablanca-Settat', shippingFee: 25, deliverySla: '24h' },
  { id: 'larache', name: 'Larache', nameAr: 'العرائش', region: 'Tanger-Tétouan-Al Hoceïma', shippingFee: 30, deliverySla: '48h' },
  { id: 'khemisset', name: 'Khémisset', nameAr: 'الخميسات', region: 'Rabat-Salé-Kénitra', shippingFee: 30, deliverySla: '48h' },
  { id: 'berrechid', name: 'Berrechid', nameAr: 'برشيد', region: 'Casablanca-Settat', shippingFee: 25, deliverySla: '24h' },
  { id: 'taourirt', name: 'Taourirt', nameAr: 'تاوريرت', region: 'Oriental', shippingFee: 35, deliverySla: '48h' },
  { id: 'taroudant', name: 'Taroudant', nameAr: 'تارودانت', region: 'Souss-Massa', shippingFee: 40, deliverySla: '48h à 72h' },
  { id: 'ouarzazate', name: 'Ouarzazate', nameAr: 'ورزازات', region: 'Drâa-Tafilalet', shippingFee: 45, deliverySla: '48h à 72h' },
  { id: 'laayoune', name: 'Laâyoune', nameAr: 'العيون', region: 'Laâyoune-Sakia El Hamra', shippingFee: 45, deliverySla: '48h à 72h' },
  { id: 'dakhla', name: 'Dakhla', nameAr: 'الداخلة', region: 'Dakhla-Oued Ed-Dahab', shippingFee: 50, deliverySla: '3 à 4 jours' },
];

export const FREE_SHIPPING_THRESHOLD = 400; // Free delivery above 400 MAD

export function getCityShipping(cityName: string, subtotal: number = 0): { fee: number; sla: string; isFree: boolean } {
  if (subtotal >= FREE_SHIPPING_THRESHOLD && subtotal > 0) {
    const city = MOROCCAN_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    return {
      fee: 0,
      sla: city ? city.deliverySla : '24h à 48h',
      isFree: true,
    };
  }

  const city = MOROCCAN_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  if (city) {
    return {
      fee: city.shippingFee,
      sla: city.deliverySla,
      isFree: false,
    };
  }

  // Default nationwide
  return {
    fee: 35,
    sla: '24h à 48h partout au Maroc',
    isFree: false,
  };
}
