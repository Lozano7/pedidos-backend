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
import { PedidosService } from './pedidos.service';
import { PedidoDto } from './dto/pedido.dto';

@Controller('pedidos')
@UseGuards(AuthGuard, RolesGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Roles('USER')
  @Post()
  async register(@Body() pedido: PedidoDto) {
    return this.pedidosService.register(pedido);
  }

  @Roles('RESTAURANT', 'USER')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: boolean,
    @Query('date') date: string,
    @Query('restaurantId') restaurantId: string,
  ) {
    let pedidos;
    if (date) {
      pedidos = await this.pedidosService.getAllByDate(
        search,
        page,
        limit,
        all,
        date,
        restaurantId,
      );
    } else {
      pedidos = await this.pedidosService.getAll(
        search,
        page,
        limit,
        all,
        restaurantId,
      );
    }

    if (Array.isArray(pedidos)) {
      return pedidos;
    }

    return {
      data: await this.pedidosService.formatResponse(pedidos.data),
      total: pedidos.total,
      page: pedidos.page,
      limit: pedidos.limit,
    };
  }

  // delete
  @Roles('RESTAURANT', 'USER')
  @Delete(':id/:restaurantId/:clientId')
  async delete(
    @Param('id') id: string,
    @Param('restaurantId') restaurantId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.pedidosService.delete(id, restaurantId, clientId);
  }
}
