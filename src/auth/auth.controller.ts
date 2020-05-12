import { Controller, UseGuards, Get, Post, Body, Put } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserDB } from '../user/user.interface';
import { WcaAuthGuard } from './wca-auth.guard';
import { AuthUser } from './auth-user.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';

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

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    //todo validate body
    return this.authService.register(createUserDto);
  }

  @Put('register')
  async confirmRegistration(
    //todo validate body
    @Body('email') email: string,
    @Body('confirmationCode') code: string,
  ) {
    return this.authService.confirmRegistration(email, code);
  }

  @Put('code')
  async resendCode(@Body('email') email: string) {
    //todo validate body
    return this.authService.resendConfirmationCode(email);
  }

  @Post('password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Put('password')
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') password: string,
    @Body('confirmationCode') code: string,
  ) {
    //todo validate body
    return this.authService.resetPassword(email, password, code);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@AuthUser() user: UserDB) {
    return this.authService.login(user);
  }

  @Put('token')
  async refreshToken() {
    //todo
  }
}
