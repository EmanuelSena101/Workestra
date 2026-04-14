import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('system-info')
  @ApiOperation({ summary: 'Get system information and status' })
  async getSystemInfo() {
    return this.adminService.getSystemInfo();
  }

  @Get('groups')
  @ApiOperation({ summary: 'List groups' })
  async getGroups() {
    return this.adminService.getGroups();
  }

  @Post('groups')
  @ApiOperation({ summary: 'Create group' })
  async createGroup(@Body() body: { name: string; description?: string }) {
    return this.adminService.createGroup(body);
  }

  @Get('roles')
  @ApiOperation({ summary: 'List roles' })
  async getRoles() {
    return this.adminService.getRoles();
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create role' })
  async createRole(@Body() body: { name: string; permissions: string[] }) {
    return this.adminService.createRole(body);
  }

  @Get('smtp')
  @ApiOperation({ summary: 'Get SMTP configuration' })
  async getSmtpConfig() {
    return this.adminService.getSmtpConfig();
  }
}
