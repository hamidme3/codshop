import { NextResponse } from 'next/server';
import { getStoreMenus, getStoreMenuByPlacement, updateStoreMenu } from '@/lib/db-repository';
import { validateMenuNesting } from '@/lib/mocks';
import { sanitizeText } from '@/lib/sanitizer';
import type { MenuItem, MenuPlacement } from '@/lib/types';

const VALID_PLACEMENTS: MenuPlacement[] = ['header', 'mobile_drawer', 'footer_col_1', 'footer_col_2'];

function sanitizeMenuItems(items: MenuItem[]): MenuItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((item, index) => {
    const sanitized: MenuItem = {
      id: item.id || `item_${Date.now()}_${index}`,
      label: sanitizeText(item.label || '').trim() || 'Menu Item',
      type: item.type || 'url',
      url: (item.url || '').trim() || '/',
      targetId: item.targetId ? sanitizeText(item.targetId).trim() : undefined,
      badgeText: item.badgeText ? sanitizeText(item.badgeText).trim() : undefined,
      badgeColor: item.badgeColor,
      isOpenNewTab: Boolean(item.isOpenNewTab),
      order: typeof item.order === 'number' ? item.order : index,
    };

    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      sanitized.children = sanitizeMenuItems(item.children);
    }

    return sanitized;
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(req.url);
    const placement = url.searchParams.get('placement') as MenuPlacement | null;

    if (placement && VALID_PLACEMENTS.includes(placement)) {
      const menu = await getStoreMenuByPlacement(slug, placement);
      return NextResponse.json({
        success: true,
        storeSlug: slug,
        menu,
      });
    }

    const menus = await getStoreMenus(slug);
    return NextResponse.json({
      success: true,
      storeSlug: slug,
      menus,
    });
  } catch (error: any) {
    console.error('[Store Menus API] GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve store menus' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { placement, items, title } = body;

    if (!placement || !VALID_PLACEMENTS.includes(placement)) {
      return NextResponse.json(
        { success: false, error: `Invalid placement. Must be one of: ${VALID_PLACEMENTS.join(', ')}` },
        { status: 400 }
      );
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items must be an array' },
        { status: 400 }
      );
    }

    // Enforce max 2-level nesting rule (Parent -> Submenu -> Nested Sub-item)
    if (!validateMenuNesting(items)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum 2 levels of nesting exceeded. Menus support a maximum 3-tier hierarchy.',
        },
        { status: 400 }
      );
    }

    const sanitizedItems = sanitizeMenuItems(items);
    const cleanTitle = title ? sanitizeText(title).trim() : undefined;

    const updatedMenu = await updateStoreMenu(slug, placement, sanitizedItems, cleanTitle);

    return NextResponse.json({
      success: true,
      storeSlug: slug,
      menu: updatedMenu,
      message: 'Navigation menu updated successfully',
    });
  } catch (error: any) {
    console.error('[Store Menus API] PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update store menu' },
      { status: 500 }
    );
  }
}
