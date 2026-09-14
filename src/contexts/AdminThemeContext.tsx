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

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('codshop_admin_theme') as AdminThemeMode;
    if (saved === 'dark' || saved === 'light') {
      setModeState(saved);
      document.documentElement.setAttribute('data-admin-theme', saved);
    } else {
      // Default to Shopify Polaris light mode
      setModeState('light');
      document.documentElement.setAttribute('data-admin-theme', 'light');
    }
  }, []);

  const setMode = (newMode: AdminThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem('codshop_admin_theme', newMode);
      document.documentElement.setAttribute('data-admin-theme', newMode);
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
