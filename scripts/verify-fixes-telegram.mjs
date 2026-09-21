import { chromium } from '@playwright/test';

async function verifyFixes() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile viewport matching user's phone
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

  // Ensure light mode helper
  const ensureLightMode = async () => {
    await page.evaluate(() => {
      localStorage.setItem('codshop_admin_theme', 'light');
      document.documentElement.setAttribute('data-admin-theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    });
    await page.waitForTimeout(500);
  };

  console.log('2. Verifying Order Details Status Selector on mobile...');
  await page.goto('https://codshop.vipone.site/admin/orders?store=storet1', { waitUntil: 'networkidle' });
  await ensureLightMode();

  // Find and click on the first order in the table/list
  const orderRow = await page.$('tbody tr, div[class*="border rounded"] button, div[class*="bento-card"]');
  if (orderRow) {
    await orderRow.click();
    await page.waitForTimeout(600);
  }

  // Find the status update button ("Mettre à jour le statut" trigger)
  const statusTrigger = await page.$('button:has-text("Nouvelle"), button:has-text("Confirmée"), button:has-text("Expédiée"), button:has-text("Livrée"), button:has-text("À Confirmer")');
  if (statusTrigger) {
    await statusTrigger.scrollIntoViewIfNeeded();
    await statusTrigger.click();
    await page.waitForTimeout(500);
  }

  const orderScreenshotPath = `${artifactDir}/fixed_orders_drawer_status_dropdown.png`;
  await page.screenshot({ path: orderScreenshotPath, fullPage: false });
  console.log('Saved order status dropdown screenshot:', orderScreenshotPath);

  console.log('3. Verifying Product Batch Stock Toast on mobile...');
  await page.goto('https://codshop.vipone.site/admin/products?store=storet1', { waitUntil: 'networkidle' });
  await ensureLightMode();

  // Find Edit button for a product
  const editBtn = await page.$('button[title*="Modifier"], button:has-text("Modifier"), tr button:has(.lucide-pencil), tr button:has(.lucide-edit)');
  if (editBtn) {
    await editBtn.click();
    await page.waitForTimeout(800);
  } else {
    // If not found, try clicking the first product row or action
    const anyEdit = await page.$('button:has(svg.lucide-edit), button:has(svg.lucide-pencil)');
    if (anyEdit) {
      await anyEdit.click();
      await page.waitForTimeout(800);
    }
  }

  // Look for "Appliquer à tous (1-clic)" button in the edit modal
  const applyAllBtn = await page.$('button:has-text("Appliquer à tous")');
  if (applyAllBtn) {
    await applyAllBtn.scrollIntoViewIfNeeded();
    await applyAllBtn.click();
    await page.waitForTimeout(600);
  } else {
    console.log('Appliquer a tous button not found directly, checking matrix button...');
    const matrixBtn = await page.$('button:has-text("Outils Matrice")');
    if (matrixBtn) {
      await matrixBtn.click();
      await page.waitForTimeout(400);
      const applyBtnAfter = await page.$('button:has-text("Appliquer à tous")');
      if (applyBtnAfter) {
        await applyBtnAfter.scrollIntoViewIfNeeded();
        await applyBtnAfter.click();
        await page.waitForTimeout(600);
      }
    }
  }

  const toastScreenshotPath = `${artifactDir}/fixed_product_batch_stock_toast.png`;
  await page.screenshot({ path: toastScreenshotPath, fullPage: false });
  console.log('Saved product batch stock toast screenshot:', toastScreenshotPath);

  await browser.close();
  console.log('Verification script completed!');
}

verifyFixes().catch(console.error);
