import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { displayName: 'asc' },
        select: {
          id: true, username: true, email: true, firstName: true, lastName: true,
          displayName: true, avatar: true, active: true, lastLoginAt: true,
          createdAt: true, ldapDn: true,
        },
      }),
      this.prisma.user.count(),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, username: true, email: true, firstName: true, lastName: true,
        displayName: true, avatar: true, active: true, lastLoginAt: true,
        createdAt: true, ldapDn: true,
        groups: { include: { group: { select: { id: true, name: true } } } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      ...user,
      groups: user.groups.map((ug: { group: { id: string; name: string } }) => ug.group),
    };
  }

  async update(id: string, data: { firstName?: string; lastName?: string; email?: string; active?: boolean }) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        displayName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
      },
    });
    return user;
  }

  async count() {
    return this.prisma.user.count();
  }

  async syncFromLdap() {
    return { synced: 0, message: 'Use POST /auth/ldap/sync to synchronize LDAP users' };
  }
}
