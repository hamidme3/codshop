'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  qty: number;
  image: string;
}

export function CartWidget() {
  const { theme, formatPrice } = useTheme();
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cod_cart');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('cod_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Panier (${count} articles)`}
        className="relative p-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition shadow-md"
      >
        <ShoppingCart className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{count}</span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-end p-4 sm:p-8 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden animate-in slide-in-from-right duration-200 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 text-white border-b border-zinc-800">
              <h2 className="font-black text-sm flex items-center gap-2">Mon panier <span className="text-zinc-400 font-normal text-xs">({count})</span></h2>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="p-1 rounded-full hover:bg-zinc-700 transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {items.length === 0 ? (
                <div className="text-center text-zinc-400 text-sm py-8">Votre panier est vide.</div>
              ) : (
                items.map((i) => (
                  <div key={i.id} className="flex gap-3 bg-zinc-50 rounded-xl p-2 border border-zinc-100">
                    <img src={i.image} alt={i.title} className="w-14 h-14 rounded-lg object-cover bg-zinc-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate">{i.title}</div>
                      <div className="text-xs text-zinc-500">{i.qty} × {formatPrice(i.price)}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => setItems(items.map(x => x.id === i.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))} aria-label="Moins" className="w-5 h-5 rounded-full bg-white border border-zinc-300 flex items-center justify-center text-xs hover:border-zinc-400"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{i.qty}</span>
                        <button onClick={() => setItems(items.map(x => x.id === i.id ? { ...x, qty: x.qty + 1 } : x))} aria-label="Plus" className="w-5 h-5 rounded-full bg-white border border-zinc-300 flex items-center justify-center text-xs hover:border-zinc-400"><Plus className="w-3 h-3" /></button>
                        <button onClick={() => setItems(items.filter(x => x.id !== i.id))} aria-label="Supprimer" className="ml-auto text-red-500 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-3 border-t border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-zinc-900"><span>Total</span><span>{formatPrice(total)}</span></div>
                <a href="/" className="block w-full py-3 text-center text-white font-black text-sm rounded-xl shadow-lg" style={{ backgroundColor: theme.colors?.primary || '#f59e0b' }}>
                  Passer la commande (COD)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
