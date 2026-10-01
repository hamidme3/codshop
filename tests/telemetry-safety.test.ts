import assert from 'node:assert';
import {
  initPostHog,
  trackStorePageView,
  trackCatalogView,
  trackSearch,
  trackProductView,
  trackInitiateCheckout,
  trackCheckoutStep2,
  trackCodAbandoned,
  trackOrderCompleted,
  trackWhatsAppRescue,
} from '../src/lib/posthog';

async function runTelemetryTests() {
  console.log('🧪 Starting Telemetry & PostHog Safety Test Suite...\n');

  // Test 1: SSR Safety (window === undefined)
  console.log('Test 1: SSR Environment Safety...');
  assert.strictEqual(initPostHog(), false, 'initPostHog must safely return false in SSR');
  // None of the tracking functions should throw in SSR
  trackStorePageView('test-store', '/');
  trackCatalogView('test-store');
  trackSearch('test-store', 'chaussures', 5);
  trackProductView('test-store', { id: 'p1', title: 'Product 1', price: 199 });
  trackInitiateCheckout('test-store', { id: 'p1', title: 'Product 1', price: 199, quantity: 1 });
  trackCheckoutStep2('test-store', { productId: 'p1', city: 'Casablanca' });
  trackCodAbandoned('test-store', { productId: 'p1', step: 1, hasPhone: false, hasAddress: false });
  trackOrderCompleted('test-store', { orderId: 'CMD-1', total: 199, city: 'Casablanca', deliveryType: 'home' });
  trackWhatsAppRescue('test-store', { productId: 'p1', total: 199 });
  console.log('  ✓ All tracking functions executed cleanly in SSR with zero throws.\n');

  // Test 2: Client with Remote Domain and Localhost/Unconfigured PostHog
  console.log('Test 2: Remote Browser Domain Guard (Preventing localhost:8100 query)...');
  const mockDispatchedEvents: any[] = [];
  (global as any).window = {
    location: {
      hostname: 'storet1.codshop.vipone.site',
      href: 'https://storet1.codshop.vipone.site/product/sac-cuir',
      pathname: '/product/sac-cuir',
    },
  };
  (global as any).document = {
    cookie: '',
    visibilityState: 'visible',
  };
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => {},
  };
  try {
    Object.defineProperty(global, 'navigator', {
      value: {
        sendBeacon: (url: string, data: any) => {
          mockDispatchedEvents.push({ url, data });
          return true;
        },
      },
      configurable: true,
      writable: true,
    });
  } catch {
    // If navigator cannot be overridden, mock fetch
    (global as any).fetch = async (url: string, opts: any) => {
      mockDispatchedEvents.push({ url, data: opts?.body });
      return { ok: true };
    };
  }

  const initializedOnRemote = initPostHog();
  assert.strictEqual(initializedOnRemote, false, 'PostHog must NOT initialize on remote domain without explicit valid credentials');
  console.log('  ✓ PostHog prevented from connecting to localhost from remote visitor devices.\n');

  // Test 3: Native Server Telemetry Dispatch
  console.log('Test 3: CODShop Native Server Telemetry Resilience...');
  trackStorePageView('storet1', '/product/sac-cuir');
  assert.ok(mockDispatchedEvents.length >= 1, 'Native server event must be dispatched via sendBeacon');
  assert.strictEqual(mockDispatchedEvents[0].url, '/api/tracking/events');
  console.log('  ✓ Native /api/tracking/events received pageview beacon without third-party network noise.\n');

  console.log('🎉 ALL TELEMETRY & POSTHOG SAFETY TESTS PASSED (100% SUCCESS)!\n');
}

runTelemetryTests().catch((err) => {
  console.error('❌ Telemetry test failed:', err);
  process.exit(1);
});
