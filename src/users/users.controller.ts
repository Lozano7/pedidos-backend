import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EditUserDto } from './dto/editUserDto';
import { SignUpDto } from './dto/signUpDto';
import { UserService } from './users.service';

@ApiTags('users')
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
    @Query('all') all: boolean,
  ) {
    const users = await this.userService.getAll(search, page, limit, all);
    if (Array.isArray(users)) {
      return users.map((user) => this.userService.formatResponse(user));
    }

    return {
      data: await this.userService.formatResponse(users.data),
      total: users.total,
      page: users.page,
      limit: users.limit,
    };
  }

  @Roles('ADMIN')
  @Get(':id')
  async getUserByIdentification(@Param('id') id: string) {
    console.log('id: ', id);
    const user = await this.userService.findByIdentification(id);
    return this.userService.formatResponse(user);
  }

  @Roles('ADMIN')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: EditUserDto) {
    return this.userService.update(id, body);
  }

  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('controller id: ', id);
    return this.userService.delete(id);
  }
}
