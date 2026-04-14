import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks (Central de Tarefas)' })
  async findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assignee') assignee?: string,
    @Query('processDefinitionKey') processDefinitionKey?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
  ) {
    return this.tasksService.findAll({ status, priority, assignee, processDefinitionKey, page, pageSize, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task detail' })
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Get(':id/form')
  @ApiOperation({ summary: 'Get task form definition' })
  async getTaskForm(@Param('id') id: string) {
    return this.tasksService.getTaskForm(id);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get process timeline for a task' })
  async getTaskTimeline(@Param('id') id: string) {
    return this.tasksService.getTaskTimeline(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a task' })
  async complete(@Param('id') id: string, @Body() body: { variables?: Record<string, unknown> }) {
    return this.tasksService.complete(id, body.variables || {});
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign task to user' })
  async assign(@Param('id') id: string, @Body() body: { assignee: string }) {
    return this.tasksService.assign(id, body.assignee);
  }
}
