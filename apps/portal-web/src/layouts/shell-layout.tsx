'use client';

import React from 'react';
import { Sidebar } from '../components/sidebar';
import { Topbar } from '../components/topbar';

export function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-[220px] transition-all duration-200">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
