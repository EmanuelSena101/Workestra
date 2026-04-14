import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
    @Body('folderId') folderId?: string,
    @Body('metadata') metadataStr?: string,
  ) {
    const metadata = metadataStr ? JSON.parse(metadataStr) : undefined;
    return this.documentsService.upload(
      { name: file.originalname, buffer: file.buffer, mimeType: file.mimetype, size: file.size },
      userId,
      folderId,
      metadata,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List documents' })
  async findAll(
    @Query('folderId') folderId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.documentsService.findAll(
      folderId,
      search,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
  }

  @Get('count')
  @ApiOperation({ summary: 'Get document count' })
  async count() {
    const total = await this.documentsService.count();
    return { total };
  }

  @Get('folders')
  @ApiOperation({ summary: 'List folders' })
  async listFolders(@Query('parentId') parentId?: string) {
    return this.documentsService.listFolders(parentId);
  }

  @Post('folders')
  @ApiOperation({ summary: 'Create a folder' })
  async createFolder(
    @Body() body: { name: string; parentId?: string; description?: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.documentsService.createFolder(body.name, userId, body.parentId, body.description);
  }

  @Get('folders/:id')
  @ApiOperation({ summary: 'Get folder with contents' })
  async getFolder(@Param('id') id: string) {
    return this.documentsService.getFolder(id);
  }

  @Delete('folders/:id')
  @ApiOperation({ summary: 'Delete folder' })
  async deleteFolder(@Param('id') id: string) {
    return this.documentsService.deleteFolder(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  async findById(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get document download URL' })
  async download(@Param('id') id: string) {
    return this.documentsService.getDownloadUrl(id);
  }

  @Get(':id/preview')
  @ApiOperation({ summary: 'Get document preview info' })
  async preview(@Param('id') id: string) {
    return this.documentsService.getPreviewUrl(id);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Upload a new version' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVersion(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
    @Body('comment') comment?: string,
  ) {
    return this.documentsService.uploadNewVersion(
      id,
      { name: file.originalname, buffer: file.buffer, mimeType: file.mimetype, size: file.size },
      userId,
      comment,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  async delete(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }
}
