import React, { Suspense } from 'react';
import AnalyticsClient from './AnalyticsClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | CODShop',
  description: 'Dashboard Analytique',
};

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-900 dark:text-white font-bold">Chargement des analytiques...</div>}>
      <AnalyticsClient />
    </Suspense>
  );
}
