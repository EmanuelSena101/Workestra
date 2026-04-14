import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'List audit log entries' })
  async findAll(
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('userId') userId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.auditService.findAll({ action, entityType, userId, from, to, page, pageSize });
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Get audit log for a specific entity' })
  async findByEntity(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.auditService.findByEntity(entityType, entityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get audit log for a specific user' })
  async findByUser(@Param('userId') userId: string) {
    return this.auditService.findByUser(userId);
  }
}
