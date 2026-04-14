import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';

@ApiTags('Integrations')
@ApiBearerAuth()
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'List integrations' })
  async findAll() {
    return this.integrationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration by ID' })
  async findById(@Param('id') id: string) {
    return this.integrationsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create integration' })
  async create(@Body() body: { name: string; type: string; config: Record<string, unknown> }) {
    return this.integrationsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update integration' })
  async update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.integrationsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete integration' })
  async delete(@Param('id') id: string) {
    return this.integrationsService.delete(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test integration connection' })
  async testConnection(@Param('id') id: string) {
    return this.integrationsService.testConnection(id);
  }
}
