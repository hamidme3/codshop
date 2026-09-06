'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeSelectorBar } from '@/components/ThemeSelectorBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isBackoffice = pathname.startsWith('/admin') || pathname.startsWith('/register-store') || pathname.startsWith('/sso');

  if (isBackoffice) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Single sticky container for demo bar + navbar — prevents top-8 overlap */}
      <div className="sticky top-0 z-40">
        <ThemeSelectorBar />
        <Navbar />
      </div>
      <main className="min-w-0">{children}</main>
      <Footer />
    </>
  );
}
