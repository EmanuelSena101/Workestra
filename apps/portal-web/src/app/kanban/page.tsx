'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { AuthenticatedLayout } from '../../components/authenticated-layout';
import { LoadingSpinner, ErrorState, EmptyState, Badge } from '../../components/ui';
import { fetcher, api } from '../../lib/api';
import { Columns3, Plus, GripVertical, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  position: number;
  assignee?: { id: string; displayName: string };
}

interface KanbanColumn {
  id: string;
  name: string;
  color: string;
  position: number;
  cards: KanbanCard[];
}

interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  columns: KanbanColumn[];
}

interface BoardsResponse {
  items: Array<{ id: string; name: string; description?: string; columns: Array<{ _count: { cards: number } }> }>;
  total: number;
}

export default function KanbanPage() {
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [showCreateCard, setShowCreateCard] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; fromColumnId: string } | null>(null);

  const { data: boardsData, error: boardsError, isLoading: boardsLoading, mutate: mutateBoards } = useSWR<BoardsResponse>('/kanban/boards', fetcher);
  const { data: board, error: boardError, isLoading: boardLoading, mutate: mutateBoard } = useSWR<KanbanBoard>(
    selectedBoardId ? `/kanban/boards/${selectedBoardId}` : null, fetcher
  );

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const created = await api.post<KanbanBoard>('/kanban/boards', { name: newBoardName });
      setSelectedBoardId(created.id);
      setNewBoardName('');
      setShowCreateBoard(false);
      mutateBoards();
      toast.success('Quadro criado com sucesso');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleCreateCard = async (columnId: string) => {
    if (!newCardTitle.trim()) return;
    try {
      await api.post('/kanban/cards', { columnId, title: newCardTitle });
      setNewCardTitle('');
      setShowCreateCard(null);
      mutateBoard();
      toast.success('Card criado');
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDragStart = (cardId: string, fromColumnId: string) => {
    setDraggedCard({ cardId, fromColumnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetColumnId: string) => {
    if (!draggedCard || draggedCard.fromColumnId === targetColumnId) {
      setDraggedCard(null);
      return;
    }

    try {
      await api.put(`/kanban/cards/${draggedCard.cardId}/move`, { columnId: targetColumnId, position: 0 });
      mutateBoard();
    } catch (err) {
      toast.error('Erro ao mover card');
    }
    setDraggedCard(null);
  };

  const priorityColors: Record<string, string> = {
    low: '#94a3b8',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626',
  };

  // Board selection view
  if (!selectedBoardId) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Kanban</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus quadros e processos</p>
            </div>
            <button onClick={() => setShowCreateBoard(true)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
              <Plus size={14} /> Novo Quadro
            </button>
          </div>

          {showCreateBoard && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Nome do quadro..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
              />
              <button onClick={handleCreateBoard} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Criar</button>
              <button onClick={() => setShowCreateBoard(false)} className="px-4 py-2 text-gray-500 text-sm">Cancelar</button>
            </div>
          )}

          {boardsLoading && <LoadingSpinner message="Carregando quadros..." />}
          {boardsError && <ErrorState message={boardsError.message} />}

          {boardsData && boardsData.items.length === 0 && (
            <EmptyState icon={<Columns3 size={48} />} title="Nenhum quadro criado" description="Crie um quadro Kanban para organizar seus processos" />
          )}

          {boardsData && boardsData.items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boardsData.items.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBoardId(b.id)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                    <Columns3 size={20} className="text-purple-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">{b.name}</h3>
                  {b.description && <p className="text-xs text-gray-500 mt-1">{b.description}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {b.columns.length} colunas · {b.columns.reduce((sum, c) => sum + c._count.cards, 0)} cards
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </AuthenticatedLayout>
    );
  }

  // Board detail view
  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedBoardId(null)} className="text-sm text-gray-500 hover:text-gray-700">← Quadros</button>
          <h1 className="text-xl font-semibold text-gray-800">{board?.name || 'Carregando...'}</h1>
        </div>

        {boardLoading && <LoadingSpinner message="Carregando quadro..." />}
        {boardError && <ErrorState message={boardError.message} />}

        {board && (
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
            {board.columns.map((col) => (
              <div
                key={col.id}
                className="flex-shrink-0 w-72 bg-gray-100 rounded-xl p-3"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }} />
                    <h3 className="text-sm font-semibold text-gray-700">{col.name}</h3>
                    <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded">{col.cards.length}</span>
                  </div>
                  <button onClick={() => { setShowCreateCard(col.id); setNewCardTitle(''); }} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  {showCreateCard === col.id && (
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                      <input
                        type="text"
                        value={newCardTitle}
                        onChange={(e) => setNewCardTitle(e.target.value)}
                        placeholder="Título do card..."
                        className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateCard(col.id)}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleCreateCard(col.id)} className="px-3 py-1 bg-blue-500 text-white rounded text-xs">Criar</button>
                        <button onClick={() => setShowCreateCard(null)} className="px-3 py-1 text-gray-500 text-xs">Cancelar</button>
                      </div>
                    </div>
                  )}

                  {col.cards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card.id, col.id)}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-800 font-medium">{card.title}</p>
                        <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: priorityColors[card.priority] || '#94a3b8' }} />
                      </div>
                      {card.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        {card.assignee && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <User size={10} />
                            {card.assignee.displayName}
                          </div>
                        )}
                        {card.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={10} />
                            {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
