import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, convertDbProductToStorefrontProduct } from '@/lib/db-repository';
import CatalogClient from './CatalogClient';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Découvrez notre catalogue de produits.',
};

export default async function CatalogPage() {
  const headersList = await headers();
  const storeSlug = headersList.get('x-store-slug') || headersList.get('x-user-store-slug') || '';
  const isPlatform = headersList.get('x-tenant-type') === 'platform';
  
  if (!storeSlug) notFound();

  const dbProducts = await getProducts(storeSlug);
  
  const storefrontProducts = dbProducts
    .filter((p: any) => p.status !== 'draft')
    .map((p: any) => convertDbProductToStorefrontProduct(p));
    
  const serializedProducts = JSON.parse(JSON.stringify(storefrontProducts));

  return <CatalogClient initialProducts={serializedProducts} isPlatform={isPlatform} />;
}
