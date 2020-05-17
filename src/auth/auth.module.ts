import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module, HttpModule } from '@nestjs/common';

import { WcaStrategy } from './wca.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, HttpModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, WcaStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
