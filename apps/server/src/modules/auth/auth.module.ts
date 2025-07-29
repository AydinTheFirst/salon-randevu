import { Module } from '@nestjs/common';

import { TokenService } from '../token';
import { UsersService } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, UsersService, PasswordService],
})
export class AuthModule {}
