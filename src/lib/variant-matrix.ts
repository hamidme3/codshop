/**
 * CODShop - Catalog & Variant Matrix Architecture
 * 
 * Provides production-grade data structures and algorithms for:
 * 1. Multi-attribute Cartesian product variant matrix generation with standard SKU formulation.
 * 2. 1-click batch stock distribution and reactive aggregation.
 * 3. Safe category product reallocation during category pruning.
 * 4. Multi-image portfolio management with primary image indexation and Moroccan presets.
 */

import { ProductVariantItem } from './types';

export interface AttributeDimension {
  id: string; // 'color' | 'size' | custom
  label: string; // 'Couleur' | 'Pointure'
  values: string[]; // ['Noir Ébène', 'Marron Vintage']
}

export interface MatrixGenerationConfig {
  basePrefix?: string; // e.g. 'SAC-CUIR' or 'ROBE'
  productTitle?: string; // Fallback: 'Sacoche Bandoulière Fès' -> 'SAC'
  defaultStock?: number; // Default 0 or 15
  defaultPrice?: number;
  existingVariants?: ProductVariantItem[]; // Preserve customized pricing/stocks
}

export interface ReassignCategoryResult {
  success: boolean;
  reallocatedCount: number;
  sourceCategory?: string;
  targetCategory?: string;
  error?: string;
}

export interface ImagePreset {
  id: string;
  niche: string;
  title: string;
  images: string[];
}

// ── 1. SKU TOKEN NORMALIZER ──────────────────────────────────────────────────

/**
 * Common color and attribute mapping for Moroccan COD e-commerce.
 * Normalizes French & Darija color variations into concise standard SKU tokens.
 */
const COLOR_TOKEN_MAP: Record<string, string> = {
  'noir ebene': 'NOIR',
  'noir': 'NOIR',
  'black': 'NOIR',
  'khal': 'NOIR',
  'marron vintage': 'MARRON',
  'marron': 'MARRON',
  'brown': 'MARRON',
  'kahwi': 'MARRON',
  'camel': 'CAMEL',
  'havane': 'HAVANE',
  'bleu nuit': 'BLEU-NUIT',
  'bleu marine': 'BLEU-MAR',
  'bleu ciel': 'BLEU-CIEL',
  'bleu': 'BLEU',
  'zreq': 'BLEU',
  'vert emeraude': 'VERT-EMER',
  'vert bouteille': 'VERT-BOUT',
  'vert': 'VERT',
  'khdar': 'VERT',
  'bordeaux': 'BORDEAUX',
  'rouge': 'ROUGE',
  'hmer': 'ROUGE',
  'dore': 'GOLD',
  'or': 'GOLD',
  'or traditionnel': 'GOLD',
  'argente': 'SILVER',
  'argent': 'SILVER',
  'fiddi': 'SILVER',
  'blanc': 'BLANC',
  'white': 'BLANC',
  'byad': 'BLANC',
  'rose poudree': 'ROSE-POUD',
  'rose': 'ROSE',
  'beige': 'BEIGE',
  'gris anthracite': 'GRIS-ANTH',
  'gris': 'GRIS',
};

const SIZE_TOKEN_MAP: Record<string, string> = {
  'standard': 'STD',
  'unique': 'UNIQ',
  'taille unique': 'UNIQ',
  'small': 'S',
  'medium': 'M',
  'large': 'L',
  'extra large': 'XL',
  'xxl': '2XL',
  'xxxl': '3XL',
};

/**
 * Strips accents, removes special characters, and formats clean alphanumeric uppercase token.
 */
export function normalizeSkuToken(input: string, maxLength: number = 8): string {
  if (!input || !input.trim()) return '';

  const normalized = input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Strip diacritics (é -> e, etc.)

  // Check dictionary lookup first
  if (COLOR_TOKEN_MAP[normalized]) {
    return COLOR_TOKEN_MAP[normalized];
  }
  if (SIZE_TOKEN_MAP[normalized]) {
    return SIZE_TOKEN_MAP[normalized];
  }

  // Pure numeric (e.g. shoe sizes '40', '41', '42', '43')
  if (/^\d+$/.test(normalized)) {
    return normalized;
  }

  // General slugification
  const cleaned = normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();

  return cleaned.slice(0, maxLength);
}

/**
 * Derives a standard base prefix from a product title or custom base prefix.
 * Example: "Sacoche Bandoulière Cuir Fès" -> "SAC-CUIR"
 */
export function deriveBaseSkuPrefix(productTitle?: string, fallback: string = 'PRD'): string {
  if (!productTitle || !productTitle.trim()) return fallback;

  const words = productTitle
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (words.length === 0) return fallback;

  // Take first 1 or 2 significant words
  const prefix = words
    .slice(0, Math.min(2, words.length))
    .map((w) => w.slice(0, 4).toUpperCase())
    .join('-');

  return prefix || fallback;
}

// ── 2. CARTESIAN PRODUCT & VARIANT MATRIX GENERATOR ──────────────────────────

/**
 * Computes generalized Cartesian product for any arbitrary number of dimensions.
 * Example: [{ color: ['Noir', 'Camel'] }, { size: ['41', '42'] }]
 */
export function cartesianProduct<T extends Record<string, string>>(
  dimensions: Array<{ key: string; values: string[] }>
): T[] {
  if (!dimensions || dimensions.length === 0) return [];

  // Filter out empty dimension lists
  const validDimensions = dimensions.filter((d) => d.values && d.values.length > 0);
  if (validDimensions.length === 0) return [];

  return validDimensions.reduce<T[]>(
    (acc, currDimension) => {
      const result: T[] = [];
      for (const item of acc) {
        for (const val of currDimension.values) {
          result.push({
            ...item,
            [currDimension.key]: val.trim(),
          } as T);
        }
      }
      return result;
    },
    [{}] as T[]
  );
}

export interface MatrixGenerationOptions extends MatrixGenerationConfig {
  colors?: string[];
  sizes?: string[];
}

/**
 * High-level Moroccan COD Dual-Axis Variant Matrix Generator.
 * Combines Color x Size lists into production ProductVariantItem[] with:
 * - Clean standard SKUs (e.g. 'SAC-NOIR-40', 'ROBE-BLEU-M')
 * - Collision prevention
 * - Preservation of existing variant stocks/prices when editing
 */
export function generateVariantMatrix(
  options: MatrixGenerationOptions
): ProductVariantItem[];
export function generateVariantMatrix(
  colors: string[],
  sizes: string[],
  config?: MatrixGenerationConfig
): ProductVariantItem[];
export function generateVariantMatrix(
  colorsOrOptions: string[] | MatrixGenerationOptions,
  sizes?: string[],
  config: MatrixGenerationConfig = {}
): ProductVariantItem[] {
  let cleanColors: string[] = [];
  let cleanSizes: string[] = [];
  let resolvedConfig: MatrixGenerationConfig = {};

  if (Array.isArray(colorsOrOptions)) {
    cleanColors = (colorsOrOptions || []).map((c) => c.trim()).filter(Boolean);
    cleanSizes = (sizes || []).map((s) => s.trim()).filter(Boolean);
    resolvedConfig = config || {};
  } else if (colorsOrOptions && typeof colorsOrOptions === 'object') {
    cleanColors = (colorsOrOptions.colors || []).map((c) => c.trim()).filter(Boolean);
    cleanSizes = (colorsOrOptions.sizes || []).map((s) => s.trim()).filter(Boolean);
    resolvedConfig = colorsOrOptions;
  }

  const basePrefix = (
    resolvedConfig.basePrefix?.trim() || deriveBaseSkuPrefix(resolvedConfig.productTitle)
  ).toUpperCase();
  const defaultStock = Math.max(0, resolvedConfig.defaultStock ?? 0);
  const existingMap = new Map<string, ProductVariantItem>();

  // Index existing variants to preserve stock/price customizations
  if (resolvedConfig.existingVariants && resolvedConfig.existingVariants.length > 0) {
    for (const v of resolvedConfig.existingVariants) {
      const key = `${(v.color || '').toLowerCase().trim()}:::${(v.size || '').toLowerCase().trim()}`;
      existingMap.set(key, v);
    }
  }

  // Dimensions setup
  const dimensions: Array<{ key: 'color' | 'size'; values: string[] }> = [];
  if (cleanColors.length > 0) dimensions.push({ key: 'color', values: cleanColors });
  if (cleanSizes.length > 0) dimensions.push({ key: 'size', values: cleanSizes });

  // Handle single-axis or zero-axis fallback
  if (dimensions.length === 0) {
    return [
      {
        size: 'Standard',
        stock: defaultStock,
        sku: `${basePrefix}-STD`,
        price: resolvedConfig.defaultPrice,
      },
    ];
  }

  const combinations = cartesianProduct<{ color?: string; size?: string }>(dimensions);
  const generatedSkus = new Set<string>();

  return combinations.map((comb) => {
    const colorVal = comb.color;
    const sizeVal = comb.size;

    // Check if variant already existed
    const lookupKey = `${(colorVal || '').toLowerCase()}:::${(sizeVal || '').toLowerCase()}`;
    const existing = existingMap.get(lookupKey);

    // Formulate clean SKU
    const tokens: string[] = [basePrefix];
    if (colorVal) tokens.push(normalizeSkuToken(colorVal));
    if (sizeVal) tokens.push(normalizeSkuToken(sizeVal));
    
    let candidateSku = tokens.join('-');
    
    // Deduplication / collision resolution
    if (generatedSkus.has(candidateSku)) {
      let suffix = 1;
      while (generatedSkus.has(`${candidateSku}-${String(suffix).padStart(2, '0')}`)) {
        suffix++;
      }
      candidateSku = `${candidateSku}-${String(suffix).padStart(2, '0')}`;
    }
    generatedSkus.add(candidateSku);

    return {
      color: colorVal,
      size: sizeVal,
      stock: existing ? existing.stock : defaultStock,
      sku: existing?.sku || candidateSku,
      price: existing?.price ?? resolvedConfig.defaultPrice,
      comparePrice: existing?.comparePrice,
      costPrice: existing?.costPrice,
    };
  });
}

// ── 3. BATCH STOCK FILL & AGGREGATION ─────────────────────────────────────────

/**
 * 1-Click Batch Stock Fill:
 * Allows a merchant to enter e.g. 25 units and apply it to all variants (or selectively by color/size).
 */
export function batchFillStock(
  variants: ProductVariantItem[],
  quantity: number,
  filter?: { color?: string; size?: string }
): ProductVariantItem[] {
  const cleanQuantity = Math.max(0, Math.floor(Number(quantity) || 0));

  return variants.map((v) => {
    // If filter specified, only apply to matching variants
    if (filter) {
      if (filter.color && (v.color || '').toLowerCase() !== filter.color.toLowerCase()) {
        return v;
      }
      if (filter.size && (v.size || '').toLowerCase() !== filter.size.toLowerCase()) {
        return v;
      }
    }
    return {
      ...v,
      stock: cleanQuantity,
    };
  });
}

/**
 * Pure Total Stock Aggregator:
 * Safely sums up total inventory across all matrix items, guarding against NaN, null, and non-numeric inputs.
 */
export function computeTotalStock(variants: ProductVariantItem[]): number {
  if (!variants || !Array.isArray(variants) || variants.length === 0) return 0;

  return variants.reduce((sum, item) => {
    const stockNum = Math.max(0, parseInt(String(item.stock), 10) || 0);
    return sum + stockNum;
  }, 0);
}

// ── 4. MULTI-IMAGE PORTFOLIO MANAGEMENT ─────────────────────────────────────

/**
 * Sets the image at targetIndex as primary by moving it to index 0.
 * Preserves the order of all other images.
 */
export function setPrimaryImage(images: string[], targetIndex: number): string[] {
  if (!images || images.length <= 1) return [...(images || [])];
  if (targetIndex <= 0 || targetIndex >= images.length) return [...images];

  const next = [...images];
  const [selected] = next.splice(targetIndex, 1);
  next.unshift(selected);
  return next;
}

/**
 * Reorders images from one position to another (e.g. for drag-and-drop UI).
 */
export function reorderImages(images: string[], fromIndex: number, toIndex: number): string[] {
  if (!images || images.length <= 1) return [...(images || [])];
  if (fromIndex < 0 || fromIndex >= images.length || toIndex < 0 || toIndex >= images.length) {
    return [...images];
  }

  const next = [...images];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/**
 * Adds an image URL with URL sanitization and deduplication.
 */
export function addProductImage(images: string[], newUrl: string): string[] {
  const trimmed = (newUrl || '').trim();
  if (!trimmed) return [...(images || [])];

  const current = images || [];
  // Avoid duplicate identical URLs
  if (current.includes(trimmed)) return [...current];

  return [...current, trimmed];
}

/**
 * Removes an image at specified index. The next image automatically becomes primary if index was 0.
 */
export function removeProductImage(images: string[], indexToRemove: number): string[] {
  if (!images || indexToRemove < 0 || indexToRemove >= images.length) {
    return [...(images || [])];
  }
  return images.filter((_, i) => i !== indexToRemove);
}

// ── 5. CURATED MOROCCAN E-COMMERCE SAMPLE PRESETS ───────────────────────────

export const MOROCCAN_PRODUCT_IMAGE_PRESETS: ImagePreset[] = [
  {
    id: 'leather_craft',
    niche: 'Maroquinerie & Cuir',
    title: 'Sac Bandoulière Cuir Fès Véritable',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'moroccan_caftan',
    niche: 'Caftan & Mode Traditionnelle',
    title: 'Takchita de Mariage Broderie Royale & Sfifa',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'argan_cosmetics',
    niche: 'Cosmétique & Huile d\'Argan',
    title: 'Élixir Argan Bio Pure Pressée à Froid',
    images: [
      'https://images.unsplash.com/photo-1608248597359-548455122e23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248597330-802c6d7a42bb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'babouche_artisanat',
    niche: 'Chaussures & Babouches',
    title: 'Babouches Royales Ziwani Cuir Cousu Main',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    ],
  },
];
