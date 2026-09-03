'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { MessageCircle, ShieldCheck, ShoppingBag } from 'lucide-react';

export function Navbar() {
  const { theme, lang } = useTheme();

  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur sticky top-8 z-40">
      {/* Top Moroccan Promo Ticker */}
      <div className="bg-zinc-900 text-white text-[11px] py-1.5 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>🇲🇦</span>
          <span>
            {lang === 'ar'
              ? 'توصيل سريع مجاني للطلبات فوق 400 درهم • الدفع نقداً عند الاستلام مع إمكانية المعاينة قبل الأداء'
              : 'Livraison Rapide Gratuite dès 400 DH • Paiement Cash à la Livraison après vérification de votre colis'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Store Name */}
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {theme.id === 'luxury' ? 'O' : theme.id === 'beauty' ? 'B' : 'T'}
          </div>
          <div>
            <div className="font-black tracking-tight text-base sm:text-lg text-zinc-900 group-hover:text-emerald-700 transition">
              {theme.id === 'luxury' ? 'OTTAVIO' : theme.id === 'beauty' ? 'BIO BOTANIQUE' : 'TECHNOVO'}
            </div>
            <div className="text-[10px] text-zinc-400 -mt-1 font-medium tracking-wide">
              {theme.name}
            </div>
          </div>
        </a>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/212661000000?text=Salam,%20j'ai%20une%20question%20sur%20vos%20produits"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Assistance WhatsApp</span>
          </a>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-100 px-2.5 py-1.5 rounded-lg font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Garantie Qualité 100%</span>
          </div>
        </div>
      </div>
    </header>
  );
}
