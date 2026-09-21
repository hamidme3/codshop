import { chromium } from '@playwright/test';

async function verifyLightMode() {
  const browser = await chromium.launch({ headless: true });
  // Mobile viewport matching user's phone screenshot
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log('Logging in to admin...');
  await page.goto('https://codshop.vipone.site/admin/login', { waitUntil: 'networkidle' });
  const fillDemoBtn = await page.$('button:has-text("Fill Demo Account")');
  if (fillDemoBtn) {
    await fillDemoBtn.click();
    await page.waitForTimeout(400);
  }
  const signInBtn = await page.$('button:has-text("Sign In to Dashboard")');
  if (signInBtn) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
      signInBtn.click(),
    ]);
  }

  // Force light mode in localStorage and DOM
  await page.evaluate(() => {
    localStorage.setItem('codshop_admin_theme', 'light');
    document.documentElement.setAttribute('data-admin-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  });

  console.log('Navigating to products in light mode...');
  await page.goto('https://codshop.vipone.site/admin/products?store=storet1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Re-verify light mode is active on html
  await page.evaluate(() => {
    localStorage.setItem('codshop_admin_theme', 'light');
    document.documentElement.setAttribute('data-admin-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  await page.waitForTimeout(500);

  const prodScreenshot = '/home/ubuntu/.gemini/antigravity-cli/brain/abfe329b-12e7-4c34-a9b4-7ca23ea3fac7/admin_products_mobile_light.png';
  await page.screenshot({ path: prodScreenshot, fullPage: false });
  console.log('Saved products mobile screenshot:', prodScreenshot);

  console.log('Navigating to orders in light mode...');
  await page.goto('https://codshop.vipone.site/admin/orders?store=storet1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const ordersScreenshot = '/home/ubuntu/.gemini/antigravity-cli/brain/abfe329b-12e7-4c34-a9b4-7ca23ea3fac7/admin_orders_mobile_light.png';
  await page.screenshot({ path: ordersScreenshot, fullPage: false });
  console.log('Saved orders mobile screenshot:', ordersScreenshot);

  await browser.close();
}

verifyLightMode().catch(console.error);
