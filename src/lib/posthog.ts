import posthog from 'posthog-js';

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'http://localhost:8100';
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_codshop_local';

let isInitialized = false;

/**
 * Initializes PostHog in pure quantitative mode.
 * Session replay and heavy DOM autocaptures are strictly disabled to preserve VPS CPU and RAM.
 */
export function initPostHog() {
  if (typeof window === 'undefined' || isInitialized) return;

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // ⚠️ RESOURCE PROTECTION: No video or session recording
      disable_session_recording: true,
      enable_recording_console_log: false,
      autocapture: false, // Explicit events only, zero DOM listeners
      capture_pageview: false, // Handled explicitly with store_slug context
      persistence: 'localStorage',
      loaded: () => {
        isInitialized = true;
      },
    });
  } catch (err) {
    console.warn('[PostHog] Init error:', err);
  }
}

function getDistinctId(): string {
  if (typeof window === 'undefined') return 'anon';
  try {
    const match = document.cookie.match(/(?:^|;\s*)cod_anon_id=([^;]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]);
    let stored = localStorage.getItem('cod_anon_id');
    if (!stored) {
      stored = `anon_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem('cod_anon_id', stored);
    }
    return stored;
  } catch {
    return 'anon';
  }
}

function dispatchServerEvent(storeSlug: string, eventName: string, properties: Record<string, any> = {}) {
  if (typeof window === 'undefined' || !storeSlug) return;
  try {
    const payload = JSON.stringify({
      storeSlug,
      eventName,
      distinctId: getDistinctId(),
      properties,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/tracking/events', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/tracking/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Non-blocking telemetry
  }
}

/**
 * Capture a pageview explicitly tagged with the tenant store_slug
 */
export function trackStorePageView(storeSlug: string, path: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'pageview', { path, ...properties });
  posthog.capture('$pageview', {
    store_slug: storeSlug,
    path,
    $current_url: window.location.href,
    ...properties,
  });
}

/**
 * Track when a visitor browses the catalog page
 */
export function trackCatalogView(storeSlug: string, properties?: { category?: string; sort?: string; resultsCount?: number }) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'catalog_viewed', properties);
  posthog.capture('catalog_viewed', {
    store_slug: storeSlug,
    category: properties?.category || 'all',
    sort: properties?.sort || 'default',
    results_count: properties?.resultsCount,
    $current_url: window.location.href,
  });
}

/**
 * Track user search queries and exact words searched
 */
export function trackSearch(storeSlug: string, query: string, resultsCount: number) {
  if (typeof window === 'undefined' || !query.trim()) return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'search_performed', {
    search_query: query.trim().toLowerCase(),
    results_count: resultsCount,
    is_zero_result: resultsCount === 0,
  });
  posthog.capture('search_performed', {
    store_slug: storeSlug,
    search_query: query.trim().toLowerCase(),
    results_count: resultsCount,
    is_zero_result: resultsCount === 0,
  });
}

/**
 * Track when a visitor views a product page
 */
export function trackProductView(storeSlug: string, product: { id: string; title: string; price: number; slug?: string }) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'product_viewed', product);
  posthog.capture('product_viewed', {
    store_slug: storeSlug,
    product_id: product.id,
    product_title: product.title,
    product_slug: product.slug,
    price: product.price,
  });
}

/**
 * Track when a shopper opens the COD checkout modal (Step 1)
 */
export function trackInitiateCheckout(storeSlug: string, product: { id: string; title: string; price: number; quantity: number }) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'initiated_checkout', product);
  posthog.capture('initiated_checkout', {
    store_slug: storeSlug,
    product_id: product.id,
    product_title: product.title,
    price: product.price,
    quantity: product.quantity,
    cod_step: 1,
  });
  posthog.capture('cod_step_1_started', {
    store_slug: storeSlug,
    product_id: product.id,
    product_title: product.title,
    price: product.price,
    quantity: product.quantity,
  });
}

/**
 * Track when a shopper proceeds to delivery address & phone (Step 2)
 */
export function trackCheckoutStep2(storeSlug: string, data: { productId: string; city: string }) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'checkout_step_2', data);
  posthog.capture('checkout_step_2', {
    store_slug: storeSlug,
    product_id: data.productId,
    city: data.city,
    cod_step: 2,
  });
  posthog.capture('cod_step_2_started', {
    store_slug: storeSlug,
    product_id: data.productId,
    city: data.city,
  });
}

/**
 * Track when a shopper abandons the COD checkout modal without completing the order
 */
export function trackCodAbandoned(
  storeSlug: string,
  data: {
    productId: string;
    productTitle?: string;
    step: 1 | 2;
    hasName?: boolean;
    hasPhone: boolean;
    phone?: string;
    hasAddress: boolean;
    city?: string;
  }
) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'cod_checkout_abandoned', data);
  posthog.capture('cod_checkout_abandoned', {
    store_slug: storeSlug,
    product_id: data.productId,
    product_title: data.productTitle,
    abandoned_at_step: data.step,
    has_name: data.hasName ?? false,
    has_phone: data.hasPhone,
    phone_preview: data.hasPhone && data.phone ? data.phone.slice(0, 4) + '****' : undefined,
    has_address: data.hasAddress,
    city: data.city,
    is_recoverable_lead: data.hasPhone,
  });
}

/**
 * Track when an order is successfully submitted
 */
export function trackOrderCompleted(storeSlug: string, order: { orderId: string; total: number; city: string; deliveryType: string; productId?: string }) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'order_completed', order);
  posthog.capture('order_completed', {
    store_slug: storeSlug,
    order_id: order.orderId,
    total: order.total,
    city: order.city,
    delivery_type: order.deliveryType,
    product_id: order.productId,
  });
}

/**
 * Track when a shopper clicks "Commander via WhatsApp"
 */
export function trackWhatsAppRescue(storeSlug: string, data: { productId?: string; total?: number; reason?: string }) {
  if (typeof window === 'undefined') return;
  initPostHog();
  dispatchServerEvent(storeSlug, 'whatsapp_rescue_clicked', data);
  posthog.capture('whatsapp_rescue_clicked', {
    store_slug: storeSlug,
    product_id: data.productId,
    total: data.total,
    reason: data.reason || 'user_intent',
  });
}
