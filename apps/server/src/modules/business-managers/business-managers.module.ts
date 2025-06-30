import { Module } from '@nestjs/common';

import { BusinessManagersController } from './business-managers.controller';
import { BusinessManagersService } from './business-managers.service';

@Module({
  controllers: [BusinessManagersController],
  providers: [BusinessManagersService],
})
export class BusinessManagersModule {}
