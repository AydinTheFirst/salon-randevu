import { Injectable, NotFoundException } from '@nestjs/common';
import { Payment } from '@prisma/client';

import { BaseService } from '~/common/services/base.service';
import { PrismaService } from '~/database';

import { CreatePaymentDto, QueryPaymentsDto, UpdatePaymentDto } from './payments.dto';

@Injectable()
export class PaymentsService extends BaseService<Payment> {
  constructor(private prisma: PrismaService) {
    super(prisma.payment);
  }

  async create(createPaymentDto: CreatePaymentDto) {
    return await this.prisma.payment.create({
      data: { ...createPaymentDto },
    });
  }

  async findAll(query: QueryPaymentsDto) {
    // Örneğin meta veya status gibi alanlarda filtre ekleyebilirsin
    return await this.queryAll(query, ['cardHolder', 'status']);
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return payment;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.payment.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.findOne(id);

    return await this.prisma.payment.update({
      data: { ...updatePaymentDto },
      where: { id },
    });
  }
}
