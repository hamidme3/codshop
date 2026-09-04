import { NextResponse } from 'next/server';
import { getSession, verifyPassword } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis pour désactiver la 2FA' }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ success: true, message: '2FA désactivée' });
    }

    const accountId = session.accountId || session.userId;
    const account = await db.query.accounts.findFirst({
      where: eq(schema.accounts.id, accountId),
    });

    if (!account || !account.passwordHash) {
      return NextResponse.json({ error: 'Compte introuvable' }, { status: 404 });
    }

    const isValid = await verifyPassword(password, account.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    await db
      .update(schema.accounts)
      .set({
        is2faEnabled: 'false',
        twoFactorSecret: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.accounts.id, accountId));

    return NextResponse.json({
      success: true,
      message: 'Authentification à deux facteurs désactivée avec succès.',
    });
  } catch (err: any) {
    console.error('[2FA Disable] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de la désactivation' }, { status: 500 });
  }
}
