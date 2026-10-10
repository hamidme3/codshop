import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, convertDbProductToStorefrontProduct } from '@/lib/db-repository';
import ProductClient from './ProductClient';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const headersList = await headers();
  const storeSlug = headersList.get('x-store-slug') || headersList.get('x-user-store-slug') || '';
  
  if (!storeSlug) return { title: 'Produit Introuvable' };

  const slugQuery = (await params).slug.toLowerCase().trim();
  const dbProducts = await getProducts(storeSlug);
  
  const storefrontProducts = dbProducts
    .filter((p: any) => p.status !== 'draft')
    .map((p: any) => convertDbProductToStorefrontProduct(p));
    
  const match = storefrontProducts.find(
    (p: any) =>
      String(p.slug || '').toLowerCase() === slugQuery ||
      String(p.sku || '').toLowerCase() === slugQuery ||
      String(p.id || '').toLowerCase() === slugQuery ||
      String(p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slugQuery
  );

  if (!match) {
    return { title: 'Produit Introuvable' };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: match.title,
    description: match.description || `Acheter ${match.title} en ligne.`,
    openGraph: {
      images: match.images && match.images.length > 0 ? [match.images[0], ...previousImages] : previousImages,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const headersList = await headers();
  const storeSlug = headersList.get('x-store-slug') || headersList.get('x-user-store-slug') || '';
  
  if (!storeSlug) notFound();

  const slugQuery = (await params).slug.toLowerCase().trim();
  const dbProducts = await getProducts(storeSlug);
  
  const storefrontProducts = dbProducts
    .filter((p: any) => p.status !== 'draft')
    .map((p: any) => convertDbProductToStorefrontProduct(p));
    
  const match = storefrontProducts.find(
    (p: any) =>
      String(p.slug || '').toLowerCase() === slugQuery ||
      String(p.sku || '').toLowerCase() === slugQuery ||
      String(p.id || '').toLowerCase() === slugQuery ||
      String(p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slugQuery
  );

  if (!match) {
    notFound();
  }

  // Convert dates and handle Next.js Server Component boundary serialization
  const serializedProduct = JSON.parse(JSON.stringify(match));

  return (
    <ProductClient initialProduct={serializedProduct} initialStoreSlug={storeSlug} />
  );
}
