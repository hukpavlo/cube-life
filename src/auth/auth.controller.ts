import { Controller, UseGuards, Get } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserDB } from '../user/user.interface';
import { WcaAuthGuard } from './wca-auth.guard';
import { AuthUser } from './auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('wca')
  @UseGuards(WcaAuthGuard)
  wcaAuth() {}

  @Get('wca/callback')
  @UseGuards(WcaAuthGuard)
  wcaAuthCallback(@AuthUser() user: UserDB) {
    return this.authService.login(user);
  }
}
