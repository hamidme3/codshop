import { PuckEditor } from './PuckEditor';
import { getDb, schema } from '@/db';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProducts } from '@/lib/db-repository';

export default async function PuckBuilderPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const resolvedParams = await searchParams;
  const storeSlug = resolvedParams.store || "";
  
  // 1. Get store ID
  const db = getDb();
  if (!db) {
    return <div className="p-10 text-red-500 font-bold">No database connection</div>;
  }

  const store = await db.query.stores.findFirst({
    where: eq(schema.stores.slug, storeSlug),
    with: {
      layout: true,
    }
  });

  if (!store) {
    return <div className="p-10 text-red-500 font-bold">Store not found</div>;
  }

  // 2. Format data for Puck
  const rawSections = store.layout?.sections;
  let puckData = { content: [], root: {} };
  
  if (rawSections && !Array.isArray(rawSections) && 'content' in (rawSections as any)) {
    puckData = rawSections as any;
  }

  // 3. Fetch live products for Data Binding
  const products = await getProducts(storeSlug);

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      <div className="bg-zinc-950 text-white p-3 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <Link href={`/admin/themes?store=${storeSlug}`} className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="font-bold border-l border-zinc-800 pl-4">Storefront Builder</div>
        </div>
        <div className="text-zinc-400 flex items-center gap-2">
          Store: <span className="text-white font-mono">{storeSlug}</span>
        </div>
      </div>
      <div className="flex-1 relative">
        <PuckEditor initialData={puckData} storeSlug={storeSlug} initialProducts={products as any[]} />
      </div>
    </div>
  );
}
