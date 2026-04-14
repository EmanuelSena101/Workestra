'use client';

import React, { useState, useCallback } from 'react';
import {
  FolderOpen,
  File,
  FileText,
  Image,
  Upload,
  Search,
  Grid,
  List,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  ChevronRight,
  Folder,
  Plus,
} from 'lucide-react';

interface DocItem {
  id: string;
  name: string;
  type: 'folder' | 'pdf' | 'docx' | 'xlsx' | 'image' | 'other';
  size?: string;
  version?: number;
  modifiedBy?: string;
  modifiedAt: string;
  items?: number;
}

const documents: DocItem[] = [
  {
    id: 'f1',
    name: 'Políticas e Normas',
    type: 'folder',
    modifiedAt: '14/04/2024',
    items: 23,
  },
  {
    id: 'f2',
    name: 'Manuais e Procedimentos',
    type: 'folder',
    modifiedAt: '13/04/2024',
    items: 45,
  },
  {
    id: 'f3',
    name: 'Contratos',
    type: 'folder',
    modifiedAt: '12/04/2024',
    items: 18,
  },
  {
    id: 'f4',
    name: 'Relatórios',
    type: 'folder',
    modifiedAt: '14/04/2024',
    items: 56,
  },
  {
    id: 'd1',
    name: 'Relatório Financeiro Q1 2024.pdf',
    type: 'pdf',
    size: '2.4 MB',
    version: 3,
    modifiedBy: 'Maria Santos',
    modifiedAt: '14/04/2024 09:00',
  },
  {
    id: 'd2',
    name: 'Manual de Procedimentos v5.docx',
    type: 'docx',
    size: '1.1 MB',
    version: 5,
    modifiedBy: 'Carlos Oliveira',
    modifiedAt: '13/04/2024 11:30',
  },
  {
    id: 'd3',
    name: 'Planilha de Custos 2024.xlsx',
    type: 'xlsx',
    size: '856 KB',
    version: 2,
    modifiedBy: 'Ana Pereira',
    modifiedAt: '12/04/2024 15:00',
  },
  {
    id: 'd4',
    name: 'Apresentação Resultados.pdf',
    type: 'pdf',
    size: '5.2 MB',
    version: 1,
    modifiedBy: 'Pedro Almeida',
    modifiedAt: '11/04/2024 16:00',
  },
  {
    id: 'd5',
    name: 'Organograma Atualizado.png',
    type: 'image',
    size: '340 KB',
    version: 4,
    modifiedBy: 'Lucia Ferreira',
    modifiedAt: '10/04/2024 10:00',
  },
  {
    id: 'd6',
    name: 'Contrato Prestação Serviços - XYZ.pdf',
    type: 'pdf',
    size: '1.8 MB',
    version: 1,
    modifiedBy: 'Fernanda Costa',
    modifiedAt: '09/04/2024 14:30',
  },
];

function getFileIcon(type: string) {
  switch (type) {
    case 'folder':
      return <Folder size={20} style={{ color: 'var(--color-warning)' }} />;
    case 'pdf':
      return <FileText size={20} style={{ color: '#e74c3c' }} />;
    case 'docx':
      return <FileText size={20} style={{ color: '#2980b9' }} />;
    case 'xlsx':
      return <FileText size={20} style={{ color: '#27ae60' }} />;
    case 'image':
      return <Image size={20} style={{ color: '#8e44ad' }} />;
    default:
      return <File size={20} style={{ color: 'var(--color-text-muted)' }} />;
  }
}

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload - would connect to MinIO via Platform API
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-header__title">Documentos</h1>
          <p className="page-header__subtitle">
            Gerencie documentos, pastas e versões da sua organização.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="topbar__new-request-btn" style={{ background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-soft)' }}>
            <Plus size={16} />
            Nova Pasta
          </button>
          <button className="topbar__new-request-btn">
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
        <FolderOpen size={16} />
        <span style={{ color: 'var(--color-text-link)', cursor: 'pointer' }}>Raiz</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Todos os Documentos</span>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragActive ? 'upload-zone--active' : ''}`}
        style={{ marginBottom: 20 }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-zone__icon">
          <Upload size={32} />
        </div>
        <div className="upload-zone__text">
          Arraste e solte arquivos aqui para fazer upload
        </div>
        <div className="upload-zone__hint">
          ou clique para selecionar arquivos do seu computador
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            className="filter-search"
            placeholder="Buscar documentos..."
            style={{ paddingLeft: 32, width: '100%' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button
            className="topbar__action-btn"
            onClick={() => setViewMode('list')}
            style={{ background: viewMode === 'list' ? 'var(--color-surface-hover)' : undefined }}
          >
            <List size={18} />
          </button>
          <button
            className="topbar__action-btn"
            onClick={() => setViewMode('grid')}
            style={{ background: viewMode === 'grid' ? 'var(--color-surface-hover)' : undefined }}
          >
            <Grid size={18} />
          </button>
        </div>
      </div>

      {/* Document List */}
      <div className="card">
        {viewMode === 'list' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tamanho</th>
                <th>Versão</th>
                <th>Modificado por</th>
                <th>Última modificação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {getFileIcon(doc.type)}
                      <span style={{ fontWeight: 500 }}>{doc.name}</span>
                      {doc.type === 'folder' && (
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          ({doc.items} itens)
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {doc.size || '—'}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {doc.version ? `v${doc.version}` : '—'}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {doc.modifiedBy || '—'}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {doc.modifiedAt}
                  </td>
                  <td>
                    <button className="topbar__action-btn">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="card__body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: 16,
                    border: '1px solid var(--color-border-soft)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ marginBottom: 12 }}>{getFileIcon(doc.type)}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {doc.size || `${doc.items} itens`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
