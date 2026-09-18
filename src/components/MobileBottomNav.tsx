'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSearch } from '@/context/SearchContext';
import { useTheme } from '@/context/ThemeContext';
import { getCountryConfig } from '@/lib/geo';
import {
  Home,
  Compass,
  Search,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname() || '';
  const { totalCount, openCart } = useCart();
  const { isOpen: isSearchOpen, openSearch } = useSearch();
  const { theme, countryCode } = useTheme();

  const countryConfig = useMemo(() => getCountryConfig(countryCode || 'MA'), [countryCode]);

  // Hide on product detail pages because they feature the sticky purchase bar
  if (pathname.startsWith('/product/')) {
    return null;
  }

  // Hide on admin backoffice and registration pages
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/register-store') ||
    pathname.startsWith('/sso')
  ) {
    return null;
  }

  // Preserve store query parameter if present on non-subdomain setup
  const getNavHref = (targetPath: string) => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname.toLowerCase();
      const rootDomain = (process.env.NEXT_PUBLIC_WILDCARD_DOMAIN || 'codshop.vipone.site').toLowerCase();
      const hasSub =
        (host.endsWith(rootDomain) && host !== rootDomain && host !== `www.${rootDomain}`) ||
        (host.endsWith('.localhost') && host !== 'localhost');

      if (!hasSub) {
        const urlParams = new URLSearchParams(window.location.search);
        const store = urlParams.get('store');
        if (store) {
          const sep = targetPath.includes('?') ? '&' : '?';
          return `${targetPath}${sep}store=${encodeURIComponent(store)}`;
        }
      }
    }
    return targetPath;
  };

  const isHome = pathname === '/';
  const isCatalog = pathname.startsWith('/catalog');

  const whatsappPhone = countryConfig?.phone?.dialCode
    ? `${countryConfig.phone.dialCode.replace('+', '')}661000000`
    : '212661000000';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Salam, j'ai une question sur vos produits sur ${theme.name}`
  )}`;

  return (
    <nav
      aria-label="Navigation mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-lg shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)] transition-all"
      style={{
        backgroundColor: 'color-mix(in oklch, var(--theme-card-bg) 92%, transparent)',
        borderColor: 'var(--theme-border)',
      }}
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {/* 1. Accueil / Home */}
        <a
          href={getNavHref('/')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
            isHome ? 'font-black' : 'font-medium opacity-70 hover:opacity-100'
          }`}
          style={{
            color: isHome ? theme.colors.primary : 'var(--theme-text-secondary)',
          }}
          aria-current={isHome ? 'page' : undefined}
        >
          <Home className="w-5 h-5 mb-1" strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-[10px] tracking-tight truncate max-w-[64px]">Accueil</span>
        </a>

        {/* 2. Catalogue */}
        <a
          href={getNavHref('/catalog')}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors ${
            isCatalog ? 'font-black' : 'font-medium opacity-70 hover:opacity-100'
          }`}
          style={{
            color: isCatalog ? theme.colors.primary : 'var(--theme-text-secondary)',
          }}
          aria-current={isCatalog ? 'page' : undefined}
        >
          <Compass className="w-5 h-5 mb-1" strokeWidth={isCatalog ? 2.5 : 2} />
          <span className="text-[10px] tracking-tight truncate max-w-[64px]">Catalogue</span>
        </a>

        {/* 3. Recherche / Search Modal Trigger */}
        <button
          type="button"
          onClick={openSearch}
          className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors cursor-pointer ${
            isSearchOpen ? 'font-black' : 'font-medium opacity-70 hover:opacity-100'
          }`}
          style={{
            color: isSearchOpen ? theme.colors.primary : 'var(--theme-text-secondary)',
          }}
          aria-label="Ouvrir la recherche"
        >
          <Search className="w-5 h-5 mb-1" strokeWidth={isSearchOpen ? 2.5 : 2} />
          <span className="text-[10px] tracking-tight truncate max-w-[64px]">Recherche</span>
        </button>

        {/* 4. Panier / Cart Drawer */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors cursor-pointer font-medium opacity-70 hover:opacity-100"
          style={{ color: 'var(--theme-text-secondary)' }}
          aria-label={`Panier (${totalCount} articles)`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-1" strokeWidth={2} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
                {totalCount > 9 ? '9+' : totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight truncate max-w-[64px]">Panier</span>
        </button>

        {/* 5. WhatsApp Support */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-full min-h-[48px] py-1 text-emerald-600 hover:text-emerald-700 transition-colors"
          aria-label="Assistance WhatsApp"
        >
          <MessageCircle className="w-5 h-5 mb-1 stroke-[2.2]" />
          <span className="text-[10px] font-bold tracking-tight truncate max-w-[64px]">WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
