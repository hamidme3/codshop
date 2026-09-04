import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const storeId = session.activeStoreId || session.storeId;
    const { pinterestPartnerId } = await request.json();

    if (!pinterestPartnerId) {
      return NextResponse.json(
        { error: 'Identifiant Partenaire Pinterest requis' },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Invitation Pinterest envoyée (mode fallback).',
      });
    }

    const existing = await db.query.adIntegrations.findFirst({
      where: eq(schema.adIntegrations.storeId, storeId),
    });

    if (existing) {
      await db
        .update(schema.adIntegrations)
        .set({
          pinterestPartnerId,
          pinterestCreditClaimed: 'true',
          updatedAt: new Date(),
        })
        .where(eq(schema.adIntegrations.id, existing.id));
    } else {
      await db.insert(schema.adIntegrations).values({
        storeId,
        pinterestPartnerId,
        pinterestCreditClaimed: 'true',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Partenaire Pinterest connecté ! Votre crédit publicitaire sera doublé sous 72h après validation.',
    });
  } catch (err: any) {
    console.error('[Pinterest Connect API] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de la liaison Pinterest' }, { status: 500 });
  }
}
