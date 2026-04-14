import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // TODO: Integrate with Prisma + Keycloak for user management
  async findAll(page = 1, pageSize = 20) {
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  async findById(id: string) {
    return null;
  }

  async findByUsername(username: string) {
    return null;
  }

  async syncFromKeycloak() {
    // TODO: Sync users from Keycloak realm
    return { synced: 0 };
  }
}
