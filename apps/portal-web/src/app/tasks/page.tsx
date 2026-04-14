'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState, Badge } from '../../components/ui';
import { fetcher } from '../../lib/api';
import { Search, Filter, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  processName?: string;
  currentStep?: string;
  slaPercentage: number;
  dueDate?: string;
  createdAt: string;
}

interface TasksResponse {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function TasksPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  if (priority) params.set('priority', priority);
  params.set('page', String(page));

  const { data, error, isLoading } = useSWR<TasksResponse>(`/tasks?${params.toString()}`, fetcher);

  const statusColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'danger',
  };

  const priorityColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
    low: 'default',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Central de Tarefas</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie suas tarefas e pendências</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar tarefas..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Concluído</option>
          </select>
          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as prioridades</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>

        {/* Content */}
        {isLoading && <LoadingSpinner message="Carregando tarefas..." />}
        {error && <ErrorState message={error.message} />}

        {data && data.items.length === 0 && (
          <EmptyState
            icon={<CheckSquare size={48} />}
            title="Nenhuma tarefa encontrada"
            description={search || status || priority ? 'Tente ajustar os filtros' : 'Novas tarefas aparecerão aqui quando forem atribuídas a você'}
          />
        )}

        {data && data.items.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Tarefa</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Processo</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Prioridade</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.items.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/tasks/${task.id}`)}>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      {task.currentStep && <p className="text-xs text-gray-400 mt-0.5">{task.currentStep}</p>}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{task.processName || '—'}</td>
                    <td className="px-5 py-3"><Badge variant={statusColors[task.status] || 'default'}>{task.status}</Badge></td>
                    <td className="px-5 py-3"><Badge variant={priorityColors[task.priority] || 'default'}>{task.priority}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(task.slaPercentage, 100)}%`,
                            backgroundColor: task.slaPercentage > 80 ? '#b00000' : task.slaPercentage > 50 ? '#e0b020' : '#0080d0',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">{data.total} tarefas encontradas</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-600">{page} / {data.totalPages}</span>
                  <button
                    onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                    disabled={page === data.totalPages}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
