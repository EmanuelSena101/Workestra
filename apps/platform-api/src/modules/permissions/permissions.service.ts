import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async checkPermission(subjectType: string, subjectId: string, entityType: string, entityId: string, action: string): Promise<boolean> {
    const permission = await this.prisma.permission.findFirst({
      where: {
        subjectType,
        subjectId,
        entityType,
        entityId,
        actions: { has: action },
      },
    });
    return !!permission;
  }

  async grant(data: { entityType: string; entityId: string; subjectType: string; subjectId: string; actions: string[] }) {
    const existing = await this.prisma.permission.findFirst({
      where: {
        entityType: data.entityType,
        entityId: data.entityId,
        subjectType: data.subjectType,
        subjectId: data.subjectId,
      },
    });

    if (existing) {
      const merged = [...new Set([...existing.actions, ...data.actions])];
      return this.prisma.permission.update({
        where: { id: existing.id },
        data: { actions: merged },
      });
    }

    return this.prisma.permission.create({ data });
  }

  async revoke(id: string) {
    await this.prisma.permission.delete({ where: { id } });
    return { revoked: true };
  }

  async listForEntity(entityType: string, entityId: string) {
    return this.prisma.permission.findMany({
      where: { entityType, entityId },
    });
  }

  async listForSubject(subjectType: string, subjectId: string) {
    return this.prisma.permission.findMany({
      where: { subjectType, subjectId },
    });
  }
}
