import React from 'react';
import { headers } from 'next/headers';
import ProductsClient from './ProductsClient';
import { getProducts } from '@/lib/db-repository';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const headersList = await headers();
  const storeSlug = headersList.get('x-user-store-slug') || '';
  
  if (!storeSlug) {
    return <div className="p-8 text-[var(--admin-text-primary)]">Magasin non trouvé.</div>;
  }

  const products = await getProducts(storeSlug);

  return <ProductsClient initialProducts={products as any[]} storeSlug={storeSlug} />;
}
