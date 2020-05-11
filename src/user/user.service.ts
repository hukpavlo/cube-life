import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';

import { User, UserDB, UserKey } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private userModel: Model<UserDB, UserKey>,
  ) {}

  async create(user: User) {
    const [sameUser] = await this.userModel
      .query('email')
      .eq(user.email)
      .using('email-index')
      .limit(1)
      .exec();

    return sameUser ? sameUser : this.userModel.create(user);
  }
}
