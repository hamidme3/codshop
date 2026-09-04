'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeSelectorBar } from '@/components/ThemeSelectorBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isBackoffice = pathname.startsWith('/admin') || pathname.startsWith('/register-store');

  if (isBackoffice) {
    return <>{children}</>;
  }

  return (
    <>
      <ThemeSelectorBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
