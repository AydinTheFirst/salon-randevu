import { PaymentStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
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
  meta: JsonValue;

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
  meta?: JsonValue;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}
