import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';

import { BaseService } from '~/common/services/base.service';
import { PrismaService } from '~/database';

import { CreateProfileDto, QueryProfilesDto, UpdateProfileDto } from './profiles.dto';

@Injectable()
export class ProfilesService extends BaseService<Profile> {
  constructor(private prisma: PrismaService) {
    super(prisma.profile);
  }

  async create(createProfileDto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: { ...createProfileDto },
    });

    return profile;
  }

  async findAll(query: QueryProfilesDto) {
    const profiles = await this.queryAll(query, ['displayName']);
    return profiles;
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    return profile;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.profile.delete({
      where: { id },
    });

    return { success: true };
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    await this.findOne(id);

    const updatedProfile = await this.prisma.profile.update({
      data: { ...updateProfileDto },
      where: { id },
    });

    return updatedProfile;
  }
}
