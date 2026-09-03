'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Package, Plus, Search, Tag, AlertTriangle, 
  Layers, Check, Trash2, Edit3, ArrowUpRight 
} from 'lucide-react';
import { getProducts, addProduct, getCategories, Product } from '@/lib/backoffice';

function ProductsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [products, setProducts] = useState<Product[]>(getProducts(storeSlug));
  const [categories, setCategories] = useState(getCategories());
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
    setTitle('');
    alert('Produit ajouté avec succès à votre catalogue !');
  };

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-amber-400" /> Catalogue Produits & Stocks
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gérez vos articles, prix de revient, marges bénéficiaires et catégories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/10 transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter un Produit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs gap-4 font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Tous les Produits ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'categories'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Catégories & Collections ({categories.length})
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Search Bar */}
          <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, catégorie ou SKU..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="text-xs text-slate-400">
              {filteredProducts.length} article(s) trouvé(s)
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50 font-semibold">
                    <th className="py-3.5 px-4">Produit</th>
                    <th className="py-3.5 px-4">Catégorie</th>
                    <th className="py-3.5 px-4">Prix de Vente</th>
                    <th className="py-3.5 px-4">Prix de Revient</th>
                    <th className="py-3.5 px-4">Marge Nette</th>
                    <th className="py-3.5 px-4">Stock Restant</th>
                    <th className="py-3.5 px-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((p) => {
                    const margin = p.price - p.costPrice;
                    const marginPercent = Math.round((margin / p.price) * 100);
                    const isLowStock = p.stock <= 5;

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{p.title}</div>
                            <div className="text-[10px] font-mono text-slate-500">{p.sku}</div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium">
                            {p.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-white text-sm">{p.price} DH</div>
                          {p.comparePrice && (
                            <div className="text-[10px] text-slate-500 line-through">{p.comparePrice} DH</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-400 font-medium">
                          {p.costPrice} DH
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-emerald-400">+{margin} DH</div>
                          <div className="text-[10px] text-slate-400">({marginPercent}% de marge)</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{p.stock} unités</span>
                            {isLowStock && (
                              <span className="p-1 rounded bg-amber-500/20 text-amber-400" title="Stock faible !">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            Actif
                          </span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Tag className="w-5 h-5 text-amber-400" />
                <span className="text-xs text-slate-400">{c.productCount} articles</span>
              </div>
              <div className="font-extrabold text-white text-base">{c.name}</div>
              <div className="text-[11px] font-mono text-slate-500">slug: {c.slug}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white">Ajouter un Nouveau Produit</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Titre du Produit :</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Robe Soie Dubaï Édition Prestige"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Catégorie :</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Initial :</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prix Vente (DH) :</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prix Barré (DH) :</label>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Coût Achat (DH) :</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image Principale (URL) :</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 transition-colors"
                >
                  Enregistrer le Produit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 font-bold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
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
