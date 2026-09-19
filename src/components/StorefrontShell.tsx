'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeSelectorBar } from '@/components/ThemeSelectorBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SearchModal } from '@/components/SearchModal';

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const storeParam = searchParams.get('store');
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      const rootDomain = (process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site').toLowerCase();
      const hasSub = (host.endsWith(rootDomain) && host !== rootDomain && host !== `www.${rootDomain}`) ||
                     (host.endsWith('.localhost') && host !== 'localhost');
      setIsSubdomain(hasSub);
    }
  }, []);

  const isBackoffice =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/register-store') ||
    pathname.startsWith('/sso') ||
    pathname.startsWith('/cms');
  // Root domain homepage without a store parameter is the Universal SaaS Landing Page (which has its own header & footer)
  const isPlatformHome = pathname === '/' && !storeParam && !isSubdomain;

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
      <SearchModal />
    </>
  );
}

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ShellContent>{children}</ShellContent>
    </Suspense>
  );
}
