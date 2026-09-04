import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAccountStores } from '@/lib/db-repository';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const result = await getAccountStores(accountId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Shop Stores API] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de charger la liste des boutiques' },
      { status: 500 }
    );
  }
}
