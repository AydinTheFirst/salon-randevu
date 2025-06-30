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

import { Roles } from '~/common/decorators';
import { AuthGuard } from '~/common/guards/auth.guard';
import { RolesGuard } from '~/common/guards/roles.guard';

import { CreateBusinessDto, QueryBusinessesDto, UpdateBusinessDto } from './businesses.dto';
import { BusinessesService } from './businesses.service';

@Controller('businesses')
@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class BusinessesController {
  constructor(private readonly service: BusinessesService) {}

  @Post()
  create(@Body() dto: CreateBusinessDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBusinessesDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBusinessDto) {
    return this.service.update(id, dto);
  }
}
