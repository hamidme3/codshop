/**
 * WhatsApp Darija Confirmation Engine for Moroccan COD Backoffice
 * Handles phone normalization (06/07/+212) and generating high-converting Darija templates.
 */

import { Order } from './types';

export type WhatsAppTemplateType = 'confirmation' | 'unreachable' | 'gps_request' | 'shipped';

/**
 * Robust Moroccan phone sanitizer.
 * Converts: "0661234567", "+212 6 61 23 45 67", "00212661234567", "07...", "05..."
 * into international format without plus: "212661234567"
 */
export function normalizeMoroccanPhone(phone: string): string {
  if (!phone) return '';
  // Keep only numeric digits
  let cleaned = phone.replace(/[^0-9]/g, '');

  // Handle international prefix 00212...
  if (cleaned.startsWith('00212')) {
    cleaned = cleaned.slice(2);
  }

  // Handle local Moroccan number starting with 0 (e.g., 06..., 07..., 05...)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = `212${cleaned.slice(1)}`;
  }

  // Handle standard number without leading 0 or prefix (9 digits e.g. 661234567)
  if (cleaned.length === 9 && (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('5'))) {
    cleaned = `212${cleaned}`;
  }

  return cleaned;
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
  storeName: string = 'CODShop'
): string {
  const phoneNormalized = normalizeMoroccanPhone(order.phone);
  const message = getDarijaMessage(order, template, storeName);
  return `https://wa.me/${phoneNormalized}?text=${encodeURIComponent(message)}`;
}
