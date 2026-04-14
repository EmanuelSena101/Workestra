import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/shell.css';
import { ShellLayout } from '@/layouts/shell-layout';

export const metadata: Metadata = {
  title: 'Workestra - Plataforma Corporativa',
  description: 'Plataforma corporativa unificada para gestão de processos, documentos e tarefas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  );
}
