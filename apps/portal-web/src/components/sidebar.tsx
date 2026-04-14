'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, CheckSquare, FileText, FolderOpen, GitBranch, Layout,
  Users, Settings, ChevronLeft, ChevronRight, Columns3
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Central de Tarefas', href: '/tasks', icon: CheckSquare },
  { label: 'Solicitações', href: '/requests', icon: FileText },
  { label: 'Documentos', href: '/documents', icon: FolderOpen },
  { label: 'Processos', href: '/processes', icon: GitBranch },
  { label: 'Kanban', href: '/kanban', icon: Columns3 },
  { label: 'Portais', href: '/portals', icon: Layout },
  { label: 'Comunidades', href: '/communities', icon: Users },
  { label: 'Administração', href: '/admin', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-200 z-30 flex flex-col ${
        collapsed ? 'w-[60px]' : 'w-[220px]'
      }`}
    >
      <div className="h-14 flex items-center px-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">W</span>
        </div>
        {!collapsed && <span className="ml-3 font-semibold text-gray-800 text-sm">Workestra</span>}
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center mx-2 my-0.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mb-3 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
