import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Pedido } from 'src/pedidos/interfaces/pedidos.interface';
import { CORS } from '../constants/cors';

@WebSocketGateway({
  cors: CORS,
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleNewPedido(pedido: Pedido, restaurantId: string) {
    if (pedido.restaurantId === restaurantId) {
      this.server.to(restaurantId).emit('notification', pedido);
      console.log('se hace la emision');
    }
  }
  @SubscribeMessage('join')
  handleConnectToRestaurant(client: Socket, restaurantId: string) {
    client.join(restaurantId);
  }
}
