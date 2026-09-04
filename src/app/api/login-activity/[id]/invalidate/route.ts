import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { invalidateSession } from '@/lib/db-repository';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;
    const accountId = session.accountId || session.userId;

    const success = await invalidateSession(id, accountId);
    if (!success) {
      return NextResponse.json(
        { error: 'Session introuvable ou déjà révoquée' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Session révoquée avec succès.',
    });
  } catch (error: any) {
    console.error('[Invalidate Session API] Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la révocation de la session' },
      { status: 500 }
    );
  }
}
