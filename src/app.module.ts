import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { MenuModule } from './menu/menu.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { SoupModule } from './soup/soup.module';
import { SecondModule } from './second/second.module';
import { DessertModule } from './dessert/dessert.module';
import { DrinkModule } from './drink/drink.module';

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
  ],
})
export class AppModule {}
