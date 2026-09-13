'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Laptop, Globe, Clock, CheckCircle2, AlertTriangle, Trash2, Key } from 'lucide-react';

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

  const fetchSessions = () => {
    fetch('/api/login-activity')
      .then((res) => res.json())
      .then((data) => {
        if (data.sessions) setSessions(data.sessions);
      })
      .catch((err) => console.error('[Security] Error fetching sessions:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
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

  return (
    <div className="p-4 sm:p-6 md:p-10 space-y-8 max-w-5xl mx-auto font-sans">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Shield className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sécurité du Compte & Sessions Actives
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          Surveillez les appareils connectés à votre compte marchand et révoquez les accès suspects.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {actionMessage}
        </div>
      )}

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200">Mot de Passe Marchand</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Protégé (Bcrypt)
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Votre compte est protégé par un chiffrement fort. Vous pouvez mettre à jour votre mot de passe à tout moment.
          </p>
          <button
            onClick={() => alert('Formulaire de mise à jour du mot de passe (Phase 2).')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" /> Modifier le mot de passe
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#121215] border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200">Authentification à Deux Facteurs (2FA)</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Recommandé
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Sécurisez vos paiements et vos commandes COD en activant la vérification par application TOTP (Google Authenticator).
          </p>
          <button
            onClick={() => alert('Module 2FA TOTP QR Code (Phase 2).')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
          >
            <Shield className="w-3.5 h-3.5" /> Activer l authentification 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions List */}
      <div className="p-6 rounded-3xl bg-[#121215] border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Appareils & Sessions Connectées</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Historique des connexions récentes avec localisation IP.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {sessions.length} session(s)
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500">Chargement des sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">Aucune session active trouvée.</div>
          ) : (
            sessions.map((sess, idx) => (
              <div
                key={sess.id}
                className="p-4 rounded-2xl bg-[#09090b] border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                    {sess.os.toLowerCase().includes('mac') || sess.os.toLowerCase().includes('windows') ? (
                      <Laptop className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Smartphone className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">
                        {sess.browser} sur {sess.os}
                      </p>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Session Actuelle
                        </span>
                      )}
                      {sess.isRevoked && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Révoquée
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Globe className="w-3 h-3 text-slate-500" /> {sess.ipAddress}
                      </span>
                      <span>•</span>
                      <span>{sess.city}, {sess.country}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" /> {new Date(sess.lastActiveAt).toLocaleString('fr-MA')}
                      </span>
                    </p>
                  </div>
                </div>

                {!sess.isRevoked && idx !== 0 && (
                  <button
                    onClick={() => handleRevoke(sess.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-colors shrink-0 self-end sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Révoquer l accès
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
