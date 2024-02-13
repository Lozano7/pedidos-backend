import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DessertModule } from './dessert/dessert.module';
import { DrinkModule } from './drink/drink.module';
import { MenuModule } from './menu/menu.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ReportModule } from './report/report.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RolesModule } from './roles/roles.module';
import { SecondModule } from './second/second.module';
import { SoupModule } from './soup/soup.module';
import { UsersModule } from './users/users.module';
import { GatewayModule } from './websockets/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsersModule,
    RolesModule,
    RestaurantModule,
    MenuModule,
    PedidosModule,
    SoupModule,
    SecondModule,
    DessertModule,
    DrinkModule,
    ReportModule,
    GatewayModule,
  ],
})
export class AppModule {}
