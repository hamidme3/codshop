import { NextResponse } from 'next/server';
import { getStoreBySlug, updateStoreSections } from '@/lib/stores';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
  }

  return NextResponse.json({
    store: {
      name: store.name,
      slug: store.slug,
      themeId: store.themeId,
      plan: store.plan,
      trialEndsAt: store.trialEndsAt,
      sections: store.pages[0]?.sections || [],
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { sections } = body;

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Sections invalides' }, { status: 400 });
    }

    const updated = updateStoreSections(slug, sections);
    if (!updated) {
      return NextResponse.json({ error: 'Boutique introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Mise en page publiée avec succès !',
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}
