'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Package, Plus, Search, Tag, AlertTriangle, 
  Layers, Check, Trash2, Edit3, ArrowUpRight,
  Sparkles, Wand2, Copy, CheckCheck, ShieldCheck, Flame
} from 'lucide-react';
import { 
  getProducts, addProduct, updateProduct, deleteProduct, updateProductStock, 
  getCategories, addCategory, deleteCategory, Product, Category 
} from '@/lib/backoffice';
import { generateMoroccanProductCopy, MOROCCAN_NICHES, MoroccanAICopy } from '@/lib/ai-copywriter';

function ProductsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  // #16 — re-sync when storeSlug changes
  const [products, setProducts] = useState<Product[]>(() => getProducts(storeSlug));
  const [categories, setCategories] = useState<Category[]>(() => getCategories(storeSlug));
  // #18 — refresh category counts when products change
  useEffect(() => {
    setProducts(getProducts(storeSlug));
  }, [storeSlug]);
  useEffect(() => {
    setCategories(getCategories(storeSlug));
  }, [products.length, storeSlug]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editComparePrice, setEditComparePrice] = useState<number>(0);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editVariants, setEditVariants] = useState<Array<{ color?: string; size?: string; stock: number; sku?: string }>>([]);

  // Category Modal & Notification State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const created = addCategory({ name: newCatName, slug: newCatSlug });
      setCategories(getCategories(storeSlug));
      setShowAddCategoryModal(false);
      setNewCatName('');
      setNewCatSlug('');
      showToast(`Catégorie "${created.name}" créée avec succès !`);
      setCategory(created.name);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de la catégorie.');
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat.productCount > 0) {
      alert(`Action bloquée : La catégorie "${cat.name}" contient encore ${cat.productCount} produit(s) rattaché(s). Veuillez d'abord réassigner ou supprimer ces produits.`);
      return;
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement la catégorie "${cat.name}" ?`)) {
      const res = deleteCategory(cat.id, storeSlug);
      if (res.success) {
        setCategories(getCategories(storeSlug));
        showToast(`Catégorie "${cat.name}" supprimée avec succès.`);
      } else {
        alert(res.error || 'Erreur lors de la suppression.');
      }
    }
  };

  const handleDeleteProduct = (prod: Product) => {
    if (confirm(`Confirmez-vous la suppression du produit "${prod.title}" du catalogue ?`)) {
      deleteProduct(prod.id);
      setProducts(getProducts(storeSlug));
      setCategories(getCategories(storeSlug));
      showToast(`Produit "${prod.title}" retiré du catalogue.`);
    }
  };

  const handleAdjustStock = (prodId: string, delta: number) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;
    const newStock = Math.max(0, (prod.stock ?? 0) + delta);
    updateProductStock(prodId, newStock);
    setProducts(getProducts(storeSlug));
    showToast(`Stock de "${prod.title}" ajusté : ${newStock} unités.`);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditTitle(prod.title || '');
    setEditCategory(prod.category || 'Maroquinerie & Cuir');
    setEditPrice(prod.price || 0);
    setEditComparePrice(prod.comparePrice || 0);
    setEditCostPrice(prod.costPrice || 0);
    setEditStock(prod.stock || 0);
    setEditImageUrl(prod.images?.[0] || '');
    const vars = (prod.variants && prod.variants.length > 0)
      ? prod.variants.map((v: any) => ({
          color: v.color || '',
          size: v.size || '',
          stock: v.stock ?? 0,
          sku: v.sku || '',
        }))
      : [{ size: 'Standard', stock: prod.stock || 0 }];
    setEditVariants(vars);
    setShowEditModal(true);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editTitle.trim()) return;

    const totalVariantStock = editVariants.length > 0
      ? editVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : Number(editStock);

    const updated = updateProduct(editingProduct.id, {
      title: editTitle,
      category: editCategory,
      price: Number(editPrice),
      comparePrice: Number(editComparePrice),
      costPrice: Number(editCostPrice),
      stock: totalVariantStock,
      images: [editImageUrl || editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
      variants: editVariants.map((v) => ({
        color: v.color || undefined,
        size: v.size || undefined,
        stock: Number(v.stock) || 0,
        sku: v.sku || undefined,
      })),
    });

    if (updated) {
      setProducts(getProducts(storeSlug));
      setCategories(getCategories(storeSlug));
      setShowEditModal(false);
      setEditingProduct(null);
      showToast(`Produit "${editTitle}" mis à jour avec succès !`);
    } else {
      alert('Erreur lors de la mise à jour du produit.');
    }
  };

  const handleAddEditVariant = () => {
    setEditVariants([...editVariants, { color: '', size: '', stock: 5, sku: '' }]);
  };

  const handleRemoveEditVariant = (idx: number) => {
    if (editVariants.length <= 1) {
      alert('Un produit doit comporter au moins une variante ou taille standard.');
      return;
    }
    setEditVariants(editVariants.filter((_, i) => i !== idx));
  };

  const handleUpdateEditVariant = (idx: number, field: string, val: any) => {
    setEditVariants(
      editVariants.map((v, i) => (i === idx ? { ...v, [field]: val } : v))
    );
  };

  // Coach IA Moroccan Copywriter State
  const [showAICoach, setShowAICoach] = useState(false);
  const [aiNiche, setAiNiche] = useState<string>('Maroquinerie & Sacs');
  const [aiKeyword, setAiKeyword] = useState('');
  const [aiPrice, setAiPrice] = useState<number>(299);
  const [generatedCopy, setGeneratedCopy] = useState<MoroccanAICopy | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Maroquinerie & Cuir');
  const [price, setPrice] = useState<number>(299);
  const [comparePrice, setComparePrice] = useState<number>(450);
  const [costPrice, setCostPrice] = useState<number>(90);
  const [stock, setStock] = useState<number>(20);
  const [imageUrl, setImageUrl] = useState('');

  const filteredProducts = products.filter((p) => {
    return (
      (p.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenAICoach = (cat?: string, tit?: string, pr?: number) => {
    const selectedNiche = cat || aiNiche;
    const selectedTitle = tit || aiKeyword;
    const selectedPrice = pr || aiPrice;
    setAiNiche(selectedNiche);
    setAiKeyword(selectedTitle);
    setAiPrice(selectedPrice);
    const generated = generateMoroccanProductCopy(selectedNiche, selectedTitle, selectedPrice);
    setGeneratedCopy(generated);
    setShowAICoach(true);
  };

  const handleApplyAIToProduct = (copy: MoroccanAICopy) => {
    setTitle(copy.title);
    setPrice(copy.suggestedPrice);
    setComparePrice(copy.suggestedComparePrice);
    setCostPrice(copy.suggestedCostPrice);
    setShowAICoach(false);
    setShowAddModal(true);
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newProd = addProduct({
      storeSlug,
      title,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      price: Number(price),
      comparePrice: Number(comparePrice),
      costPrice: Number(costPrice),
      stock: Number(stock),
      images: [imageUrl || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
      variants: [{ size: 'Unique', stock: Number(stock) }],
      status: 'active',
    });

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    // #17 — full form reset (was only resetting `title`)
    setTitle('');
    setImageUrl('');
    setPrice(299);
    setComparePrice(450);
    setCostPrice(90);
    setStock(20);
    alert('Produit ajouté avec succès à votre catalogue !');
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Catalogue & Inventaire</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-400 font-mono tabular-nums">{products.length} références</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-zinc-200" /> Catalogue Produits & Stocks
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Gérez vos références, marges nettes unitaires et collections de vente.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenAICoach()}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Coach IA Marocain
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter un Produit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#121215] border border-zinc-800/80 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Tous les Produits ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'categories'
              ? 'bg-zinc-800 text-white font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Catégories & Collections ({categories.length})
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Search Bar */}
          <div className="flex items-center justify-between gap-4 bg-[#121215] border border-zinc-800/80 rounded-xl p-3 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, catégorie ou SKU..."
                className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            <div className="text-xs text-zinc-400 font-mono tabular-nums">
              <strong className="text-zinc-200">{filteredProducts.length}</strong> article(s) trouvé(s)
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto admin-scrollbar">
              <table className="w-full text-left text-xs admin-table">
                <thead>
                  <tr className="border-b border-zinc-800/90 text-zinc-400 bg-[#0d0d10] font-semibold">
                    <th className="py-2.5 px-3">Produit</th>
                    <th className="py-2.5 px-3">Catégorie</th>
                    <th className="py-2.5 px-3">Prix Vente</th>
                    <th className="py-2.5 px-3">Coût Achat</th>
                    <th className="py-2.5 px-3">Marge Nette</th>
                    <th className="py-2.5 px-3">Stock Restant</th>
                    <th className="py-2.5 px-3 text-center">Statut</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredProducts.map((p) => {
                    const margin = (p.price ?? 0) - (p.costPrice ?? 0);
                    const marginPercent = (p.price ?? 0) > 0 ? Math.round((margin / (p.price ?? 1)) * 100) : 0;
                    const isLowStock = p.stock <= 5;

                    return (
                      <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2.5 px-3 flex items-center gap-3">
                          <img
                            src={p.images?.[0] ?? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'}
                            alt={p.title ?? 'Produit'}
                            className="w-9 h-9 rounded-md object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                          />
                          <div>
                            <div className="font-medium text-zinc-100 text-xs">{p.title}</div>
                            <div className="text-[10px] font-mono text-zinc-400">{p.sku}</div>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-zinc-300">
                          <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 text-[11px] font-medium">
                            {p.category}
                          </span>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-mono tabular-nums font-semibold text-zinc-100 text-xs">{p.price} MAD</div>
                          {p.comparePrice && (
                            <div className="text-[10px] font-mono tabular-nums text-zinc-400 line-through">{p.comparePrice} MAD</div>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-zinc-300 font-mono tabular-nums text-xs">
                          {p.costPrice} MAD
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="font-mono tabular-nums font-semibold text-emerald-400 text-xs">+{margin} MAD</div>
                          <div className="text-[10px] font-mono tabular-nums text-zinc-400">({marginPercent}% marge)</div>
                        </td>

                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleAdjustStock(p.id, -1)}
                              className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center text-xs transition-colors border border-zinc-700"
                              title="Diminuer stock (-1)"
                            >
                              -
                            </button>
                            <span className="font-mono tabular-nums font-medium text-zinc-200 min-w-[48px] text-center text-xs">{p.stock} un.</span>
                            <button
                              type="button"
                              onClick={() => handleAdjustStock(p.id, 1)}
                              className="w-5 h-5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold flex items-center justify-center text-xs transition-colors border border-zinc-700"
                              title="Augmenter stock (+1)"
                            >
                              +
                            </button>
                            {isLowStock && (
                              <span className="p-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 ml-0.5" title="Stock faible !">
                                <AlertTriangle className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Actif
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors inline-flex items-center cursor-pointer"
                              title="Modifier ce produit (prix, stock, variantes)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p)}
                              className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-colors inline-flex items-center cursor-pointer"
                              title="Supprimer ce produit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Categories View */
        <div className="space-y-4">
          {/* Categories Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121215] border border-zinc-800/80 rounded-xl p-4 shadow-sm">
            <div>
              <h2 className="font-semibold text-white text-sm">Gestion des Catégories & Collections</h2>
              <p className="text-zinc-400 text-xs mt-0.5">
                Créez de nouvelles collections et gérez les associations produits avec garde-fous de sécurité.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCategoryModal(true)}
              className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Nouvelle Catégorie
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {categories.map((c) => {
              const hasProducts = (c.productCount ?? 0) > 0;
              return (
                <div 
                  key={c.id} 
                  data-category-card
                  className="p-4 sm:p-5 rounded-xl bg-[#121215] border border-zinc-800/80 flex flex-col justify-between space-y-3 hover:border-zinc-700/80 transition-colors shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center">
                        <Tag className="w-3.5 h-3.5 text-zinc-300" />
                      </div>
                      <span className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded border ${
                        hasProducts 
                          ? 'bg-zinc-800/80 text-zinc-200 border-zinc-700/80' 
                          : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
                      }`}>
                        {c.productCount} {c.productCount === 1 ? 'article' : 'articles'}
                      </span>
                    </div>
                    <div className="font-medium text-white text-sm tracking-tight">{c.name}</div>
                    <div className="text-[11px] font-mono text-zinc-500">slug: {c.slug}</div>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400">
                      {hasProducts ? 'Catégorie active' : 'Aucun produit rattaché'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(c)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
                        hasProducts
                          ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
                          : 'text-rose-400 hover:text-white hover:bg-rose-900/60 bg-rose-950/30 border border-rose-800/40'
                      }`}
                      title={hasProducts ? 'Protégée : contient des produits' : 'Supprimer cette catégorie vide'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <h3 className="text-base font-semibold text-white">Ajouter un Nouveau Produit</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Coach IA Trigger Banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/70 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Textes de vente & packs optimisés Maroc</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleOpenAICoach(category, title, price);
                }}
                className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-[11px] transition-colors flex items-center gap-1.5"
              >
                <Wand2 className="w-3 h-3 text-amber-400" /> Générer avec l'IA 🇲🇦
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Titre du Produit :</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Robe Soie Dubaï Édition Prestige"
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-zinc-300 font-medium">Catégorie :</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryModal(true)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 font-medium inline-flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Nouvelle
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Stock Initial :</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono tabular-nums focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Prix Vente (DH) :</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono tabular-nums font-semibold focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Prix Barré (DH) :</label>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(Number(e.target.value))}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-400 font-mono tabular-nums focus:outline-none focus:border-zinc-600"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Coût Achat (DH) :</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-emerald-400 font-mono tabular-nums font-semibold focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Image Principale (URL) :</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-300 font-mono text-[11px] focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-800/80">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-colors shadow-sm"
                >
                  Enregistrer le Produit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal with Variant & Pricing Manager */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl admin-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Modifier le Produit</h3>
                  <div className="text-[11px] font-mono text-zinc-400">{editingProduct.sku}</div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowEditModal(false)} 
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Titre du Produit :</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-zinc-300 font-medium">Catégorie :</label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryModal(true)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 font-medium inline-flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Nouvelle
                    </button>
                  </div>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Stock Global :</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono tabular-nums focus:outline-none focus:border-zinc-600 font-semibold"
                  />
                </div>
              </div>

              {/* Pricing & Dynamic Margin Calculation */}
              <div className="p-3.5 rounded-lg bg-[#0d0d10] border border-zinc-800/80 space-y-2.5">
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Prix Vente (DH) :</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 font-mono tabular-nums font-semibold text-xs focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Prix Barré (DH) :</label>
                    <input
                      type="number"
                      value={editComparePrice}
                      onChange={(e) => setEditComparePrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-400 font-mono tabular-nums text-xs focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-medium mb-1">Coût Achat (DH) :</label>
                    <input
                      type="number"
                      value={editCostPrice}
                      onChange={(e) => setEditCostPrice(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-emerald-400 font-mono tabular-nums font-semibold text-xs focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 text-xs">
                  <span>Marge Nette prévisionnelle :</span>
                  <span className="font-mono tabular-nums font-semibold">
                    +{(editPrice || 0) - (editCostPrice || 0)} MAD ({((editPrice || 0) > 0 ? Math.round((((editPrice || 0) - (editCostPrice || 0)) / (editPrice || 1)) * 100) : 0)}%)
                  </span>
                </div>
              </div>

              {/* Variants & Size/Color Matrix */}
              <div className="space-y-2.5 p-3.5 rounded-lg bg-[#0d0d10] border border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-200 text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Variantes & Stocks Détaillés</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Couleurs, pointures et unités en entrepôt.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEditVariant}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] border border-zinc-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Ajouter Variante
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 admin-scrollbar">
                  {editVariants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-zinc-900/90 p-2 rounded-lg border border-zinc-800">
                      <input
                        type="text"
                        placeholder="Couleur (ex: Noir)"
                        value={v.color || ''}
                        onChange={(e) => handleUpdateEditVariant(idx, 'color', e.target.value)}
                        className="flex-1 bg-[#0d0d10] border border-zinc-800 rounded-md px-2.5 py-1 text-zinc-100 placeholder-zinc-600 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Taille / Réf (ex: 42, L)"
                        value={v.size || ''}
                        onChange={(e) => handleUpdateEditVariant(idx, 'size', e.target.value)}
                        className="flex-1 bg-[#0d0d10] border border-zinc-800 rounded-md px-2.5 py-1 text-zinc-100 placeholder-zinc-600 text-xs"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="Stock"
                          value={v.stock}
                          onChange={(e) => handleUpdateEditVariant(idx, 'stock', Number(e.target.value))}
                          className="w-16 bg-[#0d0d10] border border-zinc-800 rounded-md px-2 py-1 text-zinc-100 text-center font-mono tabular-nums font-semibold text-xs"
                        />
                        <span className="text-[10px] text-zinc-500 font-mono">un.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditVariant(idx)}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Supprimer cette variante"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Image Principale (URL) :</label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-300 font-mono text-[11px] focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-800/80">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-colors shadow-sm"
                >
                  Enregistrer les Modifications
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coach IA Marocain Modal */}
      {showAICoach && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl admin-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3.5 border-b border-zinc-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Assistant Marketing Maroc
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Coach IA Marocain (Darija / FR)
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Générez des titres vendeurs, des accroches en Darija et des offres dégressives.
                </p>
              </div>
              <button 
                onClick={() => setShowAICoach(false)} 
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Generator Controls */}
            <div className="space-y-3.5 bg-[#0d0d10] p-4 rounded-xl border border-zinc-800/80 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Secteur / Niche :</label>
                <div className="flex flex-wrap gap-1.5">
                  {MOROCCAN_NICHES.map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => {
                        setAiNiche(niche);
                        handleOpenAICoach(niche, aiKeyword, aiPrice);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                        aiNiche === niche
                          ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Nom ou mot-clé :</label>
                  <input
                    type="text"
                    value={aiKeyword}
                    onChange={(e) => setAiKeyword(e.target.value)}
                    placeholder="Ex: Sacoche Cuir Marron"
                    className="w-full bg-[#121215] border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Prix de Vente Ciblé (DH) :</label>
                  <input
                    type="number"
                    value={aiPrice}
                    onChange={(e) => setAiPrice(Number(e.target.value))}
                    className="w-full bg-[#121215] border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-100 font-mono tabular-nums font-semibold focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAICoach(aiNiche, aiKeyword, aiPrice)}
                className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Régénérer de Nouvelles Variantes
              </button>
            </div>

            {/* Generated Results */}
            {generatedCopy && (
              <div className="space-y-3.5 text-xs">
                {/* Title */}
                <div className="bg-[#0d0d10] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
                    <span>Titre Recommandé</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.title, 'title')}
                      className="text-zinc-300 hover:text-white flex items-center gap-1 font-sans text-xs transition-colors"
                    >
                      {copiedField === 'title' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'title' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="text-zinc-100 font-semibold text-sm">{generatedCopy.title}</div>
                </div>

                {/* Moroccan Darija Hook */}
                <div className="bg-[#0d0d10] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 font-medium flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> Accroche en Darija
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.hookDarija, 'darija')}
                      className="text-zinc-300 hover:text-white flex items-center gap-1 font-sans text-xs transition-colors"
                    >
                      {copiedField === 'darija' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'darija' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="text-zinc-100 text-sm font-medium text-right leading-relaxed" dir="rtl">
                    {generatedCopy.hookDarija}
                  </div>
                </div>

                {/* French Hook */}
                <div className="bg-[#0d0d10] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Accroche en Français</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.hookFrench, 'french')}
                      className="text-zinc-300 hover:text-white flex items-center gap-1 font-sans text-xs transition-colors"
                    >
                      {copiedField === 'french' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'french' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="text-zinc-300 text-xs leading-relaxed italic">
                    « {generatedCopy.hookFrench} »
                  </div>
                </div>

                {/* Guarantees & COD Reassurance */}
                <div className="bg-[#0d0d10] border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Arguments de Réassurance Spécifiques au Marché Marocain :</span>
                  </div>
                  <div className="space-y-1">
                    {generatedCopy.reassurancesDarija.map((r, idx) => (
                      <div key={idx} className="text-zinc-300 text-xs flex items-center justify-between bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800/60">
                        <span dir="rtl" className="text-right w-full font-medium">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bundle Offers */}
                <div className="space-y-2">
                  <div className="text-[11px] text-zinc-400 font-medium">Packs & Offres Dégressives Suggérés :</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {generatedCopy.bundles.map((bundle, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-xl border ${
                          bundle.isPopular 
                            ? 'bg-zinc-900 border-zinc-700 shadow-sm' 
                            : 'bg-[#0d0d10] border-zinc-800/80'
                        } space-y-1 text-center`}
                      >
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                          bundle.isPopular ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {bundle.discountBadge}
                        </span>
                        <div className="font-medium text-zinc-200 text-xs">{bundle.name}</div>
                        <div className="text-white font-mono tabular-nums font-semibold text-sm">{bundle.priceTotal} MAD</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2.5 pt-3.5 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => handleApplyAIToProduct(generatedCopy)}
                    className="flex-1 py-2 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Appliquer au Produit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAICoach(false)}
                    className="py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-medium text-xs transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-zinc-300" />
                <h3 className="text-base font-semibold text-white">Ajouter une Catégorie</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddCategoryModal(false)} 
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Nom de la Catégorie :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Bijouterie Artisanale, Cosmétique Bio..."
                  value={newCatName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCatName(val);
                    if (!newCatSlug || newCatSlug === newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
                      setNewCatSlug(val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
                    }
                  }}
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Slug URL (auto-généré) :</label>
                <input
                  type="text"
                  placeholder="ex: bijouterie-artisanale"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-300 font-mono focus:outline-none focus:border-zinc-600"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Ce slug servira pour le filtrage par collection et les liens de campagne.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-colors shadow-sm"
                >
                  Créer la Catégorie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 text-zinc-100 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Chargement du catalogue...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
