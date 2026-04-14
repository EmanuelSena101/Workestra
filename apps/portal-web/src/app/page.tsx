'use client';

import React from 'react';
import {
  CheckSquare,
  FileText,
  FolderOpen,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
  GitBranch,
  Upload,
  Search,
  Star,
} from 'lucide-react';

const stats = [
  { label: 'Tarefas Pendentes', value: 12, icon: <CheckSquare size={22} />, variant: 'primary' },
  { label: 'Solicitações Abertas', value: 8, icon: <FileText size={22} />, variant: 'warning' },
  { label: 'Concluídas Hoje', value: 5, icon: <TrendingUp size={22} />, variant: 'success' },
  { label: 'SLA em Risco', value: 3, icon: <AlertTriangle size={22} />, variant: 'danger' },
];

const pendingTasks = [
  {
    id: '1',
    title: 'Aprovar solicitação de compra #1234',
    process: 'Aprovação de Compras',
    priority: 'high',
    dueDate: '2 horas',
  },
  {
    id: '2',
    title: 'Revisar documento técnico v3.2',
    process: 'Revisão Documental',
    priority: 'medium',
    dueDate: '1 dia',
  },
  {
    id: '3',
    title: 'Validar dados do fornecedor',
    process: 'Cadastro de Fornecedores',
    priority: 'low',
    dueDate: '3 dias',
  },
  {
    id: '4',
    title: 'Aprovar férias - João Silva',
    process: 'Gestão de Férias',
    priority: 'critical',
    dueDate: '30 min',
  },
  {
    id: '5',
    title: 'Revisar contrato de prestação de serviços',
    process: 'Gestão Contratual',
    priority: 'high',
    dueDate: '4 horas',
  },
];

const recentRequests = [
  { id: 'SOL-2024-1234', title: 'Compra de equipamentos TI', status: 'in_progress', date: 'Hoje, 10:30' },
  { id: 'SOL-2024-1233', title: 'Solicitação de acesso VPN', status: 'completed', date: 'Ontem, 14:20' },
  { id: 'SOL-2024-1232', title: 'Reserva de sala de reunião', status: 'pending', date: 'Ontem, 09:15' },
  { id: 'SOL-2024-1231', title: 'Reembolso de despesas', status: 'in_progress', date: '12/04, 16:45' },
];

const recentDocuments = [
  { name: 'Relatório Financeiro Q1 2024.pdf', type: 'PDF', date: 'Hoje, 09:00', size: '2.4 MB' },
  { name: 'Manual de Procedimentos v5.docx', type: 'DOCX', date: 'Ontem, 11:30', size: '1.1 MB' },
  { name: 'Planilha de Custos 2024.xlsx', type: 'XLSX', date: '12/04, 15:00', size: '856 KB' },
];

const quickActions = [
  { label: 'Nova Solicitação', icon: <Plus size={20} /> },
  { label: 'Upload Documento', icon: <Upload size={20} /> },
  { label: 'Iniciar Processo', icon: <GitBranch size={20} /> },
  { label: 'Buscar', icon: <Search size={20} /> },
];

const announcements = [
  {
    title: 'Manutenção programada',
    text: 'O sistema estará indisponível no dia 20/04 das 22h às 02h para manutenção.',
    date: '14/04/2024',
    type: 'warning',
  },
  {
    title: 'Nova versão do módulo de documentos',
    text: 'Agora é possível realizar preview de arquivos PDF diretamente no portal.',
    date: '12/04/2024',
    type: 'info',
  },
];

const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  overdue: 'Atrasado',
};

const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

export default function HomePage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Bem-vindo ao Workestra</h1>
        <p className="page-header__subtitle">
          Aqui está o resumo da sua mesa de trabalho.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className={`stat-card__icon stat-card__icon--${stat.variant}`}>
              {stat.icon}
            </div>
            <div>
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 24 }}>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <div className="quick-action" key={action.label}>
              <div className="quick-action__icon">{action.icon}</div>
              <span className="quick-action__label">{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid content-grid--2">
        {/* Pending Tasks */}
        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Tarefas Pendentes</h2>
            <a href="/tasks" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todas <ArrowRight size={14} />
            </a>
          </div>
          <div>
            {pendingTasks.map((task) => (
              <div className="list-item" key={task.id}>
                <div className="list-item__icon">
                  <CheckSquare size={18} />
                </div>
                <div className="list-item__content">
                  <div className="list-item__title">{task.title}</div>
                  <div className="list-item__meta">
                    {task.process} &middot; <Clock size={12} style={{ verticalAlign: 'middle' }} />{' '}
                    {task.dueDate}
                  </div>
                </div>
                <span className={`badge badge--${task.priority}`}>
                  {priorityLabels[task.priority]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Solicitações Recentes</h2>
            <a href="/requests" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todas <ArrowRight size={14} />
            </a>
          </div>
          <div>
            {recentRequests.map((req) => (
              <div className="list-item" key={req.id}>
                <div className="list-item__icon">
                  <FileText size={18} />
                </div>
                <div className="list-item__content">
                  <div className="list-item__title">{req.title}</div>
                  <div className="list-item__meta">
                    {req.id} &middot; {req.date}
                  </div>
                </div>
                <span className={`badge badge--${req.status}`}>
                  {statusLabels[req.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="card">
          <div className="card__header">
            <h2 className="card__title">Documentos Recentes</h2>
            <a href="/documents" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todos <ArrowRight size={14} />
            </a>
          </div>
          <div>
            {recentDocuments.map((doc) => (
              <div className="list-item" key={doc.name}>
                <div className="list-item__icon">
                  <FolderOpen size={18} />
                </div>
                <div className="list-item__content">
                  <div className="list-item__title">{doc.name}</div>
                  <div className="list-item__meta">
                    {doc.type} &middot; {doc.size} &middot; {doc.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements & Favorites */}
        <div>
          {/* Announcements */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card__header">
              <h2 className="card__title">Comunicados</h2>
            </div>
            <div className="card__body">
              {announcements.map((item) => (
                <div key={item.title} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className={`badge badge--${item.type === 'warning' ? 'pending' : 'active'}`}>
                      {item.type === 'warning' ? 'Aviso' : 'Info'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.date}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div className="card">
            <div className="card__header">
              <h2 className="card__title">Favoritos</h2>
            </div>
            <div>
              <div className="list-item">
                <div className="list-item__icon" style={{ color: 'var(--color-warning)' }}>
                  <Star size={18} />
                </div>
                <div className="list-item__content">
                  <div className="list-item__title">Aprovação de Compras</div>
                  <div className="list-item__meta">Processo</div>
                </div>
              </div>
              <div className="list-item">
                <div className="list-item__icon" style={{ color: 'var(--color-warning)' }}>
                  <Star size={18} />
                </div>
                <div className="list-item__content">
                  <div className="list-item__title">Manuais e Procedimentos</div>
                  <div className="list-item__meta">Pasta de documentos</div>
                </div>
              </div>
              <div className="list-item">
                <div className="list-item__icon" style={{ color: 'var(--color-warning)' }}>
                  <Star size={18} />
                </div>
                <div className="list-item__content">
                  <div className="list-item__title">Dashboard de Indicadores</div>
                  <div className="list-item__meta">Portal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
