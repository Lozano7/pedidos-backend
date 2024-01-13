import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DrinkDto } from './dto/drinkDto';
import { Drink, DrinkDocument } from './model/drink.model';

@Injectable()
export class DrinkService {
  constructor(
    @InjectModel(Drink.name) private drinkModel: Model<DrinkDocument>,
  ) {}

  async create(body: DrinkDto) {
    const existingData = await this.drinkModel.findOne({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (existingData) {
      throw new InternalServerErrorException('La bebida ya existe');
    }

    const newData = new this.drinkModel(body);
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
        data: DrinkDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | DrinkDocument[]
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
      const drinks = await this.drinkModel.find(query).exec();
      response = drinks.map((dt) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: drinkId } = dt;
        const result = dt.toJSON();
        return {
          ...result,
          _id: drinkId.toString(),
        };
      });
    } else {
      const drinks = await this.drinkModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.drinkModel.countDocuments(query);

      response = {
        data: drinks,
        total,
        page,
        limit,
      };
    }
    return response;
  }

  async getDrinkByNameByRestaurantId(
    name: string,
    restaurantId: string,
  ): Promise<DrinkDocument | DrinkDocument[]> {
    const soup = await this.drinkModel.findOne({ name, restaurantId }).exec();
    if (soup) {
      return this.formatResponse(soup);
    }
    return null;
  }

  async update({ name, body }: { name: string; body: DrinkDto }) {
    const drink = await this.drinkModel.findOneAndUpdate(
      {
        name,
        restaurantId: body.restaurantId,
      },
      body,
      {
        new: true,
      },
    );
    if (!drink) {
      throw new NotFoundException('La bebida no existe');
    }
    return drink;
  }

  async delete(body: { name: string; restaurantId: string }) {
    const drink = await this.drinkModel.findOneAndDelete({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (!drink) {
      throw new NotFoundException('La bebida no existe');
    }
    return drink;
  }

  async formatResponse(
    drink: DrinkDocument | DrinkDocument[],
  ): Promise<DrinkDocument | DrinkDocument[]> {
    let response = null;
    if (Array.isArray(drink)) {
      response = drink.map((rstr) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: rstrId } = rstr;
        const result = rstr.toJSON();
        return {
          ...result,
          _id: rstrId.toString(),
        };
      });
    } else {
      const result = drink.toJSON();
      const { _id: rstrId } = drink;
      response = {
        ...result,
        _id: rstrId.toString(),
      };
    }
    return response;
  }
}
