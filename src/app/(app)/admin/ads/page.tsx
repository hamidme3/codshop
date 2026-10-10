import React, { Suspense } from 'react';
import Client from './Client';

export default function Page(props: any) {
  return (
    <Suspense fallback={<div className="p-8 text-slate-900 dark:text-white font-bold">Chargement...</div>}>
      <Client {...props} />
    </Suspense>
  );
}
