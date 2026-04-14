import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  private async generateRequestNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.request.count({
      where: { requestNumber: { startsWith: `SOL-${year}` } },
    });
    return `SOL-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  async findAll(filters: { status?: string; requesterId?: string; search?: string; page?: number; pageSize?: number }) {
    const { status, requesterId, search, page = 1, pageSize = 20 } = filters;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (status && status !== 'all') where['status'] = status;
    if (requesterId) where['requesterId'] = requesterId;
    if (search) {
      where['OR'] = [
        { title: { contains: search, mode: 'insensitive' } },
        { requestNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.request.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { id: true, displayName: true } },
          processDefinition: { select: { id: true, name: true, key: true } },
        },
      }),
      this.prisma.request.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: {
        requester: { select: { id: true, displayName: true, email: true } },
        processDefinition: { select: { id: true, name: true, key: true } },
        attachments: true,
        comments: { include: { author: { select: { id: true, displayName: true } } }, orderBy: { createdAt: 'desc' } },
        history: { orderBy: { timestamp: 'desc' } },
      },
    });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async create(data: {
    title: string;
    description?: string;
    processDefinitionId: string;
    requesterId: string;
    priority?: string;
    formData?: Record<string, unknown>;
  }) {
    const requestNumber = await this.generateRequestNumber();

    const request = await this.prisma.request.create({
      data: {
        requestNumber,
        title: data.title,
        description: data.description,
        processDefinitionId: data.processDefinitionId,
        requesterId: data.requesterId,
        priority: data.priority || 'medium',
        status: 'open',
        formData: data.formData as any ?? undefined,
      },
      include: {
        requester: { select: { id: true, displayName: true } },
        processDefinition: { select: { id: true, name: true } },
      },
    });

    // Create initial history entry
    const requester = await this.prisma.user.findUnique({ where: { id: data.requesterId } });
    await this.prisma.historyEntry.create({
      data: {
        entityType: 'request',
        entityId: request.id,
        requestId: request.id,
        action: 'created',
        toStatus: 'open',
        userId: data.requesterId,
        userName: requester?.displayName || 'System',
      },
    });

    return request;
  }

  async update(id: string, data: { status?: string; priority?: string; currentStep?: string; formData?: Record<string, unknown> }, userId: string) {
    const existing = await this.prisma.request.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Request not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const updated = await this.prisma.request.update({
      where: { id },
      data: {
        status: data.status,
        priority: data.priority,
        currentStep: data.currentStep,
        formData: data.formData as any ?? undefined,
        completedAt: data.status === 'completed' ? new Date() : undefined,
      },
    });

    if (data.status && data.status !== existing.status) {
      await this.prisma.historyEntry.create({
        data: {
          entityType: 'request',
          entityId: id,
          requestId: id,
          action: 'status_changed',
          fromStatus: existing.status,
          toStatus: data.status,
          userId,
          userName: user?.displayName || 'System',
        },
      });
    }

    return updated;
  }

  async addComment(requestId: string, content: string, authorId: string) {
    return this.prisma.comment.create({
      data: {
        entityType: 'request',
        entityId: requestId,
        requestId,
        content,
        authorId,
      },
      include: { author: { select: { id: true, displayName: true } } },
    });
  }

  async count(status?: string) {
    const where = status ? { status } : {};
    return this.prisma.request.count({ where });
  }
}
