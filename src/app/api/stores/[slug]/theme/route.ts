import { NextResponse } from 'next/server';
import { getStoreLayoutBySlug, saveStoreLayout, ThemeTokens } from '@/lib/db-repository';
import { THEMES, THEME_LIST, getThemeById, ThemeId } from '@/lib/themes';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const layoutData = await getStoreLayoutBySlug(slug);
    const activeThemeId = (layoutData.themeId || 'luxury') as ThemeId;
    const activeTheme = getThemeById(activeThemeId);

    return NextResponse.json({
      storeSlug: slug,
      activeThemeId,
      activeTheme,
      themeConfig: layoutData.themeConfig,
      totalThemes: THEME_LIST.length,
      themes: THEME_LIST,
    });
  } catch (error: any) {
    console.error('[Store Theme API] GET error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des thèmes de la boutique' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { themeId, overrides } = body;

    if (!themeId || typeof themeId !== 'string') {
      return NextResponse.json(
        { error: 'Paramètre themeId manquant ou invalide' },
        { status: 400 }
      );
    }

    const themeDef = THEMES[themeId as ThemeId];
    if (!themeDef) {
      return NextResponse.json(
        { error: `Thème inconnu: ${themeId}. Veuillez choisir parmi les 25 thèmes disponibles.` },
        { status: 404 }
      );
    }

    const newConfig: ThemeTokens = {
      primaryColor: themeDef.colors.primary,
      accentColor: themeDef.colors.accent,
      bgPage: themeDef.colors.bgPage,
      cardBg: themeDef.colors.cardBg,
      border: themeDef.colors.border,
      textPrimary: themeDef.colors.textPrimary,
      textSecondary: themeDef.colors.textSecondary,
      fontFamily: (themeDef.typography.fontFamily === 'serif' ? 'serif' : themeDef.typography.fontFamily === 'monospace' ? 'mono' : 'sans'),
      buttonRadius: (themeDef.styleTokens.buttonRadius.includes('full')
        ? 'pill'
        : themeDef.styleTokens.buttonRadius.includes('xl') || themeDef.styleTokens.buttonRadius.includes('2xl')
        ? 'rounded'
        : themeDef.styleTokens.buttonRadius.includes('md')
        ? 'subtle'
        : 'sharp'),
      announcementText: themeDef.announcementText,
      showAnnouncement: true,
      announcementBg: themeDef.announcementBg,
      ...(overrides || {}),
    };

    const result = await saveStoreLayout(slug, {
      themeId,
      themeConfig: newConfig,
    });

    return NextResponse.json({
      success: true,
      themeId,
      theme: themeDef,
      themeConfig: newConfig,
      updatedAt: result.updatedAt,
      message: `Thème "${themeDef.name}" activé avec succès pour ${slug.toUpperCase()} !`,
    });
  } catch (error: any) {
    console.error('[Store Theme API] POST error:', error);
    return NextResponse.json(
      { error: "Erreur lors de l'application du thème" },
      { status: 500 }
    );
  }
}
