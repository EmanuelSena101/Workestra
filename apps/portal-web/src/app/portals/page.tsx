'use client';

import React from 'react';
import useSWR from 'swr';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '../../components/ui';
import { fetcher } from '../../lib/api';
import { Layout } from 'lucide-react';

interface Portal {
  id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: string;
}

interface PortalsResponse {
  items: Portal[];
  total: number;
}

export default function PortalsPage() {
  const { data, error, isLoading } = useSWR<PortalsResponse>('/admin/portals', fetcher);

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Portais</h1>
          <p className="text-sm text-gray-500 mt-1">Portais e páginas internas</p>
        </div>

        {isLoading && <LoadingSpinner message="Carregando portais..." />}
        {error && <ErrorState message={error.message} />}

        {data && data.items.length === 0 && (
          <EmptyState icon={<Layout size={48} />} title="Nenhum portal criado" description="Portais são páginas internas para sua organização" />
        )}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((portal) => (
              <div key={portal.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md cursor-pointer transition-all">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                  <Layout size={20} className="text-indigo-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{portal.name}</h3>
                {portal.description && <p className="text-xs text-gray-500 mt-1">{portal.description}</p>}
                <p className="text-xs text-gray-400 mt-2">/{portal.slug}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
