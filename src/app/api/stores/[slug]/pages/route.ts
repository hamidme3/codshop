import { NextRequest, NextResponse } from 'next/server';
import { getStorePages, createOrUpdateStorePage } from '@/lib/db-repository';
import { sanitizeText } from '@/lib/sanitizer';
import type { PolicyType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const storeSlug = (slug ).toLowerCase().trim();
    const { searchParams } = new URL(req.url);
    const onlyPublished = searchParams.get('published_only') === 'true';

    const pages = await getStorePages(storeSlug, onlyPublished);

    return NextResponse.json({
      success: true,
      storeSlug,
      pages,
      total: pages.length,
    });
  } catch (error) {
    console.error('[API Pages GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store pages' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const storeSlug = (slug ).toLowerCase().trim();
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    let pageSlug = typeof body.slug === 'string' ? body.slug.trim() : '';
    const content = typeof body.content === 'string' ? body.content : '';

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    if (!pageSlug) {
      pageSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    } else {
      pageSlug = pageSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    }

    const cleanTitle = sanitizeText(title);
    const cleanSeoTitle = body.seoTitle ? sanitizeText(body.seoTitle) : undefined;
    const cleanSeoDesc = body.seoDescription ? sanitizeText(body.seoDescription) : undefined;
    const policyType = (['terms', 'privacy', 'shipping', 'returns', 'about', 'custom'].includes(body.policyType)
      ? body.policyType
      : 'custom') as PolicyType;

    const newPage = await createOrUpdateStorePage(storeSlug, {
      title: cleanTitle,
      slug: pageSlug,
      content,
      policyType,
      isSystemPolicy: Boolean(body.isSystemPolicy),
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      seoTitle: cleanSeoTitle,
      seoDescription: cleanSeoDesc,
    });

    return NextResponse.json({
      success: true,
      storeSlug,
      page: newPage,
    });
  } catch (error) {
    console.error('[API Pages POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
