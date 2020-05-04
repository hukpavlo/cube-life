import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';

import { User, UserKey } from './user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: '1',
      username: 'john',
      password: 'changeme',
    },
    {
      id: '2',
      username: 'chris',
      password: 'secret',
    },
    {
      id: '3',
      username: 'maria',
      password: 'guess',
    },
  ];

  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
