import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';

import { User, UserKey } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  findAll() {
    return ['name', 'kek'];
  }

  create() {
    return this.userModel.create({ email: 'asds', name: 'Pavlos', id: 'sdfsdfsdasdasss' });
  }

  update() {
    return null;
  }
}
