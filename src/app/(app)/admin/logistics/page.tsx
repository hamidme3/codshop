import { redirect } from 'next/navigation';

export default async function LogisticsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const params = await searchParams;
  const store = params?.store ? `?store=${encodeURIComponent(params.store)}` : '';
  redirect(`/admin/shipping${store}`);
}
