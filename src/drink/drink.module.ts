import { Module } from '@nestjs/common';
import { DrinkController } from './drink.controller';
import { DrinkService } from './drink.service';

@Module({
  controllers: [DrinkController],
  providers: [DrinkService]
})
export class DrinkModule {}
