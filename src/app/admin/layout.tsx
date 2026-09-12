'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Package, Palette, 
  TrendingUp, Truck, CreditCard, ExternalLink, 
  Clock, Menu, X, Users, Filter, Wallet, LogOut, Shield, 
  UserCheck, Zap, LifeBuoy, UserCog, Layers, Search, ChevronRight,
  Command, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import LanguageToggle from '@/components/LanguageToggle';
import StoreSwitcher from '@/components/admin/StoreSwitcher';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    badge?: string;
  }[];
}

function AdminNav({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const { language, setLanguage, t } = useLanguage();

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

  // Keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandModal((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/admin/login';
  };

  const navSections: NavSection[] = [
    {
      title: 'OPÉRATIONS & VENTES',
      items: [
        { label: t.nav.overview, href: `/admin?store=${storeSlug}`, icon: LayoutDashboard, exact: true },
        { label: t.nav.orders, href: `/admin/orders?store=${storeSlug}`, icon: ShoppingBag, badge: '4-Étapes' },
        { label: t.nav.logistics, href: `/admin/logistics?store=${storeSlug}`, icon: Truck },
        { label: t.nav.customers, href: `/admin/customers?store=${storeSlug}`, icon: Users },
      ],
    },
    {
      title: 'CATALOGUE & BOUTIQUE',
      items: [
        { label: t.nav.products, href: `/admin/products?store=${storeSlug}`, icon: Package },
        { label: t.nav.builder, href: `/admin/builder?store=${storeSlug}`, icon: Layers },
        { label: t.nav.themes, href: `/admin/themes?store=${storeSlug}`, icon: Palette },
      ],
    },
    {
      title: 'FINANCES & PERFORMANCE',
      items: [
        { label: t.nav.analytics, href: `/admin/analytics?store=${storeSlug}`, icon: TrendingUp },
        { label: t.nav.funnel, href: `/admin/funnel?store=${storeSlug}`, icon: Filter },
        { label: t.nav.payments, href: `/admin/payments?store=${storeSlug}`, icon: Wallet },
        { label: t.nav.billing, href: `/admin/billing?store=${storeSlug}`, icon: CreditCard },
      ],
    },
    {
      title: 'CONFIGURATION & SYSTÈME',
      items: [
        { label: 'Pixels & Publicités', href: `/admin/ads?store=${storeSlug}`, icon: Zap },
        { label: 'Identité & KYC', href: `/admin/identity?store=${storeSlug}`, icon: UserCheck },
        { label: 'Sécurité & Accès', href: `/admin/security?store=${storeSlug}`, icon: Shield },
        { label: 'Mon Compte Marchand', href: `/admin/account?store=${storeSlug}`, icon: UserCog },
        { label: 'Support & Concierge', href: `/admin/support?store=${storeSlug}`, icon: LifeBuoy },
      ],
    },
  ];

  // Flat items for ⌘K quick navigation
  const allNavItems = useMemo(() => {
    return navSections.flatMap((s) => s.items);
  }, [navSections]);

  const filteredCommandItems = useMemo(() => {
    if (!commandQuery.trim()) return allNavItems;
    const q = commandQuery.toLowerCase();
    return allNavItems.filter((item) => item.label.toLowerCase().includes(q));
  }, [allNavItems, commandQuery]);

  // Derive current section for breadcrumbs
  const currentSection = useMemo(() => {
    for (const sec of navSections) {
      for (const item of sec.items) {
        if (item.exact ? pathname === '/admin' : pathname.startsWith(item.href.split('?')[0])) {
          return { sectionTitle: sec.title, itemTitle: item.label };
        }
      }
    }
    return { sectionTitle: 'ADMINISTRATION', itemTitle: 'Tableau de Bord' };
  }, [pathname, navSections]);

  const isBuilder = pathname.startsWith('/admin/builder');

  // If in builder mode, builder has its own specialized full-screen canvas layout
  if (isBuilder) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans admin-shell selection:bg-amber-500/20 selection:text-amber-200">
      {/* Desktop Enterprise Sidebar */}
      <aside aria-label="Admin Navigation" className="hidden lg:flex w-64 flex-col bg-[#0d0d10] border-r border-zinc-800/80 shrink-0">
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-zinc-800/80">
          <Link href={`/admin?store=${storeSlug}`} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xs shadow-sm">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-sm tracking-tight leading-none">CODShop</span>
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider">ENTERPRISE 2026</span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/80 text-[10px] font-mono text-zinc-300 border border-zinc-700/60">
            <span>PRO</span>
          </div>
        </div>

        {/* Store Profile & Switcher Box */}
        <div className="p-3.5 border-b border-zinc-800/80 bg-[#0a0a0c] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">{t.common.activeStore}</span>
            <a
              href={`/?store=${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <span>{t.common.liveStorefront}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <StoreSwitcher currentSlug={storeSlug} />

          <div className="flex items-center justify-between pt-0.5 text-[10px] text-zinc-500 font-medium">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500/80" />
              <span>14 j restants (Essai)</span>
            </div>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Casablanca</span>
            </span>
          </div>
        </div>

        {/* Grouped Navigation Sections */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto admin-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-extrabold text-zinc-500 tracking-wider">
                {section.title}
              </div>

              {section.items.map((item) => {
                const isActive = item.exact
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href.split('?')[0]);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors group ${
                      isActive
                        ? 'bg-zinc-800/90 text-white font-bold border-l-2 border-amber-500 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile & Footer Actions */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#0a0a0c] space-y-2">
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="truncate pr-2">
              <p className="font-bold text-white text-xs truncate">
                {currentUser?.name || 'Marchand COD'}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono truncate">
                {currentUser?.email || 'admin@ottavio.ma'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title={t.auth?.logout || 'Déconnexion'}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Sticky Header */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Sticky Header */}
        <header className="hidden lg:flex h-14 bg-[#0d0d10] border-b border-zinc-800/80 px-6 items-center justify-between sticky top-0 z-30">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Link href={`/admin?store=${storeSlug}`} className="hover:text-zinc-200 transition-colors">
              {storeSlug.toUpperCase()}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-200 font-semibold">{currentSection.itemTitle}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Command Search Trigger */}
            <button
              onClick={() => setShowCommandModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Rechercher...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">⌘K</kbd>
            </button>

            {/* Direct Storefront Link */}
            <a
              href={`/?store=${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-amber-400 hover:border-zinc-700 transition-colors"
            >
              <span>Boutique</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Online Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Opérationnel</span>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-[#0d0d10] border-b border-zinc-800 px-4 flex items-center justify-between sticky top-0 z-30">
          <Link href={`/admin?store=${storeSlug}`} className="font-extrabold text-white text-sm flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xs">
              C
            </div>
            <span>{storeSlug}</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-Over Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d0d10] border-b border-zinc-800 p-4 space-y-4 max-h-[85vh] overflow-y-auto">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <div className="text-[10px] font-extrabold text-zinc-500 tracking-wider px-2">
                  {sec.title}
                </div>
                {sec.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    <item.icon className="w-4 h-4 text-zinc-400" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between px-2">
              <span className="text-xs text-zinc-400 truncate">{currentUser?.email || 'admin@ottavio.ma'}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-rose-400 font-bold py-1 px-2.5 rounded-lg hover:bg-rose-500/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto admin-scrollbar">
          {children}
        </main>
      </div>

      {/* Quick Search & Command Bar Modal (⌘K) */}
      {showCommandModal && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150"
          onClick={() => setShowCommandModal(false)}
        >
          <div 
            className="bg-[#121215] border border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Accéder directement à une section (Commandes, Stocks, Thèmes...)"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">ESC</kbd>
            </div>

            <div className="max-h-72 overflow-y-auto p-2 space-y-1 admin-scrollbar text-xs">
              {filteredCommandItems.length === 0 ? (
                <div className="p-4 text-center text-zinc-500">
                  Aucune section trouvée pour &quot;{commandQuery}&quot;
                </div>
              ) : (
                filteredCommandItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setShowCommandModal(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 text-zinc-500 group-hover:text-amber-400" />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>Navigation express CODShop</span>
              <span className="font-mono">Entrée ↵ pour ouvrir</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">Chargement Admin...</div>}>
      <LanguageProvider>
        <AdminNav>{children}</AdminNav>
      </LanguageProvider>
    </Suspense>
  );
}
