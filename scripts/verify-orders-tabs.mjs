import { chromium } from '@playwright/test';

async function verifyOrdersTabs() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile viewport matching user's phone screenshot
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
  const ensureLightMode = async () => {
    await page.evaluate(() => {
      localStorage.setItem('codshop_admin_theme', 'light');
      document.documentElement.setAttribute('data-admin-theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    });
    await page.waitForTimeout(400);
  };

  console.log('2. Navigating to orders...');
  await page.goto('https://codshop.vipone.site/admin/orders?store=storet1', { waitUntil: 'networkidle' });
  await ensureLightMode();

  console.log('3. Clicking Livrées tab...');
  const livreesTab = await page.$('button:has-text("Livrées")');
  if (livreesTab) {
    await livreesTab.scrollIntoViewIfNeeded();
    await livreesTab.click();
    await page.waitForTimeout(600);
  } else {
    console.warn('Livrées tab not found');
  }

  const screenshotPath = `${artifactDir}/orders_tab_livrees_fixed.png`;
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved orders_tab_livrees_fixed.png:', screenshotPath);

  await browser.close();
}

verifyOrdersTabs().catch(console.error);
