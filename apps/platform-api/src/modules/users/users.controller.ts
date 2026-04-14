import { Controller, Get, Param, Query, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  async findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.usersService.findAll(page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync users from Keycloak' })
  async syncFromKeycloak() {
    return this.usersService.syncFromKeycloak();
  }
}
