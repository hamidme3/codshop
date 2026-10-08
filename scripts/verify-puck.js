const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ARTIFACT_DIR = '/home/ubuntu/.gemini/antigravity-cli/brain/393aee98-d28b-4efe-b7f1-222709789838';
const URL = 'http://localhost:3001/admin/builder/puck?store=ottavio';

async function loginAdmin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email: 'admin@ottavio.ma', password: 'admin123456' });
    const req = http.request(
      'http://localhost:3001/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        const cookies = res.headers['set-cookie'];
        let token = null;
        if (cookies) {
          for (const c of cookies) {
            const match = c.match(/codshop_session=([^;]+)/);
            if (match) token = match[1];
          }
        }
        resolve(token);
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  console.log('Logging in...');
  const token = await loginAdmin();
  console.log('Session token:', token ? 'Found' : 'Missing');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  if (token) {
    await page.setCookie({
      name: 'codshop_session',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    });
  }
  
  console.log('Navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait a little extra just to ensure Puck renders
  await new Promise(r => setTimeout(r, 2000));

  console.log('Taking screenshot...');
  const screenshotPath = path.join(ARTIFACT_DIR, 'puck-builder.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log('Screenshot saved to', screenshotPath);
  await browser.close();
})();
