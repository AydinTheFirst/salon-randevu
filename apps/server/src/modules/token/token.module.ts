import { Module } from '@nestjs/common';

import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  controllers: [TokenController],
  exports: [TokenService],
  providers: [TokenService],
})
export class TokenModule {}
