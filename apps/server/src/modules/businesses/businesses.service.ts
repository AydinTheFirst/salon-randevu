import { Injectable, NotFoundException } from '@nestjs/common';

import { BaseService } from '~/common/services/base.service';
import { Business, PrismaService } from '~/database';

import { CreateBusinessDto, QueryBusinessesDto, UpdateBusinessDto } from './businesses.dto';

@Injectable()
export class BusinessesService extends BaseService<Business> {
  constructor(private prisma: PrismaService) {
    super(prisma.business);
  }

  async create(dto: CreateBusinessDto) {
    return this.prisma.business.create({ data: dto });
  }

  async findAll(query: QueryBusinessesDto) {
    return this.queryAll(query, ['name']);
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) throw new NotFoundException(`Business with id ${id} not found`);
    return business;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.business.delete({ where: { id } });
    return { success: true };
  }

  async update(id: string, dto: UpdateBusinessDto) {
    await this.findOne(id);
    return this.prisma.business.update({ data: dto, where: { id } });
  }
}
