import { NextResponse } from 'next/server';
import { getSession, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getAccountStores } from '@/lib/db-repository';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetStoreId = url.searchParams.get('store');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codshop.vipone.site';

  if (!targetStoreId) {
    return NextResponse.redirect(new URL('/admin', baseUrl));
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', baseUrl));
  }

  const accountId = session.accountId || session.userId;
  const { data: ownedStores, managedStores } = await getAccountStores(accountId);
  const allStores = [...ownedStores, ...managedStores];

  const targetStore = allStores.find((s) => s.id === targetStoreId || s.slug === targetStoreId);

  if (!targetStore) {
    return NextResponse.redirect(new URL('/admin?error=store_not_found', baseUrl));
  }

  // Generate updated session token with new active store
  const updatedToken = await signSessionToken({
    userId: session.userId,
    email: session.email,
    name: session.name,
    storeId: targetStore.id,
    storeSlug: targetStore.slug,
    role: targetStore.role || session.role,
    accountId,
    activeStoreId: targetStore.id,
    activeStoreSlug: targetStore.slug,
  });

  const response = NextResponse.redirect(new URL(`/admin?store=${targetStore.slug}`, baseUrl));
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: updatedToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
