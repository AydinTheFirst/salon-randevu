import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import express from 'express';

import { AppModule } from '~/app';
import { LoggingInterceptor } from '~/common/interceptors';
import { CustomValidationPipe } from '~/common/pipes';
import { swagger } from '~/config';

const PORT = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix('api');

  app.use(express.urlencoded({ extended: true }));

  await swagger(app);

  app.useGlobalPipes(new CustomValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(PORT);

  Logger.debug(`Server is running on http://localhost:${PORT}`, 'Bootstrap');
}

bootstrap();
