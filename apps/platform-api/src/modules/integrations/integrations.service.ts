import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.integrationConfig.findMany({ skip, take: pageSize, orderBy: { name: 'asc' } }),
      this.prisma.integrationConfig.count(),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string) {
    const integration = await this.prisma.integrationConfig.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');
    return integration;
  }

  async create(data: { name: string; type: string; provider: string; config: unknown; enabled?: boolean }) {
    return this.prisma.integrationConfig.create({
      data: { ...data, config: data.config as any, enabled: data.enabled ?? true },
    });
  }

  async update(id: string, data: { name?: string; config?: unknown; enabled?: boolean }) {
    return this.prisma.integrationConfig.update({
      where: { id },
      data: { ...data, config: data.config as any },
    });
  }

  async delete(id: string) {
    await this.prisma.integrationConfig.delete({ where: { id } });
    return { deleted: true };
  }

  async test(id: string) {
    const integration = await this.prisma.integrationConfig.findUnique({ where: { id } });
    if (!integration) throw new NotFoundException('Integration not found');

    const config = integration.config as Record<string, unknown>;

    switch (integration.provider) {
      case 'mattermost':
        return this.testMattermost(config);
      case 'google_chat':
        return this.testGoogleChat(config);
      default:
        return { success: false, message: `Provider '${integration.provider}' test not implemented. Configure credentials via env vars.` };
    }
  }

  private async testMattermost(config: Record<string, unknown>) {
    const url = config.webhookUrl as string;
    if (!url) return { success: false, message: 'Webhook URL not configured' };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Workestra integration test' }),
      });
      return { success: response.ok, status: response.status };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }

  private async testGoogleChat(config: Record<string, unknown>) {
    const url = config.webhookUrl as string;
    if (!url) return { success: false, message: 'Webhook URL not configured' };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Workestra integration test' }),
      });
      return { success: response.ok, status: response.status };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }
}
