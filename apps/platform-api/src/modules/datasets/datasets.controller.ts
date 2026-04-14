import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DatasetsService } from './datasets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Datasets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  @ApiOperation({ summary: 'List dataset definitions' })
  async findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.datasetsService.findAll(page ? parseInt(page, 10) : 1, pageSize ? parseInt(pageSize, 10) : 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dataset definition by ID' })
  async findById(@Param('id') id: string) {
    return this.datasetsService.findById(id);
  }

  @Get(':id/query')
  @ApiOperation({ summary: 'Query dataset' })
  async query(@Param('id') id: string, @Query() params: Record<string, string>) {
    return this.datasetsService.query(id, params);
  }

  @Post()
  @ApiOperation({ summary: 'Create dataset definition' })
  async create(
    @Body() body: { name: string; description?: string; sourceType: string; config: unknown; fields: unknown; cacheTtl?: number },
    @CurrentUser('id') userId: string,
  ) {
    return this.datasetsService.create(body, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update dataset definition' })
  async update(@Param('id') id: string, @Body() body: { name?: string; description?: string; config?: unknown; fields?: unknown }) {
    return this.datasetsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete dataset definition' })
  async delete(@Param('id') id: string) {
    return this.datasetsService.delete(id);
  }
}
