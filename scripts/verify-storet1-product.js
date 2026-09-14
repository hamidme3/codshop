const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/73adac37-1107-4bc8-9378-0dd738f3b3e1';

async function run() {
  console.log('🚀 Starting Puppeteer Chromium verification for storet1 SKU-5567...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--window-size=1280,800',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 1. Visit Storefront Home
  console.log('1. Navigating to https://storet1.codshop.vipone.site/ ...');
  await page.goto('https://storet1.codshop.vipone.site/', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForTimeout ? page.waitForTimeout(2000) : new Promise(r => setTimeout(r, 2000));

  const homeHtml = await page.content();
  const hasTestProductHome = homeHtml.includes('Test product') || homeHtml.includes('SKU-5567') || homeHtml.includes('299');
  console.log(`  ✓ Storefront Home loaded. Has "Test product": ${hasTestProductHome}`);

  const homeScreenshot = path.join(ARTIFACT_DIR, 'storet1_storefront_home.png');
  await page.screenshot({ path: homeScreenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${homeScreenshot}`);

  // 2. Visit Product Detail Page
  console.log('2. Navigating to https://storet1.codshop.vipone.site/product/sku-5567 ...');
  await page.goto('https://storet1.codshop.vipone.site/product/sku-5567', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const prodHtml = await page.content();
  const hasTitle = prodHtml.includes('Test product');
  const hasSku = prodHtml.includes('SKU-5567');
  const hasPrice = prodHtml.includes('299');
  console.log(`  ✓ Product Page loaded. Has title "Test product": ${hasTitle}, SKU: ${hasSku}, Price: ${hasPrice}`);

  const prodScreenshot = path.join(ARTIFACT_DIR, 'storet1_product_page.png');
  await page.screenshot({ path: prodScreenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${prodScreenshot}`);

  // 3. Visit Catalog Page
  console.log('3. Navigating to https://storet1.codshop.vipone.site/catalog ...');
  await page.goto('https://storet1.codshop.vipone.site/catalog', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const catHtml = await page.content();
  const hasCatalogProduct = catHtml.includes('Test product') || catHtml.includes('SKU-5567');
  console.log(`  ✓ Catalog Page loaded. Has "Test product": ${hasCatalogProduct}`);

  const catScreenshot = path.join(ARTIFACT_DIR, 'storet1_catalog_page.png');
  await page.screenshot({ path: catScreenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${catScreenshot}`);

  await browser.close();
  console.log('🎉 Verification complete!');
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
