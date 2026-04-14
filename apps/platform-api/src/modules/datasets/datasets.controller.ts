import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DatasetsService } from './datasets.service';

@ApiTags('Datasets')
@ApiBearerAuth()
@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  @ApiOperation({ summary: 'List dataset definitions' })
  async findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.datasetsService.findAll({ page, pageSize });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dataset definition by ID' })
  async findById(@Param('id') id: string) {
    return this.datasetsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create dataset definition' })
  async create(@Body() body: {
    name: string;
    description?: string;
    sourceType: string;
    config: Record<string, unknown>;
    fields: { name: string; type: string; label: string }[];
  }) {
    return this.datasetsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update dataset definition' })
  async update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.datasetsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete dataset definition' })
  async delete(@Param('id') id: string) {
    return this.datasetsService.delete(id);
  }

  @Post(':id/query')
  @ApiOperation({ summary: 'Query dataset (unified data interface)' })
  async query(@Param('id') id: string, @Body() body: {
    filters?: Record<string, unknown>;
    fields?: string[];
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return this.datasetsService.query(id, body);
  }

  @Post(':id/test-connection')
  @ApiOperation({ summary: 'Test dataset connection' })
  async testConnection(@Param('id') id: string) {
    return this.datasetsService.testConnection(id);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Sync dataset cache' })
  async syncCache(@Param('id') id: string) {
    return this.datasetsService.syncCache(id);
  }
}
