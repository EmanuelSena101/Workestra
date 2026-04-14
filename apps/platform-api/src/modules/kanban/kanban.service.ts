import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KanbanService {
  constructor(private prisma: PrismaService) {}

  // ── Boards ──

  async listBoards(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.kanbanBoard.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          columns: {
            orderBy: { position: 'asc' },
            include: { _count: { select: { cards: true } } },
          },
        },
      }),
      this.prisma.kanbanBoard.count(),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getBoard(id: string) {
    const board = await this.prisma.kanbanBoard.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' },
              include: {
                assignee: { select: { id: true, displayName: true } },
              },
            },
          },
        },
      },
    });
    if (!board) throw new NotFoundException('Kanban board not found');
    return board;
  }

  async createBoard(data: { name: string; description?: string; processDefinitionId?: string }, userId: string) {
    const board = await this.prisma.kanbanBoard.create({
      data: {
        name: data.name,
        description: data.description,
        processDefinitionId: data.processDefinitionId,
      },
    });

    // Create default columns
    const defaultColumns = ['A Fazer', 'Em Andamento', 'Em Revisão', 'Concluído'];
    for (let i = 0; i < defaultColumns.length; i++) {
      await this.prisma.kanbanColumn.create({
        data: {
          boardId: board.id,
          name: defaultColumns[i],
          position: i,
          color: ['#e2e8f0', '#93c5fd', '#fbbf24', '#86efac'][i],
        },
      });
    }

    return this.getBoard(board.id);
  }

  async updateBoard(id: string, data: { name?: string; description?: string }) {
    return this.prisma.kanbanBoard.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  async deleteBoard(id: string) {
    await this.prisma.kanbanBoard.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Columns ──

  async createColumn(boardId: string, data: { name: string; color?: string }) {
    const maxPos = await this.prisma.kanbanColumn.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    return this.prisma.kanbanColumn.create({
      data: {
        boardId,
        name: data.name,
        color: data.color || '#e2e8f0',
        position: (maxPos._max.position ?? -1) + 1,
      },
    });
  }

  async updateColumn(id: string, data: { name?: string; color?: string; position?: number }) {
    return this.prisma.kanbanColumn.update({ where: { id }, data });
  }

  async deleteColumn(id: string) {
    await this.prisma.kanbanColumn.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Cards ──

  async createCard(columnId: string, data: { title: string; description?: string; assigneeId?: string; priority?: string; dueDate?: string; requestId?: string }, userId: string) {
    const maxPos = await this.prisma.kanbanCard.aggregate({
      where: { columnId },
      _max: { position: true },
    });

    return this.prisma.kanbanCard.create({
      data: {
        columnId,
        title: data.title,
        description: data.description,
        assigneeId: data.assigneeId,
        priority: data.priority || 'medium',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        requestId: data.requestId,
        position: (maxPos._max.position ?? -1) + 1,
        createdById: userId,
      },
      include: {
        assignee: { select: { id: true, displayName: true } },
      },
    });
  }

  async updateCard(id: string, data: { title?: string; description?: string; assigneeId?: string; priority?: string; dueDate?: string }) {
    return this.prisma.kanbanCard.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: {
        assignee: { select: { id: true, displayName: true } },
      },
    });
  }

  async moveCard(id: string, targetColumnId: string, position: number) {
    return this.prisma.kanbanCard.update({
      where: { id },
      data: { columnId: targetColumnId, position },
      include: {
        assignee: { select: { id: true, displayName: true } },
      },
    });
  }

  async deleteCard(id: string) {
    await this.prisma.kanbanCard.delete({ where: { id } });
    return { deleted: true };
  }
}
