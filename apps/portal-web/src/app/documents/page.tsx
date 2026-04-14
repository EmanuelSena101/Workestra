'use client';

import React, { useState, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState, Badge } from '../../components/ui';
import { fetcher, api } from '../../lib/api';
import { Search, Upload, FolderOpen, File, Grid, List, Download, Eye, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: { displayName: string };
  currentVersion: number;
}

interface DocsResponse {
  items: Document[];
  total: number;
  page: number;
  totalPages: number;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string): string {
  if (mimeType?.startsWith('image/')) return '🖼️';
  if (mimeType?.includes('pdf')) return '📄';
  if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel')) return '📊';
  if (mimeType?.includes('document') || mimeType?.includes('word')) return '📝';
  if (mimeType?.includes('text')) return '📃';
  return '📎';
}

export default function DocumentsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const params = new URLSearchParams();
  if (search) params.set('search', search);
  params.set('page', String(page));

  const { data, error, isLoading, mutate } = useSWR<DocsResponse>(`/documents?${params.toString()}`, fetcher);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        await api.upload('/documents/upload', files[i]);
      }
      toast.success(`${files.length} arquivo(s) enviado(s) com sucesso`);
      mutate();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao enviar arquivo');
    } finally {
      setUploading(false);
    }
  }, [mutate]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  const handleDownload = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { url } = await api.get<{ url: string }>(`/documents/${docId}/download`);
      window.open(url, '_blank');
    } catch (err) {
      toast.error('Erro ao baixar arquivo');
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Documentos</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie seus documentos e arquivos</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Upload size={14} />
            {uploading ? 'Enviando...' : 'Upload'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar documentos..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-500' : 'text-gray-400'}`}>
              <List size={16} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-500' : 'text-gray-400'}`}>
              <Grid size={16} />
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <Upload size={32} className={`mx-auto mb-2 ${dragOver ? 'text-blue-500' : 'text-gray-300'}`} />
          <p className="text-sm text-gray-500">
            Arraste e solte arquivos aqui ou{' '}
            <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 hover:text-blue-700 underline">
              selecione do computador
            </button>
          </p>
        </div>

        {isLoading && <LoadingSpinner message="Carregando documentos..." />}
        {error && <ErrorState message={error.message} />}

        {data && data.items.length === 0 && (
          <EmptyState
            icon={<FolderOpen size={48} />}
            title="Nenhum documento encontrado"
            description="Faça upload de documentos para começar"
          />
        )}

        {data && data.items.length > 0 && viewMode === 'list' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Versão</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Criado por</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.items.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/documents/${doc.id}`)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span>{getFileIcon(doc.mimeType)}</span>
                        <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">v{doc.currentVersion}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{doc.createdBy?.displayName || '—'}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{new Date(doc.updatedAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/documents/${doc.id}`); }} className="p-1.5 text-gray-400 hover:text-blue-500 rounded">
                          <Eye size={14} />
                        </button>
                        <button onClick={(e) => handleDownload(doc.id, e)} className="p-1.5 text-gray-400 hover:text-green-500 rounded">
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.items.length > 0 && viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.items.map((doc) => (
              <div
                key={doc.id}
                onClick={() => router.push(`/documents/${doc.id}`)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-gray-200 cursor-pointer transition-all text-center"
              >
                <div className="text-3xl mb-2">{getFileIcon(doc.mimeType)}</div>
                <p className="text-xs font-medium text-gray-800 truncate">{doc.name}</p>
                <p className="text-xs text-gray-400 mt-1">{formatFileSize(doc.size)}</p>
              </div>
            ))}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500">{data.total} documentos</p>
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
