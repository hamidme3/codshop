const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/393aee98-d28b-4efe-b7f1-222709789838';

const mockPuckPayload = {
  content: [
    {
      type: "AnnouncementBar",
      props: {
        id: "AnnouncementBar-1",
        text: "🎉 SPECIAL PROMO PUCK EDITOR 🎉",
        bgColor: "#10b981"
      }
    },
    {
      type: "HeroBanner",
      props: {
        id: "HeroBanner-1",
        badgeText: "Nouveau",
        headline: "Welcome to the new Puck-generated Storefront!",
        subheadline: "This page is fully rendered dynamically via the drag-and-drop JSON configured in Phase 4.",
        ctaText: "View special offer"
      }
    }
  ],
  root: {},
  zones: {}
};

async function postPuckLayout() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(mockPuckPayload);
    const req = http.request(
      'http://localhost:3001/api/stores/ottavio/puck',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          if (res.statusCode === 200) resolve(JSON.parse(body));
          else reject(new Error('Failed to post layout: ' + res.statusCode));
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  console.log('Publishing mock Puck layout for store "ottavio"...');
  try {
    await postPuckLayout();
    console.log('Layout published successfully!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('Launching browser to capture storefront...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  const storefrontUrl = 'http://localhost:3001/?store=ottavio';
  console.log('Navigating to', storefrontUrl);
  await page.goto(storefrontUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Give React time to hydrate and fetch Puck data
  await new Promise(r => setTimeout(r, 3000));

  console.log('Taking screenshot...');
  const screenshotPath = path.join(ARTIFACT_DIR, 'puck-storefront.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log('Screenshot saved to', screenshotPath);
  await browser.close();
})();
