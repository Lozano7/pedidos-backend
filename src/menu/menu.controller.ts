import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { MenuDto } from './dto/menu.dto';
import { MenuService } from './menu.service';

@Controller('menu')
@UseGuards(AuthGuard, RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles('RESTAURANT')
  @Post()
  async register(@Body() menuDto: MenuDto) {
    return this.menuService.register(menuDto);
  }

  @Roles('RESTAURANT')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: boolean,
  ) {
    const menus = await this.menuService.getAll(search, page, limit, all);

    if (Array.isArray(menus)) {
      return menus;
    }

    return {
      data: await this.menuService.formatResponse(menus.data),
      total: menus.total,
      page: menus.page,
      limit: menus.limit,
    };
  }
}
