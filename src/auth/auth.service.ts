// auth.service.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/users.service';
import { InvalidPasswordException } from 'src/utils/errors';
import { SignUpDto } from './dto/signUpDto';

import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(
        password.trim(),
        user.password.trim(),
      );
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user.toJSON();
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    return this.generateToken(user);
  }

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
    const existingUser = await this.usersService.findByEmailAndId(
      email,
      identification,
    );
    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Valida la contraseña
    if (!this.validatePassword(password)) {
      throw new InvalidPasswordException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea y guarda el nuevo usuario en la base de datos utilizando el servicio de usuario
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      lastName,
      roles,
      restaurantId,
      identification,
    });

    return this.generateToken(newUser); // Devuelve solo las propiedades deseadas
  }

  // Función de validación de contraseña
  private validatePassword(password: string): boolean {
    // Implementa lógica de validación según tus criterios
    // Aquí se requieren al menos 8 caracteres, 1 letra mayúscula, 1 número y 1 carácter especial
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  public signJWT(payload: jwt.JwtPayload) {
    return this.jwtService.sign(payload);
  }

  public async verifyJWT(token: string) {
    return await this.jwtService.verify(token);
  }

  public decodeJWT(token: string) {
    return this.jwtService.decode(token);
  }

  public async generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      roles: user.roles,
      identification: user.identification,
      restaurantId: user?.restaurantId || null,
      fullName: `${user.name} ${user.lastName}`,
      name: user.name,
      lastName: user.lastName,
    };
    return {
      identification: user.identification,
      email: user.email,
      roles: user.roles,
      fullName: `${user.name} ${user.lastName}`,
      name: user.name,
      lastName: user.lastName,
      restaurantId: user?.restaurantId || null,
      access_token: this.jwtService.sign(payload),
    };
  }
}
