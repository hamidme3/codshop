import assert from 'node:assert';
import { createOrder, getCustomers } from '../src/lib/db-repository';

console.log('🧪 Starting CRM Customer Email Sync Verification Tests...\n');

async function runTests() {
  const storeSlug = 'ottavio';
  const testPhone = `06${Math.floor(10000000 + Math.random() * 90000000)}`;
  const testEmail = `salma.tazi.${Date.now()}@testvip.ma`;
  const customerName = 'Salma Tazi';

  console.log(`1. Creating order with customer email "${testEmail}" and phone "${testPhone}"...`);
  const order = await createOrder({
    storeSlug,
    customerName,
    email: testEmail,
    phone: testPhone,
    city: 'Marrakech',
    address: 'Guéliz, Résidence Majorelle',
    items: [
      {
        id: 'prod_crm_test',
        title: 'Pochette Cuir Festive',
        price: 320,
        quantity: 1,
      },
    ],
    subtotal: 320,
    shippingFee: 30,
    total: 350,
  });

  assert.ok(order.orderNumber, 'Order must have a valid orderNumber');
  console.log(`  ✓ Order created: ${order.orderNumber}\n`);

  console.log('2. Querying CRM Customers list via getCustomers...');
  const customers = await getCustomers(storeSlug);
  assert.ok(Array.isArray(customers), 'Customers must be an array');
  assert.ok(customers.length > 0, 'Customers list must not be empty');

  // Find customer by phone
  const syncedCustomer = customers.find((c) => c.phone === testPhone);
  assert.ok(syncedCustomer, `Customer with phone ${testPhone} must be found in CRM`);

  console.log(`3. Verifying customer record in CRM:`);
  console.log(`   - Name: ${syncedCustomer.name}`);
  console.log(`   - Email: ${syncedCustomer.email}`);
  console.log(`   - Phone: ${syncedCustomer.phone}`);
  console.log(`   - Total Orders: ${syncedCustomer.totalOrders}`);
  console.log(`   - Total Spend: ${syncedCustomer.totalSpend} DH`);

  assert.strictEqual(syncedCustomer.name, customerName, 'Customer name must match');
  assert.strictEqual(syncedCustomer.email, testEmail, 'Customer email must match order email');
  assert.strictEqual(syncedCustomer.totalOrders, 1, 'Customer total orders must be 1');
  assert.strictEqual(syncedCustomer.recentOrders?.[0]?.total, 350, 'Recent order total must be 350 DH');

  // 4. Test searching by email (matching admin CRM search filter logic)
  console.log('\n4. Testing CRM search query filtering by email...');
  const query = testEmail.slice(0, 10).toLowerCase();
  const searchResults = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.email.toLowerCase().includes(query)
  );
  assert.ok(searchResults.some((c) => c.phone === testPhone), 'Search by email must return customer');
  console.log('  ✓ Search by email substring successfully retrieved customer in CRM.\n');

  console.log('🎉 ALL CRM CUSTOMER EMAIL SYNC TESTS PASSED (100% SUCCESS RATE)!');
}

runTests().catch((err) => {
  console.error('❌ CRM sync test failed:', err);
  process.exit(1);
});
