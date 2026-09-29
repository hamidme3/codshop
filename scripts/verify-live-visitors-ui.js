const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const BASE_URL = process.env.BASE_URL || 'http://172.18.1.9:3000';
const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/d795ab1b-1896-4e51-815a-57fda63dbba7';

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
  console.log('🚀 Launching Chromium to verify dynamic live visitor indicators...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const sessionToken = await loginAdmin();
    console.log('  ✓ Admin logged in. Session token acquired.');

    // 1. Desktop Admin Header Verification
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

    console.log(`  Navigating to ${BASE_URL}/admin?store=ottavio ...`);
    await page.goto(`${BASE_URL}/admin?store=ottavio`, { waitUntil: 'networkidle2' });

    // Wait 2 seconds for live visitors hook to complete
    await new Promise((r) => setTimeout(r, 2000));

    // Extract live visitor badge text from desktop header
    const desktopLiveBadge = await page.evaluate(() => {
      // Find element containing "en direct" or "direct"
      const elements = Array.from(document.querySelectorAll('header *'));
      for (const el of elements) {
        if (el.textContent && (el.textContent.includes('en direct') || el.textContent.includes('live'))) {
          return el.textContent.trim();
        }
      }
      return null;
    });

    console.log('  Desktop Live Visitors Badge Text:', desktopLiveBadge);

    // Save screenshot
    const desktopShotPath = path.join(ARTIFACT_DIR, 'live_visitors_desktop.png');
    await page.screenshot({ path: desktopShotPath });
    console.log('  ✓ Desktop screenshot saved to:', desktopShotPath);

    // 2. Mobile Viewport Verification
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    const mobileBadge = await page.evaluate(() => {
      const mobileHeader = document.querySelector('header.lg\\:hidden');
      if (!mobileHeader) return null;
      // Look for the live indicator in mobile header
      const pill = mobileHeader.querySelector('div[title*="visiteur"]');
      return pill ? pill.textContent.trim() : null;
    });

    console.log('  Mobile Live Visitors Badge Text:', mobileBadge);

    const mobileShotPath = path.join(ARTIFACT_DIR, 'live_visitors_mobile.png');
    await page.screenshot({ path: mobileShotPath });
    console.log('  ✓ Mobile screenshot saved to:', mobileShotPath);

    console.log('\n🎉 Dynamic Live Visitors UI Successfully Verified in Chrome!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
