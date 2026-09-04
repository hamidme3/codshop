'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Smartphone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PhoneLoginPage() {
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/sso/auth/phone-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Erreur lors de l envoi du code');
        setLoading(false);
        return;
      }

      setPhone(data.phone);
      if (data.devOtp) {
        setDevOtp(data.devOtp);
        setCode(data.devOtp); // auto-fill for testing ease
      }
      setStep('verify');
    } catch {
      setError('Impossible de joindre le serveur SMS');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/sso/auth/phone-number/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Code SMS incorrect');
        setLoading(false);
        return;
      }

      window.location.href = data.redirect || '/admin';
    } catch {
      setError('Erreur lors de la vérification');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/admin/login" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              C
            </div>
            <span className="font-black text-xl tracking-tight text-white">CODShop</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Connexion Express par SMS 🇲🇦
          </h1>
          <p className="text-xs text-slate-400">
            Accédez à votre boutique COD sans mot de passe grâce à votre numéro marocain
          </p>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Numéro de téléphone marocain</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-slate-400 font-mono pointer-events-none">
                    <span>🇲🇦</span> +212
                  </span>
                  <input
                    type="tel"
                    placeholder="6 61 23 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-20 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white font-mono text-sm outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Opérateurs supportés : Maroc Telecom, Orange, Inwi</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-500/10"
              >
                {loading ? 'Envoi du code...' : (
                  <>Recevoir le code de vérification <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Code de vérification (6 chiffres)</label>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Changer de numéro
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Code envoyé au <strong className="text-white font-mono">{phone}</strong>
                </p>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full text-center tracking-[0.4em] py-3.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-amber-400 font-mono text-xl font-black outline-none transition-all"
                />

                {devOtp && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono flex items-center justify-between">
                    <span>Code Simulator : <strong>{devOtp}</strong></span>
                    <span className="text-[10px] text-slate-500">Auto-rempli ✓</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-500/10"
              >
                {loading ? 'Vérification...' : 'Confirmer et se connecter'}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <Link
              href="/admin/login"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Vous avez un compte avec mot de passe ? <strong className="text-amber-400">Se connecter</strong>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
