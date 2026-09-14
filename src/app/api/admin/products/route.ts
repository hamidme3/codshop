import { NextResponse } from 'next/server';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/db-repository';
import { getProducts as getMockProducts, PRODUCTS } from '@/lib/mocks';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = searchParams.get('store') || 'ottavio';

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store slug' }, { status: 400 });
    }

    // 1. Fetch products from DB
    let dbProducts: any[] = [];
    try {
      dbProducts = await getProducts(storeSlug);
    } catch (err) {
      console.warn('[API Admin Products] Fallback to mock products:', err);
      dbProducts = getMockProducts(storeSlug);
    }

    // 2. Fetch in-memory products for this store
    const memProducts = PRODUCTS.filter((p) => p.storeSlug === storeSlug);

    // 3. Merge without duplicate SKUs/IDs (DB takes precedence)
    const existingIds = new Set(dbProducts.map((p) => p.id));
    const existingSkus = new Set(dbProducts.map((p) => p.sku?.toLowerCase()).filter(Boolean));
    const combined = [...dbProducts];

    for (const mp of memProducts) {
      const skuLower = mp.sku?.toLowerCase();
      if (!existingIds.has(mp.id) && (!skuLower || !existingSkus.has(skuLower))) {
        combined.push(mp);
        existingIds.add(mp.id);
        if (skuLower) existingSkus.add(skuLower);
      }
    }

    return NextResponse.json({
      success: true,
      products: combined,
      count: combined.length,
      store: storeSlug,
    });
  } catch (error: any) {
    console.error('[API Admin Products] GET error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      storeSlug = 'ottavio',
      title,
      sku,
      category,
      price,
      comparePrice,
      costPrice,
      stock,
      images,
      variants,
      status = 'active',
      badge,
      packDuoPrice,
      packDuoFreeShipping,
      packTrioPrice,
      packTrioGift,
      description,
    } = body;

    if (!title || price === undefined) {
      return NextResponse.json(
        { success: false, message: 'Title and price are required' },
        { status: 400 }
      );
    }

    const created = await createProduct({
      storeSlug,
      title: title.trim(),
      sku: sku ? sku.trim() : `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category ? category.trim() : 'General',
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      costPrice: Number(costPrice) || 0,
      stock: Number(stock) || 0,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'],
      variants: Array.isArray(variants) ? variants : [{ size: 'Unique', stock: Number(stock) || 0 }],
      status: status || 'active',
      badge,
      packDuoPrice: packDuoPrice ? Number(packDuoPrice) : undefined,
      packDuoFreeShipping: Boolean(packDuoFreeShipping),
      packTrioPrice: packTrioPrice ? Number(packTrioPrice) : undefined,
      packTrioGift,
      description,
    });

    return NextResponse.json({
      success: true,
      product: created,
      message: 'Product created successfully',
    });
  } catch (error: any) {
    console.error('[API Admin Products] POST error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error creating product' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { productId, id, ...updates } = body;
    const targetId = productId || id;

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const updated = await updateProduct(targetId, updates);

    return NextResponse.json({
      success: true,
      product: updated,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('[API Admin Products] PATCH error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idFromQuery = searchParams.get('id');
    let targetId = idFromQuery;

    if (!targetId) {
      try {
        const body = await req.json();
        targetId = body.id || body.productId;
      } catch {}
    }

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    await deleteProduct(targetId);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('[API Admin Products] DELETE error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error deleting product' },
      { status: 500 }
    );
  }
}
