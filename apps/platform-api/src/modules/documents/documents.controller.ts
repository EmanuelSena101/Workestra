import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'List documents and folders' })
  async findAll(
    @Query('folderId') folderId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.documentsService.findAll({ folderId, search, page, pageSize });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document detail' })
  async findById(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download document binary' })
  async download(@Param('id') id: string) {
    return this.documentsService.download(id);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Get document preview URL' })
  async getPreviewUrl(@Param('id') id: string) {
    return this.documentsService.getPreviewUrl(id);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get document versions' })
  async getVersions(@Param('id') id: string) {
    return this.documentsService.getVersions(id);
  }

  @Post('folders')
  @ApiOperation({ summary: 'Create folder' })
  async createFolder(@Body() body: { name: string; parentId?: string }) {
    return this.documentsService.createFolder(body.name, body.parentId);
  }

  @Put(':id/metadata')
  @ApiOperation({ summary: 'Update document metadata' })
  async updateMetadata(@Param('id') id: string, @Body() body: { metadata: Record<string, string> }) {
    return this.documentsService.updateMetadata(id, body.metadata);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  async delete(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }
}
