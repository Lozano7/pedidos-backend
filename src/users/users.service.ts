// user.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/signUpDto';
import { InvalidPasswordException } from 'src/utils/errors';
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
      identification,
    });

    return this.generateResponse(newUser); // Devuelve solo las propiedades deseadas
  }

  async create(body: SignUpDto) {
    const newUser = new this.userModel(body);
    console.log('user: ', newUser);
    return newUser.save();
  }

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

  async update(id, body: SignUpDto) {
    const user = await this.userModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }
    return user;
  }

  async delete(id) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new UnauthorizedException('El usuario no existe');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
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

  public async generateResponse(user: any) {
    return {
      email: user.email,
      roles: user.roles,
      fullName: `${user.name} ${user.lastName}`,
      name: user.name,
      lastName: user.lastName,
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
