import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@prisma/client';

import { BaseService } from '~/common/services/base.service';
import { PrismaService } from '~/database';

import { CreateServiceDto, QueryServicesDto, UpdateServiceDto } from './services.dto';

@Injectable()
export class ServicesService extends BaseService<Service> {
  constructor(private prisma: PrismaService) {
    super(prisma.service);
  }

  async create(dto: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({
      data: {
        business: { connect: { id: dto.businessId } },
        name: dto.name,
        price: dto.price,
      },
    });
  }

  findAll(query: QueryServicesDto) {
    return this.queryAll(query, ['name']);
  }

  async findOne(id: string): Promise<Service> {
    const item = await this.prisma.service.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Service with id ${id} not found`);
    return item;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.findOne(id);
    await this.prisma.service.delete({ where: { id } });
    return { success: true };
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    await this.findOne(id);

    const data: any = {
      name: dto.name,
      price: dto.price,
    };

    if (dto.businessId) data.business = { connect: { id: dto.businessId } };

    return this.prisma.service.update({
      data,
      where: { id },
    });
  }
}
