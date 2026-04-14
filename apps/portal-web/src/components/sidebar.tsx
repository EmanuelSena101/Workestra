'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CheckSquare,
  FileText,
  FolderOpen,
  GitBranch,
  Layout,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useShell } from '@/hooks/use-shell';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} />, href: '/' },
  {
    id: 'tasks',
    label: 'Central de Tarefas',
    icon: <CheckSquare size={20} />,
    href: '/tasks',
    badge: 12,
  },
  {
    id: 'requests',
    label: 'Solicitações',
    icon: <FileText size={20} />,
    href: '/requests',
  },
  {
    id: 'documents',
    label: 'Documentos',
    icon: <FolderOpen size={20} />,
    href: '/documents',
  },
  {
    id: 'processes',
    label: 'Processos',
    icon: <GitBranch size={20} />,
    href: '/processes',
    section: 'Gestão',
  },
  {
    id: 'portals',
    label: 'Portais',
    icon: <Layout size={20} />,
    href: '/portals',
  },
  {
    id: 'communities',
    label: 'Comunidades',
    icon: <Users size={20} />,
    href: '/communities',
  },
  {
    id: 'admin',
    label: 'Administração',
    icon: <Settings size={20} />,
    href: '/admin',
    section: 'Sistema',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useShell();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  let lastSection: string | undefined;

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">W</div>
        {!sidebarCollapsed && <span className="sidebar__logo-text">Workestra</span>}
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <React.Fragment key={item.id}>
              {showSection && !sidebarCollapsed && (
                <div className="sidebar__section-label">{item.section}</div>
              )}
              <Link
                href={item.href}
                className={`sidebar__nav-item ${isActive(item.href) ? 'sidebar__nav-item--active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="sidebar__nav-label">{item.label}</span>
                    {item.badge && <span className="sidebar__nav-badge">{item.badge}</span>}
                  </>
                )}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <button
          className="sidebar__nav-item"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <span className="sidebar__nav-icon">
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </span>
          {!sidebarCollapsed && <span className="sidebar__nav-label">Recolher</span>}
        </button>
      </div>
    </div>
  );
}
