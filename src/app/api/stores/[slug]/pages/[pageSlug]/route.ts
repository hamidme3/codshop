import { NextRequest, NextResponse } from 'next/server';
import { getStorePageBySlug, createOrUpdateStorePage, deleteStorePage } from '@/lib/db-repository';
import { sanitizeText } from '@/lib/sanitizer';
import type { PolicyType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; pageSlug: string }> }
) {
  try {
    const { slug, pageSlug } = await params;
    const storeSlug = (slug ).toLowerCase().trim();
    const cleanPageSlug = (pageSlug || '').toLowerCase().trim();

    const page = await getStorePageBySlug(storeSlug, cleanPageSlug);

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      storeSlug,
      page,
    });
  } catch (error) {
    console.error('[API Page GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; pageSlug: string }> }
) {
  try {
    const { slug, pageSlug } = await params;
    const storeSlug = (slug ).toLowerCase().trim();
    const cleanPageSlug = (pageSlug || '').toLowerCase().trim();

    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const content = typeof body.content === 'string' ? body.content : '';

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const cleanTitle = sanitizeText(title);
    const cleanSeoTitle = body.seoTitle ? sanitizeText(body.seoTitle) : undefined;
    const cleanSeoDesc = body.seoDescription ? sanitizeText(body.seoDescription) : undefined;
    const policyType = body.policyType as PolicyType | undefined;

    const updated = await createOrUpdateStorePage(storeSlug, {
      title: cleanTitle,
      slug: cleanPageSlug,
      content,
      policyType,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
      seoTitle: cleanSeoTitle,
      seoDescription: cleanSeoDesc,
    });

    return NextResponse.json({
      success: true,
      storeSlug,
      page: updated,
    });
  } catch (error) {
    console.error('[API Page PUT] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; pageSlug: string }> }
) {
  try {
    const { slug, pageSlug } = await params;
    const storeSlug = (slug ).toLowerCase().trim();
    const cleanPageSlug = (pageSlug || '').toLowerCase().trim();

    const deleted = await deleteStorePage(storeSlug, cleanPageSlug);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Page not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      storeSlug,
      message: 'Page successfully deleted',
    });
  } catch (error) {
    console.error('[API Page DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
