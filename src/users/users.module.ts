// users.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { UsersController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
