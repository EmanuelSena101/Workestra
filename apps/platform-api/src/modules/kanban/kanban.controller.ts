import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KanbanService } from './kanban.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Kanban')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kanban')
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get('boards')
  @ApiOperation({ summary: 'List kanban boards' })
  async listBoards(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.kanbanService.listBoards(page ? parseInt(page, 10) : 1, pageSize ? parseInt(pageSize, 10) : 20);
  }

  @Get('boards/:id')
  @ApiOperation({ summary: 'Get kanban board with columns and cards' })
  async getBoard(@Param('id') id: string) {
    return this.kanbanService.getBoard(id);
  }

  @Post('boards')
  @ApiOperation({ summary: 'Create kanban board' })
  async createBoard(
    @Body() body: { name: string; description?: string; processDefinitionId?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.kanbanService.createBoard(body, userId);
  }

  @Put('boards/:id')
  @ApiOperation({ summary: 'Update kanban board' })
  async updateBoard(@Param('id') id: string, @Body() body: { name?: string; description?: string }) {
    return this.kanbanService.updateBoard(id, body);
  }

  @Delete('boards/:id')
  @ApiOperation({ summary: 'Delete kanban board' })
  async deleteBoard(@Param('id') id: string) {
    return this.kanbanService.deleteBoard(id);
  }

  @Post('columns')
  @ApiOperation({ summary: 'Create column in board' })
  async createColumn(@Body() body: { boardId: string; name: string; color?: string }) {
    return this.kanbanService.createColumn(body.boardId, body);
  }

  @Put('columns/:id')
  @ApiOperation({ summary: 'Update column' })
  async updateColumn(@Param('id') id: string, @Body() body: { name?: string; color?: string; position?: number }) {
    return this.kanbanService.updateColumn(id, body);
  }

  @Delete('columns/:id')
  @ApiOperation({ summary: 'Delete column' })
  async deleteColumn(@Param('id') id: string) {
    return this.kanbanService.deleteColumn(id);
  }

  @Post('cards')
  @ApiOperation({ summary: 'Create card in column' })
  async createCard(
    @Body() body: { columnId: string; title: string; description?: string; assigneeId?: string; priority?: string; dueDate?: string; taskId?: string; requestId?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.kanbanService.createCard(body.columnId, body, userId);
  }

  @Put('cards/:id')
  @ApiOperation({ summary: 'Update card' })
  async updateCard(@Param('id') id: string, @Body() body: { title?: string; description?: string; assigneeId?: string; priority?: string; dueDate?: string }) {
    return this.kanbanService.updateCard(id, body);
  }

  @Put('cards/:id/move')
  @ApiOperation({ summary: 'Move card to another column' })
  async moveCard(@Param('id') id: string, @Body() body: { columnId: string; position: number }) {
    return this.kanbanService.moveCard(id, body.columnId, body.position);
  }

  @Delete('cards/:id')
  @ApiOperation({ summary: 'Delete card' })
  async deleteCard(@Param('id') id: string) {
    return this.kanbanService.deleteCard(id);
  }
}
