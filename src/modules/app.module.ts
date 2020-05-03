import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { SharedModule } from '../shared/shared.module';
import { ConfigService } from '../shared/services/config.service';

@Module({
  imports: [
    UserModule,
    DynamooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => ({
        aws: configService.AWS_CONFIG,
        local: configService.get('NODE_ENV') !== 'production',
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
