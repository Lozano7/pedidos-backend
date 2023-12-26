import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuDto } from './dto/menu.dto';
import { Menu, MenuDocument } from './models/menu.model';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async register(body: MenuDto) {
    const existingMenu = await this.findByDate(body.date);
    if (existingMenu) {
      throw new NotFoundException('El menu ya fue registrado');
    }

    const newRestaurant = await this.create(body);
    return this.formatResponse(newRestaurant);
  }

  async create(body: MenuDto) {
    const newMenu = new this.menuModel(body);
    return newMenu.save();
  }

  async getAll(
    search: string = '',
    page: number = 1,
    limit: number = 10,
    all: boolean = false,
  ): Promise<
    | {
        data: MenuDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | MenuDocument[]
  > {
    let response = null;
    const query = search
      ? {
          $or: [
            { date: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    if (all) {
      const menus = await this.menuModel.find(query).exec();
      response = menus.map((menu) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: menuId } = menu;
        const result = menu.toJSON();
        return {
          ...result,
          _id: menuId.toString(),
        };
      });
    } else {
      const menus = await this.menuModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.menuModel.countDocuments(query);

      response = {
        data: menus,
        total,
        page,
        limit,
      };
    }

    return response;
  }

  async findByDate(date: string) {
    return this.menuModel.findOne({ date });
  }

  async formatResponse(
    restaurant: MenuDocument | MenuDocument[],
  ): Promise<MenuDocument | MenuDocument[]> {
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
