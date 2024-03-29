import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatDate } from 'src/utils';
import { MenuDto } from './dto/menu.dto';
import { Menu, MenuDocument } from './models/menu.model';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async register(body: MenuDto) {
    const existingMenu = await this.findByDate(body.date, body.restaurantId);
    if (existingMenu) {
      throw new BadRequestException('El menu ya fue registrado en esa fecha');
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
    restaurantId: string = '',
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

    //validar que si llega el id del restaurante se filtre por ese id en el query
    const query = search
      ? {
          $or: [
            { date: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } },
          ],
          ...(restaurantId && { restaurantId }),
        }
      : {
          ...(restaurantId && { restaurantId }),
        };

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

  async getAllByDate(
    search: string = '',
    page: number = 1,
    limit: number = 10,
    all: boolean = false,
    date: string = formatDate(new Date()),
    restaurantId: string = '',
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
          ...(restaurantId && { restaurantId }),
        }
      : {
          ...(restaurantId && { restaurantId }),
          date,
        };

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

  // actulizar segun la fecha
  async update(date: string, body: MenuDto) {
    let dateFormated = date.split('-').join('/');
    const menu = await this.menuModel.findOneAndUpdate(
      {
        date: dateFormated,
        restaurantId: body.restaurantId,
      },
      body,
      {
        new: true,
      },
    );
    if (!menu) {
      throw new NotFoundException('El menu no existe');
    }
    return this.formatResponse(menu);
  }

  async delete(date: string, restaurantId: string) {
    let dateFormated = date.split('-').join('/');
    const menu = await this.menuModel.findOneAndDelete({
      date: dateFormated,
      restaurantId,
    });
    if (!menu) {
      throw new NotFoundException('El menu no existe');
    }
    return this.formatResponse(menu);
  }

  async findByDate(date: string, restaurantId: string) {
    let dateFormated = date.split('-').join('/');

    const menu = await this.menuModel.findOne({
      date: dateFormated,
      restaurantId,
    });
    if (!menu) {
      return null;
    }
    return this.formatResponse(menu);
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
