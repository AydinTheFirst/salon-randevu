import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { CreateUserDto, UsersService } from '../users';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto } from './password.dto';
import { PasswordService } from './password.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.passwordService.forgotPassword(body);
  }

  @Get('@me')
  @UseGuards(AuthGuard)
  getMe(@GetUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Patch('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.passwordService.resetPassword(body);
  }
}
