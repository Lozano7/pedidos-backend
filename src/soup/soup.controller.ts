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
import { SoupDto } from './dto/soupDto';
import { SoupService } from './soup.service';

@Controller('soup')
@UseGuards(AuthGuard, RolesGuard)
export class SoupController {
  constructor(private readonly soupService: SoupService) {}

  //obtener todos los usuarios
  @Roles('RESTAURANT')
  @Post()
  async register(@Body() body: SoupDto) {
    return this.soupService.create(body);
  }

  @Roles('RESTAURANT')
  @Get()
  async getAll(
    @Query('restaurantId') restaurantId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: boolean,
  ) {
    const soups = await this.soupService.getAll(
      restaurantId,
      search,
      page,
      limit,
      all,
    );

    if (Array.isArray(soups)) {
      return soups;
    }

    return {
      data: await this.soupService.formatResponse(soups.data),
      total: soups.total,
      page: soups.page,
      limit: soups.limit,
    };
  }

  //Editar
  @Roles('RESTAURANT')
  @Patch(':name')
  async update(@Body() body: SoupDto) {
    return this.soupService.update(body);
  }

  //Eliminar
  @Roles('RESTAURANT')
  @Delete(':name/:restaurantId')
  async delete(
    @Param('name') name: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.soupService.delete({
      name: name.split('-').join(' '),
      restaurantId,
    });
  }

  @Roles('RESTAURANT')
  @Get(':name/:restaurantId')
  async getSoupByNameByRestaurantId(
    @Param('name') name: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.soupService.getSoupByNameByRestaurantId(
      name.split('-').join(' '),
      restaurantId,
    );
  }
}
