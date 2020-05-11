import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  HttpService,
  GoneException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { User, UserDB } from '../user/user.interface';
import { ILogin } from './interfaces/login.interface';
import { IJwtPayload } from './interfaces/jwt.interface';
import { ConfigService } from '../shared/config.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { IRegistration } from './interfaces/registration.interface';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerWca(accessToken: string): Promise<User> {
    const response = await this.httpService
      .get(`${this.configService.get('WCA_BASE_URL')}/api/v0/me`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    const wcaUser = response.data.me;

    return this.userService.create({
      username: wcaUser.name,
      email: wcaUser.email,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<IRegistration> {
    const user = await this.userService.create(createUserDto, false);

    const code = user.confirmationCode;

    //todo send code to email

    return { message: 'The confirmation code was sent' };
  }

  async confirmRegistration(email: string, code: string) {
    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('No user exists with such email');
    }

    if (!user.confirmationCode) {
      throw new GoneException('User with such email is already confirmed');
    }

    if (user.confirmationCode !== code) {
      throw new ForbiddenException('Wrong confirmation code');
    }

    await this.userService.confirm(user.id);

    return this.login(user);
  }

  async validate(email: string, password: string): Promise<UserDB> {
    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('No user exists with such email');
    }

    if (user.confirmationCode) {
      throw new ForbiddenException("User isn't confirmed");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  login(user: UserDB): ILogin {
    const payload: IJwtPayload = { username: user.username, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: '', //todo
    };
  }
}
