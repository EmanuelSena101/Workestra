import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async findByUser(userId: string, filters: Record<string, unknown> = {}) {
    return { data: [], total: 0, unreadCount: 0 };
  }

  async markAsRead(id: string) {
    return { read: true };
  }

  async markAllAsRead(userId: string) {
    return { markedCount: 0 };
  }

  async create(notification: {
    type: string;
    title: string;
    message: string;
    userId: string;
    link?: string;
  }) {
    // TODO: Persist notification and optionally send email via SMTP
    return { id: '', created: true };
  }

  async sendEmail(to: string, subject: string, body: string, templateId?: string) {
    // TODO: Send via SMTP
    return { sent: true };
  }

  async getUnreadCount(userId: string) {
    return { count: 0 };
  }
}
