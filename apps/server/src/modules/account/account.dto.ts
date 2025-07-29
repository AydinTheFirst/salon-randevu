import { Prisma } from '@prisma/client';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  newPassword: string;

  @IsString()
  oldPassword: string;
}

export class UpdateProfileDto implements Prisma.ProfileUpdateInput {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}

export class UpdateUserDto implements Prisma.UserUpdateInput {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('TR')
  phone?: string;
}
