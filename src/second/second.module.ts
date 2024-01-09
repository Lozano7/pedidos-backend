import { Module } from '@nestjs/common';
import { SecondService } from './second.service';
import { SecondController } from './second.controller';

@Module({
  providers: [SecondService],
  controllers: [SecondController]
})
export class SecondModule {}
