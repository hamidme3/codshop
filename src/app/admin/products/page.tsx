'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Package, Plus, Search, Tag, AlertTriangle, 
  Layers, Check, Trash2, Edit3, ArrowUpRight,
  Sparkles, Wand2, Copy, CheckCheck, ShieldCheck, Flame
} from 'lucide-react';
import { getProducts, addProduct, getCategories, Product } from '@/lib/backoffice';
import { generateMoroccanProductCopy, MOROCCAN_NICHES, MoroccanAICopy } from '@/lib/ai-copywriter';

function ProductsContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  // #16 — re-sync when storeSlug changes
  const [products, setProducts] = useState<Product[]>(() => getProducts(storeSlug));
  const [categories, setCategories] = useState(getCategories());
  // #18 — refresh category counts when products change
  useEffect(() => {
    setProducts(getProducts(storeSlug));
  }, [storeSlug]);
  useEffect(() => {
    setCategories(getCategories());
  }, [products.length]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

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
            onClick={() => handleOpenAICoach()}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all border border-amber-400/50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" /> Coach IA Marocain
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4 text-amber-400" /> Ajouter un Produit
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
                    const margin = (p.price ?? 0) - (p.costPrice ?? 0);
                    const marginPercent = (p.price ?? 0) > 0 ? Math.round((margin / (p.price ?? 1)) * 100) : 0;
                    const isLowStock = p.stock <= 5;

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={p.images?.[0] ?? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'}
                            alt={p.title ?? 'Produit'}
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

            {/* Coach IA Trigger Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Textes de vente & packs optimisés Maroc</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleOpenAICoach(category, title, price);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition-colors flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" /> Générer avec l'IA 🇲🇦
              </button>
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

      {/* Coach IA Marocain Modal */}
      {showAICoach && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Propulsé par IA E-commerce Maroc
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Coach IA Marocain (Darija / FR)
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Générez instantanément des titres vendeurs, des accroches en Darija et des packs irrésistibles.
                </p>
              </div>
              <button 
                onClick={() => setShowAICoach(false)} 
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Generator Controls */}
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">Secteur / Niche :</label>
                <div className="flex flex-wrap gap-2">
                  {MOROCCAN_NICHES.map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => {
                        setAiNiche(niche);
                        handleOpenAICoach(niche, aiKeyword, aiPrice);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        aiNiche === niche
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Nom ou mot-clé :</label>
                  <input
                    type="text"
                    value={aiKeyword}
                    onChange={(e) => setAiKeyword(e.target.value)}
                    placeholder="Ex: Sacoche Cuir Marron"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Prix de Vente Ciblé (DH) :</label>
                  <input
                    type="number"
                    value={aiPrice}
                    onChange={(e) => setAiPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAICoach(aiNiche, aiKeyword, aiPrice)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-black text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" /> Régénérer de Nouvelles Variantes
              </button>
            </div>

            {/* Generated Results */}
            {generatedCopy && (
              <div className="space-y-4 text-xs">
                {/* Title */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Titre E-commerce Recommandé</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.title, 'title')}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-bold lowercase"
                    >
                      {copiedField === 'title' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'title' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="text-white font-black text-sm">{generatedCopy.title}</div>
                </div>

                {/* Moroccan Darija Hook */}
                <div className="bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> Accroche Vendeuse en Darija (Haute Conversion)
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.hookDarija, 'darija')}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      {copiedField === 'darija' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'darija' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="text-white text-sm font-semibold text-right leading-relaxed" dir="rtl">
                    {generatedCopy.hookDarija}
                  </div>
                </div>

                {/* French Hook */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                    <span>Accroche en Français (Élégante & Professionnelle)</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.hookFrench, 'french')}
                      className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      {copiedField === 'french' ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'french' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                  <div className="text-slate-200 text-xs leading-relaxed italic">
                    « {generatedCopy.hookFrench} »
                  </div>
                </div>

                {/* Guarantees & COD Reassurance */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Arguments de Réassurance Spécifiques au Marché Marocain :</span>
                  </div>
                  <div className="space-y-1.5">
                    {generatedCopy.reassurancesDarija.map((r, idx) => (
                      <div key={idx} className="text-slate-300 text-xs flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded-xl">
                        <span dir="rtl" className="text-right w-full font-medium">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bundle Offers */}
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 font-bold">Packs & Offres Dégressives Suggérés :</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {generatedCopy.bundles.map((bundle, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl border ${
                          bundle.isPopular 
                            ? 'bg-amber-500/10 border-amber-500/40' 
                            : 'bg-slate-950 border-slate-800'
                        } space-y-1 text-center`}
                      >
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          bundle.isPopular ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {bundle.discountBadge}
                        </span>
                        <div className="font-bold text-white text-xs">{bundle.name}</div>
                        <div className="text-amber-400 font-black text-sm">{bundle.priceTotal} DH</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleApplyAIToProduct(generatedCopy)}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Appliquer Directement au Produit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAICoach(false)}
                    className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
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
