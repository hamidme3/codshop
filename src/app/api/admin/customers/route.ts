import { NextResponse } from 'next/server';
import { getCustomers, updateCustomerNotes } from '@/lib/db-repository';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = searchParams.get('store') || req.headers.get('x-user-store-slug') || req.headers.get('x-store-slug');

    if (!storeSlug) {
      return NextResponse.json({ success: false, message: 'Store slug is required' }, { status: 400 });
    }

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store slug' }, { status: 400 });
    }

    let customers: any[] = [];
    try {
      customers = await getCustomers(storeSlug);
    } catch (dbErr: any) {
      console.error('[API Admin Customers] DB fetch error:', dbErr);
      return NextResponse.json({ success: false, message: 'Database error fetching customers' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      customers,
      count: customers.length,
      store: storeSlug,
    });
  } catch (error: any) {
    console.error('[API Admin Customers] GET error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Error retrieving customers' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    let { storeSlug } = body;
    if (!storeSlug) storeSlug = req.headers.get('x-user-store-slug') || req.headers.get('x-store-slug');
    const { phone, notes } = body;
    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone is required' }, { status: 400 });
    }

    try {
      await updateCustomerNotes(phone, notes, storeSlug);
    } catch (dbErr: any) {
      console.error('[API Admin Customers] DB update error:', dbErr);
      return NextResponse.json({ success: false, message: 'Database error updating customer' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Customer notes saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Error' }, { status: 500 });
  }
}
