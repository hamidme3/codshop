import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  console.log('Navigating to https://storet1.codshop.vipone.site/product/sku-5567...');
  await page.goto('https://storet1.codshop.vipone.site/product/sku-5567', { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForTimeout(2500);

  const title = await page.title();
  console.log('Page Title:', title);

  const images = await page.$$eval('img', (imgs) => imgs.map((img) => img.src));
  console.log('Total Image tags on page:', images.length);
  images.forEach((src, idx) => console.log(`  [${idx}] ${src}`));

  const mainImageSrc = await page.$eval('div.aspect-square img', (img) => img.src).catch(() => 'not found');
  console.log('Main Display Image:', mainImageSrc);

  const thumbnails = await page.$$eval('button img', (imgs) => imgs.map((i) => i.src));
  console.log('Thumbnail Count:', thumbnails.length);
  thumbnails.forEach((t, i) => console.log(`  Thumb [${i}]: ${t}`));

  const screenshotPath = '/home/ubuntu/.gemini/antigravity-cli/brain/abfe329b-12e7-4c34-a9b4-7ca23ea3fac7/storet1_sku5567_live.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
}

main().catch(console.error);
