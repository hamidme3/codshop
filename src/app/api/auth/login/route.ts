import { NextResponse } from 'next/server';
import { findUserByEmail, recordUserSession, getAccountStores } from '@/lib/db-repository';
import { verifyPassword, signSessionToken, sign2FAChallengeToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq, or } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Check account stores
    const accountStores = await getAccountStores(user.id);
    const primaryStore = accountStores.data[0] || {
      id: user.storeId,
      slug: user.store?.slug || 'ottavio',
    };

    const storeSlug = primaryStore.slug;
    const storeId = primaryStore.id;

    // 2FA guard — if user has 2FA enabled, require verification (findings #8 — critical bypass fix)
    const db = getDb();
    let is2faEnabled = false;
    if (db) {
      const account = await db.query.accounts.findFirst({
        where: or(
          eq(schema.accounts.id, user.id),
          eq(schema.accounts.email, user.email)
        ),
      });
      is2faEnabled = account?.is2faEnabled === 'true';
    } else {
      is2faEnabled = (user as unknown as { is2faEnabled?: boolean | string }).is2faEnabled === true ||
                     (user as unknown as { is2faEnabled?: boolean | string }).is2faEnabled === 'true';
    }

    if (is2faEnabled) {
      const challengeToken = await sign2FAChallengeToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        storeId: storeId,
        storeSlug: storeSlug,
        role: user.role,
        accountId: user.id,
        activeStoreId: storeId,
        activeStoreSlug: storeSlug,
      });

      return NextResponse.json(
        { success: false, error: '2FA verification required.', requires2fa: true, tempToken: challengeToken, challengeToken },
        { status: 403 }
      );
    }

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      storeId: storeId,
      storeSlug: storeSlug,
      role: user.role,
      accountId: user.id,
      activeStoreId: storeId,
      activeStoreSlug: storeSlug,
    });

    // Record session audit log
    const forwardedFor = request.headers.get('x-forwarded-for') || '196.200.150.12';
    const ipAddress = forwardedFor.split(',')[0].trim();
    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0';

    await recordUserSession({
      accountId: user.id,
      sessionToken: token,
      ipAddress,
      userAgent,
      browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Safari') ? 'Safari' : 'Firefox',
      os: userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Windows') ? 'Windows' : 'Linux / Mobile',
      city: 'Casablanca',
      country: 'Maroc',
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        storeSlug,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('[Auth API] Login error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}

