import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';

@Injectable()
export class WcaStrategy extends PassportStrategy(Strategy, 'wca') {
  constructor(configService: ConfigService, private logger: LoggerService, private authService: AuthService) {
    super({
      authorizationURL: `${configService.get('WCA_BASE_URL')}/oauth/authorize`,
      tokenURL: `${configService.get('WCA_BASE_URL')}/oauth/token`,
      clientID: configService.get('WCA_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('WCA_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('WCA_OAUTH_CALLBACK_URL'),
      scope: ['public', 'email'],
      skipUserProfile: true,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: undefined, done: VerifyCallback) {
    try {
      const wcaUser = await this.authService.registerWca(accessToken);

      done(null, wcaUser);
    } catch (err) {
      this.logger.error(err.message, err);

      done(new UnauthorizedException("Cann't get WCA profile"));
    }
  }
}
