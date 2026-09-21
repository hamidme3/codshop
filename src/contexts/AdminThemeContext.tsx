'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminThemeMode = 'light' | 'dark';

interface AdminThemeContextType {
  mode: AdminThemeMode;
  setMode: (mode: AdminThemeMode) => void;
  toggleMode: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  mode: 'light',
  setMode: () => {},
  toggleMode: () => {},
});

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AdminThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  const applyThemeToDOM = (themeMode: AdminThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-admin-theme', themeMode);
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    try {
      let meta = document.querySelector('meta[name="color-scheme"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'color-scheme');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', themeMode === 'dark' ? 'dark' : 'light');
    } catch {}
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('codshop_admin_theme') as AdminThemeMode;
    const initialMode: AdminThemeMode = (saved === 'dark' || saved === 'light') ? saved : 'light';
    setModeState(initialMode);
    applyThemeToDOM(initialMode);
  }, []);

  const setMode = (newMode: AdminThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('codshop_admin_theme', newMode);
      applyThemeToDOM(newMode);
    } catch {}
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <AdminThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      <div data-admin-theme={mode} className={mode === 'dark' ? 'dark' : 'light'}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}
