import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.roles || !user.roles.includes('ADMIN')) {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }

    return true;
  }
}
