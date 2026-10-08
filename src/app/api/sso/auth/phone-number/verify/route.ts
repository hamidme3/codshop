import { NextResponse } from 'next/server';
import { normalizeMoroccanPhone, verifyStoredOtp } from '@/lib/phone-auth';
import { signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getAccountStores, recordUserSession } from '@/lib/db-repository';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: 'Téléphone et code OTP requis' }, { status: 400 });
    }

    const normalized = normalizeMoroccanPhone(phone);
    if (!normalized) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }

    const isValid = verifyStoredOtp(normalized, code);
    if (!isValid) {
      return NextResponse.json({ error: 'Code SMS incorrect ou expiré' }, { status: 400 });
    }

    const db = getDb();
    let account = null;

    if (db) {
      // Find existing account by phone
      account = await db.query.accounts.findFirst({
        where: eq(schema.accounts.phone, normalized),
      });

      if (!account) {
        return NextResponse.json({ error: 'Aucun compte associé à ce numéro' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Erreur de connexion à la base de données' }, { status: 500 });
    }

    const accountId = account.id;
    const email = account.email;
    const name = account.firstName ? `${account.firstName} ${account.lastName}` : 'Marchand';

    let storeId = '';
    let storeSlug = '';
    const accountStores = await getAccountStores(accountId);
    if (accountStores.data.length > 0) {
      storeId = accountStores.data[0].id;
      storeSlug = accountStores.data[0].slug;
    }

    const token = await signSessionToken({
      userId: accountId,
      email,
      name,
      storeId,
      storeSlug,
      role: 'owner',
      accountId,
      activeStoreId: storeId,
      activeStoreSlug: storeSlug,
    });

    // Record session
    const ipAddress = request.headers.get('cf-connecting-ip') || 
                      request.headers.get('x-real-ip') || 
                      request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                      '196.200.150.12';
    const userAgent = request.headers.get('user-agent') || 'Mobile SMS Login';

    await recordUserSession({
      accountId,
      sessionToken: token,
      ipAddress,
      userAgent,
      browser: 'Navigateur Mobile / SMS',
      os: 'Smartphone',
      city: 'Casablanca',
      country: 'Maroc',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentification par SMS réussie !',
      redirect: `/admin?store=${storeSlug}`,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('[Phone Verify API] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de la validation SMS' }, { status: 500 });
  }
}
