import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

import { UserModel } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
  imports: [DynamooseModule.forFeature([UserModel])],
})
export class UserModule {}
