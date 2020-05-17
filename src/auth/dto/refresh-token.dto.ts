import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  @ApiProperty()
  readonly refreshToken: string;
}
