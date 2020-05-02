import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return ['name', 'kek'];
  }

  create() {
    return null;
  }

  update() {
    return null;
  }
}
