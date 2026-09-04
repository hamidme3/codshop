'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Smartphone, Monitor, Save, ExternalLink, Plus, 
  Trash2, Eye, EyeOff, ChevronUp, ChevronDown, 
  Sparkles, Clock, Check, Layers, Sliders, ArrowLeft
} from 'lucide-react';
import { DynamicSectionRenderer } from '@/components/builder/Sections';

function BuilderContent() {
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('store') || 'ottavio';

  const [storeData, setStoreData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'settings'>('sections');
  const [showAddModal, setShowAddModal] = useState(false);

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
    if (sections.length <= 1) return alert('Votre page doit contenir au moins une section.');
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

  const addSection = (type: string) => {
    const id = `sec_${Date.now()}`;
    let newSec: any = { id, type, settings: {} };

    if (type === 'hero_banner') {
      newSec.settings = {
        headline: 'Nouvelle Offre Exceptionnelle',
        subheadline: 'Profitez de notre remise exclusive aujourd\'hui seulement.',
        ctaText: 'Commander Maintenant',
        badgeText: 'Nouveauté',
      };
    } else if (type === 'urgency_timer') {
      newSec.settings = {
        title: 'Vente Flash Limitée',
        countdownHours: 3,
        stockRemaining: 9,
      };
    } else if (type === 'cod_checkout') {
      newSec.settings = {
        productTitle: 'Article Vedette',
        price: 299,
        packDuoDiscount: 100,
        packTrioDiscount: 200,
      };
    } else if (type === 'faq_accordion') {
      newSec.settings = {
        faqs: [
          { q: 'Comment payer ?', a: 'En espèces au livreur à réception.' },
          { q: 'Délais de livraison ?', a: '24h à 48h partout au Maroc.' },
        ],
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
        body: JSON.stringify({ sections }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      alert('Erreur lors de la publication');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/register-store"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Retour"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base">
                {storeData?.name || storeSlug}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {storeSlug}.codshop.vipone.site
              </span>
            </div>
          </div>
        </div>

        {/* 14-Day Trial Banner */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-amber-500/30 text-xs text-amber-300">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Essai Gratuit : <strong>14 jours restants</strong></span>
          <Link
            href={`/admin/billing?store=${storeSlug}`}
            className="ml-2 text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded transition-colors"
          >
            Choisir mon plan
          </Link>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              viewport === 'mobile'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              viewport === 'desktop'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={`/?store=${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Voir la boutique
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" /> Publié !
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
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Controls & Inspector */}
        <aside aria-label="Page Builder Controls" className="w-80 sm:w-96 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-10">
          {/* Sub-Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/50">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'sections'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Sections ({sections.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" /> Modifier le bloc
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'sections' ? (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Ordre des blocs (Glisser / Déplacer)</span>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1 text-amber-400 font-bold hover:underline"
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
                            ? 'bg-amber-500/10 border-amber-500 text-white'
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
                          <div className="text-xs font-extrabold capitalize">
                            {sec.type.replace('_', ' ')}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {sec.settings.headline || sec.settings.title || sec.settings.productTitle || 'Bloc configuré'}
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
                  className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 text-slate-400 hover:text-amber-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors mt-4"
                >
                  <Plus className="w-4 h-4" /> Ajouter un bloc de conversion
                </button>
              </>
            ) : (
              /* Settings Tab */
              <div className="space-y-4">
                {selectedSection ? (
                  <>
                    <div className="pb-2 border-b border-slate-800">
                      <div className="text-xs font-mono uppercase text-amber-400">Modifier :</div>
                      <div className="text-sm font-bold text-white capitalize">{selectedSection.type.replace('_', ' ')}</div>
                    </div>

                    {/* Dynamic Fields by Type */}
                    {selectedSection.type === 'hero_banner' && (
                      <div className="space-y-3 text-xs">
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
                          <label className="block text-slate-400 mb-1">Sous-titre :</label>
                          <textarea
                            rows={3}
                            value={selectedSection.settings.subheadline || ''}
                            onChange={(e) => updateSetting('subheadline', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Texte du Bouton CTA :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.ctaText || ''}
                            onChange={(e) => updateSetting('ctaText', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1">Image d&apos;arrière-plan (URL) :</label>
                          <input
                            type="text"
                            value={selectedSection.settings.bgImage || ''}
                            onChange={(e) => updateSetting('bgImage', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    )}

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
                        <div>
                          <label className="block text-slate-400 mb-1">Stock restant affiché :</label>
                          <input
                            type="number"
                            value={selectedSection.settings.stockRemaining || 14}
                            onChange={(e) => updateSetting('stockRemaining', Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                          />
                        </div>
                      </div>
                    )}

                    {selectedSection.type === 'cod_checkout' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Nom du Produit :</label>
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
                            <label className="block text-slate-400 mb-1">Remise Pack Duo (DH) :</label>
                            <input
                              type="number"
                              value={selectedSection.settings.packDuoDiscount || 100}
                              onChange={(e) => updateSetting('packDuoDiscount', Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Sélectionnez une section dans l&apos;onglet de gauche pour la modifier.
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Center Canvas: Live Interactive Preview */}
        <main className="flex-1 bg-slate-950/80 p-4 sm:p-8 overflow-y-auto flex items-start justify-center">
          <div
            className={`transition-all duration-300 shadow-2xl overflow-hidden bg-slate-950 border border-slate-800 ${
              viewport === 'mobile'
                ? 'w-[375px] min-h-[667px] rounded-[40px] border-8 border-slate-800 my-4'
                : 'w-full max-w-5xl rounded-2xl min-h-[800px]'
            }`}
          >
            {/* Mobile Notch Bar */}
            {viewport === 'mobile' && (
              <div className="h-6 bg-slate-900 flex items-center justify-between px-6 text-[10px] text-slate-400 border-b border-slate-800 select-none">
                <span>9:41</span>
                <div className="w-16 h-3 bg-slate-950 rounded-full" />
                <span>4G 100%</span>
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
                    sec.id === selectedSectionId ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950' : ''
                  }`}
                >
                  <DynamicSectionRenderer section={sec} />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Ajouter un bloc de conversion</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addSection('hero_banner')}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-left hover:border-amber-400 transition-colors"
              >
                <div className="font-bold text-white text-xs">Hero Banner</div>
                <div className="text-[10px] text-slate-400 mt-1">Titre, image et appel à l&apos;action</div>
              </button>

              <button
                onClick={() => addSection('cod_checkout')}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-left hover:border-amber-400 transition-colors"
              >
                <div className="font-bold text-white text-xs">Formulaire COD</div>
                <div className="text-[10px] text-slate-400 mt-1">1-page checkout + packs promo</div>
              </button>

              <button
                onClick={() => addSection('urgency_timer')}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-left hover:border-amber-400 transition-colors"
              >
                <div className="font-bold text-white text-xs">Compte à Rebours</div>
                <div className="text-[10px] text-slate-400 mt-1">Urgence et stock limité</div>
              </button>

              <button
                onClick={() => addSection('faq_accordion')}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-left hover:border-amber-400 transition-colors"
              >
                <div className="font-bold text-white text-xs">FAQ Accordéon</div>
                <div className="text-[10px] text-slate-400 mt-1">Questions fréquentes clients</div>
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
