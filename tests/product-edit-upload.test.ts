import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatFileSize } from '../src/lib/client-image-compressor';
import {
  updateProduct,
  updateProductStock,
  PRODUCTS,
  getProducts,
} from '../src/lib/mocks';

describe('Product Edit & Image Upload Acceleration Test Suite', () => {
  it('formatFileSize should format bytes into readable Ko and Mo', () => {
    assert.equal(formatFileSize(500), '500 B');
    assert.equal(formatFileSize(150 * 1024), '150 Ko');
    assert.equal(formatFileSize(4.5 * 1024 * 1024), '4.5 Mo');
  });

  it('updateProduct should update an existing mock product by ID', () => {
    const existing = PRODUCTS[0];
    assert.ok(existing, 'At least one mock product should exist');

    const updated = updateProduct(existing.id, {
      title: 'Sacoche Atlas Cuir Premium Test',
      price: 389,
      images: ['/api/uploads/media/prod_test_image.webp'],
    });

    assert.ok(updated, 'updateProduct should return updated object');
    assert.equal(updated.title, 'Sacoche Atlas Cuir Premium Test');
    assert.equal(updated.price, 389);
    assert.deepEqual(updated.images, ['/api/uploads/media/prod_test_image.webp']);
  });

  it('updateProduct should match and update by SKU if ID differs', () => {
    const existing = PRODUCTS[1];
    assert.ok(existing, 'Second mock product should exist');

    const updated = updateProduct('unknown-custom-id', {
      sku: existing.sku,
      price: 499,
      title: 'Mocassins Royal Suede Updated',
    });

    assert.ok(updated, 'Should find and update product by SKU');
    assert.equal(updated.price, 499);
    assert.equal(updated.title, 'Mocassins Royal Suede Updated');
  });

  it('updateProduct should upsert unknown DB UUID product without returning null', () => {
    const unknownDbUuid = 'd89f1092-74c1-4820-94fa-9bc2ea541e22';
    const initialCount = PRODUCTS.length;

    const result = updateProduct(unknownDbUuid, {
      title: 'Huile d Argan Pure Atlas Bio',
      storeSlug: 'ottavio',
      price: 199,
      stock: 45,
      images: [
        '/api/uploads/media/prod_argan_1.webp',
        '/api/uploads/media/prod_argan_2.webp',
      ],
      variants: [{ size: '100ml', stock: 45, sku: 'ARG-100' }],
    });

    assert.ok(result, 'updateProduct must NEVER return null for unknown DB UUID');
    assert.equal(result.id, unknownDbUuid);
    assert.equal(result.title, 'Huile d Argan Pure Atlas Bio');
    assert.equal(result.price, 199);
    assert.equal(result.stock, 45);
    assert.equal(result.images.length, 2);
    assert.equal(PRODUCTS.length, initialCount + 1);

    // Verify it is now retrievable via getProducts
    const storeProducts = getProducts('ottavio');
    const found = storeProducts.find((p) => p.id === unknownDbUuid);
    assert.ok(found, 'Upserted product must be present in store products');
    assert.equal(found.title, 'Huile d Argan Pure Atlas Bio');
  });

  it('updateProductStock should update stock for both existing and newly upserted products', () => {
    const prodId = 'd89f1092-74c1-4820-94fa-9bc2ea541e22';
    const success = updateProductStock(prodId, 88);

    assert.equal(success, true);
    const prod = PRODUCTS.find((p) => p.id === prodId);
    assert.ok(prod);
    assert.equal(prod.stock, 88);
  });

  it('updateProduct should correctly preserve and update images array', () => {
    const prodId = 'd89f1092-74c1-4820-94fa-9bc2ea541e22';
    const newImages = [
      '/api/uploads/media/photo_1_retina.webp',
      '/api/uploads/media/photo_2_thumb.webp',
      '/api/uploads/media/photo_3_gallery.webp',
    ];

    const updated = updateProduct(prodId, { images: newImages });
    assert.ok(updated);
    assert.deepEqual(updated.images, newImages);
  });
});
