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
        let queryStore = searchParams.get('store');
        const queryStoreId = searchParams.get('storeId');

        if (!queryStore) {
          queryStore = request.headers.get('x-store-slug');
        }

        if (!queryStore) {
          const referer = request.headers.get('referer');
          if (referer) {
            try {
              const refUrl = new URL(referer);
              queryStore = refUrl.searchParams.get('store');
              if (!queryStore) {
                const host = refUrl.hostname.toLowerCase();
                const rootDomain = (process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site').toLowerCase();
                if (host.endsWith(rootDomain) && host !== rootDomain && host !== `www.${rootDomain}`) {
                  queryStore = host.replace(`.${rootDomain}`, '');
                }
              }
            } catch {}
          }
        }

        if (queryStoreId) {
          storeId = queryStoreId;
        } else if (queryStore) {
          const storeRecord = await db.query.stores.findFirst({
            where: eq(schema.stores.slug, queryStore),
          });
          if (storeRecord) storeId = storeRecord.id;
        }

        if (!storeId) {
          // If still no store resolved, check for any configured ad integration
          const activeIntegration = await db.query.adIntegrations.findFirst();
          if (activeIntegration) {
            storeId = activeIntegration.storeId;
          } else {
            const defaultStore = await db.query.stores.findFirst();
            if (defaultStore) storeId = defaultStore.id;
          }
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
    return NextResponse.json({ error: 'Error loading pixels' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const storeId = session.activeStoreId || session.storeId;
    const body = await request.json();
    const db = getDb();

    if (!db) {
      return NextResponse.json({ success: true, message: 'Pixels saved (fallback mode).' });
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
      message: 'Ad pixels updated successfully',
    });
  } catch (err: any) {
    console.error('[Ads Pixels API] Error:', err);
    return NextResponse.json({ error: 'Error saving ad pixels' }, { status: 500 });
  }
}
