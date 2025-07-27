import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { GetUser, Roles } from '~/common/decorators';
import { AdminGuard } from '~/common/guards';
import { AuthGuard } from '~/common/guards/auth.guard';
import { BusinessAccessGuard } from '~/common/guards/business-access.guard';
import { RolesGuard } from '~/common/guards/roles.guard';

import { CreateBusinessDto, QueryBusinessesDto, UpdateBusinessDto } from './businesses.dto';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly service: BusinessesService) {}

  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(@Body() dto: CreateBusinessDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBusinessesDto) {
    return this.service.findAll(query);
  }

  @Get('user')
  @Roles(UserRole.MANAGER)
  @UseGuards(AuthGuard, RolesGuard)
  findByUserId(@Query() query: QueryBusinessesDto, @GetUser('id') userId: string) {
    return this.service.findByUserId(query, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, BusinessAccessGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, BusinessAccessGuard)
  update(@Param('id') id: string, @Body() dto: UpdateBusinessDto) {
    return this.service.update(id, dto);
  }
}
