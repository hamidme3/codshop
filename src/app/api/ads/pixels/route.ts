import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    const db = getDb();

    let storeId = session?.activeStoreId || session?.storeId;

    // If unauthenticated public storefront query
    if (!storeId && db) {
      try {
        const { searchParams } = new URL(request.url);
        const queryStore = searchParams.get('store');
        const queryStoreId = searchParams.get('storeId');

        if (queryStoreId) {
          storeId = queryStoreId;
        } else if (queryStore) {
          const storeRecord = await db.query.stores.findFirst({
            where: eq(schema.stores.slug, queryStore),
          });
          if (storeRecord) storeId = storeRecord.id;
        } else {
          // Fallback to default active store
          const defaultStore = await db.query.stores.findFirst();
          if (defaultStore) storeId = defaultStore.id;
        }
      } catch {
        // Fall through
      }
    }

    if (!db || !storeId) {
      return NextResponse.json({
        metaPixelId: '',
        tiktokPixelId: '',
        snapchatPixelId: '',
        googleAnalyticsId: '',
        googleMerchantCenterId: '',
        pinterestPartnerId: '',
      });
    }

    const integration = await db.query.adIntegrations.findFirst({
      where: eq(schema.adIntegrations.storeId, storeId),
    });

    return NextResponse.json({
      metaPixelId: integration?.metaPixelId || '',
      tiktokPixelId: integration?.tiktokPixelId || '',
      snapchatPixelId: integration?.snapchatPixelId || '',
      googleAnalyticsId: integration?.googleAnalyticsId || '',
      googleMerchantCenterId: integration?.googleMerchantCenterId || '',
      pinterestPartnerId: integration?.pinterestPartnerId || '',
    });
  } catch (err: any) {
    console.error('[Ads Pixels GET API] Error:', err);
    return NextResponse.json({ error: 'Erreur chargement pixels' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const storeId = session.activeStoreId || session.storeId;
    const body = await request.json();
    const db = getDb();

    if (!db) {
      return NextResponse.json({ success: true, message: 'Pixels enregistrés (mode fallback).' });
    }

    const existing = await db.query.adIntegrations.findFirst({
      where: eq(schema.adIntegrations.storeId, storeId),
    });

    const payload = {
      storeId,
      metaPixelId: body.metaPixelId || null,
      tiktokPixelId: body.tiktokPixelId || null,
      snapchatPixelId: body.snapchatPixelId || null,
      googleAnalyticsId: body.googleAnalyticsId || null,
      googleMerchantCenterId: body.googleMerchantCenterId || null,
      pinterestPartnerId: body.pinterestPartnerId || null,
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(schema.adIntegrations)
        .set(payload)
        .where(eq(schema.adIntegrations.id, existing.id));
    } else {
      await db.insert(schema.adIntegrations).values({
        ...payload,
        pinterestCreditClaimed: 'false',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Pixels publicitaires mis à jour avec succès !',
    });
  } catch (err: any) {
    console.error('[Ads Pixels API] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde des pixels' }, { status: 500 });
  }
}
