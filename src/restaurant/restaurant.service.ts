import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RestaurantDto } from './dto/restaurant.dto';
import { Restaurant, RestaurantDocument } from './model/restaurant.model';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  async register({
    name,
    ruc,
    adminName,
    address,
    status,
    phone,
    startOrderTime,
    endOrderTime,
    deliveryTime,
  }: RestaurantDto) {
    const existingRestaurant = await this.findByRuc(ruc);
    if (existingRestaurant) {
      throw new NotFoundException('El restaurante ya existe');
    }

    const newRestaurant = await this.create({
      name,
      ruc,
      adminName,
      address,
      status,
      phone,
      startOrderTime,
      endOrderTime,
      deliveryTime,
    });

    return this.formatResponse(newRestaurant);
  }

  async create(body: RestaurantDto) {
    const newRestaurant = new this.restaurantModel(body);
    return newRestaurant.save();
  }

  async getAll(
    search: string = '',
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: RestaurantDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { ruc: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const skip = (Number(page) - 1) * limit;
    const data = await this.restaurantModel
      .find({
        ...query,
      })
      .limit(limit)
      .skip(skip);
    const total = await this.restaurantModel.countDocuments(query);

    return { data, total, page, limit };
  }

  async update(id, body: RestaurantDto) {
    const restaurant = await this.restaurantModel.findOneAndUpdate(
      {
        ruc: id,
      },
      body,
      {
        new: true,
      },
    );
    if (!restaurant) {
      throw new NotFoundException('El restaurante no existe');
    }
    return restaurant;
  }

  async delete(ruc: string) {
    const restaurant = await this.restaurantModel.findOneAndDelete({
      ruc,
    });
    if (!restaurant) {
      throw new NotFoundException('El usuario no existe');
    }
    return restaurant;
  }

  async findByRuc(ruc: string): Promise<RestaurantDocument | null> {
    const restaurant = await this.restaurantModel.findOne({ ruc }).exec();
    return restaurant;
  }

  async formatResponse(
    restaurant: RestaurantDocument | RestaurantDocument[],
  ): Promise<RestaurantDocument | RestaurantDocument[]> {
    let response = null;
    if (Array.isArray(restaurant)) {
      response = restaurant.map((rstr) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: rstrId } = rstr;
        const result = rstr.toJSON();
        return {
          ...result,
          _id: rstrId.toString(),
        };
      });
    } else {
      const result = restaurant.toJSON();
      const { _id: rstrId } = restaurant;
      response = {
        ...result,
        _id: rstrId.toString(),
      };
    }
    return response;
  }
}
