import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';

@ApiTags('Workflows')
@ApiBearerAuth()
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get('definitions')
  @ApiOperation({ summary: 'List process definitions' })
  async findAllDefinitions(
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.workflowsService.findAllDefinitions({ category, page, pageSize });
  }

  @Get('definitions/:id')
  @ApiOperation({ summary: 'Get process definition by ID' })
  async findDefinitionById(@Param('id') id: string) {
    return this.workflowsService.findDefinitionById(id);
  }

  @Post('deploy')
  @ApiOperation({ summary: 'Deploy BPMN workflow to Camunda' })
  async deploy(@Body() body: { name: string; bpmnXml: string }) {
    return this.workflowsService.deploy(body.name, body.bpmnXml);
  }

  @Post('instances')
  @ApiOperation({ summary: 'Start a new process instance' })
  async startInstance(@Body() body: { processDefinitionKey: string; variables?: Record<string, unknown>; businessKey?: string }) {
    return this.workflowsService.startInstance(body.processDefinitionKey, body.variables || {}, body.businessKey);
  }

  @Delete('instances/:key')
  @ApiOperation({ summary: 'Cancel process instance' })
  async cancelInstance(@Param('key') key: string) {
    return this.workflowsService.cancelInstance(key);
  }

  @Get('instances/:key/timeline')
  @ApiOperation({ summary: 'Get workflow instance timeline' })
  async getInstanceTimeline(@Param('key') key: string) {
    return this.workflowsService.getInstanceTimeline(key);
  }

  @Get('instances/:key/variables')
  @ApiOperation({ summary: 'Get workflow instance variables' })
  async getInstanceVariables(@Param('key') key: string) {
    return this.workflowsService.getInstanceVariables(key);
  }
}
