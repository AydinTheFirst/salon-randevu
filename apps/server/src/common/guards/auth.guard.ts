import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { PrismaService } from '~/database';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing from the request header');
    }

    const tokenDoc = await this.prisma.token.findFirst({
      include: { user: true },
      where: { expiresAt: { gte: new Date() }, token },
    });

    if (!tokenDoc) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!tokenDoc.user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = tokenDoc.user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
