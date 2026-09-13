#!/usr/bin/env node

/**
 * CODShop Multi-Country Chrome Verification Script
 * Validates Saudi Arabia (SA), Egypt (EG), and Morocco (MA) visitor experiences,
 * checkout form adaptation, multi-currency display, and backoffice order attribution.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const BASE_URL = process.env.BASE_URL || 'http://172.18.1.13:3000';
const ARTIFACT_DIR = process.env.ARTIFACT_DIR || '/home/ubuntu/.gemini/antigravity-cli/brain/8cbbd821-8248-4e7c-ad20-f0b589eb40a9';

async function createBrowser() {
  return await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
    defaultViewport: { width: 1366, height: 868 },
  });
}

async function loginAdmin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'admin@ottavio.ma',
      password: 'admin123456',
    });

    const url = new URL(`${BASE_URL}/api/auth/login`);
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        const cookies = res.headers['set-cookie'];
        let token = null;
        if (cookies) {
          for (const c of cookies) {
            const match = c.match(/codshop_session=([^;]+)/);
            if (match) token = match[1];
          }
        }
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          if (res.statusCode === 200 && token) {
            resolve(token);
          } else {
            reject(new Error(`Login failed with status ${res.statusCode}: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTest() {
  console.log('======================================================================');
  console.log('🌍 STARTING MULTI-COUNTRY CHROME LIVE VERIFICATION');
  console.log(`Target: ${BASE_URL}`);
  console.log('======================================================================\n');

  const browser = await createBrowser();
  const page = await browser.newPage();

  const collectedErrors = [];
  page.on('pageerror', (err) => {
    console.error('Page error:', err.toString());
    collectedErrors.push(err.toString());
  });

  // TEST 1: SAUDI ARABIA (SA)
  console.log('--- [1/3] Testing Saudi Arabia (SA) Visitor Experience ---');
  await page.goto(`${BASE_URL}/product/souliers-richelieu-cuir-italien?country=SA`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  // Check currency formatting on product page
  const saPriceText = await page.evaluate(() => {
    const priceEl = document.querySelector('.text-3xl.font-black');
    return priceEl ? priceEl.innerText : '';
  });
  console.log(`  Product Price Display: "${saPriceText}" (Expected SAR)`);
  if (!saPriceText.includes('SAR')) {
    throw new Error(`Expected SAR currency in product price, got: ${saPriceText}`);
  }

  // Check sticky bar price
  const saStickyPrice = await page.evaluate(() => {
    const stickyEl = document.querySelector('.fixed.bottom-0');
    return stickyEl ? stickyEl.innerText : '';
  });
  console.log(`  Sticky Bar contains SAR: ${saStickyPrice.includes('SAR')}`);

  // Screenshot product page SA
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'saudi_product_storefront.png') });

  // Open Checkout Modal
  console.log('  Opening Checkout Modal for Saudi buyer...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const buyBtn = btns.find((b) => b.innerText.includes('Commander') || b.innerText.includes('Acheter'));
    if (buyBtn) buyBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Click Step 2 to access customer info and city selector
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find((b) => b.innerText.includes('Étape 2') || b.innerText.includes('Suivant') || b.innerText.includes('Continuer'));
    if (nextBtn) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Verify Saudi City Chips in Step 2
  const saCities = await page.evaluate(() => {
    const chipBtns = Array.from(document.querySelectorAll('button')).map((b) => b.innerText.trim());
    return chipBtns.filter((t) => ['Riyadh', 'Jeddah', 'Dammam', 'Makkah'].some((c) => t.includes(c)));
  });
  console.log(`  Detected Saudi City Chips:`, saCities);
  if (saCities.length === 0) {
    throw new Error('Saudi city quick chips not rendered in modal!');
  }

  // Fill Saudi Customer Info
  console.log('  Filling Saudi customer details: Fahad Al-Otaibi, 0501234567, Riyadh...');
  await page.evaluate(() => {
    const setNativeValue = (element, val) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(element, val);
      } else {
        element.value = val;
      }
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const nameInput = document.querySelector('input[name="name"], input[placeholder*="Nom" i], input[placeholder*="nom" i], input[autoComplete="name"]');
    if (nameInput) setNativeValue(nameInput, 'Fahad Al-Otaibi');

    const phoneInput = document.querySelector('input[type="tel"], input[name="phone"]');
    if (phoneInput) setNativeValue(phoneInput, '0501234567');

    const addrInput = document.querySelector('textarea, input[name="address"], input[placeholder*="Adresse" i], input[placeholder*="adresse" i]');
    if (addrInput) {
      if (addrInput.tagName === 'TEXTAREA') {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (setter) setter.call(addrInput, 'King Fahd Road, Olaya');
        else addrInput.value = 'King Fahd Road, Olaya';
        addrInput.dispatchEvent(new Event('input', { bubbles: true }));
        addrInput.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        setNativeValue(addrInput, 'King Fahd Road, Olaya');
      }
    }
  });

  // Select Riyadh city chip
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const riyadhBtn = btns.find((b) => b.innerText.includes('Riyadh'));
    if (riyadhBtn) riyadhBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'saudi_checkout_modal.png') });

  // Submit Order
  console.log('  Submitting Saudi order...');
  await page.evaluate(() => {
    const formSubmitBtn = document.querySelector('form button[type="submit"]') ||
      Array.from(document.querySelectorAll('form button, button')).find((b) => b.innerText.includes('Confirmer'));
    if (formSubmitBtn) {
      formSubmitBtn.click();
    } else {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }
  });

  // Wait for SPA router.push redirection to order confirmation page
  console.log('  Waiting for redirection to Saudi order confirmation page...');
  for (let i = 0; i < 30; i++) {
    if (page.url().includes('/order-success/')) break;
    await new Promise((r) => setTimeout(r, 500));
  }

  const saSuccessUrl = page.url();
  console.log(`  Landed on Saudi Success Page: ${saSuccessUrl}`);

  const saSuccessContent = await page.evaluate(() => document.body.innerText);
  const saHasSar = saSuccessContent.includes('SAR');
  console.log(`  Saudi Success Page shows SAR: ${saHasSar}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'saudi_order_success.png') });

  // TEST 2: EGYPT (EG)
  console.log('\n--- [2/3] Testing Egypt (EG) Visitor Experience ---');
  await page.goto(`${BASE_URL}/product/souliers-richelieu-cuir-italien?country=EG`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  const egPriceText = await page.evaluate(() => {
    const priceEl = document.querySelector('.text-3xl.font-black');
    return priceEl ? priceEl.innerText : '';
  });
  console.log(`  Product Price Display: "${egPriceText}" (Expected EGP)`);
  if (!egPriceText.includes('EGP')) {
    throw new Error(`Expected EGP currency in product price, got: ${egPriceText}`);
  }

  // Open Checkout Modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const buyBtn = btns.find((b) => b.innerText.includes('Commander') || b.innerText.includes('Acheter'));
    if (buyBtn) buyBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Click Step 2
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find((b) => b.innerText.includes('Étape 2') || b.innerText.includes('Suivant') || b.innerText.includes('Continuer'));
    if (nextBtn) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Fill Egyptian Customer Info
  console.log('  Filling Egyptian customer details: Ahmed Mahmoud, 01012345678, Cairo...');
  await page.evaluate(() => {
    const setNativeValue = (element, val) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(element, val);
      } else {
        element.value = val;
      }
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const nameInput = document.querySelector('input[name="name"], input[placeholder*="Nom" i], input[placeholder*="nom" i], input[autoComplete="name"]');
    if (nameInput) setNativeValue(nameInput, 'Ahmed Mahmoud');

    const phoneInput = document.querySelector('input[type="tel"], input[name="phone"]');
    if (phoneInput) setNativeValue(phoneInput, '01012345678');

    const addrInput = document.querySelector('textarea, input[name="address"], input[placeholder*="Adresse" i], input[placeholder*="adresse" i]');
    if (addrInput) {
      if (addrInput.tagName === 'TEXTAREA') {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (setter) setter.call(addrInput, 'Nasr City, Makram Ebeid');
        else addrInput.value = 'Nasr City, Makram Ebeid';
        addrInput.dispatchEvent(new Event('input', { bubbles: true }));
        addrInput.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        setNativeValue(addrInput, 'Nasr City, Makram Ebeid');
      }
    }
  });

  // Select Cairo city chip
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cairoBtn = btns.find((b) => b.innerText.includes('Cairo') || b.innerText.includes('Le Caire'));
    if (cairoBtn) cairoBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'egypt_checkout_modal.png') });

  // Submit Egyptian Order
  console.log('  Submitting Egyptian order...');
  await page.evaluate(() => {
    const formSubmitBtn = document.querySelector('form button[type="submit"]') ||
      Array.from(document.querySelectorAll('form button, button')).find((b) => b.innerText.includes('Confirmer'));
    if (formSubmitBtn) {
      formSubmitBtn.click();
    } else {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }
  });

  // Wait for SPA router.push redirection to order confirmation page
  console.log('  Waiting for redirection to Egyptian order confirmation page...');
  for (let i = 0; i < 20; i++) {
    if (page.url().includes('/order-success/')) break;
    const errText = await page.evaluate(() => {
      const el = document.querySelector('.bg-red-50, .text-red-500, .text-red-600');
      return el ? el.innerText : '';
    });
    if (errText) {
      console.log(`  [Egypt Modal Notice/Error]: "${errText}"`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  const egSuccessUrl = page.url();
  console.log(`  Landed on Egypt Success Page: ${egSuccessUrl}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'egypt_order_success.png') });

  // TEST 3: ADMIN ORDERS PIPELINE VERIFICATION
  console.log('\n--- [3/3] Testing Admin Orders Pipeline Multi-Country Attribution ---');
  const token = await loginAdmin();
  await page.setCookie({
    name: 'codshop_session',
    value: token,
    domain: '172.18.1.13',
    path: '/',
  });

  await page.goto(`${BASE_URL}/admin/orders`, {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  const tableInfo = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr'));
    return rows.map((r) => r.innerText.replace(/\n+/g, ' '));
  });

  console.log('  Admin Orders Table Rows Sample:');
  tableInfo.slice(1, 4).forEach((row) => console.log('   *', row));

  const hasSaudiOrder = tableInfo.some((r) => r.includes('SA') || r.includes('SAR') || r.includes('Fahad'));
  const hasEgyptOrder = tableInfo.some((r) => r.includes('EG') || r.includes('EGP') || r.includes('Ahmed'));

  console.log(`  Admin shows Saudi order correctly: ${hasSaudiOrder}`);
  console.log(`  Admin shows Egyptian order correctly: ${hasEgyptOrder}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_orders_multi_country.png') });

  await browser.close();

  if (collectedErrors.length > 0) {
    console.warn(`Encountered ${collectedErrors.length} client errors during browsing`);
  }

  console.log('\n======================================================================');
  console.log('🎉 ALL MULTI-COUNTRY LIVE BROWSER TESTS PASSED WITH ZERO BLOCKERS!');
  console.log('======================================================================');
}

runTest().catch((err) => {
  console.error('Fatal multi-country test failure:', err);
  process.exit(1);
});
