import { NextResponse } from 'next/server';
import { createStore, getStoreBySlug } from '@/lib/stores';
import { getStorefrontUrl } from '@/lib/store-urls';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, whatsapp, niche, themeId, city } = body;

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: 'Le nom de la boutique et le numéro WhatsApp sont obligatoires' },
        { status: 400 }
      );
    }

    const requestedSlug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-');
    
    // Check if store already exists
    const existing = getStoreBySlug(requestedSlug);
    if (existing) {
      return NextResponse.json(
        { error: 'Ce nom de boutique est déjà réservé. Veuillez en choisir un autre.' },
        { status: 409 }
      );
    }

    const newStore = createStore({
      name,
      slug: requestedSlug,
      whatsapp,
      city: city || 'Casablanca',
      niche: niche || 'fashion',
      themeId: themeId || 'luxury',
    });

    // Also persist store & create owner user in PostgreSQL DB repository
    let dbUser: any = null;
    let sessionToken: string | null = null;

    try {
      const { createStore: createDbStore, createStoreUser } = await import('@/lib/db-repository');
      const { hashPassword, signSessionToken } = await import('@/lib/auth');

      const userEmail = body.email?.toLowerCase().trim() || `${requestedSlug}@codshop.vipone.site`;
      const plainPassword = body.password || 'admin123456';
      const passwordHash = await hashPassword(plainPassword);

      const dbStore = await createDbStore({
        name,
        slug: requestedSlug,
        email: userEmail,
        phone: whatsapp,
        planTier: 'starter',
      });

      if (dbStore && dbStore.id) {
        dbUser = await createStoreUser({
          storeId: dbStore.id,
          email: userEmail,
          name: name,
          passwordHash,
          role: 'owner',
        });

        sessionToken = await signSessionToken({
          userId: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          storeId: dbStore.id,
          storeSlug: requestedSlug,
          role: 'owner',
        });
      }
    } catch (dbErr) {
      console.warn('[Store DB Notice] DB persist/user creation fallback:', dbErr);
    }

    console.log(`[Store Provisioned] ${newStore.name} (${newStore.slug}) - 14 Days Free Trial Active`);

    const response = NextResponse.json({
      success: true,
      store: newStore,
      message: 'Boutique créée avec succès ! Votre essai gratuit de 14 jours a commencé.',
      previewUrl: getStorefrontUrl(newStore.slug),
      adminUrl: `/admin/builder?store=${newStore.slug}`,
    });

    if (sessionToken) {
      const { SESSION_COOKIE_NAME } = await import('@/lib/auth');
      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error: any) {
    console.error('[Store Registration Error]:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la boutique' },
      { status: 500 }
    );
  }
}
