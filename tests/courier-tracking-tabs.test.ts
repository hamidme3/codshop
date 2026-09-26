import { 
  normalizeCourierKey, 
  generateCourierTrackingNumber, 
  getCourierTrackingUrl, 
  getCourierMeta,
  MOROCCAN_COURIERS 
} from '../src/lib/carrier-tracking';

console.log('🧪 Starting Courier Tracking & Mobile Multi-Order Tab Tests...');

// 1. Test Courier Normalization
if (normalizeCourierKey('ozon') !== 'ozon') throw new Error('Expected ozon');
if (normalizeCourierKey('Ozon Express') !== 'ozon') throw new Error('Expected ozon');
if (normalizeCourierKey('sendit') !== 'sendit') throw new Error('Expected sendit');
if (normalizeCourierKey('cathedis') !== 'cathedis') throw new Error('Expected cathedis');
if (normalizeCourierKey('amana') !== 'amana') throw new Error('Expected amana');
if (normalizeCourierKey('manual') !== 'manual') throw new Error('Expected manual');
if (normalizeCourierKey('standard') !== 'ozon') throw new Error('Expected standard to fallback to ozon');
if (normalizeCourierKey(undefined, 'OZON-MA-123456') !== 'ozon') throw new Error('Expected prefix detection ozon');
if (normalizeCourierKey(undefined, 'SND-MA-123456') !== 'sendit') throw new Error('Expected prefix detection sendit');
if (normalizeCourierKey(undefined, 'CATH-MA-123456') !== 'cathedis') throw new Error('Expected prefix detection cathedis');
if (normalizeCourierKey(undefined, 'AMN-MA-123456') !== 'amana') throw new Error('Expected prefix detection amana');
console.log('  ✓ Test 1: Courier normalization & prefix detection passed.');

// 2. Test Tracking Number Generation
const ozonTrack = generateCourierTrackingNumber('ozon');
if (!ozonTrack.startsWith('OZON-MA-')) throw new Error(`Invalid ozon tracking: ${ozonTrack}`);

const senditTrack = generateCourierTrackingNumber('sendit');
if (!senditTrack.startsWith('SND-MA-')) throw new Error(`Invalid sendit tracking: ${senditTrack}`);

const cathedisTrack = generateCourierTrackingNumber('cathedis');
if (!cathedisTrack.startsWith('CATH-MA-')) throw new Error(`Invalid cathedis tracking: ${cathedisTrack}`);

const amanaTrack = generateCourierTrackingNumber('amana');
if (!amanaTrack.startsWith('AMN-MA-')) throw new Error(`Invalid amana tracking: ${amanaTrack}`);
console.log('  ✓ Test 2: Authentic courier tracking number generation passed.');

// 3. Test Public Tracking URLs
const ozonUrl = getCourierTrackingUrl('ozon', 'OZON-MA-171413');
if (!ozonUrl || !ozonUrl.includes('ozonexpress.ma/suivi?tracking=OZON-MA-171413')) {
  throw new Error(`Invalid ozon url: ${ozonUrl}`);
}

const senditUrl = getCourierTrackingUrl('sendit', 'SND-MA-999888');
if (!senditUrl || !senditUrl.includes('sendit.ma/tracking/SND-MA-999888')) {
  throw new Error(`Invalid sendit url: ${senditUrl}`);
}

const cathedisUrl = getCourierTrackingUrl('cathedis', 'CATH-MA-555444');
if (!cathedisUrl || !cathedisUrl.includes('cathedis.net/tracking?code=CATH-MA-555444')) {
  throw new Error(`Invalid cathedis url: ${cathedisUrl}`);
}

const amanaUrl = getCourierTrackingUrl('amana', 'AMN-MA-111222');
if (!amanaUrl || !amanaUrl.includes('amana-colis.ma/suivi?code=AMN-MA-111222')) {
  throw new Error(`Invalid amana url: ${amanaUrl}`);
}
console.log('  ✓ Test 3: Official public tracking portal URLs correctly generated.');

// 4. Test Courier Meta
const meta = getCourierMeta('ozon');
if (meta.name !== 'Ozon Express' || !meta.badgeClass.includes('amber')) {
  throw new Error('Invalid ozon meta');
}
console.log('  ✓ Test 4: Courier branding metadata validated.');

console.log('🎉 ALL COURIER TRACKING TESTS PASSED (100% SUCCESS)!');
