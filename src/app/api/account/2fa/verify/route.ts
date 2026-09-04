import { NextResponse } from 'next/server';
import { verifySessionToken, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { verifyTOTP } from '@/lib/totp';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { tempToken, code } = await request.json();
    if (!tempToken || !code) {
      return NextResponse.json({ error: 'Token temporaire et code 2FA requis' }, { status: 400 });
    }

    const payload = await verifySessionToken(tempToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Session temporaire expirée' }, { status: 401 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Base de données indisponible' }, { status: 500 });
    }

    const account = await db.query.accounts.findFirst({
      where: eq(schema.accounts.id, payload.userId),
    });

    if (!account || !account.twoFactorSecret) {
      return NextResponse.json({ error: '2FA non configurée sur ce compte' }, { status: 400 });
    }

    const isValid = verifyTOTP(code, account.twoFactorSecret);
    if (!isValid) {
      return NextResponse.json({ error: 'Code 2FA invalide' }, { status: 400 });
    }

    const finalToken = await signSessionToken({
      ...payload,
      role: payload.role || 'owner',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Vérification 2FA réussie.',
      user: payload,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: finalToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('[2FA Challenge Verify] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 });
  }
}
