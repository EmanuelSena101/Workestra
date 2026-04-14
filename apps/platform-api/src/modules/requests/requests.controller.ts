import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  @ApiOperation({ summary: 'List requests' })
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.requestsService.findAll({
      status, search,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
    });
  }

  @Get('count')
  @ApiOperation({ summary: 'Get request count' })
  async count(@Query('status') status?: string) {
    const total = await this.requestsService.count(status);
    return { total };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get request by ID' })
  async findById(@Param('id') id: string) {
    return this.requestsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  async create(
    @Body() body: { title: string; description?: string; processDefinitionId: string; priority?: string; formData?: Record<string, unknown> },
    @CurrentUser('id') userId: string,
  ) {
    return this.requestsService.create({ ...body, requesterId: userId });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update request' })
  async update(
    @Param('id') id: string,
    @Body() body: { status?: string; priority?: string; currentStep?: string; formData?: Record<string, unknown> },
    @CurrentUser('id') userId: string,
  ) {
    return this.requestsService.update(id, body, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to request' })
  async addComment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.requestsService.addComment(id, body.content, userId);
  }
}
