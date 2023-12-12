import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SignUpDto } from './dto/signUpDto';
import { UserService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  //obtener todos los usuarios
  @Roles('ADMIN')
  @Post()
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

    return {
      data: await this.userService.formatResponse(users.data),
      total: users.total,
      page: users.page,
      limit: users.limit,
    };
  }
  @Roles('ADMIN')
  @Patch(':id')
  async update(@Query('id') id: string, @Body() body: SignUpDto) {
    return this.userService.update(id, body);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Query('id') id: string) {
    return this.userService.delete(id);
  }
}
