import { Module } from '@nestjs/common';
import { DessertService } from './dessert.service';
import { DessertController } from './dessert.controller';

@Module({
  providers: [DessertService],
  controllers: [DessertController]
})
export class DessertModule {}
