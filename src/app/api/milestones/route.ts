import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getConsolidatedShopStats, getMilestoneProgress } from '@/lib/db-repository';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const stats = await getConsolidatedShopStats(accountId);
    const milestones = getMilestoneProgress(stats.total_sales);

    return NextResponse.json({
      ...milestones,
      stats,
    });
  } catch (error: any) {
    console.error('[Milestones API] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de calculer les paliers de vente' },
      { status: 500 }
    );
  }
}
