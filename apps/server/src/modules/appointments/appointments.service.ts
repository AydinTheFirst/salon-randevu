import { Injectable, NotFoundException } from '@nestjs/common';
import { Appointment, Prisma } from '@prisma/client';

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

  async create(dto: CreateAppointmentDto) {
    const { businessId, services, userId, ...appointmentData } = dto;

    const data: Prisma.AppointmentCreateInput = {
      ...appointmentData,
      business: { connect: { id: businessId } },
      services: services ? { connect: services.map((id) => ({ id })) } : undefined,
      user: userId ? { connect: { id: userId } } : undefined,
    };

    const appointment = await this.prisma.appointment.create({
      data,
    });

    return appointment;
  }

  async findAll(query: QueryAppointmentsDto) {
    return await this.queryAll(query, ['fullName', 'phone']);
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      include: {
        business: true,
        user: { select: { email: true, id: true, phone: true, profile: true } },
      },
      where: { id },
    });
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

    const data: Prisma.AppointmentUpdateInput = {
      date: dto.date,
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
