import { Controller, Get, Post, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HomeService } from './home.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Home')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get home dashboard data' })
  async dashboard(@CurrentUser('id') userId: string) {
    return this.homeService.getDashboard(userId);
  }

  @Post('favorites')
  @ApiOperation({ summary: 'Add favorite' })
  async addFavorite(
    @CurrentUser('id') userId: string,
    @Body() body: { entityType: string; entityId: string; label: string },
  ) {
    return this.homeService.addFavorite(userId, body.entityType, body.entityId, body.label);
  }

  @Delete('favorites')
  @ApiOperation({ summary: 'Remove favorite' })
  async removeFavorite(
    @CurrentUser('id') userId: string,
    @Body() body: { entityType: string; entityId: string },
  ) {
    return this.homeService.removeFavorite(userId, body.entityType, body.entityId);
  }
}
