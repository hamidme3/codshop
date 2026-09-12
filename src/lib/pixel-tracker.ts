/**
 * CODShop Multi-Platform Ad Pixel & Conversion Tracker
 * Supports: Meta (Facebook), TikTok, Snapchat, Google Analytics/Ads, Pinterest
 * Features: Adblocker safe, client deduplication guard, dual-dispatch CAPI support.
 */

export interface PixelConfig {
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  snapchatPixelId?: string | null;
  googleAnalyticsId?: string | null;
  googleMerchantCenterId?: string | null;
  pinterestPartnerId?: string | null;
}

export interface TrackItem {
  id?: string;
  title: string;
  price: number;
  quantity: number;
  variant?: string;
  sku?: string;
}

export interface ViewContentParams {
  id: string;
  title: string;
  price: number;
  currency?: string;
  category?: string;
}

export interface InitiateCheckoutParams {
  id: string;
  title: string;
  price: number;
  quantity: number;
  currency?: string;
  items?: TrackItem[];
}

export interface PurchaseParams {
  orderId: string;
  total: number;
  currency?: string;
  items?: TrackItem[];
  customerPhone?: string;
  customerCity?: string;
}

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    ttq?: any;
    snaptr?: (...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    pintrk?: (...args: any[]) => void;
    __cod_pixels_initialized?: boolean;
    __cod_loaded_pixels?: Set<string>;
  }
}

// In-memory cache of current configuration
let currentConfig: PixelConfig | null = null;

/**
 * Initializes ad pixel SDK scripts into the DOM safely.
 */
export function initPixels(config: PixelConfig): void {
  if (typeof window === 'undefined') return;

  currentConfig = config;
  if (!window.__cod_loaded_pixels) {
    window.__cod_loaded_pixels = new Set<string>();
  }

  // 1. Meta (Facebook) Pixel
  if (config.metaPixelId && !window.__cod_loaded_pixels.has(`meta_${config.metaPixelId}`)) {
    try {
      if (!window.fbq) {
        const n: any = (window.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        });
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const t = document.createElement('script');
        t.async = true;
        t.src = 'https://connect.facebook.net/en_US/fbevents.js';
        const s = document.getElementsByTagName('script')[0];
        s?.parentNode?.insertBefore(t, s);
      }
      window.fbq('init', config.metaPixelId);
      window.fbq('track', 'PageView');
      window.__cod_loaded_pixels.add(`meta_${config.metaPixelId}`);
    } catch (e) {
      console.warn('[Pixel Tracker] Meta init suppressed by client/adblocker');
    }
  }

  // 2. TikTok Pixel
  if (config.tiktokPixelId && !window.__cod_loaded_pixels.has(`tt_${config.tiktokPixelId}`)) {
    try {
      if (!window.ttq) {
        const ttq: any = (window.ttq = []);
        ttq.methods = [
          'page',
          'track',
          'identify',
          'instances',
          'debug',
          'on',
          'off',
          'once',
          'ready',
          'alias',
          'group',
          'enableCookie',
          'disableCookie',
        ];
        ttq.setAndDefer = function (t: any, e: any) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (let i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        ttq.instance = function (t: any) {
          const e = ttq._i[t] || [];
          for (let n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n]);
          }
          return e;
        };
        ttq.load = function (e: any, n: any) {
          const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          ttq._i = ttq._i || {};
          ttq._i[e] = [];
          ttq._i[e]._u = i;
          ttq._t = ttq._t || {};
          ttq._t[e] = +new Date();
          ttq._o = ttq._o || {};
          ttq._o[e] = n || {};
          const o = document.createElement('script');
          o.type = 'text/javascript';
          o.async = true;
          o.src = i + '?sdkid=' + e + '&lib=ttq';
          const a = document.getElementsByTagName('script')[0];
          a?.parentNode?.insertBefore(o, a);
        };
      }
      window.ttq.load(config.tiktokPixelId);
      window.ttq.page();
      window.__cod_loaded_pixels.add(`tt_${config.tiktokPixelId}`);
    } catch (e) {
      console.warn('[Pixel Tracker] TikTok init suppressed by client/adblocker');
    }
  }

  // 3. Snapchat Pixel
  if (config.snapchatPixelId && !window.__cod_loaded_pixels.has(`snap_${config.snapchatPixelId}`)) {
    try {
      if (!window.snaptr) {
        const tr: any = (window.snaptr = function () {
          tr.handleRequest ? tr.handleRequest.apply(tr, arguments) : tr.queue.push(arguments);
        });
        tr.queue = [];
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://sc-static.net/scevent.min.js';
        const head = document.getElementsByTagName('script')[0];
        head?.parentNode?.insertBefore(s, head);
      }
      window.snaptr('init', config.snapchatPixelId);
      window.snaptr('track', 'PAGE_VIEW');
      window.__cod_loaded_pixels.add(`snap_${config.snapchatPixelId}`);
    } catch (e) {
      console.warn('[Pixel Tracker] Snapchat init suppressed by client/adblocker');
    }
  }

  // 4. Google Analytics / Tag
  if (config.googleAnalyticsId && !window.__cod_loaded_pixels.has(`gtag_${config.googleAnalyticsId}`)) {
    try {
      if (!window.gtag) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          window.dataLayer?.push(arguments);
        };
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.googleAnalyticsId)}`;
        const head = document.getElementsByTagName('script')[0];
        head?.parentNode?.insertBefore(s, head);
        window.gtag('js', new Date());
      }
      window.gtag('config', config.googleAnalyticsId);
      window.__cod_loaded_pixels.add(`gtag_${config.googleAnalyticsId}`);
    } catch (e) {
      console.warn('[Pixel Tracker] Google Tag init suppressed by client/adblocker');
    }
  }

  // 5. Pinterest Tag
  if (config.pinterestPartnerId && !window.__cod_loaded_pixels.has(`pin_${config.pinterestPartnerId}`)) {
    try {
      if (!window.pintrk) {
        window.pintrk = function () {
          (window.pintrk as any).queue.push(Array.prototype.slice.call(arguments));
        };
        (window.pintrk as any).queue = [];
        (window.pintrk as any).version = '3.0';
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://s.pinimg.com/ct/core.js';
        const head = document.getElementsByTagName('script')[0];
        head?.parentNode?.insertBefore(s, head);
      }
      window.pintrk('load', config.pinterestPartnerId);
      window.pintrk('page');
      window.__cod_loaded_pixels.add(`pin_${config.pinterestPartnerId}`);
    } catch (e) {
      console.warn('[Pixel Tracker] Pinterest init suppressed by client/adblocker');
    }
  }

  window.__cod_pixels_initialized = true;
}

/**
 * Automatically fetch pixel config from server and initialize.
 */
export async function fetchAndInitPixels(storeSlug?: string): Promise<PixelConfig | null> {
  if (typeof window === 'undefined') return null;
  try {
    const url = storeSlug ? `/api/ads/pixels?store=${encodeURIComponent(storeSlug)}` : '/api/ads/pixels';
    const res = await fetch(url);
    if (!res.ok) return null;
    const config: PixelConfig = await res.json();
    initPixels(config);
    return config;
  } catch (err) {
    console.warn('[Pixel Tracker] Unable to fetch pixel config:', err);
    return null;
  }
}

/**
 * Fires ViewContent event across all configured ad channels.
 */
export function trackViewContent(params: ViewContentParams): void {
  if (typeof window === 'undefined') return;
  const currency = params.currency || 'MAD';

  // Meta
  try {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: params.title,
        content_ids: [params.id],
        content_type: 'product',
        value: params.price,
        currency,
      });
    }
  } catch {}

  // TikTok
  try {
    if (window.ttq) {
      window.ttq.track('ViewContent', {
        content_name: params.title,
        content_id: params.id,
        content_type: 'product',
        value: params.price,
        currency,
      });
    }
  } catch {}

  // Snapchat
  try {
    if (window.snaptr) {
      window.snaptr('track', 'VIEW_CONTENT', {
        item_ids: [params.id],
        item_category: params.category || 'product',
        price: params.price,
        currency,
      });
    }
  } catch {}

  // Google Analytics
  try {
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency,
        value: params.price,
        items: [{ item_id: params.id, item_name: params.title, price: params.price }],
      });
    }
  } catch {}

  // Pinterest
  try {
    if (window.pintrk) {
      window.pintrk('track', 'pagevisit', {
        product_id: params.id,
        product_name: params.title,
        product_price: params.price,
        currency,
      });
    }
  } catch {}
}

/**
 * Fires InitiateCheckout event when the customer opens the COD modal.
 */
export function trackInitiateCheckout(params: InitiateCheckoutParams): void {
  if (typeof window === 'undefined') return;
  const currency = params.currency || 'MAD';
  const qty = params.quantity || 1;
  const value = params.price * qty;

  // Meta
  try {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: params.title,
        content_ids: [params.id],
        num_items: qty,
        value,
        currency,
      });
    }
  } catch {}

  // TikTok
  try {
    if (window.ttq) {
      window.ttq.track('InitiateCheckout', {
        content_name: params.title,
        content_id: params.id,
        quantity: qty,
        value,
        currency,
      });
    }
  } catch {}

  // Snapchat
  try {
    if (window.snaptr) {
      window.snaptr('track', 'START_CHECKOUT', {
        item_ids: [params.id],
        number_items: qty,
        price: value,
        currency,
      });
    }
  } catch {}

  // Google Analytics
  try {
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency,
        value,
        items: [
          {
            item_id: params.id,
            item_name: params.title,
            price: params.price,
            quantity: qty,
          },
        ],
      });
    }
  } catch {}

  // Pinterest
  try {
    if (window.pintrk) {
      window.pintrk('track', 'lead', {
        lead_type: 'InitiateCheckout',
        value,
        order_quantity: qty,
        currency,
      });
    }
  } catch {}
}

/**
 * Fires Purchase event on order confirmation with deduplication guard.
 */
export function trackPurchase(params: PurchaseParams): void {
  if (typeof window === 'undefined') return;

  const dedupKey = `cod_purchased_${params.orderId}`;
  try {
    if (sessionStorage.getItem(dedupKey)) {
      console.info(`[Pixel Tracker] Purchase event for #${params.orderId} already fired in this session. Suppressing duplicate.`);
      return;
    }
    sessionStorage.setItem(dedupKey, '1');
  } catch {
    // Ignore sessionStorage errors in private browsing
  }

  const currency = params.currency || 'MAD';
  const eventId = `evt_${params.orderId}_${Date.now()}`;
  const total = Number(params.total) || 0;
  const numItems = params.items ? params.items.reduce((sum, it) => sum + (it.quantity || 1), 0) : 1;

  // 1. Meta Pixel
  try {
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: total,
        currency,
        content_type: 'product',
        num_items: numItems,
        order_id: params.orderId,
      }, { eventID: eventId });
    }
  } catch {}

  // 2. TikTok Pixel
  try {
    if (window.ttq) {
      window.ttq.track('CompletePayment', {
        content_type: 'product',
        value: total,
        currency,
        quantity: numItems,
      }, { event_id: eventId });
    }
  } catch {}

  // 3. Snapchat Pixel
  try {
    if (window.snaptr) {
      window.snaptr('track', 'PURCHASE', {
        price: total,
        currency,
        transaction_id: params.orderId,
        number_items: numItems,
      });
    }
  } catch {}

  // 4. Google Analytics / Ads
  try {
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: params.orderId,
        value: total,
        currency,
        items: params.items?.map((it) => ({
          item_id: it.id || it.sku || params.orderId,
          item_name: it.title,
          price: it.price,
          quantity: it.quantity,
        })),
      });
    }
  } catch {}

  // 5. Pinterest Tag
  try {
    if (window.pintrk) {
      window.pintrk('track', 'checkout', {
        value: total,
        order_quantity: numItems,
        currency,
        order_id: params.orderId,
      });
    }
  } catch {}

  // 6. Dual-Dispatch Server CAPI Simulation
  try {
    fetch('/api/tracking/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Purchase',
        eventId,
        value: total,
        currency,
        orderId: params.orderId,
        items: params.items,
      }),
    }).catch(() => {
      // Background non-blocking CAPI attempt
    });
  } catch {}
}
