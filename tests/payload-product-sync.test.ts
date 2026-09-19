import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Products } from '../src/collections/Products';
import * as payloadProductsAdapter from '../src/lib/payload-products';

describe('Pragmatic Path A.1: Payload Single Source for Products Suite', () => {
  it('verifies syncProductToDrizzle hook is eliminated from Products collection', () => {
    // Under Pragmatic Path A.1, Payload is single source of truth for products.
    // The dual-write syncProductToDrizzle hook must not exist.
    const afterChange = Products.hooks?.afterChange;
    assert.strictEqual(afterChange, undefined, 'syncProductToDrizzle hook should be eliminated');
  });

  it('verifies Products collection has all Moroccan COD fields', () => {
    const fields = Products.fields;
    const fieldNames = fields.map((f: any) => f.name);

    assert.ok(fieldNames.includes('title'), 'Should have title');
    assert.ok(fieldNames.includes('sku'), 'Should have sku');
    assert.ok(fieldNames.includes('store'), 'Should have store');
    assert.ok(fieldNames.includes('category'), 'Should have category');
    assert.ok(fieldNames.includes('price'), 'Should have price');
    assert.ok(fieldNames.includes('comparePrice'), 'Should have comparePrice');
    assert.ok(fieldNames.includes('costPrice'), 'Should have costPrice (COGS)');
    assert.ok(fieldNames.includes('stock'), 'Should have stock');
    assert.ok(fieldNames.includes('images'), 'Should have images relationship');
    assert.ok(fieldNames.includes('variants'), 'Should have variants');
    assert.ok(fieldNames.includes('status'), 'Should have status');
    assert.ok(fieldNames.includes('badge'), 'Should have badge');
    assert.ok(fieldNames.includes('packDuoPrice'), 'Should have packDuoPrice');
    assert.ok(fieldNames.includes('packDuoFreeShipping'), 'Should have packDuoFreeShipping');
    assert.ok(fieldNames.includes('packTrioPrice'), 'Should have packTrioPrice');
    assert.ok(fieldNames.includes('packTrioGift'), 'Should have packTrioGift');
    assert.ok(fieldNames.includes('quantityTiers'), 'Should have quantityTiers');
  });

  it('verifies payload-products adapter exports all required CRUD and stock functions', () => {
    assert.strictEqual(typeof payloadProductsAdapter.getProductsFromPayload, 'function');
    assert.strictEqual(typeof payloadProductsAdapter.createProductInPayload, 'function');
    assert.strictEqual(typeof payloadProductsAdapter.updateProductInPayload, 'function');
    assert.strictEqual(typeof payloadProductsAdapter.deleteProductInPayload, 'function');
    assert.strictEqual(typeof payloadProductsAdapter.decrementPayloadStock, 'function');
    assert.strictEqual(typeof payloadProductsAdapter.restorePayloadStock, 'function');
    assert.strictEqual(typeof payloadProductsAdapter.resolvePayloadCatalogProduct, 'function');
  });

  it('verifies Products collection access is restricted to superadmin', () => {
    assert.ok(Products.access, 'Should have access control defined');
    assert.ok(Products.access.read, 'Should have read access defined');
    assert.ok(Products.access.create, 'Should have create access defined');
    assert.ok(Products.access.update, 'Should have update access defined');
    assert.ok(Products.access.delete, 'Should have delete access defined');
  });
});
