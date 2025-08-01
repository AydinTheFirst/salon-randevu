import { Module } from '@nestjs/common';

import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
})
export class BusinessesModule {}
