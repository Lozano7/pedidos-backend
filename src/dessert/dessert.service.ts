import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DessertDto } from './dto/dessertDto';
import { Dessert, DessertDocument } from './model/dessert.model';

@Injectable()
export class DessertService {
  constructor(
    @InjectModel(Dessert.name) private dessertModel: Model<DessertDocument>,
  ) {}

  async create(body: DessertDto) {
    const existingData = await this.dessertModel.findOne({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (existingData) {
      throw new BadRequestException('El postre ya existe');
    }

    const newData = new this.dessertModel(body);
    await newData.save();
    return {
      _id: newData._id.toString(),
      name: newData.name,
      type: newData.type,
      restaurantId: newData.restaurantId,
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
        data: DessertDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | DessertDocument[]
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
      const desserts = await this.dessertModel.find(query).exec();
      response = desserts.map((dt) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: dessertId } = dt;
        const result = dt.toJSON();
        return {
          ...result,
          _id: dessertId.toString(),
        };
      });
    } else {
      const desserts = await this.dessertModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.dessertModel.countDocuments(query);

      response = {
        data: desserts,
        total,
        page,
        limit,
      };
    }
    return response;
  }

  async getDessertByNameByRestaurantId(
    name: string,
    restaurantId: string,
  ): Promise<DessertDocument | DessertDocument[]> {
    const dessert = await this.dessertModel
      .findOne({ name, restaurantId })
      .exec();
    if (dessert) {
      return this.formatResponse(dessert);
    }
    return null;
  }

  async update({ name, body }: { name: string; body: DessertDto }) {
    const second = await this.dessertModel.findOneAndUpdate(
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
      throw new NotFoundException('El postre no existe');
    }
    return second;
  }

  async delete(body: { name: string; restaurantId: string }) {
    const soup = await this.dessertModel.findOneAndDelete({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (!soup) {
      throw new NotFoundException('El postre no existe');
    }
    return soup;
  }

  async formatResponse(
    dessert: DessertDocument | DessertDocument[],
  ): Promise<DessertDocument | DessertDocument[]> {
    let response = null;
    if (Array.isArray(dessert)) {
      response = dessert.map((rstr) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: rstrId } = rstr;
        const result = rstr.toJSON();
        return {
          ...result,
          _id: rstrId.toString(),
        };
      });
    } else {
      const result = dessert.toJSON();
      const { _id: rstrId } = dessert;
      response = {
        ...result,
        _id: rstrId.toString(),
      };
    }
    return response;
  }
}
