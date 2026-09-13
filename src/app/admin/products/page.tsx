'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Package, Plus, Search, Tag, AlertTriangle, 
  Layers, Check, Trash2, Edit3, ArrowUpRight,
  Sparkles, Wand2, Copy, CheckCheck, ShieldCheck, Flame,
  Star, Image as ImageIcon, SlidersHorizontal, ArrowLeft, ArrowRight,
  Smartphone, Calculator, Clock, Gift, ShoppingBag, X, CheckCircle2, ChevronRight, Eye
} from 'lucide-react';
import { 
  getProducts, addProduct, updateProduct, deleteProduct, updateProductStock, 
  getCategories, addCategory, deleteCategory, reassignAndDeleteCategory, Product, Category,
  generateVariantMatrix, batchFillStock, computeTotalStock,
  setPrimaryImage, reorderImages, addProductImage, removeProductImage,
  MOROCCAN_PRODUCT_IMAGE_PRESETS
} from '@/lib/backoffice';
import { ProductEconomicsCalculator } from '@/components/admin/ProductEconomicsCalculator';
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
  const [editImages, setEditImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');
  const [editVariants, setEditVariants] = useState<Array<{ color?: string; size?: string; stock: number; sku?: string }>>([]);

  // Matrix Generator & Batch Fill State
  const [showMatrixTools, setShowMatrixTools] = useState(false);
  const [matrixColorsInput, setMatrixColorsInput] = useState('Noir Ébène, Marron Vintage, Camel');
  const [matrixSizesInput, setMatrixSizesInput] = useState('40, 41, 42, 43');
  const [batchStockValue, setBatchStockValue] = useState<number>(25);

  // Category Modal, Reassignment & Notification State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🧳');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [categoryToReassign, setCategoryToReassign] = useState<Category | null>(null);
  const [targetReassignCatId, setTargetReassignCatId] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const created = addCategory({ 
        name: newCatName, 
        slug: newCatSlug,
        icon: newCatIcon,
        description: newCatDescription
      });
      setCategories(getCategories(storeSlug));
      setShowAddCategoryModal(false);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDescription('');
      showToast(`Catégorie "${created.name}" créée avec succès !`);
      setCategory(created.name);
      if (showEditModal) {
        setEditCategory(created.name);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de la catégorie.');
    }
  };

  const handleDeleteCategory = (cat: Category) => {
    if (cat.productCount > 0) {
      setCategoryToReassign(cat);
      const other = categories.filter((c) => c.id !== cat.id);
      if (other.length > 0) {
        setTargetReassignCatId(other[0].id);
      }
      setShowReassignModal(true);
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

  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryToReassign || !targetReassignCatId) return;
    const res = reassignAndDeleteCategory(categoryToReassign.id, targetReassignCatId, storeSlug);
    if (res.success) {
      setCategories(getCategories(storeSlug));
      setProducts(getProducts(storeSlug));
      setShowReassignModal(false);
      setCategoryToReassign(null);
      showToast(`${res.reallocatedCount} produit(s) réassigné(s) avec succès et catégorie supprimée.`);
    } else {
      alert(res.error || 'Erreur lors de la réassignation.');
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
    const initialImgs = (prod.images && prod.images.length > 0)
      ? [...prod.images]
      : ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'];
    setEditImages(initialImgs);
    setEditImageUrl(initialImgs[0] || '');
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
      ? computeTotalStock(editVariants)
      : Number(editStock);

    const updated = updateProduct(editingProduct.id, {
      title: editTitle,
      category: editCategory,
      price: Number(editPrice),
      comparePrice: Number(editComparePrice),
      costPrice: Number(editCostPrice),
      stock: totalVariantStock,
      images: editImages.length > 0 ? editImages : [editImageUrl || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'],
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
      showToast(`Produit "${editTitle}" mis à jour (${totalVariantStock} unités, ${editVariants.length} variantes) !`);
    } else {
      alert('Erreur lors de la mise à jour du produit.');
    }
  };

  // Matrix Generation & Batch Stock Handlers
  const handleGenerateMatrix = () => {
    const colors = matrixColorsInput.split(',').map((c) => c.trim()).filter(Boolean);
    const sizes = matrixSizesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const newMatrix = generateVariantMatrix(colors, sizes, {
      productTitle: editTitle || editingProduct?.title || 'PROD',
      defaultStock: Number(batchStockValue) || 10,
      existingVariants: editVariants,
    });
    setEditVariants(newMatrix);
    showToast(`Matrice générée : ${newMatrix.length} variantes avec SKUs standardisés.`);
  };

  const handleApplyBatchStock = () => {
    const qty = Number(batchStockValue) || 0;
    const updated = batchFillStock(editVariants, qty);
    setEditVariants(updated);
    showToast(`Stock de ${qty} unités appliqué à toutes les ${updated.length} variantes.`);
  };

  // Multi-Image Handlers
  const handleSetPrimaryImage = (idx: number) => {
    const updated = setPrimaryImage(editImages, idx);
    setEditImages(updated);
    if (updated[0]) setEditImageUrl(updated[0]);
    showToast('Image principale mise à jour (placée en tête de galerie).');
  };

  const handleMoveImage = (fromIdx: number, direction: 'left' | 'right') => {
    const toIdx = direction === 'left' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= editImages.length) return;
    const updated = reorderImages(editImages, fromIdx, toIdx);
    setEditImages(updated);
    if (updated[0]) setEditImageUrl(updated[0]);
  };

  const handleAddImage = () => {
    if (!newImageInput.trim()) return;
    const updated = addProductImage(editImages, newImageInput.trim());
    setEditImages(updated);
    setNewImageInput('');
    showToast('Image ajoutée à la galerie produit.');
  };

  const handleRemoveImage = (idx: number) => {
    const updated = removeProductImage(editImages, idx);
    setEditImages(updated);
    if (updated.length > 0) setEditImageUrl(updated[0]);
  };

  const handleApplyImagePreset = (preset: (typeof MOROCCAN_PRODUCT_IMAGE_PRESETS)[0]) => {
    setEditImages(preset.images);
    if (preset.images[0]) setEditImageUrl(preset.images[0]);
    showToast(`Pack "${preset.niche}" (${preset.images.length} photos HD) chargé.`);
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
  const [addModalTab, setAddModalTab] = useState<'general' | 'pricing' | 'variants' | 'packs' | 'preview'>('general');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Maroquinerie & Cuir');
  const [price, setPrice] = useState<number>(299);
  const [comparePrice, setComparePrice] = useState<number>(450);
  const [costPrice, setCostPrice] = useState<number>(90);
  const [stock, setStock] = useState<number>(20);
  const [imageUrl, setImageUrl] = useState('');
  const [addImages, setAddImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
  ]);
  const [newAddImageInput, setNewAddImageInput] = useState('');
  const [addBadge, setAddBadge] = useState('100% Cuir Véritable');
  const [addDescription, setAddDescription] = useState('Fabriqué à la main par les maîtres artisans maroquiniers de Fès avec du cuir de première qualité.');
  const [addStatus, setAddStatus] = useState<'active' | 'draft'>('active');

  // New Product Variant Matrix State
  const [useAddVariants, setUseAddVariants] = useState(false);
  const [addColorsInput, setAddColorsInput] = useState('Noir Ébène, Marron Vintage, Camel');
  const [addSizesInput, setAddSizesInput] = useState('40, 41, 42, 43');
  const [addBatchStock, setAddBatchStock] = useState<number>(20);
  const [addVariants, setAddVariants] = useState<Array<{ color?: string; size?: string; stock: number; sku?: string; price?: number }>>([]);

  // New Product Moroccan Quantity Packs State
  const [packDuoEnabled, setPackDuoEnabled] = useState(true);
  const [packDuoPrice, setPackDuoPrice] = useState<number>(498);
  const [packDuoFreeShipping, setPackDuoFreeShipping] = useState(true);
  const [packTrioEnabled, setPackTrioEnabled] = useState(true);
  const [packTrioPrice, setPackTrioPrice] = useState<number>(697);
  const [packTrioGift, setPackTrioGift] = useState('Porte-clés Cuir Artisanal Offert');

  // Draft Auto-Save State
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(`codshop_add_product_draft_${storeSlug}`);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.title || d.price) {
          if (d.title) setTitle(d.title);
          if (d.category) setCategory(d.category);
          if (d.price) setPrice(d.price);
          if (d.comparePrice) setComparePrice(d.comparePrice);
          if (d.costPrice) setCostPrice(d.costPrice);
          if (d.stock) setStock(d.stock);
          if (d.images && d.images.length > 0) {
            setAddImages(d.images);
            if (d.images[0]) setImageUrl(d.images[0]);
          }
          if (d.badge) setAddBadge(d.badge);
          if (d.description) setAddDescription(d.description);
          if (d.useAddVariants !== undefined) setUseAddVariants(d.useAddVariants);
          if (d.variants && d.variants.length > 0) setAddVariants(d.variants);
          if (d.packDuoPrice) setPackDuoPrice(d.packDuoPrice);
          if (d.packTrioPrice) setPackTrioPrice(d.packTrioPrice);
          setDraftLoaded(true);
        }
      }
    } catch {}
  }, [storeSlug]);

  // Auto-save draft on changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!title && !imageUrl && addImages.length === 0) return;
    try {
      const draft = {
        title,
        category,
        price,
        comparePrice,
        costPrice,
        stock,
        images: addImages,
        badge: addBadge,
        description: addDescription,
        useAddVariants,
        variants: addVariants,
        packDuoEnabled,
        packDuoPrice,
        packDuoFreeShipping,
        packTrioEnabled,
        packTrioPrice,
        packTrioGift,
      };
      localStorage.setItem(`codshop_add_product_draft_${storeSlug}`, JSON.stringify(draft));
    } catch {}
  }, [title, category, price, comparePrice, costPrice, stock, addImages, addBadge, addDescription, useAddVariants, addVariants, packDuoEnabled, packDuoPrice, packDuoFreeShipping, packTrioEnabled, packTrioPrice, packTrioGift, storeSlug]);

  const handlePriceChange = (newVal: number) => {
    setPrice(newVal);
    setPackDuoPrice(Math.max(0, newVal * 2 - 100));
    setPackTrioPrice(Math.max(0, newVal * 3 - 200));
  };

  const handleGenerateAddMatrix = () => {
    const colors = addColorsInput.split(',').map((c) => c.trim()).filter(Boolean);
    const sizes = addSizesInput.split(',').map((s) => s.trim()).filter(Boolean);
    if (colors.length === 0 && sizes.length === 0) {
      alert('Veuillez renseigner au moins une couleur ou une taille.');
      return;
    }
    const generated = generateVariantMatrix({
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
      basePrefix: title || 'PROD',
      defaultStock: addBatchStock || 20,
      defaultPrice: price,
      existingVariants: addVariants,
    });
    setAddVariants(generated);
    setUseAddVariants(true);
    showToast(`Matrice de ${generated.length} variante(s) générée !`);
  };

  const handleApplyAddBatchStock = () => {
    if (addVariants.length === 0) return;
    const updated = batchFillStock(addVariants, addBatchStock);
    setAddVariants(updated);
    showToast(`Stock de ${addBatchStock} appliqué à toutes les variantes.`);
  };

  const handleAddImageToAdd = (url?: string) => {
    const target = url || newAddImageInput;
    if (!target.trim()) return;
    const updated = addProductImage(addImages, target);
    setAddImages(updated);
    setNewAddImageInput('');
    if (updated[0]) setImageUrl(updated[0]);
  };

  const handleApplyAddImagePreset = (preset: (typeof MOROCCAN_PRODUCT_IMAGE_PRESETS)[0]) => {
    setAddImages(preset.images);
    if (preset.images[0]) setImageUrl(preset.images[0]);
    showToast(`Pack photo "${preset.niche}" (${preset.images.length} photos HD) chargé.`);
  };

  const handleSetPrimaryAddImage = (idx: number) => {
    const updated = setPrimaryImage(addImages, idx);
    setAddImages(updated);
    if (updated[0]) setImageUrl(updated[0]);
    showToast('Photo principale mise à jour.');
  };

  const handleMoveAddImage = (idx: number, dir: 'left' | 'right') => {
    const to = dir === 'left' ? idx - 1 : idx + 1;
    const updated = reorderImages(addImages, idx, to);
    setAddImages(updated);
    if (updated[0]) setImageUrl(updated[0]);
  };

  const handleRemoveAddImage = (idx: number) => {
    const updated = removeProductImage(addImages, idx);
    setAddImages(updated);
    if (updated[0]) setImageUrl(updated[0]);
  };

  const handleClearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`codshop_add_product_draft_${storeSlug}`);
    }
    setTitle('');
    setImageUrl('');
    setPrice(299);
    setComparePrice(450);
    setCostPrice(90);
    setStock(20);
    setAddImages([]);
    setAddVariants([]);
    setUseAddVariants(false);
    setDraftLoaded(false);
    showToast('Brouillon effacé.');
  };

  const resetAddForm = () => {
    setTitle('');
    setImageUrl('');
    setPrice(299);
    setComparePrice(450);
    setCostPrice(90);
    setStock(20);
    setAddImages([]);
    setAddVariants([]);
    setUseAddVariants(false);
    setAddBadge('100% Cuir Véritable');
    setAddDescription('');
    setAddStatus('active');
    setPackDuoEnabled(true);
    setPackDuoPrice(498);
    setPackDuoFreeShipping(true);
    setPackTrioEnabled(true);
    setPackTrioPrice(697);
    setPackTrioGift('Porte-clés Cuir Artisanal Offert');
    setAddModalTab('general');
  };

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
    if (!title.trim()) {
      alert('Veuillez renseigner un titre pour le produit.');
      return;
    }

    const finalStock = useAddVariants && addVariants.length > 0
      ? computeTotalStock(addVariants)
      : Number(stock) || 0;

    const finalImages = addImages.length > 0
      ? addImages
      : [imageUrl || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'];

    const finalVariants = useAddVariants && addVariants.length > 0
      ? addVariants.map((v) => ({
          color: v.color || undefined,
          size: v.size || undefined,
          stock: Number(v.stock) || 0,
          sku: v.sku || undefined,
          price: v.price || undefined,
        }))
      : [{ size: 'Unique', stock: Number(stock) || 0 }];

    const newProd = addProduct({
      storeSlug,
      title: title.trim(),
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category.trim(),
      price: Number(price),
      comparePrice: comparePrice ? Number(comparePrice) : undefined,
      costPrice: Number(costPrice),
      stock: finalStock,
      images: finalImages,
      variants: finalVariants,
      status: addStatus,
      badge: addBadge || undefined,
      packDuoPrice: packDuoEnabled ? Number(packDuoPrice) : undefined,
      packDuoFreeShipping: packDuoEnabled ? packDuoFreeShipping : undefined,
      packTrioPrice: packTrioEnabled ? Number(packTrioPrice) : undefined,
      packTrioGift: packTrioEnabled ? packTrioGift : undefined,
      description: addDescription || undefined,
    });

    setProducts([newProd, ...products]);
    setCategories(getCategories(storeSlug));
    setShowAddModal(false);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`codshop_add_product_draft_${storeSlug}`);
    }
    setDraftLoaded(false);
    resetAddForm();
    showToast(`Produit "${newProd.title}" ajouté avec succès au catalogue !`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-6 max-w-7xl mx-auto font-sans">
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
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-slate-700/80 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Coach IA Marocain
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-3.5 py-2 rounded-lg text-xs transition-colors shadow-sm shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter un Produit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#13171c] border border-slate-800/80 rounded-lg w-fit bento-card">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
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

          {/* Products Table Container */}
          <div className="bg-[#121215] border border-zinc-800/80 rounded-xl overflow-hidden shadow-sm">
            {/* Mobile Product Cards Stream (screens < md) */}
            <div className="block md:hidden divide-y divide-zinc-800/60 p-2 sm:p-3 space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs">
                  Aucun produit trouvé pour ce filtre.
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const margin = (p.price ?? 0) - (p.costPrice ?? 0);
                  const marginPercent = (p.price ?? 0) > 0 ? Math.round((margin / (p.price ?? 1)) * 100) : 0;
                  const isLowStock = (p.stock ?? 0) <= 5;

                  return (
                    <div key={`mobile-prod-${p.id}`} className="p-3 rounded-xl bg-[#0d0d10] border border-zinc-800/80 space-y-3">
                      {/* Top: Image + Title + Category + Status */}
                      <div className="flex items-start gap-3">
                        <img
                          src={p.images?.[0] ?? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'}
                          alt={p.title ?? 'Produit'}
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-white text-xs truncate">{p.title}</h4>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                              Actif
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60 text-[10px] font-medium truncate">
                              {p.category}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 truncate">{p.sku}</span>
                          </div>
                        </div>
                      </div>

                      {/* Financial Economics Strip */}
                      <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-[#121215] border border-zinc-800/80 text-center">
                        <div>
                          <div className="text-[10px] text-zinc-500">Prix Public</div>
                          <div className="font-mono font-bold text-white text-xs tabular-nums">{p.price} DH</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500">Coût Achat</div>
                          <div className="font-mono font-semibold text-zinc-400 text-xs tabular-nums">{p.costPrice} DH</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500">Marge Nette</div>
                          <div className={`font-mono font-bold text-xs tabular-nums ${
                            marginPercent >= 35 ? 'text-emerald-400' : marginPercent >= 15 ? 'text-sky-400' : 'text-rose-400'
                          }`}>
                            +{margin} DH ({marginPercent}%)
                          </div>
                        </div>
                      </div>

                      {/* Stock Adjuster + Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p.id, -1)}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-sm transition-colors border border-zinc-700 active:scale-95"
                            title="Diminuer stock (-1)"
                          >
                            -
                          </button>
                          <span className="font-mono tabular-nums font-bold text-xs text-white min-w-[50px] text-center">
                            {p.stock} un.
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p.id, 1)}
                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold flex items-center justify-center text-sm transition-colors border border-zinc-700 active:scale-95"
                            title="Augmenter stock (+1)"
                          >
                            +
                          </button>
                          {isLowStock && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" /> Faible
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="touch-target px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Modifier</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p)}
                            className="touch-target p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table (screens >= md) */}
            <div className="hidden md:block overflow-x-auto admin-scrollbar">
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
                              <span className="p-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 ml-0.5" title="Stock faible !">
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
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
                      <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-center text-base">
                        {c.icon ? <span>{c.icon}</span> : <Tag className="w-3.5 h-3.5 text-zinc-300" />}
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
                    {c.description && (
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mt-1">
                        {c.description}
                      </p>
                    )}
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

      {/* Add Product Command Modal (Linear x Stripe x Shopify Polaris Standard) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#0f0f12]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-emerald-400">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">Ajouter un Nouveau Produit</h3>
                  <p className="text-[11px] text-zinc-400">
                    Configuration unifiée : Médias, Tarification COD, Matrice de Variantes et Packs Upsell.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenAICoach(category, title, price)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Coach IA Maroc</span>
                </button>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Draft Restore Alert Banner */}
            {draftLoaded && (
              <div className="px-5 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Brouillon restauré automatiquement depuis votre session précédente.</span>
                </span>
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="text-emerald-400 hover:text-white font-medium underline text-[11px] cursor-pointer"
                >
                  Effacer le brouillon
                </button>
              </div>
            )}

            {/* Segmented Tab Navigation Bar */}
            <div className="flex items-center gap-1 p-2 bg-[#09090b] border-b border-zinc-800/80 overflow-x-auto admin-scrollbar no-scrollbar">
              <button
                type="button"
                onClick={() => setAddModalTab('general')}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  addModalTab === 'general'
                    ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Package className="w-3.5 h-3.5 text-zinc-400" />
                <span>1. Général & Médias</span>
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('pricing')}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  addModalTab === 'pricing'
                    ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Tarification & Marge COD</span>
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('variants')}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  addModalTab === 'variants'
                    ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>3. Variantes & Matrice SKU ({useAddVariants ? addVariants.length : 'Simple'})</span>
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('packs')}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  addModalTab === 'packs'
                    ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>4. Packs Upsell Maroc</span>
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('preview')}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  addModalTab === 'preview'
                    ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>5. Aperçu Mobile (375px)</span>
              </button>
            </div>

            {/* Modal Body (Scrollable form) */}
            <form onSubmit={handleCreateProduct} className="flex-1 overflow-y-auto flex flex-col admin-scrollbar">
              <div className="p-5 sm:p-6 space-y-5 flex-1">
                {/* TAB 1: GÉNÉRAL & MÉDIAS */}
                {addModalTab === 'general' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-zinc-300 font-medium mb-1">Titre du Produit * :</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Sacoche Cuir Artisanal Marrakech — Édition Atlas"
                        className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-medium placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-zinc-300 font-medium">Catégorie :</label>
                          <button
                            type="button"
                            onClick={() => setShowAddCategoryModal(true)}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> + Nouvelle Catégorie
                          </button>
                        </div>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/60 font-medium cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.icon || '🏷️'} {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-300 font-medium mb-1">Badge Commercial :</label>
                        <select
                          value={addBadge}
                          onChange={(e) => setAddBadge(e.target.value)}
                          className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/60 font-medium cursor-pointer"
                        >
                          <option value="100% Cuir Véritable">100% Cuir Véritable</option>
                          <option value="Bordereau Express">Bordereau Express</option>
                          <option value="Offre Flash -50%">Offre Flash -50%</option>
                          <option value="Fait Main à Fès">Fait Main à Fès</option>
                          <option value="Livraison Gratuite 24h">Livraison Gratuite 24h</option>
                          <option value="Sans Badge">Sans Badge</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-medium mb-1">Description / Points Forts :</label>
                      <textarea
                        value={addDescription}
                        onChange={(e) => setAddDescription(e.target.value)}
                        rows={2}
                        placeholder="Présentez l'authenticité, la confection artisanale ou les bénéfices clés pour l'acheteur marocain..."
                        className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 leading-relaxed font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-medium mb-1.5">Statut de Publication :</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddStatus('active')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors flex items-center gap-1.5 ${
                            addStatus === 'active'
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold'
                              : 'bg-[#0d0d10] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" /> Actif (Visible sur la boutique)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddStatus('draft')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors flex items-center gap-1.5 ${
                            addStatus === 'draft'
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-200 font-semibold'
                              : 'bg-[#0d0d10] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Brouillon (Non visible)
                        </button>
                      </div>
                    </div>

                    {/* Multi-Image Manager */}
                    <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-zinc-200 font-medium text-xs flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Portfolio Photos & Médias</span>
                            <span className="text-zinc-500 font-mono text-[11px]">({addImages.length} photo{addImages.length !== 1 ? 's' : ''})</span>
                          </label>
                          <p className="text-[11px] text-zinc-500">
                            La première photo est l&apos;image principale affichée sur la boutique et le bon de livraison.
                          </p>
                        </div>
                      </div>

                      {/* 1-Click Moroccan Curated Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Packs Photos 1-Clic :</span>
                        {MOROCCAN_PRODUCT_IMAGE_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleApplyAddImagePreset(preset)}
                            className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                            title={preset.title}
                          >
                            + {preset.niche}
                          </button>
                        ))}
                      </div>

                      {/* Thumbnails Strip */}
                      {addImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                          {addImages.map((imgUrl, idx) => {
                            const isPrimary = idx === 0;
                            return (
                              <div
                                key={idx}
                                className={`relative rounded-xl overflow-hidden border ${
                                  isPrimary ? 'border-emerald-500/80 ring-1 ring-emerald-500/50' : 'border-zinc-800'
                                } bg-zinc-900 group shadow-xs`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Photo ${idx + 1}`}
                                  className="w-full h-24 object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop';
                                  }}
                                />
                                {isPrimary ? (
                                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold text-[9px] flex items-center gap-0.5 shadow">
                                    <Star className="w-2.5 h-2.5 fill-current" /> Principale
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryAddImage(idx)}
                                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 hover:bg-black text-zinc-200 hover:text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  >
                                    Définir Principale
                                  </button>
                                )}

                                <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-0.5 rounded">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveAddImage(idx, 'left')}
                                      className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                                      title="Déplacer vers la gauche"
                                    >
                                      <ArrowLeft className="w-3 h-3" />
                                    </button>
                                  )}
                                  {idx < addImages.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveAddImage(idx, 'right')}
                                      className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                                      title="Déplacer vers la droite"
                                    >
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAddImage(idx)}
                                    className="p-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
                                    title="Retirer cette photo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Image URL Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newAddImageInput}
                          onChange={(e) => setNewAddImageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageToAdd();
                            }
                          }}
                          placeholder="Coller l'URL d'une image (https://...)"
                          className="flex-1 bg-[#0d0d10] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 placeholder-zinc-600 text-xs font-mono focus:outline-none focus:border-emerald-500/60"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddImageToAdd()}
                          className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
                        >
                          + Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TARIFICATION & MARGE COD */}
                {addModalTab === 'pricing' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-zinc-300 font-medium mb-1 text-xs">Prix Vente Public (DH) * :</label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => handlePriceChange(Number(e.target.value))}
                          className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono tabular-nums font-semibold text-xs focus:outline-none focus:border-emerald-500/60"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 font-medium mb-1 text-xs">Prix Barré / Comparé (DH) :</label>
                        <input
                          type="number"
                          value={comparePrice}
                          onChange={(e) => setComparePrice(Number(e.target.value))}
                          className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-400 font-mono tabular-nums text-xs focus:outline-none focus:border-zinc-600"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-300 font-medium mb-1 text-xs">Coût Achat Fournisseur / COGS (DH) :</label>
                        <input
                          type="number"
                          value={costPrice}
                          onChange={(e) => setCostPrice(Number(e.target.value))}
                          className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-emerald-400 font-mono tabular-nums font-semibold text-xs focus:outline-none focus:border-emerald-500/60"
                        />
                      </div>
                    </div>

                    {/* Integrated Product Economics Calculator */}
                    <ProductEconomicsCalculator
                      initialPrice={price}
                      initialCogs={costPrice}
                      onApplyPricing={({ price: p, cogs: c }) => {
                        handlePriceChange(p);
                        setCostPrice(c);
                        showToast(`Tarifs appliqués : ${p} MAD (COGS ${c} MAD)`);
                      }}
                      compact={false}
                    />
                  </div>
                )}

                {/* TAB 3: VARIANTES & MATRICE SKU */}
                {addModalTab === 'variants' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0f0f12] border border-zinc-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-400" />
                          <span>Activer la Matrice Multi-Variantes (Couleurs / Tailles)</span>
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Permet de gérer des stocks distincts par taille et coloris avec génération cartésienne automatique des SKUs.
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={useAddVariants}
                        onClick={() => setUseAddVariants(!useAddVariants)}
                        className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer border ${
                          useAddVariants ? 'bg-blue-600/30 border-blue-500' : 'bg-zinc-800 border-zinc-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full transition-transform transform shadow-sm ${
                            useAddVariants ? 'translate-x-4 bg-blue-400' : 'translate-x-0 bg-zinc-400'
                          }`}
                        />
                      </button>
                    </div>

                    {!useAddVariants ? (
                      <div className="p-5 rounded-xl bg-[#0d0d10] border border-zinc-800/80 space-y-3">
                        <label className="block text-zinc-300 font-medium text-xs">Stock Global Disponible (Unités) :</label>
                        <input
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(Number(e.target.value))}
                          className="w-48 bg-[#121215] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono tabular-nums text-xs font-semibold"
                        />
                        <p className="text-[11px] text-zinc-500">
                          Ce produit ne possède pas de déclinaison. Activez le bouton ci-dessus pour ajouter des tailles et couleurs.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Matrix Generator Controls */}
                        <div className="p-4 rounded-xl bg-[#0d0d10] border border-zinc-800/80 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-200">⚡ Générateur Cartésien de SKUs</span>
                            <span className="text-[11px] text-zinc-500">Séparez les valeurs par des virgules</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[11px] text-zinc-400 font-medium mb-1">
                                Couleurs / Déclinaisons :
                              </label>
                              <input
                                type="text"
                                value={addColorsInput}
                                onChange={(e) => setAddColorsInput(e.target.value)}
                                placeholder="Noir Ébène, Marron Vintage, Camel"
                                className="w-full bg-[#121215] border border-zinc-800 rounded-lg p-2 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-blue-500/60"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-zinc-400 font-medium mb-1">
                                Tailles / Pointures :
                              </label>
                              <input
                                type="text"
                                value={addSizesInput}
                                onChange={(e) => setAddSizesInput(e.target.value)}
                                placeholder="40, 41, 42, 43 ou S, M, L"
                                className="w-full bg-[#121215] border border-zinc-800 rounded-lg p-2 text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-blue-500/60"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] text-zinc-400">Stock par défaut :</label>
                              <input
                                type="number"
                                value={addBatchStock}
                                onChange={(e) => setAddBatchStock(Number(e.target.value))}
                                className="w-16 bg-[#121215] border border-zinc-800 rounded-md p-1 text-center font-mono tabular-nums text-xs text-zinc-100"
                              />
                              <button
                                type="button"
                                onClick={handleApplyAddBatchStock}
                                disabled={addVariants.length === 0}
                                className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 text-xs font-medium border border-zinc-700 cursor-pointer"
                              >
                                Appliquer à tous (1-clic)
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={handleGenerateAddMatrix}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
                            >
                              + Générer Matrice
                            </button>
                          </div>
                        </div>

                        {/* Variants Table */}
                        {addVariants.length > 0 && (
                          <div className="rounded-xl border border-zinc-800 overflow-hidden bg-[#0d0d10]">
                            <div className="p-3 bg-[#0f0f12] border-b border-zinc-800 flex items-center justify-between text-xs">
                              <span className="font-semibold text-zinc-300">
                                Variantes Définies ({addVariants.length})
                              </span>
                              <span className="font-mono text-zinc-400">
                                Stock Total : <strong className="text-emerald-400">{computeTotalStock(addVariants)}</strong> unités
                              </span>
                            </div>

                            <div className="max-h-60 overflow-y-auto admin-scrollbar">
                              <table className="w-full text-left text-xs admin-table">
                                <thead>
                                  <tr className="border-b border-zinc-800/90 text-zinc-400 bg-zinc-950/60 font-semibold">
                                    <th className="py-2 px-3">Couleur</th>
                                    <th className="py-2 px-3">Taille</th>
                                    <th className="py-2 px-3">SKU</th>
                                    <th className="py-2 px-3 text-right">Stock</th>
                                    <th className="py-2 px-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/40">
                                  {addVariants.map((v, i) => (
                                    <tr key={i} className="hover:bg-zinc-900/40 transition-colors">
                                      <td className="py-2 px-3 font-medium text-zinc-200">{v.color || '—'}</td>
                                      <td className="py-2 px-3 text-zinc-400">{v.size || '—'}</td>
                                      <td className="py-2 px-3">
                                        <input
                                          type="text"
                                          value={v.sku || ''}
                                          onChange={(e) => {
                                            const updated = [...addVariants];
                                            updated[i].sku = e.target.value;
                                            setAddVariants(updated);
                                          }}
                                          className="w-36 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-[11px] font-mono text-zinc-200"
                                        />
                                      </td>
                                      <td className="py-2 px-3 text-right">
                                        <input
                                          type="number"
                                          value={v.stock}
                                          onChange={(e) => {
                                            const updated = [...addVariants];
                                            updated[i].stock = Math.max(0, parseInt(e.target.value, 10) || 0);
                                            setAddVariants(updated);
                                          }}
                                          className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-[11px] font-mono tabular-nums text-right text-zinc-100 font-semibold"
                                        />
                                      </td>
                                      <td className="py-2 px-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => setAddVariants(addVariants.filter((_, idx) => idx !== i))}
                                          className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                                          title="Supprimer cette variante"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: PACKS UPSELL MAROC */}
                {addModalTab === 'packs' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300 text-xs leading-relaxed">
                      💡 <strong>Standard E-Commerce Marocain :</strong> Plus de 40% des acheteurs COD choisissent un Pack Duo ou Trio si la livraison est offerte. La commande est expédiée dans <strong>un seul colis</strong>, ce qui amortit vos frais de transport.
                    </div>

                    {/* Pack Duo Card */}
                    <div className="p-4 rounded-xl bg-[#0f0f12] border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ⭐ Pack Duo (Meilleure Vente Maroc)
                          </span>
                          <h4 className="text-sm font-semibold text-white mt-1">Pack Duo — 2 Unités</h4>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={packDuoEnabled}
                          onClick={() => setPackDuoEnabled(!packDuoEnabled)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer border ${
                            packDuoEnabled ? 'bg-emerald-500/20 border-emerald-500/60' : 'bg-zinc-800 border-zinc-700'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full transition-transform transform shadow-sm ${
                              packDuoEnabled ? 'translate-x-4 bg-emerald-400' : 'translate-x-0 bg-zinc-400'
                            }`}
                          />
                        </button>
                      </div>

                      {packDuoEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                          <div>
                            <label className="block text-zinc-400 font-medium mb-1">Prix Pack Duo (MAD) :</label>
                            <input
                              type="number"
                              value={packDuoPrice}
                              onChange={(e) => setPackDuoPrice(Number(e.target.value))}
                              className="w-full bg-[#121215] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono tabular-nums font-semibold text-xs"
                            />
                            <p className="text-[11px] text-zinc-500 mt-1">
                              Prix plein : {price * 2} MAD • Réduction : {price * 2 - packDuoPrice} MAD
                            </p>
                          </div>
                          <div className="flex flex-col justify-between">
                            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer pt-2">
                              <input
                                type="checkbox"
                                checked={packDuoFreeShipping}
                                onChange={(e) => setPackDuoFreeShipping(e.target.checked)}
                                className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                              />
                              <span>Livraison Gratuite Automatique (0 DH)</span>
                            </label>
                            <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-emerald-400 text-[11px] font-mono">
                              Économie totale client : {price * 2 - packDuoPrice + (packDuoFreeShipping ? 35 : 0)} MAD
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pack Trio Card */}
                    <div className="p-4 rounded-xl bg-[#0f0f12] border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            🔥 Pack Trio (Panier Moyen Maximisé)
                          </span>
                          <h4 className="text-sm font-semibold text-white mt-1">Pack Trio — 3 Unités + Cadeau</h4>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={packTrioEnabled}
                          onClick={() => setPackTrioEnabled(!packTrioEnabled)}
                          className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer border ${
                            packTrioEnabled ? 'bg-purple-500/20 border-purple-500/60' : 'bg-zinc-800 border-zinc-700'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full transition-transform transform shadow-sm ${
                              packTrioEnabled ? 'translate-x-4 bg-purple-400' : 'translate-x-0 bg-zinc-400'
                            }`}
                          />
                        </button>
                      </div>

                      {packTrioEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                          <div>
                            <label className="block text-zinc-400 font-medium mb-1">Prix Pack Trio (MAD) :</label>
                            <input
                              type="number"
                              value={packTrioPrice}
                              onChange={(e) => setPackTrioPrice(Number(e.target.value))}
                              className="w-full bg-[#121215] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 font-mono tabular-nums font-semibold text-xs"
                            />
                            <p className="text-[11px] text-zinc-500 mt-1">
                              Prix plein : {price * 3} MAD • Réduction : {price * 3 - packTrioPrice} MAD
                            </p>
                          </div>
                          <div>
                            <label className="block text-zinc-400 font-medium mb-1">Cadeau Offert Inclus :</label>
                            <input
                              type="text"
                              value={packTrioGift}
                              onChange={(e) => setPackTrioGift(e.target.value)}
                              className="w-full bg-[#121215] border border-zinc-800 rounded-lg p-2.5 text-zinc-100 text-xs"
                            />
                            <p className="text-[11px] text-zinc-500 mt-1">
                              Incite à l&apos;achat immédiat sans hésitation.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: APERÇU MOBILE 375px */}
                {addModalTab === 'preview' && (
                  <div className="flex flex-col items-center justify-center py-2 space-y-3">
                    <p className="text-xs text-zinc-400">
                      Rendu en direct sur écran smartphone marocain (375px) avec le thème actif :
                    </p>

                    {/* Smartphone Mockup */}
                    <div className="w-[340px] sm:w-[375px] rounded-[32px] border-4 border-zinc-700 bg-black shadow-2xl overflow-hidden text-zinc-100 font-sans text-xs">
                      {/* Notch / Speaker Bar */}
                      <div className="w-full bg-zinc-900 px-6 py-2 flex items-center justify-between border-b border-zinc-800 text-[10px] font-mono text-zinc-400">
                        <span>09:41</span>
                        <div className="w-16 h-3.5 bg-black rounded-full" />
                        <span>5G 🇲🇦</span>
                      </div>

                      {/* Storefront Mini Header */}
                      <div className="p-3 bg-[#0d0d10] border-b border-zinc-800 flex items-center justify-between">
                        <span className="font-bold text-white text-xs tracking-tight uppercase">CODShop Store</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Paiement à la Livraison
                        </span>
                      </div>

                      {/* Storefront Body Preview */}
                      <div className="p-3.5 space-y-3 bg-[#09090b] max-h-[460px] overflow-y-auto admin-scrollbar">
                        {/* Main Product Image with Commercial Badge */}
                        <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                          <img
                            src={addImages[0] || imageUrl || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'}
                            alt={title || 'Produit'}
                            className="w-full h-48 object-cover"
                          />
                          {addBadge && addBadge !== 'Sans Badge' && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-zinc-950 shadow-md">
                              {addBadge}
                            </span>
                          )}
                        </div>

                        {/* Title & Category */}
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">{category}</span>
                          <h3 className="font-bold text-white text-sm mt-0.5 leading-snug">
                            {title || 'Titre du Produit Exemple'}
                          </h3>
                        </div>

                        {/* Moroccan Inspection Reassurance Banner */}
                        <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-700/80 flex items-center gap-2 text-[11px] text-zinc-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="leading-tight">
                            <span className="font-semibold text-white">Garantie Sérénité :</span> Ouvrez et vérifiez votre colis avant de payer.
                          </div>
                        </div>

                        {/* Price Display */}
                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="font-mono text-lg font-bold text-white tabular-nums">{price} MAD</span>
                          {comparePrice && (
                            <span className="font-mono text-xs text-zinc-500 line-through tabular-nums">{comparePrice} MAD</span>
                          )}
                        </div>

                        {/* Upsell Pack Preview */}
                        {packDuoEnabled && (
                          <div className="p-2.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[10px] font-semibold text-emerald-400 uppercase">Pack Duo (2x)</span>
                              <div className="font-mono font-bold text-white">{packDuoPrice} MAD</div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold">
                              Livraison Gratuite
                            </span>
                          </div>
                        )}

                        {/* Sticky Bottom Buy Bar Simulation */}
                        <div className="pt-2 border-t border-zinc-800">
                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-default"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Commander Maintenant ({price} MAD)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 border-t border-zinc-800/80 bg-[#0f0f12] flex items-center justify-between">
                <div>
                  {(draftLoaded || title || addImages.length > 0) && (
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      className="text-zinc-500 hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Effacer le brouillon
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Enregistrer le Produit</span>
                  </button>
                </div>
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
              <div className="space-y-3 p-3.5 rounded-lg bg-[#0d0d10] border border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-zinc-200 text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Variantes & Stocks Détaillés</span>
                      <span className="ml-1.5 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                        Total : {computeTotalStock(editVariants)} un.
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Matrice multi-attributs, génération cartésienne et stocks par variante.
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowMatrixTools(!showMatrixTools)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                        showMatrixTools
                          ? 'bg-zinc-700 text-white border-zinc-600'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                      }`}
                      title="Ouvrir le générateur automatique de matrice et remplissage en lot"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Outils Matrice</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddEditVariant}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] border border-zinc-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Variante
                    </button>
                  </div>
                </div>

                {/* Collapsible Matrix Generator & 1-Click Batch Fill */}
                {showMatrixTools && (
                  <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-700/80 space-y-2.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-semibold text-zinc-300 flex items-center justify-between">
                      <span>⚡ Générateur Cartésien & Remplissage en Lot</span>
                      <span className="text-[10px] text-zinc-500 font-normal">Calcul instantané & SKUs propres</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-medium mb-1">
                          Couleurs (séparées par virgules) :
                        </label>
                        <input
                          type="text"
                          value={matrixColorsInput}
                          onChange={(e) => setMatrixColorsInput(e.target.value)}
                          placeholder="Noir Ébène, Marron Vintage, Camel"
                          className="w-full bg-[#0d0d10] border border-zinc-800 rounded px-2.5 py-1 text-zinc-100 placeholder-zinc-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-medium mb-1">
                          Tailles / Pointures (séparées par virgules) :
                        </label>
                        <input
                          type="text"
                          value={matrixSizesInput}
                          onChange={(e) => setMatrixSizesInput(e.target.value)}
                          placeholder="40, 41, 42, 43 ou Standard"
                          className="w-full bg-[#0d0d10] border border-zinc-800 rounded px-2.5 py-1 text-zinc-100 placeholder-zinc-600 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] text-zinc-400 font-medium">Stock par variante :</label>
                        <input
                          type="number"
                          value={batchStockValue}
                          onChange={(e) => setBatchStockValue(Number(e.target.value))}
                          className="w-16 bg-[#0d0d10] border border-zinc-800 rounded px-2 py-0.5 text-zinc-100 text-center font-mono tabular-nums text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleApplyBatchStock}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-medium border border-zinc-700"
                          title="Remplir le stock de toutes les variantes avec cette valeur"
                        >
                          Appliquer à tous (1-clic)
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateMatrix}
                        className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-900 text-[11px] font-semibold transition-colors shadow-sm"
                      >
                        Générer Matrice ({matrixColorsInput.split(',').filter(Boolean).length} × {matrixSizesInput.split(',').filter(Boolean).length})
                      </button>
                    </div>
                  </div>
                )}

                {/* Variants List */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 admin-scrollbar">
                  {editVariants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-zinc-900/90 p-2 rounded-lg border border-zinc-800">
                      {v.sku && (
                        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[9px] truncate max-w-[100px]" title={v.sku}>
                          {v.sku}
                        </span>
                      )}
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

              {/* Multi-Image Portfolio Management */}
              <div className="space-y-2.5 p-3.5 rounded-lg bg-[#0d0d10] border border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-200 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Galerie Visuelle ({editImages.length} photo{editImages.length > 1 ? 's' : ''})</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Image en position #1 = Vignette Principale
                  </div>
                </div>

                {/* Moroccan Presets Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500 font-medium">Presets Marocains :</span>
                  {MOROCCAN_PRODUCT_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyImagePreset(preset)}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700/80 transition-colors"
                      title={preset.title}
                    >
                      + {preset.niche}
                    </button>
                  ))}
                </div>

                {/* Thumbnails Strip */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {editImages.map((imgUrl, idx) => {
                      const isPrimary = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-lg overflow-hidden border ${
                            isPrimary ? 'border-emerald-500/80 ring-1 ring-emerald-500/50' : 'border-zinc-800'
                          } bg-zinc-900 group`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-20 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          {/* Primary Badge */}
                          {isPrimary ? (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-zinc-950 font-bold text-[9px] flex items-center gap-0.5 shadow">
                              <Star className="w-2.5 h-2.5 fill-current" /> Principale
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 hover:bg-black text-zinc-300 hover:text-white text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Définir Principale
                            </button>
                          )}

                          {/* Quick Actions (Move & Delete) */}
                          <div className="absolute bottom-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-0.5 rounded">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'left')}
                                className="p-0.5 text-zinc-400 hover:text-white"
                                title="Déplacer vers la gauche"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {idx < editImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'right')}
                                className="p-0.5 text-zinc-400 hover:text-white"
                                title="Déplacer vers la droite"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-0.5 text-zinc-400 hover:text-rose-400"
                              title="Retirer cette photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Image URL Input */}
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                    placeholder="Ajouter une URL d'image (https://...)"
                    className="flex-1 bg-[#0d0d10] border border-zinc-800 rounded-md px-2.5 py-1.5 text-zinc-200 placeholder-zinc-600 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700"
                  >
                    + Ajouter
                  </button>
                </div>
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
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Coach IA Marocain (Darija / FR)
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Générez des titres vendeurs, des accroches en Darija et des offres dégressives.
                </p>
              </div>
              <button 
                onClick={() => setShowAICoach(false)} 
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
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
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
                className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" /> Régénérer de Nouvelles Variantes
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
                      className="text-zinc-300 hover:text-white flex items-center gap-1 font-sans text-xs transition-colors cursor-pointer"
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
                      <Flame className="w-3.5 h-3.5 text-emerald-400" /> Accroche en Darija
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

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Icône & Symbole :</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-[#0d0d10] border border-zinc-800 rounded-lg">
                  {['🧳', '🍯', '⚡', '🌿', '👗', '👞', '💎', '🛋️', '👶', '🍵', '🏷️', '📦'].map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setNewCatIcon(ico)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all ${
                        newCatIcon === ico
                          ? 'bg-zinc-700 border-2 border-emerald-400 scale-105 shadow-sm'
                          : 'bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/60'
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Description de la collection (optionnel) :</label>
                <textarea
                  rows={2}
                  placeholder="Brève description pour vos campagnes et votre catalogue..."
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2 text-zinc-200 placeholder-zinc-500 text-xs focus:outline-none focus:border-zinc-600 resize-none"
                />
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

      {/* Reassign & Delete Category Modal */}
      {showReassignModal && categoryToReassign && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-zinc-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-sky-400" />
                <h3 className="text-base font-semibold text-white">Réassigner les Produits</h3>
              </div>
              <button 
                type="button"
                onClick={() => { setShowReassignModal(false); setCategoryToReassign(null); }} 
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReassign} className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-800/40 text-sky-300 text-xs leading-relaxed">
                La catégorie <strong className="text-white">« {categoryToReassign.name} »</strong> contient{' '}
                <strong className="text-white font-mono tabular-nums">{categoryToReassign.productCount} produit(s)</strong> rattaché(s).
                Pour éviter tout produit orphelin dans votre boutique, veuillez choisir une catégorie de destination.
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Catégorie de Destination :</label>
                <select
                  value={targetReassignCatId}
                  onChange={(e) => setTargetReassignCatId(e.target.value)}
                  className="w-full bg-[#0d0d10] border border-zinc-800 rounded-lg p-2.5 text-zinc-200 text-xs focus:outline-none focus:border-zinc-600"
                >
                  {categories
                    .filter((c) => c.id !== categoryToReassign.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.productCount} articles actuels)
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Les {categoryToReassign.productCount} produit(s) seront instantanément migrés, puis « {categoryToReassign.name} » sera supprimée.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => { setShowReassignModal(false); setCategoryToReassign(null); }}
                  className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-medium transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  Réassigner & Supprimer
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
