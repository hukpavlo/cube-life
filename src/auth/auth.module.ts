import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { ConfigService } from '../shared/config.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => ({
        signOptions: { expiresIn: '60s' },
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
