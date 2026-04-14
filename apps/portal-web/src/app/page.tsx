'use client';

import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { CheckSquare, FileText, FolderOpen, Bell, Star, Megaphone, ArrowRight } from 'lucide-react';
import { AuthenticatedLayout } from '../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState, StatCard, Badge } from '../components/ui';
import { fetcher } from '../lib/api';
import { useAuth } from '../contexts/auth-context';

interface DashboardData {
  pendingTasks: Array<{ id: string; title: string; status: string; priority: string; processName?: string }>;
  recentRequests: Array<{ id: string; title: string; requestNumber: string; status: string; processDefinition?: { name: string } }>;
  recentDocuments: Array<{ id: string; name: string; mimeType: string; updatedAt: string; createdBy?: { displayName: string } }>;
  unreadNotifications: number;
  announcements: Array<{ id: string; title: string; content: string; type: string }>;
  favorites: Array<{ id: string; entityType: string; entityId: string; label: string }>;
  stats: { pendingTaskCount: number; myRequestCount: number; totalDocuments: number };
}

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, error, isLoading } = useSWR<DashboardData>(user ? '/home/dashboard' : null, fetcher);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Bem-vindo, {user?.displayName || 'Usuário'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral da sua área de trabalho</p>
        </div>

        {isLoading && <LoadingSpinner message="Carregando dashboard..." />}
        {error && <ErrorState message={error.message} />}

        {data && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Tarefas Pendentes"
                value={data.stats.pendingTaskCount}
                icon={<CheckSquare size={20} color="#0080d0" />}
                onClick={() => router.push('/tasks')}
              />
              <StatCard
                label="Minhas Solicitações"
                value={data.stats.myRequestCount}
                icon={<FileText size={20} color="#0080d0" />}
                onClick={() => router.push('/requests')}
              />
              <StatCard
                label="Documentos"
                value={data.stats.totalDocuments}
                icon={<FolderOpen size={20} color="#0080d0" />}
                onClick={() => router.push('/documents')}
              />
            </div>

            {/* Announcements */}
            {data.announcements.length > 0 && (
              <div className="space-y-2">
                {data.announcements.map((a) => (
                  <div key={a.id} className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
                    <Megaphone size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">{a.title}</p>
                      <p className="text-xs text-blue-600 mt-0.5">{a.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Tasks */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">Tarefas Pendentes</h2>
                  <button onClick={() => router.push('/tasks')} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                    Ver todas <ArrowRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {data.pendingTasks.length === 0 ? (
                    <EmptyState title="Nenhuma tarefa pendente" description="Suas tarefas aparecerão aqui" />
                  ) : (
                    data.pendingTasks.map((task) => (
                      <div key={task.id} className="px-5 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/tasks/${task.id}`)}>
                        <p className="text-sm text-gray-800">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {task.processName && <span className="text-xs text-gray-400">{task.processName}</span>}
                          <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Requests */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">Solicitações Recentes</h2>
                  <button onClick={() => router.push('/requests')} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                    Ver todas <ArrowRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {data.recentRequests.length === 0 ? (
                    <EmptyState title="Nenhuma solicitação" description="Suas solicitações aparecerão aqui" />
                  ) : (
                    data.recentRequests.map((req) => (
                      <div key={req.id} className="px-5 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/requests/${req.id}`)}>
                        <p className="text-sm text-gray-800">{req.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{req.requestNumber}</span>
                          <Badge variant={req.status === 'completed' ? 'success' : req.status === 'in_progress' ? 'info' : 'default'}>
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">Documentos Recentes</h2>
                  <button onClick={() => router.push('/documents')} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
                    Ver todos <ArrowRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {data.recentDocuments.length === 0 ? (
                    <EmptyState title="Nenhum documento" description="Documentos recentes aparecerão aqui" />
                  ) : (
                    data.recentDocuments.map((doc) => (
                      <div key={doc.id} className="px-5 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/documents/${doc.id}`)}>
                        <p className="text-sm text-gray-800">{doc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{doc.createdBy?.displayName}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Favorites */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-800">Favoritos</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {data.favorites.length === 0 ? (
                    <EmptyState title="Nenhum favorito" description="Adicione itens aos favoritos para acesso rápido" />
                  ) : (
                    data.favorites.map((fav) => (
                      <div key={fav.id} className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm text-gray-800">{fav.label}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
