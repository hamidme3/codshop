'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

export function CartWidget() {
  const { totalCount, openCart } = useCart();
  const { theme } = useTheme();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Ouvrir le panier (${totalCount} articles)`}
      className="relative px-3 py-2 rounded-xl text-white transition shadow-sm flex items-center gap-2 cursor-pointer hover:opacity-95 active:scale-95"
      style={{ backgroundColor: theme.colors?.primary || '#090d16' }}
    >
      <ShoppingCart className="w-4 h-4" />
      <span className="text-xs font-bold hidden sm:inline">Panier</span>
      {totalCount > 0 ? (
        <span className="bg-emerald-500 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded-full flex items-center justify-center shadow-xs">
          {totalCount}
        </span>
      ) : (
        <span className="text-[10px] text-white/75 font-normal">(0)</span>
      )}
    </button>
  );
}
