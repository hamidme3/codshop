import { NextResponse } from 'next/server';
import { getStoreLayoutBySlug, saveStoreLayout } from '@/lib/db-repository';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const layoutData = await getStoreLayoutBySlug(slug);

    return NextResponse.json({
      store: {
        name: layoutData.storeName || slug.toUpperCase(),
        slug,
        themeId: layoutData.themeId,
        themeConfig: layoutData.themeConfig,
        sections: layoutData.sections,
        updatedAt: layoutData.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('[Builder API] GET error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement de la boutique' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { sections, themeId, themeConfig } = body;

    if (sections !== undefined && !Array.isArray(sections)) {
      return NextResponse.json({ error: 'Format de sections invalide' }, { status: 400 });
    }

    const result = await saveStoreLayout(slug, {
      sections,
      themeId,
      themeConfig,
    });

    return NextResponse.json({
      success: true,
      message: 'Mise en page et thème publiés avec succès !',
      updatedAt: result.updatedAt,
    });
  } catch (error: any) {
    console.error('[Builder API] POST error:', error);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde du layout' }, { status: 500 });
  }
}

