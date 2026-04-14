import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async search(query: string, types?: string[], page = 1, pageSize = 20) {
    if (!query || query.trim().length === 0) {
      return { results: [], total: 0, query };
    }

    const searchTypes = types && types.length > 0 ? types : ['documents', 'tasks', 'requests', 'processes', 'users'];
    const results: Array<{ type: string; id: string; title: string; description?: string; url?: string }> = [];

    const searches = searchTypes.map(async (type) => {
      switch (type) {
        case 'documents':
          return this.searchDocuments(query);
        case 'tasks':
          return this.searchTasks(query);
        case 'requests':
          return this.searchRequests(query);
        case 'processes':
          return this.searchProcesses(query);
        case 'users':
          return this.searchUsers(query);
        default:
          return [];
      }
    });

    const searchResults = await Promise.all(searches);
    for (const items of searchResults) {
      results.push(...items);
    }

    const total = results.length;
    const skip = (page - 1) * pageSize;
    const paged = results.slice(skip, skip + pageSize);

    return { results: paged, total, query, page, pageSize };
  }

  private async searchDocuments(query: string) {
    const docs = await this.prisma.document.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { extractedText: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: { id: true, name: true, mimeType: true },
    });
    return docs.map((d: typeof docs[number]) => ({ type: 'document' as const, id: d.id, title: d.name, description: d.mimeType, url: `/documents/${d.id}` }));
  }

  private async searchTasks(query: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { processName: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: { id: true, title: true, status: true },
    });
    return tasks.map((t: typeof tasks[number]) => ({ type: 'task' as const, id: t.id, title: t.title, description: t.status, url: `/tasks/${t.id}` }));
  }

  private async searchRequests(query: string) {
    const requests = await this.prisma.request.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { requestNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: { id: true, title: true, requestNumber: true, status: true },
    });
    return requests.map((r: typeof requests[number]) => ({ type: 'request' as const, id: r.id, title: `${r.requestNumber} - ${r.title}`, description: r.status, url: `/requests/${r.id}` }));
  }

  private async searchProcesses(query: string) {
    const processes = await this.prisma.processDefinition.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      take: 10,
      select: { id: true, name: true, category: true },
    });
    return processes.map((p: typeof processes[number]) => ({ type: 'process' as const, id: p.id, title: p.name, description: p.category || undefined, url: `/processes/${p.id}` }));
  }

  private async searchUsers(query: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { displayName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: { id: true, displayName: true, email: true },
    });
    return users.map((u: typeof users[number]) => ({ type: 'user' as const, id: u.id, title: u.displayName, description: u.email, url: `/admin/users/${u.id}` }));
  }
}
