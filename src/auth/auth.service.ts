import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import {
  Injectable,
  HttpService,
  GoneException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { User, UserDB } from '../user/user.interface';
import { ILogin } from './interfaces/login.interface';
import { IJwtPayload } from './interfaces/jwt.interface';
import { ConfigService } from '../shared/config.service';
import { IMessage } from './interfaces/message.interface';
import { IRefresh } from './interfaces/refresh.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private userService: UserService,
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

  async register(createUserDto: CreateUserDto): Promise<IMessage> {
    const user = await this.userService.create(createUserDto, false);

    await this.sendConfirmationEmail(user.email, user.confirmationCode);

    return { message: 'The confirmation code was sent' };
  }

  async confirmRegistration(email: string, code: string): Promise<ILogin> {
    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('No user exists with such email');
    }

    if (user.confirmed) {
      throw new GoneException('User with such email is already confirmed');
    }

    if (user.confirmationCode !== code) {
      throw new ForbiddenException('Wrong confirmation code');
    }

    await this.userService.confirm(user.id);

    return this.login(user);
  }

  async resendConfirmationCode(email: string): Promise<IMessage> {
    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('No user exists with such email');
    }

    if (user.confirmed) {
      throw new GoneException('User with such email is already confirmed');
    }

    return this.sendNewConfirmationCode(user.id, email);
  }

  async forgotPassword(email: string): Promise<IMessage> {
    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('No user exists with such email');
    }

    if (!user.confirmed) {
      throw new ForbiddenException("User isn't confirmed");
    }

    return this.sendNewConfirmationCode(user.id, email);
  }

  async resetPassword(email: string, password: string, code: string): Promise<IMessage> {
    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('No user exists with such email');
    }

    if (!user.confirmationCode) {
      throw new ConflictException("The forgot password process wasn't initialized");
    }

    if (user.confirmationCode !== code) {
      throw new ForbiddenException('Wrong confirmation code');
    }

    await this.userService.resetPassword(user.id, password);

    return { message: 'Password updated' };
  }

  async validate(email: string, password: string): Promise<UserDB> {
    const user = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('No user exists with such email');
    }

    if (!user.confirmed) {
      throw new ForbiddenException("User isn't confirmed");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Incorrect password');
    }

    return user;
  }

  async sendNewConfirmationCode(userId, email): Promise<IMessage> {
    const confirmationCode = this.userService.generateConfirmationCode();

    await Promise.all([
      this.sendConfirmationEmail(email, confirmationCode),
      this.userService.changeConfirmationCode(userId, confirmationCode),
    ]);

    return { message: 'The new confirmation code was sent' };
  }

  async sendConfirmationEmail(email, code): Promise<void> {
    const gmailUser = this.configService.get('GMAIL_USER');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: this.configService.get('GMAIL_PASSWORD'),
      },
    });

    await transporter.sendMail({
      from: `"CubeLife" <${gmailUser}>`,
      to: email,
      subject: 'CubeLife',
      html: `<h3>Welcome to CubeLife!</h3>Your confirmation code: <b>${code}</b>`,
    });
  }

  login(user: UserDB): ILogin {
    const payload: IJwtPayload = { username: user.username, sub: user.id };

    return {
      accessToken: jwt.sign(payload, this.configService.get('ACCESS_SECRET'), { expiresIn: '1h' }),
      refreshToken: jwt.sign(payload, this.configService.get('REFRESH_SECRET'), {
        expiresIn: '30d',
      }),
    };
  }

  refreshToken(refreshToken: string): IRefresh {
    try {
      const { username, sub } = jwt.verify(
        refreshToken,
        this.configService.get('REFRESH_SECRET'),
      ) as IJwtPayload;

      return {
        accessToken: jwt.sign({ username, sub }, this.configService.get('ACCESS_SECRET'), {
          expiresIn: '1h',
        }),
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
