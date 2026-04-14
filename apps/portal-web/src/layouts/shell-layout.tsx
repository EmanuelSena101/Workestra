'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { ShellProvider, useShell } from '@/hooks/use-shell';

function ShellContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useShell();

  return (
    <div className="shell">
      <div
        className={`shell__sidebar ${sidebarCollapsed ? 'shell__sidebar--collapsed' : ''}`}
      >
        <Sidebar />
      </div>
      <div className="shell__main">
        <div className="shell__topbar">
          <Topbar />
        </div>
        <div className="shell__content">{children}</div>
      </div>
    </div>
  );
}

export function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <ShellContent>{children}</ShellContent>
    </ShellProvider>
  );
}
