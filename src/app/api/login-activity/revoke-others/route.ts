import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { revokeOtherSessions } from '@/lib/db-repository';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    let body = {};
    try {
      body = await req.json();
    } catch {}

    const { currentSessionId } = body as { currentSessionId?: string };
    const success = await revokeOtherSessions(accountId, currentSessionId);

    return NextResponse.json({
      success,
      message: 'Toutes les autres sessions ont été révoquées avec succès.',
    });
  } catch (error: any) {
    console.error('[Revoke Others API] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de révoquer les autres sessions' },
      { status: 500 }
    );
  }
}
