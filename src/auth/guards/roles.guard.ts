import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorator';
import { ROLES } from 'src/constants/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();

    const { roles: rolesUser } = req;

    if (roles === undefined) {
      if (!admin) {
        return true;
      } else if (admin && rolesUser.includes(admin)) {
        return true;
      } else {
        throw new UnauthorizedException(
          'No tienes permisos para realizar esta acción',
        );
      }
    }

    const isAuth = roles.some((role) => rolesUser.includes(role));

    if (!isAuth) {
      throw new UnauthorizedException(
        'No tienes permisos para realizar esta acción',
      );
    }

    return true;
  }
}
