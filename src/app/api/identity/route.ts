import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const accountId = session.accountId || session.userId;
    const db = getDb();

    if (!db) {
      return NextResponse.json({
        status: 'draft',
        entityType: 'auto_entrepreneur',
        companyName: '',
        cinNumber: '',
        bankName: 'Attijariwafa Bank',
        bankRib: '',
        documentUrls: {},
      });
    }

    const kyc = await db.query.kycVerifications.findFirst({
      where: eq(schema.kycVerifications.accountId, accountId),
    });

    if (!kyc) {
      return NextResponse.json({
        status: 'draft',
        entityType: 'auto_entrepreneur',
        companyName: '',
        cinNumber: '',
        bankName: 'Attijariwafa Bank',
        bankRib: '',
        documentUrls: {},
      });
    }

    return NextResponse.json(kyc);
  } catch (err: any) {
    console.error('[KYC API] Error:', err);
    return NextResponse.json({ error: 'Erreur chargement dossier KYC' }, { status: 500 });
  }
}
