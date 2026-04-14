'use client';

import React from 'react';
import useSWR from 'swr';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '../../components/ui';
import { fetcher } from '../../lib/api';
import { Users, MessageSquare } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
}

interface CommunitiesResponse {
  items: Community[];
  total: number;
}

export default function CommunitiesPage() {
  const { data, error, isLoading } = useSWR<CommunitiesResponse>('/admin/communities', fetcher);

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Comunidades</h1>
          <p className="text-sm text-gray-500 mt-1">Espaços de colaboração da organização</p>
        </div>

        {isLoading && <LoadingSpinner message="Carregando comunidades..." />}
        {error && <ErrorState message={error.message} />}

        {data && data.items.length === 0 && (
          <EmptyState icon={<Users size={48} />} title="Nenhuma comunidade criada" description="Comunidades são espaços de interação e colaboração" />
        )}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((community) => (
              <div key={community.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md cursor-pointer transition-all">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquare size={20} className="text-green-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{community.name}</h3>
                {community.description && <p className="text-xs text-gray-500 mt-1">{community.description}</p>}
                <p className="text-xs text-gray-400 mt-2">{community.memberCount} membros</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
