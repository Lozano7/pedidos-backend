// user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signUpDto';
import { User, UserDocument } from './model/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll(
    search: string = '',
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: UserDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = search
      ? {
          identification: { $regex: search, $options: 'i' },
        }
      : {};
    const skip = (Number(page) - 1) * limit;
    const data = await this.userModel
      .find({
        ...query,
      })
      .limit(limit)
      .skip(skip);
    const total = await this.userModel.countDocuments(query);

    return { data, total, page, limit };
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

  async formatResponse(
    user: UserDocument | UserDocument[],
  ): Promise<UserDocument | UserDocument[]> {
    let response = null;
    if (Array.isArray(user)) {
      response = user.map((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: userId } = user;
        const result = user.toJSON();
        return {
          ...result,
          _id: userId.toString(),
        };
      });
    } else {
      const result = user.toJSON();
      const { _id: userId } = user;
      response = {
        ...result,
        _id: userId.toString(),
      };
    }
    return response;
  }
}
