import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Injectable, ConflictException } from '@nestjs/common';

import { FIVE_MINUTES } from './constants/time';
import { User, UserDB, UserKey } from './user.interface';
import { MAX_ATTEMPTS_BALANCE } from './constants/attempts-balance';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private userModel: Model<UserDB, UserKey>,
  ) {}

  async create(user: User, oauth = true) {
    const sameUser = await this.find(user.email);

    if (sameUser) {
      if (oauth) return sameUser;

      throw new ConflictException('User with such email already exists');
    }

    const newUser: UserDB = {
      id: uuid(),
      confirmed: oauth,
      ...user,
    };

    if (!oauth) {
      newUser.confirmationCode = this.generateConfirmationCode();
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
    return this.userModel.update({ id }, { $REMOVE: { confirmationCode: null }, confirmed: true });
  }

  async changeConfirmationCode(id: string, code: UserDB['confirmationCode']) {
    return this.userModel.update({ id }, { confirmationCode: code });
  }

  async resetPassword(id: string, password: string) {
    const newPassword = await bcrypt.hash(password, 10);

    return this.userModel.update({ id }, { password: newPassword });
  }

  generateConfirmationCode() {
    return {
      attemptsBalance: MAX_ATTEMPTS_BALANCE,
      expiresAt: Math.floor((Date.now() + FIVE_MINUTES) / 1000),
      value: (1e5 + Math.random() * (9e5 - 1)).toFixed(),
    };
  }
}
