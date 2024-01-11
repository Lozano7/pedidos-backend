import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { DessertController } from './dessert.controller';
import { DessertService } from './dessert.service';
import { Dessert, DessertSchema } from './model/dessert.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dessert.name, schema: DessertSchema }]),
    UsersModule,
  ],
  providers: [DessertService],
  controllers: [DessertController],
  exports: [DessertService],
})
export class DessertModule {}
