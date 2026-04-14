import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { MinioClient } from '../../clients/minio.client';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, MinioClient],
  exports: [DocumentsService, MinioClient],
})
export class DocumentsModule {}
