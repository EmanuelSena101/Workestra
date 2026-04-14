import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  async dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get system status' })
  async status() {
    return this.adminService.getSystemStatus();
  }

  @Get('groups')
  @ApiOperation({ summary: 'List groups' })
  async listGroups(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.adminService.listGroups(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Post('groups')
  @ApiOperation({ summary: 'Create group' })
  async createGroup(@Body() body: { name: string; description?: string; parentId?: string }) {
    return this.adminService.createGroup(body);
  }

  @Delete('groups/:id')
  @ApiOperation({ summary: 'Delete group' })
  async deleteGroup(@Param('id') id: string) {
    return this.adminService.deleteGroup(id);
  }

  @Get('announcements')
  @ApiOperation({ summary: 'List active announcements' })
  async listAnnouncements() {
    return this.adminService.listAnnouncements();
  }

  @Post('announcements')
  @ApiOperation({ summary: 'Create announcement' })
  async createAnnouncement(@Body() body: { title: string; content: string; type?: string; expiresAt?: string }) {
    return this.adminService.createAnnouncement(body);
  }

  @Get('portals')
  @ApiOperation({ summary: 'List portals' })
  async listPortals(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.adminService.listPortals(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Post('portals')
  @ApiOperation({ summary: 'Create portal' })
  async createPortal(@Body() body: { name: string; description?: string }) {
    return this.adminService.createPortal(body);
  }

  @Delete('portals/:id')
  @ApiOperation({ summary: 'Delete portal' })
  async deletePortal(@Param('id') id: string) {
    return this.adminService.deletePortal(id);
  }

  @Get('communities')
  @ApiOperation({ summary: 'List communities' })
  async listCommunities(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.adminService.listCommunities(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Post('communities')
  @ApiOperation({ summary: 'Create community' })
  async createCommunity(@Body() body: { name: string; description?: string }) {
    return this.adminService.createCommunity(body);
  }

  @Delete('communities/:id')
  @ApiOperation({ summary: 'Delete community' })
  async deleteCommunity(@Param('id') id: string) {
    return this.adminService.deleteCommunity(id);
  }
}
