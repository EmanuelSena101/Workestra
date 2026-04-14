import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.processDefinition.findMany({
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { requests: true } },
        },
      }),
      this.prisma.processDefinition.count(),
    ]);

    return {
      items: items.map((p: typeof items[number]) => ({
        ...p,
        instanceCount: p._count.requests,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string) {
    const process = await this.prisma.processDefinition.findUnique({
      where: { id },
      include: {
        requests: { take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { requests: true } },
      },
    });
    if (!process) throw new NotFoundException('Process definition not found');
    return { ...process, instanceCount: process._count.requests };
  }

  async create(data: { key: string; name: string; description?: string; category?: string; formKey?: string; bpmnXml?: string }) {
    return this.prisma.processDefinition.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string; category?: string; formKey?: string; bpmnXml?: string; deployed?: boolean }) {
    return this.prisma.processDefinition.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.processDefinition.delete({ where: { id } });
    return { deleted: true };
  }

  async count() {
    return this.prisma.processDefinition.count();
  }
}
