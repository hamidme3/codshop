import { NextResponse } from 'next/server';
import { resetStoreMenu } from '@/lib/db-repository';
import type { MenuPlacement } from '@/lib/types';

const VALID_PLACEMENTS: MenuPlacement[] = ['header', 'mobile_drawer', 'footer_col_1', 'footer_col_2'];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { placement } = body;

    if (!placement || !VALID_PLACEMENTS.includes(placement)) {
      return NextResponse.json(
        { success: false, error: `Invalid placement. Must be one of: ${VALID_PLACEMENTS.join(', ')}` },
        { status: 400 }
      );
    }

    const resetMenu = await resetStoreMenu(slug, placement);

    return NextResponse.json({
      success: true,
      storeSlug: slug,
      menu: resetMenu,
      message: `Menu for ${placement} restored to recommended defaults`,
    });
  } catch (error: any) {
    console.error('[Store Menus Reset API] POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset store menu' },
      { status: 500 }
    );
  }
}
