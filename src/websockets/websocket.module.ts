import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gatwway';

@Module({
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class GatewayModule {}
