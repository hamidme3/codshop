'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Package, Palette, 
  TrendingUp, Truck, CreditCard, ExternalLink, 
  Clock, Store, Menu, X 
} from 'lucide-react';

function AdminNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Vue d\'Ensemble', href: `/admin?store=${storeSlug}`, icon: LayoutDashboard, exact: true },
    { label: 'Commandes COD', href: `/admin/orders?store=${storeSlug}`, icon: ShoppingBag },
    { label: 'Produits & Stocks', href: `/admin/products?store=${storeSlug}`, icon: Package },
    { label: 'Page Builder Visuel', href: `/admin/builder?store=${storeSlug}`, icon: Palette },
    { label: 'Analytiques & KPIs', href: `/admin/analytics?store=${storeSlug}`, icon: TrendingUp },
    { label: 'Transporteurs (Ozon)', href: `/admin/logistics?store=${storeSlug}`, icon: Truck },
    { label: 'Abonnement (14j)', href: `/admin/billing?store=${storeSlug}`, icon: CreditCard },
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
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Boutique active :</span>
            <a
              href={`/?store=${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              Voir en direct <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="font-bold text-white text-sm truncate">{storeSlug}.codshop.site</div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Essai gratuit : <strong>14 jours</strong></span>
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

        {/* Bottom User / Support Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Support WhatsApp 24/7</span>
          <span className="text-emerald-400 font-bold">En Ligne</span>
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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Chargement Admin...</div>}>
      <AdminNav>{children}</AdminNav>
    </Suspense>
  );
}
