'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Plus, Bell, HelpCircle } from 'lucide-react';
import { useShell } from '@/hooks/use-shell';

const pageTitles: Record<string, string> = {
  '/': 'Home',
  '/tasks': 'Central de Tarefas',
  '/requests': 'Solicitações',
  '/documents': 'Documentos',
  '/processes': 'Processos',
  '/portals': 'Portais',
  '/communities': 'Comunidades',
  '/admin': 'Administração',
};

export function Topbar() {
  const pathname = usePathname();
  const { toggleSidebar, notificationsOpen, setNotificationsOpen } = useShell();

  const currentTitle = pageTitles[pathname] || 'Workestra';

  return (
    <div className="topbar">
      <button className="topbar__toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>

      <div className="topbar__breadcrumb">
        <span>Workestra</span>
        <span>/</span>
        <span className="topbar__breadcrumb-current">{currentTitle}</span>
      </div>

      <div className="topbar__spacer" />

      <div className="topbar__search">
        <Search size={16} className="topbar__search-icon" />
        <input
          type="text"
          className="topbar__search-input"
          placeholder="Buscar documentos, tarefas, processos..."
        />
      </div>

      <button className="topbar__new-request-btn">
        <Plus size={16} />
        Nova solicitação
      </button>

      <div className="topbar__actions">
        <button
          className="topbar__action-btn"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="badge" />
        </button>

        <button className="topbar__action-btn" aria-label="Ajuda">
          <HelpCircle size={20} />
        </button>

        <div className="topbar__avatar" title="Usuário">
          US
        </div>
      </div>
    </div>
  );
}
