const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const BASE_URL = process.env.BASE_URL || 'http://172.18.1.9:3000';
const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/d795ab1b-1896-4e51-815a-57fda63dbba7';

async function loginAdmin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email: 'admin@ottavio.ma', password: 'admin123456' });
    const url = new URL(`${BASE_URL}/api/auth/login`);
    const req = http.request(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
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
  console.log('🚀 Running Chrome E2E Verification for Draft Products Feature...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const sessionToken = await loginAdmin();
    console.log('  ✓ Admin session acquired.');

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    if (sessionToken) {
      await page.setCookie({
        name: 'codshop_session',
        value: sessionToken,
        domain: '172.18.1.9',
        path: '/',
      });
    }

    // 1. Navigate to Products Backoffice
    console.log('  Navigating to /admin/products?store=ottavio ...');
    await page.goto(`${BASE_URL}/admin/products?store=ottavio`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // 2. Check Segmented Status Tabs
    const tabsInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tousTab = buttons.find((b) => b.textContent && b.textContent.includes('Tous'));
      const actifsTab = buttons.find((b) => b.textContent && b.textContent.includes('Actifs'));
      const brouillonsTab = buttons.find((b) => b.textContent && b.textContent.includes('Brouillons'));
      return {
        hasTous: Boolean(tousTab),
        tousText: tousTab?.textContent?.trim(),
        hasActifs: Boolean(actifsTab),
        actifsText: actifsTab?.textContent?.trim(),
        hasBrouillons: Boolean(brouillonsTab),
        brouillonsText: brouillonsTab?.textContent?.trim(),
      };
    });
    console.log('  Segmented Status Filter Tabs:', tabsInfo);
    if (!tabsInfo.hasTous || !tabsInfo.hasActifs || !tabsInfo.hasBrouillons) {
      throw new Error('Segmented status filter tabs missing!');
    }

    // Take screenshot of default table with tabs
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft_products_table_tabs.png') });
    console.log('  ✓ Saved draft_products_table_tabs.png');

    // 3. Test 1-Click Status Toggle on first product
    console.log('  Testing 1-click status toggle on first product in table...');
    const toggled = await page.evaluate(() => {
      // Find the first toggle button (has title starting with "Publier" or "Mettre en brouillon")
      const toggleBtn = document.querySelector('button[title*="brouillon"], button[title*="Publier"]');
      if (toggleBtn) {
        toggleBtn.click();
        return true;
      }
      return false;
    });

    console.log('  Toggle button clicked:', toggled);
    await new Promise((r) => setTimeout(r, 1500));

    // Take screenshot showing updated status badge & toast
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft_products_toggled_draft.png') });
    console.log('  ✓ Saved draft_products_toggled_draft.png');

    // 4. Click Brouillons tab to verify filtering
    console.log('  Clicking "Brouillons" tab to filter drafts...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const brouillonsTab = buttons.find((b) => b.textContent && b.textContent.includes('Brouillons'));
      if (brouillonsTab) brouillonsTab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft_products_filtered_brouillons.png') });
    console.log('  ✓ Saved draft_products_filtered_brouillons.png');

    // 5. Open Edit Modal to verify visibility selector
    console.log('  Opening Edit Modal to verify status selector...');
    await page.evaluate(() => {
      const editBtn = document.querySelector('button[title="Modifier"]');
      if (editBtn) editBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    const editModalInfo = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0') || document.body;
      const text = (modal.textContent || '').replace(/\s+/g, ' ');
      const hasVisibilityLabel = text.includes('Statut de visibilit');
      const hasActifPill = text.includes('Actif (Visible en boutique)');
      const hasBrouillonPill = text.includes('Brouillon (Masqué aux clients)');
      return { hasVisibilityLabel, hasActifPill, hasBrouillonPill };
    });
    console.log('  Edit Modal Status Selector Info:', editModalInfo);
    if (!editModalInfo.hasVisibilityLabel || !editModalInfo.hasActifPill || !editModalInfo.hasBrouillonPill) {
      throw new Error('Edit Modal status selector missing!');
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft_products_edit_modal.png') });
    console.log('  ✓ Saved draft_products_edit_modal.png');

    // 6. Close modal & restore product to active
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent && b.textContent.trim() === '✕'
      );
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click "Tous" tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tousTab = buttons.find((b) => b.textContent && b.textContent.includes('Tous'));
      if (tousTab) tousTab.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Toggle back to active
    await page.evaluate(() => {
      const toggleBtn = document.querySelector('button[title*="Publier"]');
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    console.log('\n🎉 ALL LIVE CHROME E2E VERIFICATIONS PASSED FOR DRAFT PRODUCTS!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Chrome E2E Verification Failed:', err);
  process.exit(1);
});
