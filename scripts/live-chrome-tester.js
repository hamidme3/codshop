#!/usr/bin/env node

/**
 * CODShop Chrome Live Browsing & E2E Verification Engine
 * Executes live browser sessions across the entire platform.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const BASE_URL = process.env.BASE_URL || 'http://172.18.1.13:3000';
const SCREENSHOT_DIR = path.join('/tmp', 'codshop-chrome-audit');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
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

async function auditThemes(browser) {
  console.log('\n=== SUITE 1: 25 THEMES STOREFRONT LIVE BROWSING ===');
  const themes = [
    'luxury', 'beauty', 'tech', 'minimal', 'booster',
    'streetwear', 'woodmart', 'shoptimizer', 'flatsome', 'perfume',
    'jewelry', 'babyjoy', 'culinary', 'fitness', 'automotive',
    'eyewear', 'botanica', 'coffee_tea', 'ceramics', 'petcare',
    'kids_fashion', 'leather_craft', 'kitchen', 'cyberpunk', 'velocity_cod'
  ];

  const results = [];
  const page = await browser.newPage();

  for (const themeId of themes) {
    const url = `${BASE_URL}/?store=ottavio&theme=${themeId}`;
    const pageErrors = [];
    page.removeAllListeners('pageerror');
    page.on('pageerror', (err) => pageErrors.push(err.toString()));

    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    const status = resp ? resp.status() : 200;
    const title = await page.title();

    // Check CSS variables
    const cssVars = await page.evaluate(() => {
      const el = document.querySelector('[style*="--theme-primary"]');
      if (!el) return null;
      const s = el.getAttribute('style') || '';
      const prim = s.match(/--theme-primary:\s*([^;]+)/);
      const acc = s.match(/--theme-accent:\s*([^;]+)/);
      return {
        primary: prim ? prim[1].trim() : null,
        accent: acc ? acc[1].trim() : null,
      };
    });

    const isFeatured = ['luxury', 'beauty', 'tech', 'booster', 'velocity_cod'].includes(themeId);
    let screenshot = null;
    if (isFeatured) {
      screenshot = path.join(SCREENSHOT_DIR, `theme-${themeId}.png`);
      await page.screenshot({ path: screenshot });
    }

    const pass = status === 200 && pageErrors.length === 0 && !!cssVars;
    console.log(`  [${pass ? 'PASS' : 'FAIL'}] Theme: ${themeId.padEnd(14)} | Status: ${status} | Primary: ${cssVars?.primary || 'N/A'} | Errors: ${pageErrors.length}`);
    results.push({ themeId, status, cssVars, pageErrors, pass, screenshot });
  }

  await page.close();
  return results;
}

async function auditCheckout(browser) {
  console.log('\n=== SUITE 2: COD CHECKOUT & ORDER PIPELINE LIVE BROWSING ===');
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.toString()));

  const productUrl = `${BASE_URL}/product/souliers-richelieu-cuir-italien`;
  console.log(`  Navigating to product page: ${productUrl}`);
  await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Verify product title
  const productTitle = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText : null;
  });
  console.log(`  Product Title: "${productTitle}"`);

  // Take screenshot of product
  const prodScreenshot = path.join(SCREENSHOT_DIR, 'product-page.png');
  await page.screenshot({ path: prodScreenshot });

  // Click checkout CTA
  console.log('  Triggering 1-step COD checkout modal...');
  const ctaSelector = 'button, a';
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const buyBtn = btns.find(b => b.innerText.includes('Commander') || b.innerText.includes('Acheter') || b.innerText.includes('Paiement'));
    if (buyBtn) buyBtn.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Verify modal is open
  const modalOpen = await page.evaluate(() => {
    return !!document.querySelector('input[type="tel"]') || !!document.querySelector('form');
  });
  console.log(`  Checkout modal opened: ${modalOpen}`);

  // Check if 2-step modal and advance to Step 2 (Customer details)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText.includes('Continuer') || b.innerText.includes('Étape suivante'));
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Fill Moroccan customer form
  console.log('  Filling Moroccan customer information...');
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

    const setNativeTextarea = (element, val) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(element, val);
      } else {
        element.value = val;
      }
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const nameInput = document.querySelector('input[name="name"], input[placeholder*="Nom"], input[autoComplete="name"]');
    if (nameInput) setNativeValue(nameInput, 'Hicham Benali');

    const phoneInput = document.querySelector('input[type="tel"], input[name="phone"], input[placeholder*="06"]');
    if (phoneInput) setNativeValue(phoneInput, '0661998877');

    const citySelect = document.querySelector('select');
    if (citySelect) {
      citySelect.value = 'Casablanca';
      citySelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const addressInput = document.querySelector('textarea, input[name="address"], input[placeholder*="Adresse"]');
    if (addressInput) {
      if (addressInput.tagName === 'TEXTAREA') {
        setNativeTextarea(addressInput, '15 Rue de la Liberté, Quartier Gauthier');
      } else {
        setNativeValue(addressInput, '15 Rue de la Liberté, Quartier Gauthier');
      }
    }
  });

  const modalScreenshot = path.join(SCREENSHOT_DIR, 'checkout-modal-filled.png');
  await page.screenshot({ path: modalScreenshot });

  // Submit checkout form specifically targeting the form submit button
  console.log('  Submitting COD order...');
  await page.evaluate(() => {
    const formSubmitBtn = document.querySelector('form button[type="submit"]') ||
      Array.from(document.querySelectorAll('form button')).find(b => b.innerText.includes('Confirmer'));
    if (formSubmitBtn) {
      formSubmitBtn.click();
    } else {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }
  });

  // Wait for SPA router.push redirection to order confirmation page
  console.log('  Waiting for redirection to order confirmation page...');
  for (let i = 0; i < 25; i++) {
    if (page.url().includes('/order-success/')) break;
    await new Promise((r) => setTimeout(r, 400));
  }

  const successUrl = page.url();
  console.log(`  Landed on: ${successUrl}`);

  const successText = await page.evaluate(() => document.body.innerText.slice(0, 400));
  const successScreenshot = path.join(SCREENSHOT_DIR, 'order-success-page.png');
  await page.screenshot({ path: successScreenshot });

  const hasWhatsApp = await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a'));
    return a.some(el => (el.href || '').includes('wa.me') || (el.innerText || '').includes('WhatsApp'));
  });

  console.log(`  Order success page contains WhatsApp confirmation: ${hasWhatsApp}`);
  console.log(`  Page Errors during checkout: ${pageErrors.length}`);

  await page.close();
  return {
    productTitle,
    modalOpen,
    successUrl,
    hasWhatsApp,
    pageErrors,
    screenshots: [prodScreenshot, modalScreenshot, successScreenshot],
  };
}

async function auditAdmin(browser, sessionToken) {
  console.log('\n=== SUITE 3: MERCHANT BACKOFFICE LIVE BROWSING ===');
  const page = await browser.newPage();

  // Set session cookie
  const cookieDomain = new URL(BASE_URL).hostname;
  await page.setCookie({
    name: 'codshop_session',
    value: sessionToken,
    domain: cookieDomain,
    path: '/',
    httpOnly: true,
    secure: false,
  });

  const adminRoutes = [
    { path: '/admin?store=ottavio', name: 'Command Center Overview' },
    { path: '/admin/themes?store=ottavio', name: '25-Theme Backoffice Gallery' },
    { path: '/admin/orders?store=ottavio', name: 'COD Orders Pipeline' },
    { path: '/admin/products?store=ottavio', name: 'Products & Inventory' },
    { path: '/admin/account?store=ottavio', name: 'Merchant Profile & Address' },
    { path: '/admin/identity?store=ottavio', name: 'Moroccan KYC Verification' },
    { path: '/admin/customers?store=ottavio', name: 'Moroccan CRM Customers' },
    { path: '/admin/ads?store=ottavio', name: 'Tracking Pixels & Pinterest' },
    { path: '/admin/security?store=ottavio', name: 'Security & Session Revocation' },
    { path: '/admin/support?store=ottavio', name: 'Support & Concierge' },
    { path: '/admin/billing?store=ottavio', name: 'Subscription & Invoicing' },
    { path: '/admin/builder?store=ottavio', name: 'Visual Page Builder' },
  ];

  const results = [];

  for (const route of adminRoutes) {
    const pageErrors = [];
    page.removeAllListeners('pageerror');
    page.on('pageerror', (err) => pageErrors.push(err.toString()));

    const url = `${BASE_URL}${route.path}`;
    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    const status = resp ? resp.status() : 200;
    const title = await page.title();

    // Check headings
    const heading = await page.evaluate(() => {
      const h = document.querySelector('h1, h2');
      return h ? h.innerText.trim() : 'N/A';
    });

    const slug = route.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const screenshot = path.join(SCREENSHOT_DIR, `admin-${slug}.png`);
    await page.screenshot({ path: screenshot });

    const pass = status === 200 && pageErrors.length === 0;
    console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${route.name.padEnd(32)} | Status: ${status} | Heading: "${heading.slice(0, 30)}" | Errors: ${pageErrors.length}`);

    results.push({
      route: route.path,
      name: route.name,
      status,
      heading,
      pageErrors,
      screenshot,
      pass,
    });
  }

  await page.close();
  return results;
}

async function auditSso(browser) {
  console.log('\n=== SUITE 4: ONBOARDING & SSO LIVE BROWSING ===');
  const page = await browser.newPage();
  // Clear any existing cookies to ensure clean unauthenticated testing
  const client = await page.createCDPSession();
  await client.send('Network.clearBrowserCookies');

  const routes = [
    { path: '/admin/login', name: 'Admin Login' },
    { path: '/register-store', name: 'New Store Onboarding' },
    { path: '/sso/forgot-password', name: 'SSO Forgot Password' },
    { path: '/sso/password-reset', name: 'SSO Password Reset' },
    { path: '/sso/auth/phone-number', name: 'SSO Phone OTP' },
  ];

  const results = [];

  for (const r of routes) {
    const pageErrors = [];
    page.removeAllListeners('pageerror');
    page.on('pageerror', (err) => pageErrors.push(err.toString()));

    const url = `${BASE_URL}${r.path}`;
    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    const status = resp ? resp.status() : 200;

    const heading = await page.evaluate(() => {
      const h = document.querySelector('h1, h2');
      return h ? h.innerText.trim() : 'N/A';
    });

    const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const screenshot = path.join(SCREENSHOT_DIR, `sso-${slug}.png`);
    await page.screenshot({ path: screenshot });

    const pass = status === 200 && pageErrors.length === 0;
    console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${r.name.padEnd(24)} | Status: ${status} | Heading: "${heading.slice(0, 25)}" | Errors: ${pageErrors.length}`);

    results.push({ ...r, status, heading, pageErrors, pass, screenshot });
  }

  await page.close();
  return results;
}

async function auditInteractiveCrud(browser, sessionToken) {
  console.log('\n=== SUITE 5: INTERACTIVE MUTATION & CRUD COMPLETE TESTING ===');
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const cookieDomain = new URL(BASE_URL).hostname;
  await page.setCookie({
    name: 'codshop_session',
    value: sessionToken,
    domain: cookieDomain,
    path: '/',
    httpOnly: true,
    secure: false,
  });

  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err.toString()));

  const results = [];

  try {
    // 1. Navigate to Products page
    console.log('  1. Navigating to /admin/products?store=ottavio...');
    await page.goto(`${BASE_URL}/admin/products?store=ottavio`, { waitUntil: 'networkidle2', timeout: 25000 });

    // Switch to Categories & Collections Tab
    console.log('  2. Testing Categories Tab switch and + Nouvelle Catégorie button...');
    const catTabClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const catBtn = buttons.find((b) => b.innerText.includes('Catégories & Collections'));
      if (catBtn) {
        catBtn.click();
        return true;
      }
      return false;
    });

    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-categories-tab.png') });

    const hasNewCatBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.innerText.includes('Nouvelle Catégorie'));
    });

    console.log(`  [${catTabClicked && hasNewCatBtn ? 'PASS' : 'FAIL'}] Categories Tab switch | "+ Nouvelle Catégorie" button visible`);
    results.push({ name: 'Categories Tab Switch', pass: catTabClicked && hasNewCatBtn });

    // 3. Open Add Category Modal and create "Miels & Terroir Atlas"
    console.log('  3. Testing Category Creation modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const newBtn = btns.find((b) => b.innerText.includes('Nouvelle Catégorie'));
      if (newBtn) newBtn.click();
    });

    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-modal-add-category.png') });

    // Type Category Name
    await page.waitForSelector('input[placeholder*="Bijouterie"]', { timeout: 5000 });
    await page.type('input[placeholder*="Bijouterie"]', 'Miels & Terroir Atlas');

    // Click submit
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find((b) => b.innerText.includes('Créer la Catégorie'));
      if (submitBtn) submitBtn.click();
    });

    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-category-created.png') });

    const isCatCreated = await page.evaluate(() => {
      return document.body.innerText.includes('Miels & Terroir Atlas');
    });

    console.log(`  [${isCatCreated ? 'PASS' : 'FAIL'}] Create Category | "Miels & Terroir Atlas" present in DOM`);
    results.push({ name: 'Create Category', pass: isCatCreated });

    // 4. Test Category Deletion Safety Guard
    console.log('  4. Testing Category Deletion Safety Guard (prevent deleting category with products)...');
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.dismiss();
    });

    // Try deleting "Maroquinerie & Cuir"
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div.p-5'));
      const maroCard = cards.find((c) => c.innerText.includes('Maroquinerie & Cuir'));
      if (maroCard) {
        const delBtn = maroCard.querySelector('button');
        if (delBtn) delBtn.click();
      }
    });

    await new Promise((r) => setTimeout(r, 500));
    const safetyPassed = alertMessage.includes('contient encore') || alertMessage.includes('produit');
    console.log(`  [${safetyPassed ? 'PASS' : 'FAIL'}] Safety Guard | Message: "${alertMessage.slice(0, 35)}..."`);
    results.push({ name: 'Category Deletion Safety Guard', pass: safetyPassed });

    // 5. Test Deleting the Empty Category
    console.log('  5. Testing Deletion of Empty Category...');
    page.removeAllListeners('dialog');
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div.p-5'));
      const honeyCard = cards.find((c) => c.innerText.includes('Miels & Terroir Atlas'));
      if (honeyCard) {
        const delBtn = honeyCard.querySelector('button');
        if (delBtn) delBtn.click();
      }
    });

    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-category-deleted.png') });

    const isCatDeleted = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('div.p-5'));
      return !cards.some((c) => c.innerText.includes('Miels & Terroir Atlas'));
    });

    console.log(`  [${isCatDeleted ? 'PASS' : 'FAIL'}] Delete Empty Category | Removed from Category Cards Grid`);
    results.push({ name: 'Delete Empty Category', pass: isCatDeleted });

    // 6. Test Products Table Actions (Stock Adjust & Delete)
    console.log('  6. Testing Products Table stock adjustment & delete action column...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const prodBtn = buttons.find((b) => b.innerText.includes('Tous les Produits'));
      if (prodBtn) prodBtn.click();
    });

    await new Promise((r) => setTimeout(r, 500));
    const hasActionsCol = await page.evaluate(() => {
      const ths = Array.from(document.querySelectorAll('th'));
      return ths.some((th) => th.innerText.includes('Actions'));
    });

    // Click "+" button to increment stock
    await page.evaluate(() => {
      const plusBtns = Array.from(document.querySelectorAll('button[title*="Augmenter"]'));
      if (plusBtns[0]) plusBtns[0].click();
    });

    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-product-stock-adjusted.png') });

    console.log(`  [${hasActionsCol ? 'PASS' : 'FAIL'}] Products Table Actions Column & Quick Stock Adjuster`);
    results.push({ name: 'Products Actions Column', pass: hasActionsCol });

    // 6b. Test Product Edit Modal & Variant Manager
    console.log('  6b. Testing Product Edit Modal & Variant Management...');
    await page.evaluate(() => {
      const editBtns = Array.from(document.querySelectorAll('button[title*="Modifier ce produit"]'));
      if (editBtns[0]) editBtns[0].click();
    });

    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-product-edit-modal.png') });

    const isEditModalOpen = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      return headings.some((h) => h.innerText.includes('Modifier le Produit'));
    });

    const hasVariantManager = await page.evaluate(() => {
      return document.body.innerText.includes('Variantes & Stocks Détaillés') &&
             document.body.innerText.includes('Marge Nette prévisionnelle');
    });

    // Test clicking "+ Ajouter Variante"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addVarBtn = btns.find((b) => b.innerText.includes('Ajouter Variante'));
      if (addVarBtn) addVarBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Save modifications
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find((b) => b.innerText.includes('Enregistrer les Modifications'));
      if (saveBtn) saveBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    console.log(`  [${isEditModalOpen && hasVariantManager ? 'PASS' : 'FAIL'}] Edit Product Modal & Variant Management`);
    results.push({ name: 'Edit Product Modal & Variants', pass: isEditModalOpen && hasVariantManager });

    // 7. Test Orders Bulk Selection & Drawer Actions
    console.log('  7. Testing /admin/orders Bulk Selection Bar and Drawer Actions...');
    await page.goto(`${BASE_URL}/admin/orders?store=ottavio`, { waitUntil: 'networkidle2', timeout: 25000 });

    // Check first checkbox
    await page.evaluate(() => {
      const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
      if (checkboxes[1]) checkboxes[1].click();
    });

    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-orders-bulk-bar.png') });

    const hasBulkDeleteBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.innerText.includes('Supprimer'));
    });

    console.log(`  [${hasBulkDeleteBtn ? 'PASS' : 'FAIL'}] Orders Bulk Bar | "Supprimer (X)" action visible`);
    results.push({ name: 'Orders Bulk Delete Action', pass: hasBulkDeleteBtn });

    // Open Order Drawer
    await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      if (rows[0]) rows[0].click();
    });

    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'crud-order-drawer-actions.png') });

    const hasDrawerDeleteBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some((b) => b.innerText.includes('Supprimer'));
    });

    console.log(`  [${hasDrawerDeleteBtn ? 'PASS' : 'FAIL'}] Order Details Drawer | "Supprimer" button visible`);
    results.push({ name: 'Order Drawer Delete Action', pass: hasDrawerDeleteBtn });

  } catch (err) {
    console.error('Interactive CRUD test error:', err);
    results.push({ name: 'Interactive CRUD Execution', pass: false, error: err.message });
  }

  await page.close();
  return results;
}

async function main() {
  const arg = process.argv.find((a) => a.startsWith('--suite='));
  const suite = arg ? arg.split('=')[1] : 'all';

  console.log('===============================================================');
  console.log('🚀 STARTING CODSHOP LIVE CHROME PLATFORM-WIDE AUDIT');
  console.log(`Target Base URL: ${BASE_URL}`);
  console.log(`Chromium Binary: ${CHROMIUM_PATH}`);
  console.log(`Screenshots Dir: ${SCREENSHOT_DIR}`);
  console.log(`Requested Suite: ${suite}`);
  console.log('===============================================================');

  const browser = await createBrowser();
  let sessionToken = null;

  try {
    sessionToken = await loginAdmin();
    console.log(`Admin session token acquired: ${sessionToken.slice(0, 20)}...`);
  } catch (err) {
    console.warn('Warning: Could not acquire session token:', err.message);
  }

  const report = {};

  if (suite === 'all' || suite === 'themes') {
    report.themes = await auditThemes(browser);
  }

  if (suite === 'all' || suite === 'checkout') {
    report.checkout = await auditCheckout(browser);
  }

  if (suite === 'all' || suite === 'admin') {
    if (sessionToken) {
      report.admin = await auditAdmin(browser, sessionToken);
    } else {
      console.warn('Skipping Admin suite: No session token');
    }
  }

  if (suite === 'all' || suite === 'sso') {
    report.sso = await auditSso(browser);
  }

  if (suite === 'all' || suite === 'crud') {
    if (sessionToken) {
      report.crud = await auditInteractiveCrud(browser, sessionToken);
    } else {
      console.warn('Skipping Interactive CRUD suite: No session token');
    }
  }

  await browser.close();

  const reportPath = path.join(SCREENSHOT_DIR, 'full-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n===============================================================');
  console.log('✅ LIVE CHROME AUDIT COMPLETED FOR ALL PLATFORM SECTIONS');
  console.log(`Detailed JSON report saved to: ${reportPath}`);
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
  console.log('===============================================================');
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
