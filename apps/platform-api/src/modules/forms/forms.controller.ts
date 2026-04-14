import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FormsService } from './forms.service';

@ApiTags('Forms')
@ApiBearerAuth()
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  @ApiOperation({ summary: 'List form definitions' })
  async findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.formsService.findAll({ page, pageSize });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get form definition by ID' })
  async findById(@Param('id') id: string) {
    return this.formsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create form definition' })
  async create(@Body() body: { name: string; fields: Record<string, unknown>[]; processDefinitionKey?: string }) {
    return this.formsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update form definition' })
  async update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.formsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete form definition' })
  async delete(@Param('id') id: string) {
    return this.formsService.delete(id);
  }

  @Get('process/:processKey/task/:taskId')
  @ApiOperation({ summary: 'Get form for a workflow task' })
  async getFormByProcessTask(@Param('processKey') processKey: string, @Param('taskId') taskId: string) {
    return this.formsService.getFormByProcessTask(processKey, taskId);
  }
}
