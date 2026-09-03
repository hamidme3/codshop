import { NextResponse } from 'next/server';
import { createStore, getStoreBySlug } from '@/lib/stores';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, whatsapp, niche, themeId, city } = body;

    if (!name || !whatsapp) {
      return NextResponse.json(
        { error: 'Le nom de la boutique et le numéro WhatsApp sont obligatoires' },
        { status: 400 }
      );
    }

    const requestedSlug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-');
    
    // Check if store already exists
    const existing = getStoreBySlug(requestedSlug);
    if (existing) {
      return NextResponse.json(
        { error: 'Ce nom de boutique est déjà réservé. Veuillez en choisir un autre.' },
        { status: 409 }
      );
    }

    const newStore = createStore({
      name,
      slug: requestedSlug,
      whatsapp,
      city: city || 'Casablanca',
      niche: niche || 'fashion',
      themeId: themeId || 'luxury',
    });

    console.log(`[Store Provisioned] ${newStore.name} (${newStore.slug}) - 14 Days Free Trial Active`);

    return NextResponse.json({
      success: true,
      store: newStore,
      message: 'Boutique créée avec succès ! Votre essai gratuit de 14 jours a commencé.',
      previewUrl: `/?store=${newStore.slug}`,
      adminUrl: `/admin/builder?store=${newStore.slug}`,
    });
  } catch (error: any) {
    console.error('[Store Registration Error]:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la boutique' },
      { status: 500 }
    );
  }
}
