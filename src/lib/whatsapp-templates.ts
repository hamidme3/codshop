/**
 * WhatsApp Darija Confirmation Engine for Moroccan COD Backoffice
 * Handles phone normalization (06/07/+212) and generating high-converting Darija templates.
 */

import { Order } from './types';
import { normalizePhoneForWhatsApp } from './geo';

export type WhatsAppTemplateType = 'confirmation' | 'unreachable' | 'gps_request' | 'shipped';

export interface NormalizedPhone {
  international: string; // e.g. "212661234567" for WhatsApp wa.me
  national: string;      // e.g. "0661234567" for Couriers & local calls
  isValid: boolean;
}

/**
 * Universal Moroccan Phone Sanitizer.
 * Accurately parses:
 * - "0661234567", "07...", "05..."
 * - "+212 6 61 23 45 67", "+2120661234567", "+212 (0)6..."
 * - "00212 6 61...", "0021206..."
 * - "661234567" (9 digits without leading 0)
 * - Raw inputs with dashes, dots, spaces, parens
 */
export function sanitizeMoroccanPhone(phone?: string | null): NormalizedPhone {
  if (!phone) return { international: '', national: '', isValid: false };

  let digits = String(phone).replace(/[^0-9]/g, '');

  // 1. Strip international dial prefixes
  if (digits.startsWith('00212')) {
    digits = digits.slice(5);
  } else if (digits.startsWith('212')) {
    digits = digits.slice(3);
  }

  // 2. Strip redundant trunk zero after international prefix (e.g. +212 06... -> 06...)
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // 3. National significant number in Morocco is 9 digits starting with 5, 6, or 7
  const isValid = digits.length === 9 && /^[567]/.test(digits);

  return {
    international: isValid ? `212${digits}` : digits,
    national: isValid ? `0${digits}` : digits,
    isValid,
  };
}

export function normalizeMoroccanPhone(phone?: string | null): string {
  return sanitizeMoroccanPhone(phone).international;
}

export function formatCourierPhone(phone?: string | null): string {
  return sanitizeMoroccanPhone(phone).national;
}

/**
 * Format order items for WhatsApp messaging
 * Example: "1x Sac Cuir Marrakech (Marron), 2x Babouche Fassi"
 */
export function formatOrderItemsSummary(order: Order, options?: { includeSku?: boolean }): string {
  if (!order.items || order.items.length === 0) {
    return 'votre commande';
  }
  const includeSku = options?.includeSku ?? true;
  return order.items
    .map((it) => {
      const details: string[] = [];
      if (includeSku && it.sku) details.push(`SKU: ${it.sku}`);
      if (it.variant) {
        details.push(it.variant);
      } else {
        if (it.color) details.push(it.color);
        if (it.size) details.push(`T.${it.size}`);
      }
      const detailsStr = details.length > 0 ? ` (${details.join(' • ')})` : '';
      return `${it.quantity > 1 ? `${it.quantity}x ` : ''}${it.title}${detailsStr}`;
    })
    .join(', ');
}

/**
 * Generate Darija WhatsApp messages tailored to Moroccan COD fulfillment steps
 */
export function getDarijaMessage(
  order: Order,
  template: WhatsAppTemplateType = 'confirmation',
  storeName: string = 'LA BOUTIQUE'
): string {
  const clientName = order.customerName?.trim() || 'Client';
  const itemsText = formatOrderItemsSummary(order);
  const totalDh = order.total || 0;
  const city = order.city || 'votre ville';
  const brand = storeName.toUpperCase();

  switch (template) {
    case 'confirmation':
      return (
        `Salam ${clientName} 👋\n` +
        `M3ak ${brand}. 3la 9bel la commande dialk (${order.orderNumber}):\n` +
        `📦 *${itemsText}*\n` +
        `💰 Total: *${totalDh} DH* (Paiement à la livraison)\n` +
        `📍 Ville: *${city}*\n\n` +
        `3afak jawbna b *"OUI"* bach nsayftouha lik lyoum/ghdda nchaellah, awla *"NON"* ila bghiti t-annuler. Chokran!`
      );

    case 'unreachable':
      return (
        `Salam ${clientName} 👋\n` +
        `M3ak service confirmation dial ${brand}. 3eyetna lik f téléphone walakin l9inah kaysoni bla jawab.\n` +
        `Kantsenaw confirmation dialk 3la had la commande: *${itemsText}* (${totalDh} DH l ${city}).\n\n` +
        `Wesh mazal baghi(a) la commande bach nsayftouha m3a livreur? Jawbna hna f WhatsApp. Merci!`
      );

    case 'gps_request':
      return (
        `Salam ${clientName} 👋\n` +
        `La commande dialk ${order.orderNumber} rah kharja m3a livreur lyoum f ${city}.\n` +
        `3afak sift lina la *localisation WhatsApp (Localisation en direct / GPS)* hna bach livreur yjib lik l colis bla ma yte3ttel. Chokran bzaf!`
      );

    case 'shipped':
      return (
        `Salam ${clientName} 👋\n` +
        `La commande dialk *${order.orderNumber}* t-expédiat m3a transporteur.\n` +
        `📦 Colis: ${itemsText}\n` +
        `💵 Total à préparer: *${totalDh} DH* en espèces.\n` +
        (order.trackingNumber ? `🔍 N° de Suivi: *${order.trackingNumber}*\n` : '') +
        `Livreur ghadi y3eyet lik 9bel ma yji 3ndk f ${city}.`
      );

    default:
      return `Salam ${clientName}, m3ak ${brand}. Bghina nconfirmew la commande dialk ${order.orderNumber} (${totalDh} DH).`;
  }
}

/**
 * Generate full wa.me URL
 */
export function buildWhatsAppLink(
  order: Order,
  template: WhatsAppTemplateType = 'confirmation',
  storeName: string = 'CODShop',
  countryCode: string = 'MA'
): string {
  const code = ((order as any)?.country || (order as any)?.countryCode || countryCode || 'MA').toUpperCase();
  const phoneNormalized = code === 'MA' ? normalizeMoroccanPhone(order.phone) : normalizePhoneForWhatsApp(order.phone, code);
  const message = getDarijaMessage(order, template, storeName);
  return `https://wa.me/${phoneNormalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate structured WhatsApp text for a Courier/Driver Manifest (Bon de Ramassage)
 */
export function getCourierManifestWhatsAppText(
  orders: Order[],
  storeName: string = 'Boutique',
  courierName: string = 'Transporteur'
): string {
  const dateStr = new Date().toLocaleDateString('fr-MA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const totalCrbt = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const lines: string[] = [
    `📦 *BON DE RAMASSAGE — ${storeName.toUpperCase()}*`,
    `🚚 Transporteur : *${courierName}*`,
    `📅 Date : ${dateStr}`,
    `📊 Volume : *${orders.length} colis*`,
    `💰 Total CRBT à encaisser : *${totalCrbt.toLocaleString('fr-MA')} DH*`,
    ``,
    `📋 *DÉTAIL DES COLIS :*`,
  ];

  orders.forEach((o, idx) => {
    const phone = formatCourierPhone(o.phone);
    const items = formatOrderItemsSummary(o, { includeSku: false });
    lines.push(`${idx + 1}. *#${o.orderNumber || o.id}* — ${o.customerName || 'Client'} (${phone})`);
    lines.push(`   📍 ${o.city || 'Maroc'}${o.address ? ` — ${o.address}` : ''}`);
    lines.push(`   📦 ${items}`);
    lines.push(`   💵 CRBT : *${o.total || 0} DH*`);
    lines.push(``);
  });

  lines.push(`Merci de confirmer la prise en charge des colis.`);
  return lines.join('\n');
}

/**
 * Generate wa.me link for sending Courier/Driver Manifest
 */
export function buildManifestWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone ? sanitizeMoroccanPhone(phone).international : '';
  const encoded = encodeURIComponent(text);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
