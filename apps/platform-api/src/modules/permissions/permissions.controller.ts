import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('check')
  @ApiOperation({ summary: 'Check permission' })
  async check(
    @Query('subjectType') subjectType: string,
    @Query('subjectId') subjectId: string,
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
    @Query('action') action: string,
  ) {
    const allowed = await this.permissionsService.checkPermission(subjectType, subjectId, entityType, entityId, action);
    return { allowed };
  }

  @Post()
  @ApiOperation({ summary: 'Grant permission' })
  async grant(@Body() body: { entityType: string; entityId: string; subjectType: string; subjectId: string; actions: string[] }) {
    return this.permissionsService.grant(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke permission' })
  async revoke(@Param('id') id: string) {
    return this.permissionsService.revoke(id);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'List permissions for entity' })
  async listForEntity(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.permissionsService.listForEntity(entityType, entityId);
  }
}
