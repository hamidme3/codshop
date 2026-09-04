import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateSecret, generateTOTPUri } from '@/lib/totp';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const secret = generateSecret();
    const uri = generateTOTPUri(session.email, 'CODShop Morocco', secret);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`;

    return NextResponse.json({
      secret,
      uri,
      qrCodeUrl,
    });
  } catch (err: any) {
    console.error('[2FA Generate] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de la génération 2FA' }, { status: 500 });
  }
}
