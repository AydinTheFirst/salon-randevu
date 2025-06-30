import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment } from '@prisma/client';

import { BaseService } from '~/common/services/base.service';
import { PrismaService } from '~/database';

import {
  CreateAppointmentDto,
  QueryAppointmentsDto,
  UpdateAppointmentDto,
} from './appointments.dto';

@Injectable()
export class AppointmentsService extends BaseService<Appointment> {
  constructor(private prisma: PrismaService) {
    super(prisma.appointment);
  }

  create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        address: dto.address,
        appointmentAt: dto.appointmentAt,
        business: { connect: { id: dto.businessId } },
        fullName: dto.fullName,
        phone: dto.phone,
        services: dto.services ? { connect: dto.services.map((id) => ({ id })) } : undefined,
        user: { connect: { id: dto.userId } },
      },
    });
  }

  async findAll(query: QueryAppointmentsDto) {
    return await this.queryAll(query, ['fullName', 'phone', 'address']);
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
    return appointment;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.appointment.delete({ where: { id } });
    return { success: true };
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    await this.findOne(id);

    const data: any = {
      address: dto.address,
      appointmentAt: dto.appointmentAt,
      fullName: dto.fullName,
      phone: dto.phone,
    };

    if (dto.userId) {
      data.user = { connect: { id: dto.userId } };
    }

    if (dto.businessId) {
      data.business = { connect: { id: dto.businessId } };
    }

    if (dto.services) {
      data.services = { set: dto.services.map((id) => ({ id })) };
    }

    return await this.prisma.appointment.update({
      data,
      where: { id },
    });
  }
}
