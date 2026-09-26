/**
 * Moroccan Courier Tracking & Logistics Portal Engine
 * Supports: Ozon Express, SendIt, Cathedis, Amana Express (Poste Maroc), and Internal Fleet.
 */

export type MoroccanCourier = 'ozon' | 'sendit' | 'cathedis' | 'amana' | 'manual';

export interface CourierConfig {
  key: MoroccanCourier;
  name: string;
  fullName: string;
  prefix: string;
  trackingBaseUrl: string;
  badgeClass: string;
  getTrackingUrl: (trackingNumber: string) => string;
}

export const MOROCCAN_COURIERS: Record<MoroccanCourier, CourierConfig> = {
  ozon: {
    key: 'ozon',
    name: 'Ozon Express',
    fullName: 'Ozon Express Maroc (N°1 COD)',
    prefix: 'OZON-MA-',
    trackingBaseUrl: 'https://ozonexpress.ma/suivi',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    getTrackingUrl: (t: string) => `https://ozonexpress.ma/suivi?tracking=${encodeURIComponent(t.trim())}`,
  },
  sendit: {
    key: 'sendit',
    name: 'SendIt.ma',
    fullName: 'SendIt Express Tracking',
    prefix: 'SND-MA-',
    trackingBaseUrl: 'https://sendit.ma/tracking',
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    getTrackingUrl: (t: string) => `https://sendit.ma/tracking/${encodeURIComponent(t.trim())}`,
  },
  cathedis: {
    key: 'cathedis',
    name: 'Cathedis',
    fullName: 'Cathedis Messagerie & Express',
    prefix: 'CATH-MA-',
    trackingBaseUrl: 'https://cathedis.net/tracking',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    getTrackingUrl: (t: string) => `https://cathedis.net/tracking?code=${encodeURIComponent(t.trim())}`,
  },
  amana: {
    key: 'amana',
    name: 'Amana (Poste Maroc)',
    fullName: 'Amana Express Poste Maroc',
    prefix: 'AMN-MA-',
    trackingBaseUrl: 'https://www.amana-colis.ma/suivi',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    getTrackingUrl: (t: string) => `https://www.amana-colis.ma/suivi?code=${encodeURIComponent(t.trim())}`,
  },
  manual: {
    key: 'manual',
    name: 'Livreur Interne',
    fullName: 'Flotte Interne / Livreur Partenaire',
    prefix: 'LIV-MA-',
    trackingBaseUrl: '',
    badgeClass: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    getTrackingUrl: () => '',
  },
};

/**
 * Normalizes a raw courier string or detects the courier from a tracking number prefix.
 */
export function normalizeCourierKey(courier?: string, trackingNumber?: string): MoroccanCourier {
  const c = courier?.toLowerCase().trim();
  if (c === 'ozon' || c === 'ozon express') return 'ozon';
  if (c === 'sendit' || c === 'sendit.ma') return 'sendit';
  if (c === 'cathedis') return 'cathedis';
  if (c === 'amana' || c === 'poste maroc' || c === 'poste-maroc') return 'amana';
  if (c === 'manual') return 'manual';

  // Detect by tracking number prefix
  const t = trackingNumber?.toUpperCase().trim() || '';
  if (t.startsWith('OZON-') || t.startsWith('OZN-')) return 'ozon';
  if (t.startsWith('SND-') || t.startsWith('SENDIT-')) return 'sendit';
  if (t.startsWith('CATH-') || t.startsWith('CTH-')) return 'cathedis';
  if (t.startsWith('AMN-') || t.startsWith('AMANA-')) return 'amana';
  if (t.startsWith('LIV-')) return 'manual';

  // Default to Ozon Express (Morocco's primary COD courier) instead of generic "standard"
  return 'ozon';
}

/**
 * Generates an authentic courier tracking number based on the courier network.
 */
export function generateCourierTrackingNumber(courier: string = 'ozon'): string {
  const key = normalizeCourierKey(courier);
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  const cfg = MOROCCAN_COURIERS[key] || MOROCCAN_COURIERS.ozon;
  return `${cfg.prefix}${randomSixDigits}`;
}

/**
 * Returns the public tracking portal URL for a courier and tracking number.
 */
export function getCourierTrackingUrl(courier?: string, trackingNumber?: string): string | null {
  if (!trackingNumber) return null;
  const key = normalizeCourierKey(courier, trackingNumber);
  const cfg = MOROCCAN_COURIERS[key];
  if (!cfg || !cfg.getTrackingUrl) return null;
  const url = cfg.getTrackingUrl(trackingNumber);
  return url || null;
}

/**
 * Returns courier display metadata.
 */
export function getCourierMeta(courier?: string, trackingNumber?: string): CourierConfig {
  const key = normalizeCourierKey(courier, trackingNumber);
  return MOROCCAN_COURIERS[key] || MOROCCAN_COURIERS.ozon;
}
