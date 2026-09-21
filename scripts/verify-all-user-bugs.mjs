import { chromium } from '@playwright/test';

async function verifyAllUserBugs() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 12/13/14 mobile viewport matching user's Telegram screenshots
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

  // Force light mode in localStorage
  await page.evaluate(() => {
    localStorage.setItem('codshop_admin_theme', 'light');
  });

  // Helper to ensure light mode is set in DOM
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

  // --- BUG 1: Analytics CodFunnelChart in light mode ---
  console.log('2. Verifying Analytics CodFunnelChart...');
  await page.goto('https://codshop.vipone.site/admin/analytics?store=storet1', { waitUntil: 'networkidle' });
  await ensureLightMode();
  
  // Scroll to funnel chart
  const funnelEl = await page.$('text=Entonnoir de Conversion COD');
  if (funnelEl) {
    await funnelEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: `${artifactDir}/bug1_analytics_funnel_light.png`, fullPage: false });
  console.log('Saved bug1_analytics_funnel_light.png');

  // --- BUG 5: Orders CSV Export popover ---
  console.log('3. Verifying Orders Exporter CSV popover...');
  await page.goto('https://codshop.vipone.site/admin/orders?store=storet1', { waitUntil: 'networkidle' });
  await ensureLightMode();

  const exportBtn = await page.$('button:has-text("Exporter CSV")');
  if (exportBtn) {
    await exportBtn.scrollIntoViewIfNeeded();
    await exportBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${artifactDir}/bug5_orders_export_popover_light.png`, fullPage: false });
    console.log('Saved bug5_orders_export_popover_light.png');
  } else {
    console.warn('Could not find Exporter CSV button');
  }

  // --- BUGS 2, 3, 4: Products Edit Modal (Top, Variants, Dropzone & Buttons) ---
  console.log('4. Verifying Edit Product modal...');
  await page.goto('https://codshop.vipone.site/admin/products?store=storet1', { waitUntil: 'networkidle' });
  await ensureLightMode();

  // Find Modifier button
  const editBtn = await page.$('button:has-text("Modifier")');
  if (editBtn) {
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click();
    await page.waitForTimeout(800);

    // Re-assert light mode inside modal
    await ensureLightMode();

    // Bug 4 Screenshot: Top section with Total badge & Net Margin
    await page.screenshot({ path: `${artifactDir}/bug4_product_modal_top_light.png`, fullPage: false });
    console.log('Saved bug4_product_modal_top_light.png');

    // Bug 3 Screenshot: Variants section
    const variantsSection = await page.$('text=Variantes & Stock Multi-SKU');
    if (variantsSection) {
      await variantsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${artifactDir}/bug3_product_modal_variants_light.png`, fullPage: false });
      console.log('Saved bug3_product_modal_variants_light.png');
    }

    // Bug 2 Screenshot: Image Dropzone and Bottom buttons (Annuler / Enregistrer)
    const dropzoneSection = await page.$('text=Image Principale & Visuels');
    if (dropzoneSection) {
      await dropzoneSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
    const saveBtn = await page.$('button:has-text("Enregistrer les")');
    if (saveBtn) {
      await saveBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: `${artifactDir}/bug2_product_modal_dropzone_and_buttons_light.png`, fullPage: false });
    console.log('Saved bug2_product_modal_dropzone_and_buttons_light.png');
  } else {
    console.warn('Could not find Modifier button');
  }

  await browser.close();
  console.log('All visual verification screenshots captured successfully!');
}

verifyAllUserBugs().catch(console.error);
