import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/config.service';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DynamooseModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        aws: configService.AWS_CONFIG,
        local: false,
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
