import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioClient } from '../../clients/minio.client';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private prisma: PrismaService,
    private minio: MinioClient,
    private configService: ConfigService,
  ) {}

  async upload(
    file: { name: string; buffer: Buffer; mimeType: string; size: number },
    userId: string,
    folderId?: string,
    metadata?: Record<string, string>,
  ) {
    const storageKey = `documents/${uuid()}/${file.name}`;

    await this.minio.upload(storageKey, file.buffer, file.mimeType, file.size);

    const document = await this.prisma.document.create({
      data: {
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        storageKey,
        version: 1,
        folderId: folderId || null,
        createdById: userId,
        tags: [],
      },
    });

    // Create initial version record
    await this.prisma.documentVersion.create({
      data: {
        documentId: document.id,
        version: 1,
        size: file.size,
        storageKey,
        mimeType: file.mimeType,
        createdBy: userId,
      },
    });

    // Save metadata if provided
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        await this.prisma.documentMetadata.create({
          data: { documentId: document.id, key, value },
        });
      }
    }

    // Try to extract text via Tika (non-blocking)
    this.extractText(document.id, storageKey).catch((err) => {
      this.logger.warn(`Tika extraction failed for ${document.id}: ${err.message}`);
    });

    return document;
  }

  async findAll(folderId?: string, search?: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const where: Record<string, unknown> = {};

    if (folderId) {
      where['folderId'] = folderId;
    } else if (folderId === null || folderId === '') {
      where['folderId'] = null;
    }

    if (search) {
      where['OR'] = [
        { name: { contains: search, mode: 'insensitive' } },
        { extractedText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        include: {
          createdBy: { select: { id: true, displayName: true } },
          folder: { select: { id: true, name: true } },
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      items: items.map((d: typeof items[number]) => ({
        ...d,
        size: Number(d.size),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findById(id: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, displayName: true } },
        folder: { select: { id: true, name: true } },
        metadata: true,
        versions: { orderBy: { version: 'desc' } },
      },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return { ...doc, size: Number(doc.size) };
  }

  async getDownloadUrl(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    const url = await this.minio.getPresignedUrl(doc.storageKey);
    return { url, name: doc.name, mimeType: doc.mimeType };
  }

  async getPreviewUrl(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    const previewable = [
      'application/pdf',
      'text/plain',
      'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml',
    ];

    const isPreviewable = previewable.includes(doc.mimeType);
    const url = await this.minio.getPresignedUrl(doc.storageKey);

    return {
      url,
      name: doc.name,
      mimeType: doc.mimeType,
      previewable: isPreviewable,
      previewType: this.getPreviewType(doc.mimeType),
    };
  }

  async uploadNewVersion(
    id: string,
    file: { name: string; buffer: Buffer; mimeType: string; size: number },
    userId: string,
    comment?: string,
  ) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    const newVersion = doc.version + 1;
    const storageKey = `documents/${uuid()}/${file.name}`;

    await this.minio.upload(storageKey, file.buffer, file.mimeType, file.size);

    const [updated] = await Promise.all([
      this.prisma.document.update({
        where: { id },
        data: {
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
          storageKey,
          version: newVersion,
        },
      }),
      this.prisma.documentVersion.create({
        data: {
          documentId: id,
          version: newVersion,
          size: file.size,
          storageKey,
          mimeType: file.mimeType,
          comment,
          createdBy: userId,
        },
      }),
    ]);

    return updated;
  }

  async delete(id: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { versions: true },
    });
    if (!doc) throw new NotFoundException('Document not found');

    // Delete all version files from MinIO
    for (const version of doc.versions) {
      try {
        await this.minio.delete(version.storageKey);
      } catch (err) {
        this.logger.warn(`Failed to delete ${version.storageKey} from MinIO: ${(err as Error).message}`);
      }
    }

    // Also delete the current file
    try {
      await this.minio.delete(doc.storageKey);
    } catch (err) {
      this.logger.warn(`Failed to delete ${doc.storageKey} from MinIO: ${(err as Error).message}`);
    }

    await this.prisma.document.delete({ where: { id } });
    return { deleted: true };
  }

  async count() {
    return this.prisma.document.count();
  }

  // ── Folders ──

  async createFolder(name: string, userId: string, parentId?: string, description?: string) {
    return this.prisma.folder.create({
      data: {
        name,
        description,
        parentId: parentId || null,
        createdById: userId,
      },
    });
  }

  async listFolders(parentId?: string) {
    const where: Record<string, unknown> = {};
    if (parentId) {
      where['parentId'] = parentId;
    } else {
      where['parentId'] = null;
    }

    const folders = await this.prisma.folder.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { documents: true, children: true } },
        createdBy: { select: { id: true, displayName: true } },
      },
    });

    return folders.map((f: typeof folders[number]) => ({
      ...f,
      documentCount: f._count.documents,
      childFolderCount: f._count.children,
    }));
  }

  async getFolder(id: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
      include: {
        children: { orderBy: { name: 'asc' } },
        documents: {
          orderBy: { name: 'asc' },
          include: { createdBy: { select: { id: true, displayName: true } } },
        },
        parent: { select: { id: true, name: true } },
        createdBy: { select: { id: true, displayName: true } },
      },
    });
    if (!folder) throw new NotFoundException('Folder not found');
    return folder;
  }

  async deleteFolder(id: string) {
    await this.prisma.folder.delete({ where: { id } });
    return { deleted: true };
  }

  private getPreviewType(mimeType: string): string {
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'text/plain') return 'text';
    if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) return 'docx';
    if (mimeType.includes('spreadsheetml') || mimeType.includes('ms-excel')) return 'xlsx';
    return 'download';
  }

  private async extractText(documentId: string, storageKey: string) {
    const tikaUrl = this.configService.get<string>('TIKA_URL', 'http://localhost:9998');
    try {
      const stream = await this.minio.download(storageKey);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
      }
      const buffer = Buffer.concat(chunks);

      const response = await fetch(`${tikaUrl}/tika`, {
        method: 'PUT',
        headers: { 'Accept': 'text/plain' },
        body: buffer,
      });

      if (response.ok) {
        const text = await response.text();
        await this.prisma.document.update({
          where: { id: documentId },
          data: { extractedText: text.substring(0, 50000) },
        });
      }
    } catch (err) {
      this.logger.warn(`Tika extraction error: ${(err as Error).message}`);
    }
  }
}
