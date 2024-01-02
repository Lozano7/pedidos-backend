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
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
@UseGuards(AuthGuard, RolesGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  //obtener todos los usuarios
  @Roles('ADMIN')
  @Post()
  async register(@Body() restaurantDto: RestaurantDto) {
    return this.restaurantService.register(restaurantDto);
  }

  @Roles('ADMIN')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: string,
  ) {
    const users = await this.restaurantService.getAll(search, page, limit);
    if (all) {
      return await this.restaurantService.formatResponse(users.data);
    }
    return {
      data: await this.restaurantService.formatResponse(users.data),
      total: users.total,
      page: users.page,
      limit: users.limit,
    };
  }
  @Roles('ADMIN', 'RESTAURANT')
  @Get(':id')
  async getRestaurantByIdentification(@Param('id') id: string) {
    const user = await this.restaurantService.findByRuc(id);
    return this.restaurantService.formatResponse(user);
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: RestaurantDto) {
    return this.restaurantService.update(id, body);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.restaurantService.delete(id);
  }
}
