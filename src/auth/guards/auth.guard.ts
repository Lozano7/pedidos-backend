import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY } from 'src/constants/key-decorator';
import { UserService } from 'src/users/users.service';
import { useToken } from 'src/utils/use.token';
import { IUseToken } from '../interfaces/authTokenResult.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();

    const tokenWithBearer = req.headers['authorization'];
    const token = tokenWithBearer?.split(' ')[1];

    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Token inválido');
    }

    const manageToken: IUseToken | string = useToken(token);
    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }

    if (manageToken.isExpired) {
      throw new UnauthorizedException('Token expirado');
    }

    const { sub } = manageToken;

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    req.idUser = user._id;
    req.roles = user.roles;

    return true;
  }
}
