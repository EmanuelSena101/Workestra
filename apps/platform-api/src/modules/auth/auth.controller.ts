import { Controller, Get, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @ApiOperation({ summary: 'Get Keycloak login URL' })
  getLoginUrl() {
    return { loginUrl: this.authService.getLoginUrl() };
  }

  @Post('token/validate')
  @ApiOperation({ summary: 'Validate access token' })
  @ApiBearerAuth()
  @HttpCode(200)
  async validateToken(@Body() body: { token: string }) {
    const result = await this.authService.validateToken(body.token);
    return { valid: !!result, user: result };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiBearerAuth()
  async me(@Req() req: { headers: { authorization?: string } }) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return { user: null };
    }
    const user = await this.authService.getUserInfo(token);
    return { user };
  }
}
