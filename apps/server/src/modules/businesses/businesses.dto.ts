import { PartialType } from '@nestjs/mapped-types';
import { BusinessType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateBusinessDto {
  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  district: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEnum(BusinessType)
  type: BusinessType;
}

export class QueryBusinessesDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  district?: string;

  @IsEnum(BusinessType)
  @IsOptional()
  type?: BusinessType;
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
