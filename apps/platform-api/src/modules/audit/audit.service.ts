import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: { action: string; entityType: string; entityId: string; userId: string; userName: string; details?: Record<string, unknown>; ipAddress?: string }) {
    return this.prisma.auditEntry.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        userName: data.userName,
        details: data.details as any ?? undefined,
        ipAddress: data.ipAddress,
      },
    });
  }

  async findAll(filters: { entityType?: string; entityId?: string; userId?: string; page?: number; pageSize?: number }) {
    const { entityType, entityId, userId, page = 1, pageSize = 20 } = filters;
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (entityType) where['entityType'] = entityType;
    if (entityId) where['entityId'] = entityId;
    if (userId) where['userId'] = userId;

    const [items, total] = await Promise.all([
      this.prisma.auditEntry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { timestamp: 'desc' },
        include: { user: { select: { id: true, displayName: true } } },
      }),
      this.prisma.auditEntry.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
}
