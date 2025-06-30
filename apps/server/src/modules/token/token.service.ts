import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import crypto from 'crypto';

import { PrismaService } from '~/database';

@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clear() {
    const now = new Date();
    const deletedTokens = await this.prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    this.logger.debug(`Cleared ${deletedTokens.count} expired tokens at ${now.toISOString()}`);
  }

  async create(userId: string) {
    const token = await this.prisma.token.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        token: crypto.randomBytes(32).toString('hex'),
        userId,
      },
    });

    return token;
  }
}
