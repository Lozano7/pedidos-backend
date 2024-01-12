import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoupDto } from './dto/soupDto';
import { Soup, SoupDocument } from './model/soup.model';

@Injectable()
export class SoupService {
  constructor(@InjectModel(Soup.name) private soupModel: Model<SoupDocument>) {}

  async create(body: SoupDto) {
    const existingSoup = await this.soupModel.findOne({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (existingSoup) {
      throw new InternalServerErrorException('La sopa ya existe');
    }

    const newSoup = new this.soupModel(body);
    await newSoup.save();
    return {
      _id: newSoup._id.toString(),
      name: newSoup.name,
      type: newSoup.type,
      restaurantId: newSoup.restaurantId,
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
        data: SoupDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | SoupDocument[]
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
      const soups = await this.soupModel.find(query).exec();
      response = soups.map((role) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: soupId } = role;
        const result = role.toJSON();
        return {
          ...result,
          _id: soupId.toString(),
        };
      });
    } else {
      const soups = await this.soupModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.soupModel.countDocuments(query);

      response = {
        data: soups,
        total,
        page,
        limit,
      };
    }
    return response;
  }

  async getSoupByNameByRestaurantId(
    name: string,
    restaurantId: string,
  ): Promise<SoupDocument | SoupDocument[]> {
    const soup = await this.soupModel.findOne({ name, restaurantId }).exec();
    if (soup) {
      return this.formatResponse(soup);
    }
    return null;
  }

  async update(body: SoupDto) {
    const soup = await this.soupModel.findOneAndUpdate(
      {
        name: body.name,
        restaurantId: body.restaurantId,
      },
      body,
      {
        new: true,
      },
    );
    if (!soup) {
      throw new NotFoundException('La sopa no existe');
    }
    return soup;
  }

  async delete(body: { name: string; restaurantId: string }) {
    const soup = await this.soupModel.findOneAndDelete({
      name: body.name,
      restaurantId: body.restaurantId,
    });
    if (!soup) {
      throw new NotFoundException('La sopa no existe');
    }
    return soup;
  }

  async formatResponse(
    soup: SoupDocument | SoupDocument[],
  ): Promise<SoupDocument | SoupDocument[]> {
    let response = null;
    if (Array.isArray(soup)) {
      response = soup.map((rstr) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: rstrId } = rstr;
        const result = rstr.toJSON();
        return {
          ...result,
          _id: rstrId.toString(),
        };
      });
    } else {
      const result = soup.toJSON();
      const { _id: rstrId } = soup;
      response = {
        ...result,
        _id: rstrId.toString(),
      };
    }
    return response;
  }
}
