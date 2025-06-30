import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { PrismaService } from '~/database';

@Injectable()
export class BusinessAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (!user || !user.id) throw new ForbiddenException('Not authenticated');

    const businessId = this.extractBusinessId(req);

    const manager = await this.prisma.businessManager.findFirst({
      where: {
        businessId,
        userId: user.id,
      },
    });

    if (!manager) {
      throw new ForbiddenException("You don't manage this business");
    }

    return true;
  }

  private extractBusinessId(req: Request): string {
    if (req.params.businessId) return req.params.businessId;
    if (req.params.id) return req.params.id;
    if (req.body?.businessId) return req.body.businessId;
    throw new ForbiddenException('No businessId provided');
  }
}
