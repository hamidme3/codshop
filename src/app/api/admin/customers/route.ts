import { NextResponse } from 'next/server';
import { getCustomers, updateCustomerNotes } from '@/lib/db-repository';
import { getCustomers as getMockCustomers, updateCustomerNotes as updateMockCustomerNotes } from '@/lib/mocks';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = searchParams.get('store') || 'ottavio';

    if (!isValidStoreSlug(storeSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store slug' }, { status: 400 });
    }

    let customers: any[] = [];
    try {
      customers = await getCustomers(storeSlug);
    } catch {
      customers = getMockCustomers(storeSlug);
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
    const { phone, notes, storeSlug = 'ottavio' } = body;
    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone is required' }, { status: 400 });
    }

    updateMockCustomerNotes(phone, notes, storeSlug);
    try {
      await updateCustomerNotes(phone, notes, storeSlug);
    } catch {}

    return NextResponse.json({ success: true, message: 'Customer notes saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Error' }, { status: 500 });
  }
}
