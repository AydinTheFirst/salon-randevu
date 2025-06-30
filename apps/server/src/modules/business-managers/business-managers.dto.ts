import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateBusinessManagerDto {
  @IsUUID()
  businessId: string;

  @IsUUID()
  userId: string;
}

export class QueryBusinessManagersDto extends BaseQueryDto {
  @IsOptional()
  @IsUUID()
  businessId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class UpdateBusinessManagerDto extends PartialType(CreateBusinessManagerDto) {}
