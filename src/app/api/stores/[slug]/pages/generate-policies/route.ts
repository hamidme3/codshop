import { NextRequest, NextResponse } from 'next/server';
import { generateStandardStorePolicies, getStorePages } from '@/lib/db-repository';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const storeSlug = (slug ).toLowerCase().trim();

    const pages = await generateStandardStorePolicies(storeSlug);

    return NextResponse.json({
      success: true,
      storeSlug,
      pages,
      message: 'Standard policies generated successfully',
      count: pages.length,
    });
  } catch (error) {
    console.error('[API Generate Policies POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate standard policies' },
      { status: 500 }
    );
  }
}
