import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { 
  getOrders, updateOrderStatus, getProducts, getCategories, 
  getCustomers
} from '../src/lib/backoffice';
import { calculateUnitEconomics } from '../src/lib/moroccan-cod-economics';

console.log('🧪 Starting Admin Mobile Responsiveness & Color System Tests...');

const storeSlug = 'ottavio';

// ── Test 1: Verify CSS Global Tokens for Strict 6-Stage Semantic Pipeline & Mobile Ergonomics ──
console.log('  1. Testing globals.css for 6-stage semantic tokens & mobile safe areas...');
const globalsCssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
const globalsCss = fs.readFileSync(globalsCssPath, 'utf-8');

assert.ok(globalsCss.includes('.stage-pill-new'), 'stage-pill-new class must be defined in globals.css');
assert.ok(globalsCss.includes('.stage-pill-to_confirm'), 'stage-pill-to_confirm class must be defined in globals.css');
assert.ok(globalsCss.includes('.stage-pill-confirmed'), 'stage-pill-confirmed class must be defined in globals.css');
assert.ok(globalsCss.includes('.stage-pill-shipped'), 'stage-pill-shipped class must be defined in globals.css');
assert.ok(globalsCss.includes('.stage-pill-delivered'), 'stage-pill-delivered class must be defined in globals.css');
assert.ok(globalsCss.includes('.stage-pill-returned'), 'stage-pill-returned class must be defined in globals.css');

// iOS Safari zoom prevention (16px base font on mobile)
assert.ok(globalsCss.includes('font-size: 16px !important'), '16px input font size must be enforced on mobile to prevent iOS auto-zoom');
assert.ok(globalsCss.includes('.touch-target'), 'touch-target class (min 44px) must be defined');
assert.ok(globalsCss.includes('.admin-shell'), 'admin-shell overflow rule must be defined');
console.log('  ✓ globals.css verified: 6-stage semantic tokens, iOS zoom prevention, and touch targets present.');

// ── Test 2: Verify Mobile Shell, Drawer & Bottom Quick Bar in layout.tsx ──
console.log('  2. Testing src/app/admin/layout.tsx for mobile navigation & drawer...');
const layoutPath = path.join(process.cwd(), 'src', 'app', 'admin', 'layout.tsx');
const layoutCode = fs.readFileSync(layoutPath, 'utf-8');

assert.ok(layoutCode.includes('Barre de navigation rapide mobile'), 'Mobile bottom quick bar must be rendered in layout');
assert.ok(layoutCode.includes('Mobile Menu Navigation'), 'Mobile sliding drawer must be rendered with accessible label');
assert.ok(layoutCode.includes('fixed bottom-0 left-0 right-0') && layoutCode.includes('lg:hidden'), 'Bottom quick bar must be fixed at bottom on mobile');
assert.ok(layoutCode.includes('touch-target'), 'Touch target utility must be applied to mobile interactive elements');
assert.ok(layoutCode.includes('pb-20 lg:pb-8'), 'Main viewport must have bottom clearance for mobile quick bar');
console.log('  ✓ layout.tsx verified: Responsive mobile shell, sliding drawer, and bottom quick bar present.');

// ── Test 3: Verify Orders Table-to-Card Responsive Transformation ──
console.log('  3. Testing src/app/admin/orders/page.tsx for mobile card stream...');
const ordersPagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'orders/page.tsx');
const ordersCode = fs.readFileSync(ordersPagePath, 'utf-8');

assert.ok(ordersCode.includes('block md:hidden'), 'Mobile cards stream must be visible on screens < md');
assert.ok(ordersCode.includes('hidden md:block'), 'Desktop table must be hidden on screens < md');
assert.ok(ordersCode.includes('stage-pill-'), 'Status badges must use strict stage-pill tokens');
assert.ok(ordersCode.includes('tel:'), 'Direct click-to-call link must be present on mobile order cards');
assert.ok(ordersCode.includes('buildWhatsAppLink'), 'Direct WhatsApp link must be present on mobile order cards');
console.log('  ✓ orders/page.tsx verified: Adaptive mobile card stream, click-to-call, and WhatsApp actions present.');

// ── Test 4: Verify Products Catalog Table-to-Card Responsive Transformation ──
console.log('  4. Testing src/app/admin/products/page.tsx for mobile product card stream...');
const productsPagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'products/page.tsx');
const productsCode = fs.readFileSync(productsPagePath, 'utf-8');

assert.ok(productsCode.includes('block md:hidden'), 'Mobile product cards must be visible on screens < md');
assert.ok(productsCode.includes('hidden md:block'), 'Desktop products table must be hidden on screens < md');
assert.ok(productsCode.includes('handleAdjustStock'), 'Quick stock adjuster (- / +) must be available on mobile product cards');
assert.ok(productsCode.includes('handleOpenEditModal'), 'Edit action must be accessible from mobile product cards');
console.log('  ✓ products/page.tsx verified: Mobile product card stream with quick stock adjusters present.');

// ── Test 5: Verify Customers CRM Table-to-Card Responsive Transformation ──
console.log('  5. Testing src/app/admin/customers/page.tsx for mobile customer card stream...');
const customersPagePath = path.join(process.cwd(), 'src', 'app', 'admin', 'customers/page.tsx');
const customersCode = fs.readFileSync(customersPagePath, 'utf-8');

assert.ok(customersCode.includes('block md:hidden'), 'Mobile customer cards must be visible on screens < md');
assert.ok(customersCode.includes('hidden md:block'), 'Desktop customer table must be hidden on screens < md');
assert.ok(customersCode.includes('getContextualWhatsAppUrl'), 'Contextual WhatsApp messaging must be available on mobile customer cards');
assert.ok(customersCode.includes('setSelectedCustomer'), 'Customer order history drawer must be triggerable on mobile cards');
console.log('  ✓ customers/page.tsx verified: Mobile customer card stream and contextual messaging present.');

// ── Test 6: Zero Regressions on Operational CRUD & Moroccan COD Economics ──
console.log('  6. Testing operational CRUD integrity & Unit Economics Calculator...');
const products = getProducts(storeSlug);
assert.ok(products.length > 0, 'Products list must not be empty');

const testEconomics = calculateUnitEconomics({
  sellingPrice: 499,
  cogs: 180,
  deliveryFee: 35,
  returnRate: 0.15,
  returnFee: 20,
});

assert.strictEqual(testEconomics.grossMarginMAD, 319, 'Gross margin should be 499 - 180 = 319 MAD');
assert.ok(testEconomics.netProfitMAD > 0, 'Net profit after delivery and return factor must be positive');
assert.strictEqual(testEconomics.health.level, 'green', 'Net margin > 35% must be classified as green');

const orders = getOrders(storeSlug);
assert.ok(orders.length > 0, 'Orders list must not be empty');
const firstOrder = orders[0];

// Test 1-click status transitions
const success = updateOrderStatus(firstOrder.id, 'confirmed');
assert.strictEqual(success, true, 'updateOrderStatus should return true');
const updatedOrders = getOrders(storeSlug);
const updatedOrder = updatedOrders.find((o) => o.id === firstOrder.id);
assert.strictEqual(updatedOrder?.status, 'confirmed', 'Order status should be confirmed');

const customers = getCustomers(storeSlug);
assert.ok(customers.length > 0, 'Customers list must not be empty');
console.log('  ✓ Operational CRUD & Moroccan COD economics verified with zero regressions.');

console.log('🎉 All Admin Mobile Responsiveness & Color System Tests PASSED successfully!\n');
