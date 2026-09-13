/**
 * WhatsApp Darija Confirmation Engine for Moroccan COD Backoffice
 * Handles phone normalization (06/07/+212) and generating high-converting Darija templates.
 */

import { Order } from './types';
import { normalizePhoneForWhatsApp, COUNTRIES } from './geo';

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
 * Generate localized WhatsApp messages tailored to country COD standards
 */
export function getCountryWhatsAppMessage(
  order: Order,
  template: WhatsAppTemplateType = 'confirmation',
  storeName: string = 'LA BOUTIQUE',
  countryCode: string = 'MA'
): string {
  const code = (countryCode || (order as any)?.country || (order as any)?.countryCode || 'MA').toUpperCase();
  const cfg = COUNTRIES[code] || COUNTRIES.MA;
  const clientName = order.customerName?.trim() || (['SA', 'AE', 'EG'].includes(code) ? 'عميلنا العزيز' : 'Client');
  const itemsText = formatOrderItemsSummary(order);
  const total = order.total || 0;
  const curr = order.currency || cfg.currency.symbol;
  const city = order.city || (['SA', 'AE', 'EG'].includes(code) ? 'مدينتكم' : 'votre ville');
  const brand = storeName.toUpperCase();

  // 1. Gulf / Modern Standard Arabic (Saudi Arabia, UAE)
  if (code === 'SA' || code === 'AE') {
    switch (template) {
      case 'confirmation':
        return (
          `السلام عليكم ورحمة الله وبركاته يا ${clientName} 👋\n` +
          `معك متجر ${brand}. بخصوص طلبكم رقم (${order.orderNumber}):\n` +
          `📦 *${itemsText}*\n` +
          `💰 المبلغ الإجمالي: *${total} ${curr}* (الدفع عند الاستلام)\n` +
          `📍 المدينة: *${city}*\n\n` +
          `يرجى الرد بكلمة *"نعم"* أو *"تأكيد"* لتجهيز وشحن الطلب فوراً، أو *"إلغاء"* في حال رغبتكم بالإلغاء. شكراً لثقتكم!`
        );
      case 'unreachable':
        return (
          `السلام عليكم ورحمة الله وبركاته يا ${clientName} 👋\n` +
          `معك فريق خدمة العملاء من ${brand}. حاولنا الاتصال بكم هاتفياً لتأكيد طلبكم ولم نتمكن من الوصول إليكم.\n` +
          `طلبكم بانتظار التأكيد: *${itemsText}* (${total} ${curr} إلى ${city}).\n\n` +
          `هل ترغبون في إرسال الشحنة مع المندوب؟ يرجى الرد هنا عبر الواتساب لتأكيد الشحن. شكراً لكم!`
        );
      case 'gps_request':
        return (
          `السلام عليكم ورحمة الله وبركاته يا ${clientName} 👋\n` +
          `طلبكم رقم ${order.orderNumber} في طريقه إليكم اليوم مع مندوب التوصيل في ${city}.\n` +
          `يرجى التكرم بإرسال *الموقع المباشر (Live Location / اللوكيشن)* هنا لتسريع التسليم بدقة. شكراً لكم!`
        );
      case 'shipped':
        return (
          `السلام عليكم ورحمة الله وبركاته يا ${clientName} 👋\n` +
          `تم تسليم طلبكم رقم *${order.orderNumber}* لشركة الشحن بنجاح.\n` +
          `📦 الشحنة: ${itemsText}\n` +
          `💵 المبلغ المطلوب عند الاستلام: *${total} ${curr}* نقداً.\n` +
          (order.trackingNumber ? `🔍 رقم التتبع: *${order.trackingNumber}*\n` : '') +
          `سيتواصل معكم مندوب التوصيل قبل التوصيل في ${city}.`
        );
      default:
        return `السلام عليكم يا ${clientName}، معك متجر ${brand}. نود تأكيد طلبكم رقم ${order.orderNumber} بمبلغ ${total} ${curr}.`;
    }
  }

  // 2. Egyptian Arabic (Egypt)
  if (code === 'EG') {
    switch (template) {
      case 'confirmation':
        return (
          `أهلاً بحضرتك يا ${clientName} 👋\n` +
          `معاك متجر ${brand}. بخصوص أوردرك رقم (${order.orderNumber}):\n` +
          `📦 *${itemsText}*\n` +
          `💰 الإجمالي: *${total} ${curr}* (الدفع كاش عند الاستلام)\n` +
          `📍 العنوان: *${city}*\n\n` +
          `يا ريت ترد علينا بكلمة *"نعم"* أو *"تمام"* لتأكيد وشحن الأوردر لحضرتك فوراً، أو *"إلغاء"* لو تحب تلغي. شكراً ليك!`
        );
      case 'unreachable':
        return (
          `أهلاً بحضرتك يا ${clientName} 👋\n` +
          `معاك خدمة العملاء من ${brand}. حاولنا نتواصل مع حضرتك هاتفياً بخصوص الأوردر ورقم التليفون كان غير متاح.\n` +
          `الأوردر بتاعك جاهز: *${itemsText}* (${total} ${curr} إلى ${city}).\n\n` +
          `يا ريت تؤكد معانا هنا لو لسه عايز الأوردر عشان نبعته مع المندوب. شكراً جداً!`
        );
      case 'gps_request':
        return (
          `أهلاً بحضرتك يا ${clientName} 👋\n` +
          `الأوردر بتاعك ${order.orderNumber} مع المندوب دلوقتي في ${city}.\n` +
          `يا ريت تبعتلنا *اللوكيشن على الواتساب* هنا عشان المندوب يوصل لحضرتك في أسرع وقت. شكراً ليك!`
        );
      case 'shipped':
        return (
          `أهلاً بحضرتك يا ${clientName} 👋\n` +
          `الأوردر بتاعك رقم *${order.orderNumber}* خرج للشحن.\n` +
          `📦 المحتويات: ${itemsText}\n` +
          `💵 المبلغ المطلوب: *${total} ${curr}* كاش عند الاستلام.\n` +
          (order.trackingNumber ? `🔍 رقم البوليصة: *${order.trackingNumber}*\n` : '') +
          `المندوب هيتصل بحضرتك قبل ما يوصل في ${city}.`
        );
      default:
        return `أهلاً بحضرتك يا ${clientName}، معاك ${brand}. بخصوص أوردرك رقم ${order.orderNumber} (${total} ${curr}).`;
    }
  }

  // 3. International French (France, Senegal, Ivory Coast)
  if (code === 'FR' || code === 'SN' || code === 'CI') {
    switch (template) {
      case 'confirmation':
        return (
          `Bonjour ${clientName} 👋\n` +
          `De la part de la boutique ${brand}. Concernant votre commande n° ${order.orderNumber} :\n` +
          `📦 *${itemsText}*\n` +
          `💰 Total : *${total} ${curr}* (Paiement à la livraison)\n` +
          `📍 Ville de livraison : *${city}*\n\n` +
          `Merci de bien vouloir répondre *"OUI"* pour confirmer l'expédition rapide de votre colis, ou *"NON"* pour l'annuler. Merci !`
        );
      case 'unreachable':
        return (
          `Bonjour ${clientName} 👋\n` +
          `Service client ${brand}. Nous avons tenté de vous joindre par téléphone au sujet de votre commande : *${itemsText}* (${total} ${curr} à destination de ${city}).\n\n` +
          `Confirmez-vous l'expédition avec le livreur ? Merci de nous répondre ici sur WhatsApp.`
        );
      case 'gps_request':
        return (
          `Bonjour ${clientName} 👋\n` +
          `Votre commande n° ${order.orderNumber} est en cours de livraison aujourd'hui à ${city}.\n` +
          `Merci de nous partager votre *position GPS WhatsApp (Localisation en direct)* afin d'aider le livreur à arriver directement à votre adresse. Merci beaucoup !`
        );
      case 'shipped':
        return (
          `Bonjour ${clientName} 👋\n` +
          `Votre commande n° *${order.orderNumber}* a été remise au transporteur express.\n` +
          `📦 Colis : ${itemsText}\n` +
          `💵 Montant à régler à la livraison : *${total} ${curr}*.\n` +
          (order.trackingNumber ? `🔍 N° de suivi : *${order.trackingNumber}*\n` : '') +
          `Le livreur vous contactera par téléphone avant son passage à ${city}.`
        );
      default:
        return `Bonjour ${clientName}, de la part de ${brand}. Concernant votre commande n° ${order.orderNumber} (${total} ${curr}).`;
    }
  }

  // 4. Moroccan Darija / Maghreb Standard (Morocco, Algeria)
  return getDarijaMessage(order, template, storeName);
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
  const message = getCountryWhatsAppMessage(order, template, storeName, code);
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
  const currencySymbol = orders[0]?.currency || 'DH';

  const lines: string[] = [
    `📦 *BON DE RAMASSAGE — ${storeName.toUpperCase()}*`,
    `🚚 Transporteur : *${courierName}*`,
    `📅 Date : ${dateStr}`,
    `📊 Volume : *${orders.length} colis*`,
    `💰 Total CRBT à encaisser : *${totalCrbt.toLocaleString('fr-MA')} ${currencySymbol}*`,
    ``,
    `📋 *DÉTAIL DES COLIS :*`,
  ];

  orders.forEach((o, idx) => {
    const oCountry = ((o as any)?.country || (o as any)?.countryCode || 'MA').toUpperCase();
    const phone = oCountry === 'MA' ? formatCourierPhone(o.phone) : normalizePhoneForWhatsApp(o.phone, oCountry);
    const items = formatOrderItemsSummary(o, { includeSku: false });
    const oCurr = o.currency || currencySymbol;
    lines.push(`${idx + 1}. *#${o.orderNumber || o.id}* — ${o.customerName || 'Client'} (${phone})`);
    lines.push(`   📍 ${o.city || 'Ville'}${o.address ? ` — ${o.address}` : ''}`);
    lines.push(`   📦 ${items}`);
    lines.push(`   💵 CRBT : *${o.total || 0} ${oCurr}*`);
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
