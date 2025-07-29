import { Body, Controller, Patch, UseGuards } from '@nestjs/common';

import { GetUser } from '~/common/decorators';
import { AuthGuard } from '~/common/guards';

import { UpdatePasswordDto, UpdateProfileDto, UpdateUserDto } from './account.dto';
import { AccountService } from './account.service';

@Controller('account')
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch('password')
  updatePassword(@GetUser('id') userId: string, @Body() body: UpdatePasswordDto) {
    return this.accountService.updatePassword(userId, body);
  }

  @Patch('profile')
  updateProfile(@GetUser('id') userId: string, @Body() body: UpdateProfileDto) {
    return this.accountService.updateProfile(userId, body);
  }

  @Patch()
  updateUser(@GetUser('id') userId: string, @Body() body: UpdateUserDto) {
    return this.accountService.updateUser(userId, body);
  }
}
