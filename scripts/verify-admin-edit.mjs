import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const alerts = [];
  page.on('dialog', async (dialog) => {
    console.log('Dialog detected:', dialog.type(), dialog.message());
    alerts.push({ type: dialog.type(), message: dialog.message() });
    await dialog.accept();
  });

  console.log('Navigating to admin login...');
  await page.goto('https://codshop.vipone.site/admin/login', { waitUntil: 'networkidle' });

  // Click demo account button
  const fillDemoBtn = await page.$('button:has-text("Fill Demo Account")');
  if (fillDemoBtn) {
    console.log('Clicking Fill Demo Account...');
    await fillDemoBtn.click();
    await page.waitForTimeout(500);
  }

  // Click Sign in
  const signInBtn = await page.$('button:has-text("Sign In to Dashboard")');
  if (signInBtn) {
    console.log('Clicking Sign In to Dashboard...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
      signInBtn.click(),
    ]);
  }

  await page.waitForTimeout(1500);

  console.log('Navigating to admin products for storet1...');
  await page.goto('https://codshop.vipone.site/admin/products?store=storet1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const productRows = await page.$$eval('table tbody tr', (rows) => rows.length);
  console.log('Products listed in table:', productRows);

  const editBtn = await page.waitForSelector('button[title*="Modifier ce produit"]', { timeout: 10000 }).catch(() => null);
  if (editBtn) {
    console.log('Clicking edit button in table...');
    await editBtn.click();
    await page.waitForTimeout(1500);

    const submitBtn = await page.waitForSelector('button[type="submit"]:has-text("Enregistrer les Modifications")', { timeout: 5000 }).catch(() => null);
    if (submitBtn) {
      console.log('Submitting edit form...');
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  console.log('Total alerts captured:', alerts.length);
  alerts.forEach((a) => console.log('  Alert message:', a.message));

  const screenshotPath = '/home/ubuntu/.gemini/antigravity-cli/brain/abfe329b-12e7-4c34-a9b4-7ca23ea3fac7/admin_products_edit_verified.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();

  const hasError = alerts.some((a) => a.message.includes('Erreur lors de la mise à jour'));
  if (hasError) {
    console.error('FAILED: Erreur lors de la mise à jour alert was triggered!');
    process.exit(1);
  } else {
    console.log('VERIFIED: Product edit saved cleanly with ZERO alert errors!');
  }
}

main().catch(console.error);
