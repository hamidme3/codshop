import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const storeId = session.activeStoreId || session.storeId;
    const db = getDb();

    if (!db) {
      return NextResponse.json({
        metaPixelId: '',
        tiktokPixelId: '',
        snapchatPixelId: '',
        googleAnalyticsId: '',
        googleMerchantCenterId: '',
        pinterestPartnerId: '',
        pinterestCreditClaimed: false,
      });
    }

    const integration = await db.query.adIntegrations.findFirst({
      where: eq(schema.adIntegrations.storeId, storeId),
    });

    if (!integration) {
      return NextResponse.json({
        metaPixelId: '',
        tiktokPixelId: '',
        snapchatPixelId: '',
        googleAnalyticsId: '',
        googleMerchantCenterId: '',
        pinterestPartnerId: '',
        pinterestCreditClaimed: false,
      });
    }

    return NextResponse.json({
      metaPixelId: integration.metaPixelId || '',
      tiktokPixelId: integration.tiktokPixelId || '',
      snapchatPixelId: integration.snapchatPixelId || '',
      googleAnalyticsId: integration.googleAnalyticsId || '',
      googleMerchantCenterId: integration.googleMerchantCenterId || '',
      pinterestPartnerId: integration.pinterestPartnerId || '',
      pinterestCreditClaimed: integration.pinterestCreditClaimed === 'true',
    });
  } catch (err: any) {
    console.error('[Ads Status API] Error:', err);
    return NextResponse.json({ error: 'Erreur chargement pixels' }, { status: 500 });
  }
}
