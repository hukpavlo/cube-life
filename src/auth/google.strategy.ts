import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

import { UserService } from '../user/user.service';
import { RegistrationType } from '../user/constants';
import { ConfigService } from '../shared/config.service';
import { LoggerService } from '../shared/logger.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private logger: LoggerService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: `${configService.get('URL')}/auth/google/callback`,
      passReqToCallback: false,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const user = await this.userService.create(
        {
          email: profile._json.email,
          username: profile._json.name,
        },
        RegistrationType.GOOGLE,
      );

      done(null, user);
    } catch (err) {
      this.logger.error(err.message, err);

      done(new UnauthorizedException("Cann't get Google profile"));
    }
  }
}
