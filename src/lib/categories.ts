import { Category, Product, StorefrontProduct } from './types';

// Keep track of user-created empty categories during the session
let MANUAL_CATEGORIES: Category[] = [];

/**
 * Derives categories from a list of products, and merges any manually created empty categories.
 */
export function deriveCategoriesFromProducts(storeProducts: any[]): Category[] {
  const existingCategories = [...MANUAL_CATEGORIES];

  for (const p of storeProducts) {
    const rawCat = (p.category || '').trim();
    if (!rawCat) continue;
    const catLower = rawCat.toLowerCase();
    
    let exists = false;
    for (const c of existingCategories) {
      if (c.name.toLowerCase() === catLower || c.slug.toLowerCase() === catLower) {
        c.productCount = (c.productCount || 0) + 1;
        exists = true;
        break;
      }
    }
    
    if (!exists) {
      const slug = rawCat
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      existingCategories.push({
        id: `cat_${slug || Date.now()}`,
        name: rawCat,
        slug: slug || `cat-${Date.now()}`,
        icon: 'tag',
        productCount: 1,
      });
    }
  }

  return existingCategories;
}

export function addCategory(category: { name: string; slug?: string; icon?: string; description?: string }): Category {
  const trimmedName = category.name.trim();
  if (!trimmedName) throw new Error('Category name is required.');
  const slug = (category.slug?.trim() || trimmedName)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const existing = MANUAL_CATEGORIES.find(
    (c) => c.name.toLowerCase() === trimmedName.toLowerCase() || c.slug.toLowerCase() === slug
  );
  if (existing) {
    throw new Error('This category already exists.');
  }

  const newCat: Category = {
    id: `cat_${slug || Date.now()}`,
    name: trimmedName,
    slug: slug || `cat-${Date.now()}`,
    icon: category.icon,
    description: category.description,
    productCount: 0,
  };

  MANUAL_CATEGORIES.push(newCat);
  return newCat;
}

export function deleteCategory(idOrSlug: string, storeProducts: any[]): { success: boolean; error?: string } {
  const allCats = deriveCategoriesFromProducts(storeProducts);
  const cat = allCats.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  if (!cat) return { success: false, error: 'Category not found.' };

  const activeProducts = storeProducts.filter((p) => {
    const pCat = (p.category || '').toLowerCase().trim();
    return pCat === cat.name.toLowerCase().trim() || pCat === cat.slug.toLowerCase().trim();
  });

  if (activeProducts.length > 0) {
    return {
      success: false,
      error: `Action requise : Impossible de supprimer la catégorie "${cat.name}". Elle contient encore ${activeProducts.length} produit(s) actif(s). Veuillez d'abord réassigner ou supprimer ces produits.`,
    };
  }

  MANUAL_CATEGORIES = MANUAL_CATEGORIES.filter((c) => c.id !== cat.id);
  return { success: true };
}

