'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Filter,
  Search,
  ChevronRight,
  AlertTriangle,
  User,
  Calendar,
} from 'lucide-react';

const tasks = [
  {
    id: 'TSK-001',
    title: 'Aprovar solicitação de compra #1234',
    process: 'Aprovação de Compras',
    step: 'Aprovação Gerencial',
    assignee: 'Você',
    priority: 'high' as const,
    status: 'pending' as const,
    dueDate: '14/04/2024 14:00',
    sla: 85,
    createdAt: '13/04/2024 10:30',
  },
  {
    id: 'TSK-002',
    title: 'Revisar documento técnico v3.2',
    process: 'Revisão Documental',
    step: 'Revisão Técnica',
    assignee: 'Você',
    priority: 'medium' as const,
    status: 'in_progress' as const,
    dueDate: '15/04/2024 18:00',
    sla: 45,
    createdAt: '12/04/2024 14:00',
  },
  {
    id: 'TSK-003',
    title: 'Validar dados do fornecedor - ABC Ltda',
    process: 'Cadastro de Fornecedores',
    step: 'Validação de Dados',
    assignee: 'Você',
    priority: 'low' as const,
    status: 'pending' as const,
    dueDate: '17/04/2024 12:00',
    sla: 20,
    createdAt: '11/04/2024 09:00',
  },
  {
    id: 'TSK-004',
    title: 'Aprovar férias - João Silva',
    process: 'Gestão de Férias',
    step: 'Aprovação RH',
    assignee: 'Você',
    priority: 'critical' as const,
    status: 'overdue' as const,
    dueDate: '13/04/2024 18:00',
    sla: 110,
    createdAt: '10/04/2024 08:00',
  },
  {
    id: 'TSK-005',
    title: 'Revisar contrato de prestação de serviços',
    process: 'Gestão Contratual',
    step: 'Revisão Jurídica',
    assignee: 'Você',
    priority: 'high' as const,
    status: 'pending' as const,
    dueDate: '14/04/2024 17:00',
    sla: 72,
    createdAt: '12/04/2024 11:00',
  },
  {
    id: 'TSK-006',
    title: 'Analisar requisição de headcount',
    process: 'Gestão de Vagas',
    step: 'Análise Orçamentária',
    assignee: 'Você',
    priority: 'medium' as const,
    status: 'pending' as const,
    dueDate: '16/04/2024 12:00',
    sla: 30,
    createdAt: '13/04/2024 15:00',
  },
  {
    id: 'TSK-007',
    title: 'Homologar ambiente de testes',
    process: 'Deploy de Sistemas',
    step: 'Homologação',
    assignee: 'Você',
    priority: 'high' as const,
    status: 'in_progress' as const,
    dueDate: '14/04/2024 20:00',
    sla: 60,
    createdAt: '13/04/2024 09:00',
  },
  {
    id: 'TSK-008',
    title: 'Aprovar pagamento NF #5678',
    process: 'Contas a Pagar',
    step: 'Aprovação Financeira',
    assignee: 'Você',
    priority: 'critical' as const,
    status: 'pending' as const,
    dueDate: '14/04/2024 12:00',
    sla: 92,
    createdAt: '13/04/2024 08:00',
  },
];

const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  overdue: 'Atrasado',
};

function SlaIndicator({ percentage }: { percentage: number }) {
  const color =
    percentage >= 100
      ? 'var(--color-danger)'
      : percentage >= 80
        ? 'var(--color-warning)'
        : 'var(--color-success)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 48,
          height: 6,
          background: 'var(--color-surface-alt)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(percentage, 100)}%`,
            height: '100%',
            background: color,
            borderRadius: 3,
          }}
        />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{percentage}%</span>
    </div>
  );
}

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.process.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    overdue: tasks.filter((t) => t.status === 'overdue').length,
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Central de Tarefas</h1>
        <p className="page-header__subtitle">
          Gerencie suas tarefas pendentes e acompanhe o andamento dos processos.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <CheckSquare size={22} />
          </div>
          <div>
            <div className="stat-card__value">{taskCounts.all}</div>
            <div className="stat-card__label">Total de Tarefas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-card__value">{taskCounts.pending}</div>
            <div className="stat-card__label">Pendentes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <Filter size={22} />
          </div>
          <div>
            <div className="stat-card__value">{taskCounts.in_progress}</div>
            <div className="stat-card__label">Em Andamento</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--danger">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-card__value">{taskCounts.overdue}</div>
            <div className="stat-card__label">Atrasadas</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card__body">
          <div className="filters-bar">
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
              />
              <input
                type="text"
                className="filter-search"
                placeholder="Buscar tarefas..."
                style={{ paddingLeft: 32 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em andamento</option>
              <option value="overdue">Atrasado</option>
            </select>
            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Todas as prioridades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>

          {/* Task Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Tarefa</th>
                <th>Processo</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>SLA</th>
                <th>Prazo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {task.id} &middot; {task.step}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{task.process}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge--${task.priority}`}>
                      {priorityLabels[task.priority]}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge--${task.status}`}>
                      {statusLabels[task.status]}
                    </span>
                  </td>
                  <td>
                    <SlaIndicator percentage={task.sla} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-muted)' }}>
                      <Calendar size={13} />
                      {task.dueDate}
                    </div>
                  </td>
                  <td>
                    <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <CheckSquare size={48} className="empty-state__icon" />
                      <div className="empty-state__title">Nenhuma tarefa encontrada</div>
                      <div className="empty-state__text">
                        Ajuste os filtros ou aguarde novas tarefas serem atribuídas.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
