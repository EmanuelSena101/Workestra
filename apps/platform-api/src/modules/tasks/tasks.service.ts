import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { status?: string; priority?: string; assigneeId?: string; search?: string; page?: number; pageSize?: number }) {
    const { status, priority, assigneeId, search, page = 1, pageSize = 20 } = filters;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (status) where['status'] = status;
    if (priority) where['priority'] = priority;
    if (assigneeId) where['assigneeId'] = assigneeId;
    if (search) {
      where['OR'] = [
        { title: { contains: search, mode: 'insensitive' } },
        { processName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.task.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.task.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(data: {
    title: string; description?: string; processName?: string; processDefinitionKey?: string;
    currentStep?: string; assigneeId?: string; priority?: string; dueDate?: string; requestId?: string;
  }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        processName: data.processName,
        processDefinitionKey: data.processDefinitionKey,
        currentStep: data.currentStep,
        assigneeId: data.assigneeId,
        priority: data.priority || 'medium',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        requestId: data.requestId,
        status: 'pending',
        slaPercentage: 0,
      },
    });
  }

  async update(id: string, data: { status?: string; assigneeId?: string; priority?: string; currentStep?: string; formData?: Record<string, unknown> }) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.update({
      where: { id },
      data: {
        status: data.status,
        assigneeId: data.assigneeId,
        priority: data.priority,
        currentStep: data.currentStep,
        formData: data.formData as any ?? undefined,
        completedAt: data.status === 'completed' ? new Date() : undefined,
      },
    });
  }

  async complete(id: string) {
    return this.prisma.task.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() },
    });
  }

  async count(status?: string) {
    const where = status ? { status } : {};
    return this.prisma.task.count({ where });
  }
}
