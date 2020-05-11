import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module, HttpModule } from '@nestjs/common';

import { WcaStrategy } from './wca.strategy';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { ConfigService } from '../shared/config.service';

@Module({
  imports: [
    UserModule,
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => ({
        signOptions: { expiresIn: '1h' },
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [AuthService, WcaStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
