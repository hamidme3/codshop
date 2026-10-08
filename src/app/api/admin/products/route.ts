import { NextResponse } from 'next/server';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/db-repository';
import { isValidStoreSlug } from '@/lib/sanitizer';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = req.headers.get('x-user-store-slug');

    if (!storeSlug || !isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store slug' }, { status: 400 });
    }

    // 1. Fetch products from DB
    let dbProducts: any[] = [];
    try {
      dbProducts = await getProducts(storeSlug);
    } catch (err: any) {
      console.error('[API Admin Products] DB fetch error:', err);
      return NextResponse.json({ success: false, message: 'Database error fetching products' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      products: dbProducts,
      count: dbProducts.length,
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
    const storeSlug = req.headers.get('x-user-store-slug');
    if (!storeSlug) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    
    // storeSlug extracted from header

    const {
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
    const storeSlug = req.headers.get('x-user-store-slug');
    if (!storeSlug) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { productId, id, storeSlug: bodyStoreSlug, ...updates } = body;
    const targetId = productId || id;

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
    }

    const products = await getProducts(storeSlug);
    const ownsProduct = products.some(p => p.id === targetId || p.sku === targetId);
    if (!ownsProduct) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
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
    const storeSlug = req.headers.get('x-user-store-slug');
    if (!storeSlug) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

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

    const products = await getProducts(storeSlug);
    const ownsProduct = products.some(p => p.id === targetId || p.sku === targetId);
    if (!ownsProduct) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
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
