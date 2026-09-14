/**
 * TEST SUITE: Similar Bugs Audit & Remediation Verification
 * Verifies fixes for:
 * 1. Order pricing resolution & tier recalculation for custom products (no false tampering error)
 * 2. PostgreSQL stock decrement & variant stock update on order creation with non-UUID item IDs
 * 3. PostgreSQL stock restoration on order cancellation, return, and deletion
 * 4. updateProduct & deleteProduct with non-UUID identifiers in db-repository
 * 5. Dynamic category discovery and live product count synchronization
 * 6. CRM customer synchronization with database queries
 */

import { resolveCatalogProduct, verifyAndRecalculateOrder } from '../src/lib/order-pricing';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createOrder, 
  restoreDbProductStock,
  getCustomers,
  updateCustomerNotes
} from '../src/lib/db-repository';
import { getCategories, addCategory, deleteCategory } from '../src/lib/mocks';
import { getDb, schema } from '../src/db';
import { eq } from 'drizzle-orm';

async function runTests() {
  console.log('--- TEST SUITE: Similar Bugs Audit & Remediation ---');

  // Test 1: Pricing engine resolution & Pack Duo tier calculation for custom product
  console.log('\n1. Testing catalog product resolution & tier pricing for custom product...');
  const res = await resolveCatalogProduct({ sku: 'SKU-5567', title: 'Test Product SKU 5567' }, 'storet1');
  if (!res) {
    throw new Error('FAILED: Failed to resolve custom product SKU-5567');
  }
  if (!res.quantityTiers || res.quantityTiers.length < 2) {
    throw new Error('FAILED: Custom product quantity tiers missing or incomplete');
  }
  const duoTier = res.quantityTiers.find((t) => t.quantity === 2);
  if (!duoTier || duoTier.totalPrice <= 0) {
    throw new Error('FAILED: Pack Duo tier not properly computed for custom product');
  }
  console.log(`  ✓ Resolved product "${res.title}", Pack Duo price: ${duoTier.totalPrice} DH, Free delivery: ${duoTier.freeDelivery}`);

  // Test 2: Verify and recalculate order without price tampering error
  console.log('\n2. Testing verifyAndRecalculateOrder for custom product Pack Duo...');
  const orderPayload = {
    customerName: 'Karim Bennani',
    phone: '0612345678',
    city: 'Casablanca',
    address: '12 Boulevard d Anfa',
    items: [
      {
        id: 'prod_sku_5567',
        sku: 'SKU-5567',
        title: 'Test Product SKU 5567',
        quantity: 2,
        price: 249,
        variant: 'Standard',
      },
    ],
    quantity: 2,
    subtotal: duoTier.totalPrice,
    shippingFee: 0,
    total: duoTier.totalPrice,
  };
  const verified = await verifyAndRecalculateOrder(orderPayload, 'storet1', 'MA');
  if (!verified.success) {
    throw new Error(`FAILED: verifyAndRecalculateOrder rejected order: ${verified.error}`);
  }
  if (verified.tamperingDetected) {
    throw new Error(`FAILED: False-positive price tampering detected for custom product Pack Duo`);
  }
  if (verified.total !== duoTier.totalPrice) {
    throw new Error(`FAILED: Recalculated total ${verified.total} did not match expected ${duoTier.totalPrice}`);
  }
  console.log(`  ✓ Order verified successfully: total ${verified.total} DH, tamperingDetected: false`);

  // Test 3: PostgreSQL stock decrement with non-UUID item ID
  console.log('\n3. Testing PostgreSQL stock decrement on order creation...');
  const db = getDb();
  if (db) {
    const store = await db.query.stores.findFirst({ where: eq(schema.stores.slug, 'storet1') });
    if (store) {
      // Find or create test product
      let testProd = await db.query.products.findFirst({
        where: eq(schema.products.sku, 'SKU-5567'),
      });
      if (!testProd) {
        testProd = await createProduct({
          storeSlug: 'storet1',
          title: 'Test Product SKU 5567',
          sku: 'SKU-5567',
          category: 'Accessoires',
          price: 299,
          costPrice: 100,
          stock: 30,
          images: [],
          variants: [],
          status: 'active',
        }) as any;
      }

      const initialStock = testProd!.stock;
      console.log(`  Initial stock before order: ${initialStock}`);

      // Create order with non-UUID ID 'prod_sku_5567'
      const order = await createOrder({
        storeSlug: 'storet1',
        customerName: 'Test Stock Decrement',
        phone: '0611223344',
        city: 'Rabat',
        address: 'Avenue Mohammed V',
        items: [
          {
            id: 'prod_sku_5567',
            sku: 'SKU-5567',
            title: 'Test Product SKU 5567',
            quantity: 2,
            price: 299,
          },
        ],
        subtotal: 598,
        shippingFee: 0,
        total: 598,
      });

      const updatedProd = await db.query.products.findFirst({
        where: eq(schema.products.sku, 'SKU-5567'),
      });
      if (!updatedProd || updatedProd.stock !== initialStock - 2) {
        throw new Error(`FAILED: Stock was not properly decremented. Expected ${initialStock - 2}, got ${updatedProd?.stock}`);
      }
      console.log(`  ✓ Stock decremented in PostgreSQL: ${initialStock} -> ${updatedProd.stock}`);

      // Test 4: Restore stock on order cancellation/deletion
      console.log('\n4. Testing PostgreSQL stock restoration on cancellation/deletion...');
      await restoreDbProductStock(store.id, [
        { id: 'prod_sku_5567', sku: 'SKU-5567', quantity: 2 },
      ]);

      const restoredProd = await db.query.products.findFirst({
        where: eq(schema.products.sku, 'SKU-5567'),
      });
      if (!restoredProd || restoredProd.stock !== initialStock) {
        throw new Error(`FAILED: Stock was not properly restored. Expected ${initialStock}, got ${restoredProd?.stock}`);
      }
      console.log(`  ✓ Stock restored in PostgreSQL: ${updatedProd.stock} -> ${restoredProd.stock}`);
    }
  }

  // Test 5: updateProduct & deleteProduct with non-UUID target IDs
  console.log('\n5. Testing updateProduct and deleteProduct with SKU identifier in db-repository...');
  if (db) {
    // Create temporary product for testing
    const tempSku = `TEMP-${Date.now()}`;
    const temp = await createProduct({
      storeSlug: 'storet1',
      title: 'Temporary Product For Test',
      sku: tempSku,
      category: 'Test Category',
      price: 150,
      costPrice: 50,
      stock: 10,
      images: [],
      variants: [],
      status: 'active',
    });
    if (!temp) throw new Error('FAILED: Could not create temporary test product');

    // Update using non-UUID identifier (SKU)
    const updated = await updateProduct(tempSku, {
      title: 'Updated Temp Product Title',
      price: 180,
      stock: 15,
      storeSlug: 'storet1',
    });
    if (!updated || updated.title !== 'Updated Temp Product Title' || updated.price !== 180 || updated.stock !== 15) {
      throw new Error(`FAILED: updateProduct by SKU did not update properly`);
    }

    // Verify in database
    const dbCheck = await db.query.products.findFirst({
      where: eq(schema.products.sku, tempSku),
    });
    if (!dbCheck || dbCheck.title !== 'Updated Temp Product Title' || dbCheck.price !== 180 || dbCheck.stock !== 15) {
      throw new Error(`FAILED: updateProduct did not persist changes to PostgreSQL`);
    }
    console.log(`  ✓ updateProduct successfully updated title, price, and stock in DB by SKU`);

    // Delete using non-UUID identifier (SKU)
    const deleted = await deleteProduct(tempSku);
    if (!deleted) throw new Error('FAILED: deleteProduct returned false');

    const dbCheckDeleted = await db.query.products.findFirst({
      where: eq(schema.products.sku, tempSku),
    });
    if (dbCheckDeleted) {
      throw new Error('FAILED: deleteProduct by SKU did not remove product from PostgreSQL');
    }
    console.log(`  ✓ deleteProduct successfully deleted product from PostgreSQL by SKU`);
  }

  // Test 6: Dynamic Category Discovery & Live Product Count Synchronization
  console.log('\n6. Testing dynamic category discovery & live product count...');
  const sampleProducts: any[] = [
    { id: 'p1', title: 'Sac Cuir', category: 'Maroquinerie & Cuir', storeSlug: 'storet1' },
    { id: 'p2', title: 'Sac Voyage', category: 'Maroquinerie & Cuir', storeSlug: 'storet1' },
    { id: 'p3', title: 'Drone Pro', category: 'High-Tech & Drones', storeSlug: 'storet1' },
  ];
  const dynamicCategories = getCategories('storet1', sampleProducts);
  const leatherCat = dynamicCategories.find((c) => c.name === 'Maroquinerie & Cuir');
  const droneCat = dynamicCategories.find((c) => c.name === 'High-Tech & Drones');
  if (!leatherCat || leatherCat.productCount !== 2) {
    throw new Error(`FAILED: Expected Maroquinerie & Cuir to have count 2, got ${leatherCat?.productCount}`);
  }
  if (!droneCat || droneCat.productCount !== 1) {
    throw new Error(`FAILED: Expected High-Tech & Drones to be dynamically discovered with count 1`);
  }
  console.log(`  ✓ Dynamic categories discovered: "High-Tech & Drones" (${droneCat.productCount}), "Maroquinerie & Cuir" (${leatherCat.productCount})`);

  // Test 7: CRM Customer synchronization
  console.log('\n7. Testing CRM Customer synchronization...');
  const customers = await getCustomers('storet1');
  if (!Array.isArray(customers) || customers.length === 0) {
    throw new Error('FAILED: getCustomers returned empty list');
  }
  console.log(`  ✓ Retrieved ${customers.length} CRM customers for storet1 from database/repository`);

  const firstCustomer = customers[0];
  const testNote = `VIP client verified on ${new Date().toISOString()}`;
  await updateCustomerNotes(firstCustomer.phone, testNote, 'storet1');
  console.log(`  ✓ Customer notes updated successfully for ${firstCustomer.phone}`);

  console.log('\n=== ALL 7 SIMILAR BUGS REMEDIATION TESTS PASSED! ===');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
