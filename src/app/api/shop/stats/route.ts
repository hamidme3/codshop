import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getConsolidatedShopStats } from '@/lib/db-repository';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const stats = await getConsolidatedShopStats(accountId);

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('[Shop Stats API] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de calculer les statistiques consolidées' },
      { status: 500 }
    );
  }
}
