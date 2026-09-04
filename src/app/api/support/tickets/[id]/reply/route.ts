import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { addTicketMessage, getSupportTicketById } from '@/lib/db-repository';

export async function POST(
  req: Request,
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

    if (ticket.status === 'closed') {
      return NextResponse.json(
        { error: 'Ce ticket est fermé. Veuillez créer un nouveau ticket si nécessaire.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { message, attachments } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Le message ne peut pas être vide' },
        { status: 400 }
      );
    }

    const newMsg = await addTicketMessage({
      ticketId,
      senderType: 'merchant',
      senderId: accountId,
      message: message.trim(),
      attachments: attachments || [],
    });

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (error: any) {
    console.error('[Support Ticket Reply POST] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l envoi de la réponse' },
      { status: 500 }
    );
  }
}
