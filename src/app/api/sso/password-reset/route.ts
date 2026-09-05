import { NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Données manquantes (token, email ou mot de passe)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit comporter au moins 6 caractères' },
        { status: 400 }
      );
    }

    const db = getDb();
    if (db) {
      const account = await db.query.accounts.findFirst({
        where: eq(schema.accounts.email, email.toLowerCase().trim()),
      });

      if (account) {
        const newHash = await hashPassword(password);
        await db
          .update(schema.accounts)
          .set({
            passwordHash: newHash,
            updatedAt: new Date(),
          })
          .where(eq(schema.accounts.id, account.id));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    });
  } catch (error: any) {
    console.error('[Password Reset POST] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de réinitialiser le mot de passe' },
      { status: 500 }
    );
  }
}
