import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsUUID } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateProfileDto {
  @IsString()
  avatarUrl: string;

  @IsString()
  bio: string;

  @IsString()
  displayName: string;

  @IsUUID()
  userId: string;
}

export class QueryProfilesDto extends BaseQueryDto {}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
