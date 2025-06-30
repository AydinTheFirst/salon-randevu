import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Roles } from '~/common/decorators';
import { User, UserRole } from '~/database';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user: User = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException();
    }

    const isAllowed = this.matchRoles(roles, user.roles);

    if (!isAllowed) {
      throw new ForbiddenException("You don't have permission to access this resource");
    }

    return isAllowed;
  }

  matchRoles = (roles: UserRole[], userRoles: UserRole[]): boolean => {
    return roles.some((role) => userRoles.includes(role));
  };
}
