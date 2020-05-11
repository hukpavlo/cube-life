import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpService } from '@nestjs/common';

import { User, UserDB } from '../user/user.interface';
import { ConfigService } from 'src/shared/config.service';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService, private httpService: HttpService, private jwtService: JwtService) {}

  async getWcaUser(accessToken: string): Promise<User> {
    const response = await this.httpService
      .get(`${this.configService.get('WCA_BASE_URL')}/api/v0/me`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    const user = response.data.me;

    return {
      username: user.name,
      email: user.email,
    };
  }

  async login(user: UserDB) {
    const payload = { username: user.username, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
