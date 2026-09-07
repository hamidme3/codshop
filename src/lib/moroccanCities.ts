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

export const POPULAR_CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'];

export interface DeliveryEstimate {
  sla: string;
  minDays: number;
  maxDays: number;
  minDate: Date;
  maxDate: Date;
  formattedEstimate: string;
  formattedEstimateAr: string;
  isTomorrow: boolean;
  shippingFee: number;
  isFree: boolean;
  cityName: string;
}

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

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DAYS_FR = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'];

/**
 * Adds business days skipping weekends (Saturday & Sunday).
 */
export function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    // Skip weekends: Sunday (0) and Saturday (6)
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  return result;
}

/**
 * Calculates base date for dispatch based on 16:00 cutoff and weekends.
 */
export function getDispatchBaseDate(now: Date): Date {
  const base = new Date(now);
  const day = base.getDay();
  const hour = base.getHours();

  // If after 16:00 on Friday, or during Saturday (6) or Sunday (0):
  // Dispatch starts Monday morning
  if ((day === 5 && hour >= 16) || day === 6 || day === 0) {
    while (base.getDay() !== 1) {
      base.setDate(base.getDate() + 1);
    }
  } else if (hour >= 16) {
    // Mon-Thu after 16:00: dispatch next business day
    base.setDate(base.getDate() + 1);
    while (base.getDay() === 0 || base.getDay() === 6) {
      base.setDate(base.getDate() + 1);
    }
  }
  return base;
}

export function getDeliveryDateEstimate(cityName: string, subtotal: number = 0, now: Date = new Date()): DeliveryEstimate {
  const shipping = getCityShipping(cityName, subtotal);
  const city = MOROCCAN_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());

  // Determine SLA business days
  let minDays = 1;
  let maxDays = 2;

  if (city?.isMajorHub) {
    minDays = 1;
    maxDays = 2;
  } else if (shipping.sla.includes('3 à 4 jours')) {
    minDays = 3;
    maxDays = 4;
  } else if (shipping.sla.includes('48h à 72h')) {
    minDays = 2;
    maxDays = 3;
  } else if (shipping.sla.includes('48h')) {
    minDays = 2;
    maxDays = 3;
  } else {
    minDays = 1;
    maxDays = 2;
  }

  const baseDate = getDispatchBaseDate(now);
  const minDate = addBusinessDays(baseDate, minDays);
  const maxDate = addBusinessDays(baseDate, maxDays);

  // Check if minDate lands on tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = minDate.toDateString() === tomorrow.toDateString() && minDays === 1;

  let formattedEstimate: string;
  let formattedEstimateAr: string;

  if (isTomorrow) {
    formattedEstimate = `Demain, ${DAYS_FR[minDate.getDay()]} ${minDate.getDate()} ${MONTHS_FR[minDate.getMonth()]}`;
    formattedEstimateAr = `غداً ${DAYS_AR[minDate.getDay()]} ${minDate.getDate()} ${MONTHS_AR[minDate.getMonth()]}`;
  } else if (minDays === maxDays || minDate.toDateString() === maxDate.toDateString()) {
    formattedEstimate = `${DAYS_FR[minDate.getDay()]} ${minDate.getDate()} ${MONTHS_FR[minDate.getMonth()]}`;
    formattedEstimateAr = `${DAYS_AR[minDate.getDay()]} ${minDate.getDate()} ${MONTHS_AR[minDate.getMonth()]}`;
  } else {
    formattedEstimate = `${DAYS_FR[minDate.getDay()]} ${minDate.getDate()} ${MONTHS_FR[minDate.getMonth()]} – ${DAYS_FR[maxDate.getDay()]} ${maxDate.getDate()} ${MONTHS_FR[maxDate.getMonth()]}`;
    formattedEstimateAr = `${DAYS_AR[minDate.getDay()]} ${minDate.getDate()} ${MONTHS_AR[minDate.getMonth()]} – ${DAYS_AR[maxDate.getDay()]} ${maxDate.getDate()} ${MONTHS_AR[maxDate.getMonth()]}`;
  }

  return {
    sla: shipping.sla,
    minDays,
    maxDays,
    minDate,
    maxDate,
    formattedEstimate,
    formattedEstimateAr,
    isTomorrow,
    shippingFee: shipping.fee,
    isFree: shipping.isFree,
    cityName: city?.name || cityName,
  };
}

export function validateMoroccanPhone(phone: string): {
  isValid: boolean;
  cleanPhone: string;
  formatted: string;
  operator?: string;
  error?: string;
} {
  if (!phone) {
    return { isValid: false, cleanPhone: '', formatted: '', error: 'Le numéro de téléphone est obligatoire' };
  }

  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-().]/g, '');

  // Convert international prefixes +212 or 00212 or 212
  if (cleaned.startsWith('+212')) {
    cleaned = '0' + cleaned.substring(4);
  } else if (cleaned.startsWith('00212')) {
    cleaned = '0' + cleaned.substring(5);
  } else if (cleaned.startsWith('212') && cleaned.length === 12) {
    cleaned = '0' + cleaned.substring(3);
  }

  // Check valid Moroccan mobile or fixed pattern: 10 digits starting with 05, 06, or 07
  const phoneRegex = /^0[5-7][0-9]{8}$/;
  const isValid = phoneRegex.test(cleaned);

  if (!isValid) {
    return {
      isValid: false,
      cleanPhone: cleaned,
      formatted: cleaned,
      error: 'Numéro invalide. Format attendu : 06 12 34 56 78 (10 chiffres)',
    };
  }

  // Format nicely: 06 12 34 56 78
  const formatted = cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');

  // Detect operator
  let operator = 'GSM';
  const prefix3 = cleaned.substring(0, 3);
  if (prefix3 === '066' || prefix3 === '067' || prefix3 === '061') {
    operator = 'Maroc Telecom';
  } else if (prefix3 === '064' || prefix3 === '065' || prefix3 === '070') {
    operator = 'Orange';
  } else if (prefix3 === '062' || prefix3 === '063' || prefix3 === '076' || prefix3 === '077') {
    operator = 'inwi';
  } else if (cleaned.startsWith('05')) {
    operator = 'Fixe';
  }

  return {
    isValid: true,
    cleanPhone: cleaned,
    formatted,
    operator,
  };
}

export function validateCustomerName(fullName: string): { isValid: boolean; error?: string } {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Veuillez saisir votre Nom & Prénom' };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Le nom doit contenir au moins 3 caractères' };
  }
  return { isValid: true };
}

export function validateAddress(address: string): { isValid: boolean; error?: string } {
  const trimmed = address.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Veuillez préciser votre adresse de livraison' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, error: "L'adresse doit être plus précise (rue, quartier, n°)" };
  }
  return { isValid: true };
}

// Delivery date calculation helper for Moroccan cities
export const getDeliveryDateRange = (city: string): string => {
  const citySLA: Record<string, { minDays: number; maxDays: number }> = {
    casablanca: { minDays: 1, maxDays: 2 },
    rabat: { minDays: 1, maxDays: 2 },
    sale: { minDays: 1, maxDays: 2 },
    marrakech: { minDays: 1, maxDays: 2 },
    tanger: { minDays: 1, maxDays: 2 },
    fes: { minDays: 1, maxDays: 2 },
    agadir: { minDays: 1, maxDays: 2 },
    meknes: { minDays: 1, maxDays: 2 },
    oujda: { minDays: 2, maxDays: 3 },
    kenitra: { minDays: 1, maxDays: 2 },
    tetouan: { minDays: 1, maxDays: 2 },
    mohammedia: { minDays: 1, maxDays: 2 },
    temara: { minDays: 1, maxDays: 2 },
    safi: { minDays: 2, maxDays: 3 },
    'el-jadida': { minDays: 1, maxDays: 2 },
    nador: { minDays: 2, maxDays: 3 },
    'beni-mellal': { minDays: 2, maxDays: 3 },
    taza: { minDays: 2, maxDays: 3 },
    khouribga: { minDays: 2, maxDays: 3 },
    settat: { minDays: 1, maxDays: 2 },
    larache: { minDays: 2, maxDays: 3 },
    khemisset: { minDays: 2, maxDays: 3 },
    berrechid: { minDays: 1, maxDays: 2 },
    taourirt: { minDays: 2, maxDays: 3 },
    taroudant: { minDays: 2, maxDays: 3 },
    ouarzazate: { minDays: 2, maxDays: 3 },
    laayoune: { minDays: 2, maxDays: 3 },
    dakhla: { minDays: 3, maxDays: 4 },
  };
  const s = citySLA[city.toLowerCase()] || { minDays: 2, maxDays: 3 };
  const now = new Date();
  const minD = addBusinessDays(now, s.minDays);
  const maxD = addBusinessDays(now, s.maxDays);
  const fmt = (d: Date) => `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
  if (s.minDays === s.maxDays || minD.toDateString() === maxD.toDateString()) {
    return fmt(minD);
  }
  return `${fmt(minD)} – ${fmt(maxD)}`;
};
