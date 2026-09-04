import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupportTickets, createSupportTicket } from '@/lib/db-repository';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const tickets = await getSupportTickets(accountId);

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('[Support Tickets GET] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tickets' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const body = await req.json();

    const { subject, department, priority, message, attachments, storeId } = body;

    if (!subject || !department || !message) {
      return NextResponse.json(
        { error: 'Veuillez renseigner le sujet, le département et votre message' },
        { status: 400 }
      );
    }

    const ticket = await createSupportTicket({
      accountId,
      storeId: storeId || session.activeStoreId || undefined,
      subject,
      department,
      priority: priority || 'normal',
      message,
      attachments: attachments || [],
    });

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket créé avec succès',
    });
  } catch (error: any) {
    console.error('[Support Tickets POST] Error:', error);
    return NextResponse.json(
      { error: 'Impossible de créer le ticket de support' },
      { status: 500 }
    );
  }
}
