// pedidos.gateway.ts

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Pedido } from './interfaces/pedidos.interface';

@WebSocketGateway()
export class PedidosGateway {
  @WebSocketServer()
  server: Server;

  handleNewPedido(pedido: Pedido, restaurantId: string) {
    if (pedido.restaurantId === restaurantId) {
      this.server.to(restaurantId).emit('newPedido', pedido);
    }
  }
  @SubscribeMessage('connectToRestaurant') // Asegúrate de importar correctamente el decorador
  handleConnectToRestaurant(client: Socket, restaurantId: string) {
    client.join(restaurantId);
  }
}
