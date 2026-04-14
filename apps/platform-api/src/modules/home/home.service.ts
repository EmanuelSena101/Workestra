import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [
      pendingTasks,
      recentRequests,
      recentDocuments,
      unreadNotifications,
      announcements,
      favorites,
      taskCount,
      requestCount,
      documentCount,
    ] = await Promise.all([
      this.prisma.task.findMany({
        where: { assigneeId: userId, status: { in: ['pending', 'in_progress'] } },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.request.findMany({
        where: { requesterId: userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { processDefinition: { select: { name: true } } },
      }),
      this.prisma.document.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: { createdBy: { select: { displayName: true } } },
      }),
      this.prisma.notification.count({ where: { userId, read: false } }),
      this.prisma.announcement.findMany({
        where: {
          active: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.favorite.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where: { assigneeId: userId, status: { in: ['pending', 'in_progress'] } } }),
      this.prisma.request.count({ where: { requesterId: userId } }),
      this.prisma.document.count(),
    ]);

    return {
      pendingTasks,
      recentRequests,
      recentDocuments,
      unreadNotifications,
      announcements,
      favorites,
      stats: {
        pendingTaskCount: taskCount,
        myRequestCount: requestCount,
        totalDocuments: documentCount,
      },
    };
  }

  async addFavorite(userId: string, entityType: string, entityId: string, label: string) {
    return this.prisma.favorite.upsert({
      where: { userId_entityType_entityId: { userId, entityType, entityId } },
      create: { userId, entityType, entityId, label },
      update: { label },
    });
  }

  async removeFavorite(userId: string, entityType: string, entityId: string) {
    await this.prisma.favorite.deleteMany({ where: { userId, entityType, entityId } });
    return { removed: true };
  }
}
