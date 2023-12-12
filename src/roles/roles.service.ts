import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleDto } from './dto/roleDto';
import { Role, RoleDocument } from './model/role.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(body: RoleDto) {
    const existingRole = await this.roleModel.findOne({
      keyword: body.keyword,
    });
    if (existingRole) {
      throw new InternalServerErrorException('El rol ya existe');
    }

    const newRole = new this.roleModel(body);
    await newRole.save();
    return {
      _id: newRole._id.toString(),
      name: newRole.name,
      keyword: newRole.keyword,
      description: newRole.description,
    };
  }

  async getAll(
    search: string = '',
    page: number = 1,
    limit: number = 10,
    all: boolean = false,
  ): Promise<
    | {
        data: RoleDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | RoleDocument[]
  > {
    let response = null;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { keyword: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    if (all) {
      const roles = await this.roleModel.find(query).exec();
      response = roles.map((role) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: roleId } = role;
        const result = role.toJSON();
        return {
          ...result,
          _id: roleId.toString(),
        };
      });
    } else {
      const roles = await this.roleModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.roleModel.countDocuments(query);

      response = {
        data: roles,
        total,
        page,
        limit,
      };
    }
    return response;
  }

  async getRoleByKeyword(keyword: string) {
    const role = await this.roleModel.findOne({ keyword });
    if (!role) {
      throw new Error('El rol no existe');
    }
    return role;
  }

  async update(id: string, body: RoleDto) {
    const role = await this.roleModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!role) {
      throw new Error('El rol no existe');
    }
    return role;
  }

  async delete(id: string) {
    const role = await this.roleModel.findByIdAndDelete(id);
    if (!role) {
      throw new Error('El rol no existe');
    }
    return role;
  }

  async formatResponse(
    roles: RoleDocument | RoleDocument[],
  ): Promise<RoleDocument | RoleDocument[]> {
    let response = null;
    if (Array.isArray(roles)) {
      response = roles.map((role) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: roleId } = role;
        const result = role.toJSON();
        return {
          ...result,
          _id: roleId.toString(),
        };
      });
    } else {
      const result = roles.toJSON();
      const { _id: roleId } = roles;
      response = {
        ...result,
        _id: roleId.toString(),
      };
    }
    return response;
  }
}
