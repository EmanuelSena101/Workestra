import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  @ApiOperation({ summary: 'List form definitions' })
  async findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.formsService.findAll(page ? parseInt(page, 10) : 1, pageSize ? parseInt(pageSize, 10) : 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get form definition by ID' })
  async findById(@Param('id') id: string) {
    return this.formsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create form definition' })
  async create(@Body() body: { name: string; processDefinitionKey?: string; fields: unknown; layout?: unknown }, @CurrentUser('id') userId: string) {
    return this.formsService.create(body, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update form definition' })
  async update(@Param('id') id: string, @Body() body: { name?: string; fields?: unknown; layout?: unknown }) {
    return this.formsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete form definition' })
  async delete(@Param('id') id: string) {
    return this.formsService.delete(id);
  }
}
