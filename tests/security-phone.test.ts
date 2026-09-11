import { validateAndNormalizeMoroccanPhone } from '../src/lib/moroccan-phone';
import { checkOrderRateLimit } from '../src/lib/rate-limiter';

console.log('🧪 Starting Moroccan Phone & Rate Limiter Security Tests...');

// Test Phone Validation
const validPhones = [
  '0661234567',
  '0712345678',
  '0522123456', // Casablanca fixed
  '0537123456', // Rabat fixed
  '+212661234567',
  '00212712345678',
  '212522123456',
  '06 61-23.45 (67)',
];

for (const p of validPhones) {
  const res = validateAndNormalizeMoroccanPhone(p);
  if (!res.isValid) {
    throw new Error(`Expected phone ${p} to be valid, got error: ${res.error}`);
  }
}
console.log('  ✓ Moroccan mobile (06, 07) and fixed line (05) formats validated and normalized.');

// Test Invalid Phones
const invalidPhones = ['123456', '0412345678', '0812345678', '+33612345678', 'abcdefghij'];
for (const p of invalidPhones) {
  const res = validateAndNormalizeMoroccanPhone(p);
  if (res.isValid) {
    throw new Error(`Expected phone ${p} to be invalid!`);
  }
}
console.log('  ✓ Invalid foreign and malformed phones rejected.');

// Test Rate Limiting
const testPhone = `0699${Math.floor(100000 + Math.random() * 900000)}`;
const r1 = checkOrderRateLimit('196.217.5.24', testPhone);
if (!r1.allowed) throw new Error('First order should be allowed');

const r2 = checkOrderRateLimit('196.217.5.24', testPhone);
if (!r2.allowed) throw new Error('Second order should be allowed');

const r3 = checkOrderRateLimit('196.217.5.24', testPhone);
if (r3.allowed) throw new Error('Third order within 3 mins for same phone should be rate limited!');

console.log('  ✓ CGNAT-safe rate limiting verified (throttles repeat spam from same phone number).');
console.log('🎉 All Security & Phone tests passed successfully!');
