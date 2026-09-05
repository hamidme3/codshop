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
    let { firstName, lastName, phone, preferredLocale, name } = body;

    if (name && !firstName && !lastName) {
      const parts = name.trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || '';
    }

    const db = getDb();
    if (db) {
      await db
        .update(schema.accounts)
        .set({
          firstName: firstName !== undefined ? firstName : undefined,
          lastName: lastName !== undefined ? lastName : undefined,
          phone: phone !== undefined ? phone : undefined,
          preferredLocale: preferredLocale !== undefined ? preferredLocale : undefined,
          updatedAt: new Date(),
        })
        .where(eq(schema.accounts.id, accountId));
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès',
    });
  } catch (error: any) {
    console.error('[Account Update POST] Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}
