import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, IsNumberString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsNumberString()
  @Length(6, 6, { message: 'confirmationCode must be equal to 6 characters' })
  @ApiProperty()
  readonly confirmationCode: string;
}
