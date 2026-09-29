const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const BASE_URL = process.env.BASE_URL || 'http://172.18.1.9:3000';
const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/d795ab1b-1896-4e51-815a-57fda63dbba7';

async function run() {
  console.log('🚀 Investigating client-side exception on storet1.codshop.vipone.site ...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--ignore-certificate-errors'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleLogs = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
      console.log(`[Browser Console ${msg.type()}]:`, msg.text());
    });

    page.on('pageerror', (err) => {
      pageErrors.push(err.toString());
      console.error('[Browser PageError]:', err);
    });

    console.log('Navigating to https://storet1.codshop.vipone.site ...');
    const response = await page.goto('https://storet1.codshop.vipone.site', { waitUntil: 'networkidle2' });
    console.log('Response status:', response ? response.status() : 'no response');

    await new Promise((r) => setTimeout(r, 2000));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'storet1_client_error.png') });
    console.log('Screenshot saved to storet1_client_error.png');

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Body Text snippet:', bodyText.substring(0, 300));

    console.log('\n--- SUMMARY ---');
    console.log('Page Errors:', pageErrors);
    console.log('Console Errors:', consoleLogs.filter((l) => l.type === 'error'));
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
