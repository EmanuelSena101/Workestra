import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  @ApiOperation({ summary: 'List process definitions' })
  async findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.workflowsService.findAll(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get process count' })
  async count() {
    const total = await this.workflowsService.count();
    return { total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get process definition by ID' })
  async findById(@Param('id') id: string) {
    return this.workflowsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a process definition' })
  async create(@Body() body: { key: string; name: string; description?: string; category?: string; formKey?: string; bpmnXml?: string }) {
    return this.workflowsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update process definition' })
  async update(@Param('id') id: string, @Body() body: { name?: string; description?: string; category?: string; deployed?: boolean }) {
    return this.workflowsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete process definition' })
  async delete(@Param('id') id: string) {
    return this.workflowsService.delete(id);
  }
}
