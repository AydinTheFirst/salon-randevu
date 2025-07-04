import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BusinessManager, Prisma } from '@prisma/client';

import { BaseService } from '~/common/services/base.service';
import { PrismaService } from '~/database';
import { cleanObject } from '~/lib/utils';

import { CreateManagerDto, QueryManagersDto, UpdateManagerDto } from './managers.dto';

@Injectable()
export class ManagersService extends BaseService<BusinessManager> {
  constructor(private prisma: PrismaService) {
    super(prisma.businessManager);
  }

  async create(dto: CreateManagerDto) {
    const isExists = await this.prisma.businessManager.findFirst({
      where: {
        businessId: dto.businessId,
        userId: dto.userId,
      },
    });

    if (isExists) {
      throw new BadRequestException(
        `BusinessManager with businessId ${dto.businessId} and userId ${dto.userId} already exists`,
      );
    }

    const manager = await this.prisma.businessManager.create({
      data: {
        business: { connect: { id: dto.businessId } },
        user: { connect: { id: dto.userId } },
      },
    });

    return manager;
  }

  async findAll(query: QueryManagersDto) {
    const { businessId, userId, ...baseQuery } = query;

    const where: Prisma.BusinessManagerWhereInput = cleanObject({
      businessId,
      userId,
    });

    return this.queryAll(baseQuery, [], where);
  }

  async findOne(id: string) {
    const item = await this.prisma.businessManager.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`BusinessManager ${id} not found`);
    return item;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.businessManager.delete({ where: { id } });

    return { success: true };
  }

  async update(id: string, dto: UpdateManagerDto) {
    await this.findOne(id);

    const data: Prisma.BusinessManagerUpdateInput = {};

    if (dto.userId) data.user = { connect: { id: dto.userId } };
    if (dto.businessId) data.business = { connect: { id: dto.businessId } };

    return this.prisma.businessManager.update({
      data,
      where: { id },
    });
  }
}
