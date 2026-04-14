'use client';

import React, { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Database,
  Bell,
  Globe,
  GitBranch,
  Key,
  Mail,
  Server,
  Activity,
  FileText,
  ChevronRight,
} from 'lucide-react';

const adminSections = [
  {
    id: 'users',
    title: 'Usuários',
    description: 'Gerenciar usuários, papéis e permissões da plataforma.',
    icon: <Users size={24} />,
    items: [
      { label: 'Usuários', count: 156 },
      { label: 'Grupos', count: 12 },
      { label: 'Papéis', count: 8 },
    ],
  },
  {
    id: 'permissions',
    title: 'Permissões',
    description: 'Configurar políticas de acesso e controle funcional.',
    icon: <Shield size={24} />,
    items: [
      { label: 'Políticas de Acesso', count: 15 },
      { label: 'Perfis Funcionais', count: 6 },
    ],
  },
  {
    id: 'workflows',
    title: 'Processos & Workflows',
    description: 'Administrar definições de processos e deploy de workflows.',
    icon: <GitBranch size={24} />,
    items: [
      { label: 'Processos Ativos', count: 5 },
      { label: 'Rascunhos', count: 1 },
    ],
  },
  {
    id: 'datasets',
    title: 'Datasets & Integrações',
    description: 'Configurar fontes de dados, integrações REST/SOAP/SQL e ERPs.',
    icon: <Database size={24} />,
    items: [
      { label: 'Datasets', count: 14 },
      { label: 'Integrações', count: 5 },
      { label: 'Conexões', count: 3 },
    ],
  },
  {
    id: 'notifications',
    title: 'Notificações',
    description: 'Configurar regras de notificação, templates de e-mail e alertas.',
    icon: <Bell size={24} />,
    items: [
      { label: 'Templates', count: 12 },
      { label: 'Regras', count: 8 },
    ],
  },
  {
    id: 'identity',
    title: 'Identidade & SSO',
    description: 'Configurações de autenticação, Keycloak e provedores externos.',
    icon: <Key size={24} />,
    items: [
      { label: 'Realm', count: 1 },
      { label: 'Provedores', count: 2 },
    ],
  },
  {
    id: 'email',
    title: 'E-mail',
    description: 'Configurar servidor SMTP, templates e filas de envio.',
    icon: <Mail size={24} />,
    items: [
      { label: 'Servidores SMTP', count: 1 },
      { label: 'Templates', count: 12 },
    ],
  },
  {
    id: 'storage',
    title: 'Armazenamento',
    description: 'Gerenciar storage, buckets e políticas de retenção.',
    icon: <Server size={24} />,
    items: [
      { label: 'Buckets', count: 3 },
      { label: 'Uso Total', count: '12.4 GB' as unknown as number },
    ],
  },
  {
    id: 'audit',
    title: 'Auditoria',
    description: 'Consultar logs de auditoria e histórico de ações.',
    icon: <Activity size={24} />,
    items: [
      { label: 'Registros (30d)', count: 4521 },
    ],
  },
  {
    id: 'forms',
    title: 'Formulários',
    description: 'Gerenciar definições de formulários e campos dinâmicos.',
    icon: <FileText size={24} />,
    items: [
      { label: 'Formulários', count: 18 },
      { label: 'Campos Custom', count: 42 },
    ],
  },
];

export default function AdminPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Administração</h1>
        <p className="page-header__subtitle">
          Configurações gerais da plataforma, usuários, integrações e segurança.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {adminSections.map((section) => (
          <div className="card" key={section.id} style={{ cursor: 'pointer' }}>
            <div className="card__body">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(0, 128, 208, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-info)',
                    flexShrink: 0,
                  }}
                >
                  {section.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                      {section.title}
                    </div>
                    <ChevronRight size={18} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
                    {section.description}
                  </p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '4px 10px',
                          background: 'var(--color-surface-alt)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: 12,
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {item.count}
                        </span>{' '}
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
