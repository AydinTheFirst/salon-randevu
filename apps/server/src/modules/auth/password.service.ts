import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';
import crypto from 'node:crypto';

import { PrismaService } from '~/database';

import { ForgotPasswordDto, ResetPasswordDto } from './password.dto';

@Injectable()
export class PasswordService {
  tokens = new Map<string, string>();

  constructor(private prisma: PrismaService) {}

  async forgotPassword({ query }: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: query }, { phone: query }],
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (this.tokens.has(user.id)) {
      throw new BadRequestException(
        'A password reset request is already in progress for this user',
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    this.tokens.set(user.id, token);
    setTimeout(() => {
      this.tokens.delete(user.id);
    }, 300 * 1000);

    // Here you would typically send the token to the user's email
    // For this example, we will just return it
    return { token };
  }

  async resetPassword({ password, token }: ResetPasswordDto) {
    const userId = Array.from(this.tokens.keys()).find((key) => this.tokens.get(key) === token);

    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await argon.hash(password);

    await this.prisma.user.update({
      data: { password: hashedPassword },
      where: { id: userId },
    });

    // Remove the token after successful password reset
    this.tokens.delete(userId);

    return { message: 'Password reset successfully' };
  }
}
