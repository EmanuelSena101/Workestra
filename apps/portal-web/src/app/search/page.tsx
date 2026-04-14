'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState, Badge } from '../../components/ui';
import { fetcher } from '../../lib/api';
import { Search, FileText, CheckSquare, FolderOpen, GitBranch, User } from 'lucide-react';

interface SearchResult {
  type: string;
  id: string;
  title: string;
  description?: string;
  url?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
}

const typeIcons: Record<string, React.ReactNode> = {
  document: <FolderOpen size={16} className="text-green-500" />,
  task: <CheckSquare size={16} className="text-blue-500" />,
  request: <FileText size={16} className="text-orange-500" />,
  process: <GitBranch size={16} className="text-purple-500" />,
  user: <User size={16} className="text-gray-500" />,
};

const typeLabels: Record<string, string> = {
  document: 'Documento',
  task: 'Tarefa',
  request: 'Solicitação',
  process: 'Processo',
  user: 'Usuário',
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const { data, error, isLoading } = useSWR<SearchResponse>(
    activeQuery ? `/search?query=${encodeURIComponent(activeQuery)}` : null,
    fetcher
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Busca Global</h1>
        <p className="text-sm text-gray-500 mt-1">Encontre documentos, tarefas, solicitações e mais</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="O que você está procurando?"
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          autoFocus
        />
      </form>

      {isLoading && <LoadingSpinner message="Buscando..." />}
      {error && <ErrorState message={error.message} />}

      {!activeQuery && !data && (
        <EmptyState icon={<Search size={48} />} title="Faça uma busca" description="Digite palavras-chave para encontrar itens na plataforma" />
      )}

      {data && data.results.length === 0 && (
        <EmptyState icon={<Search size={48} />} title="Nenhum resultado encontrado" description={`Nenhum item corresponde a "${activeQuery}"`} />
      )}

      {data && data.results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">{data.total} resultado(s) encontrado(s)</p>
          {data.results.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              onClick={() => result.url && router.push(result.url)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-gray-200 cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{typeIcons[result.type] || <FileText size={16} />}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-800">{result.title}</h3>
                    <Badge>{typeLabels[result.type] || result.type}</Badge>
                  </div>
                  {result.description && <p className="text-xs text-gray-500 mt-1">{result.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<LoadingSpinner message="Carregando busca..." />}>
        <SearchContent />
      </Suspense>
    </AuthenticatedLayout>
  );
}
