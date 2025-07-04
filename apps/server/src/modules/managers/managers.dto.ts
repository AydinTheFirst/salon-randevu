import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateManagerDto {
  @IsUUID()
  businessId: string;

  @IsUUID()
  userId: string;
}

export class QueryManagersDto extends BaseQueryDto {
  @IsOptional()
  @IsUUID()
  businessId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class UpdateManagerDto extends PartialType(CreateManagerDto) {}
