import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserService } from './users.service';
import { SignUpDto } from './dto/signUpDto';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  //obtener todos los usuarios
  @Roles('ADMIN')
  @Post('register')
  async register(@Body() signUpDto: SignUpDto) {
    return this.userService.register(signUpDto);
  }

  @Roles('ADMIN')
  @Get()
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    const users = await this.userService.getAll(search, page, limit);

    console.log(users.data);

    return {
      data: await this.userService.formatResponse(users.data),
      total: users.total,
      page: users.page,
      limit: users.limit,
    };
  }
}
