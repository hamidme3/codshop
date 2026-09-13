'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export interface CartItem {
  id: string; // composite key: productId-color-size-variant
  productId: string;
  slug: string;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
  variant?: string;
  sku?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'codshop_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe client hydration from localStorage/sessionStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY) || sessionStorage.getItem('cod_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Normalize items with composite id and valid quantity
          const normalized: CartItem[] = parsed.map((item) => ({
            id: item.id || `${item.productId || item.slug || 'prod'}-${item.color || ''}-${item.size || ''}-${item.variant || ''}`,
            productId: item.productId || item.id || 'prod_1',
            slug: item.slug || 'produit',
            title: item.title || 'Article',
            price: Number(item.price) || 0,
            originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
            quantity: Math.max(1, Number(item.quantity || item.qty) || 1),
            image: item.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
            color: item.color,
            size: item.size,
            variant: item.variant,
            sku: item.sku,
          }));
          setItems(normalized);
        }
      }
    } catch {
      // Guard against SSR or corrupted storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage whenever items change after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      sessionStorage.setItem('cod_cart', JSON.stringify(items));
    } catch {
      // ignore storage quota errors
    }
  }, [items, isHydrated]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number; id?: string }) => {
    const qtyToAdd = Math.max(1, newItem.quantity || 1);
    const compositeId =
      newItem.id ||
      `${newItem.productId || newItem.slug}-${newItem.color || ''}-${newItem.size || ''}-${newItem.variant || ''}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === compositeId);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + qtyToAdd,
        };
        return copy;
      }
      return [
        ...prev,
        {
          ...newItem,
          id: compositeId,
          quantity: qtyToAdd,
        },
      ];
    });

    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      sessionStorage.removeItem('cod_cart');
    } catch {}
  }, []);

  const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const openCart = useCallback(() => setIsDrawerOpen(true), []);
  const closeCart = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isDrawerOpen,
        setIsDrawerOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
