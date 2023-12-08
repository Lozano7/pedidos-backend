import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  //obtener todos los usuarios
  @Get('all')
  async getAll() {
    const users = await this.userService.getAll();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toJSON();
      return result;
    });
  }

  //obtener un usuario por email
  @Get(':email')
  async findOneById(@Param('email') email: string): Promise<any> {
    const resultado = await this.userService.findByEmail(email);
    console.log('resultado', resultado._id.toString());
    return resultado;
  }
}
