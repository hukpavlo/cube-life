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
      newUser.confirmationCode = this.generateConfirmationCode(); //todo add limit for 1 code
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

  async changeConfirmationCode(id: string, code: string) {
    return this.userModel.update({ id }, { confirmationCode: code });
  }

  async resetPassword(id: string, password: string) {
    const newPassword = await bcrypt.hash(password, 10);

    return this.userModel.update({ id }, { password: newPassword });
  }

  generateConfirmationCode() {
    return (Math.random() * 899999 + 100000).toFixed();
  }
}
