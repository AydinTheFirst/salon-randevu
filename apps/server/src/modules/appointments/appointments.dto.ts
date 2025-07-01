import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreateAppointmentDto {
  @IsString()
  address: string;

  @IsUUID()
  businessId: string;

  @IsISO8601()
  date: string;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsArray()
  @IsOptional()
  @IsUUID('all', { each: true })
  services?: string[];

  @IsUUID()
  userId: string;
}

export class QueryAppointmentsDto extends BaseQueryDto {}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
