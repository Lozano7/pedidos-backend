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
import { DrinkService } from './drink.service';
import { DrinkDto } from './dto/drinkDto';

@Controller('drink')
@UseGuards(AuthGuard, RolesGuard)
export class DrinkController {
  constructor(private readonly drinkService: DrinkService) {}

  //obtener todos los usuarios
  @Roles('RESTAURANT')
  @Post()
  async register(@Body() body: DrinkDto) {
    return this.drinkService.create(body);
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
    const soups = await this.drinkService.getAll(
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
      data: await this.drinkService.formatResponse(soups.data),
      total: soups.total,
      page: soups.page,
      limit: soups.limit,
    };
  }

  //Editar
  @Roles('RESTAURANT')
  @Patch(':name')
  async update(@Body() body: DrinkDto) {
    return this.drinkService.update(body);
  }

  //Eliminar
  @Roles('RESTAURANT')
  @Delete(':name')
  async delete(@Body() body: DrinkDto) {
    return this.drinkService.delete(body);
  }
}
