import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'List integrations' })
  async findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.integrationsService.findAll(page ? parseInt(page, 10) : 1, pageSize ? parseInt(pageSize, 10) : 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration by ID' })
  async findById(@Param('id') id: string) {
    return this.integrationsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create integration' })
  async create(@Body() body: { name: string; type: string; provider: string; config: unknown; enabled?: boolean }) {
    return this.integrationsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update integration' })
  async update(@Param('id') id: string, @Body() body: { name?: string; config?: unknown; enabled?: boolean }) {
    return this.integrationsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete integration' })
  async delete(@Param('id') id: string) {
    return this.integrationsService.delete(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test integration connection' })
  async test(@Param('id') id: string) {
    return this.integrationsService.test(id);
  }
}
