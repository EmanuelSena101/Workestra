'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface ShellContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <ShellContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        activePage,
        setActivePage,
        notificationsOpen,
        setNotificationsOpen,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
}
