import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { DrinkController } from './drink.controller';
import { DrinkService } from './drink.service';
import { Drink, DrinkSchema } from './model/drink.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drink.name, schema: DrinkSchema }]),
    UsersModule,
  ],
  controllers: [DrinkController],
  providers: [DrinkService],
  exports: [DrinkService],
})
export class DrinkModule {}
