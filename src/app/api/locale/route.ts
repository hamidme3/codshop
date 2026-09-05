import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { locale } = await req.json();
    if (!locale || !['fr', 'ar', 'en'].includes(locale)) {
      return NextResponse.json({ error: 'Langue invalide' }, { status: 400 });
    }

    const session = await getSession();
    if (session) {
      const accountId = session.accountId || session.userId;
      const db = getDb();
      if (db) {
        await db
          .update(schema.accounts)
          .set({ preferredLocale: locale, updatedAt: new Date() })
          .where(eq(schema.accounts.id, accountId));
      }
    }

    const response = NextResponse.json({ success: true, locale });
    response.cookies.set({
      name: 'codshop_locale',
      value: locale,
      path: '/',
      maxAge: 31536000,
    });

    return response;
  } catch (error: any) {
    console.error('[Locale API] Error:', error);
    return NextResponse.json({ error: 'Erreur lors du changement de langue' }, { status: 500 });
  }
}
