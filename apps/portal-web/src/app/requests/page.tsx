'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState, Badge } from '../../components/ui';
import { fetcher } from '../../lib/api';
import { Search, FileText } from 'lucide-react';

interface Request {
  id: string;
  requestNumber: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  requester?: { displayName: string };
  processDefinition?: { name: string };
}

interface RequestsResponse {
  items: Request[];
  total: number;
  page: number;
  totalPages: number;
}

const statusTabs = [
  { key: '', label: 'Todas' },
  { key: 'open', label: 'Abertas' },
  { key: 'in_progress', label: 'Em andamento' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'completed', label: 'Concluídas' },
];

export default function RequestsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  params.set('page', String(page));

  const { data, error, isLoading } = useSWR<RequestsResponse>(`/requests?${params.toString()}`, fetcher);

  const statusColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
    open: 'info',
    in_progress: 'warning',
    pending: 'default',
    completed: 'success',
    rejected: 'danger',
    cancelled: 'danger',
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Solicitações</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe e gerencie suas solicitações</p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200 w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setStatus(tab.key); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                status === tab.key ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar solicitações..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isLoading && <LoadingSpinner message="Carregando solicitações..." />}
        {error && <ErrorState message={error.message} />}

        {data && data.items.length === 0 && (
          <EmptyState
            icon={<FileText size={48} />}
            title="Nenhuma solicitação encontrada"
            description={search || status ? 'Tente ajustar os filtros' : 'Crie uma nova solicitação para começar'}
          />
        )}

        {data && data.items.length > 0 && (
          <div className="space-y-3">
            {data.items.map((req) => (
              <div
                key={req.id}
                onClick={() => router.push(`/requests/${req.id}`)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-gray-200 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{req.requestNumber}</span>
                      <Badge variant={statusColors[req.status] || 'default'}>{req.status}</Badge>
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 mt-1">{req.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {req.processDefinition?.name || 'Processo'} · {req.requester?.displayName || 'Usuário'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}

            {data.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">{data.total} solicitações</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Anterior</button>
                  <span className="px-3 py-1 text-sm text-gray-600">{page} / {data.totalPages}</span>
                  <button onClick={() => setPage(Math.min(data.totalPages, page + 1))} disabled={page === data.totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Próximo</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
