import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly ldapUrl: string | undefined;
  private readonly ldapBindDn: string | undefined;
  private readonly ldapBindPassword: string | undefined;
  private readonly ldapSearchBase: string | undefined;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET', 'workestra-jwt-secret-change-in-production');
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '8h');
    this.ldapUrl = this.configService.get<string>('LDAP_URL');
    this.ldapBindDn = this.configService.get<string>('LDAP_BIND_DN');
    this.ldapBindPassword = this.configService.get<string>('LDAP_BIND_PASSWORD');
    this.ldapSearchBase = this.configService.get<string>('LDAP_SEARCH_BASE');
  }

  async login(username: string, password: string): Promise<{ access_token: string; user: Record<string, unknown> }> {
    // Try LDAP authentication first if configured
    if (this.ldapUrl) {
      return this.loginWithLdap(username, password);
    }

    // Fall back to local database authentication
    return this.loginWithLocal(username, password);
  }

  private async loginWithLocal(username: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
        active: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('User has no local password. LDAP authentication may be required.');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const access_token = this.generateToken(user);
    return {
      access_token,
      user: this.sanitizeUser(user),
    };
  }

  private async loginWithLdap(username: string, password: string) {
    try {
      const ldap = await import('ldapjs');
      const client = ldap.createClient({ url: this.ldapUrl! });

      // First, bind with service account to search for the user
      await new Promise<void>((resolve, reject) => {
        client.bind(this.ldapBindDn!, this.ldapBindPassword!, (err) => {
          if (err) reject(new UnauthorizedException('LDAP service bind failed'));
          else resolve();
        });
      });

      // Search for user
      const searchFilter = `(|(uid=${username})(sAMAccountName=${username})(mail=${username}))`;
      const searchResult = await new Promise<Record<string, string>>((resolve, reject) => {
        client.search(this.ldapSearchBase!, {
          filter: searchFilter,
          scope: 'sub',
          attributes: ['dn', 'uid', 'cn', 'sn', 'givenName', 'mail', 'memberOf', 'displayName'],
        }, (err, res) => {
          if (err) return reject(err);

          let found: Record<string, string> | null = null;
          res.on('searchEntry', (entry) => {
            const attrs: Record<string, string> = {};
            attrs['dn'] = entry.dn.toString();
            for (const attr of entry.attributes) {
              attrs[attr.type] = attr.values[0] || '';
            }
            found = attrs;
          });
          res.on('error', (e) => reject(e));
          res.on('end', () => {
            if (found) resolve(found);
            else reject(new UnauthorizedException('User not found in LDAP'));
          });
        });
      });

      // Bind as the found user to validate password
      await new Promise<void>((resolve, reject) => {
        const userClient = ldap.createClient({ url: this.ldapUrl! });
        userClient.bind(searchResult['dn'], password, (err) => {
          userClient.unbind();
          if (err) reject(new UnauthorizedException('Invalid LDAP credentials'));
          else resolve();
        });
      });

      client.unbind();

      // Upsert user in local database
      const user = await this.prisma.user.upsert({
        where: { ldapDn: searchResult['dn'] },
        create: {
          ldapDn: searchResult['dn'],
          username: searchResult['uid'] || searchResult['sAMAccountName'] || username,
          email: searchResult['mail'] || `${username}@local`,
          firstName: searchResult['givenName'] || username,
          lastName: searchResult['sn'] || '',
          displayName: searchResult['displayName'] || searchResult['cn'] || username,
          active: true,
          lastLoginAt: new Date(),
        },
        update: {
          firstName: searchResult['givenName'] || undefined,
          lastName: searchResult['sn'] || undefined,
          displayName: searchResult['displayName'] || searchResult['cn'] || undefined,
          email: searchResult['mail'] || undefined,
          lastLoginAt: new Date(),
        },
      });

      const access_token = this.generateToken(user);
      return { access_token, user: this.sanitizeUser(user) };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.error(`LDAP error: ${(err as Error).message}`);
      throw new UnauthorizedException('LDAP authentication failed');
    }
  }

  async register(data: { username: string; email: string; password: string; firstName: string; lastName: string }) {
    const hash = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: hash,
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: `${data.firstName} ${data.lastName}`,
      },
    });
    const access_token = this.generateToken(user);
    return { access_token, user: this.sanitizeUser(user) };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as jwt.JwtPayload;
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub as string } });
      if (!user || !user.active) return null;
      return this.sanitizeUser(user);
    } catch {
      return null;
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { groups: { include: { group: true } } },
    });
    if (!user) return null;
    return {
      ...this.sanitizeUser(user),
      groups: user.groups.map((ug: { group: { id: string; name: string } }) => ({ id: ug.group.id, name: ug.group.name })),
    };
  }

  async syncLdapUsers(): Promise<{ synced: number; errors: string[] }> {
    if (!this.ldapUrl) {
      return { synced: 0, errors: ['LDAP not configured'] };
    }

    const ldap = await import('ldapjs');
    const client = ldap.createClient({ url: this.ldapUrl });
    const errors: string[] = [];
    let synced = 0;

    try {
      await new Promise<void>((resolve, reject) => {
        client.bind(this.ldapBindDn!, this.ldapBindPassword!, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const users = await new Promise<Array<Record<string, string>>>((resolve, reject) => {
        const results: Array<Record<string, string>> = [];
        client.search(this.ldapSearchBase!, {
          filter: '(objectClass=person)',
          scope: 'sub',
          attributes: ['dn', 'uid', 'cn', 'sn', 'givenName', 'mail', 'displayName'],
        }, (err, res) => {
          if (err) return reject(err);
          res.on('searchEntry', (entry) => {
            const attrs: Record<string, string> = {};
            attrs['dn'] = entry.dn.toString();
            for (const attr of entry.attributes) {
              attrs[attr.type] = attr.values[0] || '';
            }
            results.push(attrs);
          });
          res.on('error', (e) => reject(e));
          res.on('end', () => resolve(results));
        });
      });

      for (const ldapUser of users) {
        try {
          await this.prisma.user.upsert({
            where: { ldapDn: ldapUser['dn'] },
            create: {
              ldapDn: ldapUser['dn'],
              username: ldapUser['uid'] || ldapUser['cn'] || `ldap-${synced}`,
              email: ldapUser['mail'] || `${ldapUser['uid'] || ldapUser['cn']}@local`,
              firstName: ldapUser['givenName'] || '',
              lastName: ldapUser['sn'] || '',
              displayName: ldapUser['displayName'] || ldapUser['cn'] || '',
              active: true,
            },
            update: {
              firstName: ldapUser['givenName'] || undefined,
              lastName: ldapUser['sn'] || undefined,
              displayName: ldapUser['displayName'] || ldapUser['cn'] || undefined,
              email: ldapUser['mail'] || undefined,
            },
          });
          synced++;
        } catch (e) {
          errors.push(`Failed to sync ${ldapUser['dn']}: ${(e as Error).message}`);
        }
      }

      client.unbind();
    } catch (e) {
      errors.push(`LDAP connection error: ${(e as Error).message}`);
    }

    return { synced, errors };
  }

  private generateToken(user: { id: string; username: string; email: string; displayName: string }): string {
    return jwt.sign(
      {
        sub: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as jwt.SignOptions,
    );
  }

  private sanitizeUser(user: Record<string, unknown>) {
    const { passwordHash, ...safe } = user as { passwordHash?: string; [key: string]: unknown };
    return safe;
  }
}
