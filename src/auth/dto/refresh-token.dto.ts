import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  readonly refreshToken: string;
}
