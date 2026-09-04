import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { closeSupportTicket } from '@/lib/db-repository';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const { id: ticketId } = await params;

    const success = await closeSupportTicket(ticketId, accountId);

    if (!success) {
      return NextResponse.json(
        { error: 'Impossible de fermer le ticket' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ticket clôturé avec succès',
    });
  } catch (error: any) {
    console.error('[Support Ticket Close POST] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la clôture du ticket' },
      { status: 500 }
    );
  }
}
