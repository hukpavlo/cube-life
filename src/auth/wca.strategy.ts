import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Injectable, UnauthorizedException, HttpService } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { RegistrationType } from '../user/constants';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';

@Injectable()
export class WcaStrategy extends PassportStrategy(Strategy, 'wca') {
  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
    private userService: UserService,
    private httpService: HttpService,
  ) {
    super({
      authorizationURL: `${configService.get('WCA_BASE_URL')}/oauth/authorize`,
      tokenURL: `${configService.get('WCA_BASE_URL')}/oauth/token`,
      clientID: configService.get('WCA_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('WCA_OAUTH_CLIENT_SECRET'),
      callbackURL: `${configService.get('URL')}/auth/wca/callback`,
      scope: ['public', 'email'],
      skipUserProfile: true,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: undefined,
    done: VerifyCallback,
  ) {
    try {
      const response = await this.httpService
        .get(`${this.configService.get('WCA_BASE_URL')}/api/v0/me`, {
          headers: { authorization: `Bearer ${accessToken}` },
        })
        .toPromise();

      const wcaProfile = response.data.me;

      const user = await this.userService.create(
        {
          email: wcaProfile.email,
          username: wcaProfile.name,
        },
        RegistrationType.WCA,
      );

      done(null, user);
    } catch (err) {
      this.logger.error(err.message, err);

      done(new UnauthorizedException("Cann't get WCA profile"));
    }
  }
}
