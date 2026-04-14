import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationsService {
  async findAll() {
    return { data: [], total: 0 };
  }

  async findById(id: string) {
    return null;
  }

  async create(data: { name: string; type: string; config: Record<string, unknown> }) {
    return { id: '', name: data.name, type: data.type };
  }

  async update(id: string, data: Record<string, unknown>) {
    return { id, updated: true };
  }

  async delete(id: string) {
    return { deleted: true };
  }

  async testConnection(id: string) {
    return { success: true };
  }

  async executeWebhook(integrationId: string, payload: Record<string, unknown>) {
    return { executed: true };
  }
}
