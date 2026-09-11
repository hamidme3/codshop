import { updateOrderStatus, getOrders, getCustomers, syncCustomersFromOrders, ORDERS } from '../src/lib/mocks';
import { Customer } from '../src/lib/types';

async function runCrmSyncTests() {
  console.log('🧪 Starting CRM 3-Stage Switch Synchronization Tests...');

  const storeSlug = 'ottavio';

  // 1. Initial baseline check
  const initialCustomers = getCustomers(storeSlug);
  if (!initialCustomers || initialCustomers.length === 0) {
    throw new Error('Initial CRM customer list should not be empty');
  }
  console.log(`  ✓ CRM initialized with ${initialCustomers.length} synchronized customer profiles.`);

  // 2. Test Step 1: [ 1. Confirmer ] (Cyan switch)
  const testOrderId = 'ord_101'; // Karim Bennani
  const confirmedSuccess = updateOrderStatus(testOrderId, 'confirmed');
  if (!confirmedSuccess) {
    throw new Error('Failed to update status to confirmed');
  }

  const customersAfterConfirm = getCustomers(storeSlug);
  const karim = customersAfterConfirm.find((c) => c.phone.includes('661234567') || c.name.includes('Karim'));
  if (!karim) {
    throw new Error('Customer Karim Bennani not found in CRM after confirmation');
  }
  if (karim.lastOrderStatus !== 'confirmed') {
    throw new Error(`Expected lastOrderStatus 'confirmed', got '${karim.lastOrderStatus}'`);
  }
  if ((karim.confirmedOrders || 0) < 1) {
    throw new Error(`Expected confirmedOrders >= 1, got ${karim.confirmedOrders}`);
  }
  console.log('  ✓ Step 1 [ 1. Confirmer ] (Cyan) synchronized with CRM customer profile.');

  // 3. Test Step 2: [ 2. Expédier ] (Orange switch) with tracking code
  const testTracking = 'OZON-MA-994411';
  const shippedSuccess = updateOrderStatus(testOrderId, 'shipped', testTracking, 'ozon');
  if (!shippedSuccess) {
    throw new Error('Failed to update status to shipped');
  }

  const customersAfterShip = getCustomers(storeSlug);
  const karimShipped = customersAfterShip.find((c) => c.phone.includes('661234567') || c.name.includes('Karim'));
  if (!karimShipped) {
    throw new Error('Customer not found after shipment');
  }
  if (karimShipped.lastOrderStatus !== 'shipped') {
    throw new Error(`Expected lastOrderStatus 'shipped', got '${karimShipped.lastOrderStatus}'`);
  }
  if (karimShipped.lastTrackingNumber !== testTracking) {
    throw new Error(`Expected lastTrackingNumber '${testTracking}', got '${karimShipped.lastTrackingNumber}'`);
  }
  if ((karimShipped.shippedOrders || 0) < 1) {
    throw new Error(`Expected shippedOrders >= 1, got ${karimShipped.shippedOrders}`);
  }
  console.log('  ✓ Step 2 [ 2. Expédier ] (Orange) with tracking code synchronized with CRM.');

  // 4. Test Step 3: [ 3. Livrée ] (Green switch) with cash collection
  const deliveredSuccess = updateOrderStatus(testOrderId, 'delivered');
  if (!deliveredSuccess) {
    throw new Error('Failed to update status to delivered');
  }

  const customersAfterDeliver = getCustomers(storeSlug);
  const karimDelivered = customersAfterDeliver.find((c) => c.phone.includes('661234567') || c.name.includes('Karim'));
  if (!karimDelivered) {
    throw new Error('Customer not found after delivery');
  }
  if (karimDelivered.lastOrderStatus !== 'delivered') {
    throw new Error(`Expected lastOrderStatus 'delivered', got '${karimDelivered.lastOrderStatus}'`);
  }
  if ((karimDelivered.deliveredOrders || 0) < 1) {
    throw new Error(`Expected deliveredOrders >= 1, got ${karimDelivered.deliveredOrders}`);
  }
  if (karimDelivered.totalSpend < 600) {
    throw new Error(`Expected totalSpend >= 600 DH, got ${karimDelivered.totalSpend}`);
  }
  if (karimDelivered.deliverySuccessRate !== 100) {
    throw new Error(`Expected 100% deliverySuccessRate, got ${karimDelivered.deliverySuccessRate}`);
  }
  console.log('  ✓ Step 3 [ 3. Livrée ] (Green) cash collected & delivery rate synchronized with CRM.');

  // 5. Test Return Risk Flag on Canceled / Returned Order
  const returnedOrderId = 'ord_106'; // Samir Alaoui
  const returnSuccess = updateOrderStatus(returnedOrderId, 'returned');
  if (!returnSuccess) {
    throw new Error('Failed to update status to returned');
  }

  const customersAfterReturn = getCustomers(storeSlug);
  const samir = customersAfterReturn.find((c) => c.name.includes('Samir') || c.phone.includes('622334455'));
  if (!samir) {
    throw new Error('Customer Samir Alaoui not found in CRM');
  }
  if (samir.status !== 'risk') {
    throw new Error(`Expected risk status for returned customer, got '${samir.status}'`);
  }
  if ((samir.returnedOrders || 0) < 1) {
    throw new Error(`Expected returnedOrders >= 1, got ${samir.returnedOrders}`);
  }
  console.log('  ✓ Return / Cancellation risk warning tag successfully triggered in CRM.');

  console.log('🎉 All CRM 3-Stage Switch Synchronization tests passed with 100% success!');
}

runCrmSyncTests().catch((err) => {
  console.error('❌ CRM sync test failed:', err);
  process.exit(1);
});
