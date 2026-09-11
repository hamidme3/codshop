import { sanitizeText, isValidStoreSlug, escapeHtml } from '../src/lib/sanitizer';
import { resolveCatalogProduct, calculateItemTierPricing, calculateVerifiedShippingFee, verifyAndRecalculateOrder } from '../src/lib/order-pricing';
import { getStoreBySlug, createOrder } from '../src/lib/db-repository';
import { POST } from '../src/app/api/order/route';

async function runSecurityAuditTests() {
  console.log('🧪 Starting Round 2 Security Audit Tests: Price Tampering, Parameter Injection & Server Integrity...\n');

  // ══════════════════════════════════════════════════════════════════
  // Test 1: Store Slug Scoping & Validation
  // ══════════════════════════════════════════════════════════════════
  console.log('1. Testing Store Slug Scoping...');
  
  // 1.1 Format validation
  const validSlugs = ['ottavio', 'argan-bio', 'store-123', 'my-brand-2026'];
  for (const slug of validSlugs) {
    if (!isValidStoreSlug(slug)) {
      throw new Error(`Expected slug "${slug}" to be valid format`);
    }
  }

  const invalidSlugs = [
    'ottavio/../admin',
    'store; DROP TABLE stores; --',
    'OTTAVIO',
    'store with spaces',
    'store_with_underscores',
    '<script>',
    '',
    'a', // too short (< 2 chars)
  ];
  for (const slug of invalidSlugs) {
    if (isValidStoreSlug(slug)) {
      throw new Error(`Expected slug "${slug}" to be rejected as invalid format`);
    }
  }
  console.log('  ✓ Store slug regex and syntax format checks passed.');

  // 1.2 Store existence & active status in catalog
  const ottavioStore = await getStoreBySlug('ottavio');
  if (!ottavioStore || ottavioStore.slug !== 'ottavio') {
    throw new Error('Expected active store "ottavio" to be found');
  }

  const nonexistentStore = await getStoreBySlug('nonexistent-ghost-store-99');
  if (nonexistentStore !== null) {
    throw new Error('Expected nonexistent store to return null, but got a store object');
  }
  console.log('  ✓ Valid active stores accepted, non-existent stores strictly rejected (no phantom fallbacks).');

  // ══════════════════════════════════════════════════════════════════
  // Test 2: Input Sanitization & Anti-XSS Guards
  // ══════════════════════════════════════════════════════════════════
  console.log('\n2. Testing Input Sanitization (XSS Guards)...');

  // 2.1 Script tags
  const xssScript = '<script>alert("XSS")</script>';
  const cleanScript = sanitizeText(xssScript);
  if (cleanScript.includes('<script>') || cleanScript.includes('alert')) {
    throw new Error(`Script tag sanitization failed: got "${cleanScript}"`);
  }

  // 2.2 Image onerror vector
  const xssImg = 'Fatima <img src=x onerror=alert(document.cookie)> Kadiri';
  const cleanImg = sanitizeText(xssImg);
  if (cleanImg !== 'Fatima Kadiri') {
    throw new Error(`Image onerror sanitization failed: got "${cleanImg}"`);
  }

  // 2.3 SVG onload vector in address
  const xssSvg = 'Maârif Rue Jura <svg/onload=alert(1)> N° 12';
  const cleanSvg = sanitizeText(xssSvg);
  if (cleanSvg.includes('<svg') || cleanSvg.includes('onload')) {
    throw new Error(`SVG onload sanitization failed: got "${cleanSvg}"`);
  }

  // 2.4 Iframe vector in agency name
  const xssIframe = 'Agence Ozon <iframe src="javascript:alert(1)"></iframe> Bernoussi';
  const cleanIframe = sanitizeText(xssIframe);
  if (cleanIframe !== 'Agence Ozon Bernoussi') {
    throw new Error(`Iframe sanitization failed: got "${cleanIframe}"`);
  }

  // 2.5 Variant XSS
  const xssVariant = 'Taille 42 <script src="http://evil.com/pwn.js"></script> Noir';
  const cleanVariant = sanitizeText(xssVariant);
  if (cleanVariant !== 'Taille 42 Noir') {
    throw new Error(`Variant sanitization failed: got "${cleanVariant}"`);
  }

  // 2.6 Preserves legitimate Moroccan names, Arabic text, and French accents
  const legitArabic = 'فاطمة الزهراء بناني';
  if (sanitizeText(legitArabic) !== legitArabic) {
    throw new Error('Arabic text was corrupted by sanitizer');
  }

  const legitFrench = 'Résidence Al Manar, Étage 3, Appt 14';
  if (sanitizeText(legitFrench) !== legitFrench) {
    throw new Error('French accented text was corrupted by sanitizer');
  }

  // 2.7 HTML Entity Escaper for defense-in-depth
  const escaped = escapeHtml('<div class="test">& "hello" \'world\'</div>');
  if (escaped !== '&lt;div class=&quot;test&quot;&gt;&amp; &quot;hello&quot; &#39;world&#39;&lt;/div&gt;') {
    throw new Error(`escapeHtml failed: got "${escaped}"`);
  }

  console.log('  ✓ customerName, address, agencyName, and variant sanitization verified against multiple XSS vectors.');
  console.log('  ✓ Legitimate Arabic text and French accented characters preserved without corruption.');

  // ══════════════════════════════════════════════════════════════════
  // Test 3: Catalog Product Lookup & Tier Pricing Recalculation
  // ══════════════════════════════════════════════════════════════════
  console.log('\n3. Testing Catalog Product Lookup & Server-Side Tier Pricing...');

  // 3.1 Resolving luxury product with explicit quantityTiers (lux-1)
  const lux1 = await resolveCatalogProduct({ id: 'lux-1' }, 'ottavio');
  if (!lux1 || lux1.price !== 699) {
    throw new Error('Failed to resolve lux-1 from catalog');
  }

  // Quantity = 1 -> 699 DH
  const tier1 = calculateItemTierPricing(lux1, 1);
  if (tier1.unitPrice !== 699 || tier1.itemSubtotal !== 699) {
    throw new Error(`Expected lux-1 qty 1 to be 699, got ${tier1.itemSubtotal}`);
  }

  // Quantity = 2 (Pack Duo) -> unitPrice 599, totalPrice 1198 DH
  const tier2 = calculateItemTierPricing(lux1, 2);
  if (tier2.unitPrice !== 599 || tier2.itemSubtotal !== 1198) {
    throw new Error(`Expected lux-1 qty 2 to be 1198, got ${tier2.itemSubtotal}`);
  }

  // 3.2 Resolving standard store product (prod_1: Sac Cuir Artisanal Marrakech, 349 DH)
  const prod1 = await resolveCatalogProduct({ id: 'prod_1' }, 'ottavio');
  if (!prod1 || prod1.price !== 349) {
    throw new Error('Failed to resolve prod_1 from catalog');
  }

  // Quantity = 1 -> 349 DH
  const p1Tier1 = calculateItemTierPricing(prod1, 1);
  if (p1Tier1.itemSubtotal !== 349) {
    throw new Error(`Expected prod_1 qty 1 to be 349, got ${p1Tier1.itemSubtotal}`);
  }

  // Quantity = 2 (Pack Duo with -100 DH discount) -> 349 * 2 - 100 = 598 DH
  const p1Tier2 = calculateItemTierPricing(prod1, 2, { packDuoDiscount: 100, packTrioDiscount: 200 });
  if (p1Tier2.itemSubtotal !== 598) {
    throw new Error(`Expected prod_1 qty 2 (Pack Duo) to be 598, got ${p1Tier2.itemSubtotal}`);
  }

  // Quantity = 3 (Pack Trio with -200 DH discount) -> 349 * 3 - 200 = 847 DH
  const p1Tier3 = calculateItemTierPricing(prod1, 3, { packDuoDiscount: 100, packTrioDiscount: 200 });
  if (p1Tier3.itemSubtotal !== 847) {
    throw new Error(`Expected prod_1 qty 3 (Pack Trio) to be 847, got ${p1Tier3.itemSubtotal}`);
  }

  console.log('  ✓ Catalog resolution and exact tier prices recalculated (Pack Duo -100 DH, Pack Trio -200 DH, and explicit quantityTiers).');

  // ══════════════════════════════════════════════════════════════════
  // Test 4: Server-Side Shipping Calculation
  // ══════════════════════════════════════════════════════════════════
  console.log('\n4. Testing Moroccan Shipping Calculation Rules...');

  // Stopdesk pickup is free
  const s1 = calculateVerifiedShippingFee('Casablanca', 150, 1, 'stopdesk');
  if (s1.shippingFee !== 0 || !s1.isFreeShipping) {
    throw new Error('Stopdesk pickup must be free shipping');
  }

  // Pack Duo (qty >= 2) unlocks free shipping
  const s2 = calculateVerifiedShippingFee('Casablanca', 200, 2, 'home');
  if (s2.shippingFee !== 0 || !s2.isFreeShipping) {
    throw new Error('Order with quantity >= 2 must unlock free shipping');
  }

  // Free shipping threshold (subtotal >= 400 DH)
  const s3 = calculateVerifiedShippingFee('Rabat', 450, 1, 'home');
  if (s3.shippingFee !== 0 || !s3.isFreeShipping) {
    throw new Error('Subtotal >= 400 DH must unlock free shipping');
  }

  // Standard city fee (Casablanca = 20 DH, Rabat = 25 DH)
  const sCasa = calculateVerifiedShippingFee('Casablanca', 200, 1, 'home');
  if (sCasa.shippingFee !== 20) {
    throw new Error(`Expected Casablanca shipping fee to be 20, got ${sCasa.shippingFee}`);
  }

  const sRabat = calculateVerifiedShippingFee('Rabat', 200, 1, 'home');
  if (sRabat.shippingFee !== 25) {
    throw new Error(`Expected Rabat shipping fee to be 25, got ${sRabat.shippingFee}`);
  }

  console.log('  ✓ Moroccan shipping rules verified (Stopdesk free, Pack Duo free, >= 400 DH free, city matrix accurate).');

  // ══════════════════════════════════════════════════════════════════
  // Test 5: Price Tampering Prevention & Override
  // ══════════════════════════════════════════════════════════════════
  console.log('\n5. Testing Price Tampering Overrides...');

  // Malicious buyer attempts to buy 2 pairs of Richelieu shoes (normal price: 1198 DH) for 1 DH!
  const tamperedPayload = {
    storeSlug: 'ottavio',
    customerName: 'Hacker Tamperer <script>alert(1)</script>',
    customerPhone: '0661998877',
    customerCity: 'Casablanca',
    customerAddress: 'Boulevard Anfa <img src=x onerror=alert(1)>',
    product: {
      id: 'lux-1',
      title: 'Souliers Richelieu Cousu Goodyear',
      variant: 'Pointure 43 <script>',
    },
    quantity: 2,
    unitPrice: 0.5, // Tampered!
    subtotal: 1,    // Tampered!
    shippingFee: 0, // Tampered!
    total: 1,       // Tampered (1 DH)!
  };

  const verification = await verifyAndRecalculateOrder(tamperedPayload, 'ottavio');
  if (!verification.success) {
    throw new Error(`Verification failed: ${verification.error}`);
  }

  if (verification.total === 1 || verification.subtotal === 1) {
    throw new Error('SECURITY BREACH: Client tampered price was accepted by server!');
  }

  if (verification.subtotal !== 1198 || verification.total !== 1198) {
    throw new Error(`Expected server to recalculate total to genuine 1198 DH, got ${verification.total}`);
  }

  if (!verification.tamperingDetected) {
    throw new Error('Expected tamperingDetected flag to be true');
  }

  if (verification.customerName !== 'Hacker Tamperer' || verification.address !== 'Boulevard Anfa') {
    throw new Error(`Sanitization failed during verification: customerName="${verification.customerName}", address="${verification.address}"`);
  }

  if (verification.items[0].variant !== 'Pointure 43') {
    throw new Error(`Variant sanitization failed: got "${verification.items[0].variant}"`);
  }

  console.log('  ✓ Malicious 1 DH total detected and overridden with authentic catalog tier price (1198 DH).');
  console.log('  ✓ Inputs simultaneously sanitized against embedded script and img tags.');

  // ══════════════════════════════════════════════════════════════════
  // Test 6: Database Repository Isolation & createOrder Guards
  // ══════════════════════════════════════════════════════════════════
  console.log('\n6. Testing createOrder Backend Repository Guards...');

  // 6.1 Direct call to createOrder with XSS payload and tampered numbers
  const directOrder = await createOrder({
    storeSlug: 'ottavio',
    customerName: 'Direct Client <script>alert("hack")</script>',
    phone: '0661122334',
    city: 'Marrakech',
    address: 'Gueliz <svg onload=alert(1)>',
    items: [
      {
        id: 'prod_1',
        title: 'Sac Cuir Artisanal Marrakech',
        quantity: 2,
        price: 299,
        variant: 'Marron Vintage <iframe src=x></iframe>',
      },
    ],
    subtotal: 598,
    shippingFee: 0,
    total: 598,
  });

  if (directOrder.customerName !== 'Direct Client' || directOrder.address !== 'Gueliz') {
    throw new Error(`createOrder sanitization failed: name="${directOrder.customerName}", address="${directOrder.address}"`);
  }

  if (directOrder.items[0].variant !== 'Marron Vintage') {
    throw new Error(`createOrder variant sanitization failed: got "${directOrder.items[0].variant}"`);
  }

  // 6.2 createOrder rejects invalid / non-existent store slug
  try {
    await createOrder({
      storeSlug: 'invalid-nonexistent-store-slug',
      customerName: 'Test Client',
      phone: '0661122334',
      city: 'Casablanca',
      address: 'Test Address',
      items: [{ id: 'prod_1', title: 'Test', quantity: 1, price: 100 }],
      subtotal: 100,
      shippingFee: 20,
      total: 120,
    });
    throw new Error('createOrder should have thrown error for non-existent store');
  } catch (err: any) {
    if (!err.message.includes('Store not found or inactive')) {
      throw new Error(`Unexpected error message: ${err.message}`);
    }
  }

  console.log('  ✓ createOrder enforces store scoping and input sanitization at the database boundary.');

  // ══════════════════════════════════════════════════════════════════
  // Test 7: Full End-to-End POST /api/order Route Integration
  // ══════════════════════════════════════════════════════════════════
  console.log('\n7. Testing POST /api/order Route Handler End-to-End...');

  // 7.1 Rejection of non-existent store
  const invalidStoreReq = new Request('http://localhost:3005/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storeSlug: 'ghost-store-not-real',
      customerName: 'Test',
      phone: '0661998877',
    }),
  });
  const invalidStoreRes = await POST(invalidStoreReq);
  const invalidStoreData = await invalidStoreRes.json();
  if (invalidStoreRes.status !== 400 || invalidStoreData.success !== false) {
    throw new Error('Expected 400 Bad Request for non-existent store');
  }
  console.log('  ✓ POST /api/order rejects non-existent store with 400.');

  // 7.2 Rejection of invalid product
  const invalidProdReq = new Request('http://localhost:3005/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      storeSlug: 'ottavio',
      customerName: 'Test',
      phone: '0661998877',
      product: { id: 'definitely-not-a-real-product-xyz' },
      quantity: 1,
    }),
  });
  const invalidProdRes = await POST(invalidProdReq);
  const invalidProdData = await invalidProdRes.json();
  if (invalidProdRes.status !== 400 || invalidProdData.success !== false) {
    throw new Error('Expected 400 Bad Request for invalid product');
  }
  console.log('  ✓ POST /api/order rejects unknown product with 400.');

  // 7.3 Blatant price tampering attempt (submitting total: 1 DH for 598 DH product) -> rejected with 400
  const attackPhone = `0699${Math.floor(100000 + Math.random() * 900000)}`;
  const tamperedOrderReq = new Request('http://localhost:3005/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '10.0.0.1',
    },
    body: JSON.stringify({
      storeSlug: 'ottavio',
      customerName: 'Hakim <script>alert("xss")</script> Ziyech',
      customerPhone: attackPhone,
      customerCity: 'Casablanca',
      customerAddress: 'Ain Diab Villa 12 <img src=x onerror=alert(1)>',
      product: {
        id: 'prod_1',
        title: 'Sac Cuir Artisanal Marrakech',
        variant: 'Marron Vintage <script>',
      },
      quantity: 2, // Pack Duo: 349 * 2 - 100 = 598 DH
      unitPrice: 1, // Tampered!
      subtotal: 1,  // Tampered!
      shippingFee: 0,
      total: 1,     // Tampered (1 DH)!
    }),
  });

  const tamperedOrderRes = await POST(tamperedOrderReq);
  const tamperedOrderData = await tamperedOrderRes.json();

  if (tamperedOrderRes.status !== 400 || tamperedOrderData.code !== 'PRICE_TAMPERING_REJECTED') {
    throw new Error(`Expected 400 PRICE_TAMPERING_REJECTED for tampered price, got status ${tamperedOrderRes.status}`);
  }
  console.log('  ✓ POST /api/order blocked blatant 1 DH price tampering with 400 PRICE_TAMPERING_REJECTED.');

  // 7.4 Legitimate order submission -> server strictly recalculates exact tier price and sanitizes inputs
  const validPhone = `0698${Math.floor(100000 + Math.random() * 900000)}`;
  const validOrderReq = new Request('http://localhost:3005/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '10.0.0.2',
    },
    body: JSON.stringify({
      storeSlug: 'ottavio',
      customerName: 'Hakim <script>alert("xss")</script> Ziyech',
      customerPhone: validPhone,
      customerCity: 'Casablanca',
      customerAddress: 'Ain Diab Villa 12 <img src=x onerror=alert(1)>',
      product: {
        id: 'prod_1',
        title: 'Sac Cuir Artisanal Marrakech',
        variant: 'Marron Vintage <script>',
      },
      quantity: 2, // Pack Duo: 349 * 2 - 100 = 598 DH.
    }),
  });

  const validOrderRes = await POST(validOrderReq);
  const validOrderData = await validOrderRes.json();

  if (validOrderRes.status !== 200 || !validOrderData.success) {
    throw new Error(`Expected successful order, got ${validOrderRes.status}: ${JSON.stringify(validOrderData)}`);
  }

  const createdOrder = validOrderData.order;
  if (createdOrder.subtotal !== 598 || createdOrder.total !== 598) {
    throw new Error(`Expected recalculated total to be 598 DH, got ${createdOrder.total}`);
  }

  if (createdOrder.customerName !== 'Hakim Ziyech' || createdOrder.address !== 'Ain Diab Villa 12') {
    throw new Error(`Sanitization check failed in route output: name="${createdOrder.customerName}", address="${createdOrder.address}"`);
  }

  if (createdOrder.items[0].variant !== 'Marron Vintage') {
    throw new Error(`Variant sanitization check failed in route output: got "${createdOrder.items[0].variant}"`);
  }

  console.log('  ✓ POST /api/order accurately calculated 598 DH tier price server-side with sanitized inputs.');
  console.log('\n🎉 ALL ROUND 2 SECURITY AUDIT TESTS PASSED WITH 100% INTEGRITY!');
}

runSecurityAuditTests().catch((err) => {
  console.error('\n❌ Security Audit Test failed:', err);
  process.exit(1);
});
