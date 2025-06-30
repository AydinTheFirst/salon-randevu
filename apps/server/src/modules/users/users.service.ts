import { Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';

import { PrismaService } from '~/database';

import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new NotFoundException('User with this email or username already exists');
    }

    createUserDto.password = await argon.hash(createUserDto.password);
    const { displayName, ...rest } = createUserDto;

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        profile: {
          create: {
            displayName,
          },
        },
      },
    });

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      include: { profile: true },
      omit: { password: true },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await argon.hash(updateUserDto.password);
    }

    const user = await this.prisma.user.update({
      data: updateUserDto,
      where: {
        id: id,
      },
    });

    return user;
  }
}
