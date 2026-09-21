import { chromium } from '@playwright/test';

async function verifyOrderDrawerOpen() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const artifactDir = '/home/ubuntu/.gemini/antigravity-cli/brain/abfe329b-12e7-4c34-a9b4-7ca23ea3fac7';

  await page.goto('https://codshop.vipone.site/admin/login', { waitUntil: 'networkidle' });
  const fillDemoBtn = await page.$('button:has-text("Fill Demo Account")');
  if (fillDemoBtn) await fillDemoBtn.click();
  const signInBtn = await page.$('button:has-text("Sign In to Dashboard")');
  if (signInBtn) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
      signInBtn.click(),
    ]);
  }

  await page.goto('https://codshop.vipone.site/admin/orders?store=storet1', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('codshop_admin_theme', 'light');
    document.documentElement.setAttribute('data-admin-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.style.colorScheme = 'light';
  });
  await page.waitForTimeout(400);

  // Click on CMD-5339
  const cmdBtn = await page.$('button:has-text("CMD-")');
  if (cmdBtn) {
    await cmdBtn.click();
    await page.waitForTimeout(800);
  }

  // Find the button directly below "Mettre à jour le statut"
  const label = await page.$('label:has-text("Mettre à jour le statut")');
  if (label) {
    const parent = await label.evaluateHandle(el => el.parentElement);
    const triggerBtn = await parent.$('button');
    if (triggerBtn) {
      console.log('Found trigger button, clicking...');
      await triggerBtn.click();
      await page.waitForTimeout(600);
    }
  }

  const screenshotPath = `${artifactDir}/fixed_orders_drawer_status_dropdown_open.png`;
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved open dropdown screenshot:', screenshotPath);

  await browser.close();
}

verifyOrderDrawerOpen().catch(console.error);
