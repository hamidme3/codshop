import { NextRequest, NextResponse } from 'next/server';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = getDb();
    if (!db) {
       return NextResponse.json({ success: true, data: null });
    }

    const store = await db.query.stores.findFirst({
      where: eq(schema.stores.slug, slug),
      with: { layout: true }
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const rawSections = store.layout?.sections;
    if (rawSections && !Array.isArray(rawSections) && 'content' in (rawSections as any)) {
      return NextResponse.json({ success: true, data: rawSections });
    }

    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = getDb();
    if (!db) {
        return NextResponse.json({ error: 'No database connection' }, { status: 500 });
    }

    const puckData = await req.json();
    
    // Find the store
    const store = await db.query.stores.findFirst({
      where: eq(schema.stores.slug, slug),
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const existingLayout = await db.query.pageLayouts.findFirst({
      where: eq(schema.pageLayouts.storeId, store.id),
    });

    if (existingLayout) {
      const raw = (existingLayout.sections as any) || {};
      const payloadToSave = {
        ...puckData,
        themeId: raw.themeId || 'luxury',
        themeConfig: raw.themeConfig || {},
      };
      await db.update(schema.pageLayouts)
        .set({ sections: payloadToSave, updatedAt: new Date() })
        .where(eq(schema.pageLayouts.storeId, store.id));
    } else {
      await db.insert(schema.pageLayouts).values({
        storeId: store.id,
        sections: { ...puckData, themeId: 'luxury', themeConfig: {} },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to save Puck layout:', err);
    return NextResponse.json({ error: 'Failed to save layout' }, { status: 500 });
  }
}
