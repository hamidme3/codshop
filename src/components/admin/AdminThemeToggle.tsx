'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

export default function AdminThemeToggle() {
  const { mode, toggleMode } = useAdminTheme();
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={isDark ? 'Passer au mode clair' : 'Passer au mode sombre'}
      title={isDark ? 'Mode Clair (Shopify Polaris)' : 'Mode Sombre (Stripe)'}
      className="p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center border text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border-slate-200 shadow-xs dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-zinc-300 dark:hover:text-white"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500 transition-transform rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
