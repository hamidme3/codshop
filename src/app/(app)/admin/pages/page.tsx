'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  Eye,
  ArrowRight,
  Truck,
  RotateCcw,
  Globe,
  Clock,
  AlertCircle,
  Menu,
} from 'lucide-react';
import type { StorePage, PolicyType } from '@/lib/types';

function PagesManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [pages, setPages] = useState<StorePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<'all' | 'policies' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Clipboard tracking
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal Editor state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [editingPage, setEditingPage] = useState<{
    id?: string;
    title: string;
    slug: string;
    content: string;
    policyType: PolicyType;
    isSystemPolicy: boolean;
    isPublished: boolean;
    seoTitle?: string;
    seoDescription?: string;
  } | null>(null);

  // Confirmation Modal
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(null);

  // Fetch pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${encodeURIComponent(storeSlug)}/pages`);
      const data = await res.json();
      if (data.success && Array.isArray(data.pages)) {
        setPages(data.pages);
      }
    } catch (err) {
      console.error('Failed to load pages:', err);
      showFeedback('Erreur lors du chargement des pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [storeSlug]);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const copyToClipboard = (text: string, slug: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // 1-Click Generate Standard Policies
  const handleGeneratePolicies = async () => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/stores/${encodeURIComponent(storeSlug)}/pages/generate-policies`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        showFeedback('5 politiques légales standard générées avec succès !', 'success');
        await fetchPages();
      } else {
        showFeedback(data.error || 'Erreur lors de la génération', 'error');
      }
    } catch (err) {
      showFeedback('Erreur de connexion', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save (Create or Update) Page
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage || !editingPage.title.trim() || !editingPage.content.trim()) {
      showFeedback('Veuillez remplir le titre et le contenu', 'error');
      return;
    }

    try {
      setActionLoading(true);
      const isUpdating = Boolean(editingPage.id);
      const url = isUpdating
        ? `/api/stores/${encodeURIComponent(storeSlug)}/pages/${encodeURIComponent(editingPage.slug)}`
        : `/api/stores/${encodeURIComponent(storeSlug)}/pages`;
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage),
      });

      const data = await res.json();
      if (data.success) {
        showFeedback(isUpdating ? 'Page mise à jour avec succès' : 'Page créée avec succès', 'success');
        setIsModalOpen(false);
        setEditingPage(null);
        await fetchPages();
      } else {
        showFeedback(data.error || 'Erreur lors de l’enregistrement', 'error');
      }
    } catch (err) {
      showFeedback('Erreur réseau', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Page
  const handleDeletePage = async (slugToDelete: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(
        `/api/stores/${encodeURIComponent(storeSlug)}/pages/${encodeURIComponent(slugToDelete)}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success) {
        showFeedback('Page supprimée avec succès', 'success');
        setDeleteConfirmSlug(null);
        await fetchPages();
      } else {
        showFeedback(data.error || 'Erreur lors de la suppression', 'error');
      }
    } catch (err) {
      showFeedback('Erreur réseau', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    if (!editingPage) return;
    const isNew = !editingPage.id;
    const newSlug = isNew
      ? val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      : editingPage.slug;

    setEditingPage({
      ...editingPage,
      title: val,
      slug: newSlug,
    });
  };

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      if (activeTab === 'policies' && !p.isSystemPolicy) return false;
      if (activeTab === 'custom' && p.isSystemPolicy) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        const matchType = p.policyType.toLowerCase().includes(q);
        if (!matchTitle && !matchSlug && !matchType) return false;
      }
      return true;
    });
  }, [pages, activeTab, searchQuery]);

  const policiesCount = pages.filter((p) => p.isSystemPolicy).length;
  const customCount = pages.filter((p) => !p.isSystemPolicy).length;

  const getPolicyBadge = (type: PolicyType) => {
    switch (type) {
      case 'terms':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">CGV Vente</span>;
      case 'privacy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">Confidentialité</span>;
      case 'shipping':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Livraison & Colis</span>;
      case 'returns':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Retours 7j</span>;
      case 'about':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">À Propos</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">Personnalisée</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
              : 'bg-rose-950/90 border-rose-700 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
              <span>Pages & Politiques Légales</span>
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              {pages.length} {pages.length > 1 ? 'pages' : 'page'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Rédigez vos pages statiques (À Propos, Guides de tailles, FAQ) et générez vos politiques e-commerce universelles pour le paiement à la livraison (CGV, Données personnelles, Inspection du colis).
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleGeneratePolicies}
            disabled={actionLoading}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 flex items-center gap-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
            title="Générer automatiquement les 5 politiques standard pour votre boutique et zone de livraison"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Générer les Politiques Standard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPage({
                title: '',
                slug: '',
                content: '# Titre de la page\n\nRédigez votre texte ici...',
                policyType: 'custom',
                isSystemPolicy: false,
                isPublished: true,
              });
              setEditorMode('edit');
              setIsModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle Page</span>
          </button>
        </div>
      </div>

      {/* KPI & Compliance Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Pages Publiées</span>
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {pages.filter((p) => p.isPublished).length} <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">/ {pages.length}</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-zinc-400">Accessibles directement sur votre storefront</div>
        </div>

        <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Politiques Légales</span>
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {policiesCount} <span className="text-xs font-normal text-slate-400 dark:text-zinc-500">/ 5 recommandées</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-zinc-400">CGV, Confidentialité, Retours, Livraison</div>
        </div>

        <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Inspection du Colis</span>
            <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            <span>عاين سلعتك وتأكد من الجودة</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-zinc-400">Clause de confiance COD universelle</div>
        </div>

        <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Menu & Footer</span>
            <Menu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white pt-1">
            <Link
              href={`/admin/menus?store=${storeSlug}`}
              className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-xs font-semibold"
            >
              <span>Lier aux menus de navigation</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-zinc-400">Ajout 1-clic aux colonnes du pied de page</div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800/80 p-2 rounded-2xl shadow-2xs">
        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Toutes ({pages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'policies'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Politiques Légales ({policiesCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            Pages Personnalisées ({customCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une page..."
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/60 text-slate-500 dark:text-zinc-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="py-3 px-4">Titre de la Page</th>
                <th className="py-3 px-4">Lien / URL</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Mise à Jour</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Chargement des pages...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-zinc-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="text-slate-800 dark:text-zinc-300 font-semibold text-sm">Aucune page trouvée</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        {searchQuery
                          ? 'Aucun résultat ne correspond à votre recherche.'
                          : 'Vous n’avez pas encore de page configurée. Cliquez sur "Générer les Politiques Standard" pour créer automatiquement les documents légaux recommandés.'}
                      </p>
                      {!searchQuery && (
                        <button
                          type="button"
                          onClick={handleGeneratePolicies}
                          className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/25 transition inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Générer les 5 Politiques Standard (COD)</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/30 transition group">
                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>{page.title}</span>
                        {page.isSystemPolicy && (
                          <span
                            className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            title="Modèle officiel standard pour le commerce en ligne"
                          >
                            Officiel
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-xs mt-0.5">
                        {page.seoDescription || page.content.slice(0, 80).replace(/[#*`\n]/g, ' ')}
                      </div>
                    </td>

                    {/* URL */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <code className="text-[11px] text-slate-700 dark:text-zinc-300 font-mono bg-slate-100 dark:bg-zinc-950 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                          /p/{page.slug}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`/p/${page.slug}`, page.slug)}
                          className="p-1 text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 transition rounded"
                          title="Copier le lien relatif"
                        >
                          {copiedSlug === page.slug ? (
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Policy Category Badge */}
                    <td className="py-3 px-4">
                      {getPolicyBadge(page.policyType)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {page.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                          <span>Publié</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500" />
                          <span>Brouillon</span>
                        </span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400 text-[11px] font-mono">
                      {new Date(page.updatedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Live Preview on Storefront */}
                        <a
                          href={`/p/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition"
                          title="Voir sur la boutique"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPage({
                              id: page.id,
                              title: page.title,
                              slug: page.slug,
                              content: page.content,
                              policyType: page.policyType,
                              isSystemPolicy: page.isSystemPolicy,
                              isPublished: page.isPublished,
                              seoTitle: page.seoTitle,
                              seoDescription: page.seoDescription,
                            });
                            setEditorMode('edit');
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-zinc-800 rounded-lg transition"
                          title="Modifier la page"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmSlug(page.slug)}
                          className="p-1.5 text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg transition"
                          title="Supprimer la page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal (Create or Edit Page) */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingPage.id ? `Modifier : ${editingPage.title}` : 'Créer une Nouvelle Page'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPage(null);
                }}
                className="text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white p-1 text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePage} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Row 1: Title and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Titre de la page <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPage.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: Guide des Tailles"
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Identifiant URL (Slug) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 dark:bg-zinc-950 border border-r-0 border-slate-200 dark:border-zinc-800 px-2.5 py-2 text-xs text-slate-500 dark:text-zinc-500 rounded-l-xl font-mono">
                      /p/
                    </span>
                    <input
                      type="text"
                      required
                      value={editingPage.slug}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
                        })
                      }
                      placeholder="guide-des-tailles"
                      className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-r-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Type de contenu
                  </label>
                  <select
                    value={editingPage.policyType}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        policyType: e.target.value as PolicyType,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="custom">Page Personnalisée standard</option>
                    <option value="terms">Conditions Générales de Vente (CGV)</option>
                    <option value="privacy">Politique de Confidentialité</option>
                    <option value="shipping">Livraison & Inspection Colis</option>
                    <option value="returns">Retours & Échanges 7j</option>
                    <option value="about">À Propos / Histoire de la marque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Statut de publication
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingPage.isPublished}
                        onChange={(e) =>
                          setEditingPage({ ...editingPage, isPublished: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950"
                      />
                      <span>Publier immédiatement sur la boutique</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Content Editor Tabs (Edit vs Preview) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
                  <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                    Contenu de la page (Formatage Markdown supporté) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-0.5 rounded-lg border border-slate-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEditorMode('edit')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                        editorMode === 'edit'
                          ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
                      }`}
                    >
                      Éditeur
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                        editorMode === 'preview'
                          ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>Aperçu</span>
                    </button>
                  </div>
                </div>

                {editorMode === 'edit' ? (
                  <textarea
                    required
                    rows={12}
                    value={editingPage.content}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                    placeholder="# Titre principal&#10;&#10;Vos paragraphes...&#10;&#10;### Sous-titre&#10;- Point 1&#10;- Point 2&#10;&#10;> Citation ou garantie importante"
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white font-mono leading-relaxed placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-y"
                  />
                ) : (
                  <div className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 text-xs text-slate-800 dark:text-zinc-300 max-h-72 overflow-y-auto space-y-2">
                    <div className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-mono mb-2">
                      Rendu de la page :
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed font-sans">
                      {editingPage.content}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO Metadata (Collapsible) */}
              <div className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-xl p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-800 dark:text-zinc-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Référencement SEO (Google)</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    type="text"
                    value={editingPage.seoTitle || ''}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, seoTitle: e.target.value })
                    }
                    placeholder="Balise Title (Ex: Conditions Générales | Ottavio)"
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={editingPage.seoDescription || ''}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, seoDescription: e.target.value })
                    }
                    placeholder="Meta Description pour les moteurs de recherche..."
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPage(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {actionLoading ? 'Enregistrement...' : 'Enregistrer la page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlug && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Supprimer cette page ?</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Êtes-vous sûr de vouloir supprimer la page <code className="text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/30 px-1 py-0.5 rounded border border-rose-200 dark:border-rose-900/40">/p/{deleteConfirmSlug}</code> ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSlug(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeletePage(deleteConfirmSlug)}
                disabled={actionLoading}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {actionLoading ? 'Suppression...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PagesManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-500">
          Chargement de l’interface des pages...
        </div>
      }
    >
      <PagesManagementContent />
    </Suspense>
  );
}
