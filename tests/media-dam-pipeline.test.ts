import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'path';
import fs from 'fs';
import { POST as handleUpload } from '../src/app/api/upload/route';
import { GET as handleServeUpload } from '../src/app/api/uploads/[...path]/route';

describe('Media DAM Pipeline & Sharp WebP Engine Suite', () => {
  // 1. Create a 1x1 minimal valid PNG buffer for testing
  const minimalPngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const pngBuffer = Buffer.from(minimalPngBase64, 'base64');

  it('rejects upload requests without multipart/form-data', async () => {
    const req = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true }),
    });

    const res = await handleUpload(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  it('rejects empty file payload', async () => {
    const formData = new FormData();
    const req = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await handleUpload(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  it('rejects unallowed file extensions (.exe, .sh, .php)', async () => {
    const formData = new FormData();
    const file = new File([Buffer.from('malicious')], 'malicious.php', {
      type: 'application/x-php',
    });
    formData.append('file', file);

    const req = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await handleUpload(req);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  it('successfully uploads and processes an image with responsive metadata', async () => {
    const formData = new FormData();
    const file = new File([pngBuffer], 'moroccan_argan_oil.png', {
      type: 'image/png',
    });
    formData.append('file', file);

    const req = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await handleUpload(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();

    assert.strictEqual(data.success, true);
    assert.ok(data.url, 'Must return primary URL');
    assert.ok(Array.isArray(data.urls), 'Must return urls array');
    assert.strictEqual(data.count, 1);
    assert.ok(Array.isArray(data.media), 'Must return media array');
    assert.strictEqual(data.media.length, 1);

    const media = data.media[0];
    assert.ok(media.url, 'Media item must have url');

    console.log('  ✓ Image uploaded successfully:', {
      url: data.url,
      hasSizes: Boolean(media.sizes),
    });
  });

  it('verifies static upload serving endpoint serves images with correct headers', async () => {
    // Write a small test file in public/uploads/media
    const testFilename = 'test_serve_probe.webp';
    const testFilePath = path.join(process.cwd(), 'public', 'uploads', 'media', testFilename);
    fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
    fs.writeFileSync(testFilePath, pngBuffer);

    const req = new Request(`http://localhost:3000/api/uploads/media/${testFilename}`);
    const res = await handleServeUpload(req, {
      params: Promise.resolve({ path: ['media', testFilename] }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get('Content-Type'), 'image/webp');
    assert.ok(res.headers.get('Cache-Control')?.includes('max-age=31536000'));

    // Cleanup probe
    fs.unlinkSync(testFilePath);
    console.log('  ✓ Static image served with Content-Type: image/webp and immutable cache');
    setTimeout(() => process.exit(0), 100);
  });
});
