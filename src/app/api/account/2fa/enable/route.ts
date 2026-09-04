import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { verifyTOTP } from '@/lib/totp';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { secret, code } = await request.json();
    if (!secret || !code) {
      return NextResponse.json({ error: 'Secret et code à 6 chiffres requis' }, { status: 400 });
    }

    const isValid = verifyTOTP(code, secret);
    if (!isValid) {
      return NextResponse.json({ error: 'Code de vérification 2FA invalide ou expiré' }, { status: 400 });
    }

    const db = getDb();
    if (db) {
      const accountId = session.accountId || session.userId;
      await db
        .update(schema.accounts)
        .set({
          is2faEnabled: 'true',
          twoFactorSecret: secret,
          updatedAt: new Date(),
        })
        .where(eq(schema.accounts.id, accountId));
    }

    return NextResponse.json({
      success: true,
      message: 'Authentification à deux facteurs activée avec succès !',
    });
  } catch (err: any) {
    console.error('[2FA Enable] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de l activation 2FA' }, { status: 500 });
  }
}
