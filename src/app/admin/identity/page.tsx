'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, UserCheck, ShieldCheck, Upload, FileText, 
  CheckCircle2, Clock, AlertCircle, HelpCircle, ArrowRight, 
  Briefcase, Landmark, Check, Save 
} from 'lucide-react';

const MOROCCAN_BANKS = [
  'Attijariwafa Bank',
  'Banque Populaire (BCP)',
  'CIH Bank',
  'Bank of Africa (BMCE)',
  'Société Générale Maroc',
  'Crédit du Maroc (CDM)',
  'Al Barid Bank',
  'CFG Bank',
];

export default function IdentityPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'draft' | 'pending' | 'verified' | 'rejected'>('draft');
  const [entityType, setEntityType] = useState<'auto_entrepreneur' | 'sarl'>('auto_entrepreneur');
  
  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [iceNumber, setIceNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [rcCity, setRcCity] = useState('Casablanca');
  const [cinNumber, setCinNumber] = useState('');
  const [bankName, setBankName] = useState(MOROCCAN_BANKS[0]);
  const [bankRib, setBankRib] = useState('');
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/identity')
      .then((res) => res.json())
      .then((data) => {
        if (data.status) setStatus(data.status);
        if (data.entityType) setEntityType(data.entityType);
        if (data.companyName) setCompanyName(data.companyName);
        if (data.iceNumber) setIceNumber(data.iceNumber);
        if (data.taxId) setTaxId(data.taxId);
        if (data.rcNumber) setRcNumber(data.rcNumber);
        if (data.rcCity) setRcCity(data.rcCity);
        if (data.cinNumber) setCinNumber(data.cinNumber);
        if (data.bankName) setBankName(data.bankName);
        if (data.bankRib) setBankRib(data.bankRib);
        if (data.documentUrls) setDocumentUrls(data.documentUrls);
      })
      .catch((err) => console.error('[Identity] Load error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(docType);
    setFeedback(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', docType);

    try {
      const res = await fetch('/api/identity/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: 'error', message: data.error || 'Erreur lors de l upload' });
        return;
      }

      setDocumentUrls((prev) => ({
        ...prev,
        [docType]: data.url,
      }));
      setFeedback({ type: 'success', message: `${file.name} téléversé avec succès.` });
    } catch {
      setFeedback({ type: 'error', message: 'Erreur réseau lors de l upload' });
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleSaveDraft = async () => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/identity/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          companyName,
          iceNumber,
          taxId,
          rcNumber,
          rcCity,
          cinNumber,
          bankName,
          bankRib,
          documentUrls,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'Brouillon sauvegardé avec succès.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erreur de sauvegarde' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/identity/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          companyName,
          iceNumber,
          taxId,
          rcNumber,
          rcCity,
          cinNumber,
          bankName,
          bankRib,
          documentUrls,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFeedback({ type: 'error', message: data.error || 'Erreur de soumission' });
        setSubmitting(false);
        return;
      }

      setStatus('pending');
      setFeedback({
        type: 'success',
        message: 'Votre dossier a été soumis pour vérification ! Notre équipe le validera sous 24-48h.',
      });
    } catch {
      setFeedback({ type: 'error', message: 'Erreur réseau lors de la soumission' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-xs text-slate-500 font-sans">
        Chargement de vos informations de conformité...
      </div>
    );
  }

  const isLocked = status === 'pending' || status === 'verified';

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8 max-w-5xl mx-auto font-sans">
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Conformité & Identité Marchande (KYC Maroc)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          Vérification légale conforme aux directives Bank Al-Maghrib pour les virements bancaires COD.
        </p>
      </div>

      {/* Status Banner */}
      {status === 'verified' && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <div>
            <p className="font-bold">Compte Marchand Vérifié ✓</p>
            <p className="text-[11px] text-emerald-500 mt-0.5">
              Votre identité légale est validée. Vos virements COD sont débloqués en illimité.
            </p>
          </div>
        </div>
      )}

      {status === 'pending' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-3">
          <Clock className="w-5 h-5 shrink-0 text-amber-400 animate-pulse" />
          <div>
            <p className="font-bold">Dossier en cours d examen ⏳</p>
            <p className="text-[11px] text-amber-500 mt-0.5">
              Vos documents ont été transmis à l équipe conformité CODShop. Traitement sous 24h à 48h ouvrables.
            </p>
          </div>
        </div>
      )}

      {status === 'draft' && (
        <div className="p-4 rounded-2xl bg-[#121215] border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-bold text-white">Dossier Non Soumis</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Veuillez renseigner votre statut (Auto-Entrepreneur ou SARL) et téléverser vos pièces justificatives.
            </p>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.message}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Legal Entity Type */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            1. Forme Juridique de votre Activité
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              disabled={isLocked}
              onClick={() => setEntityType('auto_entrepreneur')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                entityType === 'auto_entrepreneur'
                  ? 'bg-amber-500/10 border-amber-500/40 text-white'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">Auto-Entrepreneur Marocain</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Personne physique immatriculée au Registre National de l Auto-Entrepreneur.
                </p>
              </div>
            </button>

            <button
              type="button"
              disabled={isLocked}
              onClick={() => setEntityType('sarl')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                entityType === 'sarl'
                  ? 'bg-amber-500/10 border-amber-500/40 text-white'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">Société Commerciale (SARL, SA)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Entreprise enregistrée au Registre de Commerce (Modèle J, ICE, IF).
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Legal Identifiers */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            2. Identifiants Fiscaux & Réglementaires
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {entityType === 'sarl' && (
              <>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300">Raison Sociale (Nom de l entreprise)</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    placeholder="Ex: OTTAVIO LEATHER SARL"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Numéro ICE (15 chiffres)</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    placeholder="002948291000045"
                    value={iceNumber}
                    onChange={(e) => setIceNumber(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Identifiant Fiscal (IF)</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    placeholder="59482910"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Numéro RC (Registre du Commerce)</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    placeholder="492810"
                    value={rcNumber}
                    onChange={(e) => setRcNumber(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Tribunal de Commerce</label>
                  <input
                    type="text"
                    disabled={isLocked}
                    placeholder="Casablanca"
                    value={rcCity}
                    onChange={(e) => setRcCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-300">
                {entityType === 'auto_entrepreneur'
                  ? 'Numéro CIN du Titulaire (Carte Nationale)'
                  : 'Numéro CIN du Gérant Légal'}
              </label>
              <input
                type="text"
                disabled={isLocked}
                placeholder="Ex: BE123456"
                value={cinNumber}
                onChange={(e) => setCinNumber(e.target.value.toUpperCase())}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Banking Details for COD Payouts */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
              3. Coordonnées Bancaires Marocaines (Virements COD)
            </h2>
            <Landmark className="w-4 h-4 text-amber-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Banque Réceptrice</label>
              <select
                disabled={isLocked}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-amber-400"
              >
                {MOROCCAN_BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Relevé d Identité Bancaire (RIB - 24 chiffres)</label>
              <input
                type="text"
                disabled={isLocked}
                placeholder="007 780 0001234567890123 45"
                value={bankRib}
                onChange={(e) => setBankRib(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono text-xs outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Documents Upload */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
            4. Pièces Justificatives Obligatoires
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Doc 1: CIN Recto */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">CIN (Face Avant)</span>
                {documentUrls['cin_front'] && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400">Carte nationale d identité lisible.</p>
              
              {!isLocked && (
                <label className="cursor-pointer flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingDoc === 'cin_front' ? 'Téléversement...' : documentUrls['cin_front'] ? 'Remplacer' : 'Choisir fichier'}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'cin_front')}
                  />
                </label>
              )}
            </div>

            {/* Doc 2: CIN Verso */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">CIN (Face Arrière)</span>
                {documentUrls['cin_back'] && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400">Verso de la CIN avec adresse.</p>
              
              {!isLocked && (
                <label className="cursor-pointer flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingDoc === 'cin_back' ? 'Téléversement...' : documentUrls['cin_back'] ? 'Remplacer' : 'Choisir fichier'}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'cin_back')}
                  />
                </label>
              )}
            </div>

            {/* Doc 3: Attestation / Modèle J */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {entityType === 'auto_entrepreneur' ? 'Attestation A.E' : 'Extrait Modèle J'}
                </span>
                {documentUrls['legal_proof'] && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400">
                {entityType === 'auto_entrepreneur'
                  ? 'Carte ou attestation délivrée par la Poste Maroc.'
                  : 'Extrait du Registre de Commerce de moins de 3 mois.'}
              </p>
              
              {!isLocked && (
                <label className="cursor-pointer flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingDoc === 'legal_proof' ? 'Téléversement...' : documentUrls['legal_proof'] ? 'Remplacer' : 'Choisir fichier'}</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'legal_proof')}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        {!isLocked && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              <Save className="w-4 h-4" /> Enregistrer le brouillon
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-500/10"
            >
              {submitting ? 'Transmission...' : (
                <>Soumettre pour vérification <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
