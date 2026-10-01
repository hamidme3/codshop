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
  console.log('🚀 Launching Chromium for Visual Menu Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // ── 1. Desktop Header with Dropdowns ─────────────────────────────
    console.log('1. Auditing Desktop Header Navigation & Dropdowns...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/?store=ottavio`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.navbar-root');

    // Hover over Catalogue & Collections dropdown
    const navItems = await page.$$('nav a');
    for (const item of navItems) {
      const text = await page.evaluate((el) => el.textContent, item);
      if (text && text.includes('Catalogue')) {
        await item.hover();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 600));

    const desktopScreenshotPath = path.join(ARTIFACT_DIR, 'header_dropdown_desktop.png');
    await page.screenshot({ path: desktopScreenshotPath });
    console.log(`  ✓ Desktop header with dropdown screenshot saved to: ${desktopScreenshotPath}`);

    // ── 2. Mobile Viewport & Slide-Over Drawer ────────────────────────
    console.log('2. Auditing Mobile Menu Drawer (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/?store=ottavio`, { waitUntil: 'networkidle2' });

    // Click Hamburger Button
    const hamburger = await page.$('button[aria-label="Ouvrir le menu de navigation"]');
    if (hamburger) {
      await hamburger.click();
      await new Promise((r) => setTimeout(r, 500));

      // Click to expand accordion on first item with children
      const expandButtons = await page.$$('button[aria-label*="Développer"]');
      if (expandButtons.length > 0) {
        await expandButtons[0].click();
        await new Promise((r) => setTimeout(r, 300));
      }

      const mobileScreenshotPath = path.join(ARTIFACT_DIR, 'mobile_drawer_open.png');
      await page.screenshot({ path: mobileScreenshotPath });
      console.log(`  ✓ Mobile menu drawer screenshot saved to: ${mobileScreenshotPath}`);
    } else {
      console.warn('  ⚠️ Hamburger button not found on mobile page');
    }

    // ── 3. Admin Backoffice /admin/menus ──────────────────────────────
    console.log('3. Auditing Admin Menus Editor (/admin/menus)...');
    const token = await loginAdmin();
    if (token) {
      await page.setCookie({
        name: 'codshop_session',
        value: token,
        domain: 'localhost',
        path: '/',
      });
    }

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/admin/menus?store=ottavio`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    await new Promise((r) => setTimeout(r, 1000));

    const adminScreenshotPath = path.join(ARTIFACT_DIR, 'admin_menus_editor.png');
    await page.screenshot({ path: adminScreenshotPath });
    console.log(`  ✓ Admin menus editor screenshot saved to: ${adminScreenshotPath}`);

    console.log('\n🎉 Visual Menu Verification Completed Successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Visual verification failed:', err);
  process.exit(1);
});
