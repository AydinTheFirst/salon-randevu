import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import argon from 'argon2';

import { PrismaService } from '~/database';

import { UpdatePasswordDto, UpdateProfileDto, UpdateUserDto } from './account.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const { newPassword, oldPassword } = updatePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await argon.verify(user.password, oldPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await argon.hash(newPassword);

    const updatedUser = await this.prisma.user.update({
      data: { password: hashedNewPassword },
      where: { id: userId },
    });

    return updatedUser;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { avatar, bio, displayName } = updateProfileDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedProfile = await this.prisma.profile.update({
      data: {
        avatar,
        bio,
        displayName,
      },
      where: { userId },
    });

    return updatedProfile;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { email, phone } = updateUserDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if email already exists
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email already in use');
      }
    }

    // check if phone already exists
    if (phone) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Phone number already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      data: {
        email,
        phone,
      },
      where: { id: userId },
    });

    return updatedUser;
  }
}
