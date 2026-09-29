const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROMIUM_PATH = process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/d795ab1b-1896-4e51-815a-57fda63dbba7';

async function verifyInteractive() {
  console.log('🚀 Verifying storet1.codshop.vipone.site interactive checkout flow...');
  const browser = await puppeteer.launch({
    executablePath: CHROMIUM_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--ignore-certificate-errors'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const pageErrors = [];
    page.on('pageerror', (err) => {
      console.error('[PageError]:', err.toString());
      pageErrors.push(err.toString());
    });

    console.log('1. Loading https://storet1.codshop.vipone.site ...');
    await page.goto('https://storet1.codshop.vipone.site', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Save homepage screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'storet1_resolved_homepage.png') });
    console.log('Saved storet1_resolved_homepage.png');

    // Check for buy buttons
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons on page.`);

    let clicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.innerText, btn);
      if (text && (text.includes('Commander') || text.includes('Acheter') || text.includes('Commander en 1 Clic'))) {
        console.log(`2. Clicking order button: "${text.trim().substring(0, 40)}" ...`);
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (clicked) {
      await new Promise((r) => setTimeout(r, 1500));
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'storet1_resolved_modal.png') });
      console.log('Saved storet1_resolved_modal.png');
    }

    console.log('\n--- VERIFICATION RESULT ---');
    console.log('Page Errors Count:', pageErrors.length);
    if (pageErrors.length > 0) {
      console.error('FAILED with errors:', pageErrors);
      process.exit(1);
    } else {
      console.log('SUCCESS: storet1 rendered cleanly with 0 client-side exceptions!');
    }
  } finally {
    await browser.close();
  }
}

verifyInteractive().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
