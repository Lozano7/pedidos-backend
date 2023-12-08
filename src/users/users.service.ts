// user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signUpDto';
import { User, UserDocument } from './model/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(): Promise<UserDocument[]> {
    // devuelve un array de usuarios sin la contraseña solo el documento
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async create(body: SignUpDto) {
    const newUser = new this.userModel(body);
    return newUser.save();
  }
}
