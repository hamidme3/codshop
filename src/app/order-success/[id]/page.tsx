import { getOrderByNumber } from '@/lib/db-repository';
import OrderSuccessClient from './OrderSuccessClient';

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const orderId = resolvedParams.id;
  const order = await getOrderByNumber(orderId);

  const customerName = order?.customerName || resolvedSearchParams?.customer || resolvedSearchParams?.name || 'Client';
  const city = order?.city || resolvedSearchParams?.city || 'votre ville';
  const total = (order?.total ?? (resolvedSearchParams?.total ? Number(resolvedSearchParams.total) || 0 : 0)) || 0;
  const items = (order?.items as { id?: string; title: string; quantity: number; price: number; variant?: string }[]) || [];

  return (
    <OrderSuccessClient
      orderId={orderId}
      customerName={customerName}
      city={city}
      total={total}
      items={items}
    />
  );
}
