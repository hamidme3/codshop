import { NextResponse } from 'next/server';
import { normalizeMoroccanPhone, generateAndStoreOtp } from '@/lib/phone-auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Numéro de téléphone marocain requis' },
        { status: 400 }
      );
    }

    const normalized = normalizeMoroccanPhone(phone);
    if (!normalized) {
      return NextResponse.json(
        { error: 'Format marocain invalide. Exemple: 0661234567 ou +212661234567' },
        { status: 400 }
      );
    }

    const otp = generateAndStoreOtp(normalized);
    console.log(`[SMS OTP SIMULATOR] Code for ${normalized}: ${otp}`);

    return NextResponse.json({
      success: true,
      message: `Code de confirmation envoyé par SMS au ${normalized}`,
      phone: normalized,
      // For development and testing visibility
      devOtp: otp,
    });
  } catch (err: any) {
    console.error('[Phone Auth API] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de l envoi du code SMS' }, { status: 500 });
  }
}
