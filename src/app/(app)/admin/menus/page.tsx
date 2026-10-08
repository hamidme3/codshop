'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Menu, Compass, Plus, Trash2, Edit2, ArrowUp, ArrowDown, 
  ArrowRight, ArrowLeft, Save, RotateCcw, ExternalLink, 
  CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronRight,
  Layers, Package, Tag, ShoppingBag, Eye, Smartphone, Monitor,
  FileText, ShieldCheck
} from 'lucide-react';
import { getCategories, PRODUCTS } from '@/lib/mocks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import type { MenuItem, MenuPlacement, MenuLinkType, StoreMenu, Product, Category, StorePage } from '@/lib/types';


const PLACEMENTS: { id: MenuPlacement; label: string; icon: any; description: string }[] = [
  { 
    id: 'header', 
    label: 'Menu Header (Desktop)', 
    icon: Monitor, 
    description: 'Barre de navigation principale affichée en haut de la boutique sur ordinateur.' 
  },
  { 
    id: 'mobile_drawer', 
    label: 'Menu Mobile (Tiroir)', 
    icon: Smartphone, 
    description: 'Menu latéral coulissant affiché sur smartphone avec navigation par catégories.' 
  },
  { 
    id: 'footer_col_1', 
    label: 'Pied de page — Col. 1', 
    icon: Layers, 
    description: 'Première colonne de liens de navigation dans le footer de la boutique.' 
  },
  { 
    id: 'footer_col_2', 
    label: 'Pied de page — Col. 2', 
    icon: Layers, 
    description: 'Deuxième colonne dédiée aux garanties et au service client COD.' 
  },
];

interface FlatItem extends MenuItem {
  level: number; // 0 = Parent, 1 = Submenu, 2 = Nested Sub-item
  parentId?: string;
  path: number[]; // indices in nested structure
}

function MenusContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || (typeof window !== 'undefined' ? localStorage.getItem('codshop_active_store') : null) || "";
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [activePlacement, setActivePlacement] = useState<MenuPlacement>('header');
  const [menus, setMenus] = useState<StoreMenu[]>([]);
  const [currentItems, setCurrentItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Available Categories, Products & Custom Pages for Link Pickers
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [storePages, setStorePages] = useState<StorePage[]>([]);

  // Item Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id?: string;
    label: string;
    type: MenuLinkType;
    url: string;
    targetId?: string;
    badgeText?: string;
    badgeColor?: 'primary' | 'accent' | 'rose' | 'amber' | 'emerald';
    isOpenNewTab?: boolean;
    parentItemPath?: number[]; // For adding as child
  } | null>(null);

  // Preview Mode
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Load Categories, Products & Store Pages for link pickers
  useEffect(() => {
    try {
      const cats = getCategories(storeSlug);
      setCategories(cats);
      const storeProds = PRODUCTS.filter((p) => p.storeSlug === storeSlug && p.status === 'active');
      setProducts(storeProds);
    } catch (err) {
      console.warn('Failed to load categories/products for picker:', err);
    }

    // Load custom pages and policies
    fetch(`/api/stores/${encodeURIComponent(storeSlug)}/pages`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.pages)) {
          setStorePages(data.pages);
        }
      })
      .catch((err) => console.warn('Failed to load store pages for menu picker:', err));
  }, [storeSlug]);

  // Load Menus from API
  const loadMenus = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${encodeURIComponent(storeSlug)}/menus`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.menus)) {
          setMenus(data.menus);
          const activeMenu = data.menus.find((m: StoreMenu) => m.placement === activePlacement);
          if (activeMenu) {
            setCurrentItems(JSON.parse(JSON.stringify(activeMenu.items || [])));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load menus:', err);
      setStatusMessage({ text: 'Erreur de chargement des menus', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [storeSlug, activePlacement]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // Switch placement tab
  const handlePlacementChange = (newPlacement: MenuPlacement) => {
    setActivePlacement(newPlacement);
    const found = menus.find((m) => m.placement === newPlacement);
    if (found) {
      setCurrentItems(JSON.parse(JSON.stringify(found.items || [])));
    } else {
      setCurrentItems([]);
    }
    setStatusMessage(null);
  };

  // Save current menu
  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/stores/${encodeURIComponent(storeSlug)}/menus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placement: activePlacement,
          items: currentItems,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ text: 'Menu enregistré avec succès !', type: 'success' });
        // Update local menus cache
        setMenus((prev) =>
          prev.map((m) => (m.placement === activePlacement ? { ...m, items: currentItems } : m))
        );
        // Dispatch custom event for storefront sync
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('store-menus-updated', { detail: { placement: activePlacement } }));
        }
      } else {
        setStatusMessage({ text: data.error || 'Erreur lors de la sauvegarde', type: 'error' });
      }
    } catch (err: any) {
      console.error('Save menu error:', err);
      setStatusMessage({ text: 'Erreur réseau lors de la sauvegarde', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Reset current menu to default
  const handleReset = async () => {
    if (!confirm('Voulez-vous restaurer les éléments recommandés par défaut pour ce menu ?')) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/stores/${encodeURIComponent(storeSlug)}/menus/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placement: activePlacement }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.menu) {
        setCurrentItems(JSON.parse(JSON.stringify(data.menu.items || [])));
        setStatusMessage({ text: 'Menu restauré aux valeurs recommandées', type: 'success' });
      }
    } catch (err) {
      console.error('Reset menu error:', err);
      setStatusMessage({ text: 'Erreur lors de la réinitialisation', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Flatten items for linear tree rendering with path and level (max 2 levels of nesting)
  const flattenedItems = useMemo<FlatItem[]>(() => {
    const result: FlatItem[] = [];

    const traverse = (items: MenuItem[], level: number, path: number[], parentId?: string) => {
      items.forEach((item, index) => {
        const currentPath = [...path, index];
        result.push({
          ...item,
          level,
          parentId,
          path: currentPath,
        });

        if (item.children && item.children.length > 0) {
          traverse(item.children, level + 1, currentPath, item.id);
        }
      });
    };

    traverse(currentItems, 0, []);
    return result;
  }, [currentItems]);

  // Tree Manipulation Helpers
  const getItemByPath = (items: MenuItem[], path: number[]): MenuItem | null => {
    let curr: any = items;
    for (let i = 0; i < path.length; i++) {
      if (!curr || !curr[path[i]]) return null;
      if (i === path.length - 1) return curr[path[i]];
      curr = curr[path[i]].children;
    }
    return null;
  };

  const removeItemByPath = (items: MenuItem[], path: number[]): MenuItem[] => {
    const copy = JSON.parse(JSON.stringify(items));
    if (path.length === 1) {
      copy.splice(path[0], 1);
      return copy;
    }

    let curr = copy;
    for (let i = 0; i < path.length - 1; i++) {
      curr = curr[path[i]].children;
    }
    curr.splice(path[path.length - 1], 1);
    return copy;
  };

  // Move item Up or Down within same parent
  const handleMove = (path: number[], direction: 'up' | 'down') => {
    const copy = JSON.parse(JSON.stringify(currentItems));
    const targetIdx = path[path.length - 1];
    const newIdx = direction === 'up' ? targetIdx - 1 : targetIdx + 1;

    let parentArr: any = copy;
    if (path.length > 1) {
      for (let i = 0; i < path.length - 1; i++) {
        if (!parentArr[path[i]].children) parentArr[path[i]].children = [];
        parentArr = parentArr[path[i]].children;
      }
    }


    if (newIdx < 0 || newIdx >= parentArr.length) return;

    const temp = parentArr[targetIdx];
    parentArr[targetIdx] = parentArr[newIdx];
    parentArr[newIdx] = temp;

    // update orders
    parentArr.forEach((it: MenuItem, idx: number) => {
      it.order = idx;
    });

    setCurrentItems(copy);
  };

  // Indent: Make this item a child of its preceding sibling (max depth 2)
  const handleIndent = (flatIdx: number) => {
    if (flatIdx <= 0) return;
    const currentFlat = flattenedItems[flatIdx];
    if (currentFlat.level >= 2) return; // already at max depth 2

    const prevFlat = flattenedItems[flatIdx - 1];
    // Can only indent if previous item is at same level or level + 1
    if (prevFlat.level < currentFlat.level) return;

    const copy = JSON.parse(JSON.stringify(currentItems));
    // Remove current from its current position
    const itemToMove = getItemByPath(copy, currentFlat.path);
    if (!itemToMove) return;

    const removed = removeItemByPath(copy, currentFlat.path);

    // Locate the preceding sibling in the updated tree
    // If previous was a sibling, it now has the index = currentFlat.path[last] - 1
    const parentPath = currentFlat.path.slice(0, -1);
    let parentArr: any = removed;
    for (const p of parentPath) {
      if (!parentArr[p].children) parentArr[p].children = [];
      parentArr = parentArr[p].children;
    }
    const prevSiblingIdx = currentFlat.path[currentFlat.path.length - 1] - 1;
    if (prevSiblingIdx < 0 || !parentArr[prevSiblingIdx]) return;

    const targetSibling = parentArr[prevSiblingIdx];
    if (!targetSibling.children) {
      targetSibling.children = [];
    }
    targetSibling.children.push(itemToMove);

    setCurrentItems(removed);
  };

  // Outdent: Move child item one level up (to parent's sibling)
  const handleOutdent = (flatItem: FlatItem) => {
    if (flatItem.level <= 0) return; // already at root

    const copy = JSON.parse(JSON.stringify(currentItems));
    const itemToMove = getItemByPath(copy, flatItem.path);
    if (!itemToMove) return;

    const removed = removeItemByPath(copy, flatItem.path);

    // Insert after parent item in grandparent's array
    const parentPath = flatItem.path.slice(0, -1); // path to parent
    const grandParentPath = parentPath.slice(0, -1);
    const parentIdx = parentPath[parentPath.length - 1];

    let grandParentArr: any = removed;
    for (const p of grandParentPath) {
      if (!grandParentArr[p].children) grandParentArr[p].children = [];
      grandParentArr = grandParentArr[p].children;
    }

    grandParentArr.splice(parentIdx + 1, 0, itemToMove);
    setCurrentItems(removed);
  };


  // Delete item
  const handleDelete = (path: number[], label: string) => {
    if (!confirm(`Supprimer l'élément "${label}" et ses éventuels sous-éléments ?`)) return;
    const updated = removeItemByPath(currentItems, path);
    setCurrentItems(updated);
  };

  // Open modal to add child
  const handleAddChild = (parentPath: number[]) => {
    setEditingItem({
      label: '',
      type: 'catalog',
      url: '/catalog',
      badgeText: '',
      badgeColor: 'primary',
      isOpenNewTab: false,
      parentItemPath: parentPath,
    });
    setIsModalOpen(true);
  };

  // Open modal to add root item
  const handleAddRoot = () => {
    setEditingItem({
      label: '',
      type: 'catalog',
      url: '/catalog',
      badgeText: '',
      badgeColor: 'primary',
      isOpenNewTab: false,
    });
    setIsModalOpen(true);
  };

  // Open modal to edit existing item
  const handleEdit = (flatItem: FlatItem) => {
    setEditingItem({
      id: flatItem.id,
      label: flatItem.label,
      type: flatItem.type,
      url: flatItem.url,
      targetId: flatItem.targetId,
      badgeText: flatItem.badgeText,
      badgeColor: flatItem.badgeColor || 'primary',
      isOpenNewTab: flatItem.isOpenNewTab,
      parentItemPath: flatItem.path, // path to this item
    });
    setIsModalOpen(true);
  };

  // Save Modal Item
  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.label.trim()) return;

    const copy = JSON.parse(JSON.stringify(currentItems));

    if (editingItem.id) {
      // Editing existing item
      const item = getItemByPath(copy, editingItem.parentItemPath!);
      if (item) {
        item.label = editingItem.label.trim();
        item.type = editingItem.type;
        item.url = editingItem.url.trim();
        item.targetId = editingItem.targetId;
        item.badgeText = editingItem.badgeText ? editingItem.badgeText.trim() : undefined;
        item.badgeColor = editingItem.badgeText ? editingItem.badgeColor || 'primary' : undefined;
        item.isOpenNewTab = Boolean(editingItem.isOpenNewTab);
      }
    } else if (editingItem.parentItemPath) {
      // Adding new child to existing parent
      const parent = getItemByPath(copy, editingItem.parentItemPath);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push({
          id: `item_${Date.now()}`,
          label: editingItem.label.trim(),
          type: editingItem.type,
          url: editingItem.url.trim(),
          targetId: editingItem.targetId,
          badgeText: editingItem.badgeText ? editingItem.badgeText.trim() : undefined,
          badgeColor: editingItem.badgeText ? editingItem.badgeColor || 'primary' : undefined,
          isOpenNewTab: Boolean(editingItem.isOpenNewTab),
          order: parent.children.length,
          children: [],
        });
      }
    } else {
      // Adding new root item
      copy.push({
        id: `item_${Date.now()}`,
        label: editingItem.label.trim(),
        type: editingItem.type,
        url: editingItem.url.trim(),
        targetId: editingItem.targetId,
        badgeText: editingItem.badgeText ? editingItem.badgeText.trim() : undefined,
        badgeColor: editingItem.badgeText ? editingItem.badgeColor || 'primary' : undefined,
        isOpenNewTab: Boolean(editingItem.isOpenNewTab),
        order: copy.length,
        children: [],
      });
    }

    setCurrentItems(copy);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Helper for link type selector change
  const handleLinkTypeChange = (newType: MenuLinkType) => {
    if (!editingItem) return;
    let url = editingItem.url;
    let targetId = editingItem.targetId;

    if (newType === 'home') {
      url = '/';
      targetId = undefined;
    } else if (newType === 'catalog') {
      url = '/catalog';
      targetId = undefined;
    } else if (newType === 'category') {
      const firstCat = categories[0]?.slug || 'maroquinerie';
      url = `/catalog?category=${firstCat}`;
      targetId = firstCat;
    } else if (newType === 'product') {
      const firstProd = products[0]?.sku || products[0]?.id || 'prod_1';
      url = `/product/${firstProd}`;
      targetId = firstProd;
    } else if (newType === 'page') {
      const firstPage = storePages[0]?.slug || 'terms';
      url = `/p/${firstPage}`;
      targetId = firstPage;
      if (!editingItem.label) {
        const found = storePages[0];
        if (found) editingItem.label = found.title;
      }
    } else if (newType === 'whatsapp') {
      url = 'https://wa.me/212661000000?text=Salam,%20j%27ai%20une%20question%20sur%20vos%20produits';
      targetId = undefined;
    }

    setEditingItem({
      ...editingItem,
      type: newType,
      url,
      targetId,
    });
  };

  // Helper to batch-add Moroccan COD legal policies to the footer
  const handleAddLegalPoliciesToFooter = () => {
    const copy = JSON.parse(JSON.stringify(currentItems)) as MenuItem[];
    const legalItems: { label: string; slug: string }[] = [
      { label: 'Conditions Générales (CGV)', slug: 'terms' },
      { label: 'Politique de Confidentialité', slug: 'privacy' },
      { label: 'Livraison & Inspection Colis', slug: 'shipping-policy' },
      { label: 'Retours & Échanges 7j', slug: 'returns' },
    ];

    let addedCount = 0;
    for (const leg of legalItems) {
      if (!copy.some((item) => item.url === `/p/${leg.slug}`)) {
        copy.push({
          id: `item_legal_${leg.slug}_${Date.now()}_${addedCount}`,
          label: leg.label,
          type: 'page',
          url: `/p/${leg.slug}`,
          targetId: leg.slug,
          order: copy.length,
          children: [],
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      setCurrentItems(copy);
      setStatusMessage({ text: `${addedCount} politique(s) ajoutée(s) au menu ! Cliquez sur Enregistrer.`, type: 'success' });
    } else {
      setStatusMessage({ text: 'Toutes les politiques légales sont déjà présentes dans ce menu.', type: 'success' });
    }
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Gestion des Menus & Navigation
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Organisez la structure de vos liens, collections, et sous-menus (jusqu'à 2 niveaux d'imbrication) pour chaque emplacement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving || loading}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Restaurer la configuration par défaut"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 transition animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Placement Tabs Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {PLACEMENTS.map((p) => {
          const Icon = p.icon;
          const isActive = activePlacement === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePlacementChange(p.id)}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-950 dark:text-white shadow-xs ring-1 ring-emerald-500/30'
                  : 'bg-white dark:bg-[#13171c] border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                {isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Actif
                  </span>
                )}
              </div>
              <div>
                <div className={`font-bold text-xs ${isActive ? 'text-emerald-950 dark:text-white' : 'text-slate-900 dark:text-zinc-100'}`}>{p.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{p.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Grid (Tree Editor & Simulator Preview) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hierarchical Tree Editor */}
        <div className="xl:col-span-8 bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800/80 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Structure des Liens</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                  {flattenedItems.length} élément{flattenedItems.length > 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Utilisez les flèches pour réordonner et indenter les sous-menus (Niveau 1 → Sous-menu → Sous-élément).
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activePlacement.startsWith('footer') && (
                <button
                  type="button"
                  onClick={handleAddLegalPoliciesToFooter}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition border border-sky-200 dark:border-sky-500/30 cursor-pointer shadow-2xs"
                  title="Ajouter en 1 clic les 4 politiques légales au pied de page"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>+ Politiques Légales</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleAddRoot}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 dark:border-zinc-700 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ajouter un lien principal</span>
              </button>
            </div>
          </div>

          {/* Tree Rows List */}
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-zinc-500 animate-pulse">
              Chargement de la navigation...
            </div>
          ) : flattenedItems.length === 0 ? (
            <div className="py-12 text-center space-y-3 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/40">
              <Compass className="w-8 h-8 mx-auto text-slate-400 dark:text-zinc-600" />
              <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Ce menu ne contient aucun lien pour le moment.</div>
              <button
                type="button"
                onClick={handleAddRoot}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-emerald-500 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer le premier lien</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {flattenedItems.map((item, flatIdx) => {
                const isRoot = item.level === 0;
                const isSub = item.level === 1;
                const isNested = item.level === 2;

                const parentPath = item.path.slice(0, -1);
                const itemIdxInParent = item.path[item.path.length - 1];
                let siblingsCount = currentItems.length;
                if (item.level > 0) {
                  let p: any = currentItems;
                  for (const seg of parentPath) {
                    p = p[seg]?.children || [];
                  }
                  siblingsCount = p.length;
                }

                const canMoveUp = itemIdxInParent > 0;
                const canMoveDown = itemIdxInParent < siblingsCount - 1;
                const canIndent = item.level < 2 && flatIdx > 0 && flattenedItems[flatIdx - 1].level >= item.level;
                const canOutdent = item.level > 0;
                const canAddChild = item.level < 2;

                return (
                  <div
                    key={item.id}
                    className={`group rounded-xl border transition-all flex items-center justify-between p-2.5 sm:p-3 ${
                      isRoot
                        ? 'bg-white dark:bg-[#0c0f12] border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-2xs'
                        : isSub
                        ? 'bg-slate-50/90 dark:bg-[#0c0f12]/90 border-slate-200 dark:border-zinc-800/80 ml-6 sm:ml-8 border-l-2 border-l-sky-500'
                        : 'bg-slate-50/60 dark:bg-[#0c0f12]/60 border-slate-200 dark:border-zinc-800/60 ml-12 sm:ml-16 border-l-2 border-l-purple-500'
                    }`}
                  >
                    {/* Item Information */}
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="flex flex-col items-center justify-center shrink-0">
                        {isRoot && <span className="w-2 h-2 rounded-full bg-emerald-500/80" />}
                        {isSub && <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />}
                        {isNested && <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate">
                            {item.label}
                          </span>

                          {/* Promo Micro-Badge if configured */}
                          {item.badgeText && (
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                                item.badgeColor === 'rose'
                                  ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                                  : item.badgeColor === 'amber'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                  : item.badgeColor === 'accent'
                                  ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              }`}
                            >
                              {item.badgeText}
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                            {item.type}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate max-w-xs sm:max-w-md mt-0.5">
                          {item.url}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => handleMove(item.path, 'up')}
                        disabled={!canMoveUp}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition disabled:opacity-20 cursor-pointer"
                        title="Monter"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => handleMove(item.path, 'down')}
                        disabled={!canMoveDown}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition disabled:opacity-20 cursor-pointer"
                        title="Descendre"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Indent (Make Submenu) */}
                      <button
                        type="button"
                        onClick={() => handleIndent(flatIdx)}
                        disabled={!canIndent}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-zinc-800 transition disabled:opacity-20 cursor-pointer"
                        title="Indenter (transformer en sous-élément)"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Outdent (Promote Up) */}
                      <button
                        type="button"
                        onClick={() => handleOutdent(item)}
                        disabled={!canOutdent}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-zinc-800 transition disabled:opacity-20 cursor-pointer"
                        title="Désindenter (remonter d'un niveau)"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Add Child Sub-item */}
                      {canAddChild && (
                        <button
                          type="button"
                          onClick={() => handleAddChild(item.path)}
                          className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition cursor-pointer"
                          title="Ajouter un sous-élément"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.path, item.label)}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Storefront Simulator */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Simulateur Visuel (Thème Actif)</span>
              </h3>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-0.5 rounded-lg border border-slate-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1 rounded text-xs transition cursor-pointer ${
                    previewMode === 'desktop' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
                  }`}
                  title="Aperçu Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1 rounded text-xs transition cursor-pointer ${
                    previewMode === 'mobile' ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
                  }`}
                  title="Aperçu Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Desktop Simulator View */}
            {previewMode === 'desktop' ? (
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Aperçu de la barre de navigation sur écran large :
                </div>

                <div
                  className="rounded-xl border p-3 text-xs shadow-inner space-y-2"
                  style={{
                    backgroundColor: 'var(--theme-card-bg, #18181b)',
                    borderColor: 'var(--theme-border, #27272a)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: 'var(--theme-border, #27272a)' }}>
                    <div className="flex items-center gap-1.5 font-bold text-xs" style={{ color: 'var(--theme-text-primary, #ffffff)' }}>
                      <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        {storeSlug.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate max-w-[100px]">{storeSlug.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">⌘K</span>
                      <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  </div>

                  {/* Render simulated links */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {currentItems.map((item) => (
                      <div
                        key={item.id}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition"
                        style={{
                          color: 'var(--theme-text-primary, #ffffff)',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        }}
                      >
                        <span>{item.label}</span>
                        {item.children && item.children.length > 0 && (
                          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                        )}
                        {item.badgeText && (
                          <span
                            className="text-[8px] font-black uppercase px-1 py-0.2 rounded"
                            style={{
                              backgroundColor: theme.colors.badgeBg || '#10b981',
                              color: theme.colors.badgeText || '#ffffff',
                            }}
                          >
                            {item.badgeText}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Simulator View */
              <div className="space-y-3">
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Aperçu du tiroir coulissant sur smartphone :
                </div>

                <div
                  className="rounded-xl border p-3.5 text-xs shadow-inner space-y-2.5 max-w-[260px] mx-auto"
                  style={{
                    backgroundColor: 'var(--theme-card-bg, #18181b)',
                    borderColor: 'var(--theme-border, #27272a)',
                  }}
                >
                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--theme-border, #27272a)' }}>
                    <div className="font-bold text-xs" style={{ color: 'var(--theme-text-primary, #ffffff)' }}>
                      {storeSlug.toUpperCase()}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">Tiroir</span>
                  </div>

                  <div className="space-y-1">
                    {currentItems.map((item) => (
                      <div key={item.id} className="space-y-0.5">
                        <div
                          className="px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between"
                          style={{
                            color: 'var(--theme-text-primary, #ffffff)',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span>{item.label}</span>
                            {item.badgeText && (
                              <span className="text-[8px] font-bold px-1 rounded bg-emerald-500/20 text-emerald-400">
                                {item.badgeText}
                              </span>
                            )}
                          </div>
                          {item.children && item.children.length > 0 && (
                            <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                          )}
                        </div>

                        {item.children && item.children.length > 0 && (
                          <div className="pl-3 space-y-0.5 border-l border-zinc-800 ml-1.5">
                            {item.children.map((sub) => (
                              <div
                                key={sub.id}
                                className="px-2 py-1 text-[11px] text-zinc-400 hover:text-white flex items-center justify-between"
                              >
                                <span>{sub.label}</span>
                                {sub.children && sub.children.length > 0 && (
                                  <ChevronRight className="w-2.5 h-2.5 opacity-40" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Help Card */}
          <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Bonnes Pratiques E-commerce COD</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/80">
              Pour maximiser votre taux de conversion, limitez le menu principal à <strong>4 à 6 éléments</strong> et mettez en avant vos collections phares ou promotions via un badge accrocheur (ex: <code className="text-rose-600 dark:text-rose-400 font-bold bg-white/60 dark:bg-zinc-900/60 px-1 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/40">-30%</code> ou <code className="text-emerald-600 dark:text-emerald-400 font-bold bg-white/60 dark:bg-zinc-900/60 px-1 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/40">HOT</code>).
            </p>
          </div>
        </div>
      </div>

      {/* Item Modal (Add / Edit) */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingItem.id
                  ? 'Modifier l\'élément de menu'
                  : editingItem.parentItemPath
                  ? 'Ajouter un sous-élément'
                  : 'Ajouter un lien principal'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white text-xs font-semibold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4">
              {/* Item Title / Label */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Titre / Libellé affiché <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  placeholder="Ex: Maroquinerie, Nouveautés, Promos..."
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Link Destination Type */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Type de destination
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  {[
                    { id: 'home', label: 'Accueil' },
                    { id: 'catalog', label: 'Catalogue' },
                    { id: 'category', label: 'Catégorie' },
                    { id: 'product', label: 'Produit' },
                    { id: 'page', label: 'Page / Politique' },
                    { id: 'whatsapp', label: 'WhatsApp' },
                    { id: 'url', label: 'URL Perso' },
                  ].map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleLinkTypeChange(dest.id as MenuLinkType)}
                      className={`px-2 py-1.5 rounded-lg border text-center font-medium transition cursor-pointer ${
                        editingItem.type === dest.id
                          ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {dest.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Pickers based on Type */}
              {editingItem.type === 'category' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Choisir la catégorie
                  </label>
                  <select
                    value={editingItem.targetId || ''}
                    onChange={(e) => {
                      const selCat = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        targetId: selCat,
                        url: `/catalog?category=${selCat}`,
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id || cat.slug} value={cat.slug}>
                        {cat.name} ({cat.productCount} produits)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingItem.type === 'product' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Choisir le produit
                  </label>
                  <select
                    value={editingItem.targetId || ''}
                    onChange={(e) => {
                      const selProd = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        targetId: selProd,
                        url: `/product/${selProd}`,
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.sku || prod.id}>
                        {prod.title} — {prod.price} MAD
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {editingItem.type === 'page' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                      Choisir la page ou politique
                    </label>
                    <Link
                      href={`/admin/pages?store=${storeSlug}`}
                      target="_blank"
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Gérer les pages</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                  {storePages.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400">
                      Aucune page enregistrée. Rendez-vous dans <Link href={`/admin/pages?store=${storeSlug}`} className="text-emerald-600 dark:text-emerald-400 underline font-medium">Pages & Politiques</Link> pour en créer.
                    </div>
                  ) : (
                    <select
                      value={editingItem.targetId || storePages[0]?.slug || ''}
                      onChange={(e) => {
                        const selSlug = e.target.value;
                        const found = storePages.find((p) => p.slug === selSlug);
                        setEditingItem({
                          ...editingItem,
                          targetId: selSlug,
                          url: `/p/${selSlug}`,
                          label: editingItem.label || found?.title || 'Page',
                        });
                      }}
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    >
                      {storePages.map((pg) => (
                        <option key={pg.id || pg.slug} value={pg.slug}>
                          {pg.title} ({pg.isSystemPolicy ? 'Officiel' : 'Custom'} — /p/{pg.slug})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Direct URL input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  URL cible
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  placeholder="/catalog ou https://..."
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Micro Promo Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Badge promo (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={editingItem.badgeText || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                    placeholder="HOT, PROMO, -30%..."
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Couleur du badge
                  </label>
                  <select
                    value={editingItem.badgeColor || 'primary'}
                    onChange={(e) => setEditingItem({ ...editingItem, badgeColor: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="primary">Émeraude (Défaut)</option>
                    <option value="rose">Rose / Rouge (Urgence / Réduction)</option>
                    <option value="amber">Ambre / Orange (Offre limitée)</option>
                    <option value="accent">Indigo / Violet (Exclusif)</option>
                  </select>
                </div>
              </div>

              {/* Open in new tab checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isOpenNewTab"
                  checked={Boolean(editingItem.isOpenNewTab)}
                  onChange={(e) => setEditingItem({ ...editingItem, isOpenNewTab: e.target.checked })}
                  className="rounded bg-slate-50 dark:bg-zinc-950 border-slate-300 dark:border-zinc-800 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <label htmlFor="isOpenNewTab" className="text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
                  Ouvrir le lien dans un nouvel onglet
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  {editingItem.id ? 'Valider les modifications' : 'Ajouter au menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500 text-xs">Chargement des menus...</div>}>
      <MenusContent />
    </Suspense>
  );
}
