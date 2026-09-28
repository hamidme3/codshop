import { chromium } from '@playwright/test';

async function verifyAllLightMode() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1.5,
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

  const setLightMode = async () => {
    await page.evaluate(() => {
      localStorage.setItem('codshop_admin_theme', 'light');
      document.documentElement.setAttribute('data-admin-theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    });
  };

  const artifactDir = '/home/ubuntu/.gemini/antigravity-cli/brain/d795ab1b-1896-4e51-815a-57fda63dbba7';

  // 1. Orders page
  console.log('Verifying Orders page in Light Mode...');
  await page.goto('https://codshop.vipone.site/admin/orders?store=storet1', { waitUntil: 'networkidle' });
  await setLightMode();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/orders_light_mode.png`, fullPage: false });
  console.log('Saved orders_light_mode.png');

  // 2. Products page with Add Product Modal open
  console.log('Verifying Products page + Add Product Modal in Light Mode...');
  await page.goto('https://codshop.vipone.site/admin/products?store=storet1', { waitUntil: 'networkidle' });
  await setLightMode();
  await page.waitForTimeout(1000);

  // Click "+ Ajouter un Produit"
  const addProdBtn = await page.$('button:has-text("Ajouter un Produit")');
  if (addProdBtn) {
    await addProdBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${artifactDir}/product_add_modal_light.png`, fullPage: false });
    console.log('Saved product_add_modal_light.png');

    // Switch to Tab 2 Pricing
    const tabPricing = await page.$('button:has-text("2. Tarification")');
    if (tabPricing) {
      await tabPricing.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${artifactDir}/product_add_modal_pricing_light.png`, fullPage: false });
      console.log('Saved product_add_modal_pricing_light.png');
    }

    // Close modal
    const closeBtn = await page.$('button:has-text("✕")');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 3. Switch to Categories tab and open Add Category Modal
  console.log('Verifying Add Category Modal in Light Mode...');
  const catTab = await page.$('button:has-text("Catégories")');
  if (catTab) {
    await catTab.click();
    await page.waitForTimeout(500);

    const newCatBtn = await page.$('button:has-text("Nouvelle Catégorie")');
    if (newCatBtn) {
      await newCatBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${artifactDir}/category_add_modal_light.png`, fullPage: false });
      console.log('Saved category_add_modal_light.png');
    }
  }

  // 4. Identity page in Light Mode
  console.log('Verifying Identity KYC page in Light Mode...');
  await page.goto('https://codshop.vipone.site/admin/identity?store=storet1', { waitUntil: 'networkidle' });
  await setLightMode();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/identity_kyc_light.png`, fullPage: false });
  console.log('Saved identity_kyc_light.png');

  await browser.close();
  console.log('All Light Mode verification screenshots captured successfully!');
}

verifyAllLightMode().catch(console.error);
