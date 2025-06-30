import { Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';

import { BaseService } from '~/common/services/base.service';
import { PrismaService, User } from '~/database';

import { CreateUserDto, QueryUsersDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private prisma: PrismaService) {
    super(prisma.user);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, phone } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new NotFoundException('Bu email veya telefon numarası zaten kayıtlı');
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

  async findAll(query: QueryUsersDto) {
    const users = await this.queryAll(query, ['email', 'phone']);
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      include: { profile: true },
      omit: { password: true },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
