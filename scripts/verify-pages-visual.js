const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const http = require('http');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const BASE_URL = 'http://localhost:3005';
const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/0a6a6559-13c0-47c2-a243-d6fce6e96030';

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
        resolve(token);
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('🚀 Launching Chromium for Custom Pages & Legal Policies Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // ── 1. Storefront Shipping Policy Page ──────────────────────────
    console.log('1. Auditing Storefront /p/shipping-policy...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${BASE_URL}/p/shipping-policy?store=ottavio`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    const storefrontPath = path.join(ARTIFACT_DIR, 'storefront_shipping_policy.png');
    await page.screenshot({ path: storefrontPath, fullPage: false });
    console.log(`  ✓ Saved storefront shipping policy screenshot: ${storefrontPath}`);

    // ── 2. Admin Backoffice /admin/pages ───────────────────────────
    console.log('2. Auditing Admin Backoffice /admin/pages...');
    const token = await loginAdmin();
    if (token) {
      await page.setCookie({
        name: 'codshop_session',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
      });
    }

    await page.goto(`${BASE_URL}/admin/pages?store=ottavio`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    const adminPagesPath = path.join(ARTIFACT_DIR, 'admin_pages_management.png');
    await page.screenshot({ path: adminPagesPath, fullPage: false });
    console.log(`  ✓ Saved admin pages management screenshot: ${adminPagesPath}`);

    // ── 3. Admin Menus Builder (/admin/menus) with Footer Policy Helper
    console.log('3. Auditing Admin Menus Builder /admin/menus with Footer Column...');
    await page.goto(`${BASE_URL}/admin/menus?store=ottavio`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Click on Footer Col 1
    const footerButtons = await page.$$('button');
    for (const btn of footerButtons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (text && text.includes('Pied de page — Col. 1')) {
        await btn.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 800));

    const adminMenusFooterPath = path.join(ARTIFACT_DIR, 'admin_menus_footer_helper.png');
    await page.screenshot({ path: adminMenusFooterPath, fullPage: false });
    console.log(`  ✓ Saved admin menus footer helper screenshot: ${adminMenusFooterPath}`);

    console.log('🎉 ALL VISUAL AUDIT SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
