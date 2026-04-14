import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Get permissions for an entity' })
  async getPermissions(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.permissionsService.getPermissions(entityType, entityId);
  }

  @Post()
  @ApiOperation({ summary: 'Grant permission' })
  async grantPermission(
    @Body() body: { entityType: string; entityId: string; subjectType: string; subjectId: string; actions: string[] },
  ) {
    return this.permissionsService.grantPermission(body.entityType, body.entityId, body.subjectType, body.subjectId, body.actions);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke permission' })
  async revokePermission(@Param('id') id: string) {
    return this.permissionsService.revokePermission(id);
  }
}
