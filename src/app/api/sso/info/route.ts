import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { getAccountStores } from '@/lib/db-repository';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const db = getDb();

    let account = null;
    if (db) {
      account = await db.query.accounts.findFirst({
        where: eq(schema.accounts.id, accountId),
      });
    }

    const storesData = await getAccountStores(accountId);

    const user = {
      id: accountId,
      email: account?.email || session.email,
      first_name: account?.firstName || session.name.split(' ')[0] || 'Marchand',
      last_name: account?.lastName || session.name.split(' ')[1] || 'COD',
      phone: account?.phone || '+212661234567',
      preferred_locale: account?.preferredLocale || 'fr',
      country_code: account?.countryCode || 'MA',
      address: account?.address || { firstLine: '', city: 'Casablanca', country: 'MA' },
      balance: { amount: 0, currency: 'MAD', localized: '0.00 DH' },
      is2faEnabled: account?.is2faEnabled === 'true',
      metadata: { has_password: Boolean(account?.passwordHash) },
    };

    return NextResponse.json({
      user,
      locale: user.preferred_locale,
      stores: storesData.data,
      managedStores: storesData.managedStores,
      portal_base_url: 'https://codshop.vipone.site',
      seller_area_base_url: 'https://codshop.vipone.site/admin',
    });
  } catch (error: any) {
    console.error('[SSO Info API] Error:', error);
    return NextResponse.json({ error: 'Impossible de charger les infos SSO' }, { status: 500 });
  }
}
