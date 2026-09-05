import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const body = await req.json();
    const { firstLine, street, city, postalCode, country } = body;

    const db = getDb();
    if (db) {
      await db
        .update(schema.accounts)
        .set({
          address: {
            firstLine: firstLine || street || '',
            city: city || 'Casablanca',
            postalCode: postalCode || '',
            country: country || 'MA',
          },
          updatedAt: new Date(),
        })
        .where(eq(schema.accounts.id, accountId));
    }

    return NextResponse.json({
      success: true,
      message: 'Adresse fiscale mise à jour avec succès',
    });
  } catch (error: any) {
    console.error('[Account Update Address POST] Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour de l adresse' }, { status: 500 });
  }
}
