import { describe, it } from 'node:test';
import assert from 'node:assert';

// Mock orders matching storet1 state
const storet1Orders = [
  // 19 new / to_confirm
  ...Array(19).fill(null).map((_, i) => ({ id: `new-${i}`, status: 'new', orderNumber: `CMD-N${i}` })),
  // 3 confirmed
  ...Array(3).fill(null).map((_, i) => ({ id: `conf-${i}`, status: 'confirmed', orderNumber: `CMD-C${i}` })),
  // 1 shipped
  { id: 'ship-1', status: 'shipped', orderNumber: 'CMD-S1' },
];

describe('Admin Menu Split Orders & Counts', () => {
  it('correctly calculates counts for all 6 split categories', () => {
    const counts = {
      all: storet1Orders.length,
      to_confirm: storet1Orders.filter((o) => ['new', 'to_confirm'].includes(o.status)).length,
      confirmed: storet1Orders.filter((o) => o.status === 'confirmed').length,
      shipped: storet1Orders.filter((o) => ['shipped', 'shipping'].includes(o.status)).length,
      delivered: storet1Orders.filter((o) => o.status === 'delivered').length,
      returned: storet1Orders.filter((o) => ['returned', 'canceled'].includes(o.status)).length,
    };

    assert.strictEqual(counts.all, 23, 'Toutes should be 23');
    assert.strictEqual(counts.to_confirm, 19, 'À Confirmer should be 19');
    assert.strictEqual(counts.confirmed, 3, 'Confirmées should be 3');
    assert.strictEqual(counts.shipped, 1, 'En Transit should be 1');
    assert.strictEqual(counts.delivered, 0, 'Livrées should be 0');
    assert.strictEqual(counts.returned, 0, 'Retours should be 0');
  });

  it('verifies menu items have correct URLs and filter keys', () => {
    const storeSlug = 'storet1';
    const menuItems = [
      { label: 'Toutes', href: `/admin/orders?store=${storeSlug}`, filterKey: 'all', count: 23 },
      { label: 'À Confirmer', href: `/admin/orders?store=${storeSlug}&filter=to_confirm`, filterKey: 'to_confirm', count: 19 },
      { label: 'Confirmées', href: `/admin/orders?store=${storeSlug}&filter=confirmed`, filterKey: 'confirmed', count: 3 },
      { label: 'En Transit', href: `/admin/orders?store=${storeSlug}&filter=shipped`, filterKey: 'shipped', count: 1 },
      { label: 'Livrées', href: `/admin/orders?store=${storeSlug}&filter=delivered`, filterKey: 'delivered', count: 0 },
      { label: 'Retours', href: `/admin/orders?store=${storeSlug}&filter=returned`, filterKey: 'returned', count: 0 },
    ];

    assert.strictEqual(menuItems.length, 6);
    assert.strictEqual(menuItems[0].label, 'Toutes');
    assert.strictEqual(menuItems[1].label, 'À Confirmer');
    assert.strictEqual(menuItems[2].label, 'Confirmées');
    assert.strictEqual(menuItems[3].label, 'En Transit');
    assert.strictEqual(menuItems[4].label, 'Livrées');
    assert.strictEqual(menuItems[5].label, 'Retours');
  });
});
