const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/393aee98-d28b-4efe-b7f1-222709789838';

(async () => {
  console.log('Launching browser to capture branded Puck builder...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  const builderUrl = 'http://localhost:3001/admin/builder/puck?store=ottavio';
  console.log('Navigating to', builderUrl);
  await page.goto(builderUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Give React time to hydrate and load Puck
  await new Promise(r => setTimeout(r, 4000));

  console.log('Taking screenshot...');
  const screenshotPath = path.join(ARTIFACT_DIR, 'branded-puck-builder.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log('Screenshot saved to', screenshotPath);
  await browser.close();
})();
