import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateServiceDto {
  @IsUUID()
  businessId: string;

  @IsNumber()
  duration: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class QueryServicesDto extends BaseQueryDto {
  @IsOptional()
  @IsUUID()
  businessId?: string;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
