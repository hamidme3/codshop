import { NextResponse } from 'next/server';
import { getStoreBySlug } from '@/lib/db-repository';
import { isValidStoreSlug } from '@/lib/sanitizer';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = (slug || '').toLowerCase().trim();

    if (!isValidStoreSlug(cleanSlug)) {
      return NextResponse.json({ success: false, message: 'Invalid store slug' }, { status: 400 });
    }

    const store = await getStoreBySlug(cleanSlug);
    if (!store) {
      return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 });
    }

    const trialEndsAtDate = (store as any).trialEndsAt ? new Date((store as any).trialEndsAt) : null;
    const now = Date.now();
    const daysRemaining = trialEndsAtDate
      ? Math.max(0, Math.ceil((trialEndsAtDate.getTime() - now) / (1000 * 60 * 60 * 24)))
      : 14;

    const planTier = (store as any).planTier || 'starter';
    const isPaid = ['pro', 'scale', 'growth'].includes(planTier.toLowerCase());

    return NextResponse.json({
      success: true,
      store: {
        id: (store as any).id,
        slug: (store as any).slug,
        name: (store as any).name,
        currency: (store as any).currency || 'MAD',
        country: (store as any).country || 'MA',
        planTier,
        isPaid,
        trialEndsAt: trialEndsAtDate?.toISOString() || null,
        daysRemainingInTrial: daysRemaining,
        isTrialActive: !isPaid && daysRemaining > 0,
        createdAt: (store as any).createdAt || null,
      },
    });
  } catch (error: any) {
    console.error('[Store Meta API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving store metadata' },
      { status: 500 }
    );
  }
}
