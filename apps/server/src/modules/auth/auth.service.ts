import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';

import { PrismaService } from '~/database';

import { TokenService } from '../token';
import { UsersService } from '../users';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private usersService: UsersService,
  ) {}

  async getMe(userId: string) {
    return this.usersService.findOne(userId);
  }

  async login(body: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.username }],
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await argon.verify(user.password, body.password);
    if (!isValid) throw new BadRequestException('Invalid password or username');

    const token = await this.tokenService.create(user.id);

    return {
      ...user,
      token: token.token,
    };
  }

  async register(body: RegisterDto) {
    const user = await this.usersService.create(body);
    return user;
  }
}
