import { Injectable } from '@nestjs/common';

@Injectable()
export class FormsService {
  async findAll(filters: Record<string, unknown> = {}) {
    return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }

  async findById(id: string) {
    return null;
  }

  async create(data: { name: string; fields: Record<string, unknown>[]; processDefinitionKey?: string }) {
    // TODO: Persist form definition to PostgreSQL
    return { id: '', name: data.name, version: 1 };
  }

  async update(id: string, data: Record<string, unknown>) {
    return { id, updated: true };
  }

  async delete(id: string) {
    return { deleted: true };
  }

  async getFormByProcessTask(processDefinitionKey: string, taskDefinitionId: string) {
    // TODO: Resolve form definition for a workflow task
    return null;
  }
}
