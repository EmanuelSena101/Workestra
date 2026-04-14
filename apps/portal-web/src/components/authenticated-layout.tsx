'use client';

import React from 'react';
import { useAuth } from '../contexts/auth-context';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '../components/ui';
import { ShellLayout } from '../layouts/shell-layout';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" message="Carregando..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <ShellLayout>{children}</ShellLayout>;
}
