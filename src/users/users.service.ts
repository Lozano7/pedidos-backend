// user.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signUpDto';
import { InvalidPasswordException } from 'src/utils/errors';
import { EditUserDto } from './dto/editUserDto';
import { User, UserDocument } from './model/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register({
    email,
    password,
    name,
    lastName,
    roles,
    identification,
    restaurantId,
  }: SignUpDto) {
    // Verifica si el usuario ya existe
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }
    // Valida la contraseña
    if (!this.validatePassword(password)) {
      throw new InvalidPasswordException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea y guarda el nuevo usuario en la base de datos utilizando el servicio de usuario
    const newUser = await this.create({
      email,
      password: hashedPassword,
      name,
      lastName,
      roles,
      restaurantId,
      identification,
    });

    return this.generateResponse(newUser); // Devuelve solo las propiedades deseadas
  }

  async create(body: SignUpDto) {
    const newUser = new this.userModel(body);
    return newUser.save();
  }

  async getAll(
    search: string = '',
    page: number = 1,
    limit: number = 10,
    all: boolean = false,
  ): Promise<
    | {
        data: UserDocument[];
        total: number;
        page: number;
        limit: number;
      }
    | UserDocument[]
  > {
    let response;
    const query = search
      ? {
          identification: { $regex: search, $options: 'i' },
        }
      : {};
    if (all) {
      const users = await this.userModel.find(query).exec();
      response = users.map((pedido) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id: pedidoId } = pedido;
        const result = pedido.toJSON();
        return {
          ...result,
          _id: pedidoId.toString(),
        };
      });
    } else {
      const skip = (Number(page) - 1) * limit;
      const data = await this.userModel
        .find({
          ...query,
        })
        .limit(limit)
        .skip(skip);
      const total = await this.userModel.countDocuments(query);

      response = { data, total, page, limit };
    }
    return response;
  }

  async update(id, body: EditUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      {
        identification: id,
      },
      body,
      {
        new: true,
      },
    );
    if (!user) {
      throw new Error('El usuario no existe');
    }
    return user;
  }

  async delete(identificacion: string) {
    const user = await this.userModel.findOneAndDelete({
      identification: identificacion,
    });
    if (!user) {
      throw new Error('El usuario no existe');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async findByIdentification(
    identification: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel
      .findOne({ identification })
      .select('-password')
      .exec();
    if (!user) {
      throw new Error('El usuario no existe');
    }
    return user;
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

  // funcion que retorna los un array de los ultimos 5 usuarios creados
  async getLastCreatedUsers(num: number = 5) {
    const users = await this.userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(num)
      .exec();
    return this.formatResponse(users);
  }

  public async generateResponse(user: any) {
    return {
      email: user.email,
      roles: user.roles,
      fullName: `${user.name} ${user.lastName}`,
      name: user.name,
      lastName: user.lastName,
      restaurantId: user.restaurantId,
      identification: user.identification,
    };
  }

  private validatePassword(password: string): boolean {
    // Implementa lógica de validación según tus criterios
    // Aquí se requieren al menos 8 caracteres, 1 letra mayúscula, 1 número y 1 carácter especial
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}
