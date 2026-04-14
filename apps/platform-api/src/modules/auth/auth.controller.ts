import { Controller, Get, Post, Body, Req, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with username/password (LDAP or local)' })
  @HttpCode(200)
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new local user' })
  async register(@Body() body: { username: string; email: string; password: string; firstName: string; lastName: string }) {
    return this.authService.register(body);
  }

  @Post('token/validate')
  @ApiOperation({ summary: 'Validate access token' })
  @HttpCode(200)
  async validateToken(@Body() body: { token: string }) {
    const result = await this.authService.validateToken(body.token);
    return { valid: !!result, user: result };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser('id') userId: string) {
    const user = await this.authService.getMe(userId);
    return { user };
  }

  @Post('ldap/sync')
  @ApiOperation({ summary: 'Sync users and groups from LDAP' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async syncLdap() {
    return this.authService.syncLdapUsers();
  }
}
