import React from 'react';
import { headers } from 'next/headers';
import OverviewClient from './OverviewClient';
import { getOrders } from '@/lib/db-repository';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const headersList = await headers();
  const storeSlug = headersList.get('x-user-store-slug') || '';
  
  if (!storeSlug) {
    return <div className="p-8 text-[var(--admin-text-primary)]">Magasin non trouvé.</div>;
  }

  const orders = await getOrders(storeSlug);

  return <OverviewClient initialOrders={orders as any[]} storeSlug={storeSlug} />;
}
