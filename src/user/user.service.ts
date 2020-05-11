import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Injectable, ConflictException } from '@nestjs/common';

import { User, UserDB, UserKey } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private userModel: Model<UserDB, UserKey>,
  ) {}

  async create(user: User, confirmed = true) {
    const sameUser = await this.find(user.email);

    if (sameUser) {
      if (confirmed) return sameUser;

      throw new ConflictException('User with such email already exists');
    }

    const newUser: UserDB = {
      confirmed,
      id: uuid(),
      ...user,
    };

    if (!confirmed) {
      const randomSixDigitCode = (Math.random() * 10e6).toFixed();
      newUser.confirmationCode = randomSixDigitCode;
    }

    if (newUser.password) {
      newUser.password = await bcrypt.hash(newUser.password, 10);
    }

    return this.userModel.create(newUser);
  }

  async find(email: string) {
    const [user] = await this.userModel
      .query('email')
      .eq(email.toLowerCase())
      .using('email-index')
      .limit(1)
      .exec();

    return user;
  }

  async confirm(id: string) {
    return this.userModel.update(
      { id },
      { $REMOVE: { confirmationCode: null }, confirmed: true },
    );
  }
}
