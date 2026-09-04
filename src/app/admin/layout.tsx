'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Package, Palette, 
  TrendingUp, Truck, CreditCard, ExternalLink, 
  Clock, Store, Menu, X, Users, Filter, Wallet, LogOut 
} from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

function AdminNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const { language, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/admin/login';
  };

  const navItems = [
    { label: t.nav.overview, href: `/admin?store=${storeSlug}`, icon: LayoutDashboard, exact: true },
    { label: t.nav.orders, href: `/admin/orders?store=${storeSlug}`, icon: ShoppingBag },
    { label: t.nav.products, href: `/admin/products?store=${storeSlug}`, icon: Package },
    { label: t.nav.builder, href: `/admin/builder?store=${storeSlug}`, icon: Palette },
    { label: t.nav.analytics, href: `/admin/analytics?store=${storeSlug}`, icon: TrendingUp },
    { label: t.nav.funnel, href: `/admin/funnel?store=${storeSlug}`, icon: Filter },
    { label: t.nav.customers, href: `/admin/customers?store=${storeSlug}`, icon: Users },
    { label: t.nav.payments, href: `/admin/payments?store=${storeSlug}`, icon: Wallet },
    { label: t.nav.logistics, href: `/admin/logistics?store=${storeSlug}`, icon: Truck },
    { label: t.nav.billing, href: `/admin/billing?store=${storeSlug}`, icon: CreditCard },
  ];

  const isBuilder = pathname.startsWith('/admin/builder');

  // If in builder mode, builder has its own specialized full-screen canvas layout
  if (isBuilder) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Desktop Sidebar */}
      <aside aria-label="Admin Navigation" className="hidden lg:flex w-64 flex-col bg-slate-900 border-r border-slate-800 shrink-0">
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link href={`/admin?store=${storeSlug}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              C
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">CODShop</span>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
            PRO
          </span>
        </div>

        {/* Store Profile Card */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{t.common.activeStore}</span>
            <a
              href={`/?store=${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              {t.common.liveStorefront} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="font-bold text-white text-sm truncate">{storeSlug}.codshop.vipone.site</div>
          
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-[10px] text-amber-400">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{t.common.trialRemaining}</span>
            </div>
          </div>

          <div className="pt-1">
            <LanguageToggle />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === '/admin'
              : pathname.startsWith(item.href.split('?')[0]);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Profile & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <div className="truncate pr-2">
              <p className="font-bold text-white text-xs truncate">
                {currentUser?.name || 'Marchand COD'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {currentUser?.email || 'admin@ottavio.ma'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title={t.auth?.logout || 'Déconnexion'}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <div className="px-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>{t.common.supportOnline}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
          <Link href={`/admin?store=${storeSlug}`} className="font-extrabold text-white text-sm flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
              C
            </div>
            <span>{storeSlug}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-3">
              <span className="text-xs text-slate-400 truncate">{currentUser?.email || 'admin@ottavio.ma'}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-rose-400 font-bold py-1 px-2 rounded-lg hover:bg-rose-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.auth?.logout || 'Déconnexion'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Admin...</div>}>
      <LanguageProvider>
        <AdminNav>{children}</AdminNav>
      </LanguageProvider>
    </Suspense>
  );
}
