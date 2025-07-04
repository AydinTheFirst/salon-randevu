import { Injectable, NotFoundException } from '@nestjs/common';

import { BaseService } from '~/common/services/base.service';
import { Business, Prisma, PrismaService } from '~/database';
import { cleanObject } from '~/lib/utils';

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
    const { city, district, type, userId, ...baseQuery } = query;

    const customWhere: Prisma.BusinessWhereInput = cleanObject({
      city,
      district,
      type,
      userId,
    });

    return this.queryAll(baseQuery, ['name'], customWhere);
  }

  async findByUserId(query: QueryBusinessesDto, userId: string) {
    const { city, district, type, ...baseQuery } = query;

    const customWhere: Prisma.BusinessWhereInput = cleanObject({
      city,
      district,
      managers: {
        some: {
          userId,
        },
      },
      type,
    });

    return this.queryAll(baseQuery, ['name'], customWhere);
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
