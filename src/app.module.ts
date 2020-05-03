import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    UserModule,
    DynamooseModule.forRoot({
      aws: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      local: process.env.NODE_ENV !== 'prod',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
