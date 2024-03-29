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
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PedidoDto } from './dto/pedido.dto';
import { PedidosService } from './pedidos.service';

@ApiTags('pedidos')
@Controller('pedidos')
@UseGuards(AuthGuard, RolesGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Roles('COLLABORATOR', 'INTERN')
  @Post()
  async register(@Body() pedido: PedidoDto) {
    return this.pedidosService.register(pedido);
  }

  @Roles('RESTAURANT', 'COLLABORATOR', 'INTERN')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('all') all: boolean,
    @Query('date') date: string,
    @Query('restaurantId') restaurantId: string,
    @Query('clientId') clientId: string,
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
        clientId,
      );
    } else {
      pedidos = await this.pedidosService.getAll(
        search,
        page,
        limit,
        all,
        restaurantId,
        clientId,
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

  @Roles('RESTAURANT', 'COLLABORATOR', 'INTERN')
  @Get(':date/:restaurantId/:clientId')
  async getIsExistingPedido(
    @Param('date') date: string,
    @Param('restaurantId') restaurantId: string,
    @Param('clientId') clientId: string,
  ) {
    let dateFormated = date.split('-').join('/');
    const pedido = await this.pedidosService.isClientHasOrder(
      dateFormated,
      restaurantId,
      clientId,
    );
    if (!pedido) {
      return null;
    }
    return this.pedidosService.formatResponse(pedido);
  }

  // update status
  @Roles('RESTAURANT')
  @Patch(':date/:restaurantId/:clientId')
  async updateStatus(
    @Body()
    body: {
      status: string;
      data: PedidoDto;
    },
    @Param('date') date: string,
    @Param('restaurantId') restaurantId: string,
    @Param('clientId') clientId: string,
  ) {
    const { data, status } = body;
    return this.pedidosService.updateStatus(data, status);
  }

  // delete
  @Roles('COLLABORATOR', 'INTERN')
  @Delete(':date/:restaurantId/:clientId')
  async delete(
    @Param('date') date: string,
    @Param('restaurantId') restaurantId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.pedidosService.delete(date, restaurantId, clientId);
  }
}
