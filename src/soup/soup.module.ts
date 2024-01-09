import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Soup, SoupSchema } from './model/soup.model';
import { SoupController } from './soup.controller';
import { SoupService } from './soup.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Soup.name, schema: SoupSchema }]),
    UsersModule,
  ],
  providers: [SoupService],
  controllers: [SoupController],
  exports: [SoupService],
})
export class SoupModule {}
