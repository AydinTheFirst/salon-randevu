import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import {
  CreateBusinessManagerDto,
  QueryBusinessManagersDto,
  UpdateBusinessManagerDto,
} from './business-managers.dto';
import { BusinessManagersService } from './business-managers.service';

@Controller('managers')
export class BusinessManagersController {
  constructor(private readonly service: BusinessManagersService) {}

  @Post()
  create(@Body() dto: CreateBusinessManagerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryBusinessManagersDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateBusinessManagerDto) {
    return this.service.update(id, dto);
  }
}
