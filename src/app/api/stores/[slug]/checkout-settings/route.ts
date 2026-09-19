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
      ...settings,
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
    const { 
      checkoutEmailMode,
      freeShippingThreshold,
      casaFee,
      rabatFee,
      otherCitiesFee,
      deliveryTimeframe,
    } = body;

    const updateData: any = {};
    if (checkoutEmailMode) updateData.checkoutEmailMode = checkoutEmailMode;
    if (typeof freeShippingThreshold === 'number') updateData.freeShippingThreshold = freeShippingThreshold;
    if (typeof casaFee === 'number') updateData.casaFee = casaFee;
    if (typeof rabatFee === 'number') updateData.rabatFee = rabatFee;
    if (typeof otherCitiesFee === 'number') updateData.otherCitiesFee = otherCitiesFee;
    if (typeof deliveryTimeframe === 'string') updateData.deliveryTimeframe = deliveryTimeframe;

    const result = await updateStoreCheckoutSettings(slug, updateData);
    return NextResponse.json({
      success: true,
      storeSlug: slug,
      ...result,
      message: 'Checkout & shipping settings updated successfully',
    });
  } catch (error: any) {
    console.error('[Store Checkout Settings API] POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating checkout settings' },
      { status: 500 }
    );
  }
}
