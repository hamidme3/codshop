import { NextResponse } from 'next/server';
import { findUserByEmail, recordUserSession, getAccountStores } from '@/lib/db-repository';
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

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

