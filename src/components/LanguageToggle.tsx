'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageToggleProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export default function LanguageToggle({ currentLang, onLanguageChange }: LanguageToggleProps) {
  const context = useLanguage();
  const lang = currentLang || context.language;
  const setLang = onLanguageChange || context.setLanguage;

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'عربي' },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
      <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5 shrink-0" />
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLang(item.code)}
          className={`px-2 py-1 rounded-lg transition-colors ${
            lang === item.code
              ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
