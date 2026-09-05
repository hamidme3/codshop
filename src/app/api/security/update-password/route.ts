import { NextResponse } from 'next/server';
import { getSession, hashPassword, verifyPassword } from '@/lib/auth';
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
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit comporter au moins 6 caractères' },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ success: true, message: 'Mot de passe mis à jour' });
    }

    const account = await db.query.accounts.findFirst({
      where: eq(schema.accounts.id, accountId),
    });

    if (!account) {
      return NextResponse.json({ error: 'Compte introuvable' }, { status: 404 });
    }

    if (account.passwordHash) {
      const match = await verifyPassword(currentPassword, account.passwordHash);
      if (!match) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est incorrect' },
          { status: 400 }
        );
      }
    }

    const newHash = await hashPassword(newPassword);
    await db
      .update(schema.accounts)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(schema.accounts.id, accountId));

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès',
    });
  } catch (error: any) {
    console.error('[Update Password POST] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de mettre à jour le mot de passe' },
      { status: 500 }
    );
  }
}
