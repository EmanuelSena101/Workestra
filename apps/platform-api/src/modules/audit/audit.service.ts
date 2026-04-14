import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  async log(entry: {
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    userName: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    // TODO: Persist audit entry to PostgreSQL
    return { id: '', logged: true };
  }

  async findAll(filters: Record<string, unknown> = {}) {
    return { data: [], total: 0, page: 1, pageSize: 50, totalPages: 0 };
  }

  async findByEntity(entityType: string, entityId: string) {
    return [];
  }

  async findByUser(userId: string, filters: Record<string, unknown> = {}) {
    return { data: [], total: 0 };
  }
}
