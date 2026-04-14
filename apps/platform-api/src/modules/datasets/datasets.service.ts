import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DatasetsService {
  private readonly logger = new Logger(DatasetsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.datasetDefinition.findMany({ skip, take: pageSize, orderBy: { name: 'asc' } }),
      this.prisma.datasetDefinition.count(),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string) {
    const ds = await this.prisma.datasetDefinition.findUnique({ where: { id } });
    if (!ds) throw new NotFoundException('Dataset definition not found');
    return ds;
  }

  async create(data: { name: string; description?: string; sourceType: string; config: unknown; fields: unknown; cacheTtl?: number }, userId: string) {
    return this.prisma.datasetDefinition.create({
      data: { ...data, config: data.config as any, fields: data.fields as any, createdBy: userId },
    });
  }

  async update(id: string, data: { name?: string; description?: string; config?: unknown; fields?: unknown; cacheTtl?: number }) {
    return this.prisma.datasetDefinition.update({
      where: { id },
      data: { ...data, config: data.config as any, fields: data.fields as any },
    });
  }

  async delete(id: string) {
    await this.prisma.datasetDefinition.delete({ where: { id } });
    return { deleted: true };
  }

  async query(id: string, params?: Record<string, string>) {
    const ds = await this.prisma.datasetDefinition.findUnique({ where: { id } });
    if (!ds) throw new NotFoundException('Dataset definition not found');

    switch (ds.sourceType) {
      case 'internal':
        return this.queryInternal(ds);
      case 'rest':
        return this.queryRest(ds, params);
      default:
        return { data: [], message: `Source type '${ds.sourceType}' requires external credentials. Configure via env vars.` };
    }
  }

  private async queryInternal(ds: { config: unknown }) {
    const config = ds.config as { table?: string };
    if (!config.table) return { data: [] };

    try {
      const result = await this.prisma.$queryRawUnsafe(`SELECT * FROM "${config.table}" LIMIT 100`);
      return { data: result };
    } catch (err) {
      return { data: [], error: (err as Error).message };
    }
  }

  private async queryRest(ds: { config: unknown }, params?: Record<string, string>) {
    const config = ds.config as { url?: string; method?: string; headers?: Record<string, string> };
    if (!config.url) return { data: [], error: 'No URL configured' };

    try {
      let url = config.url;
      if (params) {
        const searchParams = new URLSearchParams(params);
        url += (url.includes('?') ? '&' : '?') + searchParams.toString();
      }

      const response = await fetch(url, {
        method: config.method || 'GET',
        headers: config.headers,
      });

      if (!response.ok) {
        return { data: [], error: `HTTP ${response.status}: ${response.statusText}` };
      }

      const data = await response.json();
      return { data };
    } catch (err) {
      return { data: [], error: (err as Error).message };
    }
  }
}
