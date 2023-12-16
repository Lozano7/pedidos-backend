import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Restaurant, RestaurantSchema } from './model/restaurant.model';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    UsersModule,
  ],
  providers: [RestaurantService],
  exports: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
