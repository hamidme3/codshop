'use client';

import React, { useState } from 'react';
import { Sparkles, Gift, Award, CheckCircle2, Trophy, X } from 'lucide-react';

interface Prize {
  id: string;
  label: string;
  type: string;
  value: number;
  color: string;
}

export default function LuckyWheelWidget() {
  const [modalOpen, setModalOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  const prizes: Prize[] = [
    { id: '1', label: '100 DH Crédit Pub TikTok', type: 'ad', value: 100, color: '#f43f5e' },
    { id: '2', label: '5 Colis Livraison Ozon Offerts', type: 'shipping', value: 125, color: '#059669' },
    { id: '3', label: '-50% sur l’Abonnement Scale', type: 'discount', value: 50, color: '#2563eb' },
    { id: '4', label: 'Audit Gratuit Tunnel par un Expert', type: 'coaching', value: 500, color: '#c59b27' },
    { id: '5', label: 'Badge Marchand Vérifié VIP', type: 'badge', value: 0, color: '#8b5cf6' },
    { id: '6', label: 'Pack 5 Thèmes Débloqués', type: 'themes', value: 250, color: '#d97706' },
  ];

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setWonPrize(null);

    try {
      const res = await fetch('/api/events/last-friday/spin', { method: 'POST' });
      const data = await res.json();

      const prizeIdx = data.prizeIndex ?? Math.floor(Math.random() * prizes.length);
      const segmentDegrees = 360 / prizes.length;
      // Calculate target angle to land on chosen prize (plus 5 full spins = 1800deg)
      const targetRotation = rotation + 1800 + (360 - (prizeIdx * segmentDegrees + segmentDegrees / 2));
      setRotation(targetRotation);

      setTimeout(() => {
        setWonPrize(data.prize || prizes[prizeIdx]);
        setSpinning(false);
      }, 3500);
    } catch {
      setSpinning(false);
    }
  };

  return (
    <>
      {/* Banner in admin dashboard */}
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shrink-0">
            🎡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Événement Exclusif Marchand</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 animate-pulse">
                Gratuit
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">Roue de la Récompense CODShop Maroc</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Faites tourner la roue pour remporter crédits publicitaires, livraisons gratuites et réductions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/10 transition shrink-0 flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" />
          <span>Tourner la Roue</span>
        </button>
      </div>

      {/* Interactive Spin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative space-y-5">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Roue de la Fortune</span>
              </div>
              <h3 className="text-xl font-bold text-white">Tentez Votre Chance !</h3>
              <p className="text-xs text-slate-400 mt-1">
                Gagnez instantanément des avantages pour accélérer votre boutique COD.
              </p>
            </div>

            {/* The Visual Spinning Wheel */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              {/* Pointer Arrow */}
              <div className="absolute -top-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 filter drop-shadow" />

              {/* Wheel Disk */}
              <div
                className="w-56 h-56 rounded-full border-4 border-amber-500/40 shadow-2xl relative overflow-hidden transition-transform duration-[3500ms] ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(#f43f5e 0deg 60deg, #059669 60deg 120deg, #2563eb 120deg 180deg, #c59b27 180deg 240deg, #8b5cf6 240deg 300deg, #d97706 300deg 360deg)',
                }}
              >
                {/* Center Hub */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-xs font-black text-amber-400 shadow-inner z-10">
                  COD
                </div>
              </div>
            </div>

            {/* Won Prize Banner */}
            {wonPrize && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1 animate-in zoom-in-95 duration-200">
                <Trophy className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="font-bold text-sm text-white">Félicitations !</div>
                <div className="text-xs font-semibold text-emerald-300">{wonPrize.label}</div>
                <div className="text-[11px] text-slate-400">Ce bonus a été crédité à votre compte marchand.</div>
              </div>
            )}

            {/* Spin CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={spinning}
                onClick={handleSpin}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg transition"
              >
                {spinning ? 'La roue tourne...' : 'Lancer la Roue !'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
