import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigService } from '../shared/services/config.service';

@Module({
  imports: [
    UserModule,
    DynamooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        aws: configService.AWS_CONFIG,
        local: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
