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
import { SecondDto } from './dto/secondDto';
import { SecondService } from './second.service';

@Controller('second')
@UseGuards(AuthGuard, RolesGuard)
export class SecondController {
  constructor(private readonly secondService: SecondService) {}

  //obtener todos los usuarios
  @Roles('RESTAURANT')
  @Post()
  async register(@Body() body: SecondDto) {
    return this.secondService.create(body);
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
    const soups = await this.secondService.getAll(
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
      data: await this.secondService.formatResponse(soups.data),
      total: soups.total,
      page: soups.page,
      limit: soups.limit,
    };
  }

  //Editar
  @Roles('RESTAURANT')
  @Patch(':name')
  async update(@Body() body: SecondDto) {
    return this.secondService.update(body);
  }

  //Eliminar
  @Roles('RESTAURANT')
  @Delete(':name/:restaurantId')
  async delete(
    @Param('name') name: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.secondService.delete({
      name: name.split('-').join(' '),
      restaurantId,
    });
  }
}
