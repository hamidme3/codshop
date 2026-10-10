export function getProductVariantInfo(
  product: any,
  selectedColor?: string,
  selectedSize?: string,
  selectedVariantName?: string,
  selectedSku?: string
): {
  sku: string;
  stock: number;
  inStock: boolean;
  image?: string;
  price: number;
  label: string;
} {
  const baseSku = product.sku || product.slug?.toUpperCase().replace(/-/g, '_') || 'SKU';
  const basePrice = product.price || 0;

  // 1. Try finding exact match in variantMatrix (dual-axis or explicit)
  if (product.variantMatrix && product.variantMatrix.length > 0) {
    let match = selectedSku
      ? product.variantMatrix.find((vm: any) => vm.sku.toLowerCase() === selectedSku.toLowerCase())
      : undefined;

    if (!match && (selectedColor || selectedSize)) {
      match = product.variantMatrix.find((vm: any) => {
        const matchColor = selectedColor ? vm.color?.toLowerCase() === selectedColor.toLowerCase() : true;
        const matchSize = selectedSize ? vm.size?.toLowerCase() === selectedSize.toLowerCase() : true;
        return matchColor && matchSize;
      });
    }

    if (!match && !selectedColor && !selectedSize && !selectedSku) {
      match = product.variantMatrix[0];
    }

    if (match) {
      const parts: string[] = [];
      if (match.color) parts.push(match.color);
      if (match.size) parts.push(match.size);
      return {
        sku: match.sku,
        stock: match.stock,
        inStock: match.stock > 0,
        image: match.image,
        price: match.price || basePrice,
        label: parts.join(' / ') || 'Standard',
      };
    }
  }

  // 2. Try single-axis options list
  if (product.variants?.options) {
    const optName = selectedVariantName || selectedSize || selectedColor;
    const matchOpt = product.variants.options.find(
      (o: any) =>
        (selectedSku && o.sku?.toLowerCase() === selectedSku.toLowerCase()) ||
        (optName && o.name.toLowerCase() === optName.toLowerCase())
    );
    if (matchOpt) {
      const optSku = matchOpt.sku || `${baseSku}-${matchOpt.id?.toUpperCase() || 'OPT'}`;
      const optStock = matchOpt.stock !== undefined ? matchOpt.stock : (matchOpt.inStock ? (product.stockLeft || product.stock || 0) : 0);
      return {
        sku: optSku,
        stock: optStock,
        inStock: optStock > 0 && matchOpt.inStock,
        image: matchOpt.image,
        price: matchOpt.price || basePrice,
        label: matchOpt.name,
      };
    }
  }

  // 3. Fallback: Base product info
  const stock = product.stockLeft !== undefined ? product.stockLeft : (product.stock !== undefined ? product.stock : 0);
  return {
    sku: baseSku,
    stock,
    inStock: stock > 0,
    image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined,
    price: basePrice,
    label: selectedVariantName || 'Standard',
  };
}

import { StorefrontProduct, Category } from './types';

export function deriveCategoriesFromProducts(products: any[]): Category[] {
  const catMap = new Map<string, Category>();

  for (const p of products) {
    const rawCat = (p.category || '').trim();
    if (!rawCat) continue;
    const catLower = rawCat.toLowerCase();
    
    // Check if we already added it
    let exists = false;
    for (const [key, c] of catMap.entries()) {
      if (c.name.toLowerCase() === catLower || c.slug.toLowerCase() === catLower) {
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
      
      const newCat: Category = {
        id: `cat_${slug || Date.now()}`,
        name: rawCat,
        slug: slug || `cat-${Date.now()}`,
        icon: 'tag',
        productCount: 1,
      };
      catMap.set(newCat.slug, newCat);
    } else {
      // Increment product count
      for (const [key, c] of catMap.entries()) {
        if (c.name.toLowerCase() === catLower || c.slug.toLowerCase() === catLower) {
          c.productCount = (c.productCount || 0) + 1;
          break;
        }
      }
    }
  }

  return Array.from(catMap.values());
}

import { QuantityTier } from './types';

export function getProductQuantityTiers(product: any, countryCode: string = 'MA'): QuantityTier[] {
  if (product.quantityTiers && product.quantityTiers.length >= 3) {
    return product.quantityTiers;
  }
  const base = product.price;
  const duoUnit = Math.round(base * 0.85);
  const trioUnit = Math.round(base * 0.75);
  return [
    {
      quantity: 1,
      label: 'Pack 1 : 1 Pièce (Standard)',
      unitPrice: base,
      totalPrice: base,
      freeDelivery: false,
    },
    {
      quantity: 2,
      label: 'Pack 2 : Duo (2 Pièces)',
      unitPrice: duoUnit,
      totalPrice: duoUnit * 2,
      savingsBadge: `Économisez ${Math.round(((base * 2) - (duoUnit * 2)))} DH`,
      freeDelivery: true,
      isPopular: true,
    },
    {
      quantity: 3,
      label: 'Pack 3 : Trio + Cadeau',
      unitPrice: trioUnit,
      totalPrice: trioUnit * 3,
      savingsBadge: `Économisez ${Math.round(((base * 3) - (trioUnit * 3)))} DH`,
      freeDelivery: true,
      freeGift: 'Sérum Anti-Âge Gratuit',
    },
  ];
}
