'use client';

import React from 'react';
import { Layout, Plus, Globe, Eye, Settings } from 'lucide-react';

const portals = [
  {
    id: 'p1',
    name: 'Portal Corporativo',
    description: 'Portal principal da organização com comunicados, indicadores e atalhos.',
    status: 'published',
    pages: 8,
    lastModified: '14/04/2024',
  },
  {
    id: 'p2',
    name: 'Portal RH',
    description: 'Portal de recursos humanos com informações de benefícios, férias e políticas.',
    status: 'published',
    pages: 12,
    lastModified: '12/04/2024',
  },
  {
    id: 'p3',
    name: 'Portal TI',
    description: 'Portal de tecnologia com base de conhecimento e solicitações de suporte.',
    status: 'draft',
    pages: 5,
    lastModified: '10/04/2024',
  },
  {
    id: 'p4',
    name: 'Portal Financeiro',
    description: 'Dashboards financeiros e relatórios gerenciais.',
    status: 'published',
    pages: 6,
    lastModified: '08/04/2024',
  },
];

export default function PortalsPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-header__title">Portais</h1>
          <p className="page-header__subtitle">
            Gerencie portais internos, páginas e widgets da organização.
          </p>
        </div>
        <button className="topbar__new-request-btn">
          <Plus size={16} />
          Novo Portal
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {portals.map((portal) => (
          <div className="card" key={portal.id}>
            <div className="card__body">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(0, 128, 208, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-info)',
                    flexShrink: 0,
                  }}
                >
                  <Layout size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{portal.name}</div>
                  <span className={`badge badge--${portal.status === 'published' ? 'completed' : 'pending'}`}>
                    {portal.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
                {portal.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--color-text-muted)' }}>
                <span>{portal.pages} páginas</span>
                <span>Modificado em {portal.lastModified}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid var(--color-border-soft)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Eye size={14} /> Visualizar
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid var(--color-border-soft)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface)',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Settings size={14} /> Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
