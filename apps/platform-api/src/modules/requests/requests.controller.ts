import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';

@ApiTags('Requests')
@ApiBearerAuth()
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  @ApiOperation({ summary: 'List requests (Solicitações)' })
  async findAll(
    @Query('status') status?: string,
    @Query('requester') requester?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
  ) {
    return this.requestsService.findAll({ status, requester, page, pageSize, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request detail' })
  async findById(@Param('id') id: string) {
    return this.requestsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new request (start workflow)' })
  async create(@Body() body: { processDefinitionKey: string; title: string; formData: Record<string, unknown> }) {
    return this.requestsService.create(body);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a request' })
  async cancel(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.requestsService.cancel(id, body.reason);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Get request history' })
  async getHistory(@Param('id') id: string) {
    return this.requestsService.getHistory(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to request' })
  async addComment(@Param('id') id: string, @Body() body: { content: string; authorId: string }) {
    return this.requestsService.addComment(id, body.content, body.authorId);
  }
}
