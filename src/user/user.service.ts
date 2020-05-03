import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  findAll() {
    return ['name', 'kek'];
  }

  create() {
    return this.userRepository.save({ language: 'sd', username: 'Pavlo Huk' });
  }

  update() {
    return null;
  }
}
