import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DessertService } from './dessert.service';
import { DessertDto } from './dto/dessertDto';

@Controller('dessert')
@UseGuards(AuthGuard, RolesGuard)
export class DessertController {
  constructor(private readonly dessertService: DessertService) {}

  //obtener todos los usuarios
  @Roles('RESTAURANT')
  @Post()
  async register(@Body() body: DessertDto) {
    return this.dessertService.create(body);
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
    const soups = await this.dessertService.getAll(
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
      data: await this.dessertService.formatResponse(soups.data),
      total: soups.total,
      page: soups.page,
      limit: soups.limit,
    };
  }

  //Editar
  @Roles('RESTAURANT')
  @Patch(':name')
  async update(@Body() body: DessertDto) {
    return this.dessertService.update(body);
  }

  //Eliminar
  @Roles('RESTAURANT')
  @Delete(':name')
  async delete(@Body() body: DessertDto) {
    return this.dessertService.delete(body);
  }
}
