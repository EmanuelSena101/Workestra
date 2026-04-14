import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search (documents, tasks, requests, processes, users)' })
  async search(
    @Query('q') query: string,
    @Query('types') types?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const entityTypes = types ? types.split(',') : undefined;
    return this.searchService.search(query, { entityTypes, page, pageSize });
  }

  @Post('reindex')
  @ApiOperation({ summary: 'Trigger reindex of search data' })
  async reindex(@Body() body: { entityType?: string }) {
    return this.searchService.reindex(body.entityType);
  }
}
