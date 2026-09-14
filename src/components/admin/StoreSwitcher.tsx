'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Store, ChevronDown, Check, Plus } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  slug: string;
  url: string;
  isOwner?: boolean;
  active: boolean;
}

export default function StoreSwitcher({ currentSlug }: { currentSlug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [managedStores, setManagedStores] = useState<StoreItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/shop/stores')
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setStores(data.data);
        if (data.managedStores) setManagedStores(data.managedStores);
      })
      .catch((err) => console.error('[StoreSwitcher] Failed to fetch stores:', err));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStore = [...stores, ...managedStores].find(
    (s) => s.slug === currentSlug
  ) || {
    id: 'default',
    name: currentSlug.toUpperCase(),
    slug: currentSlug,
    url: `/admin/switch-store?store=${currentSlug}`,
    active: true,
  };

  const handleSwitch = (url: string) => {
    setIsOpen(false);
    window.location.href = url;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-slate-600 transition-all text-left group cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
              {currentStore.name}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">Boutique en ligne</span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden text-xs">
          <div className="p-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mes Boutiques ({stores.length})
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Connecté</span>
          </div>

          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
            {stores.map((s) => {
              const isSelected = s.slug === currentSlug;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSwitch(s.url)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${
                      isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Store className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{s.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {isSelected ? 'Boutique actuelle' : 'Changer de boutique'}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}

            {managedStores.length > 0 && (
              <>
                <div className="p-2 pt-3 border-t border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Boutiques Collaborateur ({managedStores.length})
                </div>
                {managedStores.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSwitch(s.url)}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 flex items-center justify-center text-xs shrink-0">
                        <Store className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">{s.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">Accès délégué</p>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          <div className="p-2 border-t border-slate-800 bg-slate-950/60">
            <button
              type="button"
              onClick={() => {
                const name = prompt('Nom de votre nouvelle boutique :');
                if (name) {
                  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                  window.location.href = `/onboarding?store=${slug}`;
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] transition-colors border border-emerald-500/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Créer une nouvelle boutique
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
