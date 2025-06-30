import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateUserDto {
  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsPhoneNumber('TR')
  phone: string;
}

export class QueryUsersDto extends BaseQueryDto {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
