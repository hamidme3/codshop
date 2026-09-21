'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, Mail, Phone, MapPin, Lock, Save, CheckCircle2, 
  AlertCircle, Shield, KeyRound, ExternalLink, Globe
} from 'lucide-react';
import { ALL_COUNTRIES } from '@/lib/geo';

export default function AccountProfilePage() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLocale, setPreferredLocale] = useState('fr');

  // Address Form States
  const [firstLine, setFirstLine] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [postalCode, setPostalCode] = useState('20000');
  const [country, setCountry] = useState('MA');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetch('/api/sso/info')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFirstName(data.user.first_name || '');
          setLastName(data.user.last_name || '');
          setEmail(data.user.email || '');
          setPhone(data.user.phone || '');
          setPreferredLocale(data.user.preferred_locale || 'fr');
          if (data.user.address) {
            setFirstLine(data.user.address.firstLine || '');
            setCity(data.user.address.city || 'Casablanca');
            setPostalCode(data.user.address.postalCode || '20000');
            setCountry(data.user.address.country || 'MA');
          }
        }
      })
      .catch((err) => console.error('[Account] Load error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone, preferredLocale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la mise à jour');
      setFeedback({ type: 'success', message: 'Profil personnel mis à jour avec succès.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/account/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstLine, city, postalCode, country }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la mise à jour');
      setFeedback({ type: 'success', message: 'Adresse fiscale mise à jour avec succès.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Le mot de passe doit comporter au moins 6 caractères.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch('/api/security/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de mot de passe');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'Mot de passe modifié avec succès !' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent mb-3" />
        <p className="text-sm">Chargement de votre compte...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8 max-w-5xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Paramètres & Compte</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[11px] text-zinc-400 font-mono">Administration Marchand</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Paramètres du Compte Marchand
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Gérez vos informations personnelles, adresse fiscale de facturation et identifiants d&apos;accès.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/security"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white dark:border-zinc-800 rounded-lg text-xs font-medium transition shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>Sécurité &amp; 2FA</span>
          </Link>
          <Link
            href="/admin/identity"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white dark:border-zinc-800 rounded-lg text-xs font-medium transition shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Conformité KYC</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border animate-in fade-in duration-150 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Grid: Profile & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/70 bento-card rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">Informations Personnelles</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-500 dark:text-zinc-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Numéro de Téléphone (WhatsApp)</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+212 6 XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Langue de l’Interface</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={preferredLocale}
                  onChange={(e) => setPreferredLocale(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                  style={{ colorScheme: 'light' }}
                >
                  <option value="fr">Français</option>
                  <option value="ar">العربية (RTL)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Company & Billing Address */}
        <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/70 bento-card rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">Adresse Fiscale de Facturation</h3>
          </div>

          <form onSubmit={handleSaveAddress} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Adresse (Rue / N° / Immeuble)</label>
              <input
                type="text"
                placeholder="Ex: 45 Boulevard d'Anfa, Étage 3"
                value={firstLine}
                onChange={(e) => setFirstLine(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Ville</label>
                <input
                  type="text"
                  placeholder="Casablanca"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Code Postal</label>
                <input
                  type="text"
                  placeholder="20000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Pays</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-200 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                style={{ colorScheme: 'light' }}
              >
                {ALL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code}) — {c.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingAddress}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white rounded-lg text-xs font-semibold transition border border-slate-900 dark:border-zinc-800 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingAddress ? 'Enregistrement...' : 'Mettre à jour l’adresse'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/70 bento-card rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800/80 pb-3">
          <Lock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">Changer le Mot de Passe</h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Mot de passe actuel</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                required
                placeholder="Au moins 6 caractères"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                required
                placeholder="Retapez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white border border-slate-900 dark:border-zinc-800 disabled:opacity-50 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{updatingPassword ? 'Modification...' : 'Modifier mon mot de passe'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
