import { NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const db = getDb();
    let account = null;
    if (db) {
      account = await db.query.accounts.findFirst({
        where: eq(schema.accounts.email, email.toLowerCase().trim()),
      });
    }

    // Generate token even if account doesn't exist for anti-enumeration security
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetUrl = `/sso/password-reset?token=${resetToken}&email=${encodeURIComponent(email)}`;

    return NextResponse.json({
      success: true,
      message: 'Si cet email correspond à un compte CODShop, un lien de réinitialisation a été envoyé.',
      resetUrl, // Provided for developer testing and simulator
    });
  } catch (error: any) {
    console.error('[Forgot Password POST] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement' }, { status: 500 });
  }
}
