'use client';

import React from 'react';
import useSWR from 'swr';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, StatCard, Badge } from '../../components/ui';
import { fetcher } from '../../lib/api';
import { Users, FileText, FolderOpen, CheckSquare, GitBranch, Bell, Shield, Layout, MessageSquare, Activity } from 'lucide-react';

interface DashboardSection {
  label: string;
  count: number;
}

interface SystemService {
  name: string;
  status: string;
  message?: string;
}

interface AdminDashboard {
  sections: DashboardSection[];
}

interface SystemStatus {
  status: string;
  services: SystemService[];
}

export default function AdminPage() {
  const { data: dashboard, error: dashError, isLoading: dashLoading } = useSWR<AdminDashboard>('/admin/dashboard', fetcher);
  const { data: systemStatus, error: sysError, isLoading: sysLoading } = useSWR<SystemStatus>('/admin/system-status', fetcher);

  const iconMap: Record<string, React.ReactNode> = {
    users: <Users size={20} color="#0080d0" />,
    groups: <Shield size={20} color="#7c3aed" />,
    documents: <FolderOpen size={20} color="#059669" />,
    tasks: <CheckSquare size={20} color="#d97706" />,
    requests: <FileText size={20} color="#dc2626" />,
    processes: <GitBranch size={20} color="#0891b2" />,
    portals: <Layout size={20} color="#4f46e5" />,
    communities: <MessageSquare size={20} color="#16a34a" />,
    notifications: <Bell size={20} color="#ea580c" />,
    audit: <Activity size={20} color="#64748b" />,
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Administração</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral do sistema e gerenciamento</p>
        </div>

        {/* Dashboard Stats */}
        {dashLoading && <LoadingSpinner message="Carregando painel..." />}
        {dashError && <ErrorState message={dashError.message} />}

        {dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {dashboard.sections.map((section) => (
              <StatCard
                key={section.label}
                label={section.label.charAt(0).toUpperCase() + section.label.slice(1)}
                value={section.count}
                icon={iconMap[section.label] || <Activity size={20} color="#0080d0" />}
              />
            ))}
          </div>
        )}

        {/* System Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Status do Sistema</h2>
          </div>

          {sysLoading && <LoadingSpinner size="sm" message="Verificando serviços..." />}
          {sysError && <ErrorState message={sysError.message} />}

          {systemStatus && (
            <div className="divide-y divide-gray-50">
              {systemStatus.services.map((service) => (
                <div key={service.name} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      service.status === 'connected' ? 'bg-green-500' :
                      service.status === 'not_configured' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-800">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      service.status === 'connected' ? 'success' :
                      service.status === 'not_configured' ? 'warning' : 'danger'
                    }>
                      {service.status === 'connected' ? 'Conectado' :
                       service.status === 'not_configured' ? 'Não configurado' : 'Desconectado'}
                    </Badge>
                    {service.message && <span className="text-xs text-gray-400">{service.message}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
