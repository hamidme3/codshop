'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Smartphone, Monitor, Save, ExternalLink, Plus, 
  Trash2, Eye, EyeOff, ChevronUp, ChevronDown, 
  Sparkles, Clock, Check, Layers, Sliders, ArrowLeft,
  Palette, Video, MessageCircle, HelpCircle, ShieldCheck,
  Tag, Flame, Star, ShoppingBag
} from 'lucide-react';
import { DynamicSectionRenderer } from '@/components/builder/Sections';
import { THEMES, THEME_LIST, ThemeId } from '@/lib/themes';
import { getStorefrontUrl } from '@/lib/store-urls';

interface ThemeConfigState {
  primaryColor: string;
  accentColor: string;
  bgPage: string;
  buttonRadius: 'sharp' | 'subtle' | 'rounded' | 'pill';
  fontFamily: 'serif' | 'sans' | 'mono';
  announcementText: string;
  showAnnouncement: boolean;
  announcementBg: string;
}

const THEME_PRESETS: Record<string, {
  name: string;
  description: string;
  badge: string;
  category: string;
  sourceInspiration: string;
  config: ThemeConfigState;
}> = Object.fromEntries(
  THEME_LIST.map((t) => [
    t.id,
    {
      name: t.name,
      description: t.tagline,
      badge: t.badge,
      category: t.category,
      sourceInspiration: t.sourceInspiration,
      config: {
        primaryColor: t.colors.primary,
        accentColor: t.colors.accent,
        bgPage: t.colors.bgPage,
        buttonRadius: (t.styleTokens.buttonRadius === 'rounded-full' ? 'pill' : t.styleTokens.buttonRadius === 'rounded-none' ? 'sharp' : t.styleTokens.buttonRadius === 'rounded-xl' ? 'rounded' : 'subtle') as any,
        fontFamily: (t.typography.fontFamily === 'serif' ? 'serif' : t.typography.fontFamily === 'monospace' ? 'mono' : 'sans') as any,
        announcementText: t.announcementText,
        showAnnouncement: true,
        announcementBg: t.announcementBg,
      },
    },
  ])
);

function BuilderContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';
  const storefrontUrl = getStorefrontUrl(storeSlug);

  const [storeData, setStoreData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'settings' | 'theme'>('sections');
  const [showAddModal, setShowAddModal] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'editor' | 'preview'>('editor');

  // Theme Customizer State
  const [themeId, setThemeId] = useState<string>('luxury');
  const [themeConfig, setThemeConfig] = useState<ThemeConfigState>(THEME_PRESETS.luxury.config);
  const [themeCategory, setThemeCategory] = useState<string>('all');

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await fetch(`/api/stores/${storeSlug}/builder`);
        if (res.ok) {
          const data = await res.json();
          setStoreData(data.store);
          setSections(data.store.sections || []);
          if (data.store.sections?.length > 0) {
            setSelectedSectionId(data.store.sections[0].id);
          }
          if (data.store.themeId) {
            setThemeId(data.store.themeId);
          }
          if (data.store.themeConfig) {
            setThemeConfig((prev) => ({
              ...prev,
              ...data.store.themeConfig,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load store builder data', err);
      }
    }
    loadStore();
  }, [storeSlug]);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // Section Management Handlers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  const toggleVisibility = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s))
    );
  };

  const deleteSection = (id: string) => {
    if (sections.length <= 1) return alert('Votre boutique doit contenir au moins une section.');
    setSections(sections.filter((s) => s.id !== id));
    if (selectedSectionId === id) {
      setSelectedSectionId(sections[0]?.id || null);
    }
  };

  const updateSetting = (key: string, value: any) => {
    if (!selectedSectionId) return;
    setSections(
      sections.map((s) => {
        if (s.id === selectedSectionId) {
          return {
            ...s,
            settings: { ...s.settings, [key]: value },
          };
        }
        return s;
      })
    );
  };

  const applyPreset = (id: string) => {
    const preset = THEME_PRESETS[id];
    if (!preset) return;
    setThemeId(id);
    setThemeConfig(preset.config);
  };

  const addSection = (type: string) => {
    const id = `sec_${Date.now()}`;
    let newSec: any = { id, type, settings: {} };

    if (type === 'announcement_bar') {
      newSec.settings = {
        text: 'Livraison Rapide Gratuite dès 400 DH • Paiement Cash à la Livraison',
        bgColor: themeConfig.accentColor,
      };
    } else if (type === 'hero_banner') {
      newSec.settings = {
        headline: 'Nouvelle Offre Exceptionnelle',
        subheadline: 'Profitez de notre remise exclusive aujourd\'hui avec paiement à la livraison.',
        ctaText: 'Commander Maintenant',
        badgeText: 'Offre Spéciale',
      };
    } else if (type === 'features_grid') {
      newSec.settings = {
        badges: [
          { title: 'Paiement à la Livraison', subtitle: 'Payez en espèces après inspection' },
          { title: 'Ouverture du Colis Garantie', subtitle: 'Vérifiez le produit avant de régler' },
          { title: 'Livraison Express 24/48h', subtitle: 'Partout au Maroc' },
          { title: 'Échange Gratuit 7 Jours', subtitle: 'Support WhatsApp réactif 7j/7' },
        ],
      };
    } else if (type === 'urgency_timer') {
      newSec.settings = {
        title: 'Vente Flash Limitée',
        stockRemaining: 12,
        countdownHours: 4,
      };
    } else if (type === 'cod_checkout') {
      newSec.settings = {
        productTitle: 'Article Vedette — Édition Spéciale',
        price: 349,
        comparePrice: 590,
        packDuoDiscount: 100,
        packTrioDiscount: 200,
      };
    } else if (type === 'video_showcase') {
      newSec.settings = {
        title: 'Découvrez le Produit en Action',
        subtitle: 'Regardez la démonstration réelle avant de commander.',
        badgeText: 'Démonstration Vidéo',
      };
    } else if (type === 'testimonials_carousel') {
      newSec.settings = {
        title: 'Ce Que Disent Nos Clients Partout au Maroc',
        reviews: [
          { name: 'Fatima Zahra M.', city: 'Casablanca (Maârif)', rating: 5, comment: 'Qualité au top, livrée en 24h avec ouverture du colis avant de payer !' },
          { name: 'Yassine B.', city: 'Rabat (Agdal)', rating: 5, comment: 'Livreur ponctuel, produit conforme à la photo.' },
          { name: 'Mehdi K.', city: 'Marrakech (Guéliz)', rating: 5, comment: 'Super rapport qualité-prix, je recommande vivement.' },
        ],
      };
    } else if (type === 'faq_accordion') {
      newSec.settings = {
        faqs: [
          { q: 'Puis-je ouvrir et vérifier le colis avant de payer ?', a: 'Oui, vous ouvrez la boîte et vérifiez avant de payer le livreur.' },
          { q: 'Comment s\'effectue le paiement ?', a: 'En dirhams (espèces) directement au livreur à votre porte.' },
          { q: 'Quels sont les délais de livraison ?', a: '24h à Casablanca et Rabat, 24h à 48h dans les autres villes.' },
        ],
      };
    } else if (type === 'whatsapp_floating_bar') {
      newSec.settings = {
        phone: '+212661000000',
        message: 'Salam, bghit nsewel 3la had l\'article w ncommander',
        buttonText: 'Commander via WhatsApp',
      };
    }

    setSections([...sections, newSec]);
    setSelectedSectionId(id);
    setShowAddModal(false);
    setActiveTab('settings');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/stores/${storeSlug}/builder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sections,
          themeId,
          themeConfig,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (err) {
      alert('Erreur réseau lors de la publication');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between z-20 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href={`/admin?store=${storeSlug}`}
            className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            title="Retour au tableau de bord"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <span className="font-extrabold text-white text-xs sm:text-base truncate block max-w-[90px] sm:max-w-[200px]">
              {storeData?.name || storeSlug}
            </span>
          </div>
        </div>

        {/* Mobile View Toggle (Editor vs Preview) - Visible only on < lg */}
        <div className="flex lg:hidden items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 shrink-0">
          <button
            onClick={() => setMobileViewMode('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mobileViewMode === 'editor'
                ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Éditeur</span>
          </button>
          <button
            onClick={() => setMobileViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mobileViewMode === 'preview'
                ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu</span>
          </button>
        </div>

        {/* Viewport Switcher - Desktop only */}
        <div className="hidden lg:flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile (375px)
          </button>
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-emerald-500 text-zinc-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Voir en direct
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-3 sm:px-4 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-zinc-950" /> <span className="hidden sm:inline">Publié dans PostgreSQL !</span><span className="sm:hidden">Publié</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {saving ? 'Publication...' : 'Publier'}
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Controls, Inspector, & Theme Customizer */}
        <aside
          aria-label="Page Builder Controls"
          className={`bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-10 w-full lg:w-96 ${
            mobileViewMode === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Sub-Tabs: Sections | Bloc | Thème & Design */}
          <div className="flex border-b border-slate-800 bg-slate-950/50">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'sections'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Blocs ({sections.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> Réglages
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'theme'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Thème & Design
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1. SECTIONS TAB */}
            {activeTab === 'sections' && (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Ordre d&apos;affichage des blocs</span>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1 text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>

                <div className="space-y-2">
                  {sections.map((sec, idx) => {
                    const isSelected = sec.id === selectedSectionId;
                    return (
                      <div
                        key={sec.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setSelectedSectionId(sec.id);
                            setActiveTab('settings');
                          }}
                          className="flex-1 text-left"
                        >
                          <div className="text-xs font-extrabold capitalize flex items-center gap-1.5">
                            <span>{sec.type.replace(/_/g, ' ')}</span>
                            {sec.hidden && <span className="text-[9px] text-rose-400 font-normal">(Masqué)</span>}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                            {sec.settings.headline || sec.settings.title || sec.settings.productTitle || sec.settings.text || 'Bloc configuré'}
                          </div>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            title="Monter"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveSection(idx, 'down')}
                            disabled={idx === sections.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            title="Descendre"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleVisibility(sec.id)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Masquer/Afficher"
                          >
                            {sec.hidden ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => deleteSection(sec.id)}
                            className="p-1 text-slate-500 hover:text-red-400"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-emerald-400 text-slate-400 hover:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-4 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Ajouter un bloc de conversion marocain
                </button>
              </>
            )}

            {/* 2. SETTINGS (INSPECTOR) TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                {selectedSection ? (
                  <>
                    <div className="pb-2 border-b border-slate-800">
                      <div className="text-[10px] font-mono uppercase text-emerald-400">Modifier le bloc sélectionné :</div>
                      <div className="text-sm font-bold text-white capitalize">{selectedSection.type.replace(/_/g, ' ')}</div>
                    </div>

                    {/* Announcement Bar Settings */}
                    {selectedSection.type === 'announcement_bar' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Texte d&apos;accroche :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.text || ''}
                            onChange={(e) => updateSetting('text', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Couleur d&apos;arrière-plan :</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={selectedSection.settings.bgColor || themeConfig.accentColor}
                              onChange={(e) => updateSetting('bgColor', e.target.value)}
                              className="w-8 h-8 rounded-lg border border-slate-800 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={selectedSection.settings.bgColor || themeConfig.accentColor}
                              onChange={(e) => updateSetting('bgColor', e.target.value)}
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hero Banner Settings */}
                    {selectedSection.type === 'hero_banner' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Badge Supérieur :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.badgeText || ''}
                            onChange={(e) => updateSetting('badgeText', e.target.value)}
                            placeholder="Ex: Édition Limitée"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Titre Principal :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.headline || ''}
                            onChange={(e) => updateSetting('headline', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Sous-titre Persuasif :</label>
                          <textarea
                            rows={3}
                            value={selectedSection.settings.subheadline || ''}
                            onChange={(e) => updateSetting('subheadline', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Urgency Timer Settings */}
                    {selectedSection.type === 'urgency_timer' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Titre de l&apos;urgence :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.title || ''}
                            onChange={(e) => updateSetting('title', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* COD Checkout Settings */}
                    {selectedSection.type === 'cod_checkout' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Nom de l&apos;article :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.productTitle || ''}
                            onChange={(e) => updateSetting('productTitle', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-400 mb-1">Prix 1 Article (DH) :</label>
                            <input
                              type="number"
                              value={selectedSection.settings.price || 349}
                              onChange={(e) => updateSetting('price', Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Prix Barré (DH) :</label>
                            <input
                              type="number"
                              value={selectedSection.settings.comparePrice || 590}
                              onChange={(e) => updateSetting('comparePrice', Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-400 mb-1">Remise Pack Duo (DH) :</label>
                            <input
                              type="number"
                              value={selectedSection.settings.packDuoDiscount || 100}
                              onChange={(e) => updateSetting('packDuoDiscount', Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Remise Pack Trio (DH) :</label>
                            <input
                              type="number"
                              value={selectedSection.settings.packTrioDiscount || 200}
                              onChange={(e) => updateSetting('packTrioDiscount', Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Video Showcase Settings */}
                    {selectedSection.type === 'video_showcase' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Titre de la vidéo :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.title || ''}
                            onChange={(e) => updateSetting('title', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Sous-titre :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.subtitle || ''}
                            onChange={(e) => updateSetting('subtitle', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Image miniature (URL) :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.thumbnailUrl || ''}
                            onChange={(e) => updateSetting('thumbnailUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    )}

                    {/* WhatsApp Button Settings */}
                    {selectedSection.type === 'whatsapp_floating_bar' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Numéro WhatsApp Maroc :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.phone || '+212661000000'}
                            onChange={(e) => updateSetting('phone', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Message Pré-rempli :</label>
                          <textarea
                            rows={3}
                            value={selectedSection.settings.message || ''}
                            onChange={(e) => updateSetting('message', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Texte du Bouton :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.buttonText || 'Commander sur WhatsApp'}
                            onChange={(e) => updateSetting('buttonText', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Sélectionnez un bloc dans l&apos;onglet &quot;Blocs&quot; pour modifier ses réglages.
                  </div>
                )}
              </div>
            )}

            {/* 3. THEME & DESIGN CUSTOMIZER TAB */}
            {activeTab === 'theme' && (
              <div className="space-y-5 text-xs">
                {/* Preset Themes */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                      1. Catalogue des 25 Thèmes E-Commerce :
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {Object.keys(THEME_PRESETS).length} Thèmes Disponibles
                    </span>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
                    {[
                      { id: 'all', label: 'Tous (25)' },
                      { id: 'luxury', label: 'Luxe' },
                      { id: 'general', label: 'Top COD' },
                      { id: 'tech', label: 'High-Tech' },
                      { id: 'beauty', label: 'Beauté' },
                      { id: 'fashion', label: 'Mode' },
                      { id: 'home', label: 'Maison' },
                      { id: 'food', label: 'Terroir' },
                      { id: 'kids', label: 'Enfants' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setThemeCategory(cat.id)}
                        className={`px-2 py-0.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                          themeCategory === cat.id
                            ? 'bg-emerald-500 text-zinc-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Themes Grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                    {Object.entries(THEME_PRESETS)
                      .filter(([_, preset]) => themeCategory === 'all' || preset.category === themeCategory || (themeCategory === 'food' && preset.category === 'home'))
                      .map(([key, preset]) => {
                        const isActive = themeId === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => applyPreset(key)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isActive
                                ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500 text-white'
                                : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[9px] font-bold text-emerald-400 truncate">{preset.badge}</span>
                                <span className="text-[8px] font-mono px-1 rounded bg-slate-800 text-slate-300 shrink-0">
                                  {preset.sourceInspiration.split(' ')[0]}
                                </span>
                              </div>
                              <div className="font-extrabold text-white text-xs truncate">{preset.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                {preset.description}
                              </div>
                            </div>

                            <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                              <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: preset.config.primaryColor }} />
                                <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: preset.config.accentColor }} />
                              </div>
                              <span className={isActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                                {isActive ? 'Sélectionné' : 'Appliquer'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Color Customization */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    2. Palette de Couleurs de la Marque :
                  </label>

                  {/* Primary Color */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Couleur Principale :</div>
                      <div className="text-[10px] text-slate-400">Fond de page et structure</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeConfig.primaryColor}
                        onChange={(e) => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-300 uppercase">{themeConfig.primaryColor}</span>
                    </div>
                  </div>

                  {/* Accent / CTA Color */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Couleur Accent (CTA) :</div>
                      <div className="text-[10px] text-slate-400">Boutons d&apos;action &amp; prix COD</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeConfig.accentColor}
                        onChange={(e) => setThemeConfig({ ...themeConfig, accentColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                      />
                      <span className="font-mono text-[11px] text-slate-300 uppercase">{themeConfig.accentColor}</span>
                    </div>
                  </div>
                </div>

                {/* Button Radius */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    3. Forme des Boutons &amp; Cartes :
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'sharp', label: 'Carré' },
                      { id: 'subtle', label: 'Léger (8px)' },
                      { id: 'rounded', label: 'Arrondi (16px)' },
                      { id: 'pill', label: 'Pilule' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setThemeConfig({ ...themeConfig, buttonRadius: opt.id as any })}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-colors cursor-pointer ${
                          themeConfig.buttonRadius === opt.id
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                    4. Style Typographique :
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'serif', label: 'Serif Prestige' },
                      { id: 'sans', label: 'Sans Moderne' },
                      { id: 'mono', label: 'Mono Tech' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setThemeConfig({ ...themeConfig, fontFamily: opt.id as any })}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-colors cursor-pointer ${
                          themeConfig.fontFamily === opt.id
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Announcement Bar */}
                <div className="space-y-2 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Barre d&apos;Annonce Supérieure</span>
                    <button
                      type="button"
                      onClick={() => setThemeConfig({ ...themeConfig, showAnnouncement: !themeConfig.showAnnouncement })}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        themeConfig.showAnnouncement ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                      }`}
                    >
                      <span className="bg-slate-950 w-4 h-4 rounded-full shadow-md" />
                    </button>
                  </div>
                  {themeConfig.showAnnouncement && (
                    <input
                      type="text"
                      value={themeConfig.announcementText}
                      onChange={(e) => setThemeConfig({ ...themeConfig, announcementText: e.target.value })}
                      placeholder="Texte de l'annonce promotionnelle"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs mt-1"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Canvas: Live Interactive Preview */}
        <main
          className={`flex-1 bg-slate-950/90 p-2 sm:p-4 lg:p-8 overflow-y-auto flex items-start justify-center ${
            mobileViewMode === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div
            className={`transition-all duration-300 shadow-2xl overflow-hidden bg-slate-950 border border-slate-800 w-full ${
              viewport === 'mobile'
                ? 'max-w-[390px] min-h-[667px] rounded-2xl sm:rounded-[40px] sm:border-8 border-slate-800 my-2 sm:my-4'
                : 'max-w-5xl rounded-2xl min-h-[800px]'
            }`}
          >
            {/* Mobile Notch Bar */}
            {viewport === 'mobile' && (
              <div className="h-6 bg-slate-900 flex items-center justify-between px-6 text-[10px] text-slate-400 border-b border-slate-800 select-none">
                <span>9:41</span>
                <div className="w-16 h-3 bg-slate-950 rounded-full" />
                <span>4G 🇲🇦 100%</span>
              </div>
            )}

            {/* Top Announcement Bar if enabled */}
            {themeConfig.showAnnouncement && (
              <div 
                className="py-2 px-3 text-center text-[11px] font-black text-slate-950 transition-colors flex items-center justify-center gap-1.5 select-none"
                style={{ backgroundColor: themeConfig.accentColor }}
              >
                <span>🇲🇦</span>
                <span>{themeConfig.announcementText}</span>
              </div>
            )}

            {/* Rendered Live Sections */}
            <div className="divide-y divide-slate-800/50">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => {
                    setSelectedSectionId(sec.id);
                    setActiveTab('settings');
                  }}
                  className={`relative cursor-pointer transition-all ${
                    sec.id === selectedSectionId ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950' : ''
                  }`}
                >
                  <DynamicSectionRenderer section={sec} themeConfig={themeConfig} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Section Modal with All 9 Conversion Blocks */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-white">Ajouter un bloc de conversion marocain</h3>
                <p className="text-xs text-slate-400">Sélectionnez le composant à intégrer à votre page de vente.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <button
                onClick={() => addSection('hero_banner')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Hero Banner</div>
                <div className="text-[10px] text-slate-400 mt-1">Titre captivant, offre &amp; appel à l&apos;action</div>
              </button>

              <button
                onClick={() => addSection('cod_checkout')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Formulaire COD 1-Page</div>
                <div className="text-[10px] text-slate-400 mt-1">Packs Duo/Trio + Sélecteur de villes</div>
              </button>

              <button
                onClick={() => addSection('urgency_timer')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Urgence &amp; Stock Flash</div>
                <div className="text-[10px] text-slate-400 mt-1">Compte à rebours animé et stock limité</div>
              </button>

              <button
                onClick={() => addSection('features_grid')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Piliers Réassurance</div>
                <div className="text-[10px] text-slate-400 mt-1">Paiement à réception &amp; colis vérifiable</div>
              </button>

              <button
                onClick={() => addSection('video_showcase')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Video className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Démonstration Vidéo</div>
                <div className="text-[10px] text-slate-400 mt-1">Multipliez vos conversions par 3</div>
              </button>

              <button
                onClick={() => addSection('testimonials_carousel')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Star className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Avis Clients Marocains</div>
                <div className="text-[10px] text-slate-400 mt-1">Badges villes : Casablanca, Rabat, Marrakech</div>
              </button>

              <button
                onClick={() => addSection('faq_accordion')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">FAQ Accordéon</div>
                <div className="text-[10px] text-slate-400 mt-1">Questions fréquentes &amp; conditions COD</div>
              </button>

              <button
                onClick={() => addSection('whatsapp_floating_bar')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Bouton Flottant WhatsApp</div>
                <div className="text-[10px] text-slate-400 mt-1">Commande WhatsApp directe avec message pré-rempli</div>
              </button>

              <button
                onClick={() => addSection('announcement_bar')}
                className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-emerald-400 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-xs">Bandeau Promo</div>
                <div className="text-[10px] text-slate-400 mt-1">Notification supérieure d&apos;urgence</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-950 text-white flex items-center justify-center">Chargement du Page Builder...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
