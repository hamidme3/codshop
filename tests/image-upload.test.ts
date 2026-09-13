import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import { POST as uploadHandler } from '../src/app/api/upload/route';

console.log('🧪 Starting Image Upload API Test Suite...\n');

async function runTests() {
  // Test 1: Reject request with wrong content-type
  console.log('1. Testing non-multipart request rejection...');
  const req1 = new Request('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const res1 = await uploadHandler(req1);
  const data1 = await res1.json();
  assert.strictEqual(res1.status, 400);
  assert.strictEqual(data1.success, false);
  console.log('  ✓ Non-multipart request rejected with 400.\n');

  // Test 2: Upload valid JPEG image file
  console.log('2. Testing valid image file upload (PNG/JPEG)...');
  const sampleBytes = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG magic header
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89
  ]);
  const sampleFile = new File([sampleBytes], 'test_product.png', { type: 'image/png' });
  const formData = new FormData();
  formData.append('file', sampleFile);

  const req2 = new Request('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formData,
  });
  const res2 = await uploadHandler(req2);
  const data2 = await res2.json();

  assert.strictEqual(res2.status, 200);
  assert.strictEqual(data2.success, true);
  assert.ok(data2.url.startsWith('/api/uploads/products/prod_'), 'URL must start with /api/uploads/products/prod_');
  assert.ok(data2.url.endsWith('.png'), 'URL must end with .png');

  // Check file exists on disk
  const relativeSubpath = data2.url.replace('/api/uploads', '');
  const diskPath = path.join(process.cwd(), 'public', 'uploads', relativeSubpath);
  const stat = await fs.stat(diskPath);
  assert.ok(stat.size > 0, 'Uploaded file must exist on disk with positive byte size');
  console.log(`  ✓ Image saved to disk: ${data2.url} (${stat.size} bytes).\n`);

  // Clean up test file
  await fs.unlink(diskPath).catch(() => {});

  // Test 3: Reject dangerous/disallowed file extension (.sh, .exe)
  console.log('3. Testing rejection of disallowed extensions (.exe, .sh)...');
  const badBytes = Buffer.from('echo malicious');
  const badFile = new File([badBytes], 'malicious.sh', { type: 'application/x-sh' });
  const formBad = new FormData();
  formBad.append('file', badFile);

  const req3 = new Request('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formBad,
  });
  const res3 = await uploadHandler(req3);
  const data3 = await res3.json();
  assert.strictEqual(res3.status, 400);
  assert.strictEqual(data3.success, false);
  console.log('  ✓ Disallowed extension rejected with 400.\n');

  console.log('🎉 ALL IMAGE UPLOAD TESTS PASSED (100% SUCCESS)!\n');
}

runTests().catch((err) => {
  console.error('Upload test suite failed:', err);
  process.exit(1);
});
