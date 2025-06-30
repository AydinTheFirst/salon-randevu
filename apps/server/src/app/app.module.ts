import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';

import { multerConfig, serveStaticConfig, throttlerConfig } from '~/config';
import { PrismaModule } from '~/database';
import modules from '~/modules';

@Module({
  imports: [
    ...modules,
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot(throttlerConfig),
    ServeStaticModule.forRoot(serveStaticConfig),
    MulterModule.register(multerConfig),
  ],
})
export class AppModule {}
