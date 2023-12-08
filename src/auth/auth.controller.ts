// auth.controller.ts

import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { SignUpDto } from './dto/signUpDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.register(signUpDto);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    console.log('user', user);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }
}
