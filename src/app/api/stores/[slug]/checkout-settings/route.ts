import { NextResponse } from 'next/server';
import { getStoreCheckoutSettings, updateStoreCheckoutSettings } from '@/lib/db-repository';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const settings = await getStoreCheckoutSettings(slug);
    return NextResponse.json({
      success: true,
      storeSlug: slug,
      checkoutEmailMode: settings.checkoutEmailMode,
    });
  } catch (error: any) {
    console.error('[Store Checkout Settings API] GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving checkout settings' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { checkoutEmailMode } = body;

    if (!checkoutEmailMode || typeof checkoutEmailMode !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid checkoutEmailMode parameter' },
        { status: 400 }
      );
    }

    const result = await updateStoreCheckoutSettings(slug, { checkoutEmailMode });
    return NextResponse.json({
      success: true,
      storeSlug: slug,
      checkoutEmailMode: result.checkoutEmailMode,
      message: 'Checkout settings updated successfully',
    });
  } catch (error: any) {
    console.error('[Store Checkout Settings API] POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating checkout settings' },
      { status: 500 }
    );
  }
}
