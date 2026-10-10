import React from 'react';
import { headers } from 'next/headers';
import CustomersClient from './CustomersClient';
import { getCustomers } from '@/lib/db-repository';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const headersList = await headers();
  const storeSlug = headersList.get('x-user-store-slug') || '';
  
  if (!storeSlug) {
    return <div className="p-8 text-[var(--admin-text-primary)]">Magasin non trouvé.</div>;
  }

  const customers = await getCustomers(storeSlug);

  return <CustomersClient initialCustomers={customers as any[]} storeSlug={storeSlug} />;
}
