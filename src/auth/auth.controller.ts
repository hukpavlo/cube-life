import { Controller, UseGuards, Get, Post, Body, Put } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { UserDB } from '../user/user.interface';
import { WcaAuthGuard } from './wca-auth.guard';
import { AuthUser } from './auth-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('wca')
  @UseGuards(WcaAuthGuard)
  wcaAuth() {}

  @Get('wca/callback')
  @UseGuards(WcaAuthGuard)
  wcaAuthCallback(@AuthUser() user: UserDB) {
    return this.authService.generateTokens(user);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Put('register')
  confirmRegistration(@Body() registerDto: RegisterDto) {
    return this.authService.confirmRegistration(registerDto);
  }

  @Put('code')
  resendCode(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendConfirmationCode(resendCodeDto);
  }

  @Post('password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put('password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Put('token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
