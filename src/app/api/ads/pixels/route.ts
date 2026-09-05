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
