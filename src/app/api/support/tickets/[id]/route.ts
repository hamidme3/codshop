import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupportTicketById } from '@/lib/db-repository';

export async function GET(
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

    const ticket = await getSupportTicketById(ticketId, accountId);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket introuvable' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error('[Support Ticket GET ID] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du ticket' },
      { status: 500 }
    );
  }
}
