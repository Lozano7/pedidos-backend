import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { GatewayModule } from 'src/websockets/websocket.module';
import { Pedido, PedidoSchema } from './model/pedidos.model';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
    UsersModule,
    GatewayModule,
  ],
  providers: [PedidosService],
  controllers: [PedidosController],
  exports: [PedidosService],
})
export class PedidosModule {}
