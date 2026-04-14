import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestsService {
  async findAll(filters: Record<string, unknown> = {}) {
    return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  }

  async findById(id: string) {
    return null;
  }

  async create(data: { processDefinitionKey: string; title: string; formData: Record<string, unknown> }) {
    // TODO: Start process instance in Camunda and create request record
    return { id: '', requestNumber: '', processInstanceId: '' };
  }

  async cancel(id: string, reason?: string) {
    return { cancelled: true };
  }

  async getHistory(id: string) {
    return [];
  }

  async addComment(id: string, content: string, authorId: string) {
    return { id: '', content, createdAt: new Date().toISOString() };
  }
}
