'use client';

import React from 'react';
import {
  GitBranch,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  Settings,
  Eye,
  BarChart3,
} from 'lucide-react';

const processes = [
  {
    id: 'proc-1',
    key: 'approval-purchase',
    name: 'Aprovação de Compras',
    category: 'Financeiro',
    version: 3,
    activeInstances: 12,
    completedInstances: 245,
    avgDuration: '2.3 dias',
    status: 'active' as const,
    lastDeployed: '10/04/2024',
  },
  {
    id: 'proc-2',
    key: 'employee-onboarding',
    name: 'Onboarding de Colaboradores',
    category: 'RH',
    version: 5,
    activeInstances: 4,
    completedInstances: 89,
    avgDuration: '5.1 dias',
    status: 'active' as const,
    lastDeployed: '08/04/2024',
  },
  {
    id: 'proc-3',
    key: 'document-review',
    name: 'Revisão Documental',
    category: 'Qualidade',
    version: 2,
    activeInstances: 7,
    completedInstances: 156,
    avgDuration: '1.8 dias',
    status: 'active' as const,
    lastDeployed: '12/04/2024',
  },
  {
    id: 'proc-4',
    key: 'vendor-registration',
    name: 'Cadastro de Fornecedores',
    category: 'Compras',
    version: 4,
    activeInstances: 3,
    completedInstances: 67,
    avgDuration: '3.5 dias',
    status: 'active' as const,
    lastDeployed: '05/04/2024',
  },
  {
    id: 'proc-5',
    key: 'vacation-request',
    name: 'Gestão de Férias',
    category: 'RH',
    version: 2,
    activeInstances: 8,
    completedInstances: 312,
    avgDuration: '1.2 dias',
    status: 'active' as const,
    lastDeployed: '01/04/2024',
  },
  {
    id: 'proc-6',
    key: 'expense-reimbursement',
    name: 'Reembolso de Despesas',
    category: 'Financeiro',
    version: 1,
    activeInstances: 0,
    completedInstances: 0,
    avgDuration: '—',
    status: 'draft' as const,
    lastDeployed: '—',
  },
];

export default function ProcessesPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-header__title">Processos</h1>
          <p className="page-header__subtitle">
            Gerencie definições de processos, monitore instâncias e visualize indicadores.
          </p>
        </div>
        <button className="topbar__new-request-btn">
          <Plus size={16} />
          Novo Processo
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <GitBranch size={22} />
          </div>
          <div>
            <div className="stat-card__value">{processes.length}</div>
            <div className="stat-card__label">Processos Cadastrados</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">
            <Play size={22} />
          </div>
          <div>
            <div className="stat-card__value">
              {processes.reduce((sum, p) => sum + p.activeInstances, 0)}
            </div>
            <div className="stat-card__label">Instâncias Ativas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="stat-card__value">
              {processes.reduce((sum, p) => sum + p.completedInstances, 0)}
            </div>
            <div className="stat-card__label">Instâncias Concluídas</div>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Definições de Processos</h2>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              className="filter-search"
              placeholder="Buscar processos..."
              style={{ paddingLeft: 32 }}
            />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Processo</th>
              <th>Categoria</th>
              <th>Versão</th>
              <th>Ativas</th>
              <th>Concluídas</th>
              <th>Tempo Médio</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc) => (
              <tr key={proc.id} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(0, 128, 208, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-info)',
                      }}
                    >
                      <GitBranch size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{proc.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{proc.key}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13 }}>{proc.category}</td>
                <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>v{proc.version}</td>
                <td style={{ fontSize: 13, fontWeight: 600, color: proc.activeInstances > 0 ? 'var(--color-info)' : 'var(--color-text-muted)' }}>
                  {proc.activeInstances}
                </td>
                <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {proc.completedInstances}
                </td>
                <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {proc.avgDuration}
                </td>
                <td>
                  <span className={`badge badge--${proc.status === 'active' ? 'completed' : 'pending'}`}>
                    {proc.status === 'active' ? 'Ativo' : 'Rascunho'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="topbar__action-btn" title="Visualizar">
                      <Eye size={16} />
                    </button>
                    <button className="topbar__action-btn" title="Indicadores">
                      <BarChart3 size={16} />
                    </button>
                    <button className="topbar__action-btn" title="Configurar">
                      <Settings size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
