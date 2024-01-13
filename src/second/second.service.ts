import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecondDto } from './dto/secondDto';
import { Second, SecondDocument } from './model/second.model';

@Injectable()
export class SecondService {
  constructor(
    @InjectModel(Second.name) private secondModel: Model<SecondDocument>,
  ) {}

  async create(body: SecondDto) {
    const existingSecond = await this.secondModel.findOne({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (existingSecond) {
      throw new InternalServerErrorException('El segundo ya existe');
    }

    const newSecond = new this.secondModel(body);
    await newSecond.save();
    return {
      _id: newSecond._id.toString(),
      name: newSecond.name,
      type: newSecond.type,
      restaurantId: newSecond.restaurantId,
    };
  }

  async getAll(
    restaurantId: string = '',
    search: string = '',
    page: number = 1,
    limit: number = 10,
    all: boolean = false,
  ): Promise<
    | {
        data: SecondDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | SecondDocument[]
  > {
    let response = null;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { type: { $regex: search, $options: 'i' } },
          ],
          ...(restaurantId && { restaurantId }),
        }
      : {
          ...(restaurantId && { restaurantId }),
        };

    if (all) {
      const seconds = await this.secondModel.find(query).exec();
      response = seconds.map((role) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: secondId } = role;
        const result = role.toJSON();
        return {
          ...result,
          _id: secondId.toString(),
        };
      });
    } else {
      const seconds = await this.secondModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.secondModel.countDocuments(query);

      response = {
        data: seconds,
        total,
        page,
        limit,
      };
    }
    return response;
  }

  async getSecondByNameByRestaurantId(
    name: string,
    restaurantId: string,
  ): Promise<SecondDocument | SecondDocument[]> {
    const second = await this.secondModel
      .findOne({ name, restaurantId })
      .exec();
    if (second) {
      return this.formatResponse(second);
    }
    return null;
  }

  async update({ name, body }: { name: string; body: SecondDto }) {
    const second = await this.secondModel.findOneAndUpdate(
      {
        name,
        restaurantId: body.restaurantId,
      },
      body,
      {
        new: true,
      },
    );
    if (!second) {
      throw new NotFoundException('El segundo no existe');
    }
    return second;
  }

  async delete(body: { name: string; restaurantId: string }) {
    const soup = await this.secondModel.findOneAndDelete({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (!soup) {
      throw new NotFoundException('El segundo no existe');
    }
    return soup;
  }

  async formatResponse(
    second: SecondDocument | SecondDocument[],
  ): Promise<SecondDocument | SecondDocument[]> {
    let response = null;
    if (Array.isArray(second)) {
      response = second.map((rstr) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: rstrId } = rstr;
        const result = rstr.toJSON();
        return {
          ...result,
          _id: rstrId.toString(),
        };
      });
    } else {
      const result = second.toJSON();
      const { _id: rstrId } = second;
      response = {
        ...result,
        _id: rstrId.toString(),
      };
    }
    return response;
  }
}
