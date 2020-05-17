import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendCodeDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;
}
