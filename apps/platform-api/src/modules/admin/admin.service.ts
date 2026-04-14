import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [userCount, groupCount, documentCount, taskCount, requestCount, processCount,
           portalCount, communityCount, notificationCount, auditCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.group.count(),
      this.prisma.document.count(),
      this.prisma.task.count(),
      this.prisma.request.count(),
      this.prisma.processDefinition.count(),
      this.prisma.portal.count(),
      this.prisma.community.count(),
      this.prisma.notification.count(),
      this.prisma.auditEntry.count(),
    ]);

    return {
      sections: [
        { id: 'users', label: 'Usuários', count: userCount, icon: 'Users' },
        { id: 'groups', label: 'Grupos', count: groupCount, icon: 'Users' },
        { id: 'documents', label: 'Documentos', count: documentCount, icon: 'FileText' },
        { id: 'tasks', label: 'Tarefas', count: taskCount, icon: 'CheckSquare' },
        { id: 'requests', label: 'Solicitações', count: requestCount, icon: 'FileText' },
        { id: 'processes', label: 'Processos', count: processCount, icon: 'GitBranch' },
        { id: 'portals', label: 'Portais', count: portalCount, icon: 'Layout' },
        { id: 'communities', label: 'Comunidades', count: communityCount, icon: 'Users' },
        { id: 'notifications', label: 'Notificações', count: notificationCount, icon: 'Bell' },
        { id: 'audit', label: 'Auditoria', count: auditCount, icon: 'Shield' },
      ],
    };
  }

  async getSystemStatus() {
    const dbConnected = await this.checkDb();
    return {
      services: [
        { name: 'Database', status: dbConnected ? 'connected' : 'disconnected', message: dbConnected ? 'PostgreSQL connected' : 'Cannot reach database' },
        { name: 'LDAP', status: process.env.LDAP_URL ? 'configured' : 'not_configured', message: process.env.LDAP_URL ? 'LDAP configured' : 'LDAP not configured' },
        { name: 'MinIO', status: process.env.MINIO_ENDPOINT ? 'configured' : 'not_configured', message: process.env.MINIO_ENDPOINT ? 'MinIO configured' : 'MinIO not configured' },
        { name: 'OpenSearch', status: process.env.OPENSEARCH_URL ? 'configured' : 'not_configured', message: process.env.OPENSEARCH_URL ? 'OpenSearch configured' : 'OpenSearch not configured' },
        { name: 'Tika', status: process.env.TIKA_URL ? 'configured' : 'not_configured', message: process.env.TIKA_URL ? 'Tika configured' : 'Tika not configured' },
        { name: 'Zeebe', status: process.env.ZEEBE_ADDRESS ? 'configured' : 'not_configured', message: process.env.ZEEBE_ADDRESS ? 'Zeebe configured' : 'Zeebe not configured' },
        { name: 'Push (VAPID)', status: process.env.VAPID_PUBLIC_KEY ? 'configured' : 'not_configured', message: process.env.VAPID_PUBLIC_KEY ? 'VAPID keys configured' : 'VAPID keys not configured' },
      ],
    };
  }

  // ── Groups Management ──

  async listGroups(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.group.findMany({
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: { _count: { select: { members: true } } },
      }),
      this.prisma.group.count(),
    ]);
    return {
      items: items.map((g: typeof items[number]) => ({ ...g, memberCount: g._count.members })),
      total, page, pageSize, totalPages: Math.ceil(total / pageSize),
    };
  }

  async createGroup(data: { name: string; description?: string; parentId?: string }) {
    return this.prisma.group.create({ data });
  }

  async deleteGroup(id: string) {
    await this.prisma.group.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Announcements ──

  async listAnnouncements() {
    return this.prisma.announcement.findMany({
      where: {
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(data: { title: string; content: string; type?: string; expiresAt?: string }) {
    return this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'info',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
  }

  // ── Portals ──

  async listPortals(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.portal.findMany({
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: { _count: { select: { pages: true } } },
      }),
      this.prisma.portal.count(),
    ]);
    return {
      items: items.map((p: typeof items[number]) => ({ ...p, pageCount: p._count.pages })),
      total, page, pageSize, totalPages: Math.ceil(total / pageSize),
    };
  }

  async createPortal(data: { name: string; description?: string }) {
    return this.prisma.portal.create({ data });
  }

  async deletePortal(id: string) {
    await this.prisma.portal.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Communities ──

  async listCommunities(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.community.findMany({
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: { _count: { select: { posts: true } } },
      }),
      this.prisma.community.count(),
    ]);
    return {
      items: items.map((c: typeof items[number]) => ({ ...c, postCount: c._count.posts })),
      total, page, pageSize, totalPages: Math.ceil(total / pageSize),
    };
  }

  async createCommunity(data: { name: string; description?: string }) {
    return this.prisma.community.create({ data });
  }

  async deleteCommunity(id: string) {
    await this.prisma.community.delete({ where: { id } });
    return { deleted: true };
  }

  private async checkDb(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
