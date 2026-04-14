import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.formDefinition.findMany({ skip, take: pageSize, orderBy: { name: 'asc' } }),
      this.prisma.formDefinition.count(),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string) {
    const form = await this.prisma.formDefinition.findUnique({ where: { id } });
    if (!form) throw new NotFoundException('Form definition not found');
    return form;
  }

  async findByProcessKey(processDefinitionKey: string) {
    return this.prisma.formDefinition.findFirst({ where: { processDefinitionKey } });
  }

  async create(data: { name: string; processDefinitionKey?: string; fields: unknown; layout?: unknown }, userId: string) {
    return this.prisma.formDefinition.create({
      data: { ...data, fields: data.fields as any, layout: data.layout as any, createdBy: userId },
    });
  }

  async update(id: string, data: { name?: string; fields?: unknown; layout?: unknown }) {
    return this.prisma.formDefinition.update({
      where: { id },
      data: { ...data, fields: data.fields as any, layout: data.layout as any },
    });
  }

  async delete(id: string) {
    await this.prisma.formDefinition.delete({ where: { id } });
    return { deleted: true };
  }
}
