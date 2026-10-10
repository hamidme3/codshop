'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeSelectorBar } from '@/components/ThemeSelectorBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SearchModal } from '@/components/SearchModal';
import { MobileMenuDrawer } from '@/components/MobileMenuDrawer';


import { useTheme } from '@/context/ThemeContext';
import { fetchAndInitPixels } from '@/lib/pixel-tracker';

function ShellContent({ children, initialStoreSlug }: { children: React.ReactNode, initialStoreSlug?: string }) {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const storeParam = searchParams.get('store');
  const detectedStoreSlug = initialStoreSlug || storeParam;
  const { storeSlug } = useTheme();

  const isBackoffice =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/register-store') ||
    pathname.startsWith('/sso') ||
    pathname.startsWith('/cms');
    
  // Root domain homepage without a store parameter is the Universal SaaS Landing Page (which has its own header & footer)
  const isPlatformHome = pathname === '/' && !detectedStoreSlug;

  // Initialize ad pixels and fire PageView for the active store across the storefront
  useEffect(() => {
    if (!isBackoffice && !isPlatformHome && storeSlug) {
      fetchAndInitPixels(storeSlug);
    }
  }, [isBackoffice, isPlatformHome, storeSlug]);

  if (isBackoffice || isPlatformHome) {
    return <>{children}</>;
  }

  const isProductPage = pathname.startsWith('/product/');

  return (
    <>
      {/* Single sticky container for demo bar + navbar — prevents top-8 overlap */}
      <div className="sticky top-0 z-40">
        <ThemeSelectorBar />
        <Navbar />
      </div>
      <main className={`min-w-0 ${!isProductPage ? 'pb-20 md:pb-0' : ''}`}>{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
      <MobileMenuDrawer />
      <SearchModal />
    </>

  );
}

export function StorefrontShell({ children, initialStoreSlug }: { children: React.ReactNode, initialStoreSlug?: string }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ShellContent initialStoreSlug={initialStoreSlug}>{children}</ShellContent>
    </Suspense>
  );
}
