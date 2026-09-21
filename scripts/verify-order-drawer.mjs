import { chromium } from '@playwright/test';

async function verifyOrderDrawer() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const artifactDir = '/home/ubuntu/.gemini/antigravity-cli/brain/abfe329b-12e7-4c34-a9b4-7ca23ea3fac7';

  console.log('1. Logging in to admin...');
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

  // Ensure light mode
  await page.evaluate(() => {
    localStorage.setItem('codshop_admin_theme', 'light');
    document.documentElement.setAttribute('data-admin-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  });

  console.log('2. Navigating to orders...');
  await page.goto('https://codshop.vipone.site/admin/orders?store=storet1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Click on the order number button (e.g. CMD-5339 or any CMD-)
  console.log('3. Clicking order number to open drawer...');
  const cmdBtn = await page.$('button:has-text("CMD-")');
  if (cmdBtn) {
    await cmdBtn.scrollIntoViewIfNeeded();
    await cmdBtn.click();
    await page.waitForTimeout(800);
  } else {
    console.error('CMD- button not found');
  }

  // Click the status dropdown trigger
  console.log('4. Clicking status dropdown trigger...');
  const statusTrigger = await page.$('button:has-text("Nouvelle"), button:has-text("Confirmée"), button:has-text("À Confirmer"), button:has-text("Expédiée")');
  if (statusTrigger) {
    await statusTrigger.scrollIntoViewIfNeeded();
    await statusTrigger.click();
    await page.waitForTimeout(600);
  } else {
    console.error('Status trigger not found');
  }

  const screenshotPath = `${artifactDir}/fixed_orders_drawer_status_dropdown.png`;
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved fixed_orders_drawer_status_dropdown.png:', screenshotPath);

  await browser.close();
}

verifyOrderDrawer().catch(console.error);
