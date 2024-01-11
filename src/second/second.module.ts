import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Second, SecondSchema } from './model/second.model';
import { SecondController } from './second.controller';
import { SecondService } from './second.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Second.name, schema: SecondSchema }]),
    UsersModule,
  ],
  providers: [SecondService],
  controllers: [SecondController],
  exports: [SecondService],
})
export class SecondModule {}
