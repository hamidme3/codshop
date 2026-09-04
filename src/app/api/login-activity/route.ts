import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAccountSessions } from '@/lib/db-repository';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const sessions = await getAccountSessions(accountId);

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('[Login Activity API] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de charger l historique des sessions' },
      { status: 500 }
    );
  }
}
