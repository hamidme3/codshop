import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const body = await request.json();
    const db = getDb();

    if (!db) {
      return NextResponse.json({
        success: true,
        message: 'Dossier soumis pour vérification (mode fallback).',
      });
    }

    const existing = await db.query.kycVerifications.findFirst({
      where: eq(schema.kycVerifications.accountId, accountId),
    });

    const payload = {
      accountId,
      entityType: body.entityType || 'auto_entrepreneur',
      status: 'pending', // submitted for compliance review
      companyName: body.companyName || null,
      iceNumber: body.iceNumber || null,
      taxId: body.taxId || null,
      rcNumber: body.rcNumber || null,
      rcCity: body.rcCity || null,
      cinNumber: body.cinNumber || null,
      bankRib: body.bankRib || null,
      bankName: body.bankName || null,
      documentUrls: body.documentUrls || existing?.documentUrls || {},
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(schema.kycVerifications)
        .set(payload)
        .where(eq(schema.kycVerifications.id, existing.id));
    } else {
      await db.insert(schema.kycVerifications).values(payload);
    }

    return NextResponse.json({
      success: true,
      message: 'Votre dossier de conformité a été soumis avec succès et est en cours d examen.',
      status: 'pending',
    });
  } catch (err: any) {
    console.error('[KYC Submit] Error:', err);
    return NextResponse.json({ error: 'Erreur lors de la soumission du dossier' }, { status: 500 });
  }
}
