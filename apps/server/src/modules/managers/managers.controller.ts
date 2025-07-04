import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateManagerDto, QueryManagersDto, UpdateManagerDto } from './managers.dto';
import { ManagersService } from './managers.service';

@Controller('managers')
export class ManagersController {
  constructor(private readonly service: ManagersService) {}

  @Post()
  create(@Body() dto: CreateManagerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryManagersDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateManagerDto) {
    return this.service.update(id, dto);
  }
}
