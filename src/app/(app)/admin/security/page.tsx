'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Smartphone, Laptop, Globe, Clock, CheckCircle2, 
  AlertTriangle, Trash2, Key, X, Copy, Check, Lock, Loader2, QrCode 
} from 'lucide-react';

interface SessionItem {
  id: string;
  ipAddress: string;
  city: string;
  country: string;
  browser: string;
  os: string;
  lastActiveAt: string;
  isRevoked: boolean;
}

export default function SecurityPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // 2FA state
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [show2faModal, setShow2faModal] = useState(false);
  const [showDisable2faModal, setShowDisable2faModal] = useState(false);
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaSecret, setTwoFaSecret] = useState('');
  const [twoFaQrUrl, setTwoFaQrUrl] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaError, setTwoFaError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableError, setDisableError] = useState<string | null>(null);
  const [disableSubmitting, setDisableSubmitting] = useState(false);

  // Password update modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const fetchSessions = () => {
    fetch('/api/login-activity')
      .then((res) => res.json())
      .then((data) => {
        if (data.sessions) setSessions(data.sessions);
      })
      .catch((err) => console.error('[Security] Error fetching sessions:', err))
      .finally(() => setLoading(false));
  };

  const fetch2faStatus = () => {
    fetch('/api/sso/info')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.is2faEnabled === 'boolean') {
          setIs2faEnabled(data.is2faEnabled);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSessions();
    fetch2faStatus();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/login-activity/${sessionId}/invalidate`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('Session révoquée avec succès.');
        fetchSessions();
        setTimeout(() => setActionMessage(null), 3000);
      }
    } catch {
      alert('Impossible de révoquer la session');
    }
  };

  const handleOpen2faModal = async () => {
    setTwoFaError(null);
    setTwoFaCode('');
    setTwoFaLoading(true);
    setShow2faModal(true);
    try {
      const res = await fetch('/api/account/2fa/generate-secret');
      const data = await res.json();
      if (data.secret && data.qrCodeUrl) {
        setTwoFaSecret(data.secret);
        setTwoFaQrUrl(data.qrCodeUrl);
      } else {
        setTwoFaError(data.error || 'Erreur lors de la génération du secret 2FA.');
      }
    } catch {
      setTwoFaError('Impossible de contacter le serveur 2FA.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleEnable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaCode.trim()) {
      setTwoFaError('Veuillez entrer le code à 6 chiffres généré par votre application.');
      return;
    }
    setTwoFaLoading(true);
    setTwoFaError(null);
    try {
      const res = await fetch('/api/account/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: twoFaSecret, code: twoFaCode.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIs2faEnabled(true);
        setShow2faModal(false);
        setActionMessage('Authentification à deux facteurs activée avec succès !');
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setTwoFaError(data.error || 'Code invalide. Vérifiez l’heure de votre appareil.');
      }
    } catch {
      setTwoFaError('Erreur de connexion au serveur.');
    } finally {
      setTwoFaLoading(false);
    }
  };

  const handleDisable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) {
      setDisableError('Veuillez renseigner votre mot de passe actuel.');
      return;
    }
    setDisableSubmitting(true);
    setDisableError(null);
    try {
      const res = await fetch('/api/account/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword }),
      });
      const data = await res.json();
      if (data.success) {
        setIs2faEnabled(false);
        setShowDisable2faModal(false);
        setDisablePassword('');
        setActionMessage('Authentification 2FA désactivée.');
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setDisableError(data.error || 'Mot de passe incorrect.');
      }
    } catch {
      setDisableError('Erreur de connexion.');
    } finally {
      setDisableSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPasswordSubmitting(true);
    setPasswordError(null);
    try {
      const res = await fetch('/api/security/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActionMessage('Mot de passe modifié avec succès.');
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setPasswordError(data.error || 'Impossible de mettre à jour le mot de passe.');
      }
    } catch {
      setPasswordError('Erreur de communication avec le serveur.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8 max-w-5xl mx-auto font-sans">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Shield className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Sécurité du Compte & Sessions Actives
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400">
          Surveillez les appareils connectés à votre compte marchand et révoquez les accès suspects.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {actionMessage}
        </div>
      )}

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-3 bento-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Mot de Passe Marchand</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Protégé (Bcrypt)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            Votre compte est protégé par un chiffrement fort. Vous pouvez mettre à jour votre mot de passe à tout moment.
          </p>
          <button
            onClick={() => {
              setPasswordError(null);
              setShowPasswordModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-transparent text-xs font-bold transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Modifier le mot de passe
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-3 bento-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Authentification à Deux Facteurs (2FA)</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              is2faEnabled 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
            }`}>
              {is2faEnabled ? 'Actif (TOTP)' : 'Recommandé'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            {is2faEnabled
              ? 'Votre compte est protégé par la double authentification TOTP (Google Authenticator).'
              : 'Sécurisez vos paiements et vos commandes COD en activant la vérification par application TOTP (Google Authenticator).'}
          </p>
          {is2faEnabled ? (
            <button
              onClick={() => {
                setDisableError(null);
                setDisablePassword('');
                setShowDisable2faModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" /> Désactiver la 2FA
            </button>
          ) : (
            <button
              onClick={handleOpen2faModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" /> Activer l'authentification 2FA
            </button>
          )}
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-slate-800/80 space-y-4 bento-card shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Appareils & Sessions Connectées</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Historique des connexions récentes avec localisation IP.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
            {sessions.length} session(s)
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">Chargement des sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">Aucune session active trouvée.</div>
          ) : (
            sessions.map((sess, idx) => (
              <div
                key={sess.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c0f12] border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-zinc-300 shrink-0">
                    {sess.os.toLowerCase().includes('mac') || sess.os.toLowerCase().includes('windows') ? (
                      <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {sess.browser} sur {sess.os}
                      </p>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Session Actuelle
                        </span>
                      )}
                      {sess.isRevoked && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Révoquée
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {sess.ipAddress}
                      </span>
                      <span>•</span>
                      <span>{sess.city}, {sess.country}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" /> {new Date(sess.lastActiveAt).toLocaleString('fr-MA')}
                      </span>
                    </p>
                  </div>
                </div>

                {!sess.isRevoked && idx !== 0 && (
                  <button
                    onClick={() => handleRevoke(sess.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/20 text-xs font-bold transition-colors shrink-0 self-end sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Révoquer l accès
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Modifier le mot de passe</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Nouveau mot de passe (min. 6 caractères)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {passwordSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Enregistrer le mot de passe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Enable Setup Modal */}
      {show2faModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Configurer Google Authenticator (2FA)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShow2faModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {twoFaError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{twoFaError}</span>
              </div>
            )}

            {twoFaLoading && !twoFaQrUrl ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                <span className="text-xs font-medium">Génération de la clé sécurisée...</span>
              </div>
            ) : (
              <form onSubmit={handleEnable2fa} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  1. Scannez ce QR Code avec votre application <strong>Google Authenticator</strong> ou <strong>Authy</strong> :
                </p>

                {twoFaQrUrl && (
                  <div className="flex justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-xs max-w-[200px] mx-auto">
                    <img src={twoFaQrUrl} alt="2FA QR Code" className="w-44 h-44 object-contain" />
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-500 block">
                    Ou saisissez manuellement la clé secrète :
                  </span>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200">
                    <span className="truncate flex-1 tracking-wider">{twoFaSecret}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(twoFaSecret)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      title="Copier la clé"
                    >
                      {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    2. Entrez le code à 6 chiffres affiché sur votre application :
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-3 py-2 text-center tracking-widest text-base font-mono font-bold rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShow2faModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={twoFaLoading}
                    className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {twoFaLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Activer la 2FA</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2FA Disable Modal */}
      {showDisable2faModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#13171c] border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Désactiver la double authentification</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDisable2faModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {disableError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{disableError}</span>
              </div>
            )}

            <form onSubmit={handleDisable2fa} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Pour désactiver la 2FA, confirmez votre mot de passe administrateur :
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  required
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisable2faModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={disableSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {disableSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirmer la désactivation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
