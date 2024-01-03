import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Roles('RESTAURANT', 'USER')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: boolean,
    @Query('date') date: string,
  ) {
    let menus;
    if (date) {
      menus = await this.menuService.getAllByDate(
        search,
        page,
        limit,
        all,
        date,
      );
    } else {
      menus = await this.menuService.getAll(search, page, limit, all);
    }

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

  @Roles('RESTAURANT')
  @Get(':fecha')
  async getByDate(@Param('fecha') fecha: string) {
    console.log(fecha);
    return this.menuService.findByDate(fecha);
  }

  // update
  @Roles('RESTAURANT')
  @Patch(':id')
  async update(@Body() menuDto: MenuDto, @Param('id') id: string) {
    return this.menuService.update(id, menuDto);
  }

  // delete
  @Roles('RESTAURANT')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.menuService.delete(id);
  }
}
