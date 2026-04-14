import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'List tasks with filters' })
  async findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.tasksService.findAll({
      status, priority, assigneeId, search,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    });
  }

  @Get('count')
  @ApiOperation({ summary: 'Get task counts' })
  async count(@Query('status') status?: string) {
    const total = await this.tasksService.count(status);
    return { total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  async create(@Body() body: {
    title: string; description?: string; processName?: string; processDefinitionKey?: string;
    currentStep?: string; assigneeId?: string; priority?: string; dueDate?: string; requestId?: string;
  }) {
    return this.tasksService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  async update(@Param('id') id: string, @Body() body: { status?: string; assigneeId?: string; priority?: string; currentStep?: string }) {
    return this.tasksService.update(id, body);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a task' })
  async complete(@Param('id') id: string) {
    return this.tasksService.complete(id);
  }
}
