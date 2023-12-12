import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleDto } from './dto/roleDto';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(AuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  //obtener todos los usuarios
  @Roles('ADMIN')
  @Post()
  async register(@Body() body: RoleDto) {
    return this.roleService.create(body);
  }

  @Roles('ADMIN')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: boolean,
  ) {
    const users = await this.roleService.getAll(search, page, limit, all);

    if (Array.isArray(users)) {
      return users;
    }

    return {
      data: await this.roleService.formatResponse(users.data),
      total: users.total,
      page: users.page,
      limit: users.limit,
    };
  }
}
