import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessManager } from '@prisma/client';

import { BaseService } from '~/common/services/base.service';
import { PrismaService } from '~/database';

import {
  CreateBusinessManagerDto,
  QueryBusinessManagersDto,
  UpdateBusinessManagerDto,
} from './business-managers.dto';

@Injectable()
export class BusinessManagersService extends BaseService<BusinessManager> {
  constructor(private prisma: PrismaService) {
    super(prisma.businessManager);
  }

  async create(dto: CreateBusinessManagerDto) {
    return this.prisma.businessManager.create({
      data: {
        business: { connect: { id: dto.businessId } },
        user: { connect: { id: dto.userId } },
      },
    });
  }

  async findAll(query: QueryBusinessManagersDto) {
    const where: any = {};
    if (query.userId) where.userId = query.userId;
    if (query.businessId) where.businessId = query.businessId;

    return this.queryAll(query, [], where);
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

  async update(id: string, dto: UpdateBusinessManagerDto) {
    await this.findOne(id);

    const data: any = {};

    if (dto.userId) data.user = { connect: { id: dto.userId } };
    if (dto.businessId) data.business = { connect: { id: dto.businessId } };

    return this.prisma.businessManager.update({
      data,
      where: { id },
    });
  }
}
