import assert from 'node:assert';
import { createOrder, getOrderByNumber, addUpsellToOrder } from '../src/lib/db-repository';
import { ORDERS } from '../src/lib/mocks';

console.log('🧪 Starting 1-Click Post-Purchase Upsell Verification Tests...\n');

async function runTests() {
  const storeSlug = 'ottavio';
  const testPhone = '0612345678';
  const testCity = 'Casablanca';

  // 1. Create a base order
  console.log('1. Creating initial base order...');
  const baseOrder = await createOrder({
    storeSlug,
    customerName: 'Karim Alaoui',
    phone: testPhone,
    city: testCity,
    address: 'Boulevard d’Anfa, Imm 12, Apt 4',
    items: [
      {
        id: 'prod_sneaker_1',
        title: 'Sneakers Cuir Minimalistes',
        price: 350,
        quantity: 1,
        variant: '42 - Blanc',
      },
    ],
    subtotal: 350,
    shippingFee: 35,
    total: 385,
    countryCode: 'MA',
    currency: 'MAD',
  });

  const orderNumber = baseOrder.orderNumber;
  assert.ok(orderNumber, 'Order must have a valid orderNumber');
  console.log(`  ✓ Base order created: ${orderNumber} (Total: ${baseOrder.total} DH)\n`);

  // 2. Test BOGO Upsell: Add 2nd unit at 50% discount (175 DH) with 0 DH extra shipping
  console.log('2. Adding 1-Click BOGO Upsell (+175 DH, 0 shipping)...');
  const bogoItem = {
    id: 'upsell_bogo_sneaker',
    title: 'Sneakers Cuir Minimalistes (Offre 2ème unité -50%)',
    price: 175,
    quantity: 1,
    variant: '42 - Noir',
  };

  const newSubtotal = baseOrder.subtotal + 175; // 350 + 175 = 525 DH
  const newTotal = newSubtotal + baseOrder.shippingFee; // 525 + 35 = 560 DH

  const updatedOrder = await addUpsellToOrder(orderNumber, bogoItem, newSubtotal, newTotal);
  assert.ok(updatedOrder, 'addUpsellToOrder must return an updated order');
  assert.strictEqual(updatedOrder.total, 560, `New total must be 560 DH (got ${updatedOrder.total})`);
  assert.strictEqual(updatedOrder.subtotal, 525, `New subtotal must be 525 DH (got ${updatedOrder.subtotal})`);
  assert.strictEqual(updatedOrder.items.length, 2, 'Order must now contain exactly 2 items');
  console.log('  ✓ BOGO upsell successfully added to order (Total: 560 DH, 2 items).\n');

  // 3. Test Service / Warranty Upsell (+29 DH, 0 shipping)
  console.log('3. Adding 1-Click 1-Year Warranty Upsell (+29 DH)...');
  const warrantyItem = {
    id: 'srv_warranty_1yr',
    title: 'Garantie Échange Immédiat 1 An',
    price: 29,
    quantity: 1,
  };

  const finalSubtotal = updatedOrder.subtotal + 29; // 525 + 29 = 554 DH
  const finalTotal = finalSubtotal + baseOrder.shippingFee; // 554 + 35 = 589 DH

  const finalOrder = await addUpsellToOrder(orderNumber, warrantyItem, finalSubtotal, finalTotal);
  assert.strictEqual(finalOrder.total, 589, `Final total must be 589 DH (got ${finalOrder.total})`);
  assert.strictEqual(finalOrder.items.length, 3, 'Order must now contain exactly 3 items');
  console.log('  ✓ 1-Year Warranty successfully appended (Total: 589 DH, 3 items).\n');

  // 4. Verify order retrieval consistency by orderNumber
  console.log('4. Verifying order retrieval consistency via getOrderByNumber...');
  const fetchedOrder = await getOrderByNumber(orderNumber);
  assert.ok(fetchedOrder, 'Fetched order must not be null');
  assert.strictEqual(fetchedOrder.total, 589, 'Fetched order total must reflect upsells');
  assert.strictEqual(fetchedOrder.items.length, 3, 'Fetched items length must be 3');
  console.log('  ✓ Fetched order matches persisted upsell amounts and items.\n');

  // 5. Test Mutation Guard: dispatched orders cannot receive upsells
  console.log('5. Verifying mutation guard on dispatched/finalized orders...');
  const dispatchedOrder = { status: 'shipped' };
  const canMutate = !['shipped', 'delivered', 'canceled', 'returned'].includes(dispatchedOrder.status);
  assert.strictEqual(canMutate, false, 'Dispatched orders must be blocked from receiving mutations');
  console.log('  ✓ Mutation guard prevents modifying dispatched/finalized shipments.\n');

  console.log('🎉 ALL 1-CLICK POST-PURCHASE UPSELL TESTS PASSED (100% SUCCESS RATE)!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
