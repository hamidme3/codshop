import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isSuperadmin, superadminOnly } from '../src/access/roles';
import { Users } from '../src/collections/Users';
import { Stores } from '../src/collections/Stores';
import { Products } from '../src/collections/Products';
import { Media } from '../src/collections/Media';
import { Pages } from '../src/collections/Pages';

describe('Payload Superadmin Exclusive Access Control Suite', () => {
  const superadminUser = { id: 'usr-super-1', email: 'admin@codshop.vipone.site', role: 'superadmin' };
  const storeOwnerUser = { id: 'usr-owner-1', email: 'merchant@ottavio.ma', role: 'store_owner', store: 'store-ottavio-uuid' };
  const anonymousReq = { req: { user: null } };
  const superadminReq = { req: { user: superadminUser } };
  const storeOwnerReq = { req: { user: storeOwnerUser } };

  it('isSuperadmin helper correctly distinguishes roles', () => {
    assert.strictEqual(isSuperadmin(superadminUser), true);
    assert.strictEqual(isSuperadmin(storeOwnerUser), false);
    assert.strictEqual(isSuperadmin(null), false);
    assert.strictEqual(isSuperadmin(undefined), false);
  });

  it('superadminOnly grants access strictly to superadmins', () => {
    assert.strictEqual(superadminOnly(superadminReq as any), true);
    assert.strictEqual(superadminOnly(storeOwnerReq as any), false);
    assert.strictEqual(superadminOnly(anonymousReq as any), false);
  });

  it('Users.access.admin restricts Payload Studio (/cms) strictly to Superadmin', () => {
    const adminGuard = Users.access?.admin;
    assert.ok(adminGuard);
    assert.strictEqual(typeof adminGuard, 'function');

    // Superadmin is granted access to /cms
    assert.strictEqual(adminGuard(superadminReq as any), true);

    // Store merchants are strictly blocked from /cms
    assert.strictEqual(adminGuard(storeOwnerReq as any), false);

    // Anonymous visitors are strictly blocked
    assert.strictEqual(adminGuard(anonymousReq as any), false);
  });

  it('Stores, Products, Media, and Pages collections enforce Superadmin-only management', () => {
    // Stores
    assert.strictEqual(Stores.access?.read?.(superadminReq as any), true);
    assert.strictEqual(Stores.access?.read?.(storeOwnerReq as any), false);
    assert.strictEqual(Stores.access?.create?.(superadminReq as any), true);
    assert.strictEqual(Stores.access?.create?.(storeOwnerReq as any), false);

    // Products
    assert.strictEqual(Products.access?.read?.(superadminReq as any), true);
    assert.strictEqual(Products.access?.read?.(storeOwnerReq as any), false);
    assert.strictEqual(Products.access?.create?.(superadminReq as any), true);
    assert.strictEqual(Products.access?.create?.(storeOwnerReq as any), false);

    // Media & Pages: Publicly readable for storefront, but writes are Superadmin-only
    assert.strictEqual(Media.access?.read?.(anonymousReq as any), true);
    assert.strictEqual(Media.access?.create?.(superadminReq as any), true);
    assert.strictEqual(Media.access?.create?.(storeOwnerReq as any), false);

    assert.strictEqual(Pages.access?.read?.(anonymousReq as any), true);
    assert.strictEqual(Pages.access?.create?.(superadminReq as any), true);
    assert.strictEqual(Pages.access?.create?.(storeOwnerReq as any), false);
  });
});
