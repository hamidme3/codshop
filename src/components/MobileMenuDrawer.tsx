'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useSearch } from '@/context/SearchContext';
import { X, ChevronDown, ChevronRight, Search, Compass, ExternalLink } from 'lucide-react';
import type { MenuItem } from '@/lib/types';

export function MobileMenuDrawer() {
  const { theme, storeSlug, getMenu, isMobileMenuOpen, closeMobileMenu, lang } = useTheme();
  const { openSearch } = useSearch();

  // State to track expanded items at Level 1 and Level 2
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  const mobileMenu = getMenu('mobile_drawer') || getMenu('header');
  const items = mobileMenu?.items || [];

  const toggleExpand = (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  const isRTL = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex md:hidden" aria-modal="true" role="dialog">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Sheet */}
      <div
        className={`relative w-[85%] max-w-sm h-full flex flex-col z-10 shadow-2xl transition-transform animate-in duration-250 ease-out border-r ${
          isRTL ? 'mr-auto slide-in-from-right' : 'ml-auto slide-in-from-left'
        }`}
        style={{
          backgroundColor: 'var(--theme-card-bg, #09090b)',
          borderColor: 'var(--theme-border, #27272a)',
          color: 'var(--theme-text-primary, #ffffff)',
        }}
      >
        {/* Drawer Header */}
        <div
          className="h-16 px-4 flex items-center justify-between border-b shrink-0"
          style={{ borderColor: 'var(--theme-border, #27272a)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {theme.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div
                className="font-black tracking-tight text-sm truncate"
                style={{ color: 'var(--theme-text-primary)' }}
              >
                {theme.name.toUpperCase()}
              </div>
              <div
                className="text-[10px] -mt-0.5 font-medium tracking-wide truncate max-w-[170px]"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                {theme.tagline}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition hover:opacity-80 cursor-pointer shrink-0"
            style={{
              borderColor: 'var(--theme-border)',
              backgroundColor: 'var(--theme-card-bg)',
              color: 'var(--theme-text-secondary)',
            }}
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Trigger Bar */}
        <div className="p-3 border-b shrink-0" style={{ borderColor: 'var(--theme-border, #27272a)' }}>
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              openSearch();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition cursor-pointer hover:opacity-90 shadow-2xs"
            style={{
              backgroundColor: 'color-mix(in oklch, var(--theme-border) 25%, var(--theme-card-bg))',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Rechercher des produits...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Multi-Level Navigation Accordion Tree */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 overscroll-contain">
          {items.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isExpanded = Boolean(expandedItems[item.id]);

            return (
              <div key={item.id} className="space-y-1">
                {/* Level 1 Item Row */}
                <div
                  className="rounded-xl flex items-center justify-between transition min-h-[46px] px-3 font-bold text-xs"
                  style={{
                    backgroundColor: isExpanded
                      ? 'color-mix(in oklch, var(--theme-primary) 8%, transparent)'
                      : 'transparent',
                    color: 'var(--theme-text-primary)',
                  }}
                >
                  <a
                    href={item.url}
                    onClick={handleLinkClick}
                    target={item.isOpenNewTab ? '_blank' : undefined}
                    rel={item.isOpenNewTab ? 'noopener noreferrer' : undefined}
                    className="flex-1 flex items-center gap-2 py-3 min-w-0"
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badgeText && (
                      <span
                        className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded shrink-0 shadow-2xs"
                        style={{
                          backgroundColor:
                            item.badgeColor === 'rose'
                              ? '#f43f5e'
                              : item.badgeColor === 'amber'
                              ? '#f59e0b'
                              : item.badgeColor === 'accent'
                              ? theme.colors.accent
                              : theme.colors.badgeBg || theme.colors.primary,
                          color: theme.colors.badgeText || '#ffffff',
                        }}
                      >
                        {item.badgeText}
                      </span>
                    )}
                    {item.isOpenNewTab && <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />}
                  </a>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(item.id, e)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg transition hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer shrink-0"
                      aria-label={`Développer ${item.label}`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" style={{ color: theme.colors.primary }} />
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      )}
                    </button>
                  )}
                </div>

                {/* Level 2 Submenu Items */}
                {hasChildren && isExpanded && (
                  <div
                    className="pl-3 space-y-1 border-l-2 ml-3 my-1"
                    style={{ borderColor: 'var(--theme-border)' }}
                  >
                    {item.children!.map((sub) => {
                      const hasSubChildren = Boolean(sub.children && sub.children.length > 0);
                      const isSubExpanded = Boolean(expandedItems[sub.id]);

                      return (
                        <div key={sub.id} className="space-y-1">
                          {/* Level 2 Item Row */}
                          <div
                            className="rounded-lg flex items-center justify-between transition min-h-[42px] px-2.5 font-semibold text-xs"
                            style={{
                              backgroundColor: isSubExpanded
                                ? 'color-mix(in oklch, var(--theme-primary) 5%, transparent)'
                                : 'transparent',
                              color: 'var(--theme-text-primary)',
                            }}
                          >
                            <a
                              href={sub.url}
                              onClick={handleLinkClick}
                              target={sub.isOpenNewTab ? '_blank' : undefined}
                              rel={sub.isOpenNewTab ? 'noopener noreferrer' : undefined}
                              className="flex-1 flex items-center gap-2 py-2.5 min-w-0"
                            >
                              <span className="truncate">{sub.label}</span>
                              {sub.badgeText && (
                                <span
                                  className="text-[8px] font-black uppercase px-1 py-0.2 rounded shrink-0"
                                  style={{
                                    backgroundColor: theme.colors.badgeBg || theme.colors.primary,
                                    color: theme.colors.badgeText || '#ffffff',
                                  }}
                                >
                                  {sub.badgeText}
                                </span>
                              )}
                            </a>

                            {hasSubChildren && (
                              <button
                                type="button"
                                onClick={(e) => toggleExpand(sub.id, e)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer shrink-0"
                                aria-label={`Développer ${sub.label}`}
                              >
                                {isSubExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Level 3 Nested Sub-item links */}
                          {hasSubChildren && isSubExpanded && (
                            <div
                              className="pl-3 space-y-0.5 border-l ml-3 my-0.5"
                              style={{ borderColor: 'var(--theme-border)' }}
                            >
                              {sub.children!.map((nested) => (
                                <a
                                  key={nested.id}
                                  href={nested.url}
                                  onClick={handleLinkClick}
                                  target={nested.isOpenNewTab ? '_blank' : undefined}
                                  rel={nested.isOpenNewTab ? 'noopener noreferrer' : undefined}
                                  className="block py-2 px-2.5 rounded-md text-[11px] font-medium transition hover:bg-black/5 dark:hover:bg-white/5 truncate"
                                  style={{ color: 'var(--theme-text-secondary)' }}
                                >
                                  {nested.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Notice */}
        <div
          className="p-3 border-t text-center text-[10px] shrink-0"
          style={{
            borderColor: 'var(--theme-border, #27272a)',
            color: 'var(--theme-text-secondary)',
          }}
        >
          Livraison Partout au Maroc • Paiement à la Réception
        </div>
      </div>
    </div>
  );
}
