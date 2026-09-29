const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/d795ab1b-1896-4e51-815a-57fda63dbba7';

async function testBrowserTelemetry() {
  console.log('🚀 Running end-to-end browser verification of Step 2 inCheckout telemetry...');

  // 1. Fetch valid session token
  const authRes = await fetch('http://172.18.1.9:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ottavio.ma', password: 'admin123456' }),
  });
  const cookieHeader = authRes.headers.get('set-cookie') || '';
  const match = cookieHeader.match(/codshop_session=([^;]+)/);
  const sessionToken = match ? match[1] : '';
  console.log('1. Obtained admin session token:', sessionToken ? 'Token received' : 'Failed');

  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--ignore-certificate-errors'],
  });

  try {
    // 2. Open storefront in customer tab and enter Step 2
    console.log('2. Customer visiting storefront https://storet1.codshop.vipone.site ...');
    const storePage = await browser.newPage();
    await storePage.setViewport({ width: 1440, height: 900 });
    await storePage.goto('https://storet1.codshop.vipone.site', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Click Buy button
    const buttons = await storePage.$$('button');
    for (const btn of buttons) {
      const text = await storePage.evaluate((el) => el.innerText, btn);
      if (text && (text.includes('Commander') || text.includes('Acheter'))) {
        await btn.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 1000));

    // Click Step 2 button
    const modalButtons = await storePage.$$('button');
    for (const btn of modalButtons) {
      const text = await storePage.evaluate((el) => el.innerText, btn);
      if (text && (text.includes('Continuer vers la livraison') || text.includes('Étape 2'))) {
        await btn.click();
        console.log('  ✓ Customer entered Checkout Step 2 in the modal!');
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 2000));

    // 3. Open Admin Analytics with session cookie
    console.log('3. Opening Admin Analytics https://codshop.vipone.site/admin/analytics?store=storet1 ...');
    const adminPage = await browser.newPage();
    await adminPage.setViewport({ width: 1440, height: 900 });

    await adminPage.setCookie({
      name: 'codshop_session',
      value: sessionToken,
      domain: 'codshop.vipone.site',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    });

    await adminPage.goto('https://codshop.vipone.site/admin/analytics?store=storet1', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 3000));

    // Inspect live checkout telemetry
    const liveTelemetry = await adminPage.evaluate(() => {
      const text = document.body.innerText;
      const inCheckoutMatch = text.match(/(\d+)\s+clients à l'Étape 2/);
      const activeMatch = text.match(/(\d+)\s+acheteurs en ligne/);
      return {
        hasTelemetryText: text.includes("clients à l'Étape 2"),
        inCheckoutNumber: inCheckoutMatch ? inCheckoutMatch[1] : null,
        activeNowNumber: activeMatch ? activeMatch[1] : null,
      };
    });

    console.log('Live Telemetry DOM check:', liveTelemetry);

    await adminPage.screenshot({
      path: path.join(ARTIFACT_DIR, 'admin_analytics_in_checkout_verified.png'),
    });
    console.log('Screenshot saved to admin_analytics_in_checkout_verified.png');

    console.log('\n--- VERIFICATION RESULT ---');
    console.log('Telemetry rendered in DOM:', liveTelemetry.hasTelemetryText);
    console.log('Current inCheckout number:', liveTelemetry.inCheckoutNumber);
  } finally {
    await browser.close();
  }
}

testBrowserTelemetry().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
