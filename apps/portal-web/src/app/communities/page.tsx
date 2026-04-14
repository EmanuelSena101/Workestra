'use client';

import React from 'react';
import { Users, Plus, MessageSquare, FileText, Calendar } from 'lucide-react';

const communities = [
  {
    id: 'c1',
    name: 'Tecnologia & Inovação',
    description: 'Discussões sobre novas tecnologias, ferramentas e práticas de desenvolvimento.',
    members: 45,
    posts: 128,
    lastActivity: '14/04/2024',
  },
  {
    id: 'c2',
    name: 'Gestão de Projetos',
    description: 'Compartilhamento de metodologias, templates e boas práticas de gestão.',
    members: 32,
    posts: 87,
    lastActivity: '13/04/2024',
  },
  {
    id: 'c3',
    name: 'Qualidade & Compliance',
    description: 'Normas, auditorias, certificações e procedimentos de qualidade.',
    members: 28,
    posts: 56,
    lastActivity: '12/04/2024',
  },
  {
    id: 'c4',
    name: 'Integração de Novos Colaboradores',
    description: 'Espaço para novos membros da equipe tirarem dúvidas e se ambientarem.',
    members: 15,
    posts: 34,
    lastActivity: '11/04/2024',
  },
];

export default function CommunitiesPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-header__title">Comunidades</h1>
          <p className="page-header__subtitle">
            Participe de comunidades internas para colaboração e troca de conhecimento.
          </p>
        </div>
        <button className="topbar__new-request-btn">
          <Plus size={16} />
          Nova Comunidade
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {communities.map((community) => (
          <div className="card" key={community.id} style={{ cursor: 'pointer' }}>
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
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{community.name}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
                {community.description}
              </p>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={13} /> {community.members} membros
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MessageSquare size={13} /> {community.posts} posts
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} /> {community.lastActivity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
