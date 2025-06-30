import { PaymentStatus } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

import { BaseQueryDto } from '~/common/dto';

export class CreatePaymentDto {
  @IsUUID()
  appointmentId: string;

  @IsString()
  cardHolder: string;

  @IsString()
  cardLast4: string;

  @IsObject()
  meta: any;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}

// query-payments.dto.ts
export class QueryPaymentsDto extends BaseQueryDto {}

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  cardHolder?: string;

  @IsOptional()
  @IsString()
  cardLast4?: string;

  @IsObject()
  @IsOptional()
  meta?: any;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}
