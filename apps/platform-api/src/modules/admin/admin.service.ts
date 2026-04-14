import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  async getSystemInfo() {
    return {
      version: '0.1.0',
      services: {
        database: 'connected',
        keycloak: 'connected',
        camunda: 'connected',
        minio: 'connected',
        opensearch: 'connected',
        tika: 'connected',
        smtp: 'configured',
      },
      stats: {
        users: 0,
        groups: 0,
        processes: 0,
        documents: 0,
        datasets: 0,
      },
    };
  }

  async getGroups() {
    return { data: [], total: 0 };
  }

  async getRoles() {
    return { data: [], total: 0 };
  }

  async createGroup(data: { name: string; description?: string }) {
    return { id: '', name: data.name };
  }

  async createRole(data: { name: string; permissions: string[] }) {
    return { id: '', name: data.name };
  }

  async getSmtpConfig() {
    return { host: '', port: 587, secure: true };
  }

  async updateSmtpConfig(config: Record<string, unknown>) {
    return { updated: true };
  }
}
