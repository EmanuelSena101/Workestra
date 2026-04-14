'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState, Badge } from '../../components/ui';
import { fetcher } from '../../lib/api';
import { Search, GitBranch, Plus } from 'lucide-react';

interface Process {
  id: string;
  key: string;
  name: string;
  description?: string;
  category?: string;
  version: number;
  instanceCount?: number;
  createdAt: string;
}

interface ProcessesResponse {
  items: Process[];
  total: number;
  page: number;
  totalPages: number;
}

export default function ProcessesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));

  const { data, error, isLoading } = useSWR<ProcessesResponse>(`/workflows?${params.toString()}`, fetcher);

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Processos</h1>
            <p className="text-sm text-gray-500 mt-1">Definições de processos e workflows</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar processos..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isLoading && <LoadingSpinner message="Carregando processos..." />}
        {error && <ErrorState message={error.message} />}

        {data && data.items.length === 0 && (
          <EmptyState
            icon={<GitBranch size={48} />}
            title="Nenhum processo encontrado"
            description="Defina novos processos para automatizar fluxos de trabalho"
          />
        )}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((proc) => (
              <div
                key={proc.id}
                onClick={() => router.push(`/processes/${proc.id}`)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <GitBranch size={20} className="text-blue-500" />
                  </div>
                  {proc.category && <Badge>{proc.category}</Badge>}
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mt-3">{proc.name}</h3>
                {proc.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{proc.description}</p>}
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <span>v{proc.version}</span>
                  <span>{proc.instanceCount ?? 0} instâncias</span>
                  <span>{proc.key}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500">{data.total} processos</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Anterior</button>
              <span className="px-3 py-1 text-sm text-gray-600">{page} / {data.totalPages}</span>
              <button onClick={() => setPage(Math.min(data.totalPages, page + 1))} disabled={page === data.totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50">Próximo</button>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
