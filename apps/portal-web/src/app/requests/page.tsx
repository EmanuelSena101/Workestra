'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  ChevronRight,
  Calendar,
  User,
  Clock,
} from 'lucide-react';

const requests = [
  {
    id: 'SOL-2024-1234',
    title: 'Compra de equipamentos TI',
    process: 'Aprovação de Compras',
    requester: 'Maria Santos',
    status: 'in_progress' as const,
    currentStep: 'Aprovação Diretoria',
    createdAt: '14/04/2024 10:30',
    updatedAt: '14/04/2024 11:00',
  },
  {
    id: 'SOL-2024-1233',
    title: 'Solicitação de acesso VPN',
    process: 'Gestão de Acessos',
    requester: 'Carlos Oliveira',
    status: 'completed' as const,
    currentStep: 'Finalizado',
    createdAt: '13/04/2024 14:20',
    updatedAt: '14/04/2024 09:00',
  },
  {
    id: 'SOL-2024-1232',
    title: 'Reserva de sala de reunião - Auditório',
    process: 'Reserva de Espaços',
    requester: 'Ana Pereira',
    status: 'pending' as const,
    currentStep: 'Aguardando Aprovação',
    createdAt: '13/04/2024 09:15',
    updatedAt: '13/04/2024 09:15',
  },
  {
    id: 'SOL-2024-1231',
    title: 'Reembolso de despesas de viagem',
    process: 'Reembolso de Despesas',
    requester: 'Pedro Almeida',
    status: 'in_progress' as const,
    currentStep: 'Análise Financeira',
    createdAt: '12/04/2024 16:45',
    updatedAt: '13/04/2024 14:00',
  },
  {
    id: 'SOL-2024-1230',
    title: 'Cadastro de novo fornecedor - XYZ Corp',
    process: 'Cadastro de Fornecedores',
    requester: 'Lucia Ferreira',
    status: 'in_progress' as const,
    currentStep: 'Validação Documental',
    createdAt: '12/04/2024 11:00',
    updatedAt: '13/04/2024 16:30',
  },
  {
    id: 'SOL-2024-1229',
    title: 'Solicitação de férias - Maio 2024',
    process: 'Gestão de Férias',
    requester: 'Roberto Lima',
    status: 'cancelled' as const,
    currentStep: 'Cancelado pelo solicitante',
    createdAt: '11/04/2024 08:30',
    updatedAt: '12/04/2024 10:00',
  },
  {
    id: 'SOL-2024-1228',
    title: 'Contratação de serviço de consultoria',
    process: 'Gestão Contratual',
    requester: 'Fernanda Costa',
    status: 'completed' as const,
    currentStep: 'Finalizado',
    createdAt: '10/04/2024 09:00',
    updatedAt: '13/04/2024 17:00',
  },
];

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  open: 'Aberta',
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

export default function RequestsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (
      searchQuery &&
      !req.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !req.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-header__title">Solicitações</h1>
          <p className="page-header__subtitle">
            Acompanhe suas solicitações e inicie novos pedidos.
          </p>
        </div>
        <button className="topbar__new-request-btn">
          <Plus size={16} />
          Nova Solicitação
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${statusFilter === 'all' ? 'tab--active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          Todas ({requests.length})
        </button>
        <button
          className={`tab ${statusFilter === 'in_progress' ? 'tab--active' : ''}`}
          onClick={() => setStatusFilter('in_progress')}
        >
          Em andamento ({requests.filter((r) => r.status === 'in_progress').length})
        </button>
        <button
          className={`tab ${statusFilter === 'pending' ? 'tab--active' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          Pendentes ({requests.filter((r) => r.status === 'pending').length})
        </button>
        <button
          className={`tab ${statusFilter === 'completed' ? 'tab--active' : ''}`}
          onClick={() => setStatusFilter('completed')}
        >
          Concluídas ({requests.filter((r) => r.status === 'completed').length})
        </button>
      </div>

      {/* Search */}
      <div className="filters-bar">
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            className="filter-search"
            placeholder="Buscar solicitações..."
            style={{ paddingLeft: 32 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Request Cards */}
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Solicitação</th>
              <th>Processo</th>
              <th>Solicitante</th>
              <th>Etapa Atual</th>
              <th>Status</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ fontWeight: 500 }}>{req.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {req.id}
                  </div>
                </td>
                <td style={{ fontSize: 13 }}>{req.process}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <User size={14} />
                    {req.requester}
                  </div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {req.currentStep}
                </td>
                <td>
                  <span className={`badge badge--${req.status}`}>
                    {statusLabels[req.status]}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {req.createdAt}
                    </div>
                  </div>
                </td>
                <td>
                  <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
